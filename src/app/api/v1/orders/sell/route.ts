import { NextResponse } from 'next/server';
import { db } from '@/lib/db/data';
import { SellOrder } from '@/types';

export async function GET() {
  const orders = Array.from(db.sellOrders.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json({ success: true, data: orders });
}

import { validateServiceLocation, SERVICE_RESTRICTION_ERROR_MESSAGE } from '@/lib/location/config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quoteId, customer, pickupAddress, pickupSlot, payoutMode, payoutDetails } = body;

    if (!quoteId || !customer?.name || !customer?.phone || !pickupAddress || !pickupSlot) {
      return NextResponse.json(
        { success: false, error: 'Missing required order fields' },
        { status: 400 }
      );
    }

    // Backend location validation: Must be within authorized West Champaran locations
    const locationCheck = validateServiceLocation({
      city: pickupAddress.city,
      pincode: pickupAddress.pincode,
    });

    if (!locationCheck.isServiceable) {
      return NextResponse.json(
        {
          success: false,
          error: locationCheck.error || SERVICE_RESTRICTION_ERROR_MESSAGE,
          authorizedLocations: ['Bettiah', 'Bagaha', 'Narkatiaganj', 'Ramnagar', 'Lauriya', 'Valmikinagar'],
        },
        { status: 400 }
      );
    }

    const quote = db.quotes.get(quoteId);
    const id = `SEL-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: SellOrder = {
      id,
      quoteId,
      deviceSummary: {
        brand: quote?.brandName || 'Brand',
        model: quote?.modelName || 'Device',
        variant: quote?.variantText || 'Standard',
        image: quote?.modelImage || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      },
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
      },
      pickupAddress,
      pickupSlot,
      payoutMode: payoutMode || 'UPI',
      payoutDetails,
      state: 'PICKUP_SCHEDULED',
      quotedPrice: quote?.finalPrice || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      executive: {
        name: 'Assigned on day of pickup',
        phone: 'Will be shared via SMS',
      },
    };

    db.sellOrders.set(id, newOrder);

    // Mark quote as converted
    if (quote) {
      quote.status = 'converted';
      db.quotes.set(quoteId, quote);
    }

    return NextResponse.json({ success: true, data: newOrder });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
