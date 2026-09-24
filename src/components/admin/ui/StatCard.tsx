'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeText?: string;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  sparklineData?: number[];
}

export function StatCard({
  title,
  value,
  change,
  changeText = 'vs previous period',
  prefix = '',
  suffix = '',
  icon,
  iconBg = 'bg-blue-50 dark:bg-blue-950/50',
  iconColor = 'text-blue-600 dark:text-blue-400',
  sparklineData = [10, 15, 12, 18, 22, 28, 26, 32, 38],
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  // Mini sparkline SVG generator
  const max = Math.max(...sparklineData, 1);
  const min = Math.min(...sparklineData, 0);
  const range = max - min || 1;
  const width = 80;
  const height = 28;
  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {prefix}
          {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          {suffix}
        </div>

        {/* Mini sparkline */}
        <div className="hidden sm:block opacity-75">
          <svg width={width} height={height} className="overflow-visible">
            <polyline
              fill="none"
              stroke={isNegative ? '#f43f5e' : '#10b981'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>

      {change !== undefined && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center font-semibold rounded-md px-1.5 py-0.5 ${
              isPositive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                : isNegative
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" />
            ) : isNegative ? (
              <ArrowDownRight className="mr-0.5 h-3.5 w-3.5" />
            ) : (
              <Minus className="mr-0.5 h-3.5 w-3.5" />
            )}
            {change > 0 ? `+${change}%` : `${change}%`}
          </span>
          <span className="text-slate-500 dark:text-slate-400 truncate">{changeText}</span>
        </div>
      )}
    </div>
  );
}
