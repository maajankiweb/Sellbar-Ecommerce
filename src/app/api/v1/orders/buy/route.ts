import { NextResponse } from 'next/server';
import { db } from '@/lib/db/data';
import { BuyOrder } from '@/types';
import { authenticateRequest } from '@/lib/auth/middleware/authMiddleware';
import { validateServiceLocation, SERVICE_RESTRICTION_ERROR_MESSAGE } from '@/lib/location/config';

export async function GET(request: Request) {
  try {
    const authResult = await authenticateRequest(request);
    if (!authResult.success || !authResult.user) {
      return authResult.response!;
    }

    const { user } = authResult;
    let orders = Array.from(db.buyOrders.values());

    // Authorization: Elevated roles see all orders; normal customers see ONLY their own orders
    const isElevated =
      user.roles.includes('admin') ||
      user.roles.includes('super_admin') ||
      user.roles.includes('support');

    if (!isElevated) {
      const userPhoneClean = (user.phone || '').replace(/\D/g, '');
      const userEmailClean = (user.email || '').toLowerCase();

      orders = orders.filter((o) => {
        const orderPhoneClean = (o.customer?.phone || '').replace(/\D/g, '');
        const orderEmailClean = (o.customer?.email || '').toLowerCase();

        return (
          (userPhoneClean && orderPhoneClean === userPhoneClean) ||
          (userEmailClean && orderEmailClean === userEmailClean)
        );
      });
    }

    orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ success: true, data: orders });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      items,
      customer,
      shippingAddress,
      paymentMethod,
      subtotal,
      discount,
      shippingFee,
      totalAmount,
      couponCode,
      protectionPlan,
    } = body;

    if (!items || items.length === 0 || !customer?.name || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required checkout fields or cart is empty' },
        { status: 400 }
      );
    }

    // Backend location validation: Must be within authorized West Champaran locations
    const locationCheck = validateServiceLocation({
      city: shippingAddress.city,
      pincode: shippingAddress.pincode,
    });

    if (!locationCheck.isServiceable) {
      return NextResponse.json(
        {
          success: false,
          error: locationCheck.error || SERVICE_RESTRICTION_ERROR_MESSAGE,
          authorizedLocations: [
            'Bettiah',
            'Bagaha',
            'Narkatiaganj',
            'Ramnagar',
            'Lauriya',
            'Valmikinagar',
          ],
        },
        { status: 400 }
      );
    }

    // Bind identity if user is authenticated to prevent identity spoofing
    const authResult = await authenticateRequest(request).catch(() => ({ success: false, user: undefined }));
    const authUser = authResult.success ? authResult.user : undefined;
    const customerRecord = {
      name: customer.name.trim(),
      phone: authUser ? authUser.phone : customer.phone,
      email: authUser && authUser.email ? authUser.email : customer.email,
    };

    const id = `BUY-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = `SEL-EXP-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const nowIso = new Date().toISOString();

    const newOrder: BuyOrder = {
      id,
      items,
      customer: customerRecord,
      shippingAddress,
      paymentMethod: paymentMethod || 'UPI',
      subtotal: subtotal || totalAmount,
      discount: discount || 0,
      couponCode: couponCode || undefined,
      protectionPlan: !!protectionPlan,
      shippingFee: shippingFee || 0,
      totalAmount,
      state: 'PLACED',
      trackingNumber,
      courierPartner: 'SELBAR Express Doorstep',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    db.buyOrders.set(id, newOrder);

    return NextResponse.json(
      {
        success: true,
        data: newOrder,
        message: 'Order placed successfully! Confirmation dispatched.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to place order' },
      { status: 500 }
    );
  }
}
