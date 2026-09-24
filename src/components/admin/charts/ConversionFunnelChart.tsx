'use client';

import React from 'react';
import { ArrowDown, Users, Eye, ShoppingCart, CreditCard, CheckCircle2 } from 'lucide-react';

export function ConversionFunnelChart() {
  const steps = [
    { label: 'Store Visitors', count: '1,42,800', dropoff: '100%', icon: Users, color: 'bg-blue-600', width: '100%' },
    { label: 'Product Views', count: '64,260', dropoff: '45.0%', icon: Eye, color: 'bg-indigo-600', width: '82%' },
    { label: 'Add to Cart', count: '18,560', dropoff: '28.9%', icon: ShoppingCart, color: 'bg-sky-600', width: '64%' },
    { label: 'Initiated Checkout', count: '7,420', dropoff: '40.0%', icon: CreditCard, color: 'bg-amber-600', width: '46%' },
    { label: 'Completed Purchase', count: '3,248', dropoff: '43.8%', icon: CheckCircle2, color: 'bg-emerald-600', width: '32%' },
  ];

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Conversion Funnel
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            End-to-end shopper journey and drop-off analysis
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Net Conversion</span>
          <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
            3.82%
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="relative">
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                  <Icon className="h-3.5 w-3.5 text-slate-400" />
                  <span>{step.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{step.count}</span>
                  <span className="text-[11px] text-slate-400">({step.dropoff})</span>
                </div>
              </div>

              {/* Bar */}
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${step.color}`}
                  style={{ width: step.width }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
