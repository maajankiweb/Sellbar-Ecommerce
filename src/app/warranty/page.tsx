'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  RotateCcw,
  Check,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Smartphone,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

const INSPECTION_CATEGORIES = [
  {
    title: '1. Display & Touch Digitizer (5 tests)',
    items: [
      'Zero Dead Pixels / Color Screen Bleed',
      'Multi-touch Gesture & Latency Sensitivity',
      'TrueTone & Ambient Light Sensor Autocalibration',
      'Zero Screen Burn-in on OLED Panels',
      'Factory Oleophobic Glass Cleanliness'
    ]
  },
  {
    title: '2. Battery & Thermal Safety (4 tests)',
    items: [
      'Minimum 85%+ Original Health Capacity',
      'Rapid Charging Current Stability & Overcharge Protection',
      'Zero Physical Swelling or Thermal Heat Anomalies',
      'Standby Battery Drain Rate Under Factory Limits'
    ]
  },
  {
    title: '3. Optics & Camera Systems (6 tests)',
    items: [
      'Primary Sensor Optical Image Stabilization (OIS)',
      'Ultra-Wide & Telephoto Optical Zoom Accuracy',
      'Front TrueDepth / Face ID / Portrait Autofocus',
      '4K Video Recording & Multi-Mic Audio Sync',
      'Flash & Torch Beam Illuminance',
      'Zero Dust Particles or Scratches on Sensor Lens'
    ]
  },
  {
    title: '4. Audio & Cellular Connectivity (7 tests)',
    items: [
      'Stereo Speaker High-Volume Harmonic Distortion Test',
      'Earpiece Receiver Crystal-Clear Call Quality',
      'Noise-Cancelling Dual Microphones Fidelity',
      '5G / 4G VoLTE Signal Lock & Carrier Band Test',
      'Dual-Band Wi-Fi 6 Speed & Range Benchmark',
      'Bluetooth 5.3 Low-Latency Pairing Stability',
      'NFC Contactless Payments & Tag Reading'
    ]
  },
  {
    title: '5. Hardware, Ports & Biometrics (6 tests)',
    items: [
      'Fingerprint Scanner / Face ID Biometric Enclave',
      'Physical Tactile Buttons (Power, Volume, Mute Slider)',
      'Gyroscope, Accelerometer & Compass Calibration',
      'Proximity Sensor Screen Blanking During Calls',
      'USB Type-C / Lightning Port Mechanical Hold & Fast Data Transfer',
      '100% Cryptographic Data Destruction & Sanitization'
    ]
  }
];

