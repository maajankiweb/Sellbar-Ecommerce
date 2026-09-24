import mongoose, { Schema, Document, Model } from 'mongoose';

export type SecuritySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ISecurityEvent extends Document {
  userId?: mongoose.Types.ObjectId;
  eventType:
    | 'REFRESH_TOKEN_REUSE'
    | 'SUSPICIOUS_LOGIN'
    | 'IMPOSSIBLE_TRAVEL'
    | 'ACCOUNT_LOCKED'
    | 'PASSWORD_RESET_SUCCESS'
    | 'TWO_FACTOR_CHANGED'
    | 'ROLE_CHANGED'
    | 'RATE_LIMIT_EXCEEDED'
    | 'PRIVILEGE_ESCALATION_ATTEMPT';
  severity: SecuritySeverity;
  ipAddress: string;
  userAgent?: string;
  location?: string;
  metadata?: Record<string, any>;
  isResolved: boolean;
  createdAt: Date;
}

const SecurityEventSchema = new Schema<ISecurityEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
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
    isResolved: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

SecurityEventSchema.index({ userId: 1, createdAt: -1 });
SecurityEventSchema.index({ eventType: 1, severity: 1 });

export const SecurityEvent: Model<ISecurityEvent> =
  mongoose.models.SecurityEvent ||
  mongoose.model<ISecurityEvent>('SecurityEvent', SecurityEventSchema);

export default SecurityEvent;
