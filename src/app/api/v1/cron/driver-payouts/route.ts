import { NextRequest, NextResponse } from 'next/server';
import { DriverPayoutAutomationService } from '@/services/payouts/driverPayoutAutomationService';

export async function GET(req: NextRequest) {
  return handlePayoutCron(req);
}

export async function POST(req: NextRequest) {
  return handlePayoutCron(req);
}

async function handlePayoutCron(req: NextRequest) {
  try {
    // 1. Authorize: Check CRON_SECRET or MANAGER token
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

    // 2. Parse target date
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date') || undefined;

    // 3. Trigger automated driver payout disbursal
    const summary = await DriverPayoutAutomationService.executeDailyPayoutDisbursal(dateParam);

    return NextResponse.json({
      success: true,
      message: `Automated driver payout disbursal completed for ${summary.date}. Disbursed ₹${summary.totalAmountDisbursed.toLocaleString('en-IN')} across ${summary.successfulTransfers} couriers.`,
      data: summary,
    });
  } catch (error: any) {
    console.error('[Driver Payouts Cron Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PAYOUT_DISBURSAL_FAILED',
          message: error.message || 'Failed to disburse driver payouts',
        },
      },
      { status: 500 }
    );
  }
}
