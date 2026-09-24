import { NextResponse } from 'next/server';
import { generateAndSendOtp, verifyOtp } from '@/lib/notifications/otpService';
import { limitOtpRequests, limitAuthAttempts } from '@/lib/auth/rateLimiter';
import { logAuthEvent } from '@/lib/auth/auditLogger';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, phone, email, otp, type = 'phone_verification' } = body;

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // 1. IP Rate Limiting Check
    const ipCheck = limitAuthAttempts(ip);
    if (!ipCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many requests from your IP. Please try again in ${ipCheck.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const targetIdentifier = (phone || email || '').trim();
    if (!targetIdentifier) {
      return NextResponse.json(
        { success: false, error: 'Mobile number or email address is required.' },
        { status: 400 }
      );
    }

    // 2. Action: Request OTP
    if (action === 'request') {
      // Identifier Rate Limiting (max 3 per 15 min)
      const idCheck = limitOtpRequests(targetIdentifier);
      if (!idCheck.allowed) {
        return NextResponse.json(
          {
            success: false,
            error: `Too many OTP requests. Please wait ${idCheck.retryAfterSeconds} seconds before requesting a new code.`,
          },
          { status: 429 }
        );
      }

      const result = await generateAndSendOtp({
        identifier: targetIdentifier,
        type,
        req: request,
      });

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error || 'Failed to dispatch verification code.' },
          { status: 400 }
        );
      }

      const isEmail = targetIdentifier.includes('@');
      const cleanPhone = targetIdentifier.replace(/\D/g, '');
      const masked = isEmail
        ? `${targetIdentifier.slice(0, 2)}***@${targetIdentifier.split('@')[1]}`
        : `+91 ${cleanPhone.slice(0, 2)}******${cleanPhone.slice(8)}`;

      return NextResponse.json({
        success: true,
        message: result.message,
        maskedRecipient: masked,
        deliveryMode: isEmail ? 'email' : 'phone',
        cooldownSeconds: result.cooldownSeconds,
        demoOtp: result.demoOtp, // Provided in development for fast testing
      });
    }

    // 3. Action: Verify OTP
    if (action === 'verify') {
      if (!otp || otp.toString().trim().length !== 6) {
        return NextResponse.json(
          { success: false, error: 'Please enter a valid 6-digit verification code.' },
          { status: 400 }
        );
      }

      const verifyResult = await verifyOtp({
        identifier: targetIdentifier,
        code: otp.toString().trim(),
        type,
        req: request,
      });

      if (!verifyResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: verifyResult.message,
            remainingAttempts: verifyResult.remainingAttempts,
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Verification successful!',
        user: {
          phone: targetIdentifier.replace(/\D/g, ''),
          isMobileVerified: true,
          hasCompletedFirstTimeOtp: true,
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action parameter.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error during verification.' },
      { status: 500 }
    );
  }
}
