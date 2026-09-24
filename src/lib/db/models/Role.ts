import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRole extends Document {
  name: string; // 'customer' | 'seller' | 'seller_manager' | 'support' | 'moderator' | 'admin' | 'super_admin'
  displayName: string;
  description: string;
  permissions: string[]; // e.g. ["orders:view", "products:create"]
  isSystemRole: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    permissions: {
      type: [String],
      default: [],
      index: true,
    },
    isSystemRole: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/**
 * Built-in default RBAC permissions matrix
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  customer: [
    'orders:create',
    'orders:view_own',
    'profile:manage_own',
    'reviews:create',
  ],
  seller: [
    'orders:create',
    'orders:view_own',
    'profile:manage_own',
    'products:create_seller',
    'products:view_seller',
    'products:update_seller',
    'products:delete_seller',
    'seller:orders_view',
    'seller:orders_update',
    'seller:analytics_view',
  ],
  seller_manager: [
    'products:create_seller',
    'products:view_seller',
    'products:update_seller',
    'seller:orders_view',
    'seller:orders_update',
  ],
  support: [
    'orders:view_all',
    'orders:update_status',
    'users:view',
    'tickets:manage',
  ],
  moderator: [
    'products:review',
    'products:moderate',
    'reviews:moderate',
    'users:view',
    'users:flag',
  ],
  admin: [
    'products:create',
    'products:update',
    'products:delete',
    'products:view_all',
    'orders:view_all',
    'orders:update_all',
    'orders:refund',
    'users:view',
    'users:suspend',
    'seller:approve',
    'seller:payout',
    'analytics:view',
    'coupons:manage',
    'pricing:manage',
    'security:audit_view',
  ],
  super_admin: ['*'], // Full unrestricted root authority
};

export const Role: Model<IRole> =
  mongoose.models.Role || mongoose.model<IRole>('Role', RoleSchema);

export default Role;
