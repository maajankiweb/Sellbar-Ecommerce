import mongoose, { Schema, Document, Model } from 'mongoose';

export type AuthAuditEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'ACCOUNT_LOCKED'
  | 'USER_REGISTERED'
  | 'OTP_REQUESTED'
  | 'OTP_VERIFIED'
  | 'OTP_FAILED'
  | 'PASSWORD_CHANGED'
  | 'PASSWORD_RESET'
  | 'LOGOUT'
  | 'LOGOUT_ALL'
  | 'SESSION_REVOKED'
  | 'SUSPICIOUS_LOGIN_ATTEMPT';

export interface IAuthAuditLog extends Document {
  userId?: mongoose.Types.ObjectId;
  identifierAttempted: string; // phone, email, or username
  event: AuthAuditEventType;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  ipAddress: string;
  userAgent?: string;
  location?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const AuthAuditLogSchema = new Schema<IAuthAuditLog>(
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
    event: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILURE', 'WARNING'],
      required: true,
      index: true,
    },
    ipAddress: {
      type: String,
      required: true,
      index: true,
    },
    userAgent: {
      type: String,
    },
    location: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    capped: { size: 52428800, max: 100000 }, // 50MB capped collection or standard indexed collection
  }
);

// Compound index for querying events by identifier/date
AuthAuditLogSchema.index({ identifierAttempted: 1, createdAt: -1 });
AuthAuditLogSchema.index({ ipAddress: 1, createdAt: -1 });

export const AuthAuditLog: Model<IAuthAuditLog> =
  mongoose.models.AuthAuditLog ||
  mongoose.model<IAuthAuditLog>('AuthAuditLog', AuthAuditLogSchema);

export default AuthAuditLog;
