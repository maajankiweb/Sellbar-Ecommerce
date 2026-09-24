'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  FileText,
  ArrowRight,
  Download,
  Award,
  Sparkles,
  QrCode,
  Cookie,
  UserCheck
} from 'lucide-react';

export default function DataWipePage() {
  const [activeTab, setActiveTab] = useState<'guarantee' | 'certificate' | 'privacy' | 'cookie'>('guarantee');
  const [imeiQuery, setImeiQuery] = useState('358291048291024');

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-xs">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>India DPDP Act 2023 Compliant</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
          100% Certified <span className="text-emerald-600">Data-Wipe</span> Guarantee & Privacy
        </h1>
        <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
          Selling an old device should never compromise your private memories or banking tokens. We guarantee permanent cryptographic sanitization adhering to NIST 800-88 standards.
        </p>

        {/* Tab Navigation */}
        <div className="inline-flex bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs gap-1 max-w-full overflow-x-auto">
          {[
            { id: 'guarantee', label: 'Data-Wipe Guarantee', icon: ShieldCheck },
            { id: 'certificate', label: 'Digital Certificate', icon: Award },
            { id: 'privacy', label: 'Privacy Policy (DPDP)', icon: UserCheck },
            { id: 'cookie', label: 'Cookie Policy', icon: Cookie }
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

      {/* TAB 1: GUARANTEE & PROCESS */}
      {activeTab === 'guarantee' && (
        <div className="space-y-10 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">NIST 800-88 & DoD 5220.22-M</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Multi-pass binary sanitization overwrites all flash storage sectors with random cryptographically secure patterns, rendering forensic recovery impossible.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Cryptographic Certificate</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                You receive a digitally signed PDF certificate containing your device IMEI and cryptographic SHA-256 validation hash confirming 100% erasure.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Zero Residual Exposure</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Photos, WhatsApp archives, UPI tokens, saved banking cookies, biometric enclaves, and iCloud/Google credentials are completely eradicated.
              </p>
            </div>
          </div>

          {/* Step-by-Step Sanitization Pipeline */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-6">
            <h2 className="text-xl font-black text-slate-900">Our 4-Stage Sanitization Pipeline</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                <h4 className="text-sm font-bold text-slate-900">Doorstep Sign-out</h4>
                <p className="text-xs text-slate-500">
                  Technician assists in signing out of Apple ID / Google Account in front of you.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                <h4 className="text-sm font-bold text-slate-900">Lab Diagnostic Intake</h4>
                <p className="text-xs text-slate-500">
                  Device connected to isolated SELBAR security terminal with write-blocking hardware.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                <h4 className="text-sm font-bold text-slate-900">Multi-Pass Overwrite</h4>
                <p className="text-xs text-slate-500">
                  NIST 800-88 Purge executes 3-pass cryptographic zeros and random bytes.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">4</span>
                <h4 className="text-sm font-bold text-slate-900">Certificate Generation</h4>
                <p className="text-xs text-slate-500">
                  Immutable certificate generated and sent to customer's registered WhatsApp & email.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CERTIFICATE PREVIEW */}
      {activeTab === 'certificate' && (
        <div className="space-y-10 animate-in fade-in duration-200">
          <div className="max-w-3xl mx-auto bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 tracking-wider uppercase block">
                    Verified Digital Artifact
                  </span>
                  <h3 className="text-lg font-bold text-white">Certificate of Data Erasure</h3>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-mono font-bold">
                STATUS: PURGED & DESTROYED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1">
                <span className="text-slate-400 text-[11px] block">Device IMEI Number</span>
                <span className="font-mono font-bold text-white tracking-wider">{imeiQuery}</span>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1">
                <span className="text-slate-400 text-[11px] block">Sanitization Standard</span>
                <span className="font-bold text-white">NIST SP 800-88 Rev. 1 (Purge)</span>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1 sm:col-span-2">
                <span className="text-slate-400 text-[11px] block">Cryptographic SHA-256 Validation Hash</span>
                <span className="font-mono text-[11px] text-emerald-400 break-all">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
              <span>Audited by Maajanki Security Labs • Compliance Ref: MSL-2026-DPDP</span>
              <button
                type="button"
                onClick={() => alert('Downloading official PDF certificate...')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRIVACY POLICY (DPDP ACT 2023) */}
      {activeTab === 'privacy' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900">
                SELBAR Privacy Policy (Compliant with India DPDP Act 2023)
              </h2>
              <p className="text-xs text-slate-500 mt-1">Last Updated: September 2026</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">1. Data Fiduciary Commitment</h3>
              <p>
                SELBAR Recommerce Technologies Private Limited operates as a certified Data Fiduciary under the Digital Personal Data Protection (DPDP) Act 2023. We collect personal identifiers solely for doorstep buyback logistics, KYC identity verification, and GST billing.
              </p>

              <h3 className="text-sm font-bold text-slate-900">2. Device Data Destruction</h3>
              <p>
                Under our Zero-Residual Data Guarantee, any pre-owned smartphone, laptop, or tablet received by SELBAR is sanitized through automated NIST 800-88 cryptographic wiping before diagnostic refurbishing or parts harvesting. No employee or customer has access to residual files.
              </p>

              <h3 className="text-sm font-bold text-slate-900">3. Grievance Officer</h3>
              <p>
                In compliance with Rule 3 of the Information Technology Rules, our designated Grievance Officer is:
                <br />
                <strong>Grievance Officer:</strong> Amitav Sen, Data Protection Lead
                <br />
                <strong>Email:</strong> privacy@selbar.in | <strong>Address:</strong> Station Road, Bettiah, Bihar 845438
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COOKIE POLICY */}
      {activeTab === 'cookie' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900">SELBAR Cookie & LocalStorage Policy</h2>
              <p className="text-xs text-slate-500 mt-1">Last Updated: September 2026</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">1. Essential Cookies</h3>
              <p>
                We use secure, encrypted cookies and local storage to preserve your shopping cart, doorstep pickup location (e.g. Bettiah, Patna), and secure authentication session tokens.
              </p>

              <h3 className="text-sm font-bold text-slate-900">2. Third-Party Trackers</h3>
              <p>
                SELBAR does NOT sell your behavioral browsing data to third-party ad networks. Analytics are anonymized to ensure lightning-fast website performance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
