import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsRollupService } from '@/services/analytics/analyticsRollupService';

export async function GET(req: NextRequest) {
  return handleRollup(req);
}

export async function POST(req: NextRequest) {
  return handleRollup(req);
}

async function handleRollup(req: NextRequest) {
  try {
    // 1. Authorize: Verify CRON_SECRET header
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const cronSecret = process.env.CRON_SECRET || 'selbar_cron_secret_key_2026';

    if (!token || token !== cronSecret) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED_CRON',
            message: 'Invalid or missing CRON_SECRET authorization bearer token',
          },
        },
        { status: 401 }
      );
    }

    // 2. Parse target date if specified in query params
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date') || undefined;

    // 3. Execute daily MongoDB aggregation rollup
    const result = await AnalyticsRollupService.executeDailyRollup(dateParam);

    return NextResponse.json({
      success: true,
      message: `Daily delivery analytics and courier rating aggregation completed for ${result.date}.`,
      data: result,
    });
  } catch (error: any) {
    console.error('[Analytics Rollup Cron Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ROLLUP_FAILED',
          message: error.message || 'Failed to execute analytics aggregation rollup',
        },
      },
      { status: 500 }
    );
  }
}
