'use client';

import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

interface RevenueAreaChartProps {
  initialRange?: string;
}

export function RevenueAreaChart({ initialRange = '30d' }: RevenueAreaChartProps) {
  const [range, setRange] = useState(initialRange);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Realistic revenue datasets based on range
  const datasets: Record<string, { label: string; revenue: number; orders: number }[]> = {
    today: [
      { label: '00:00', revenue: 2400, orders: 1 },
      { label: '04:00', revenue: 1200, orders: 1 },
      { label: '08:00', revenue: 8900, orders: 4 },
      { label: '12:00', revenue: 19800, orders: 9 },
      { label: '16:00', revenue: 24500, orders: 11 },
      { label: '20:00', revenue: 7400, orders: 3 },
    ],
    '7d': [
      { label: 'Thu 18', revenue: 142000, orders: 38 },
      { label: 'Fri 19', revenue: 168000, orders: 44 },
      { label: 'Sat 20', revenue: 224000, orders: 62 },
      { label: 'Sun 21', revenue: 265000, orders: 74 },
      { label: 'Mon 22', revenue: 178000, orders: 49 },
      { label: 'Tue 23', revenue: 189000, orders: 52 },
      { label: 'Wed 24', revenue: 215000, orders: 58 },
    ],
    '30d': [
      { label: 'Sep 01', revenue: 32000, orders: 8 },
      { label: 'Sep 05', revenue: 45000, orders: 12 },
      { label: 'Sep 09', revenue: 38000, orders: 10 },
      { label: 'Sep 13', revenue: 58000, orders: 15 },
      { label: 'Sep 17', revenue: 64000, orders: 18 },
      { label: 'Sep 21', revenue: 89000, orders: 24 },
      { label: 'Sep 24', revenue: 112000, orders: 29 },
    ],
    '3m': [
      { label: 'Jul 26', revenue: 380000, orders: 1040 },
      { label: 'Aug 26', revenue: 420000, orders: 1120 },
      { label: 'Sep 26', revenue: 448500, orders: 1088 },
    ],
    '1y': [
      { label: 'Q4 25', revenue: 950000, orders: 2400 },
      { label: 'Q1 26', revenue: 1100000, orders: 2800 },
      { label: 'Q2 26', revenue: 1180000, orders: 3100 },
      { label: 'Q3 26', revenue: 1248500, orders: 3248 },
    ],
  };

  const currentData = datasets[range] || datasets['30d'];
  const maxRevenue = Math.max(...currentData.map(d => d.revenue));
  const minRevenue = 0;

  // Generate SVG path coordinates
  const width = 640;
  const height = 220;
  const paddingX = 40;
  const paddingY = 25;

  const points = currentData.map((d, i) => {
    const x = paddingX + (i / (currentData.length - 1)) * (width - 2 * paddingX);
    const y =
      height - paddingY - ((d.revenue - minRevenue) / (maxRevenue || 1)) * (height - 2 * paddingY);
    return { x, y, ...d };
  });

  const linePath = points.reduce(
    (acc, curr, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`,
    ''
  );

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${height - paddingY} L ${points[0].x.toFixed(1)} ${height - paddingY} Z`;

  const totalPeriodRevenue = currentData.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
      {/* Header with Title and Range Switcher */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Revenue Overview
            </h3>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <ArrowUpRight className="h-3 w-3" />
              +18.4%
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Total for selected period: <strong className="text-slate-800 dark:text-slate-200">₹{totalPeriodRevenue.toLocaleString('en-IN')}</strong>
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800 text-xs font-medium">
          {[
            { label: 'Today', key: 'today' },
            { label: '7D', key: '7d' },
            { label: '30D', key: '30d' },
            { label: '3M', key: '3m' },
            { label: '1Y', key: '1y' },
          ].map(r => (
            <button
              key={r.key}
              onClick={() => {
                setRange(r.key);
                setHoveredIndex(null);
              }}
              className={`rounded-md px-2.5 py-1 transition-colors cursor-pointer ${
                range === r.key
                  ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative mt-4 h-60 w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[0.25, 0.5, 0.75, 1].map(ratio => {
            const y = height - paddingY - ratio * (height - 2 * paddingY);
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#94a3b8"
                  strokeOpacity="0.18"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingX - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#94a3b8"
                  className="select-none font-mono"
                >
                  ₹{Math.round((maxRevenue * ratio) / 1000)}k
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#revenueGradient)" />

          {/* Glowing Stroke */}
          <path
            d={linePath}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Points */}
          {points.map((p, idx) => (
            <g
              key={idx}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === idx ? 6 : 4}
                className="fill-white stroke-blue-600 transition-all duration-150 dark:fill-slate-900"
                strokeWidth={hoveredIndex === idx ? 3 : 2}
              />
              <text
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                fontSize="10"
                fill="#64748b"
                className="select-none"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-lg border border-slate-200 bg-slate-900 px-3 py-2 text-xs text-white shadow-xl dark:border-slate-700"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${(points[hoveredIndex].y / height) * 100 - 8}%`,
            }}
          >
            <div className="font-semibold text-slate-300">
              {points[hoveredIndex].label}
            </div>
            <div className="text-sm font-bold text-emerald-400">
              ₹{points[hoveredIndex].revenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-400">
              {points[hoveredIndex].orders} orders
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
