import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Order from '@/lib/db/models/Order';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const query: Record<string, unknown> = { orderType: 'SELL' };
    if (status && status !== 'ALL') {
      query.status = status;
    }

    const quotes = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'name phone email')
      .populate('sellDetails.assignedExecutive', 'name phone email');

    return NextResponse.json({
      success: true,
      count: quotes.length,
      data: quotes
    });
  } catch (error) {
    console.error('Error fetching sell quotes:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch buyback quotes' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { orderId, status, executiveId, payoutUtr, inspectedPrice } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'orderId is required' },
        { status: 400 }
      );
    }

    const updateFields: Record<string, unknown> = {};
    if (status) updateFields.status = status;
    if (executiveId) updateFields['sellDetails.assignedExecutive'] = executiveId;
    if (inspectedPrice !== undefined) updateFields['sellDetails.inspectedPrice'] = inspectedPrice;
    if (payoutUtr) updateFields.payoutUtr = payoutUtr;

    const updated = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: updateFields,
        $push: {
          statusTimeline: {
            status: status || 'UPDATED',
            timestamp: new Date(),
            notes: `Updated from admin panel: ${JSON.stringify(body)}`
          }
        }
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Quote updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating sell quote:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update quote' },
      { status: 500 }
    );
  }
}
