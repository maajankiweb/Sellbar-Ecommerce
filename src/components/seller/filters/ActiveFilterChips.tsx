'use client';

import React from 'react';
import { X } from 'lucide-react';

export interface ActiveFilterItem {
  id: string;
  categoryKey: string;
  label: string;
}

export interface ActiveFilterChipsProps {
  filters: ActiveFilterItem[];
  onRemove: (id: string, categoryKey: string) => void;
  onClearAll: () => void;
}

export function ActiveFilterChips({
  filters,
  onRemove,
  onClearAll
}: ActiveFilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-2">
      <span className="text-xs font-semibold text-slate-500 mr-1">Active:</span>
      {filters.map((filter) => (
        <span
          key={`${filter.categoryKey}-${filter.id}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-full transition-colors hover:bg-blue-100"
        >
          <span>{filter.label}</span>
          <button
            type="button"
            onClick={() => onRemove(filter.id, filter.categoryKey)}
            className="p-0.5 text-blue-500 hover:text-blue-800 rounded-full focus:outline-none"
            aria-label={`Remove filter ${filter.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline ml-1 cursor-pointer"
      >
        Clear all
      </button>
    </div>
  );
}
