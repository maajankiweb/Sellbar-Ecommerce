import { NextRequest, NextResponse } from 'next/server';
import { cacheStore } from '@/lib/auth/security/redisClient';
import connectToDatabase from '@/lib/db/mongodb';
import { logAuthEvent } from '@/lib/auth/auditLogger';

export async function GET(req: NextRequest) {
  return handleCronReset(req);
}

export async function POST(req: NextRequest) {
  return handleCronReset(req);
}

async function handleCronReset(req: NextRequest) {
  try {
    // 1. Authenticate Cron Caller via Secret Token or Vercel Cron Header
    const authHeader = req.headers.get('authorization');
    const vercelCronHeader = req.headers.get('x-vercel-cron');
    const configuredSecret = process.env.CRON_SECRET || 'selbar_cron_secret_key_2026';

    const isAuthorized =
      vercelCronHeader === '1' ||
      authHeader === `Bearer ${configuredSecret}` ||
      req.nextUrl.searchParams.get('key') === configuredSecret;

    if (!isAuthorized && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED_CRON', message: 'Invalid or missing CRON_SECRET authorization' } },
        { status: 401 }
      );
    }

    // 2. Fetch previous usage
    const previousDailyRaw = await cacheStore.get('email:usage:daily');
    const previousDailyUsage = previousDailyRaw ? parseInt(previousDailyRaw, 10) : 0;

    // 3. Reset Daily Email Counter in Redis
    await cacheStore.set('email:usage:daily', '0');

    // 4. If 1st day of the month at midnight UTC, reset Monthly Email Counter as well
    const now = new Date();
    let isMonthlyReset = false;
    if (now.getUTCDate() === 1) {
      await cacheStore.set('email:usage:monthly', '0');
      isMonthlyReset = true;
    }

    // 5. Audit Log the Cron Execution
    try {
      await connectToDatabase();
      await logAuthEvent({
        identifier: 'SYSTEM_CRON',
        event: 'LOGIN_SUCCESS',
        status: 'SUCCESS',
        metadata: {
          action: 'EMAIL_QUOTA_RESET',
          previousDailyUsage,
          currentDailyUsage: 0,
          monthlyReset: isMonthlyReset,
          timestamp: now.toISOString(),
        },
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'CronWorker/1.0',
      });
    } catch (auditErr) {
      console.warn('[Cron] Audit log recording warning:', auditErr);
    }

    console.log(`[Cron] Email quota reset executed at ${now.toISOString()}. Previous daily usage: ${previousDailyUsage}. Monthly reset: ${isMonthlyReset}`);

    return NextResponse.json({
      success: true,
      message: 'Daily email quota counters successfully reset to 0',
      data: {
        previousDailyUsage,
        currentDailyUsage: 0,
        monthlyReset: isMonthlyReset,
        timestamp: now.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[Email Quota Reset Cron Error]', error);
    return NextResponse.json(
      { success: false, error: { code: 'CRON_EXECUTION_ERROR', message: error.message || 'Cron execution failed' } },
      { status: 500 }
    );
  }
}
