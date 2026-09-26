import connectToDatabase from '@/lib/db/mongodb';
import Payment from '@/lib/db/models/Payment';
import { cacheStore } from '@/lib/auth/security/redisClient';

export interface BankStatementRecord {
  transferId: string;
  utrNumber: string;
  amount: number; // in INR
  status: 'SUCCESS' | 'FAILED' | 'REVERSED';
  paymentDate: string; // ISO date string
  beneficiaryVpa?: string;
  remarks?: string;
  feeInr?: number;
  taxInr?: number;
}

export interface StatementReconciliationReport {
  reconciledAt: Date;
  totalRecordsProcessed: number;
  matchedCount: number;
  discrepancyCount: number;
  unmatchedCount: number;
  totalSettledAmountInr: number;
  discrepancies: Array<{
    transferId: string;
    issue: 'AMOUNT_MISMATCH' | 'PAYMENT_NOT_FOUND' | 'STATUS_CONFLICT';
    expectedAmount?: number;
    statementAmount?: number;
    details: string;
  }>;
}

export class BankReconciliationService {
  /**
   * Processes real-time Webhook events from Cashfree or RazorpayX payout gateways
   */
  public static async processPayoutWebhook(eventPayload: any): Promise<{
    success: boolean;
    reconciled: boolean;
    transferId: string;
    status: string;
    message: string;
  }> {
    await connectToDatabase();

    // 1. Normalize payload across Cashfree & RazorpayX schemas
    let transferId = '';
    let utr = '';
    let status = 'PROCESSED';
    let failureReason: string | undefined = undefined;

    // Cashfree Payout Schema
    if (eventPayload.transferId || eventPayload.data?.transferId) {
      const data = eventPayload.data || eventPayload;
      transferId = data.transferId;
      utr = data.utr || data.bankReference || '';
      const rawStatus = (data.status || '').toUpperCase();
      if (rawStatus === 'SUCCESS' || rawStatus === 'TRANSFER_SUCCESS') {
        status = 'PROCESSED';
      } else if (rawStatus === 'FAILED' || rawStatus === 'TRANSFER_FAILED') {
        status = 'FAILED';
        failureReason = data.reason || 'Bank payout transfer failed';
      } else if (rawStatus === 'REVERSED' || rawStatus === 'TRANSFER_REVERSED') {
        status = 'REFUNDED';
        failureReason = data.reason || 'Bank payout reversed';
      }
    }
    // RazorpayX Payout Schema
    else if (eventPayload.event && eventPayload.payload?.payout) {
      const payoutEntity = eventPayload.payload.payout.entity;
      transferId = payoutEntity.reference_id || payoutEntity.id;
      utr = payoutEntity.utr || '';
      const eventName = eventPayload.event;
      if (eventName === 'payout.processed') {
        status = 'PROCESSED';
      } else if (eventName === 'payout.reversed') {
        status = 'REFUNDED';
        failureReason = payoutEntity.failure_reason || 'Reversed by beneficiary bank';
      } else if (eventName === 'payout.failed') {
        status = 'FAILED';
        failureReason = payoutEntity.failure_reason || 'Bank transaction rejected';
      }
    }

    if (!transferId) {
      return {
        success: false,
        reconciled: false,
        transferId: 'UNKNOWN',
        status: 'IGNORED',
        message: 'Unable to extract transferId from webhook payload',
      };
    }

    // 2. Find and update Payment record in MongoDB
    const payment = await Payment.findOne({
      $or: [
        { orderNumber: transferId },
        { razorpayPayoutId: transferId },
        { 'webhookPayloads.transferId': transferId },
      ],
      paymentType: 'PAYOUT',
    });

    if (!payment) {
      console.warn(`[Bank Reconciliation] Payment record not found for transferId ${transferId}`);
      return {
        success: true,
        reconciled: false,
        transferId,
        status,
        message: 'Transaction not found in local payout ledger',
      };
    }

    payment.status = status as any;
    if (failureReason) payment.failureReason = failureReason;

    // Attach webhook proof
    payment.webhookPayloads.push({
      reconciledVia: 'WEBHOOK',
      reconciledAt: new Date(),
      utr,
      rawEvent: eventPayload,
    });
    await payment.save();

    // Cache updated reconciliation flag in Redis (7 days TTL)
    await cacheStore.set(
      `payout:reconciled:${transferId}`,
      JSON.stringify({ status, utr, reconciledAt: new Date() }),
      7 * 86400
    );

    return {
      success: true,
      reconciled: true,
      transferId,
      status,
      message: `Payout ${transferId} reconciled successfully with UTR ${utr || 'N/A'}.`,
    };
  }

  /**
   * Reconciles daily batch bank UTR statement against MongoDB payout ledger
   */
  public static async reconcileDailyBankStatement(
    statementRecords: BankStatementRecord[]
  ): Promise<StatementReconciliationReport> {
    await connectToDatabase();

    let matchedCount = 0;
    let discrepancyCount = 0;
    let unmatchedCount = 0;
    let totalSettledAmountInr = 0;
    const discrepancies: StatementReconciliationReport['discrepancies'] = [];

    for (const record of statementRecords) {
      const payment = await Payment.findOne({
        $or: [
          { orderNumber: record.transferId },
          { razorpayPayoutId: record.transferId },
          { 'webhookPayloads.transferId': record.transferId },
        ],
        paymentType: 'PAYOUT',
      });

      if (!payment) {
        unmatchedCount++;
        discrepancies.push({
          transferId: record.transferId,
          issue: 'PAYMENT_NOT_FOUND',
          statementAmount: record.amount,
          details: `Bank statement contains transfer ${record.transferId} (UTR ${record.utrNumber}) with no matching ledger record`,
        });
        continue;
      }

      // Check amount exact match
      if (Math.abs(payment.amount - record.amount) > 0.01) {
        discrepancyCount++;
        discrepancies.push({
          transferId: record.transferId,
          issue: 'AMOUNT_MISMATCH',
          expectedAmount: payment.amount,
          statementAmount: record.amount,
          details: `Ledger amount ₹${payment.amount} differs from bank statement amount ₹${record.amount}`,
        });
      } else {
        matchedCount++;
        totalSettledAmountInr += record.amount;

        // Update ledger record with bank statement UTR confirmation
        payment.status = record.status === 'SUCCESS' ? 'PROCESSED' : 'FAILED';
        payment.webhookPayloads.push({
          reconciledVia: 'BANK_STATEMENT_BATCH',
          reconciledAt: new Date(),
          statementDate: record.paymentDate,
          utrNumber: record.utrNumber,
          feeInr: record.feeInr || 0,
        });
        await payment.save();
      }
    }

    return {
      reconciledAt: new Date(),
      totalRecordsProcessed: statementRecords.length,
      matchedCount,
      discrepancyCount,
      unmatchedCount,
      totalSettledAmountInr,
      discrepancies,
    };
  }
}
