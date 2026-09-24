'use client';

import React, { useState } from 'react';
import { PackageCheck, RotateCcw, XCircle } from 'lucide-react';

export function OrdersBarChart() {
  const [activeSeries, setActiveSeries] = useState<{ [key: string]: boolean }>({
    completed: true,
    cancelled: true,
    returned: true,
  });

  const data = [
    { day: 'Mon', completed: 42, cancelled: 3, returned: 2 },
    { day: 'Tue', completed: 48, cancelled: 4, returned: 1 },
    { day: 'Wed', completed: 55, cancelled: 2, returned: 3 },
    { day: 'Thu', completed: 62, cancelled: 5, returned: 2 },
    { day: 'Fri', completed: 74, cancelled: 6, returned: 4 },
    { day: 'Sat', completed: 88, cancelled: 4, returned: 5 },
    { day: 'Sun', completed: 96, cancelled: 5, returned: 3 },
  ];

  const maxVal = 110;

  const toggle = (series: string) => {
    setActiveSeries(prev => ({ ...prev, [series]: !prev[series] }));
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Orders Breakdown
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Delivery fulfillment & return rates this week
          </p>
        </div>

        {/* Legend toggles */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => toggle('completed')}
            className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${
              activeSeries.completed ? 'opacity-100' : 'opacity-40 line-through'
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
            <span className="font-medium text-slate-700 dark:text-slate-300">Completed</span>
          </button>

          <button
            onClick={() => toggle('cancelled')}
            className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${
              activeSeries.cancelled ? 'opacity-100' : 'opacity-40 line-through'
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
            <span className="font-medium text-slate-700 dark:text-slate-300">Cancelled</span>
          </button>

          <button
            onClick={() => toggle('returned')}
            className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${
              activeSeries.returned ? 'opacity-100' : 'opacity-40 line-through'
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
            <span className="font-medium text-slate-700 dark:text-slate-300">Returned</span>
          </button>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="mt-5 flex h-48 items-end gap-3 sm:gap-6 pt-4 px-2">
        {data.map((item, i) => {
          const compH = activeSeries.completed ? (item.completed / maxVal) * 100 : 0;
          const cancH = activeSeries.cancelled ? (item.cancelled / maxVal) * 100 : 0;
          const retH = activeSeries.returned ? (item.returned / maxVal) * 100 : 0;

          return (
            <div key={i} className="group relative flex flex-1 flex-col items-center h-full justify-end">
              {/* Tooltip */}
              <div className="pointer-events-none absolute -top-12 z-20 hidden -translate-x-1/2 flex-col items-center rounded-md bg-slate-900 px-2 py-1 text-[11px] text-white shadow-lg group-hover:flex whitespace-nowrap">
                <span>Completed: {item.completed}</span>
                <span className="text-amber-300">Cancelled: {item.cancelled}</span>
                <span className="text-rose-300">Returned: {item.returned}</span>
              </div>

              {/* Bars container */}
              <div className="flex w-full max-w-[28px] items-end justify-center gap-0.5 h-full">
                {activeSeries.completed && (
                  <div
                    style={{ height: `${compH}%` }}
                    className="w-full bg-emerald-500 rounded-t-sm transition-all duration-300 group-hover:bg-emerald-600"
                  />
                )}
                {activeSeries.cancelled && (
                  <div
                    style={{ height: `${cancH}%` }}
                    className="w-full bg-amber-500 rounded-t-sm transition-all duration-300 group-hover:bg-amber-600"
                  />
                )}
                {activeSeries.returned && (
                  <div
                    style={{ height: `${retH}%` }}
                    className="w-full bg-rose-500 rounded-t-sm transition-all duration-300 group-hover:bg-rose-600"
                  />
                )}
              </div>

              {/* Day Label */}
              <span className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
