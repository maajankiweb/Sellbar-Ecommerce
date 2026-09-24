'use client';

import React from 'react';

export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200 bg-white p-5 animate-pulse dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="h-3 w-24 bg-slate-200 rounded dark:bg-slate-800" />
            <div className="h-9 w-9 bg-slate-200 rounded-lg dark:bg-slate-800" />
          </div>
          <div className="h-7 w-32 bg-slate-200 rounded mb-3 dark:bg-slate-800" />
          <div className="h-3 w-40 bg-slate-200 rounded dark:bg-slate-800" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 p-4 flex justify-between gap-4 animate-pulse dark:border-slate-800">
        <div className="h-9 w-64 bg-slate-200 rounded-lg dark:bg-slate-800" />
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-slate-200 rounded-lg dark:bg-slate-800" />
          <div className="h-9 w-24 bg-slate-200 rounded-lg dark:bg-slate-800" />
        </div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex items-center justify-between gap-4 animate-pulse">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className="h-4 bg-slate-200 rounded dark:bg-slate-800"
                style={{ width: `${Math.floor(60 + ((r * 13 + c * 29) % 70))}px` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 animate-pulse dark:border-slate-800 dark:bg-slate-900">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="h-4 w-32 bg-slate-200 rounded mb-2 dark:bg-slate-800" />
          <div className="h-3 w-48 bg-slate-200 rounded dark:bg-slate-800" />
        </div>
        <div className="h-8 w-40 bg-slate-200 rounded-lg dark:bg-slate-800" />
      </div>
      <div className="h-64 w-full bg-slate-100 rounded-lg dark:bg-slate-800/50 flex items-end p-4 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-slate-200 rounded-t dark:bg-slate-700/60"
            style={{ height: `${25 + ((i * 17) % 70)}%` }}
          />
        ))}
      </div>
    </div>
  );
}
