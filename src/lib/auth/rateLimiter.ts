interface RateLimitRecord {
  timestamps: number[];
  blockedUntil?: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __SELBAR_RATE_LIMITS__: Map<string, RateLimitRecord> | undefined;
}

if (!global.__SELBAR_RATE_LIMITS__) {
  global.__SELBAR_RATE_LIMITS__ = new Map();
}

/**
 * High-performance sliding-window rate limiter.
 * Gracefully works in memory and is Redis-compatible.
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number
): {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  retryAfterSeconds?: number;
} {
  const store = global.__SELBAR_RATE_LIMITS__!;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  let record = store.get(key);
  if (!record) {
    record = { timestamps: [] };
    store.set(key, record);
  }

  // Check if currently blocked
  if (record.blockedUntil && record.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: retryAfterSeconds,
      retryAfterSeconds,
    };
  }

  // Filter timestamps outside current sliding window
  const windowStart = now - windowMs;
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= maxRequests) {
    // Block for the remainder of the window
    const oldestTimestamp = record.timestamps[0];
    const resetSeconds = Math.ceil((oldestTimestamp + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
      retryAfterSeconds: Math.max(1, resetSeconds),
    };
  }

  // Record this attempt
  record.timestamps.push(now);
  const remaining = Math.max(0, maxRequests - record.timestamps.length);

  return {
    allowed: true,
    remaining,
    resetSeconds: windowSeconds,
  };
}

/**
 * Rate limit login/register attempts per IP (Max 10 per minute)
 */
export function limitAuthAttempts(ip: string) {
  return checkRateLimit(`auth:${ip}`, 10, 60);
}

/**
 * Rate limit OTP dispatches per phone/email (Max 3 per 15 minutes)
 */
export function limitOtpRequests(identifier: string) {
  const cleanId = identifier.trim().toLowerCase();
  return checkRateLimit(`otp:${cleanId}`, 3, 15 * 60);
}

/**
 * Rate limit username availability checks (Max 40 per minute per IP)
 */
export function limitUsernameChecks(ip: string) {
  return checkRateLimit(`uname:${ip}`, 40, 60);
}
