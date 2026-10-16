import mongoose, { Schema, Document, Model } from 'mongoose';

export type ApiKeyScope =
  | '*'
  | 'admin:full'
  | 'read:stock'
  | 'write:stock'
  | 'send:notifications'
  | 'read:notifications'
  | 'read:catalog'
  | 'manage:catalog'
  | 'manage:orders'
  | 'read:orders';

export interface IApiKey extends Document {
  name: string;
  prefix: string; // e.g., "sellbar_live_sk_1a2b"
  keyHash: string; // SHA-256 hash of the full secret key
  environment: 'live' | 'test';
  scopes: ApiKeyScope[];
  usageCount: number;
  lastUsedAt?: Date;
  revokedAt?: Date;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ApiKeySchema = new Schema<IApiKey>(
  {
    name: { type: String, required: true, trim: true },
    prefix: { type: String, required: true, index: true },
    keyHash: { type: String, required: true, unique: true, index: true },
    environment: { type: String, enum: ['live', 'test'], default: 'live' },
    scopes: { type: [String], default: ['read:catalog'] },
    usageCount: { type: Number, default: 0 },
    lastUsedAt: { type: Date },
    revokedAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

export const ApiKey: Model<IApiKey> =
  mongoose.models.ApiKey || mongoose.model<IApiKey>('ApiKey', ApiKeySchema);

export default ApiKey;
