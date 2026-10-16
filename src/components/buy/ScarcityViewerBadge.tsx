'use client';

import React from 'react';
import { Flame } from 'lucide-react';

interface ScarcityViewerBadgeProps {
  productId?: string;
  stockCount?: number;
}

export default function ScarcityViewerBadge({ stockCount }: ScarcityViewerBadgeProps) {
  // Only display genuine low stock if stockCount is explicitly provided and low
  if (typeof stockCount !== 'number' || stockCount <= 0 || stockCount > 3) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 text-[10px] font-semibold">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
        <Flame className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
        <span>Only {stockCount} left</span>
      </span>
    </div>
  );
}
