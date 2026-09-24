import { z } from 'zod';

/**
 * Mobile Number Normalization & Validation Helper
 * Cleans input digits and ensures standard 10-digit format for India or international E.164.
 */
export function normalizeMobileNumber(raw: string): {
  countryCode: string;
  number: string;
  normalized: string;
  isValid: boolean;
} {
  const digits = (raw || '').replace(/\D/g, '');
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    return {
      countryCode: '+91',
      number: digits,
      normalized: `+91${digits}`,
      isValid: true,
    };
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    const num = digits.slice(2);
    if (/^[6-9]\d{9}$/.test(num)) {
      return {
        countryCode: '+91',
        number: num,
        normalized: `+91${num}`,
        isValid: true,
      };
    }
  }
  return {
    countryCode: '+91',
    number: digits,
    normalized: digits ? `+${digits}` : '',
    isValid: false,
  };
}

/**
 * Normalization helper for usernames
 */
export function normalizeUsername(raw: string): string {
  return (raw || '').trim().toLowerCase();
}

/**
 * Normalization helper for email
 */
export function normalizeEmail(raw: string): string {
  return (raw || '').trim().toLowerCase();
}

// Password Complexity Regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{4,30}$/;

export const RegisterInputSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: 'Full name must be at least 2 characters.' })
      .max(100, { message: 'Full name cannot exceed 100 characters.' }),
    mobile: z
      .string()
      .trim()
      .refine((val) => normalizeMobileNumber(val).isValid, {
        message: 'Please enter a valid 10-digit mobile number.',
      }),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: 'Please enter a valid email address.' }),
    username: z
      .string()
      .trim()
      .min(4, { message: 'Username must be at least 4 characters.' })
      .max(30, { message: 'Username cannot exceed 30 characters.' })
      .regex(USERNAME_REGEX, {
        message: 'Username can only contain letters, numbers, and underscores (4-30 chars).',
      }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .max(128, { message: 'Password cannot exceed 128 characters.' })
      .regex(PASSWORD_REGEX, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      }),
    confirmPassword: z.string().optional(),
    acceptedTerms: z.literal(true, {
      message: 'You must accept the Terms and Conditions and Privacy Policy.',
    }),
    termsVersion: z.string().default('v1.0'),
    privacyVersion: z.string().default('v1.0'),
    captchaToken: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.confirmPassword !== undefined) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Passwords do not match.',
      path: ['confirmPassword'],
    }
  );

export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export const LoginInputSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, { message: 'Please enter your email, mobile number, or username.' }),
  password: z
    .string()
    .min(1, { message: 'Please enter your password.' }),
  rememberMe: z.boolean().default(true),
  captchaToken: z.string().optional(),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;

export const OtpRequestSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, { message: 'Mobile number or email address is required.' }),
  type: z.enum(['phone_verification', 'email_verification', 'login_2fa', 'password_reset']),
  captchaToken: z.string().optional(),
});

export type OtpRequestInput = z.infer<typeof OtpRequestSchema>;

export const OtpVerifySchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, { message: 'Mobile number or email address is required.' }),
  code: z
    .string()
    .trim()
    .length(6, { message: 'Verification code must be exactly 6 digits.' })
    .regex(/^\d{6}$/, { message: 'Verification code must contain digits only.' }),
  type: z.enum(['phone_verification', 'email_verification', 'login_2fa', 'password_reset']),
});

export type OtpVerifyInput = z.infer<typeof OtpVerifySchema>;

export const ForgotPasswordSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, { message: 'Mobile number, email, or username is required.' }),
  captchaToken: z.string().optional(),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z
  .object({
    identifier: z.string().trim().min(3),
    tokenOrOtp: z.string().trim().min(6),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .regex(PASSWORD_REGEX, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Current password is required.' }),
    newPassword: z
      .string()
      .min(8, { message: 'New password must be at least 8 characters long.' })
      .regex(PASSWORD_REGEX, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
