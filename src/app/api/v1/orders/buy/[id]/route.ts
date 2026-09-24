import { NextResponse } from 'next/server';
import { db } from '@/lib/db/data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = db.buyOrders.get(id);

  if (!order) {
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: order });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = db.buyOrders.get(id);

  if (!order) {
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updated = {
      ...order,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    db.buyOrders.set(id, updated);

    // If order state updated, dispatch Amazon-style tracking update email to registered email
    if (body.state && body.state !== order.state) {
      try {
        const { sendOrderTrackingEmail } = await import('@/lib/notifications/engine');
        await sendOrderTrackingEmail(updated, body.state);
      } catch {
        // ignore email error in dev mode
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