export default function WarrantyPolicyPage() {
  const [activeTab, setActiveTab] = useState<'warranty' | 'replacement' | 'grades' | 'checklist'>('warranty');
  const [claimOrderId, setClaimOrderId] = useState('');
  const [claimStatus, setClaimStatus] = useState<string | null>(null);

  const handleClaimLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimOrderId.trim()) return;
    setClaimStatus(`Order #${claimOrderId.toUpperCase()} verified: Covered under 12-Month SELBAR Assured Hardware Warranty. Free doorstep technician visit available.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-xs">
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          <span>Gold-Standard Recommerce Certification</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
          SELBAR <span className="text-emerald-600">Assured Warranty</span> & Quality Standards
        </h1>
        <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
          Comprehensive 12-month hardware warranty, 5-day replacement policy, transparent condition grading, and a rigorous 32-point factory diagnostic checklist.
        </p>

        {/* Tab Navigation */}
        <div className="inline-flex bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs gap-1 max-w-full overflow-x-auto">
          {[
            { id: 'warranty', label: '12-Mo Warranty', icon: ShieldCheck },
            { id: 'replacement', label: '5-Day Replacement', icon: RotateCcw },
            { id: 'grades', label: 'What is Refurbished?', icon: Smartphone },
            { id: 'checklist', label: '32-Point Inspection', icon: CheckCircle2 }
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

      {/* TAB 1: WARRANTY POLICY */}
      {activeTab === 'warranty' && (
        <div className="space-y-10 animate-in fade-in duration-200">
          {/* Covered vs Excluded Comparison */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                12 Months Comprehensive Hardware Coverage
              </h2>
              <p className="text-xs text-slate-500">
                Transparent terms: Here is exactly what is covered and what is excluded.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Covered Box */}
              <div className="p-6 bg-emerald-50/60 rounded-3xl border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>What is 100% Covered</span>
                </div>
                <ul className="space-y-2 text-xs text-emerald-950">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Motherboard component failure or spontaneous boot loop</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Display touch digitizer ghosting, touch unresponsive spots</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Internal loudspeaker, earpiece, and microphone defects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Camera sensor autofocus jitter, blur, or optical failure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Battery draining abnormally (&lt;80% health within warranty)</span>
                  </li>
                </ul>
              </div>

              {/* Not Covered Box */}
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span>Standard Warranty Exclusions</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span>Accidental drops, physical cracks, or liquid/water ingress</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span>Unauthorized repairs conducted at unauthorized third-party shops</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span>Cosmetic scratches acquired through standard everyday wear</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span>OS rooting, custom ROM flashing, or bootloader tampering</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Quick Claim Lookup Form */}
            <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white">Track Warranty or Register Doorstep Claim</h4>
                <p className="text-xs text-slate-400">Enter your 8-digit SELBAR Order ID to check coverage.</p>
              </div>
              <form onSubmit={handleClaimLookup} className="flex flex-col sm:flex-row gap-2 max-w-md">
                <input
                  type="text"
                  placeholder="e.g. SLB-88129"
                  value={claimOrderId}
                  onChange={(e) => setClaimOrderId(e.target.value)}
                  className="px-3.5 py-2 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 flex-1"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition"
                >
                  Verify Warranty
                </button>
              </form>

              {claimStatus && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl animate-in fade-in">
                  {claimStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 5-DAY REPLACEMENT */}
      {activeTab === 'replacement' && (
        <div className="space-y-10 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                5-Day Hassle-Free Replacement Guarantee
              </h2>
              <p className="text-xs text-slate-500">
                Not satisfied with the cosmetic feel or discovered a functional defect? We will swap it free of charge.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="w-8 h-8 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center justify-center">1</span>
                <h4 className="text-sm font-bold text-slate-900">Initiate in 1-Click</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Go to your Account Orders page and tap "Request Replacement" within 5 days of delivery.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="w-8 h-8 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center justify-center">2</span>
                <h4 className="text-sm font-bold text-slate-900">Doorstep Verification</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Our delivery executive visits your location with the replacement unit and performs a quick IMEI match.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="w-8 h-8 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center justify-center">3</span>
                <h4 className="text-sm font-bold text-slate-900">Instant Handover / Refund</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Collect your replacement device immediately, or opt for a 100% instant refund credit to your original payment method.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WHAT IS REFURBISHED & CONDITION GRADES */}
      {activeTab === 'grades' && (
        <div className="space-y-10 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                What is Refurbished? Condition Grades Explained
              </h2>
              <p className="text-xs text-slate-500">
                Every refurbished phone on SELBAR is 100% functionally brand new. The only difference is cosmetic exterior wear.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 rounded-3xl border border-emerald-300 bg-emerald-50/40 space-y-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
                  Grade A: Superb
                </span>
                <h3 className="text-base font-bold text-slate-900">Like-New Condition</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Zero visible scratches or scuffs. Screen and chassis look completely brand new. Battery health above 90%.
                </p>
                <div className="pt-2 text-[11px] font-bold text-emerald-800">
                  Ideal for users seeking showroom perfection at up to 40% discount.
                </div>
              </div>

              <div className="p-6 rounded-3xl border border-blue-300 bg-blue-50/40 space-y-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">
                  Grade B: Good
                </span>
                <h3 className="text-base font-bold text-slate-900">Very Minor Micro-Scratches</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Flawless screen. Body has 1–2 tiny micro-scratches on edges not visible from an arm’s length. Battery health above 85%.
                </p>
                <div className="pt-2 text-[11px] font-bold text-blue-800">
                  Our most popular value tier offering up to 50% discount.
                </div>
              </div>

              <div className="p-6 rounded-3xl border border-amber-300 bg-amber-50/40 space-y-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-600 text-white">
                  Grade C: Fair
                </span>
                <h3 className="text-base font-bold text-slate-900">Noticeable Exterior Wear</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  100% operational hardware. Outer frame and back cover have visible paint scuffs easily concealed with a case.
                </p>
                <div className="pt-2 text-[11px] font-bold text-amber-800">
                  Maximum budget savings with discounts up to 65% off retail.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 32-POINT CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="space-y-10 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Official 32-Point Factory Diagnostic Checklist
              </h2>
              <p className="text-xs text-slate-500">
                Every individual item on this list must pass with zero defects before a device is listed for resale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {INSPECTION_CATEGORIES.map((cat, idx) => (
                <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{cat.title}</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {cat.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
