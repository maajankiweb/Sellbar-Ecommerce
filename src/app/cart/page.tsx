'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import confetti from 'canvas-confetti';
import PaymentModal from '@/components/checkout/PaymentModal';
import {
  Trash2,
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowRight,
  CreditCard,
  Building,
  Banknote,
  MapPin,
  Tag,
  Check,
  X,
  Plus,
  Minus,
  Zap,
  Sparkles,
  Info,
  Gift,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react';

import {
  AUTHORIZED_LOCATIONS,
  validateServiceLocation,
  SERVICE_RESTRICTION_ERROR_MESSAGE,
} from '@/lib/location/config';

export default function CartCheckoutPage() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalAmount,
    couponCode,
    couponDiscount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    warrantyProtection,
    setWarrantyProtection,
    protectionCost,
    finalPayableAmount,
  } = useCart();
  const { user, isLoggedIn, login } = useAuth();

  // Coupon input state
  const [couponInput, setCouponInput] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({
    type: '',
    message: '',
  });
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Checkout shipping address form (West Champaran Target Zone)
  const [fullName, setFullName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [flatNo, setFlatNo] = useState(user?.addresses?.[0]?.flatNo || '');
  const [street, setStreet] = useState(user?.addresses?.[0]?.street || '');
  const [city, setCity] = useState(user?.addresses?.[0]?.city || 'Bettiah');
  const [pincode, setPincode] = useState(user?.addresses?.[0]?.pincode || '845438');
  const [state, setState] = useState('Bihar');

  useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.phone) setPhoneNumber(user.phone);
      if (user.addresses?.[0]) {
        setFlatNo(user.addresses[0].flatNo || '');
        setStreet(user.addresses[0].street || '');
        setCity(user.addresses[0].city || 'Bettiah');
        setPincode(user.addresses[0].pincode || '845438');
      }
    }
  }, [user]);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit/Debit Card' | 'NetBanking' | 'Cash on Delivery'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Payment simulation & OTP modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  // Gift note expander state (Ecommerce 11 feature)
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [giftNote, setGiftNote] = useState('');
  const [giftRecipient, setGiftRecipient] = useState('');

  // Free shipping threshold math (Ecommerce 11 feature)
  const FREE_SHIPPING_THRESHOLD = 50000;
  const freeShippingProgress = Math.min(100, Math.round((totalAmount / FREE_SHIPPING_THRESHOLD) * 100));
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalAmount);
  const qualifiesForFreeShipping = totalAmount >= FREE_SHIPPING_THRESHOLD;

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = codeToApply || couponInput;
    if (!code.trim()) return;
    setIsApplyingCoupon(true);
    setCouponStatus({ type: '', message: '' });
    const res = await applyCoupon(code);
    setIsApplyingCoupon(false);
    if (res.success) {
      setCouponStatus({ type: 'success', message: res.message });
      setCouponInput('');
    } else {
      setCouponStatus({ type: 'error', message: res.message });
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please provide a valid 10-digit phone number');
      return;
    }
    if (!flatNo || !street) {
      setError('Please provide complete shipping address');
      return;
    }

    // Client-side Location Validation: Only West Champaran is permitted
    const locationCheck = validateServiceLocation({ city, pincode });
    if (!locationCheck.isServiceable) {
      setError(locationCheck.error || SERVICE_RESTRICTION_ERROR_MESSAGE);
      return;
    }

    setError('');
    setIsSubmitting(true);

    if (!isLoggedIn) {
      login(phoneNumber, fullName || 'SELBAR Member');
    }

    try {
      const orderPayload = {
        items,
        customer: {
          name: fullName,
          phone: phoneNumber,
          email: `${phoneNumber}@customer.selbar.in`,
        },
        shippingAddress: {
          id: `addr_${Date.now()}`,
          fullName,
          phone: phoneNumber,
          flatNo,
          street,
          pincode,
          city,
          state,
        },
        paymentMethod,
        subtotal: totalAmount,
        discount: couponDiscount,
        couponCode: couponCode || undefined,
        protectionPlan: warrantyProtection,
        shippingFee: 0,
        totalAmount: finalPayableAmount,
      };

      // Create order record in backend
      const res = await fetch('/api/v1/orders/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!data.success || !data.data?.id) {
        setError(data.error || 'Failed to initialize order');
        setIsSubmitting(false);
        return;
      }

      setPendingOrderId(data.data.id);
      setIsSubmitting(false);
      // Open Payment / OTP Modal
      setIsPaymentModalOpen(true);
    } catch {
      setError('Network connection error. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    clearCart();
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch {}
    if (pendingOrderId) {
      router.push(`/order/buy/${pendingOrderId}`);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Explore certified refurbished phones & laptops with 32-point QC inspection, 12 months warranty, and a 5-day easy replacement policy!
        </p>
        <Link
          href="/buy"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
        >
          <span>Browse Refurbished Store</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Payment / COD OTP Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        method={paymentMethod}
        amount={finalPayableAmount}
        phoneNumber={phoneNumber}
        customerName={fullName}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
            Review Cart & Checkout
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Doorstep Delivery & 5-Day Hassle-Free Replacement Guarantee in West Champaran
          </p>
        </div>

        {/* Local Fast Delivery Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-800 self-start sm:self-auto">
          <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
          <span>⚡ 24–48 Hr Doorstep Delivery in {city}</span>
        </div>
      </div>

      {/* Dynamic Free Shipping Milestone Progress Bar (Ecommerce 11 feature) */}
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
          <span>Standard Surface Delivery</span>
          <span className="font-bold text-emerald-700">₹50,000 Milestone (Free Armored Courier)</span>
        </div>
      </div>

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Cart Items & Shipping Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Items card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Items in Order ({items.length})</span>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-rose-600 font-semibold hover:underline"
              >
                Clear All
              </button>
            </h2>

            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0 items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-contain rounded-xl bg-slate-50 border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 truncate">{item.title}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-bold text-emerald-700 uppercase">Grade {item.grade}</span>
                      <span>•</span>
                      <span>{item.storage}</span>
                      <span>•</span>
                      <span>{item.color}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ₹{(item.originalMrp * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 py-0.5 text-xs font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Protection Plan Add-On Card (Phase 3) */}
          <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="space-y-1.5 max-w-md">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>Value Added Protection</span>
                </div>
                <h3 className="text-sm font-bold text-white">
                  SELBAR Complete Care (+1 Year Screen & Liquid Damage Cover)
                </h3>
                <p className="text-xs text-slate-300">
                  Protect against accidental drops, liquid spills & screen cracks with 100% free doorstep pickup in West Champaran.
                </p>
                <div className="text-xs font-bold text-emerald-400 pt-1">
                  Only ₹499 <span className="text-[11px] text-slate-400 font-normal line-through">₹1,499</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setWarrantyProtection(!warrantyProtection)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                  warrantyProtection
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                {warrantyProtection ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* GIFT-NOTE EXPANDER (Ecommerce 11 Feature) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <button
              type="button"
              onClick={() => setIsGiftOpen(!isGiftOpen)}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/60">
                  <Gift className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Ordering as a Gift? Include Personalized Unboxing Note
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Complimentary premium gift card & sealed invoice price suppression
                  </span>
                </div>
              </div>
              {isGiftOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {isGiftOpen && (
              <div className="pt-3 border-t border-slate-100 space-y-3 text-xs animate-in fade-in-0 duration-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    value={giftRecipient}
                    onChange={(e) => setGiftRecipient(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00a599]/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Personalized Message (Printed on Embossed Card)
                  </label>
                  <textarea
                    rows={2}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    maxLength={160}
                    placeholder="e.g. Happy Birthday! Enjoy your certified flagship device from SELBAR."
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00a599]/20 resize-none"
                  />
                  <div className="text-[10px] text-slate-400 text-right">
                    {giftNote.length}/160 characters
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delivery Address Form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Doorstep Delivery Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Flat / House No.</label>
                <input
                  type="text"
                  required
                  value={flatNo}
                  onChange={(e) => setFlatNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street / Colony</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City / Hub (West Champaran) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setCity(selected);
                    const loc = AUTHORIZED_LOCATIONS.find((l) => l.name === selected);
                    if (loc && loc.pincodes.length > 0) {
                      setPincode(loc.pincodes[0]);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  {AUTHORIZED_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name} (West Champaran)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PIN Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 845438"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  readOnly
                  value="Bihar (West Champaran)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-500 cursor-not-allowed focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Select Payment Method</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3.5 rounded-2xl border-2 text-left transition ${
                  paymentMethod === 'UPI' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>UPI / Instant QR</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Google Pay, PhonePe, Paytm</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Credit/Debit Card')}
                className={`p-3.5 rounded-2xl border-2 text-left transition ${
                  paymentMethod === 'Credit/Debit Card' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Cards / EMI</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Visa, Mastercard, RuPay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NetBanking')}
                className={`p-3.5 rounded-2xl border-2 text-left transition ${
                  paymentMethod === 'NetBanking' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <Building className="w-4 h-4 text-emerald-600" />
                  <span>Net Banking</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">All major Indian banks</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`p-3.5 rounded-2xl border-2 text-left transition ${
                  paymentMethod === 'Cash on Delivery' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>Cash on Delivery</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">With OTP verification at checkout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Order Summary & Coupon Engine (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Coupon Code Card (Phase 3) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600" />
              <span>Apply Coupons & Promo Codes</span>
            </h2>

            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{appliedCoupon.code} Applied</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Saved ₹{couponDiscount.toLocaleString('en-IN')} on this order!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="p-1 rounded-md text-emerald-800 hover:text-rose-600 hover:bg-emerald-100/60 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter promo code (e.g. SELBAR500)"
                    className="flex-1 px-3 py-2 text-xs font-mono font-bold uppercase rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={isApplyingCoupon || !couponInput.trim()}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                  >
                    {isApplyingCoupon ? '...' : 'Apply'}
                  </button>
                </div>

                {couponStatus.message && (
                  <p
                    className={`text-[11px] font-medium ${
                      couponStatus.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {couponStatus.message}
                  </p>
                )}

                {/* Quick Suggestion Pills */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">
                    Available Offers
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['SELBAR500', 'WELCOME10', 'FESTIVE2000', 'CHAMPARAN300'].map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleApplyCoupon(code)}
                        className="px-2.5 py-1 rounded-lg border border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold transition"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4 sticky top-24">
            <h2 className="text-sm font-bold text-slate-900">Order Summary</h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-semibold text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>

              {warrantyProtection && (
                <div className="flex justify-between text-slate-600">
                  <span>Complete Care (+1 Yr Protection)</span>
                  <span className="font-semibold text-slate-900">+₹{protectionCost.toLocaleString('en-IN')}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Savings ({appliedCoupon?.code})</span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Insured Doorstep Shipping</span>
                <span className="text-emerald-700 font-bold uppercase">FREE</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>12-Month Assured Warranty</span>
                <span className="text-emerald-700 font-bold uppercase">INCLUDED</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-extrabold text-slate-950">
                <span>Total Payable</span>
                <span className="text-emerald-700">₹{finalPayableAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* No-Cost EMI Calculator Box */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                <span>No-Cost EMI available from</span>
              </span>
              <span className="font-black text-slate-900">
                ₹{Math.round(finalPayableAmount / 3).toLocaleString('en-IN')}/mo
              </span>
            </div>

            {/* Strictly 5-Day Return Policy Badge */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">5-Day Hassle-Free Replacement Guarantee</strong>
                <span>
                  Inspect at doorstep. Swap or return device within 5 days of delivery with free reverse pickup in West Champaran.
                </span>
              </div>
            </div>

            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <span>
                {isSubmitting
                  ? 'Initializing...'
                  : `Proceed to Payment (₹${finalPayableAmount.toLocaleString('en-IN')})`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
