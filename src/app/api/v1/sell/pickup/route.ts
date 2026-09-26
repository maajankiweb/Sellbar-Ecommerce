import { NextResponse } from 'next/server';
import { db } from '@/lib/db/data';

interface SlotData {
  id: string;
  timeRange: string;
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
  available: number;
  active: boolean;
}

// In-memory slot registry keyed by `${pincode}:${date}`
const slotStore = new Map<string, SlotData[]>();

function getOrInitSlots(zoneKey: string): SlotData[] {
  if (!slotStore.has(zoneKey)) {
    slotStore.set(zoneKey, [
      { id: 'slot-1', timeRange: '10:00 AM - 12:00 PM', startTime: '10:00', endTime: '12:00', capacity: 6, booked: 2, available: 4, active: true },
      { id: 'slot-2', timeRange: '12:00 PM - 02:00 PM', startTime: '12:00', endTime: '14:00', capacity: 6, booked: 5, available: 1, active: true },
      { id: 'slot-3', timeRange: '02:00 PM - 04:00 PM', startTime: '14:00', endTime: '16:00', capacity: 8, booked: 3, available: 5, active: true },
      { id: 'slot-4', timeRange: '04:00 PM - 06:00 PM', startTime: '16:00', endTime: '18:00', capacity: 8, booked: 1, available: 7, active: true },
    ]);
  }
  return slotStore.get(zoneKey)!;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const pincode = searchParams.get('pincode') || '845438';

    const zoneKey = `${pincode}:${date}`;
    const slots = getOrInitSlots(zoneKey);

    return NextResponse.json({
      success: true,
      data: {
        date,
        pincode,
        zone: 'West Champaran Hub',
        slots,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve pickup slots';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quoteId, date, slotId, address, payoutDetails } = body;

    if (!quoteId || !date || !slotId || !address) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: quoteId, date, slotId, address' },
        { status: 400 }
      );
    }

    const pincode = address.pincode || '845438';
    const zoneKey = `${pincode}:${date}`;
    const slots = getOrInitSlots(zoneKey);
    const targetSlot = slots.find((s) => s.id === slotId);

    if (!targetSlot) {
      return NextResponse.json(
        { success: false, error: `Invalid slotId '${slotId}' for date ${date}` },
        { status: 400 }
      );
    }

    // Overbooking prevention
    if (targetSlot.available <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Slot '${targetSlot.timeRange}' is completely booked. Please select another slot.`,
        },
        { status: 409 }
      );
    }

    // Atomically increment booked count
    targetSlot.booked += 1;
    targetSlot.available = Math.max(0, targetSlot.capacity - targetSlot.booked);

    // Retrieve or create Sell Order
    const sellOrderId = `ORD-SELL-${Date.now().toString(36).toUpperCase()}`;
    const orderData = {
      id: sellOrderId,
      quoteId,
      status: 'PICKUP_SCHEDULED',
      pickupDetails: {
        date,
        slotId: targetSlot.id,
        timeRange: targetSlot.timeRange,
        address,
      },
      payoutDetails: payoutDetails || { mode: 'UPI' },
      assignedExecutive: {
        id: 'EXEC-701',
        name: 'Amit Sharma',
        phone: '+91 98765 43210',
        rating: 4.9,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Pickup scheduled successfully. Field Executive assigned.',
      data: orderData,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to schedule pickup';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
