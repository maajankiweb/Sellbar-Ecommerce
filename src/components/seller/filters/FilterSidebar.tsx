'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, Filter } from 'lucide-react';
import { PriceRangeSlider } from './PriceRangeSlider';
import { SearchableFacetList, FacetOption } from './SearchableFacetList';

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  statuses: string[];
  fulfillment: string[];
}

export interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  categoryOptions: FacetOption[];
  brandOptions: FacetOption[];
  statusOptions: FacetOption[];
  fulfillmentOptions: FacetOption[];
  minPrice?: number;
  maxPrice?: number;
  className?: string;
}

export function FilterSidebar({
  filters,
  onFilterChange,
  categoryOptions,
  brandOptions,
  statusOptions,
  fulfillmentOptions,
  minPrice = 1000,
  maxPrice = 100000,
  className = ''
}: FilterSidebarProps) {
  // Accordion open states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    brands: true,
    status: true,
    fulfillment: true
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleResetAll = () => {
    onFilterChange({
      categories: [],
      brands: [],
      priceRange: [minPrice, maxPrice],
      statuses: [],
      fulfillment: []
    });
  };

  const activeCount =
    filters.categories.length +
    filters.brands.length +
    filters.statuses.length +
    filters.fulfillment.length +
    (filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice ? 1 : 0);

  return (
    <aside className={`w-full bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden ${className}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Filters</h3>
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 text-[11px] font-bold bg-blue-100 text-blue-700 rounded-full">
              {activeCount}
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleResetAll}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Accordion 1: Categories */}
      <div className="border-b border-slate-100">
        <button
          type="button"
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-800 uppercase tracking-wider hover:bg-slate-50 transition-colors"
        >
          <span>Category</span>
          {openSections.categories ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
        {openSections.categories && (
          <div className="px-3 pb-3">
            <SearchableFacetList
              options={categoryOptions}
              selectedIds={filters.categories}
              onChange={(ids) => onFilterChange({ ...filters, categories: ids })}
              searchPlaceholder="Filter category..."
              enableSearch={false}
              initialVisibleCount={5}
            />
          </div>
        )}
      </div>

      {/* Accordion 2: Price Range */}
      <div className="border-b border-slate-100">
        <button
          type="button"
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-800 uppercase tracking-wider hover:bg-slate-50 transition-colors"
        >
          <span>Price Range</span>
          {openSections.price ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
        {openSections.price && (
          <div className="px-3 pb-3">
            <PriceRangeSlider
              min={minPrice}
              max={maxPrice}
              step={500}
              value={filters.priceRange}
              onChange={(range) => onFilterChange({ ...filters, priceRange: range })}
            />
          </div>
        )}
      </div>

      {/* Accordion 3: Brands */}
      <div className="border-b border-slate-100">
        <button
          type="button"
          onClick={() => toggleSection('brands')}
          className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-800 uppercase tracking-wider hover:bg-slate-50 transition-colors"
        >
          <span>Brand</span>
          {openSections.brands ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
        {openSections.brands && (
          <div className="px-3 pb-3">
            <SearchableFacetList
              options={brandOptions}
              selectedIds={filters.brands}
              onChange={(ids) => onFilterChange({ ...filters, brands: ids })}
              searchPlaceholder="Search brand..."
              enableSearch={true}
              initialVisibleCount={5}
            />
          </div>
        )}
      </div>

      {/* Accordion 4: Inventory Status */}
      <div className="border-b border-slate-100">
        <button
          type="button"
          onClick={() => toggleSection('status')}
          className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-800 uppercase tracking-wider hover:bg-slate-50 transition-colors"
        >
          <span>Inventory Status</span>
          {openSections.status ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
        {openSections.status && (
          <div className="px-3 pb-3">
            <SearchableFacetList
              options={statusOptions}
              selectedIds={filters.statuses}
              onChange={(ids) => onFilterChange({ ...filters, statuses: ids })}
              enableSearch={false}
              initialVisibleCount={5}
            />
          </div>
        )}
      </div>

      {/* Accordion 5: Fulfillment Method */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection('fulfillment')}
          className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-800 uppercase tracking-wider hover:bg-slate-50 transition-colors"
        >
          <span>Fulfillment</span>
          {openSections.fulfillment ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
        {openSections.fulfillment && (
          <div className="px-3 pb-3">
            <SearchableFacetList
              options={fulfillmentOptions}
              selectedIds={filters.fulfillment}
              onChange={(ids) => onFilterChange({ ...filters, fulfillment: ids })}
              enableSearch={false}
              initialVisibleCount={4}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
