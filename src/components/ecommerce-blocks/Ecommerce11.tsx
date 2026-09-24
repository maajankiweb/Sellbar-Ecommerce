'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  Trash2,
  Plus,
  Minus,
  Truck,
  Gift,
  CheckCircle2,
  ShieldCheck,
  Tag,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ShoppingBag,
  RotateCcw,
} from 'lucide-react';

/* =========================================================================
   ECOMMERCE 11: CART REVIEW WITH ANIMATED LINE ITEMS, FREE-SHIPPING
   PROGRESS, GIFT-NOTE EXPANDER & STICKY ORDER SUMMARY
   React Bits Pro Block Specification
   ========================================================================= */

interface CartItem {
  id: string;
  name: string;
  color: string;
  grade: string;
  storage?: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  inStock: boolean;
  warranty: string;
}

const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 'cart-1',
    name: 'Apple iPhone 15 Pro Max',
    color: 'Natural Titanium',
    grade: 'Grade A Superb',
    storage: '256GB',
    price: 78999,
    originalPrice: 159900,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    warranty: '12 Months SELBAR Full Coverage',
  },
  {
    id: 'cart-2',
    name: 'Apple Watch Ultra 2 (GPS + Cellular)',
    color: 'Titanium Case / Orange Ocean Band',
    grade: 'Grade A+ Like New',
    storage: '49mm',
    price: 49999,
    originalPrice: 89900,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    warranty: '6 Months Battery & Sensor Warranty',
  },
  {
    id: 'cart-3',
    name: 'Sony WH-1000XM5 Noise Canceling Headphones',
    color: 'Silver',
    grade: 'Open Box Flawless',
    price: 18999,
    originalPrice: 34990,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    warranty: '6 Months SELBAR Express Replacement',
  },
];

const FREE_SHIPPING_THRESHOLD = 150000; // Rs. 1,50,000 for VIP Express Courier

export interface Ecommerce11Props {
  onCheckout?: () => void;
}

