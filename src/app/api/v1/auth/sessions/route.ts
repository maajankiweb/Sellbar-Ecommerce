import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import Session from '@/lib/db/models/Session';
import { authenticateRequest } from '@/lib/auth/middleware/authMiddleware';
import { hashToken } from '@/lib/auth/jwt';
import { logAuthEvent } from '@/lib/auth/auditLogger';

/**
 * GET /api/v1/auth/sessions
 * List active sessions for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req);
    if (!authResult.success || !authResult.user) {
      return authResult.response!;
    }

    await connectToDatabase();

    const currentRefreshToken = req.cookies.get('selbar_refresh_token')?.value;
    const currentTokenHash = currentRefreshToken ? hashToken(currentRefreshToken) : null;

    const sessions = await Session.find({
      userId: authResult.user.userId,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    })
      .sort({ lastUsedAt: -1 })
      .lean();

    const sanitized = sessions.map((s) => ({
      id: s._id.toString(),
      device: s.device || s.deviceInfo?.deviceType || 'desktop',
      browser: s.browser || s.deviceInfo?.browser || 'Browser',
      operatingSystem: s.operatingSystem || s.deviceInfo?.os || 'OS',
      approximateLocation: s.approximateLocation || 'Bihar, India',
      ipAddress: s.ipAddress ? `${s.ipAddress.slice(0, 7)}***` : '127.0.0.1',
      lastUsedAt: s.lastUsedAt || (s as any).lastActiveAt,
      createdAt: s.createdAt,
      isCurrentSession: Boolean(currentTokenHash && s.tokenHash === currentTokenHash),
    }));

    return NextResponse.json({
      success: true,
      sessions: sanitized,
    });
  } catch (error: any) {
    console.error('List sessions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve active sessions.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/auth/sessions
 * Revoke a specific session or revoke all other sessions
 */
export async function DELETE(req: NextRequest) {
  try {
    const authResult = await authenticateRequest(req);
    if (!authResult.success || !authResult.user) {
      return authResult.response!;
    }

    const { searchParams } = new URL(req.url);
    const body = await req.json().catch(() => ({}));
    const sessionId = searchParams.get('id') || body.sessionId;
    const revokeAllOthers = Boolean(searchParams.get('allOthers') === 'true' || body.revokeAllOthers);

    await connectToDatabase();

    const currentRefreshToken = req.cookies.get('selbar_refresh_token')?.value;
    const currentTokenHash = currentRefreshToken ? hashToken(currentRefreshToken) : null;

    if (revokeAllOthers) {
      const filter: Record<string, any> = {
        userId: authResult.user.userId,
        isRevoked: false,
      };

      if (currentTokenHash) {
        filter.tokenHash = { $ne: currentTokenHash };
      }

      await Session.updateMany(filter, {
        $set: { isRevoked: true, revokedAt: new Date() },
      });

      await logAuthEvent({
        userId: authResult.user.userId,
        identifier: authResult.user.email || authResult.user.phone,
        event: 'LOGOUT_ALL',
        status: 'SUCCESS',
        req,
      });

      return NextResponse.json({
        success: true,
        message: 'All other active sessions have been signed out.',
      });
    }

    if (sessionId) {
      const targetSession = await Session.findOne({
        _id: sessionId,
        userId: authResult.user.userId,
      });

      if (!targetSession) {
        return NextResponse.json(
          { success: false, error: 'Session not found or already revoked.' },
          { status: 404 }
        );
      }

      targetSession.isRevoked = true;
      targetSession.revokedAt = new Date();
      await targetSession.save();

      return NextResponse.json({
        success: true,
        message: 'Selected session has been signed out.',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Please specify a sessionId or set revokeAllOthers: true.' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Revoke session error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to revoke session.' },
      { status: 500 }
    );
  }
}
