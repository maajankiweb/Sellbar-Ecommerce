import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import PasswordReset from '@/lib/db/models/PasswordReset';
import Session from '@/lib/db/models/Session';
import SecurityEvent from '@/lib/db/models/SecurityEvent';
import { ResetPasswordSchema } from '@/lib/validators/authValidators';
import { hashPassword } from '@/lib/auth/security/passwordHasher';
import { logAuthEvent } from '@/lib/auth/auditLogger';
import { sendEmailNotification } from '@/lib/notifications/engine';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = ResetPasswordSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: parseResult.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    const { identifier, tokenOrOtp, newPassword } = parseResult.data;
    const cleanId = identifier.trim().toLowerCase();

    await connectToDatabase();

    // 1. Hash candidate reset token
    const tokenHash = crypto.createHash('sha256').update(tokenOrOtp.trim()).digest('hex');

    // 2. Locate unused, unexpired reset record
    const resetRecord = await PasswordReset.findOne({
      identifier: cleanId,
      tokenHash,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid, expired, or already used password reset link. Please request a new one.',
        },
        { status: 400 }
      );
    }

    // 3. Fetch User
    const user = await User.findById(resetRecord.userId).select('+passwordHash +security');
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User account not found.' },
        { status: 404 }
      );
    }

    // 4. Hash new password with Argon2id
    const newPasswordHash = await hashPassword(newPassword);
    user.passwordHash = newPasswordHash;

    if (!user.security) {
      user.security = {
        failedLoginAttempts: 0,
        twoFactorEnabled: false,
        lastPasswordChange: new Date(),
      };
    } else {
      user.security.failedLoginAttempts = 0;
      user.security.lockedUntil = undefined;
      user.security.lastPasswordChange = new Date();
    }
    user.lockUntil = undefined;
    user.failedLoginAttempts = 0;

    await user.save();

    // 5. Invalidate reset token
    resetRecord.isUsed = true;
    resetRecord.usedAt = new Date();
    await resetRecord.save();

    // 6. Security Invalidation: Revoke ALL existing active sessions for this user
    await Session.updateMany(
      { userId: user._id, isRevoked: false },
      { $set: { isRevoked: true, revokedAt: new Date() } }
    );

    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // 7. Record Security Audit Events
    await SecurityEvent.create({
      userId: user._id,
      eventType: 'PASSWORD_RESET_SUCCESS',
      severity: 'HIGH',
      ipAddress: ip,
      userAgent: req.headers.get('user-agent') || 'Unknown',
      isResolved: true,
      metadata: { method: 'token_reset' },
    });

    await logAuthEvent({
      userId: user._id,
      identifier: cleanId,
      event: 'PASSWORD_RESET',
      status: 'SUCCESS',
      req,
    });

    // 8. Send Security Confirmation Email
    const recipientEmail = user.email?.value || (user as any).email;
    if (recipientEmail) {
      await sendEmailNotification({
        to: recipientEmail,
        subject: 'SELBAR Security Alert: Password Reset Completed',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
            <h2 style="color: #047857; margin-top: 0;">Password Successfully Reset</h2>
            <p style="color: #475569; font-size: 14px;">The password for your SELBAR account was just changed. All existing sessions on your devices have been signed out for security.</p>
            <p style="color: #dc2626; font-size: 13px; font-weight: bold;">If you did NOT perform this change, please contact SELBAR security support at support@selbar.in immediately.</p>
          </div>
        `,
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. All active sessions have been signed out. Please sign in with your new password.',
    });
  } catch (error: any) {
    console.error('Password reset confirmation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal error while resetting password.' },
      { status: 500 }
    );
  }
}
