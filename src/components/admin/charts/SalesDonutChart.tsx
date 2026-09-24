'use client';

import React, { useState } from 'react';

export function SalesDonutChart() {
  const [tab, setTab] = useState<'category' | 'payment'>('category');

  const categoryData = [
    { label: 'Smartphones', percentage: 46, amount: '₹5,74,310', color: '#2563eb' },
    { label: 'Audio & Wearables', percentage: 22, amount: '₹2,74,670', color: '#06b6d4' },
    { label: 'Laptops & Computers', percentage: 18, amount: '₹2,24,730', color: '#8b5cf6' },
    { label: 'Footwear & Apparel', percentage: 9, amount: '₹1,12,365', color: '#f59e0b' },
    { label: 'Accessories', percentage: 5, amount: '₹62,425', color: '#10b981' },
  ];

  const paymentData = [
    { label: 'UPI (GPay/PhonePe)', percentage: 54, amount: '₹6,74,190', color: '#10b981' },
    { label: 'Credit/Debit Cards', percentage: 26, amount: '₹3,24,610', color: '#2563eb' },
    { label: 'Cash on Delivery', percentage: 12, amount: '₹1,49,820', color: '#f59e0b' },
    { label: 'Net Banking', percentage: 5, amount: '₹62,425', color: '#8b5cf6' },
    { label: 'Wallets', percentage: 3, amount: '₹37,455', color: '#ec4899' },
  ];

  const currentData = tab === 'category' ? categoryData : paymentData;

  // Compute SVG conic gradients or strokeDasharray slices
  let accumulatedAngle = 0;
  const size = 160;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Sales Breakdown
        </h3>
        <div className="flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800 text-xs font-medium">
          <button
            onClick={() => setTab('category')}
            className={`rounded-md px-2.5 py-1 transition-colors cursor-pointer ${
              tab === 'category'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Category
          </button>
          <button
            onClick={() => setTab('payment')}
            className={`rounded-md px-2.5 py-1 transition-colors cursor-pointer ${
              tab === 'payment'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Payment Method
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center gap-6">
        {/* SVG Donut Circle */}
        <div className="relative flex shrink-0 items-center justify-center">
          <svg width={size} height={size} className="-rotate-90 transform">
            {currentData.map((item, idx) => {
              const strokeDashoffset = circumference - (item.percentage / 100) * circumference;
              const rotation = (accumulatedAngle / 100) * 360;
              accumulatedAngle += item.percentage;

              return (
                <circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    transformOrigin: '50% 50%',
                    transform: `rotate(${rotation}deg)`,
                    transition: 'all 0.4s ease',
                  }}
                />
              );
            })}
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Total
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              100%
            </span>
          </div>
        </div>

        {/* Legend list */}
        <div className="flex-1 w-full space-y-2.5">
          {currentData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-slate-700 dark:text-slate-200 truncate">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400">{item.amount}</span>
                <span className="font-bold text-slate-900 dark:text-white w-8 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
