'use client';

import React from 'react';
import { SlidersHorizontal, ArrowUpDown, ChevronDown } from 'lucide-react';

export type SortKey = 
  | 'newest'
  | 'urgent'
  | 'value_high'
  | 'value_low'
  | 'stock_low'
  | 'rating';

export interface SortOption {
  id: SortKey;
  label: string;
}

export interface SegmentedSortBarProps {
  currentSort: SortKey;
  onSortChange: (sort: SortKey) => void;
  totalCount: number;
  onOpenMobileFilter?: () => void;
  activeFilterCount?: number;
}

const PRIMARY_SORTS: { id: SortKey; label: string }[] = [
  { id: 'newest', label: 'Newest First' },
  { id: 'urgent', label: 'SLA Urgent' },
  { id: 'value_high', label: 'Price: High to Low' },
  { id: 'stock_low', label: 'Low Stock' },
];

export function SegmentedSortBar({
  currentSort,
  onSortChange,
  totalCount,
  onOpenMobileFilter,
  activeFilterCount = 0
}: SegmentedSortBarProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
      {/* Left: Total Count and Mobile Filter Trigger */}
      <div className="flex items-center gap-3">
        {onOpenMobileFilter && (
          <button
            type="button"
            onClick={onOpenMobileFilter}
            className="lg:hidden inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md border border-slate-300 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 text-[10px] font-bold bg-blue-600 text-white rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        <div className="text-xs font-medium text-slate-600">
          Showing <span className="font-bold text-slate-900">{totalCount}</span> items
        </div>
      </div>

      {/* Right: Desktop Segmented Sorting Pills */}
      <div className="hidden sm:flex items-center gap-1.5">
        <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
          <ArrowUpDown className="w-3 h-3 text-slate-400" />
          Sort by:
        </span>

        <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          {PRIMARY_SORTS.map((sort) => {
            const isActive = currentSort === sort.id;
            return (
              <button
                key={sort.id}
                type="button"
                onClick={() => onSortChange(sort.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  isActive
                    ? 'bg-white text-blue-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sort.label}
              </button>
            );
          })}
        </div>

        {/* Secondary dropdown for remaining options */}
        <div className="relative inline-block ml-1">
          <select
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            aria-label="More sort options"
            className="appearance-none pl-2.5 pr-6 py-1 text-xs font-medium bg-white text-slate-700 border border-slate-200 rounded-md hover:border-slate-300 focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="newest">More: Newest First</option>
            <option value="urgent">More: SLA Urgent</option>
            <option value="value_high">More: Price: High to Low</option>
            <option value="value_low">More: Price: Low to High</option>
            <option value="stock_low">More: Stock: Low to High</option>
            <option value="rating">More: Top Rated</option>
          </select>
          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Mobile Select dropdown */}
      <div className="sm:hidden w-full pt-1">
        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            aria-label="Sort options"
            className="w-full appearance-none pl-3 pr-8 py-1.5 text-xs font-medium bg-slate-50 text-slate-800 border border-slate-200 rounded-md focus:outline-none focus:border-blue-600"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="urgent">Sort: SLA Urgent</option>
            <option value="value_high">Sort: Price (High to Low)</option>
            <option value="value_low">Sort: Price (Low to High)</option>
            <option value="stock_low">Sort: Low Stock Alert</option>
            <option value="rating">Sort: Top Rated</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
