'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, ArrowRight, CheckCircle2, TrendingDown } from 'lucide-react';

interface ComparisonItem {
  id: string;
  category: string;
  name: string;
  image: string;
  newPrice: number;
  refurbPrice: number;
  grade: string;
  batteryHealth: string;
  popular: boolean;
}

const COMPARISON_DATA: ComparisonItem[] = [
  {
    id: 'c-1',
    category: 'flagship',
    name: 'Apple iPhone 14 (128GB - Midnight)',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80',
    newPrice: 69900,
    refurbPrice: 38499,
    grade: 'Superb (Grade A)',
    batteryHealth: '94% OEM Battery',
    popular: true,
  },
  {
    id: 'c-2',
    category: 'pro',
    name: 'Apple iPhone 15 Pro (128GB - Natural Titanium)',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80',
    newPrice: 119900,
    refurbPrice: 79999,
    grade: 'Superb (Grade A)',
    batteryHealth: '98% OEM Battery',
    popular: true,
  },
  {
    id: 'c-3',
    category: 'laptop',
    name: 'Apple MacBook Air M1 (8GB / 256GB SSD)',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80',
    newPrice: 89900,
    refurbPrice: 42999,
    grade: 'Superb (Grade A)',
    batteryHealth: '91% OEM Cycle',
    popular: false,
  },
  {
    id: 'c-4',
    category: 'android',
    name: 'Samsung Galaxy S23 5G (128GB - Phantom Black)',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80',
    newPrice: 74999,
    refurbPrice: 39499,
    grade: 'Superb (Grade A)',
    batteryHealth: '95% Battery Health',
    popular: false,
  },
];

export function RefurbVsNewSlider() {
  const [selectedItem, setSelectedItem] = useState<ComparisonItem>(COMPARISON_DATA[0]);

  const savings = selectedItem.newPrice - selectedItem.refurbPrice;
  const savingsPercent = Math.round((savings / selectedItem.newPrice) * 100);

  return (
    <section className="w-full py-14 sm:py-18 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Smart Recommerce Economics</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
            Brand New Retail vs <span className="text-emerald-600">SELBAR Refurbished</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Why pay double for showroom packaging? Compare the exact numbers below and see how much you save without compromising on quality or warranty.
          </p>
        </div>

        {/* Model Switcher Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {COMPARISON_DATA.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedItem(item)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 ${
                selectedItem.id === item.id
                  ? 'bg-slate-900 text-white shadow-md scale-102'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              <span>{item.name.split('(')[0].trim()}</span>
              {item.popular && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[9px] font-black">
                  POPULAR
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Interactive Comparison Split Card */}
        <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          {/* Top Savings Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-black text-xl shrink-0 backdrop-blur-xs">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-100">
                  Calculated Net Savings
                </div>
                <div className="text-xl sm:text-2xl font-black">
                  Save ₹{savings.toLocaleString('en-IN')} ({savingsPercent}% Off)
                </div>
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-white text-emerald-800 font-bold text-xs shadow-xs">
              + 12-Month Assured Warranty
            </div>
          </div>

          {/* 2-Column Split Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {/* Column A: Brand New Showroom */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-5 shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                    Brand New Showroom
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Standard MRP</span>
                </div>

                <div className="h-40 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden p-2">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="h-full object-contain filter grayscale-30"
                  />
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-500 line-through">Full Retail Price</div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-500">
                    ₹{selectedItem.newPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2">✕ Depreciates 30% the moment unboxed</li>
                  <li className="flex items-center gap-2">✕ Standard 1-year brand warranty</li>
                  <li className="flex items-center gap-2">✕ High retail packaging markup</li>
                </ul>
              </div>

              <div className="pt-4 text-center text-xs text-slate-400 italic">
                Full retail expense for showroom box
              </div>
            </div>

            {/* Column B: SELBAR Certified Refurbished */}
            <div className="bg-gradient-to-b from-emerald-50/70 to-white rounded-2xl border-2 border-emerald-500/80 p-6 flex flex-col justify-between space-y-5 shadow-lg relative">
              {/* Highlight Tag */}
              <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                Smart Choice
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                    SELBAR Certified
                  </span>
                  <span className="text-xs font-bold text-emerald-700">{selectedItem.grade}</span>
                </div>

                <div className="h-40 rounded-xl bg-white flex items-center justify-center overflow-hidden p-2 border border-emerald-100">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="h-full object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-emerald-700">Refurbished Deal Price</div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                    ₹{selectedItem.refurbPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-emerald-100 font-medium">
                  <li className="flex items-center gap-2 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Passed 32-Point Factory Diagnostic QC</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{selectedItem.batteryHealth}</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>12-Month Hardware Warranty + 15D Return</span>
                  </li>
                </ul>
              </div>

              <Link
                href={`/buy?search=${encodeURIComponent(selectedItem.name.split('(')[0].trim())}`}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                <span>Buy & Save ₹{savings.toLocaleString('en-IN')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RefurbVsNewSlider;
