import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string; // SHA-256 hash of refresh token
  refreshTokenHash: string; // Compatibility alias
  familyId: string; // Token family tracking for reuse detection
  device: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  operatingSystem: string;
  deviceInfo: {
    userAgent?: string;
    browser?: string;
    os?: string;
    deviceType?: 'mobile' | 'desktop' | 'tablet';
  };
  ipAddress: string;
  approximateLocation?: string;
  isRevoked: boolean;
  revokedAt?: Date;
  expiresAt: Date;
  lastUsedAt: Date;
  lastActiveAt?: Date; // Compatibility alias
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      index: true,
    },
    refreshTokenHash: {
      type: String,
      index: true,
    },
    familyId: {
      type: String,
      required: true,
      index: true,
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
    deviceInfo: {
      userAgent: { type: String },
      browser: { type: String },
      os: { type: String },
      deviceType: {
        type: String,
        enum: ['mobile', 'desktop', 'tablet'],
        default: 'desktop',
      },
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
      index: true,
    },
    approximateLocation: {
      type: String,
      default: 'Bihar, India',
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
    revokedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index: MongoDB automatically drops expired sessions
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Pre-save hook to ensure synchronization between tokenHash and refreshTokenHash
SessionSchema.pre('save', function () {
  if (this.tokenHash && !this.refreshTokenHash) {
    this.refreshTokenHash = this.tokenHash;
  } else if (this.refreshTokenHash && !this.tokenHash) {
    this.tokenHash = this.refreshTokenHash;
  }
  if (!this.lastUsedAt && this.lastActiveAt) {
    this.lastUsedAt = this.lastActiveAt;
  } else if (this.lastUsedAt && !this.lastActiveAt) {
    this.lastActiveAt = this.lastUsedAt;
  }
});

// Compound indexes
SessionSchema.index({ userId: 1, isRevoked: 1 });
SessionSchema.index({ familyId: 1, isRevoked: 1 });

export const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);

export default Session;
