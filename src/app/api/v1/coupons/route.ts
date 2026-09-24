import { NextResponse } from 'next/server';
import {
  getAllCoupons,
  validateCoupon,
  addCoupon,
  toggleCouponStatus,
  deleteCoupon,
} from '@/lib/db/couponsStore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin') === 'true';
    const coupons = getAllCoupons(!admin);
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'validate') {
      const { code, subtotal } = body;
      if (!code) {
        return NextResponse.json({ success: false, message: 'Coupon code is required' }, { status: 400 });
      }
      const result = validateCoupon(code, Number(subtotal) || 0);
      if (!result.valid) {
        return NextResponse.json({ success: false, message: result.error, discount: 0 }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        discount: result.discount,
        coupon: result.coupon,
        message: `Coupon ${result.coupon?.code} applied! Saved ₹${result.discount.toLocaleString('en-IN')}`,
      });
    }

    if (action === 'create') {
      const { code, discountType, discountValue, minOrderValue, maxDiscount, description, expiresAt } = body;
      if (!code || !discountValue) {
        return NextResponse.json({ success: false, message: 'Code and discount value required' }, { status: 400 });
      }
      const created = addCoupon({
        code,
        discountType: discountType || 'flat',
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue) || 0,
        maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
        description: description || `Save on your order with ${code}`,
        expiresAt: expiresAt || '2026-12-31T23:59:59Z',
        isActive: true,
      });
      return NextResponse.json({ success: true, coupon: created });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Coupon ID required' }, { status: 400 });
    }
    const updated = toggleCouponStatus(id);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, coupon: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Coupon ID required' }, { status: 400 });
    }
    const deleted = deleteCoupon(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
