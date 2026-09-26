import connectToDatabase from '@/lib/db/mongodb';
import CourierDailyMetrics from '@/lib/db/models/CourierDailyMetrics';
import { PayoutService, PayoutTransferResult } from '@/integrations/payment/payoutService';
import { getSocketIO } from '@/lib/socket/socketServer';

export interface BatchPayoutSummary {
  date: string;
  totalDriversProcessed: number;
  totalAmountDisbursed: number;
  successfulTransfers: number;
  failedTransfers: number;
  transfers: PayoutTransferResult[];
  executionTimeMs: number;
}

// Registered Courier Bank & UPI Registry (Mapped to Field Partners)
const COURIER_REGISTRY: Record<string, { upiId: string; phone: string; name: string }> = {
  'DLV-401': {
    name: 'Ravi Kumar',
    upiId: 'ravi.kumar92@axl',
    phone: '+91 98201 10022',
  },
  'DEL-902': {
    name: 'Rajesh Shinde',
    upiId: 'rajesh.shinde@okhdfcbank',
    phone: '+91 98200 45678',
  },
  'DLV-402': {
    name: 'Sunil Jadhav',
    upiId: 'sunil.jadhav@ybl',
    phone: '+91 98700 88991',
  },
};

export class DriverPayoutAutomationService {
  /**
   * Calculates fuel & incentive balances and triggers automated payout via Cashfree/RazorpayX
   */
  public static async executeDailyPayoutDisbursal(targetDateStr?: string): Promise<BatchPayoutSummary> {
    const startTime = Date.now();
    await connectToDatabase();

    // Determine target date YYYY-MM-DD
    let dateStr = targetDateStr;
    if (!dateStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      dateStr = yesterday.toISOString().split('T')[0];
    }

    // 1. Fetch courier daily metrics for the target date
    let metrics = await CourierDailyMetrics.find({ date: dateStr });

    // Fallback if no pre-aggregated metrics exist for test / new days
    if (!metrics || metrics.length === 0) {
      const { AnalyticsRollupService } = await import('@/services/analytics/analyticsRollupService');
      await AnalyticsRollupService.executeDailyRollup(dateStr);
      metrics = await CourierDailyMetrics.find({ date: dateStr });
    }

    const transfers: PayoutTransferResult[] = [];
    let totalAmount = 0;
    let successfulCount = 0;
    let failedCount = 0;

    // 2. Process Payouts for each active courier
    for (const metric of metrics) {
      const courierId = metric.courierId;
      const courierInfo = COURIER_REGISTRY[courierId] || {
        name: metric.courierName || `Courier ${courierId}`,
        upiId: `${courierId.toLowerCase()}@paytm`,
        phone: '+91 98000 00000',
      };

      const completed = metric.totalDelivered || 0;
      if (completed === 0) continue;

      // Business Rules:
      // - Base payout: ₹120 per completed doorstep visit
      // - Daily Fuel Allowance: ₹350 standard (covering up to 45 kms)
      // - Completion Incentive: ₹500 if >= 10 deliveries completed with >= 95% on-time SLA
      const basePayout = completed * 120;
      const fuelAllowance = 350;
      const completionIncentive = completed >= 10 && (metric.onTimeRatePercent || 100) >= 95 ? 500 : 250;
      const totalPayout = basePayout + fuelAllowance + completionIncentive;

      const payoutResult = await PayoutService.disburseDriverDailyEarnings({
        driverId: courierId,
        driverName: courierInfo.name,
        upiId: courierInfo.upiId,
        phone: courierInfo.phone,
        amount: totalPayout,
        dateStr,
        breakdown: {
          deliveriesCompleted: completed,
          basePayout,
          fuelAllowance,
          completionIncentive,
          totalKmCovered: metric.totalDistanceKm || 45,
        },
        narration: `SELBAR Daily Earnings ${dateStr} - Fuel ₹${fuelAllowance} + Incentive ₹${completionIncentive}`,
      });

      transfers.push(payoutResult);

      if (payoutResult.success) {
        successfulCount++;
        totalAmount += totalPayout;

        // Update CourierDailyMetrics with official payout amount
        await CourierDailyMetrics.findByIdAndUpdate(metric._id, {
          $set: { totalPayoutInr: totalPayout },
        });

        // 3. Push real-time Socket.IO notification to driver app
        try {
          const io = getSocketIO();
          if (io) {
            io.to(`delivery:${courierId}`).emit('payout:disbursed', {
              amount: totalPayout,
              utrNumber: payoutResult.utrNumber,
              transferId: payoutResult.transferId,
              breakdown: {
                basePayout,
                fuelAllowance,
                completionIncentive,
              },
              date: dateStr,
              disbursedAt: payoutResult.processedAt,
            });
          }
        } catch {
          // Socket push fallback
        }
      } else {
        failedCount++;
      }
    }

    return {
      date: dateStr,
      totalDriversProcessed: transfers.length,
      totalAmountDisbursed: totalAmount,
      successfulTransfers: successfulCount,
      failedTransfers: failedCount,
      transfers,
      executionTimeMs: Date.now() - startTime,
    };
  }
}
