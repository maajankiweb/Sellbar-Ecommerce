import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Session from '@/lib/db/models/Session';
import { verifyRefreshToken, hashToken } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get('selbar_refresh_token')?.value;
    const body = await req.json().catch(() => ({}));
    const refreshToken = cookieToken || body.refreshToken;
    const logoutAll = Boolean(body.logoutAll);

    if (refreshToken) {
      const payload = verifyRefreshToken(refreshToken);
      if (payload?.userId) {
        await connectToDatabase();

        if (logoutAll) {
          // Revoke all sessions for this user (Logout from all devices)
          await Session.updateMany(
            { userId: payload.userId, isRevoked: false },
            { $set: { isRevoked: true } }
          );
        } else {
          // Revoke just this current session
          const hashedCurrent = hashToken(refreshToken);
          await Session.updateOne(
            { userId: payload.userId, refreshTokenHash: hashedCurrent },
            { $set: { isRevoked: true } }
          );
        }
      }
    }

    const response = NextResponse.json({
      success: true,
      message: logoutAll
        ? 'Successfully logged out from all devices.'
        : 'Successfully logged out.',
    });

    // Clear cookies across the entire site
    response.cookies.set('selbar_refresh_token', '', { path: '/', maxAge: 0 });
    response.cookies.set('selbar_has_session', '', { path: '/', maxAge: 0 });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error during logout.' },
      { status: 500 }
    );
  }
}
