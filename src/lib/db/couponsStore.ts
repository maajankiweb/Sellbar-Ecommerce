import { Coupon } from '@/types';

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-selbar500',
    code: 'SELBAR500',
    discountType: 'flat',
    discountValue: 500,
    minOrderValue: 9999,
    description: 'Flat ₹500 instant discount on orders above ₹9,999',
    expiresAt: '2026-12-31T23:59:59Z',
    isActive: true,
  },
  {
    id: 'coup-welcome10',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 4999,
    maxDiscount: 1500,
    description: 'Get 10% OFF up to ₹1,500 on your refurbished device purchase',
    expiresAt: '2026-12-31T23:59:59Z',
    isActive: true,
  },
  {
    id: 'coup-festive2000',
    code: 'FESTIVE2000',
    discountType: 'flat',
    discountValue: 2000,
    minOrderValue: 34999,
    description: 'Flat ₹2,000 festival off on premium laptops and flagship phones',
    expiresAt: '2026-12-31T23:59:59Z',
    isActive: true,
  },
  {
    id: 'coup-champaran',
    code: 'CHAMPARAN300',
    discountType: 'flat',
    discountValue: 300,
    minOrderValue: 2999,
    description: 'Special ₹300 off for West Champaran local delivery orders',
    expiresAt: '2026-12-31T23:59:59Z',
    isActive: true,
  },
];

let memoryCoupons: Coupon[] = [...INITIAL_COUPONS];

export function getAllCoupons(activeOnly = false): Coupon[] {
  if (activeOnly) {
    return memoryCoupons.filter(c => c.isActive);
  }
  return memoryCoupons;
}

export function validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; coupon?: Coupon; error?: string } {
  const coupon = memoryCoupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
  
  if (!coupon) {
    return { valid: false, discount: 0, error: 'Invalid coupon code. Please try again.' };
  }

  if (!coupon.isActive) {
    return { valid: false, discount: 0, error: 'This coupon has expired or is inactive.' };
  }

  if (new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, discount: 0, error: 'This coupon has expired.' };
  }

  if (subtotal < coupon.minOrderValue) {
    return { 
      valid: false, 
      discount: 0, 
      error: `Minimum order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required for this coupon.` 
    };
  }

  let discount = 0;
  if (coupon.discountType === 'flat') {
    discount = Math.min(coupon.discountValue, subtotal);
  } else {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  }

  return { valid: true, discount, coupon };
}

export function addCoupon(coupon: Omit<Coupon, 'id'>): Coupon {
  const newCoupon: Coupon = {
    ...coupon,
    id: 'coup-' + Date.now(),
    code: coupon.code.toUpperCase().trim(),
  };
  memoryCoupons.unshift(newCoupon);
  return newCoupon;
}

export function toggleCouponStatus(id: string): Coupon | null {
  const c = memoryCoupons.find(item => item.id === id);
  if (!c) return null;
  c.isActive = !c.isActive;
  return c;
}

export function deleteCoupon(id: string): boolean {
  const initialLen = memoryCoupons.length;
  memoryCoupons = memoryCoupons.filter(item => item.id !== id);
  return memoryCoupons.length < initialLen;
}
