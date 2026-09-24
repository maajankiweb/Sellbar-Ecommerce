import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPermission extends Document {
  name: string; // e.g. "products:create"
  description: string;
  category: 'products' | 'orders' | 'users' | 'sellers' | 'analytics' | 'security' | 'system';
  createdAt: Date;
}

const PermissionSchema = new Schema<IPermission>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['products', 'orders', 'users', 'sellers', 'analytics', 'security', 'system'],
      index: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Permission: Model<IPermission> =
  mongoose.models.Permission || mongoose.model<IPermission>('Permission', PermissionSchema);

export default Permission;
