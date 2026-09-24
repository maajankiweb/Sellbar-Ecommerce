import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';

const ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || 'selbar_fallback_access_secret_2026';
const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'selbar_fallback_refresh_secret_2026';

import type { UserRole } from '@/lib/db/models/User';

export interface TokenPayload {
  userId: string;
  role: UserRole | 'executive';
  phone: string;
  email?: string;
  username?: string;
  sellerId?: string;
}

export type CredentialType = 'email' | 'phone' | 'username';

/**
 * Smart detection of whether user entered an Email, Mobile Number, or Username.
 */
export function detectCredentialType(input: string): CredentialType {
  const trimmed = input.trim();
  if (trimmed.includes('@')) {
    return 'email';
  }
  // If numeric and 10 digits (or begins with +91)
  const cleanedDigits = trimmed.replace(/\D/g, '');
  if (cleanedDigits.length === 10 || (cleanedDigits.length === 12 && cleanedDigits.startsWith('91'))) {
    return 'phone';
  }
  return 'username';
}

/**
 * Evaluate password strength and complexity rules
 */
export function evaluatePasswordStrength(password: string) {
  const requirements = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const satisfiedCount = Object.values(requirements).filter(Boolean).length;

  let label: 'Weak' | 'Fair' | 'Good' | 'Strong' = 'Weak';
  if (satisfiedCount === 5) label = 'Strong';
  else if (satisfiedCount >= 4) label = 'Good';
  else if (satisfiedCount >= 3) label = 'Fair';

  return {
    score: satisfiedCount,
    label,
    isValid: requirements.minLength && requirements.hasUpper && requirements.hasLower && requirements.hasNumber && requirements.hasSpecial,
    requirements,
  };
}

/**
 * Sign 15-minute Access Token
 */
export function signAccessToken(payload: TokenPayload): string {
  const options: SignOptions = {
    expiresIn: '15m',
    issuer: 'selbar.in',
  };
  return jwt.sign(payload, ACCESS_SECRET, options);
}

/**
 * Sign Refresh Token (30 days if rememberMe is true, else 24 hours)
 */
export function signRefreshToken(payload: TokenPayload, rememberMe: boolean = false): {
  token: string;
  expiresInSeconds: number;
  expiresAt: Date;
} {
  const expiresInSeconds = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
  const options: SignOptions = {
    expiresIn: expiresInSeconds,
    issuer: 'selbar.in',
  };
  const token = jwt.sign(payload, REFRESH_SECRET, options);
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

  return { token, expiresInSeconds, expiresAt };
}

/**
 * Verify Access Token
 */
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET, { issuer: 'selbar.in' }) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Verify Refresh Token
 */
export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET, { issuer: 'selbar.in' }) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * SHA-256 hash a refresh token before persisting to MongoDB
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Extract Client Device Info from Headers
 */
export function extractDeviceInfo(req: Request) {
  const userAgent = req.headers.get('user-agent') || 'Unknown';
  const forwardedFor = req.headers.get('x-forwarded-for');
  const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

  let deviceType: 'mobile' | 'desktop' | 'tablet' = 'desktop';
  if (/mobile/i.test(userAgent)) deviceType = 'mobile';
  else if (/ipad|tablet/i.test(userAgent)) deviceType = 'tablet';

  let os = 'Unknown OS';
  if (/windows/i.test(userAgent)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(userAgent)) os = 'macOS';
  else if (/android/i.test(userAgent)) os = 'Android';
  else if (/iphone|ipad/i.test(userAgent)) os = 'iOS';
  else if (/linux/i.test(userAgent)) os = 'Linux';

  let browser = 'Unknown Browser';
  if (/chrome|crios/i.test(userAgent) && !/edge|edg/i.test(userAgent)) browser = 'Chrome';
  else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = 'Safari';
  else if (/firefox|fxios/i.test(userAgent)) browser = 'Firefox';
  else if (/edge|edg/i.test(userAgent)) browser = 'Edge';

  return {
    userAgent,
    ipAddress,
    os,
    browser,
    deviceType,
  };
}
