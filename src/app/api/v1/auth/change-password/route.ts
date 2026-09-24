import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import Session from '@/lib/db/models/Session';
import { authenticateRequest } from '@/lib/auth/middleware/authMiddleware';
import { ChangePasswordSchema } from '@/lib/validators/authValidators';
import { hashPassword, verifyPassword } from '@/lib/auth/security/passwordHasher';
import { hashToken } from '@/lib/auth/jwt';
import { logAuthEvent } from '@/lib/auth/auditLogger';
import { sendEmailNotification } from '@/lib/notifications/engine';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const authResult = await authenticateRequest(req);
    if (!authResult.success || !authResult.user) {
      return authResult.response!;
    }

    const { user: authUser } = authResult;
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = ChangePasswordSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: parseResult.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = parseResult.data;

    await connectToDatabase();

    // 2. Fetch User with current password hash
    const user = await User.findById(authUser.userId).select('+passwordHash +security');
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'User account not found.' },
        { status: 404 }
      );
    }

    // 3. Verify current password
    const isCurrentValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isCurrentValid.valid) {
      return NextResponse.json(
        { success: false, error: 'Your current password is incorrect.' },
        { status: 400 }
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
      user.security.lastPasswordChange = new Date();
    }

    await user.save();

    // 5. Revoke other sessions (keep current session active if refresh token provided)
    const currentRefreshToken = req.cookies.get('selbar_refresh_token')?.value;
    if (currentRefreshToken) {
      const currentTokenHash = hashToken(currentRefreshToken);
      await Session.updateMany(
        {
          userId: user._id,
          tokenHash: { $ne: currentTokenHash },
          isRevoked: false,
        },
        { $set: { isRevoked: true, revokedAt: new Date() } }
      );
    } else {
      // Invalidate all sessions
      await Session.updateMany(
        { userId: user._id, isRevoked: false },
        { $set: { isRevoked: true, revokedAt: new Date() } }
      );
    }

    await logAuthEvent({
      userId: user._id,
      identifier: authUser.email || authUser.phone,
      event: 'PASSWORD_CHANGED',
      status: 'SUCCESS',
      req,
    });

    // 6. Security Notification
    const userEmail = user.email?.value || (user as any).email;
    if (userEmail) {
      await sendEmailNotification({
        to: userEmail,
        subject: 'SELBAR Security: Your Password Was Changed',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
            <h2 style="color: #047857; margin-top: 0;">Password Successfully Changed</h2>
            <p style="color: #475569; font-size: 14px;">Your account password was updated. Other active device sessions have been automatically signed out.</p>
            <p style="color: #64748b; font-size: 12px;">If you made this change, you can safely disregard this email. If not, contact security@selbar.in immediately.</p>
          </div>
        `,
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: 'Your password has been changed successfully. Other active sessions have been signed out.',
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal error while changing password.' },
      { status: 500 }
    );
  }
}
