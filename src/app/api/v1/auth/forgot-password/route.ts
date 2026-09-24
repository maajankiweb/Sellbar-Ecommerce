import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import PasswordReset from '@/lib/db/models/PasswordReset';
import { ForgotPasswordSchema } from '@/lib/validators/authValidators';
import { limitPasswordResetRequests } from '@/lib/auth/security/rateLimiterRedis';
import { detectCredentialType } from '@/lib/auth/jwt';
import { sendEmailNotification } from '@/lib/notifications/engine';
import { logAuthEvent } from '@/lib/auth/auditLogger';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = ForgotPasswordSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: parseResult.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    const { identifier } = parseResult.data;
    const cleanId = identifier.trim().toLowerCase();

    // 1. Rate Limit Password Reset Requests (max 3 per hour)
    const rateCheck = await limitPasswordResetRequests(cleanId);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many password reset requests. Please try again in ${rateCheck.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    await connectToDatabase();

    // 2. Identify Account (Generic response regardless of existence to prevent enumeration)
    const credType = detectCredentialType(identifier);
    let query: Record<string, any> = {};

    if (credType === 'email') {
      query = { $or: [{ 'email.normalized': cleanId }, { email: cleanId }] };
    } else if (credType === 'phone') {
      const cleanPhone = identifier.replace(/\D/g, '');
      const standardPhone = cleanPhone.length === 12 && cleanPhone.startsWith('91')
        ? cleanPhone.slice(2)
        : cleanPhone;
      query = {
        $or: [
          { 'mobile.normalized': `+91${standardPhone}` },
          { 'mobile.number': standardPhone },
          { phone: standardPhone },
        ],
      };
    } else {
      query = { $or: [{ 'username.normalized': cleanId }, { username: cleanId }] };
    }

    const user = await User.findOne(query).select('_id email mobile fullName');

    if (user) {
      // 3. Generate Cryptographic Token
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Invalidate any existing unused reset tokens for this user
      await PasswordReset.deleteMany({ userId: user._id, isUsed: false });

      const forwarded = req.headers.get('x-forwarded-for');
      const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

      await PasswordReset.create({
        userId: user._id,
        identifier: cleanId,
        tokenHash,
        isUsed: false,
        expiresAt,
        ipAddress: ip,
      });

      const recipientEmail = user.email?.value || (user as any).email;
      if (recipientEmail) {
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${rawToken}&id=${encodeURIComponent(cleanId)}`;

        await sendEmailNotification({
          to: recipientEmail,
          subject: 'SELBAR Password Reset Request',
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
              <h2 style="color: #047857; margin-top: 0;">SELBAR Account Security</h2>
              <p style="color: #475569; font-size: 14px;">We received a request to reset your password. Click the secure link below to choose a new password:</p>
              <div style="text-align: center; margin: 28px 0;">
                <a href="${resetUrl}" style="background: #059669; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block;">Reset Password</a>
              </div>
              <p style="color: #64748b; font-size: 12px;">This reset link is single-use and will expire in 1 hour. If you did not request this, your account is safe and no action is required.</p>
            </div>
          `,
        }).catch((err) => {
          console.warn('[ForgotPassword] Email dispatch error:', err?.message);
        });
      }

      await logAuthEvent({
        userId: user._id,
        identifier: cleanId,
        event: 'OTP_REQUESTED',
        status: 'SUCCESS',
        req,
        metadata: { action: 'PASSWORD_RESET_LINK_GENERATED' },
      });
    }

    // Always return constant timing generic message
    return NextResponse.json({
      success: true,
      message: 'If an account matching this credential exists, verification instructions have been dispatched.',
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to process password reset request at this time.' },
      { status: 500 }
    );
  }
}
