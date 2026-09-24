'use client';

import React, { useState } from 'react';
import { X, CreditCard, RefreshCw, Sparkles, ArrowRight, Percent } from 'lucide-react';

interface EmiExchangeCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  price: number;
  productName: string;
}

export function EmiExchangeCalculator({
  isOpen,
  onClose,
  price,
  productName,
}: EmiExchangeCalculatorProps) {
  const [exchangeBonus, setExchangeBonus] = useState(15000);
  const [emiTenure, setEmiTenure] = useState<3 | 6 | 9 | 12>(6);

  if (!isOpen) return null;

  const finalExchangePrice = Math.max(price - exchangeBonus, 2000);
  const monthlyEmi = Math.round(price / emiTenure);
  const monthlyEmiWithExchange = Math.round(finalExchangePrice / emiTenure);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 overflow-hidden space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Affordability & Exchange Engine</span>
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

        {/* Section 1: No-Cost EMI Breakdown */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>No-Cost EMI Options (0% Interest)</span>
            </div>
            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Zero Downpayment
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[3, 6, 9, 12].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setEmiTenure(m as any)}
                className={`py-2 px-2 rounded-xl text-center border transition ${
                  emiTenure === m
                    ? 'border-emerald-600 bg-white font-bold text-emerald-800 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="text-[10px] text-slate-400">{m} Months</div>
                <div className="text-xs font-black text-slate-900">₹{Math.round(price / m).toLocaleString('en-IN')}/m</div>
              </button>
            ))}
          </div>

          <p className="text-[10px] text-slate-500">
            Applicable on HDFC, ICICI, SBI, Axis, and OneCard Credit Cards & Bajaj Finserv.
          </p>
        </div>

        {/* Section 2: Old Phone Exchange Discount */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <RefreshCw className="w-4 h-4 text-emerald-600" />
              <span>Exchange Old Device For Instant Discount</span>
            </div>
            <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full">
              Extra ₹2,500 Bonus
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Estimated Old Device Value:</span>
              <span className="font-bold text-emerald-800">₹{exchangeBonus.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={3000}
              max={Math.min(price - 2000, 45000)}
              step={1000}
              value={exchangeBonus}
              onChange={(e) => setExchangeBonus(Number(e.target.value))}
              className="w-full h-1.5 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-slate-500 block">Effective Price with Exchange:</span>
              <span className="text-lg font-black text-emerald-800">
                ₹{finalExchangePrice.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-500 block">Or on {emiTenure}m EMI:</span>
              <span className="text-base font-black text-slate-900">
                ₹{monthlyEmiWithExchange.toLocaleString('en-IN')}/mo
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
        >
          <span>Apply These Savings & Proceed</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default EmiExchangeCalculator;
