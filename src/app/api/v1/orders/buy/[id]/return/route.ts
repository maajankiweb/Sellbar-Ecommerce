import { NextResponse } from 'next/server';
import { db } from '@/lib/db/data';
import { ReturnRequest } from '@/types';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = db.buyOrders.get(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { type, reason, notes, pickupSlot, pickupAddress } = body;

    if (!type || !reason || !pickupSlot?.date) {
      return NextResponse.json(
        { success: false, message: 'Missing required return request fields' },
        { status: 400 }
      );
    }

    const returnId = `RET-${Math.floor(100000 + Math.random() * 900000)}`;

    const returnRequest: ReturnRequest = {
      id: returnId,
      orderId: id,
      type: type || 'REPLACEMENT',
      reason,
      notes: notes || '',
      pickupSlot: {
        date: pickupSlot.date,
        window: pickupSlot.window || 'Morning (10 AM - 1 PM)',
      },
      pickupAddress: pickupAddress || order.shippingAddress,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    order.state = 'RETURN_REQUESTED';
    order.returnRequest = returnRequest;
    order.updatedAt = new Date().toISOString();

    db.buyOrders.set(id, order);

    return NextResponse.json({
      success: true,
      message: `5-Day return request raised successfully with Ticket ID #${returnId}`,
      returnRequest,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
