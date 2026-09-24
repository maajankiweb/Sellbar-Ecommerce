'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Quote, ServiceabilityResult } from '@/types';
import { useAuth } from '@/context/AuthContext';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Clock,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Calendar,
  CreditCard,
  Banknote,
  ArrowRight,
  AlertTriangle,
  Send,
  Building,
  User,
  Phone
} from 'lucide-react';

export default function QuotePage({
  params,
}: {
  params: Promise<{ quoteId: string }>;
}) {
  const router = useRouter();
  const { quoteId } = use(params);
  const { user, isLoggedIn, login } = useAuth();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Breakdown collapsible toggle
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Inline Pincode Check (West Champaran Authorized Zone)
  const [pincode, setPincode] = useState('845438');
  const [pincodeChecking, setPincodeChecking] = useState(false);
  const [serviceability, setServiceability] = useState<ServiceabilityResult | null>({
    pincode: '845438',
    serviceable: true,
    city: 'Bettiah, West Champaran',
    state: 'Bihar',
    deliveryDays: 1,
    pickupAvailable: true,
  });
  const [notifyPhone, setNotifyPhone] = useState('');
  const [notifySaved, setNotifySaved] = useState(false);

  // Pickup Scheduling state
  const [selectedDayOffset, setSelectedDayOffset] = useState(0); // 0=Today, 1=Tomorrow, etc.
  const [selectedSlot, setSelectedSlot] = useState<'Morning (9 AM - 1 PM)' | 'Afternoon (1 PM - 5 PM)' | 'Evening (5 PM - 8 PM)'>('Morning (9 AM - 1 PM)');

  // Address form
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [flatNo, setFlatNo] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');

  // Payout Mode
  const [payoutMode, setPayoutMode] = useState<'UPI' | 'Bank Transfer' | 'Instant Cash'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');

  // Scheduling submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Fetch quote
  useEffect(() => {
    async function fetchQuote() {
      try {
        const res = await fetch(`/api/v1/quote/${quoteId}`);
        const data = await res.json();
        if (data.success) {
          setQuote(data.data);
        } else {
          setError(data.error || 'Quote not found');
        }
      } catch {
        setError('Failed to fetch valuation quote.');
      } finally {
        setLoading(false);
      }
    }
    fetchQuote();
  }, [quoteId]);

  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name);
      if (!phone) setPhone(user.phone);
    }
  }, [user, fullName, phone]);

  // Handle inline pincode check
  const handleCheckPincode = async (code: string) => {
    setPincode(code);
    if (code.trim().length === 6) {
      setPincodeChecking(true);
      try {
        const res = await fetch(`/api/v1/serviceability?pincode=${code}`);
        const data = await res.json();
        if (data.success) {
          setServiceability(data.data);
        }
      } catch {
        // ignore
      } finally {
        setPincodeChecking(false);
      }
    }
  };

  // Generate 5 days slots
  const days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      offset: i,
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short' }),
      dateFormatted: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      fullDateString: d.toISOString().split('T')[0],
    };
  });

  const handleConfirmPickup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote) return;

    if (!phone || phone.length < 10) {
      setBookingError('Please provide a valid 10-digit phone number');
      return;
    }
    if (!flatNo || !street) {
      setBookingError('Please provide complete house/flat and street address');
      return;
    }
    if (serviceability && !serviceability.serviceable) {
      setBookingError('Currently, SELBAR services are exclusively active in West Champaran, Bihar (Bagaha, Bettiah, Lauriya, Ramnagar, Valmikinagar, Narkatiaganj). Doorstep pickup is not available outside this region.');
      return;
    }

    setBookingError('');
    setIsSubmitting(true);

    // Auto-login user if not logged in
    if (!isLoggedIn) {
      login(phone, fullName || 'SELBAR Customer');
    }

    try {
      const selectedDate = days[selectedDayOffset].fullDateString;

      const orderPayload = {
        quoteId: quote.id,
        customer: {
          name: fullName || 'Customer',
          phone,
        },
        pickupAddress: {
          id: `addr_${Date.now()}`,
          fullName: fullName || 'Customer',
          phone,
          flatNo,
          street,
          landmark,
          pincode,
          city: serviceability?.city || 'Selected City',
          state: serviceability?.state || 'India',
        },
        pickupSlot: {
          date: `${days[selectedDayOffset].label} (${selectedDate})`,
          window: selectedSlot,
        },
        payoutMode,
        payoutDetails: {
          upiId: payoutMode === 'UPI' ? upiId : undefined,
          bankAccountNumber: payoutMode === 'Bank Transfer' ? bankAccount : undefined,
          ifscCode: payoutMode === 'Bank Transfer' ? ifsc : undefined,
        },
      };

      const res = await fetch('/api/v1/orders/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data.success && data.data?.id) {
        // Trigger celebratory confetti!
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }

        router.push(`/order/sell/${data.data.id}`);
      } else {
        setBookingError(data.error || 'Failed to schedule pickup');
        setIsSubmitting(false);
      }
    } catch {
      setBookingError('Network connection error. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-4 text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-base font-bold text-slate-800">Calculating Fair Cash Valuation...</h2>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Quote Expired or Invalid</h2>
        <p className="text-xs text-slate-500 mt-1">{error || 'Please evaluate your device again.'}</p>
        <Link href="/sell" className="mt-4 inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold">
          Start New Valuation
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with 72-hr Price Lock */}
      <div className="bg-emerald-600 text-white p-4 rounded-3xl shadow-lg shadow-emerald-600/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-emerald-200">
              72-Hour Guaranteed Price Lock
            </div>
            <div className="text-xs text-white/90">
              Lock this valuation today to protect against market price drops.
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-xs font-mono font-bold">
          <Clock className="w-3.5 h-3.5 text-emerald-300" />
          <span>Valid for 71h 59m</span>
        </div>
      </div>

      {/* Main Quote Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-slate-50 p-2 border border-slate-100 flex items-center justify-center shrink-0">
              <img src={quote.modelImage} alt={quote.modelName} className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{quote.brandName}</span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950">{quote.modelName}</h1>
              <span className="inline-block px-2 py-0.5 mt-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md">
                {quote.variantText}
              </span>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Instant Doorstep Cash Value
            </span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-700 mt-0.5">
              ₹{quote.finalPrice.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-emerald-800 font-semibold block mt-0.5">
              ✓ Free Doorstep Pickup Included
            </span>
          </div>
        </div>

        {/* Collapsible Itemized Breakdown Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center justify-between transition"
          >
            <span>View Itemized Valuation Breakdown ({quote.breakdown.length} criteria)</span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform ${showBreakdown ? 'rotate-180' : ''}`}
            />
          </button>

          {showBreakdown && (
            <div className="mt-3 p-4 bg-slate-50/70 rounded-2xl border border-slate-200/60 space-y-2 text-xs">
              {quote.breakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-slate-200/40 last:border-0">
                  <div>
                    <span className="font-semibold text-slate-800">{item.title}</span>
                    {item.note && <p className="text-[10px] text-slate-500">{item.note}</p>}
                  </div>
                  <span
                    className={`font-mono font-bold ${
                      item.amount > 0 ? (item.type === 'bonus' ? 'text-emerald-700' : 'text-slate-900') : 'text-rose-600'
                    }`}
                  >
                    {item.amount > 0 && item.type === 'bonus' ? '+' : ''}
                    ₹{item.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Schedule Doorstep Pickup Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold mb-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>Step 2: Schedule Free Doorstep Pickup</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            When & Where Should We Collect Your Device?
          </h2>
          <p className="text-xs text-slate-500">
            Our technician will bring cash/UPI scanner, test the device in 5 minutes, and transfer payment immediately.
          </p>
        </div>

        {bookingError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {bookingError}
          </div>
        )}

        <form onSubmit={handleConfirmPickup} className="space-y-6">
          {/* Inline Pincode Checker (West Champaran Authorized Locations) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Pickup Location & Pincode (West Champaran) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                6 Authorized Hubs Active
              </span>
            </div>

            {/* Quick Hub Selector Chips */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {[
                { name: 'Bettiah', pin: '845438' },
                { name: 'Bagaha', pin: '845105' },
                { name: 'Narkatiaganj', pin: '845455' },
                { name: 'Ramnagar', pin: '845103' },
                { name: 'Lauriya', pin: '845453' },
                { name: 'Valmikinagar', pin: '845107' },
              ].map((loc) => (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => handleCheckPincode(loc.pin)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                    pincode === loc.pin
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {loc.name} ({loc.pin})
                </button>
              ))}
            </div>

            <div className="flex gap-2 max-w-sm">
              <div className="relative flex-1">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => handleCheckPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 845438 (Bettiah) or 845105 (Bagaha)"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Serviceability Feedback */}
            {serviceability && (
              <div className="mt-2 text-xs">
                {serviceability.serviceable ? (
                  <div className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Free 2-Hour Doorstep Cash Pickup Active in {serviceability.city}, {serviceability.state}</span>
                  </div>
                ) : (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 mt-2 space-y-2">
                    <p className="font-bold text-xs">
                      ⚠️ Unsupported Location (PIN: {serviceability.pincode})
                    </p>
                    <p className="text-[11px] text-rose-700 leading-relaxed">
                      Currently, SELBAR services are exclusively active in <strong>West Champaran, Bihar</strong> (Bagaha, Bettiah, Lauriya, Ramnagar, Valmikinagar, Narkatiaganj). Transactions outside this area cannot be processed.
                    </p>
                    {!notifySaved ? (
                      <div className="flex gap-2 pt-1">
                        <input
                          type="tel"
                          placeholder="Enter your phone for expansion alert"
                          value={notifyPhone}
                          onChange={(e) => setNotifyPhone(e.target.value)}
                          className="px-3 py-1.5 bg-white border border-rose-300 rounded-lg text-xs flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => setNotifySaved(true)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shrink-0"
                        >
                          Notify Me
                        </button>
                      </div>
                    ) : (
                      <span className="text-emerald-700 font-bold">✓ We will SMS you as soon as our hub opens in your region!</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Date Picker (5 Days chips) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Pickup Date
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {days.map((day) => (
                <button
                  type="button"
                  key={day.offset}
                  onClick={() => setSelectedDayOffset(day.offset)}
                  className={`p-3 rounded-2xl border-2 text-center transition ${
                    selectedDayOffset === day.offset
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span className="text-xs block">{day.label}</span>
                  <span className="text-xs font-bold text-slate-800">{day.dateFormatted}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Window Slots */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Time Window
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(
                ['Morning (9 AM - 1 PM)', 'Afternoon (1 PM - 5 PM)', 'Evening (5 PM - 8 PM)'] as const
              ).map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-xl border-2 text-xs font-bold transition flex items-center justify-center gap-2 ${
                    selectedSlot === slot
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{slot}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Customer & Address Form */}
          <div className="pt-2 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pickup Address & Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Suresh Kumar"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number (for OTP & Executive Calls) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Flat / House / Floor No. <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={flatNo}
                  onChange={(e) => setFlatNo(e.target.value)}
                  placeholder="e.g. Flat 304, Tower B"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Street, Colony or Locality <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. Bailey Road, Near Saguna More"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Landmark (Optional)
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Opposite State Bank of India"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Preferred Payout Method */}
          <div className="pt-2 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              How Would You Like to Receive Payment?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPayoutMode('UPI')}
                className={`p-3 rounded-2xl border-2 text-left transition ${
                  payoutMode === 'UPI'
                    ? 'border-emerald-600 bg-emerald-50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Instant UPI</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">GPay, PhonePe, Paytm</span>
              </button>

              <button
                type="button"
                onClick={() => setPayoutMode('Bank Transfer')}
                className={`p-3 rounded-2xl border-2 text-left transition ${
                  payoutMode === 'Bank Transfer'
                    ? 'border-emerald-600 bg-emerald-50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <Building className="w-4 h-4 text-emerald-600" />
                  <span>Bank IMPS</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Direct to Account</span>
              </button>

              <button
                type="button"
                onClick={() => setPayoutMode('Instant Cash')}
                className={`p-3 rounded-2xl border-2 text-left transition ${
                  payoutMode === 'Instant Cash'
                    ? 'border-emerald-600 bg-emerald-50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>Cash on Handover</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Physical currency</span>
              </button>
            </div>

            {payoutMode === 'UPI' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enter UPI ID (e.g. mobile@oksbi / name@paytm)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. suresh@upi"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            )}

            {payoutMode === 'Bank Transfer' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="e.g. 100234908123"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    placeholder="e.g. SBIN0001234"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* What to Keep Ready Checklist (PRD FR-S9) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              What to keep ready for the pickup executive:
            </span>
            <ul className="text-slate-600 space-y-1 list-disc list-inside">
              <li>One valid government photo ID proof (Aadhaar / Driving License / Voter ID)</li>
              <li>Sign out from iCloud (Apple ID) or Google account and backup your data</li>
              <li>Keep the phone charged to at least 40% for rapid 5-minute hardware diagnostics</li>
              <li>Have the original charger/box ready if declared in questionnaire</li>
            </ul>
          </div>

          {/* Confirm & Book Pickup Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-5 h-5 text-emerald-200" />
            <span>{isSubmitting ? 'Booking Doorstep Slot...' : `Confirm Pickup & Lock ₹${quote.finalPrice.toLocaleString('en-IN')}`}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
