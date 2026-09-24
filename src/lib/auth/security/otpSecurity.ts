import crypto from 'crypto';
import { cacheStore } from './redisClient';
import connectToDatabase from '@/lib/db/mongodb';
import OtpVerification from '@/lib/db/models/OtpVerification';

const OTP_PEPPER = process.env.OTP_HMAC_SECRET || 'selbar_secure_otp_pepper_secret_2026';
const OTP_EXPIRY_SECONDS = 300; // 5 minutes
const RESEND_COOLDOWN_SECONDS = 60; // 60 seconds
const MAX_VERIFY_ATTEMPTS = 5;

export type OtpVerificationType =
  | 'phone_verification'
  | 'email_verification'
  | 'login_2fa'
  | 'password_reset';

export interface StoredOtpData {
  otpHash: string;
  attempts: number;
  maxAttempts: number;
  cooldownUntil: number;
  expiresAt: number;
}

/**
 * Hash an OTP using HMAC-SHA256 with the server-side pepper
 */
export function hashOtp(otp: string): string {
  return crypto.createHmac('sha256', OTP_PEPPER).update(otp.trim()).digest('hex');
}

/**
 * Generate a cryptographically secure 6-digit OTP
 */
export function generateSecureOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Mask an email or mobile number for secure public output
 */
export function maskIdentifier(identifier: string): string {
  const trimmed = identifier.trim();
  if (trimmed.includes('@')) {
    const [local, domain] = trimmed.split('@');
    if (local.length <= 2) return `${local[0]}*@${domain}`;
    return `${local.slice(0, 2)}***${local.slice(-1)}@${domain}`;
  }
  const cleanPhone = trimmed.replace(/\D/g, '');
  const standardPhone = cleanPhone.length === 12 && cleanPhone.startsWith('91')
    ? cleanPhone.slice(2)
    : cleanPhone;
  if (standardPhone.length === 10) {
    return `+91 ${standardPhone.slice(0, 2)}******${standardPhone.slice(8)}`;
  }
  return trimmed.slice(0, 3) + '****' + trimmed.slice(-2);
}

/**
 * Create and securely store an OTP in Redis and MongoDB Atlas
 */
export async function createAndStoreOtp(params: {
  identifier: string;
  type: OtpVerificationType;
}): Promise<{
  success: boolean;
  otp?: string;
  cooldownSeconds?: number;
  error?: string;
  maskedRecipient: string;
}> {
  const normalized = params.identifier.trim().toLowerCase();
  const redisKey = `otp:${params.type}:${normalized}`;
  const now = Date.now();

  // 1. Check existing cooldown
  const existingRaw = await cacheStore.get(redisKey);
  if (existingRaw) {
    try {
      const existing: StoredOtpData = JSON.parse(existingRaw);
      if (existing.cooldownUntil > now) {
        const remainingCooldown = Math.ceil((existing.cooldownUntil - now) / 1000);
        return {
          success: false,
          error: `Please wait ${remainingCooldown}s before requesting a new code.`,
          cooldownSeconds: remainingCooldown,
          maskedRecipient: maskIdentifier(normalized),
        };
      }
    } catch {
      // JSON parse error, ignore and generate fresh OTP
    }
  }

  // 2. Generate new OTP and hash it
  const otp = generateSecureOtp();
  const otpHash = hashOtp(otp);
  const expiresAt = now + OTP_EXPIRY_SECONDS * 1000;
  const cooldownUntil = now + RESEND_COOLDOWN_SECONDS * 1000;

  const otpData: StoredOtpData = {
    otpHash,
    attempts: 0,
    maxAttempts: MAX_VERIFY_ATTEMPTS,
    cooldownUntil,
    expiresAt,
  };

  // 3. Store in Redis with TTL
  await cacheStore.set(redisKey, JSON.stringify(otpData), OTP_EXPIRY_SECONDS);

  // 4. Also store in MongoDB OtpVerification (with MongoDB TTL index)
  try {
    const conn = await connectToDatabase();
    if (conn) {
      await OtpVerification.deleteMany({ identifier: normalized, type: params.type });
      await OtpVerification.create({
        identifier: normalized,
        type: params.type,
        otpHash,
        attempts: 0,
        maxAttempts: MAX_VERIFY_ATTEMPTS,
        cooldownUntil: new Date(cooldownUntil),
        expiresAt: new Date(expiresAt),
      });
    }
  } catch (err: any) {
    console.warn('[OtpSecurity] MongoDB record creation warning:', err?.message);
  }

  return {
    success: true,
    otp, // Returned only to the caller to dispatch via SMS/Email; never sent in client API responses
    cooldownSeconds: RESEND_COOLDOWN_SECONDS,
    maskedRecipient: maskIdentifier(normalized),
  };
}

