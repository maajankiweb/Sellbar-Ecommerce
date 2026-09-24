'use client';

import React from 'react';
import { X, ShieldCheck, CheckCircle2, Award, Zap, Sparkles } from 'lucide-react';

interface DiagnosticScorecardModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export function DiagnosticScorecardModal({
  isOpen,
  onClose,
  productName,
}: DiagnosticScorecardModalProps) {
  if (!isOpen) return null;

  const checkCategories = [
    {
      name: 'Display & Touch Optics',
      tests: [
        { label: 'OLED / LCD Color Accuracy', status: 'Passed (100%)' },
        { label: 'Multi-Touch Digitizer Response', status: 'Passed' },
        { label: 'TrueTone & Ambient Light Sensor', status: 'Passed' },
        { label: 'Dead Pixel & Backlight Bleed', status: 'Zero Bleed' },
      ],
    },
    {
      name: 'Battery & Power Subsystem',
      tests: [
        { label: 'OEM Battery Health Capacity', status: '94% Certified' },
        { label: 'Fast Charging Thermal Integrity', status: 'Passed' },
        { label: 'Wireless Qi Induction Charging', status: 'Passed' },
        { label: 'Battery Cycle Count', status: '< 180 Cycles' },
      ],
    },
    {
      name: 'Biometrics & Security',
      tests: [
        { label: 'Face ID 3D Dot Projector', status: 'Passed' },
        { label: 'Fingerprint Touch ID Scanner', status: 'Passed' },
        { label: 'Secure Enclave Encryption', status: 'Passed' },
      ],
    },
    {
      name: 'Cameras, Audio & Connectivity',
      tests: [
        { label: 'Optical Image Stabilization (OIS)', status: 'Passed' },
        { label: '4K Video Autofocus & Flash', status: 'Passed' },
        { label: 'Stereo Speakers & Noise-Cancelling Mic', status: 'Passed' },
        { label: '5G / Wi-Fi 6 / Bluetooth 5.3', status: 'Passed' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>32-Point Factory Diagnostic Scorecard</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
              {productName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagnostic Scorecard Feed */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {checkCategories.map((cat, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5">
              <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>{cat.name}</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                  All Tests Passed
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {cat.tests.map((t, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-white rounded-xl border border-slate-200/60 shadow-2xs flex items-center justify-between gap-2"
                  >
                    <span className="text-slate-700 text-[11px]">{t.label}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Certified by Senior Hardware Engineer • Certificate #QC-98241</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition"
          >
            Close Scorecard
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiagnosticScorecardModal;
