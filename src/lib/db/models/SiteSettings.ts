import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteSettings extends Document {
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
  updatedBy?: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    warrantyMonthsDefault: { type: Number, default: 6 },
    replacementWindowDays: { type: Number, default: 15 },
    quoteValidityHours: { type: Number, default: 72 },
    supportPhone: { type: String, default: '' },
    supportEmail: { type: String, default: 'support@sellbar.in' },
    legalEntityName: { type: String, default: '' }, // Never rendered publicly if empty
    gstin: { type: String, default: '' },           // Never rendered publicly if empty
    registeredAddress: {
      line1: { type: String, default: '' },
      line2: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    grievanceOfficer: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    enabledCategories: {
      type: [String],
      default: ['phone'],
    },
    payoutModes: {
      type: [String],
      default: ['upi', 'bank', 'cash'],
    },
    codEnabled: { type: Boolean, default: false },
    gstScheme: {
      type: String,
      enum: ['STANDARD_GST', 'MARGIN_SCHEME'],
      default: 'STANDARD_GST',
    },
    standardGstRate: { type: Number, default: 18 },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
