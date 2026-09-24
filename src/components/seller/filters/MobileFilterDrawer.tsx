'use client';

import React, { useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { FilterSidebar, FilterState } from './FilterSidebar';
import { FacetOption } from './SearchableFacetList';

export interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  categoryOptions: FacetOption[];
  brandOptions: FacetOption[];
  statusOptions: FacetOption[];
  fulfillmentOptions: FacetOption[];
  totalResultsCount: number;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  categoryOptions,
  brandOptions,
  statusOptions,
  fulfillmentOptions,
  totalResultsCount
}: MobileFilterDrawerProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReset = () => {
    onFilterChange({
      categories: [],
      brands: [],
      priceRange: [1000, 100000],
      statuses: [],
      fulfillment: []
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Bottom Sheet Modal Container */}
      <div className="relative z-10 w-full max-h-[88vh] bg-white rounded-t-2xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Filters & Refinements</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Scroll */}
        <div className="flex-1 overflow-y-auto p-4">
          <FilterSidebar
            filters={filters}
            onFilterChange={onFilterChange}
            categoryOptions={categoryOptions}
            brandOptions={brandOptions}
            statusOptions={statusOptions}
            fulfillmentOptions={fulfillmentOptions}
            className="border-0 shadow-none"
          />
        </div>

        {/* Sticky Drawer Footer */}
        <div className="p-3 border-t border-slate-200 bg-white grid grid-cols-2 gap-3 shadow-lg">
          <button
            type="button"
            onClick={handleReset}
            className="py-2.5 px-4 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors text-center"
          >
            Apply ({totalResultsCount} items)
          </button>
        </div>
      </div>
    </div>
  );
}
