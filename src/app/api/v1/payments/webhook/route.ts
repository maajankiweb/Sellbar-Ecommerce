import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Payment } from '@/lib/db/models/Payment';
import { Order } from '@/lib/db/models/Order';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const webhookSignature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Validate webhook signature if secret is active
    if (webhookSecret && !webhookSecret.includes('xxxx') && webhookSignature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (webhookSignature !== expectedSignature) {
        console.error('Invalid Razorpay webhook signature');
        return NextResponse.json({ status: 'error', message: 'Invalid signature' }, { status: 400 });
      }
    }

    const eventData = JSON.parse(rawBody);
    const event = eventData.event;
    const payload = eventData.payload;

    console.log(`[Razorpay Webhook] Received event: ${event}`);

    try {
      await connectToDatabase();

      if (event === 'payment.captured') {
        const paymentEntity = payload.payment?.entity;
        if (paymentEntity?.order_id) {
          await Payment.findOneAndUpdate(
            { razorpayOrderId: paymentEntity.order_id },
            {
              razorpayPaymentId: paymentEntity.id,
              status: 'CAPTURED',
              method: paymentEntity.method?.toUpperCase() || 'UPI',
              $push: { webhookPayloads: eventData },
            },
            { upsert: true }
          );

          // Update corresponding order
          await Order.findOneAndUpdate(
            { 'payment.razorpayOrderId': paymentEntity.order_id },
            {
              status: 'PLACED',
              $push: {
                statusTimeline: {
                  status: 'PLACED',
                  timestamp: new Date(),
                  notes: `Webhook payment.captured confirmed for Rs. ${paymentEntity.amount / 100}`,
                },
              },
            }
          );
        }
      } else if (event === 'payment.failed') {
        const paymentEntity = payload.payment?.entity;
        if (paymentEntity?.order_id) {
          await Payment.findOneAndUpdate(
            { razorpayOrderId: paymentEntity.order_id },
            {
              status: 'FAILED',
              failureReason: paymentEntity.error_description || 'Payment failed',
              $push: { webhookPayloads: eventData },
            }
          );
        }
      } else if (event === 'refund.processed') {
        const refundEntity = payload.refund?.entity;
        if (refundEntity?.payment_id) {
          await Payment.findOneAndUpdate(
            { razorpayPaymentId: refundEntity.payment_id },
            {
              status: 'REFUNDED',
              $push: {
                refunds: {
                  refundId: refundEntity.id,
                  amount: refundEntity.amount / 100,
                  status: 'PROCESSED',
                  reason: 'Customer requested refund',
                  createdAt: new Date(),
                },
                webhookPayloads: eventData,
              },
            }
          );
        }
      }
    } catch (dbErr) {
      console.error('Error logging webhook in MongoDB:', dbErr);
    }

    // Always respond with 200 OK fast so Razorpay does not retry
    return NextResponse.json({ status: 'ok', eventReceived: event });
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}
