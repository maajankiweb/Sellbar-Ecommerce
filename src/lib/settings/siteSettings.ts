import connectToDatabase from '@/lib/db/mongodb';
import { SiteSettings, ISiteSettings } from '@/lib/db/models/SiteSettings';
import { PublicSiteSettings, DEFAULT_SITE_SETTINGS } from './types';

export * from './types';

let cachedSettings: PublicSiteSettings | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache

export async function getSiteSettings(): Promise<PublicSiteSettings> {
  const now = Date.now();
  if (cachedSettings && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedSettings;
  }

  try {
    await connectToDatabase();
    const doc = await SiteSettings.findOne().lean();
    if (doc) {
      cachedSettings = {
        warrantyMonthsDefault: doc.warrantyMonthsDefault ?? DEFAULT_SITE_SETTINGS.warrantyMonthsDefault,
        replacementWindowDays: doc.replacementWindowDays ?? DEFAULT_SITE_SETTINGS.replacementWindowDays,
        quoteValidityHours: doc.quoteValidityHours ?? DEFAULT_SITE_SETTINGS.quoteValidityHours,
        supportPhone: doc.supportPhone || DEFAULT_SITE_SETTINGS.supportPhone,
        supportEmail: doc.supportEmail || DEFAULT_SITE_SETTINGS.supportEmail,
        legalEntityName: doc.legalEntityName || undefined,
        tradeName: doc.tradeName || undefined,
        gstin: doc.gstin || undefined,
        registeredAddress: doc.registeredAddress || {},
        grievanceOfficer: doc.grievanceOfficer || DEFAULT_SITE_SETTINGS.grievanceOfficer,
        socialLinks: doc.socialLinks || DEFAULT_SITE_SETTINGS.socialLinks,
        enabledCategories: doc.enabledCategories?.length ? doc.enabledCategories : DEFAULT_SITE_SETTINGS.enabledCategories,
        payoutModes: doc.payoutModes?.length ? doc.payoutModes : DEFAULT_SITE_SETTINGS.payoutModes,
        payoutApprovalLimit: doc.payoutApprovalLimit ?? DEFAULT_SITE_SETTINGS.payoutApprovalLimit,
        codEnabled: Boolean(doc.codEnabled),
        gstScheme: doc.gstScheme || DEFAULT_SITE_SETTINGS.gstScheme,
        standardGstRate: doc.standardGstRate ?? DEFAULT_SITE_SETTINGS.standardGstRate,
      };
      lastFetchTime = now;
      return cachedSettings;
    }
  } catch (err) {
    console.warn('[SiteSettings] Failed to fetch settings from DB, using defaults:', err);
  }

  return DEFAULT_SITE_SETTINGS;
}

export function invalidateSiteSettingsCache(): void {
  cachedSettings = null;
  lastFetchTime = 0;
}

/**
 * Checks whether mandatory compliance and entity fields are filled before production launch.
 * Enforces Client Decision CD-07.
 */
export function isProductionGoLiveReady(settings: Partial<PublicSiteSettings>): {
  isReady: boolean;
  missingFields: string[];
} {
  const missing: string[] = [];

  if (!settings.legalEntityName?.trim()) missing.push('Legal Entity Name');
  if (!settings.tradeName?.trim()) missing.push('Trade Name');
  if (!settings.gstin?.trim()) missing.push('GSTIN');
  if (!settings.registeredAddress?.line1?.trim()) missing.push('Registered Address Line');
  if (!settings.registeredAddress?.city?.trim()) missing.push('Registered Address City');
  if (!settings.registeredAddress?.state?.trim()) missing.push('Registered Address State');
  if (!settings.registeredAddress?.pincode?.trim()) missing.push('Registered Address Pincode');
  if (!settings.supportEmail?.trim()) missing.push('Support Email');
  if (!settings.supportPhone?.trim()) missing.push('Support Phone');
  if (!settings.grievanceOfficer?.name?.trim()) missing.push('Grievance Officer Name');
  if (!settings.grievanceOfficer?.email?.trim()) missing.push('Grievance Officer Email');
  if (!settings.grievanceOfficer?.phone?.trim()) missing.push('Grievance Officer Phone');

  return {
    isReady: missing.length === 0,
    missingFields: missing,
  };
}
