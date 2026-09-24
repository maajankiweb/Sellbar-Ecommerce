import { cacheStore } from './redisClient';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  retryAfterSeconds?: number;
}

/**
 * Sliding Window Rate Limiter powered by Redis / Resilient Cache Store
 */
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const countKey = `ratelimit:${key}:count`;
  const blockKey = `ratelimit:${key}:blocked`;

  // 1. Check if explicitly blocked
  const isBlocked = await cacheStore.get(blockKey);
  if (isBlocked) {
    const ttl = await cacheStore.ttl(blockKey);
    const retryAfter = Math.max(1, ttl);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: retryAfter,
      retryAfterSeconds: retryAfter,
    };
  }

  // 2. Increment request count in window
  const currentCount = await cacheStore.incr(countKey, windowSeconds);

  if (currentCount > maxRequests) {
    // Block for the remainder of the window or a cooldown period
    const ttl = await cacheStore.ttl(countKey);
    const blockDuration = Math.max(15, ttl > 0 ? ttl : windowSeconds);
    await cacheStore.set(blockKey, '1', blockDuration);

    return {
      allowed: false,
      remaining: 0,
      resetSeconds: blockDuration,
      retryAfterSeconds: blockDuration,
    };
  }

  const remaining = Math.max(0, maxRequests - currentCount);
  const ttl = await cacheStore.ttl(countKey);

  return {
    allowed: true,
    remaining,
    resetSeconds: ttl > 0 ? ttl : windowSeconds,
  };
}

/**
 * Rate limit login/register attempts per IP (Configurable, default: 10 per minute)
 */
export async function limitAuthAttempts(ip: string): Promise<RateLimitResult> {
  const max = parseInt(process.env.AUTH_RATE_LIMIT_MAX || '10', 10);
  const windowSec = parseInt(process.env.AUTH_RATE_LIMIT_WINDOW || '60', 10);
  return checkRateLimit(`ip:${ip}:auth`, max, windowSec);
}

/**
 * Rate limit consecutive login failures on a specific account identifier
 */
export async function limitAccountLogin(normalizedIdentifier: string): Promise<RateLimitResult> {
  const max = parseInt(process.env.ACCOUNT_LOGIN_LIMIT_MAX || '5', 10);
  const windowSec = parseInt(process.env.ACCOUNT_LOGIN_LIMIT_WINDOW || '300', 10); // 5 min
  return checkRateLimit(`account:${normalizedIdentifier}:login`, max, windowSec);
}

/**
 * Rate limit OTP dispatches per phone/email (Max 3 requests per 15 minutes)
 */
export async function limitOtpRequests(identifier: string): Promise<RateLimitResult> {
  const cleanId = identifier.trim().toLowerCase();
  const max = parseInt(process.env.OTP_MAX_REQUESTS || '3', 10);
  const windowSec = parseInt(process.env.OTP_WINDOW_SECONDS || '900', 10); // 15 mins
  return checkRateLimit(`otp_send:${cleanId}`, max, windowSec);
}

/**
 * Rate limit username availability checks (Max 40 per minute per IP)
 */
export async function limitUsernameChecks(ip: string): Promise<RateLimitResult> {
  return checkRateLimit(`uname_check:${ip}`, 40, 60);
}

/**
 * Rate limit password reset requests (Max 3 per hour)
 */
export async function limitPasswordResetRequests(identifier: string): Promise<RateLimitResult> {
  const cleanId = identifier.trim().toLowerCase();
  return checkRateLimit(`pwd_reset:${cleanId}`, 3, 3600);
}
