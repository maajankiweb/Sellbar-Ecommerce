import mongoose, { Schema, Document, Model } from 'mongoose';

export type SellerStatus = 'pending_approval' | 'active' | 'suspended' | 'rejected';

export interface ISeller extends Document {
  userId: mongoose.Types.ObjectId;
  storeName: string;
  slug: string;
  businessEmail: string;
  businessPhone: string;
  gstin?: string;
  panNumber?: string;
  status: SellerStatus;
  commissionRate: number; // Percentage, e.g. 5.0%
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    beneficiaryName: string;
    bankName?: string;
    verified: boolean;
  };
  warehouseAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  rating: number;
  totalSalesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const SellerSchema = new Schema<ISeller>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    storeName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    businessEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    businessPhone: {
      type: String,
      required: true,
      trim: true,
    },
    gstin: {
      type: String,
      trim: true,
      uppercase: true,
    },
    panNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['pending_approval', 'active', 'suspended', 'rejected'],
      default: 'pending_approval',
      index: true,
    },
    commissionRate: {
      type: Number,
      default: 5.0,
    },
    bankDetails: {
      accountNumber: { type: String, required: true, select: false },
      ifscCode: { type: String, required: true },
      beneficiaryName: { type: String, required: true },
      bankName: { type: String },
      verified: { type: Boolean, default: false },
    },
    warehouseAddress: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true, index: true },
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    totalSalesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Seller: Model<ISeller> =
  mongoose.models.Seller || mongoose.model<ISeller>('Seller', SellerSchema);

export default Seller;
