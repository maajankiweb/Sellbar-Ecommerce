import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_URL: z.string().url().default('https://sellbar.in'),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  OTP_HMAC_SECRET: z.string().min(16, 'OTP_HMAC_SECRET must be at least 16 characters'),
  FIELD_ENCRYPTION_KEY: z.string().min(32).optional(),
  RAZORPAY_KEY_ID: z.string().min(1, 'RAZORPAY_KEY_ID is required'),
  RAZORPAY_KEY_SECRET: z.string().min(1, 'RAZORPAY_KEY_SECRET is required'),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1, 'RAZORPAY_WEBHOOK_SECRET is required'),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),
  MSG91_AUTH_KEY: z.string().min(1, 'MSG91_AUTH_KEY is required'),
  MSG91_OTP_TEMPLATE_ID: z.string().min(1, 'MSG91_OTP_TEMPLATE_ID is required'),
  MSG91_SENDER_ID: z.string().default('SLLBAR'),
  SMS_TRANSACTIONAL: z.enum(['true', 'false']).default('false'),
  EMAIL_PROVIDER: z.enum(['resend', 'brevo', 'mock']).default('mock'),
  RESEND_API_KEY: z.string().optional(),
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_PUBLIC: z.string().optional(),
  R2_BUCKET_PRIVATE: z.string().optional(),
  SHIPPING_PROVIDER: z.enum(['manual', 'shiprocket']).default('manual'),
  PAYOUTS_PROVIDER: z.enum(['manual', 'razorpayx']).default('manual'),
});

export type Env = z.infer<typeof EnvSchema>;

function validateEnv(): Env {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // In dev / test, warn about missing variables but allow execution with safe fallbacks
    const parsed = EnvSchema.safeParse({
      NODE_ENV: process.env.NODE_ENV || 'development',
      APP_URL: process.env.APP_URL || 'http://localhost:3000',
      MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sellbar_dev',
      REDIS_URL: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'dev_secret_jwt_access_must_be_32_chars_long!!',
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_secret_jwt_refresh_must_be_32_chars_long!',
      OTP_HMAC_SECRET: process.env.OTP_HMAC_SECRET || 'dev_otp_hmac_secret_key',
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder',
      RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_placeholder',
      NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      MSG91_AUTH_KEY: process.env.MSG91_AUTH_KEY || 'msg91_auth_placeholder',
      MSG91_OTP_TEMPLATE_ID: process.env.MSG91_OTP_TEMPLATE_ID || 'msg91_template_placeholder',
      MSG91_SENDER_ID: process.env.MSG91_SENDER_ID || 'SLLBAR',
      SMS_TRANSACTIONAL: process.env.SMS_TRANSACTIONAL || 'false',
      EMAIL_PROVIDER: process.env.EMAIL_PROVIDER || 'mock',
      SHIPPING_PROVIDER: process.env.SHIPPING_PROVIDER || 'manual',
      PAYOUTS_PROVIDER: process.env.PAYOUTS_PROVIDER || 'manual',
    });

    if (!parsed.success) {
      console.warn('⚠️ [ENV] Non-critical validation warning in development mode:', parsed.error.format());
      return parsed.data as unknown as Env;
    }
    return parsed.data;
  }

  // Strict Production Boot Gate
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    const errorDetails = JSON.stringify(result.error.flatten().fieldErrors, null, 2);
    console.error('❌ [FATAL] Environment validation failed in PRODUCTION mode:\n', errorDetails);
    throw new Error(`[FATAL] Application refuses to start in production with missing environment variables:\n${errorDetails}`);
  }

  return result.data;
}

export const env = validateEnv();
export default env;
