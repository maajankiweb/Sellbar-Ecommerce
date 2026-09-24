'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Recycle,
  ShieldCheck,
  Award,
  Trees,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Smartphone,
  Laptop,
  Tv,
  Headphones,
  SlidersHorizontal,
  FileCheck,
  Gift,
  Check
} from 'lucide-react';

const RECYCLE_CATEGORIES = [
  { id: 'phone', label: '📱 Dead Smartphones', count: '12,450+', reward: 'Up to ₹800' },
  { id: 'laptop', label: '💻 Scrap Laptops', count: '4,210+', reward: 'Up to ₹1,500' },
  { id: 'tablet', label: '📲 Broken Tablets', count: '1,890+', reward: 'Up to ₹600' },
  { id: 'audio', label: '🎧 Audio & Chargers', count: '5,600+', reward: 'Up to ₹200' },
  { id: 'tv', label: '📺 Old TVs & Monitors', count: '920+', reward: 'Up to ₹1,200' },
];

const DEFECT_CONDITIONS = [
  'Motherboard Dead / Won’t Turn On',
  'Severe Water / Moisture Damage',
  'Shattered Glass & Crushed Frame',
  'Bloated / Swollen Battery Hazard',
  'Missing Internal Components'
];

export default function RecyclePage() {
  const [deviceCategory, setDeviceCategory] = useState('phone');
  const [selectedCondition, setSelectedCondition] = useState(DEFECT_CONDITIONS[0]);
  const [brand, setBrand] = useState('Apple');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('800001');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    setIsSubmitted(true);
  };

  const activeCategoryObj = RECYCLE_CATEGORIES.find((c) => c.id === deviceCategory) || RECYCLE_CATEGORIES[0];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Recycle className="w-3.5 h-3.5" />
            <span>Certified Zero-Landfill Initiative</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Recycle Dead Electronics. Save The <span className="text-emerald-600">Planet</span>.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Free doorstep collection of scrap devices. Receive an official CPCB Green Certificate + instant cashback voucher.
          </p>
        </div>
      </div>

      {/* Main 2-Column Grid with Left Filter Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-24 space-y-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-sm text-slate-900">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>E-Waste Filters</span>
            </div>

            {/* Device Category Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Scrap Category</label>
              <div className="space-y-1">
                {RECYCLE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setDeviceCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                      deviceCategory === cat.id
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {deviceCategory === cat.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrap Defect Types */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Defect Condition</label>
              <div className="space-y-1 text-xs">
                {DEFECT_CONDITIONS.map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setSelectedCondition(cond)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition text-[11px] leading-tight flex items-center justify-between ${
                      selectedCondition === cond
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cond}</span>
                    {selectedCondition === cond && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Reward Estimate Card */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <Gift className="w-3 h-3 text-emerald-600" />
                Estimated Green Voucher
              </span>
              <div className="text-base font-black text-emerald-900">{activeCategoryObj.reward}</div>
              <p className="text-[10px] text-emerald-700">
                Redeemable on SELBAR certified refurbished phones or instant UPI credit.
              </p>
            </div>
          </div>
        </aside>

        {/* Right Content Area: Impact Counters & Schedule Form */}
        <main className="lg:col-span-3 space-y-6">
          {/* Impact Counters Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-0.5">
              <div className="text-2xl font-black text-emerald-600">12,450+</div>
              <div className="text-xs font-bold text-slate-800">Diverted from Landfills</div>
              <div className="text-[10px] text-slate-400">Zero-toxic lead contamination</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-0.5">
              <div className="text-2xl font-black text-teal-600">48.2 Tons</div>
              <div className="text-xs font-bold text-slate-800">Carbon Footprint Saved</div>
              <div className="text-[10px] text-slate-400">Equivalent to planting 1,200 trees</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-0.5">
              <div className="text-2xl font-black text-emerald-700">100%</div>
              <div className="text-xs font-bold text-slate-800">CPCB Compliance</div>
              <div className="text-[10px] text-slate-400">Green recycling certification</div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Trees className="w-5 h-5 text-emerald-600" />
                  <span>Schedule Free Doorstep E-Waste Pickup</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selected Category: <strong className="text-emerald-700">{activeCategoryObj.label}</strong>
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                Free Doorstep Pickup
              </span>
            </div>

            {isSubmitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-emerald-950">E-Waste Pickup Scheduled Successfully!</h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  Our logistics executive will collect your dead device from PIN <strong>{pincode}</strong> within 24 hours. Your official Green Certificate & cashback voucher will be emailed to you.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-5 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl"
                >
                  Schedule Another Device
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Apple, Samsung, Dell, HP..."
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup PIN Code *</label>
                    <input
                      type="text"
                      placeholder="e.g. 800001"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number (For Executive Call) *</label>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>Includes certified data erasure & CPCB Green Certificate</span>
                  </div>
                  <strong className="text-emerald-700 font-bold">100% Free</strong>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Confirm Doorstep E-Waste Pickup</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
