'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, X, Smartphone, Wrench, ShoppingBag } from 'lucide-react';

interface ActivityNotification {
  id: string;
  type: 'sell' | 'buy' | 'repair';
  text: string;
  timeAgo: string;
  city: string;
  amount: string;
}

const ACTIVITIES: ActivityNotification[] = [
  {
    id: 'act-1',
    type: 'sell',
    text: 'Sold iPhone 13 128GB',
    timeAgo: '2m ago',
    city: 'Patna',
    amount: '₹28,400 Cash Payout',
  },
  {
    id: 'act-2',
    type: 'buy',
    text: 'Bought Refurbished MacBook Air M1',
    timeAgo: '4m ago',
    city: 'Bettiah',
    amount: '₹42,999 (Saved 52%)',
  },
  {
    id: 'act-3',
    type: 'repair',
    text: 'Booked 30-min Express Screen Repair',
    timeAgo: '6m ago',
    city: 'Muzaffarpur',
    amount: '₹2,499 (OEM Screen)',
  },
  {
    id: 'act-4',
    type: 'sell',
    text: 'Sold Galaxy S22 Ultra',
    timeAgo: '8m ago',
    city: 'Noida',
    amount: '₹34,500 Instant UPI',
  },
];

export function LiveActivityTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ACTIVITIES.length);
        setIsVisible(true);
      }, 400);
    }, 5500);

    return () => clearInterval(interval);
  }, [isDismissed]);

  if (isDismissed) return null;

  const current = ACTIVITIES[currentIndex];

  const getIcon = () => {
    switch (current.type) {
      case 'sell':
        return <Smartphone className="w-3.5 h-3.5 text-emerald-600" />;
      case 'buy':
        return <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />;
      case 'repair':
        return <Wrench className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-30 select-none max-w-xs sm:max-w-sm">
      <div
        className={`bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-3 shadow-xl transition-all duration-300 flex items-center justify-between gap-3 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            {getIcon()}
          </div>
          <div className="space-y-0.5 overflow-hidden">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Verified Customer in {current.city}</span>
              <span>•</span>
              <span>{current.timeAgo}</span>
            </div>
            <div className="text-xs font-bold text-slate-900 truncate">
              {current.text}
            </div>
            <div className="text-[10px] font-black text-emerald-700">
              {current.amount}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0"
          title="Dismiss activity feed"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default LiveActivityTicker;
