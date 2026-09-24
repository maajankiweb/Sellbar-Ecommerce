import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOtpVerification extends Document {
  identifier: string; // phone or email (standardized)
  type: 'phone_verification' | 'email_verification' | 'login_2fa' | 'password_reset';
  otpHash: string;
  attempts: number;
  maxAttempts: number;
  cooldownUntil: Date;
  expiresAt: Date;
  createdAt: Date;
}

const OtpVerificationSchema = new Schema<IOtpVerification>(
  {
    identifier: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      enum: ['phone_verification', 'email_verification', 'login_2fa', 'password_reset'],
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    cooldownUntil: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 1000), // 60s cooldown
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index: MongoDB auto-removes expired records
    },
  },
  { timestamps: true }
);

// Compound index to quickly find active OTP for identifier + type
OtpVerificationSchema.index({ identifier: 1, type: 1 });

export const OtpVerification: Model<IOtpVerification> =
  mongoose.models.OtpVerification ||
  mongoose.model<IOtpVerification>('OtpVerification', OtpVerificationSchema);

export default OtpVerification;
