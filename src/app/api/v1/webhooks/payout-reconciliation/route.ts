import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { BankReconciliationService } from '@/services/payouts/bankReconciliationService';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature =
      req.headers.get('x-cashfree-signature') ||
      req.headers.get('x-razorpay-signature') ||
      req.headers.get('x-webhook-signature');

    const payoutWebhookSecret =
      process.env.PAYOUT_WEBHOOK_SECRET || process.env.RAZORPAY_WEBHOOK_SECRET || 'selbar_payout_webhook_secret_2026';

    // Verify HMAC signature if provided
    if (signature && payoutWebhookSecret && !payoutWebhookSecret.includes('xxxx')) {
      const computed = crypto
        .createHmac('sha256', payoutWebhookSecret)
        .update(rawBody)
        .digest('hex');

      // Timing safe compare if lengths match
      if (signature.length === computed.length) {
        const isMatch = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computed));
        if (!isMatch) {
          console.warn('[Payout Webhook] Invalid webhook signature detected');
          return NextResponse.json({ success: false, error: 'INVALID_SIGNATURE' }, { status: 400 });
        }
      }
    }

    const payload = JSON.parse(rawBody);
    const result = await BankReconciliationService.processPayoutWebhook(payload);

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error: any) {
    console.error('[Payout Reconciliation Webhook Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'WEBHOOK_PROCESSING_FAILED', message: error.message || 'Internal error' },
      },
      { status: 500 }
    );
  }
}
