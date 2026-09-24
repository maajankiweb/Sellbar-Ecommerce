import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Payment } from '@/lib/db/models/Payment';
import { Order } from '@/lib/db/models/Order';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, amount, customerInfo } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(Number(amount) * 100);
    const receipt = `rcpt_${Date.now().toString().slice(-8)}`;

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    let rzpOrderId: string;

    // Check if live/test Razorpay credentials exist
    if (razorpayKeyId && razorpayKeySecret && !razorpayKeyId.includes('xxxx')) {
      // Direct Razorpay API order creation
      const basicAuth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
      const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt,
          notes: {
            app: 'SELBAR_RECOMMERCE',
            orderId: orderId || 'BUY_ORDER',
            customer: customerInfo?.phone || 'Customer',
          },
        }),
      });

      const rzpData = await rzpRes.json();
      if (!rzpRes.ok) {
        console.error('Razorpay API error:', rzpData);
        return NextResponse.json(
          { success: false, error: rzpData.error?.description || 'Razorpay order creation failed' },
          { status: 500 }
        );
      }
      rzpOrderId = rzpData.id;
    } else {
      // Mock / Sandbox fallback order for instant local testing without live gateway block
      rzpOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }

    // Attempt MongoDB record creation if database is connected
    try {
      await connectToDatabase();
      let orderDoc = null;
      if (orderId) {
        orderDoc = await Order.findOne({ orderNumber: orderId });
      }

      await Payment.create({
        order: orderDoc?._id || undefined,
        orderNumber: orderId || `ORD-${Date.now()}`,
        paymentType: 'COLLECTION',
        razorpayOrderId: rzpOrderId,
        amount: Number(amount),
        currency: 'INR',
        method: 'UPI',
        status: 'CREATED',
      });
    } catch (dbErr) {
      console.warn('DB recording skipped for payment order creation:', dbErr);
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: rzpOrderId,
        amount: amountInPaise,
        currency: 'INR',
        keyId: razorpayKeyId || 'rzp_test_placeholder_key',
        receipt,
      },
    });
  } catch (error: unknown) {
    console.error('Error in /api/v1/payments/create-order:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
