import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IScreener extends Document {
  user?: mongoose.Types.ObjectId;
  title: string;
  filters: {
    brands?: string[];
    priceRange?: { min: number; max: number };
    grades?: string[];
    storageOptions?: string[];
    minWarrantyMonths?: number;
    categories?: string[];
  };
  isAlertEnabled: boolean;
  lastTriggeredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ScreenerSchema = new Schema<IScreener>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    title: { type: String, required: true },
    filters: {
      brands: [String],
      priceRange: { min: Number, max: Number },
      grades: [String],
      storageOptions: [String],
      minWarrantyMonths: Number,
      categories: [String],
    },
    isAlertEnabled: { type: Boolean, default: false },
    lastTriggeredAt: Date,
  },
  { timestamps: true }
);

export const Screener: Model<IScreener> =
  mongoose.models.Screener || mongoose.model<IScreener>('Screener', ScreenerSchema);

export default Screener;
