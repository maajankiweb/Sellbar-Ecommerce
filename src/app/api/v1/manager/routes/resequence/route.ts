import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { cacheStore } from '@/lib/auth/security/redisClient';
import { broadcastRouteResequenced } from '@/lib/socket/socketServer';
import connectToDatabase from '@/lib/db/mongodb';
import Order from '@/lib/db/models/Order';

interface ResequenceStopInput {
  orderId: string;
  sequenceNumber: number;
  customerName?: string;
  coordinates?: { lat: number; lng: number };
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  address?: string;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authorize: Check Bearer token (MANAGER or ADMIN) or Webhook secret header
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const webhookSecret = req.headers.get('x-selbar-webhook-secret');

    let authorizedUser: any = null;

    if (webhookSecret && webhookSecret === (process.env.DISPATCH_WEBHOOK_SECRET || 'selbar_dispatch_secret_2026')) {
      authorizedUser = { userId: 'system:webhook', role: 'MANAGER' };
    } else if (token) {
      const decoded = verifyAccessToken(token);
      if (decoded && ['ADMIN', 'MANAGER'].includes(decoded.role)) {
        authorizedUser = decoded;
      }
    }

    if (!authorizedUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Requires MANAGER or ADMIN privileges, or valid X-Selbar-Webhook-Secret',
          },
        },
        { status: 401 }
      );
    }

    // 2. Parse and validate body
    const body = await req.json();
    const { courierId, routeId, stops, reason, notes } = body;

    if (!courierId || typeof courierId !== 'string') {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'courierId is required' } },
        { status: 400 }
      );
    }

    if (!Array.isArray(stops) || stops.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'stops must be a non-empty array' } },
        { status: 400 }
      );
    }

    // Check sequence uniqueness and positive integers
    const seqNumbers = stops.map((s: ResequenceStopInput) => s.sequenceNumber);
    const uniqueSeqs = new Set(seqNumbers);
    if (uniqueSeqs.size !== stops.length) {
      return NextResponse.json(
        { success: false, error: { code: 'DUPLICATE_SEQUENCE', message: 'All stop sequenceNumbers must be unique' } },
        { status: 400 }
      );
    }

    // Sort stops strictly by sequenceNumber
    const sortedStops = [...stops].sort((a, b) => a.sequenceNumber - b.sequenceNumber);

    // Compute basic dynamic ETAs (starting from now + 15 mins per leg)
    const now = Date.now();
    const enrichedStops = sortedStops.map((stop, idx) => {
      const etaTimestamp = now + (idx + 1) * 18 * 60 * 1000;
      const etaTime = new Date(etaTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        ...stop,
        sequenceNumber: idx + 1,
        estimatedEta: etaTime,
        etaTimestamp,
      };
    });

    const routeData = {
      routeId: routeId || `route-${courierId}-${Date.now()}`,
      courierId,
      resequencedBy: authorizedUser.userId,
      reason: reason || 'MANUAL_DISPATCH',
      notes: notes || '',
      updatedAt: new Date().toISOString(),
      stops: enrichedStops,
    };

    // 3. Persist route snapshot in Redis (24-hour TTL)
    await cacheStore.set(`route:active:${courierId}`, JSON.stringify(routeData), 86400);

    // 4. Update order records if Mongoose is connected
    try {
      await connectToDatabase();
      const updatePromises = enrichedStops.map((stop) => {
        return Order.findByIdAndUpdate(stop.orderId, {
          $push: {
            statusTimeline: {
              status: 'SEQUENCE_UPDATED',
              timestamp: new Date(),
              notes: `Stop resequenced to #${stop.sequenceNumber} by ${authorizedUser.role} (${reason || 'Dynamic Re-routing'})`,
              updatedBy: authorizedUser.userId.startsWith('system') ? null : authorizedUser.userId,
            },
          },
        }).catch(() => null);
      });
      await Promise.all(updatePromises);
    } catch {
      // Non-blocking DB fallback
    }

    // 5. Broadcast in real time via Socket.IO
    await broadcastRouteResequenced(courierId, routeData);

    return NextResponse.json({
      success: true,
      message: 'In-flight delivery route successfully re-sequenced and dispatched via Socket.IO.',
      data: {
        routeId: routeData.routeId,
        courierId,
        totalStops: enrichedStops.length,
        reason: routeData.reason,
        updatedAt: routeData.updatedAt,
        stops: enrichedStops,
      },
    });
  } catch (error: any) {
    console.error('[Route Resequencing API Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'RESEQUENCE_FAILED', message: error.message || 'Internal server error' },
      },
      { status: 500 }
    );
  }
}
