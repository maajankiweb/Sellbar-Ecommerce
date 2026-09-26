import { NextRequest, NextResponse } from 'next/server';
import { WebPushService } from '@/lib/notifications/webPushService';
import { verifyAccessToken } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    let userId = 'anonymous';

    if (authHeader?.startsWith('Bearer ')) {
      const decoded = verifyAccessToken(authHeader.substring(7));
      if (decoded) {
        userId = decoded.userId;
      }
    }

    const body = await req.json();
    const { subscription, fallbackUserId } = body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_SUBSCRIPTION', message: 'Valid push subscription required' } },
        { status: 400 }
      );
    }

    const targetUserId = userId !== 'anonymous' ? userId : fallbackUserId || 'guest_user';
    await WebPushService.saveSubscription(targetUserId, subscription);

    return NextResponse.json({
      success: true,
      message: 'Push notification subscription registered successfully',
    });
  } catch (error: any) {
    console.error('[WebPush Subscribe Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'PUSH_SUBSCRIPTION_ERROR', message: error.message || 'Failed to register subscription' },
      },
      { status: 500 }
    );
  }
}
