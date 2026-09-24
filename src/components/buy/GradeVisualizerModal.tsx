'use client';

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Eye } from 'lucide-react';

interface GradeVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export function GradeVisualizerModal({
  isOpen,
  onClose,
  productName,
}: GradeVisualizerModalProps) {
  const [selectedGrade, setSelectedGrade] = useState<'superb' | 'good' | 'fair'>('superb');

  if (!isOpen) return null;

  const grades = {
    superb: {
      badge: 'Grade A (Superb)',
      discount: 'Save up to 40%',
      title: 'Pristine & Like New',
      battery: '>90% OEM Battery Capacity',
      screen: 'Zero scratches or dead pixels. Looks showroom fresh.',
      body: 'No dents, scratches, or color fading on chassis.',
      warranty: '12-Month Hardware Warranty Included',
      color: 'emerald',
    },
    good: {
      badge: 'Grade B (Good)',
      discount: 'Save up to 50%',
      title: 'Light Everyday Wear',
      battery: '>85% OEM Battery Capacity',
      screen: 'Flawless display. May have 1–2 tiny hairline scratches on bezel.',
      body: 'Minimal light marks on back cover, zero functional impact.',
      warranty: '12-Month Hardware Warranty Included',
      color: 'blue',
    },
    fair: {
      badge: 'Grade C (Fair)',
      discount: 'Save up to 65% (Best Value)',
      title: 'Maximum Discount Value',
      battery: '>80% Verified Battery',
      screen: '100% operational touch display with minor visible scratches.',
      body: 'Noticeable cosmetic rubbing or minor corner dents.',
      warranty: '12-Month Hardware Warranty Included',
      color: 'amber',
    },
  };

  const current = grades[selectedGrade];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cosmetic Condition Visualizer</span>
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

        {/* Grade Selection Tabs */}
        <div className="grid grid-cols-3 gap-2 pt-4 pb-2">
          {(['superb', 'good', 'fair'] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGrade(g)}
              className={`py-2 px-3 rounded-2xl text-xs font-bold transition-all ${
                selectedGrade === g
                  ? 'bg-slate-900 text-white shadow-md scale-102'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {g === 'superb' ? '💎 Superb' : g === 'good' ? '✨ Good' : '🏷️ Fair'}
            </button>
          ))}
        </div>

        {/* Grade Details Card */}
        <div className="mt-4 p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
              {current.badge}
            </span>
            <span className="text-xs font-extrabold text-emerald-700">
              {current.discount}
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-base font-black text-slate-900">{current.title}</h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-3 bg-white rounded-2xl border border-slate-200/60 shadow-2xs flex items-start gap-2.5">
                <span className="text-base">🔋</span>
                <div>
                  <strong className="text-slate-900 block font-bold">Battery Integrity:</strong>
                  <span>{current.battery}</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200/60 shadow-2xs flex items-start gap-2.5">
                <span className="text-base">📱</span>
                <div>
                  <strong className="text-slate-900 block font-bold">Display & Glass:</strong>
                  <span>{current.screen}</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200/60 shadow-2xs flex items-start gap-2.5">
                <span className="text-base">🛡️</span>
                <div>
                  <strong className="text-slate-900 block font-bold">Body & Outer Chassis:</strong>
                  <span>{current.body}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {current.warranty}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Select this Grade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GradeVisualizerModal;
