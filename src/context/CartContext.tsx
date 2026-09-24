'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Coupon } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalAmount: number;
  totalCount: number;
  // E-Commerce Features (Phase 3)
  couponCode: string | null;
  couponDiscount: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  warrantyProtection: boolean;
  setWarrantyProtection: (enabled: boolean) => void;
  protectionCost: number;
  finalPayableAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Coupons & Protection Plan Add-On
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [warrantyProtection, setWarrantyProtection] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('selbar_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem('selbar_coupon');
      if (savedCoupon) {
        const parsed = JSON.parse(savedCoupon);
        setCouponCode(parsed.code);
        setCouponDiscount(parsed.discount);
        setAppliedCoupon(parsed.coupon);
      }
      const savedProtection = localStorage.getItem('selbar_protection');
      if (savedProtection) {
        setWarrantyProtection(JSON.parse(savedProtection));
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('selbar_cart', JSON.stringify(items));
      } catch {
        // ignore
      }
    }
  }, [items, mounted]);

  useEffect(() => {
    if (mounted) {
      try {
        if (appliedCoupon) {
          localStorage.setItem('selbar_coupon', JSON.stringify({
            code: couponCode,
            discount: couponDiscount,
            coupon: appliedCoupon
          }));
        } else {
          localStorage.removeItem('selbar_coupon');
        }
      } catch {
        // ignore
      }
    }
  }, [appliedCoupon, couponCode, couponDiscount, mounted]);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('selbar_protection', JSON.stringify(warrantyProtection));
      } catch {
        // ignore
      }
    }
  }, [warrantyProtection, mounted]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => {
    setItems([]);
    removeCoupon();
    setWarrantyProtection(false);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const protectionCost = warrantyProtection && items.length > 0 ? 499 : 0;

  // Re-verify coupon against subtotal whenever items change
  useEffect(() => {
    if (appliedCoupon && totalAmount < appliedCoupon.minOrderValue) {
      setCouponCode(null);
      setCouponDiscount(0);
      setAppliedCoupon(null);
    } else if (appliedCoupon) {
      if (appliedCoupon.discountType === 'flat') {
        setCouponDiscount(Math.min(appliedCoupon.discountValue, totalAmount));
      } else {
        let disc = Math.round((totalAmount * appliedCoupon.discountValue) / 100);
        if (appliedCoupon.maxDiscount && disc > appliedCoupon.maxDiscount) {
          disc = appliedCoupon.maxDiscount;
        }
        setCouponDiscount(disc);
      }
    }
  }, [totalAmount, appliedCoupon]);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (!code.trim()) {
      return { success: false, message: 'Please enter a coupon code' };
    }

    try {
      const res = await fetch('/api/v1/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'validate', code: code.trim(), subtotal: totalAmount }),
      });
      const data = await res.json();
      if (!data.success) {
        return { success: false, message: data.message || 'Invalid coupon code' };
      }

      setCouponCode(data.coupon.code);
      setCouponDiscount(data.discount);
      setAppliedCoupon(data.coupon);
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: 'Failed to validate coupon' };
    }
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setCouponDiscount(0);
    setAppliedCoupon(null);
  };

  const finalPayableAmount = Math.max(0, totalAmount + protectionCost - couponDiscount);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalAmount,
        totalCount,
        couponCode,
        couponDiscount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        warrantyProtection,
        setWarrantyProtection,
        protectionCost,
        finalPayableAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
