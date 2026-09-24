import { createNotification, sendEmailNotification } from '@/lib/notifications/engine';

interface OtpRecord {
  target: string; // phone or email
  code: string;
  expiresAt: number; // timestamp
  attempts: number;
  isFirstTime: boolean;
}

export interface RegisteredUserRecord {
  phone: string;
  email?: string;
  name?: string;
  hasCompletedFirstTimeOtp: boolean;
  registeredAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __SELBAR_OTP_STORE__: Map<string, OtpRecord> | undefined;
  // eslint-disable-next-line no-var
  var __SELBAR_REGISTERED_USERS__: Map<string, RegisteredUserRecord> | undefined;
}

if (!global.__SELBAR_OTP_STORE__) {
  global.__SELBAR_OTP_STORE__ = new Map();
}

if (!global.__SELBAR_REGISTERED_USERS__) {
  global.__SELBAR_REGISTERED_USERS__ = new Map();
}

/**
 * Mask an email address for privacy (e.g., s*****h@example.com)
 */
export function maskEmail(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const [local, domain] = parts;
  if (local.length <= 2) {
    return `${local[0]}*@${domain}`;
  }
  return `${local[0]}${'*'.repeat(Math.min(5, local.length - 2))}${local[local.length - 1]}@${domain}`;
}

/**
 * Check if the user is a first-time signup or an already registered user
 */
export function getUserRegistrationStatus(phone: string): RegisteredUserRecord | null {
  const cleanPhone = phone.replace(/\D/g, '');
  return global.__SELBAR_REGISTERED_USERS__!.get(cleanPhone) || null;
}

/**
 * Register or update user record
 */
export function markUserAsRegistered(params: {
  phone: string;
  email?: string;
  name?: string;
}): RegisteredUserRecord {
  const cleanPhone = params.phone.replace(/\D/g, '');
  const existing = global.__SELBAR_REGISTERED_USERS__!.get(cleanPhone);

  const record: RegisteredUserRecord = {
    phone: cleanPhone,
    name: params.name || existing?.name || 'SELBAR Member',
    email: params.email || existing?.email,
    hasCompletedFirstTimeOtp: true,
    registeredAt: existing?.registeredAt || new Date().toISOString(),
  };

  global.__SELBAR_REGISTERED_USERS__!.set(cleanPhone, record);
  return record;
}

/**
 * Request Auth Code:
 * - First-time users: Receive an OTP on Mobile phone (Account Creation step).
 * - Existing registered users: Mobile OTP is PERMANENTLY DISABLED. Verification code is routed to their registered email!
 */
export async function requestAuthCode(params: {
  phone: string;
  email?: string;
}): Promise<{
  isFirstTime: boolean;
  deliveryMode: 'phone' | 'email';
  recipient: string;
  maskedRecipient: string;
  code: string;
  expiresInSeconds: number;
  message: string;
}> {
  const cleanPhone = params.phone.replace(/\D/g, '');
  const existingUser = getUserRegistrationStatus(cleanPhone);
  const isFirstTime = !existingUser || !existingUser.hasCompletedFirstTimeOtp;

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const ttlMs = 5 * 60 * 1000; // 5 minutes TTL

  if (isFirstTime) {
    // 1. FIRST TIME USER: Send Mobile OTP for signup verification
    global.__SELBAR_OTP_STORE__!.set(cleanPhone, {
      target: cleanPhone,
      code,
      expiresAt: Date.now() + ttlMs,
      attempts: 0,
      isFirstTime: true,
    });

    createNotification({
      recipient: cleanPhone,
      title: 'SELBAR First-Time Signup Mobile Verification',
      message: `Welcome to SELBAR! Your first-time mobile verification OTP is ${code}. Mobile OTP will not be required for future logins. Valid for 5 minutes.`,
      type: 'SYSTEM_ANNOUNCEMENT',
      metadata: { phone: cleanPhone, code },
    });

    return {
      isFirstTime: true,
      deliveryMode: 'phone',
      recipient: cleanPhone,
      maskedRecipient: `+91 ${cleanPhone.substring(0, 2)}******${cleanPhone.substring(8)}`,
      code,
      expiresInSeconds: 300,
      message: `First-time verification OTP sent to +91 ${cleanPhone}. Subsequent communications will use your email.`,
    };
  } else {
    // 2. EXISTING USER: NO MOBILE OTP EVER SENT. Send verification code to registered email!
    const userEmail = existingUser.email || params.email || 'customer@selbar.in';
    const masked = maskEmail(userEmail);

    global.__SELBAR_OTP_STORE__!.set(cleanPhone, {
      target: userEmail,
      code,
      expiresAt: Date.now() + ttlMs,
      attempts: 0,
      isFirstTime: false,
    });

    // Send Amazon-style security email to registered email address
    await sendEmailNotification({
      to: userEmail,
      subject: 'SELBAR Security: Your One-Time Sign-In Code',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #047857; margin-bottom: 8px;">SELBAR Account Security</h2>
          <p style="color: #475569; font-size: 14px;">As an existing member, mobile OTP has been permanently disabled for your security. Here is your sign-in verification code:</p>
          <div style="background: #f8fafc; border: 2px dashed #059669; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0f172a;">${code}</span>
          </div>
          <p style="color: #64748b; font-size: 12px;">This code expires in 5 minutes. If you did not make this request, please contact SELBAR West Champaran customer care immediately.</p>
        </div>
      `,
    });

    return {
      isFirstTime: false,
      deliveryMode: 'email',
      recipient: userEmail,
      maskedRecipient: masked,
      code,
      expiresInSeconds: 300,
      message: `Mobile OTP is disabled for existing users. Verification code sent to your registered email: ${masked}`,
    };
  }
}

/**
 * Verify Auth Code
 */
export function verifyInHouseOtp(
  phone: string,
  inputOtp: string,
  email?: string,
  name?: string
): { valid: boolean; isFirstTime?: boolean; user?: RegisteredUserRecord; error?: string } {
  const cleanPhone = phone.replace(/\D/g, '');
  const record = global.__SELBAR_OTP_STORE__!.get(cleanPhone);

  if (!record) {
    return { valid: false, error: 'No active verification code found. Please request a new code.' };
  }

  if (Date.now() > record.expiresAt) {
    global.__SELBAR_OTP_STORE__!.delete(cleanPhone);
    return { valid: false, error: 'Verification code has expired. Please request a new code.' };
  }

  record.attempts += 1;
  if (record.attempts > 3) {
    global.__SELBAR_OTP_STORE__!.delete(cleanPhone);
    return { valid: false, error: 'Too many incorrect attempts. Please request a new code.' };
  }

  if (record.code !== inputOtp.trim()) {
    return { valid: false, error: `Invalid code. ${3 - record.attempts} attempts remaining.` };
  }

  // Verification passed: mark user as registered so mobile OTP is never sent again
  const wasFirstTime = record.isFirstTime;
  const user = markUserAsRegistered({ phone: cleanPhone, email, name });
  global.__SELBAR_OTP_STORE__!.delete(cleanPhone);

  return { valid: true, isFirstTime: wasFirstTime, user };
}

// Backward-compatible wrapper
export function generateInHouseOtp(phone: string) {
  const cleanPhone = phone.replace(/\D/g, '');
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return { code, expiresInSeconds: 300 };
}
