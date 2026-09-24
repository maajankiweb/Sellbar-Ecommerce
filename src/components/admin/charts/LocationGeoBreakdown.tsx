'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

export function LocationGeoBreakdown() {
  const regions = [
    { state: 'Maharashtra', cities: 'Mumbai, Pune, Nagpur', revenue: '₹4,12,000', percentage: 33 },
    { state: 'Karnataka', cities: 'Bengaluru, Mysuru, Hubli', revenue: '₹3,24,600', percentage: 26 },
    { state: 'Delhi NCR', cities: 'New Delhi, Noida, Gurugram', revenue: '₹2,62,100', percentage: 21 },
    { state: 'Tamil Nadu', cities: 'Chennai, Coimbatore, Madurai', revenue: '₹1,49,800', percentage: 12 },
    { state: 'Telangana', cities: 'Hyderabad, Warangal', revenue: '₹1,00,000', percentage: 8 },
  ];

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Sales by Location
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Top performing states and tier-1 metropolitan hubs
          </p>
        </div>
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
          India (Domestic)
        </span>
      </div>

      <div className="mt-4 space-y-3.5">
        {regions.map((reg, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                <span className="font-semibold">{reg.state}</span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  ({reg.cities})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {reg.revenue}
                </span>
                <span className="w-8 text-right text-slate-400">{reg.percentage}%</span>
              </div>
            </div>

            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-600 dark:bg-blue-500"
                style={{ width: `${reg.percentage * 3}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
