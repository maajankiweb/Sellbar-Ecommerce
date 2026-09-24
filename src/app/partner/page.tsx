'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Handshake,
  TrendingUp,
  Store,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  Calculator,
  Percent,
  Coins,
  FileCheck,
  Headphones,
  Check,
  Send
} from 'lucide-react';

const PARTNER_TIERS = [
  {
    id: 'franchise',
    title: 'SELBAR Retail Experience Franchise',
    subtitle: 'Exclusive Branded Showroom',
    investment: '₹5L – ₹10L Capital',
    roi: '12–18 Months Payback',
    features: [
      'Complete 3D showroom interior & branding support',
      'Exclusive territorial rights in your prime market',
      'Certified refurbished device inventory on consignment',
      'Integrated POS, diagnostic & automated billing software',
      'Free technician training & marketing launch support'
    ],
    badge: 'Flagship Opportunity'
  },
  {
    id: 'dealer',
    title: 'Local Retailer / Mobile Shop Partner',
    subtitle: 'Zero Investment Add-on',
    investment: '₹0 Upfront Investment',
    roi: 'Instant Commission per device',
    features: [
      'Use SELBAR Pricing Engine app to quote walk-in customers',
      'Earn ₹500 – ₹1,500 instant commission per phone buyback',
      'Zero risk: We handle doorstep collection and QC',
      'Free promotional standees, posters & digital banners',
      'T+1 instant bank transfer directly to your UPI/bank'
    ],
    badge: 'Zero Risk • High Margin'
  },
  {
    id: 'supersale',
    title: 'B2B Supersale & Bulk Procurement',
    subtitle: 'Wholesale Certified Stock',
    investment: 'Volume Orders',
    roi: 'Wholesale Margins 20–35%',
    features: [
      'Verified wholesale inventory lots (Grade A / B / C)',
      '32-point inspection report for every IMEI in the batch',
      'GST input tax credit compliant tax invoices',
      'Fast pan-India dispatch with transit insurance',
      'Dedicated institutional relationship manager'
    ],
    badge: 'For Distributors'
  }
];

export default function PartnerPage() {
  const [selectedTier, setSelectedTier] = useState('franchise');
  const [volume, setVolume] = useState(35);
  const [partnerType, setPartnerType] = useState('franchise');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [shopName, setShopName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Earnings estimation calculation: Avg commission ~₹850 per device
  const estimatedMonthlyEarning = volume * 850;
  const estimatedAnnualEarning = estimatedMonthlyEarning * 12;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-xs">
          <Handshake className="w-3.5 h-3.5" />
          <span>SELBAR Partner & Franchise Network</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
          Partner With India's Fastest-Growing <span className="text-emerald-600">Recommerce</span> Platform.
        </h1>
        <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
          Whether you own a local mobile store wanting to offer instant buyback, or an entrepreneur planning a branded SELBAR Experience Centre, grow your revenue with zero dead-stock risk.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="text-xl font-black text-emerald-600">50+</div>
            <div className="text-[11px] font-semibold text-slate-600">Active Retail Hubs</div>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="text-xl font-black text-blue-600">₹850+</div>
            <div className="text-[11px] font-semibold text-slate-600">Avg Profit / Buyback</div>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="text-xl font-black text-purple-600">100%</div>
            <div className="text-[11px] font-semibold text-slate-600">Zero Dead Stock</div>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="text-xl font-black text-amber-600">T+1</div>
            <div className="text-[11px] font-semibold text-slate-600">Fast Settlement</div>
          </div>
        </div>
      </div>

      {/* Partner Tier Cards */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Choose Your Partnership Model</h2>
          <p className="text-xs text-slate-500">Tailored programs designed for every stage of business</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PARTNER_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all flex flex-col justify-between space-y-6 relative overflow-hidden ${
                selectedTier === tier.id
                  ? 'border-emerald-500 ring-2 ring-emerald-100 shadow-xl'
                  : 'border-slate-200/80 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {tier.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-950">{tier.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{tier.subtitle}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Requirement</span>
                    <strong className="text-slate-800 font-bold">{tier.investment}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">ROI / Margin</span>
                    <strong className="text-emerald-700 font-bold">{tier.roi}</strong>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-600">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedTier(tier.id);
                  setPartnerType(tier.id);
                  const formElement = document.getElementById('partner-application-form');
                  if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedTier === tier.id
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <span>Apply For This Tier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Profit & Commission Calculator */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <Calculator className="w-4 h-4" />
              <span>Earnings Projection Simulator</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-slate-900">
              Calculate Your Monthly Retail Commission
            </h3>
            <p className="text-xs text-slate-500">
              Estimate how much extra revenue your store can generate with SELBAR Buyback.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Estimated Monthly Profit</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              ₹{estimatedMonthlyEarning.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">
              ≈ ₹{estimatedAnnualEarning.toLocaleString('en-IN')} / year
            </span>
          </div>
        </div>

        {/* Volume Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-slate-800">
            <span>Phones Quoted & Sold / Month: <strong className="text-emerald-700 text-sm">{volume} Devices</strong></span>
            <span className="text-slate-500">Avg. Commission: ₹850 / Device</span>
          </div>
          <input
            type="range"
            min={5}
            max={150}
            step={5}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>5 Devices / Mo (Part-time)</span>
            <span>50 Devices / Mo (Average Retail Store)</span>
            <span>150+ Devices / Mo (Busy Market Hub)</span>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div
        id="partner-application-form"
        className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl space-y-6"
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <Building2 className="w-4 h-4" />
            <span>Fast-Track Onboarding</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Join the SELBAR Partner Network
          </h2>
          <p className="text-xs text-slate-500">
            Submit your details below. Our regional franchise manager will connect with you within 24 hours.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-emerald-950">Partner Application Received!</h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              Thank you, <strong>{name}</strong>! Our Regional Business Head for <strong>{city}</strong> will contact you on <strong>+91 {phone}</strong> shortly.
            </p>
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="px-5 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Partnership Model *</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'franchise', label: 'Retail Franchise' },
                  { id: 'dealer', label: 'Local Store Dealer' },
                  { id: 'supersale', label: 'B2B Supersale' }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setPartnerType(type.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                      partnerType === type.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Mobile Phone Number *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Shop / Firm Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sharma Mobile Care"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">City / District & State *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bettiah, Bihar"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Partner Application</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
