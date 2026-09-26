import { NextRequest, NextResponse } from 'next/server';
import { CourierRebalanceBot } from '@/services/dispatch/courierRebalanceBot';
import { verifyAccessToken } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  return handleRebalanceTrigger(req);
}

export async function POST(req: NextRequest) {
  return handleRebalanceTrigger(req);
}

async function handleRebalanceTrigger(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const cronSecret = process.env.CRON_SECRET || 'selbar_cron_secret_key_2026';

    let authorized = false;
    if (token === cronSecret) {
      authorized = true;
    } else if (token) {
      const decoded = verifyAccessToken(token);
      if (decoded && ['ADMIN', 'MANAGER'].includes(decoded.role)) {
        authorized = true;
      }
    }

    if (!authorized) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Requires CRON_SECRET or MANAGER authorization',
          },
        },
        { status: 401 }
      );
    }

    const report = await CourierRebalanceBot.evaluateAndRebalanceZones();

    return NextResponse.json({
      success: true,
      message: `Zone rebalancing evaluation completed. ${report.actionsExecuted.length} standby reserve couriers deployed.`,
      data: report,
    });
  } catch (error: any) {
    console.error('[Zone Rebalance Cron Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'REBALANCE_EVALUATION_FAILED', message: error.message || 'Internal server error' },
      },
      { status: 500 }
    );
  }
}
