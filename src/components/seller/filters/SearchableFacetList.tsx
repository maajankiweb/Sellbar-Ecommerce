'use client';

import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';

export interface FacetOption {
  id: string;
  label: string;
  count: number;
}

export interface SearchableFacetListProps {
  options: FacetOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  searchPlaceholder?: string;
  enableSearch?: boolean;
  initialVisibleCount?: number;
}

export function SearchableFacetList({
  options,
  selectedIds,
  onChange,
  searchPlaceholder = 'Search options...',
  enableSearch = true,
  initialVisibleCount = 6
}: SearchableFacetListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, searchQuery]);

  const visibleOptions = useMemo(() => {
    if (isExpanded || searchQuery.trim().length > 0) {
      return filteredOptions;
    }
    return filteredOptions.slice(0, initialVisibleCount);
  }, [filteredOptions, isExpanded, searchQuery, initialVisibleCount]);

  const toggleOption = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-2">
      {/* Search Input when enabled and options > 5 */}
      {enableSearch && options.length > 5 && (
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-8 pr-7 py-1 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-blue-600 focus:bg-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-xs"
              aria-label="Clear search"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Options List */}
      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
        {visibleOptions.length === 0 ? (
          <p className="text-xs text-slate-400 py-1 italic">No matching options</p>
        ) : (
          visibleOptions.map((opt) => {
            const isChecked = selectedIds.includes(opt.id);
            return (
              <label
                key={opt.id}
                className="flex items-center justify-between text-xs py-1 px-1 rounded-md hover:bg-slate-50 cursor-pointer group transition-colors select-none"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleOption(opt.id)}
                    className="w-3.5 h-3.5 rounded-xs border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <span
                    className={`truncate transition-colors ${
                      isChecked ? 'font-semibold text-blue-700' : 'text-slate-700 group-hover:text-slate-900'
                    }`}
                  >
                    {opt.label}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-400 tabular-nums shrink-0">
                  ({opt.count})
                </span>
              </label>
            );
          })
        )}
      </div>

      {/* Expand / Collapse Button */}
      {!searchQuery && filteredOptions.length > initialVisibleCount && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 pt-1 block"
        >
          {isExpanded
            ? 'Show less'
            : `+ ${filteredOptions.length - initialVisibleCount} more`}
        </button>
      )}
    </div>
  );
}
