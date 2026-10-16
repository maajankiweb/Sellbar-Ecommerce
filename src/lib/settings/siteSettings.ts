import connectToDatabase from '@/lib/db/mongodb';
import { SiteSettings, ISiteSettings } from '@/lib/db/models/SiteSettings';

export interface PublicSiteSettings {
  warrantyMonthsDefault: number;
  replacementWindowDays: number;
  quoteValidityHours: number;
  supportPhone: string;
  supportEmail: string;
  legalEntityName?: string;
  gstin?: string;
  registeredAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  grievanceOfficer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
  };
  enabledCategories: string[];
  payoutModes: string[];
  codEnabled: boolean;
  gstScheme: 'STANDARD_GST' | 'MARGIN_SCHEME';
  standardGstRate: number;
}

export const DEFAULT_SITE_SETTINGS: PublicSiteSettings = {
  warrantyMonthsDefault: 6,
  replacementWindowDays: 15,
  quoteValidityHours: 72,
  supportPhone: '',
  supportEmail: 'support@sellbar.in',
  legalEntityName: '', // Hidden until confirmed by client
  gstin: '',           // Hidden until confirmed by client
  registeredAddress: {},
  grievanceOfficer: {
    email: 'grievance@sellbar.in',
  },
  socialLinks: {
    facebook: '',
    instagram: '',
    youtube: '',
    twitter: '',
    linkedin: '',
  },
  enabledCategories: ['phone'],
  payoutModes: ['upi', 'bank', 'cash'],
  codEnabled: false,
  gstScheme: 'STANDARD_GST',
  standardGstRate: 18,
};

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
        gstin: doc.gstin || undefined,
        registeredAddress: doc.registeredAddress || {},
        grievanceOfficer: doc.grievanceOfficer || DEFAULT_SITE_SETTINGS.grievanceOfficer,
        socialLinks: doc.socialLinks || DEFAULT_SITE_SETTINGS.socialLinks,
        enabledCategories: doc.enabledCategories?.length ? doc.enabledCategories : DEFAULT_SITE_SETTINGS.enabledCategories,
        payoutModes: doc.payoutModes?.length ? doc.payoutModes : DEFAULT_SITE_SETTINGS.payoutModes,
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
