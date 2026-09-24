'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Flame, AlertCircle } from 'lucide-react';

interface ScarcityViewerBadgeProps {
  productId: string;
  stockCount?: number;
}

export default function ScarcityViewerBadge({ productId, stockCount }: ScarcityViewerBadgeProps) {
  // Generate deterministic-looking live viewers based on product id
  const [viewers, setViewers] = useState<number>(12);
  const [stock, setStock] = useState<number>(stockCount || 3);

  useEffect(() => {
    // Generate pseudo-random consistent base viewer count
    let hash = 0;
    for (let i = 0; i < productId.length; i++) {
      hash = (hash << 5) - hash + productId.charCodeAt(i);
      hash |= 0;
    }
    const base = Math.abs(hash % 18) + 5; // between 5 and 22
    setViewers(base);

    // Subtle viewer fluctuation every 12 seconds
    const interval = setInterval(() => {
      setViewers((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(3, prev + delta);
      });
    }, 12000);

    return () => clearInterval(interval);
  }, [productId]);

  const isLowStock = stock <= 3;

  return (
    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold">
      {/* Live Viewers Indicator */}
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/5 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
        <Eye className="w-2.5 h-2.5 text-slate-400" />
        <span>{viewers} looking now</span>
      </span>

      {/* Scarcity badge if stock is low */}
      {isLowStock && (
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse">
          <Flame className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
          <span>Only {stock} left!</span>
        </span>
      )}
    </div>
  );
}
