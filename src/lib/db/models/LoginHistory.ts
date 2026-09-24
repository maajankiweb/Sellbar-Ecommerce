import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILoginHistory extends Document {
  userId?: mongoose.Types.ObjectId;
  identifierAttempted: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED' | 'LOCKED';
  failureReason?: string;
  ipAddress: string;
  userAgent?: string;
  device: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  operatingSystem: string;
  location?: string;
  isSuspicious: boolean;
  createdAt: Date;
}

const LoginHistorySchema = new Schema<ILoginHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    identifierAttempted: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'BLOCKED', 'LOCKED'],
      required: true,
      index: true,
    },
    failureReason: {
      type: String,
    },
    ipAddress: {
      type: String,
      required: true,
      index: true,
    },
    userAgent: {
      type: String,
    },
    device: {
      type: String,
      enum: ['mobile', 'desktop', 'tablet'],
      default: 'desktop',
    },
    browser: {
      type: String,
      default: 'Unknown Browser',
    },
    operatingSystem: {
      type: String,
      default: 'Unknown OS',
    },
    location: {
      type: String,
      default: 'Bihar, India',
    },
    isSuspicious: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    capped: { size: 104857600, max: 200000 }, // 100MB capped collection or indexed
  }
);

LoginHistorySchema.index({ userId: 1, createdAt: -1 });
LoginHistorySchema.index({ identifierAttempted: 1, createdAt: -1 });

export const LoginHistory: Model<ILoginHistory> =
  mongoose.models.LoginHistory ||
  mongoose.model<ILoginHistory>('LoginHistory', LoginHistorySchema);

export default LoginHistory;