export function Ecommerce11({ onCheckout }: Ecommerce11Props = {}) {
  const router = useRouter();
  const globalCart = useCart();
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [giftNote, setGiftNote] = useState('');
  const [giftRecipient, setGiftRecipient] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [couponError, setCouponError] = useState('');

  // Sync with globalCart if it has items
  useEffect(() => {
    if (globalCart?.items && globalCart.items.length > 0) {
      const mapped: CartItem[] = globalCart.items.map((gItem) => ({
        id: gItem.id,
        name: gItem.title,
        color: gItem.color || 'Standard',
        grade: gItem.grade?.toUpperCase() || 'SUPERB',
        storage: gItem.storage || '128GB',
        price: gItem.price,
        originalPrice: gItem.originalMrp || Math.round(gItem.price * 1.35),
        quantity: gItem.quantity,
        image: gItem.image,
        inStock: true,
        warranty: `${gItem.warrantyMonths || 12} Months SELBAR Assured`,
      }));
      setItems(mapped);
    }
  }, [globalCart?.items]);

  // Cart calculations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const originalTotal = items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  const totalSavings = originalTotal - subtotal + (appliedDiscount || 0);

  // Free shipping math
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  // Handlers
  const handleQuantityChange = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'SELBARPROMO' || clean === 'REACTBITS') {
      setAppliedDiscount(2500);
      setCouponError('');
    } else if (clean === '') {
      setCouponError('Please enter a voucher code');
    } else {
      setCouponError('Invalid promo code. Try "SELBARPROMO" or "REACTBITS"');
    }
  };

  const finalTotal = Math.max(0, subtotal - (appliedDiscount || 0));

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-8 lg:p-10 my-6 space-y-8">
      {/* SECTION BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <span className="text-[11px] font-bold text-[#00a599] uppercase tracking-wider flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5" />
            Ecommerce 11 Block • Cart Review & Sticky Order Summary
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Your Cart ({items.reduce((s, i) => s + i.quantity, 0)} items)
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>NIST 800-88 Sanitized Tech</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>15-Day Return Window</span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          FREE-SHIPPING DYNAMIC PROGRESS BAR
          ===================================================================== */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-50/70 via-[#eef7f6] to-emerald-50/70 border border-[#00a599]/20 shadow-2xs">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#00a599] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Truck className="w-4 h-4" />
            </div>
            {qualifiesForFreeShipping ? (
              <span className="text-emerald-800 font-extrabold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Congratulations! You unlocked FREE Armored Express Courier Delivery!
              </span>
            ) : (
              <span>
                Add{' '}
                <span className="text-[#00a599] font-black">
                  ₹{amountToFreeShipping.toLocaleString('en-IN')}
                </span>{' '}
                more to unlock <strong className="text-slate-900">FREE Armored Express Shipping</strong>
              </span>
            )}
          </div>
          <span className="text-xs font-black text-[#00a599] shrink-0">{freeShippingProgress}%</span>
        </div>

        {/* Progress Track */}
        <div className="w-full bg-white/80 rounded-full h-2.5 overflow-hidden border border-[#00a599]/20 shadow-inner">
          <div
            className="bg-gradient-to-r from-[#00a599] to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500 font-medium">
          <span>Standard Surface (₹249)</span>
          <span className="font-bold text-emerald-700">₹1,50,000 Milestone (Free Priority Air)</span>
        </div>
      </div>

      {/* =====================================================================
          MAIN LAYOUT: LINE ITEMS (7 COLS) vs STICKY SUMMARY (5 COLS)
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ===================================================================
            LEFT COLUMN: ANIMATED LINE ITEMS & GIFT NOTE EXPANDER (7 Cols)
            =================================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {items.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-lg">Your bag is empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore certified refurbished smartphones, premium smartwatches, and audiophile gear.
              </p>
              <button
                type="button"
                onClick={() => setItems(INITIAL_CART_ITEMS)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-[#00a599] text-white font-bold text-xs hover:bg-[#008f84] transition cursor-pointer"
              >
                Reset Demo Items
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 group"
                >
                  {/* Thumbnail Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-50 border border-slate-100 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-[#00a599] bg-[#eef7f6] px-2 py-0.5 rounded-full">
                        {item.grade}
                      </span>
                      {item.storage && (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.storage}
                        </span>
                      )}
                    </div>

                    <h3 className="font-black text-slate-900 text-sm sm:text-base truncate">
                      {item.name}
                    </h3>

                    <p className="text-xs text-slate-500">Colorway: {item.color}</p>

                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.warranty}</span>
                    </div>
                  </div>

                  {/* Quantity & Pricing Controls */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <div className="font-black text-slate-950 text-base">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-slate-400 line-through">
                        ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Stepper */}
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200/80 transition cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200/80 transition cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =================================================================
              GIFT-NOTE EXPANDER
              ================================================================= */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs transition-all">
            <button
              type="button"
              onClick={() => setIsGiftOpen(!isGiftOpen)}
              className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/80 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Add Custom Gift Message & Premium Unboxing Wrap</span>
                    <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Complimentary
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Include a personalized greeting card printed on recycled paperboard
                  </p>
                </div>
              </div>
              {isGiftOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {isGiftOpen && (
              <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      value={giftRecipient}
                      onChange={(e) => setGiftRecipient(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00a599] text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Occasion
                    </label>
                    <select className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00a599] text-slate-800">
                      <option>Birthday Celebration</option>
                      <option>Graduation / New Job Tech Gift</option>
                      <option>Festival / Diwali Celebration</option>
                      <option>Corporate Milestone</option>
                      <option>Just Because</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      Personal Note (Hand-inscribed card)
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {giftNote.length}/160 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={160}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Write your personal message here. It will be printed with pride on SELBAR eco-stationery..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00a599] text-slate-800 resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/50">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Your invoice and prices will be hidden from the parcel packing slip.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===================================================================
            RIGHT COLUMN: STICKY ORDER SUMMARY MODULE (5 Cols)
            =================================================================== */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-sm space-y-5">
            <h3 className="font-black text-slate-900 text-base sm:text-lg tracking-tight pb-3 border-b border-slate-200">
              Order Summary
            </h3>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 block">
                Have a Promotion / Referral Code?
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponError('');
                    }}
                    placeholder="Enter SELBARPROMO"
                    className="w-full pl-8 pr-3 py-2 text-xs uppercase rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00a599]"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-[#00a599] text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-2xs"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {couponError}
                </p>
              )}
              {appliedDiscount && (
                <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Coupon applied! Instant discount of ₹{appliedDiscount.toLocaleString('en-IN')}
                </p>
              )}
            </form>

            {/* Price Line Breakdown */}
            <div className="space-y-2.5 text-xs pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>32-Point Diagnostics & QC Fee</span>
                <span className="text-emerald-700 font-bold uppercase text-[11px]">
                  FREE (Waived)
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Express Insured Shipping</span>
                <span className={qualifiesForFreeShipping ? 'text-emerald-700 font-bold uppercase text-[11px]' : 'font-bold text-slate-900'}>
                  {qualifiesForFreeShipping ? 'FREE' : '₹249'}
                </span>
              </div>

              {appliedDiscount && (
                <div className="flex items-center justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{appliedDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-600">
                <span>Estimated GST (18% included)</span>
                <span className="text-slate-500 font-medium">Included</span>
              </div>
            </div>

            {/* Total Section */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Total Due
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-950">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full block">
                    Total Savings
                  </span>
                  <span className="text-xs font-black text-emerald-700 mt-0.5 block">
                    ₹{totalSavings.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={() => {
                  if (onCheckout) {
                    onCheckout();
                  } else {
                    router.push('/cart');
                  }
                }}
                className="w-full py-4 px-6 rounded-2xl bg-[#00a599] hover:bg-[#008f84] text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Proceed to Instant Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust Micro-assurances */}
              <div className="pt-3 flex items-center justify-center gap-4 text-[10px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#00a599]" />
                  256-Bit SSL Secured
                </span>
                <span>•</span>
                <span>UPI / Cards / EMI</span>
                <span>•</span>
                <span>CPCB E-Waste Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ecommerce11;
