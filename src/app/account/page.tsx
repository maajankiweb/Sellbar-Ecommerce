'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import OrderMilestoneStepper from '@/components/account/OrderMilestoneStepper';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { SellOrder, BuyOrder } from '@/types';
import {
  User,
  Phone,
  MapPin,
  Package,
  Calendar,
  Clock,
  ArrowRight,
  LogOut,
  Sparkles,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  RotateCcw,
  FileText,
  Heart,
  ShoppingCart,
  AlertCircle,
  Mail,
  Award,
  Check,
} from 'lucide-react';

import {
  AUTHORIZED_LOCATIONS,
  validateServiceLocation,
  SERVICE_RESTRICTION_ERROR_MESSAGE,
} from '@/lib/location/config';

export default function AccountPage() {
  const {
    user,
    isLoggedIn,
    logout,
    setIsAuthModalOpen,
    addAddress,
    updateProfile,
    profileCompletionPercent,
    isProfileComplete,
  } = useAuth();
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState<'buy' | 'profile' | 'returns' | 'sell' | 'wishlist' | 'addresses'>('buy');
  const [sellOrders, setSellOrders] = useState<SellOrder[]>([]);
  const [buyOrders, setBuyOrders] = useState<BuyOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Edit State
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editUpi, setEditUpi] = useState(user?.payoutUpi || '');
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditEmail(user.email || '');
      setEditUpi(user.payoutUpi || '');
    }
  }, [user]);

  // Address add form toggle
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newFlat, setNewFlat] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Bettiah');
  const [newState, setNewState] = useState('Bihar');
  const [newPin, setNewPin] = useState('845438');
  const [addrError, setAddrError] = useState('');

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('selbar_wishlist');
      if (saved) {
        setWishlistIds(JSON.parse(saved));
      }
    } catch {}
  }, []);

  useEffect(() => {
    async function loadUserOrders() {
      try {
        const [sellRes, buyRes] = await Promise.all([
          fetch('/api/v1/orders/sell'),
          fetch('/api/v1/orders/buy'),
        ]);
        const sellData = await sellRes.json();
        const buyData = await buyRes.json();
        if (sellData.success) setSellOrders(sellData.data);
        if (buyData.success) setBuyOrders(buyData.data);
      } catch {
        // ignore
      } finally {
        setLoadingOrders(false);
      }
    }
    loadUserOrders();
  }, []);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlat || !newStreet) return;

    const check = validateServiceLocation({ city: newCity, pincode: newPin });
    if (!check.isServiceable) {
      setAddrError(check.error || SERVICE_RESTRICTION_ERROR_MESSAGE);
      return;
    }

    addAddress({
      fullName: user?.name || '',
      phone: user?.phone || '',
      flatNo: newFlat,
      street: newStreet,
      city: newCity,
      state: newState,
      pincode: newPin,
    });

    setNewFlat('');
    setNewStreet('');
    setAddrError('');
    setShowAddressForm(false);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const next = prev.filter((id) => id !== productId);
      try {
        localStorage.setItem('selbar_wishlist', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const returnOrders = buyOrders.filter((o) => !!o.returnRequest);

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign in to Access Your Account</h2>
        <p className="text-xs text-slate-500">
          Track active shipments, view GST invoices, raise 5-day return requests, and manage doorstep addresses in West Champaran.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
        >
          Sign In with Mobile OTP
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-black text-2xl shadow-md shadow-emerald-600/20">
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mb-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Customer • West Champaran Hub</span>
            </div>
            <h1 className="text-xl font-black text-slate-900">{user?.name}</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3.5 h-3.5" />
              <span>+91 {user?.phone}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right text-xs">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Policy Protected</span>
            <span className="font-bold text-emerald-700">5-Day Replacement</span>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-xs font-bold text-slate-600 transition flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Profile Completion Tracker (% Percentage) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
              isProfileComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Account Setup & Security Meter</span>
                {isProfileComplete ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Amazon-Grade Active</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    Action Required
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500">
                {isProfileComplete
                  ? 'All 5 profile milestones verified. Full Amazon-style email notifications and priority doorstep services active.'
                  : 'Complete all 5 milestones to activate Amazon-style tracking, doorstep returns, and instant payouts.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-semibold">Completion</span>
              <span className={`text-xl font-black ${isProfileComplete ? 'text-emerald-600' : 'text-amber-600'}`}>
                {profileCompletionPercent}%
              </span>
            </div>
            {!isProfileComplete && (
              <button
                onClick={() => setActiveTab('profile')}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                Complete Setup
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isProfileComplete
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                : 'bg-gradient-to-r from-amber-500 to-emerald-500'
            }`}
            style={{ width: `${Math.max(5, profileCompletionPercent)}%` }}
          />
        </div>

        {/* 5 Milestones Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-1">
          {/* 1. Mobile OTP */}
          <div className="p-3 rounded-2xl border bg-slate-50/70 border-slate-200 text-xs flex items-center justify-between sm:flex-col sm:items-start gap-1">
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mobile OTP</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
              <Check className="w-3 h-3" /> Verified (20%)
            </span>
          </div>

          {/* 2. Full Name */}
          <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between sm:flex-col sm:items-start gap-1 ${
            user?.name && user.name.trim().length > 2 && user.name !== 'SELBAR Member'
              ? 'bg-slate-50/70 border-slate-200'
              : 'bg-amber-50/50 border-amber-200'
          }`}>
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full Name</span>
            </div>
            {user?.name && user.name.trim().length > 2 && user.name !== 'SELBAR Member' ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                <Check className="w-3 h-3" /> Done (20%)
              </span>
            ) : (
              <button
                onClick={() => setActiveTab('profile')}
                className="text-[11px] font-bold text-amber-700 hover:underline"
              >
                + Add Name
              </button>
            )}
          </div>

          {/* 3. Registered Email */}
          <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between sm:flex-col sm:items-start gap-1 ${
            user?.email && user.email.includes('@')
              ? 'bg-slate-50/70 border-slate-200'
              : 'bg-amber-50/50 border-amber-200'
          }`}>
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              <span>Registered Email</span>
            </div>
            {user?.email && user.email.includes('@') ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 truncate max-w-full">
                <Check className="w-3 h-3 shrink-0" /> Done (20%)
              </span>
            ) : (
              <button
                onClick={() => setActiveTab('profile')}
                className="text-[11px] font-bold text-amber-700 hover:underline"
              >
                + Add Email
              </button>
            )}
          </div>

          {/* 4. Doorstep Address */}
          <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between sm:flex-col sm:items-start gap-1 ${
            user?.addresses && user.addresses.length > 0
              ? 'bg-slate-50/70 border-slate-200'
              : 'bg-amber-50/50 border-amber-200'
          }`}>
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Doorstep Address</span>
            </div>
            {user?.addresses && user.addresses.length > 0 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                <Check className="w-3 h-3" /> Saved (20%)
              </span>
            ) : (
              <button
                onClick={() => setActiveTab('addresses')}
                className="text-[11px] font-bold text-amber-700 hover:underline"
              >
                + Add Address
              </button>
            )}
          </div>

          {/* 5. Payout UPI */}
          <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between sm:flex-col sm:items-start gap-1 ${
            user?.payoutUpi && user.payoutUpi.includes('@')
              ? 'bg-slate-50/70 border-slate-200'
              : 'bg-amber-50/50 border-amber-200'
          }`}>
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Payout UPI ID</span>
            </div>
            {user?.payoutUpi && user.payoutUpi.includes('@') ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                <Check className="w-3 h-3" /> Linked (20%)
              </span>
            ) : (
              <button
                onClick={() => setActiveTab('profile')}
                className="text-[11px] font-bold text-amber-700 hover:underline"
              >
                + Add UPI
              </button>
            )}
          </div>
        </div>

        {/* Informative Security Guarantee Banner */}
        <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl text-[11px] text-emerald-950 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Security Architecture:</strong> Mobile OTP is only used once during first-time signup. All order confirmations, real-time shipment updates, and GST tax invoices are delivered to your registered email (<code className="font-mono text-emerald-800">{user?.email || 'Registered Email'}</code>). No recurring mobile OTP interruptions will occur.
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('buy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
            activeTab === 'buy'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Buy Orders ({buyOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile Setup ({profileCompletionPercent}%)</span>
        </button>

        <button
          onClick={() => setActiveTab('returns')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
            activeTab === 'returns'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>5-Day Returns ({returnOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sell')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
            activeTab === 'sell'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Sell Orders ({sellOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
            activeTab === 'wishlist'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Wishlist ({wishlistIds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
            activeTab === 'addresses'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Saved Addresses ({user?.addresses.length || 0})</span>
        </button>
      </div>

      {/* Tab: Profile Setup & Registered Email Management */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Profile Details & Registered Email</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  {profileCompletionPercent}% Complete
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your registered email is your primary channel for Amazon-style order tracking, invoices, and passwordless sign-ins.
              </p>
            </div>
            {isProfileComplete && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Amazon-Grade Verified</span>
              </span>
            )}
          </div>

          {profileMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{profileMsg}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile({
                name: editName,
                email: editEmail,
                payoutUpi: editUpi,
              });
              setProfileMsg('Profile updated successfully! Profile completion score refreshed.');
              setTimeout(() => setProfileMsg(''), 4000);
            }}
            className="space-y-5 max-w-2xl"
          >
            {/* Mobile (Read-only / Verified) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Mobile Phone Number</span>
                <span className="text-emerald-700 text-[11px] font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Verified via First-Time Signup OTP
                </span>
              </label>
              <div className="flex rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                <span className="px-3.5 py-2.5 bg-slate-100 text-slate-600 text-xs font-semibold border-r border-slate-200">🇮🇳 +91</span>
                <input
                  type="text"
                  readOnly
                  value={user?.phone || ''}
                  className="w-full px-3 py-2.5 text-xs text-slate-600 bg-slate-50 font-mono font-medium focus:outline-none cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                For your security, mobile OTP is never sent again. All future communications use your registered email below.
              </p>
            </div>

            {/* Legal Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Legal Name <span className="text-emerald-600 font-normal">(Contributes 20% to Profile Score)</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs text-slate-800 font-medium"
              />
            </div>

            {/* Registered Primary Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Registered Primary Email ID <span className="text-emerald-600 font-normal">(Contributes 20%)</span></span>
                <span className="text-[11px] text-blue-700 font-semibold flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Amazon-Style Delivery Target
                </span>
              </label>
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs text-slate-800 font-medium"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                We will deliver order confirmations, GST invoices, and 5-day doorstep pickup alerts exclusively to this address.
              </p>
            </div>

            {/* Payout UPI ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Instant Payout UPI ID <span className="text-emerald-600 font-normal">(Contributes 20%)</span></span>
                <span className="text-[11px] text-emerald-700 font-semibold">Instant UPI Transfers</span>
              </label>
              <input
                type="text"
                placeholder="yourname@upi or mobile@paytm"
                value={editUpi}
                onChange={(e) => setEditUpi(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs text-slate-800 font-medium"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Used for instant doorstep sell cash payouts and 5-day return full refunds directly into your bank account.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Profile Changes & Recalculate %</span>
              </button>

              {editEmail && editEmail.includes('@') && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/v1/notifications', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          recipient: editEmail,
                          title: 'Test Delivery: SELBAR Notification Active',
                          message: `Your registered email ${editEmail} is verified for Amazon-style order tracking and GST invoices.`,
                          type: 'SYSTEM_ANNOUNCEMENT',
                        }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        setProfileMsg(`Test email dispatched successfully to ${editEmail}! Check your inbox or In-App Notification Center.`);
                      }
                    } catch {
                      setProfileMsg('Failed to send test email.');
                    }
                  }}
                  className="px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span>Send Test Email</span>
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Tab 1: Buy Orders */}
      {activeTab === 'buy' && (
        <div className="space-y-4">
          {buyOrders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No Refurbished Orders Yet</h3>
              <p className="text-xs text-slate-500 mt-1">Browse quality-inspected phones and laptops with 12 months warranty.</p>
              <Link
                href="/buy"
                className="mt-4 inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Browse Refurbished Store
              </Link>
            </div>
          ) : (
            buyOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={order.items[0]?.image}
                    alt={order.items[0]?.title}
                    className="w-16 h-16 object-contain rounded-2xl bg-slate-50 p-1 border border-slate-100 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate max-w-xs">
                        {order.items[0]?.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {order.state}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tracking: <span className="font-mono text-slate-800">{order.trackingNumber}</span> • {order.paymentMethod}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span>Order #{order.id}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">5-Day Replacement Covered</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Paid</span>
                    <span className="text-base font-black text-slate-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/order/buy/${order.id}/invoice`}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 shrink-0"
                      title="Tax Invoice"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-600" />
                      <span>Invoice</span>
                    </Link>

                    <Link
                      href={`/order/buy/${order.id}`}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0"
                    >
                      <span>Track Shipment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: 5-Day Returns & Replacements */}
      {activeTab === 'returns' && (
        <div className="space-y-4">
          {returnOrders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <RotateCcw className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No Active Return Requests</h3>
              <p className="text-xs text-slate-500 mt-1">
                You have a 5-day replacement guarantee on all refurbished orders. If you ever need a swap, raise it from your order tracking page.
              </p>
            </div>
          ) : (
            returnOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 bg-white rounded-3xl border border-amber-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">
                        Ticket #{order.returnRequest?.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
                        {order.returnRequest?.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 font-semibold">
                      {order.returnRequest?.type}: {order.returnRequest?.reason}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Scheduled Pickup: {order.returnRequest?.pickupSlot.date} ({order.returnRequest?.pickupSlot.window}) at {order.shippingAddress.city}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/order/buy/${order.id}`}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shrink-0"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Sell Orders */}
      {activeTab === 'sell' && (
        <div className="space-y-6">
          {/* 5.1 Real-Time Milestone Stepper Tracker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Live Buyback Milestone Stepper
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time order progress, verified executive contact, and instant UPI UTR payout receipt.
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ⚡ Instant UPI Payout
              </span>
            </div>

            <OrderMilestoneStepper
              orderId={sellOrders[0]?.id || 'SB-88219'}
              orderType="sell"
              currentStage={
                sellOrders[0]?.state === 'PAID'
                  ? 'completed'
                  : sellOrders[0]?.state === 'INSPECTED'
                  ? 'inspected'
                  : 'assigned'
              }
              deviceTitle={
                sellOrders[0]?.deviceSummary
                  ? `${sellOrders[0].deviceSummary.brand} ${sellOrders[0].deviceSummary.model}`
                  : 'iPhone 13 Pro (128GB - Graphite)'
              }
              amount={sellOrders[0]?.quotedPrice || 38500}
              scheduledDate={sellOrders[0]?.pickupSlot?.date || 'Today, 2:30 PM'}
              scheduledTime={sellOrders[0]?.pickupSlot?.window || 'Afternoon Slot'}
              technicianName="Vikram Sharma"
              technicianPhone="+91 98765 43210"
              utrNumber="UTR983204918234"
              upiId={user?.payoutUpi || 'user@okhdfcbank'}
            />
          </div>

          {sellOrders.length > 0 && (
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                All Buyback Orders ({sellOrders.length})
              </h4>
            </div>
          )}

          {sellOrders.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No Past Sell Orders</h3>
              <p className="text-xs text-slate-500 mt-1">Ready to sell? Get instant valuation and free doorstep pickup in West Champaran.</p>
              <Link
                href="/sell"
                className="mt-4 inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 transition"
              >
                Sell a Device Now
              </Link>
            </div>
          ) : (
            sellOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={order.deviceSummary.image}
                    alt={order.deviceSummary.model}
                    className="w-14 h-14 object-contain rounded-2xl bg-slate-50 p-1 border border-slate-100"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {order.deviceSummary.brand} {order.deviceSummary.model}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {order.state.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pickup: {order.pickupSlot.date} ({order.pickupSlot.window})
                    </p>
                    <span className="text-[11px] text-slate-400">Order ID: #{order.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Payout</span>
                    <span className="text-base font-black text-emerald-700">₹{order.quotedPrice.toLocaleString('en-IN')}</span>
                  </div>

                  <Link
                    href={`/order/sell/${order.id}`}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0"
                  >
                    <span>Track Status</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          {wishlistIds.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-500 mt-1">Tap the heart icon on any refurbished device to save it for later.</p>
              <Link
                href="/buy"
                className="mt-4 inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Browse Devices
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistIds.map((id) => (
                <div key={id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Saved Device</span>
                    <h4 className="text-xs font-bold text-slate-900">Device #{id}</h4>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">5-Day Return Guarantee</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/buy"
                      className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                      title="View in Store"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(id)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Saved Addresses (Restricted to West Champaran) */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Doorstep Delivery & Pickup Addresses</h3>
              <p className="text-xs text-slate-500">Restricted to authorized hubs in West Champaran, Bihar</p>
            </div>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          {showAddressForm && (
            <form onSubmit={handleSaveAddress} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900">Add West Champaran Address</h4>

              {addrError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{addrError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Flat / House No."
                  value={newFlat}
                  onChange={(e) => setNewFlat(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl"
                />
                <input
                  type="text"
                  required
                  placeholder="Street / Locality"
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={newCity}
                  onChange={(e) => {
                    const sel = e.target.value;
                    setNewCity(sel);
                    const loc = AUTHORIZED_LOCATIONS.find((l) => l.name === sel);
                    if (loc && loc.pincodes.length > 0) {
                      setNewPin(loc.pincodes[0]);
                    }
                  }}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                >
                  {AUTHORIZED_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name} (West Champaran)
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="PIN Code"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                />

                <input
                  type="text"
                  readOnly
                  value="Bihar"
                  className="px-3 py-2 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl cursor-not-allowed"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-xs">
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user?.addresses.map((addr) => (
              <div key={addr.id} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{addr.fullName}</span>
                  {addr.isDefault && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-slate-600">{addr.flatNo}, {addr.street}</p>
                <p className="text-slate-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                <p className="text-slate-500">Phone: {addr.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