/**
 * Verify submitted OTP against Redis or MongoDB with attempt rate limiting
 */
export async function verifyStoredOtp(params: {
  identifier: string;
  type: OtpVerificationType;
  candidateCode: string;
}): Promise<{
  valid: boolean;
  message: string;
  remainingAttempts?: number;
}> {
  const normalized = params.identifier.trim().toLowerCase();
  const redisKey = `otp:${params.type}:${normalized}`;
  const now = Date.now();

  const candidateHash = hashOtp(params.candidateCode);

  // 1. Try Redis first
  const redisRaw = await cacheStore.get(redisKey);
  if (redisRaw) {
    let data: StoredOtpData;
    try {
      data = JSON.parse(redisRaw);
    } catch {
      return { valid: false, message: 'Invalid verification session. Please request a new code.' };
    }

    if (now > data.expiresAt) {
      await cacheStore.del(redisKey);
      return { valid: false, message: 'Verification code has expired. Please request a new code.' };
    }

    if (data.attempts >= data.maxAttempts) {
      await cacheStore.del(redisKey);
      return { valid: false, message: 'Maximum verification attempts exceeded. Please request a new code.' };
    }

    // Constant-time comparison to prevent timing attacks
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(candidateHash, 'hex'),
      Buffer.from(data.otpHash, 'hex')
    );

    if (!isMatch) {
      data.attempts += 1;
      const remaining = data.maxAttempts - data.attempts;

      if (remaining <= 0) {
        await cacheStore.del(redisKey);
        return {
          valid: false,
          message: 'Maximum verification attempts exceeded. Please request a new code.',
          remainingAttempts: 0,
        };
      }

      const remainingTtl = Math.max(1, Math.ceil((data.expiresAt - now) / 1000));
      await cacheStore.set(redisKey, JSON.stringify(data), remainingTtl);

      return {
        valid: false,
        message: `Invalid code. ${remaining} attempt(s) remaining.`,
        remainingAttempts: remaining,
      };
    }

    // Success: Delete immediately to prevent replay attacks
    await cacheStore.del(redisKey);
    try {
      await OtpVerification.deleteMany({ identifier: normalized, type: params.type });
    } catch {
      // ignore
    }

    return { valid: true, message: 'Verification successful!' };
  }

  // 2. Fallback to MongoDB OtpVerification if Redis record was evicted
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const record = await OtpVerification.findOne({ identifier: normalized, type: params.type });
      if (!record) {
        return { valid: false, message: 'No active verification code found or it has expired.' };
      }

      if (record.expiresAt.getTime() < now) {
        await OtpVerification.deleteOne({ _id: record._id });
        return { valid: false, message: 'Verification code has expired.' };
      }

      if (record.attempts >= record.maxAttempts) {
        await OtpVerification.deleteOne({ _id: record._id });
        return { valid: false, message: 'Maximum attempts exceeded. Please request a new code.' };
      }

      const isMatch = crypto.timingSafeEqual(
        Buffer.from(candidateHash, 'hex'),
        Buffer.from(record.otpHash, 'hex')
      );

      if (!isMatch) {
        record.attempts += 1;
        await record.save();
        const remaining = record.maxAttempts - record.attempts;
        return {
          valid: false,
          message: `Invalid code. ${remaining} attempt(s) remaining.`,
          remainingAttempts: remaining,
        };
      }

      await OtpVerification.deleteOne({ _id: record._id });
      return { valid: true, message: 'Verification successful!' };
    }
  } catch (err: any) {
    console.error('[OtpSecurity] Verification fallback error:', err?.message);
  }

  return { valid: false, message: 'Verification session expired. Please request a new code.' };
}
