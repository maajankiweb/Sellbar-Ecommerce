'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, Lock, Sparkles } from 'lucide-react';

interface PriceLockBannerProps {
  price: number;
  modelName: string;
}

export function PriceLockBanner({ price, modelName }: PriceLockBannerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 71, minutes: 59, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format2 = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-center sm:text-left">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white shrink-0 backdrop-blur-xs">
          <Lock className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100 bg-white/10 px-2 py-0.5 rounded-full">
              72-Hour Price Guarantee
            </span>
          </div>
          <div className="text-sm sm:text-base font-black">
            ₹{price.toLocaleString('en-IN')} Locked for {modelName}
          </div>
          <p className="text-[11px] text-emerald-100">
            Zero doorstep cuts. The valuation you see is the exact amount transferred to your UPI.
          </p>
        </div>
      </div>

      {/* Countdown Timer Block */}
      <div className="flex items-center gap-2 bg-slate-950/30 px-3.5 py-2 rounded-xl backdrop-blur-xs border border-white/10 shrink-0">
        <Clock className="w-4 h-4 text-emerald-300 shrink-0" />
        <div className="text-center">
          <div className="text-[9px] uppercase tracking-wider text-emerald-200 font-bold leading-none">
            Offer Expires In
          </div>
          <div className="font-mono font-black text-sm text-white tracking-widest mt-0.5">
            {format2(timeLeft.hours)}h : {format2(timeLeft.minutes)}m : {format2(timeLeft.seconds)}s
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceLockBanner;
