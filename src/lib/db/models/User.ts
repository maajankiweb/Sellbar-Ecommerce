import mongoose, { Schema, Document, Model } from 'mongoose';
import { verifyPassword } from '@/lib/auth/security/passwordHasher';

export type UserRole =
  | 'customer'
  | 'seller'
  | 'seller_manager'
  | 'support'
  | 'moderator'
  | 'admin'
  | 'super_admin';

export type UserStatus = 'active' | 'suspended' | 'pending_verification' | 'deactivated';

export interface IUserAddress {
  label: 'home' | 'work' | 'other';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface IUser extends Document {
  fullName: string;
  email: {
    value: string;
    normalized: string;
    verified: boolean;
    verifiedAt?: Date;
  };
  mobile: {
    countryCode: string;
    number: string;
    normalized: string;
    verified: boolean;
    verifiedAt?: Date;
  };
  username: {
    value: string;
    normalized: string;
  };
  passwordHash?: string;
  roles: UserRole[];
  status: UserStatus;
  security: {
    failedLoginAttempts: number;
    lockedUntil?: Date;
    lastPasswordChange?: Date;
    twoFactorEnabled: boolean;
    twoFactorMethod?: 'totp' | 'sms' | 'email' | 'passkey';
  };
  profile: {
    avatar?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    completionPercentage: number;
  };
  consent: {
    termsVersion: string;
    privacyVersion: string;
    acceptedAt: Date;
    ipAddress?: string;
    userAgent?: string;
  };
  lastLoginAt?: Date;
  sellerId?: mongoose.Types.ObjectId; // Reference to Seller profile if multi-vendor seller
  addresses: IUserAddress[];
  payoutDetails?: {
    upiId?: string;
    bankAccount?: {
      accountNumber?: string;
      ifscCode?: string;
      beneficiaryName?: string;
    };
  };

  // Backwards compatibility virtuals & legacy field accessors
  phone: string;
  phoneVerified: boolean;
  name: string;
  role: UserRole;
  emailVerified: boolean;
  password?: string;
  failedLoginAttempts: number;
  lockUntil?: Date;
  profileCompleted: boolean;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<{ valid: boolean; needsRehash?: boolean }>;
  isLocked(): boolean;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      value: {
        type: String,
        required: true,
        trim: true,
      },
      normalized: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        index: true,
      },
      verified: {
        type: Boolean,
        default: false,
        index: true,
      },
      verifiedAt: {
        type: Date,
      },
    },
    mobile: {
      countryCode: {
        type: String,
        default: '+91',
      },
      number: {
        type: String,
        required: true,
        trim: true,
      },
      normalized: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
      },
      verified: {
        type: Boolean,
        default: false,
        index: true,
      },
      verifiedAt: {
        type: Date,
      },
    },
    username: {
      value: {
        type: String,
        required: true,
        trim: true,
      },
      normalized: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        index: true,
      },
    },
    passwordHash: {
      type: String,
      select: false,
    },
    roles: {
      type: [String],
      enum: ['customer', 'seller', 'seller_manager', 'support', 'moderator', 'admin', 'super_admin'],
      default: ['customer'],
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'pending_verification', 'deactivated'],
      default: 'active',
      index: true,
    },
    security: {
      failedLoginAttempts: {
        type: Number,
        default: 0,
      },
      lockedUntil: {
        type: Date,
      },
      lastPasswordChange: {
        type: Date,
      },
      twoFactorEnabled: {
        type: Boolean,
        default: false,
      },
      twoFactorMethod: {
        type: String,
        enum: ['totp', 'sms', 'email', 'passkey'],
      },
    },
    profile: {
      avatar: { type: String },
      dateOfBirth: { type: Date },
      gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      },
      completionPercentage: {
        type: Number,
        default: 20,
      },
    },
    consent: {
      termsVersion: { type: String, default: 'v1.0' },
      privacyVersion: { type: String, default: 'v1.0' },
      acceptedAt: { type: Date, default: Date.now },
      ipAddress: { type: String },
      userAgent: { type: String },
    },
    lastLoginAt: {
      type: Date,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'Seller',
      index: true,
    },
    addresses: [
      {
        label: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
        line1: { type: String, required: true },
        line2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true, index: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
    payoutDetails: {
      upiId: { type: String, trim: true },
      bankAccount: {
        accountNumber: { type: String, select: false },
        ifscCode: { type: String },
        beneficiaryName: { type: String },
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Backward Compatibility Virtuals
UserSchema.virtual('name')
  .get(function (this: IUser) {
    return this.fullName;
  })
  .set(function (this: IUser, val: string) {
    this.fullName = val;
  });

UserSchema.virtual('phone')
  .get(function (this: IUser) {
    return this.mobile?.number || '';
  })
  .set(function (this: IUser, val: string) {
    const clean = (val || '').replace(/\D/g, '');
    const num = clean.length === 12 && clean.startsWith('91') ? clean.slice(2) : clean;
    if (!this.mobile) {
      this.mobile = { countryCode: '+91', number: num, normalized: `+91${num}`, verified: false };
    } else {
      this.mobile.number = num;
      this.mobile.normalized = `+91${num}`;
    }
  });

UserSchema.virtual('phoneVerified')
  .get(function (this: IUser) {
    return !!this.mobile?.verified;
  })
  .set(function (this: IUser, val: boolean) {
    if (this.mobile) this.mobile.verified = val;
  });

UserSchema.virtual('emailVerified')
  .get(function (this: IUser) {
    return !!this.email?.verified;
  })
  .set(function (this: IUser, val: boolean) {
    if (this.email) this.email.verified = val;
  });

UserSchema.virtual('role')
  .get(function (this: IUser) {
    return this.roles && this.roles.length > 0 ? this.roles[0] : 'customer';
  })
  .set(function (this: IUser, val: UserRole) {
    if (!this.roles) this.roles = [val];
    else if (!this.roles.includes(val)) this.roles.unshift(val);
  });

UserSchema.virtual('password')
  .get(function (this: IUser) {
    return this.passwordHash;
  })
  .set(function (this: IUser, val: string) {
    this.passwordHash = val;
  });

UserSchema.virtual('failedLoginAttempts')
  .get(function (this: IUser) {
    return this.security?.failedLoginAttempts || 0;
  })
  .set(function (this: IUser, val: number) {
    if (!this.security) {
      this.security = { failedLoginAttempts: val, twoFactorEnabled: false };
    } else {
      this.security.failedLoginAttempts = val;
    }
  });

UserSchema.virtual('lockUntil')
  .get(function (this: IUser) {
    return this.security?.lockedUntil;
  })
  .set(function (this: IUser, val?: Date) {
    if (this.security) this.security.lockedUntil = val;
  });

UserSchema.virtual('isActive').get(function (this: IUser) {
  return this.status === 'active';
});

UserSchema.virtual('profileCompleted').get(function (this: IUser) {
  return (this.profile?.completionPercentage || 0) === 100;
});

// Compare password using Argon2id with legacy bcrypt fallback
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<{ valid: boolean; needsRehash?: boolean }> {
  if (!this.passwordHash) return { valid: false };
  return verifyPassword(candidatePassword, this.passwordHash);
};

// Check if account is temporarily locked
UserSchema.methods.isLocked = function (): boolean {
  return !!(this.security?.lockedUntil && this.security.lockedUntil.getTime() > Date.now());
};

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
