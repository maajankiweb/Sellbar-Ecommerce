'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  Smartphone,
  CreditCard,
  Building2,
  Wrench,
  Award,
  Users,
  Newspaper,
  Check
} from 'lucide-react';

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<'sell' | 'buy' | 'repair' | 'about'>('sell');

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Frictionless Recommerce Experience</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
          How <span className="text-emerald-600">SELBAR</span> Works
        </h1>
        <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
          From doorstep device sell-offs with spot cash to certified refurbished smartphones with 1-year warranty, explore our transparent workflows and corporate story.
        </p>

        {/* Tab Switcher */}
        <div className="inline-flex bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs gap-1 max-w-full overflow-x-auto">
          {[
            { id: 'sell', label: '1. Sell Flow', icon: Smartphone },
            { id: 'buy', label: '2. Buy Refurbished', icon: RotateCcw },
            { id: 'repair', label: '3. Device Repair Service', icon: Wrench },
            { id: 'about', label: '4. About & Company', icon: Building2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: SELLING JOURNEY */}
      {activeTab === 'sell' && (
        <div className="space-y-10 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">The 4-Step Process</span>
                <h2 className="text-xl font-black text-slate-900">Selling Your Old Phone for Instant Cash</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">1</span>
                <h3 className="text-sm font-bold text-slate-900">Instant Valuation in 60s</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select your exact smartphone model. Our pricing engine assesses storage, cosmetic condition, and tests to generate a transparent price.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">2</span>
                <h3 className="text-sm font-bold text-slate-900">Free Doorstep Slot</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Choose a convenient date and time. Our certified inspection executive arrives at your home, office, or university campus for free.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">3</span>
                <h3 className="text-sm font-bold text-slate-900">Live 32-Point Check</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Technician conducts a quick functional diagnostic in front of your eyes (display, camera, biometric, speaker) in under 5 minutes.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">4</span>
                <h3 className="text-sm font-bold text-slate-900">Spot UPI Payment</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Money is transferred to your UPI ID or bank account right on the spot before you hand over the device. 100% data-wipe guaranteed.
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <Link
                href="/sell"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
              >
                <span>Check Your Phone's Fair Price Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BUYING REFURBISHED */}
      {activeTab === 'buy' && (
        <div className="space-y-10 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Certified Resale Journey</span>
                <h2 className="text-xl font-black text-slate-900">Buying Certified Refurbished Gadgets</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">1</span>
                <h3 className="text-sm font-bold text-slate-900">32-Point Factory Testing</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every pre-owned phone undergoes military-standard diagnostic hardware testing and certified 100% data eradication.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">2</span>
                <h3 className="text-sm font-bold text-slate-900">Choose Grade & Savings</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pick between Superb (flawless), Good (minor scuff), or Fair condition tiers with discounts up to 60% off brand-new MRP.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">3</span>
                <h3 className="text-sm font-bold text-slate-900">Free Express Delivery</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Shipped securely in a tamper-proof SELBAR branded box containing a compatible fast-charging cable and official warranty card.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">4</span>
                <h3 className="text-sm font-bold text-slate-900">12 Months Assurance</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enjoy complete peace of mind with our 12-month hardware warranty and 5-day no-questions replacement window.
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <Link
                href="/buy"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
              >
                <span>Browse Certified Refurbished Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DOORSTEP REPAIR */}
      {activeTab === 'repair' && (
        <div className="space-y-10 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">30-Minute Turnaround</span>
                <h2 className="text-xl font-black text-slate-900">Certified Gadget Repair Service</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="w-8 h-8 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">1</span>
                <h3 className="text-sm font-bold text-slate-900">Select Fault & Model</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Choose your issue: cracked screen, drained battery, broken camera, or loose charging jack. Transparent quote provided upfront.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="w-8 h-8 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">2</span>
                <h3 className="text-sm font-bold text-slate-900">Technician Arrival</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Our background-verified technician arrives at your location with specialized ESD tools and OEM-certified replacement components.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="w-8 h-8 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">3</span>
                <h3 className="text-sm font-bold text-slate-900">Repaired in 30 Mins</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Repair is carried out right in front of your eyes. Complete data privacy guaranteed with zero need to leave your device at a shop.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="w-8 h-8 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">4</span>
                <h3 className="text-sm font-bold text-slate-900">6 Months Warranty</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Receive an official invoice and 6-month touch/display warranty. Pay digitally via UPI or cash only after you test the phone.
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <Link
                href="/repair"
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
              >
                <span>Book Device Repair Service</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ABOUT US & CORPORATE INFORMATION */}
      {activeTab === 'about' && (
        <div className="space-y-10 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-8">
            <div className="max-w-3xl space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Corporate Overview</span>
              <h2 className="text-2xl font-black text-slate-900">
                Democratizing Transparent Recommerce in Tier-2 & Tier-3 India
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Founded by <strong>Maajanki Web Tech</strong>, SELBAR was created to solve the fundamental lack of trust in India's secondary smartphone market. Traditional local mobile shops often lack transparent pricing, fail to guarantee data erasure, and offer no warranty on refurbished gadgets.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                SELBAR combines an in-house algorithmic pricing engine, CPCB-authorized electronic recycling compliance, and a doorstep delivery network across Bihar and Uttar Pradesh, making recommerce safe, fair, and rewarding for everyday citizens.
              </p>
            </div>

            {/* Corporate Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900">DPDP Act 2023 Compliance</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Cryptographic NIST 800-88 multi-pass data sanitization ensures zero customer data residue.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <Award className="w-6 h-6 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">Zero-Landfill Policy</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Non-repairable e-waste is channeled exclusively to CPCB-authorized smelters and recyclers.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <Users className="w-6 h-6 text-purple-600" />
                <h4 className="text-sm font-bold text-slate-900">50+ Physical Hubs</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Local offline presence across Bettiah, Bagaha, Narkatiaganj, Ramnagar, and Patna.
                </p>
              </div>
            </div>

            {/* Press Releases / Media Notice */}
            <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Newspaper className="w-4 h-4" />
                <span>Press & Media Inquiries</span>
              </div>
              <h4 className="text-base font-bold text-white">Media Coverage & Institutional Relations</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                For corporate inquiries, research citations, or franchise partnerships, contact our communications desk at <strong className="text-white">press@selbar.in</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
