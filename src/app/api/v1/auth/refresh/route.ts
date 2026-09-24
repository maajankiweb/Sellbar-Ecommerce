import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/lib/db/mongodb';
import Session from '@/lib/db/models/Session';
import User from '@/lib/db/models/User';
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
  hashToken,
  extractDeviceInfo,
  TokenPayload,
} from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get('selbar_refresh_token')?.value;
    const body = await req.json().catch(() => ({}));
    const refreshToken = cookieToken || body.refreshToken;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'No refresh token provided.' },
        { status: 401 }
      );
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired refresh token.' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const hashedCurrent = hashToken(refreshToken);
    const existingSession = await Session.findOne({
      userId: payload.userId,
      refreshTokenHash: hashedCurrent,
    });

    if (!existingSession || existingSession.isRevoked) {
      // Possible reuse attack: revoke all tokens in this family
      if (existingSession?.familyId) {
        await Session.updateMany(
          { familyId: existingSession.familyId },
          { $set: { isRevoked: true } }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Session has been revoked or expired. Please sign in again.' },
        { status: 403 }
      );
    }

    // Fetch user to confirm status
    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: 'User account is inactive or disabled.' },
        { status: 403 }
      );
    }

    // Rotate Refresh Token
    const emailVal = user.email?.value || (typeof user.email === 'string' ? user.email : undefined);
    const usernameVal = user.username?.value || (typeof user.username === 'string' ? user.username : undefined);

    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      role: user.role,
      phone: user.phone,
      email: emailVal,
      username: usernameVal,
      sellerId: user.sellerId ? user.sellerId.toString() : undefined,
    };

    const newAccessToken = signAccessToken(tokenPayload);
    const { token: newRefreshToken, expiresInSeconds, expiresAt } = signRefreshToken(tokenPayload, true);

    const device = extractDeviceInfo(req);

    // Invalidate old session and create rotated session
    existingSession.isRevoked = true;
    existingSession.revokedAt = new Date();
    await existingSession.save();

    await Session.create({
      userId: user._id,
      tokenHash: hashToken(newRefreshToken),
      refreshTokenHash: hashToken(newRefreshToken),
      familyId: existingSession.familyId || crypto.randomUUID(),
      device: device.deviceType,
      browser: device.browser,
      operatingSystem: device.os,
      deviceInfo: {
        userAgent: device.userAgent,
        os: device.os,
        browser: device.browser,
        deviceType: device.deviceType,
      },
      ipAddress: device.ipAddress,
      isRevoked: false,
      expiresAt,
      lastUsedAt: new Date(),
      lastActiveAt: new Date(),
    });

    const response = NextResponse.json({
      success: true,
      accessToken: newAccessToken,
    });

    response.cookies.set('selbar_refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: expiresInSeconds,
    });

    response.cookies.set('selbar_has_session', '1', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: expiresInSeconds,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Session refresh failed.' },
      { status: 500 }
    );
  }
}
