export interface PublicSiteSettings {
  warrantyMonthsDefault: number;
  replacementWindowDays: number;
  quoteValidityHours: number;
  supportPhone: string;
  supportEmail: string;
  legalEntityName?: string;
  tradeName?: string;
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
  payoutApprovalLimit: number;
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
  payoutApprovalLimit: 10000,
  codEnabled: false,
  gstScheme: 'STANDARD_GST',
  standardGstRate: 18,
};
