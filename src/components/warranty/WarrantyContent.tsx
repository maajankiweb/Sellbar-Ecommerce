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
} from 'lucide-react';

const INSPECTION_CATEGORIES = [
  {
    title: '1. Display & Touch Digitizer (5 tests)',
    items: [
      'Zero Dead Pixels / Color Screen Bleed',
      'Multi-touch Gesture & Latency Sensitivity',
      'TrueTone & Ambient Light Sensor Autocalibration',
      'Zero Screen Burn-in on OLED Panels',
      'Factory Glass Cleanliness',
    ],
  },
  {
    title: '2. Battery & Thermal Safety (4 tests)',
    items: [
      'Minimum 85%+ Original Health Capacity',
      'Rapid Charging Current Stability & Overcharge Protection',
      'Zero Physical Swelling or Thermal Heat Anomalies',
      'Standby Battery Drain Rate Under Factory Limits',
    ],
  },
  {
    title: '3. Optics & Camera Systems (6 tests)',
    items: [
      'Primary Sensor Optical Image Stabilization (OIS)',
      'Ultra-Wide & Telephoto Optical Zoom Accuracy',
      'Front TrueDepth / Face ID / Portrait Autofocus',
      '4K Video Recording & Multi-Mic Audio Sync',
      'Flash & Torch Beam Illuminance',
      'Zero Dust Particles or Scratches on Sensor Lens',
    ],
  },
  {
    title: '4. Audio & Cellular Connectivity (7 tests)',
    items: [
      'Stereo Speaker High-Volume Harmonic Distortion Test',
      'Earpiece Receiver Crystal-Clear Call Quality',
      'Noise-Cancelling Dual Microphones Fidelity',
      '5G / 4G VoLTE Signal Lock & Carrier Band Test',
      'Dual-Band Wi-Fi Speed & Range Benchmark',
      'Bluetooth Low-Latency Pairing Stability',
      'GPS & Compass Navigation Positioning Latency',
    ],
  },
  {
    title: '5. Biometrics & Core Motherboard (10 tests)',
    items: [
      'Ultrasonic / Capacitive In-Display Fingerprint Sensor',
      'NFC Contactless Card & Peer-to-Peer Data Transfer',
      'Vibration Haptic Feedback Engine Resonance',
      'Accelerometer, Gyroscope & Barometer Sensor Array',
      'USB-C / Lightning Port Data I/O & OTG Connectivity',
      'Clean IMEI Verification & Carrier Unlock Validation',
      'SIM Card Tray Ejector & Dual Physical/eSIM Recognition',
      'Proximity Sensor Screen-Sleep During Call Simulation',
      'Power, Volume & Mute Physical Switch Tactile Feedback',
      'Permanent Cryptographic Storage Sanitization',
    ],
  },
];

interface WarrantyContentProps {
  warrantyMonths?: number;
  replacementDays?: number;
}

export function WarrantyContent({
  warrantyMonths = 6,
  replacementDays = 15,
}: WarrantyContentProps) {
  const [activeTab, setActiveTab] = useState<'warranty' | 'replacement' | 'grades' | 'checklist'>('warranty');
  const [claimOrderId, setClaimOrderId] = useState('');
  const [claimStatus, setClaimStatus] = useState<string | null>(null);

  const handleClaimLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimOrderId.trim()) return;
    setClaimStatus(
      `Order #${claimOrderId.toUpperCase()} verified: Covered under ${warrantyMonths}-Month Sellbar Assured Hardware Warranty. Support team will reach out within 24 hours.`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-xs">
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Recommerce Standards</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
          Sellbar <span className="text-emerald-600">Assured Warranty</span> &amp; Quality Standards
        </h1>
        <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
          Comprehensive {warrantyMonths}-month hardware warranty, {replacementDays}-day replacement window, transparent condition grading, and rigorous quality inspection before sale.
        </p>

        {/* Tab Navigation */}
        <div className="inline-flex bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs gap-1 max-w-full overflow-x-auto">
          {[
            { id: 'warranty', label: `${warrantyMonths}-Mo Warranty`, icon: ShieldCheck },
            { id: 'replacement', label: `${replacementDays}-Day Replacement`, icon: RotateCcw },
            { id: 'grades', label: 'Condition Grades', icon: Smartphone },
            { id: 'checklist', label: 'Quality Inspection', icon: CheckCircle2 },
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
                    ? 'bg-emerald-600 text-white shadow-xs'
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
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {warrantyMonths} Months Hardware Coverage
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Every certified phone purchased on Sellbar is automatically protected against internal component defects.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>What is Covered</span>
                </div>
                <ul className="text-xs text-emerald-950 space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Motherboard, processor, and RAM circuitry defects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Display touch digitizer and sensor unresponsiveness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Battery health degradation below 80% during warranty</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Camera sensors, optical zoom, and autofocus hardware</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>What is Not Covered (Voiding Conditions)</span>
                </div>
                <ul className="text-xs text-rose-950 space-y-2">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Physical glass cracks, deep dents, or drop impact damage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Liquid ingress, water submersion, or oxidation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Unauthorized third-party disassembly or non-OEM repairs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Custom OS rooting, bootloader unlocking, or firmware tampering</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Claim Lookup Card */}
            <div className="pt-6 border-t border-slate-100 max-w-xl mx-auto space-y-3">
              <h3 className="text-xs font-bold text-slate-800 text-center uppercase tracking-wider">
                Check Your Order Warranty Status
              </h3>
              <form onSubmit={handleClaimLookup} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Order ID (e.g. SB-2026-000101)..."
                  value={claimOrderId}
                  onChange={(e) => setClaimOrderId(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                >
                  Verify
                </button>
              </form>
              {claimStatus && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  {claimStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REPLACEMENT POLICY */}
      {activeTab === 'replacement' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-4 animate-in fade-in duration-200">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {replacementDays}-Day Hassle-Free Replacement Window
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            If the device you receive does not perform to our promised standards or exhibits any undisclosed cosmetic defects, request an immediate replacement directly from your account within {replacementDays} calendar days of delivery.
          </p>
          <div className="pt-2">
            <Link
              href="/legal/refund"
              className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
            >
              <span>Read Full Replacement &amp; Refund Policy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* TAB 3: CONDITION GRADES */}
      {activeTab === 'grades' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {[
            {
              grade: 'Superb (Like New)',
              badge: 'Grade A',
              desc: 'Virtually indistinguishable from brand new. Flawless display, zero visible scratches at arm’s length, 90%+ battery health.',
              color: 'emerald',
            },
            {
              grade: 'Good (Very Clean)',
              badge: 'Grade B',
              desc: 'Minor micro-scratches on bezel or rear housing invisible under normal usage. Display glass is pristine. 85%+ battery health.',
              color: 'teal',
            },
            {
              grade: 'Fair (Budget Value)',
              badge: 'Grade C',
              desc: 'Noticeable signs of normal cosmetic wear, superficial scratches or small scuffs. 100% factory functional with verified hardware.',
              color: 'blue',
            },
          ].map((item) => (
            <div key={item.grade} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {item.badge}
              </span>
              <h3 className="text-base font-bold text-slate-900">{item.grade}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: QUALITY CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Hardware Quality Inspection Standards
            </h2>
            <p className="text-xs text-slate-500">
              Every device passes complete hardware, biometric, audio, and network checks before listing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INSPECTION_CATEGORIES.map((cat) => (
              <div key={cat.title} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
                  {cat.title}
                </h3>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  {cat.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WarrantyContent;
