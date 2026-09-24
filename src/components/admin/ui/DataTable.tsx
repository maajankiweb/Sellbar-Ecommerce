'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Search,
  SlidersHorizontal,
  Check,
  Trash2
} from 'lucide-react';
import { Button } from './Button';
import { ExportDropdown } from './ExportDropdown';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  searchPlaceholder?: string;
  searchField?: keyof T | ((item: T) => string);
  filterOptions?: {
    label: string;
    options: { label: string; value: string }[];
    onFilterChange: (val: string) => void;
    currentValue: string;
  }[];
  exportFilename?: string;
  isLoading?: boolean;
  onBulkDelete?: (selectedIds: string[]) => void;
  bulkActions?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  onEmptyAction?: () => void;
  emptyActionText?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  searchPlaceholder = 'Search items...',
  searchField,
  filterOptions,
  exportFilename = 'export_data',
  isLoading = false,
  onBulkDelete,
  bulkActions,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search criteria or filters.',
  onEmptyAction,
  emptyActionText,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter & Search logic
  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(item => {
        if (typeof searchField === 'function') {
          return searchField(item).toLowerCase().includes(q);
        }
        if (searchField) {
          return String(item[searchField] || '').toLowerCase().includes(q);
        }
        // Default search across all string/number fields
        return Object.values(item).some(val =>
          String(val || '').toLowerCase().includes(q)
        );
      });
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, sortConfig, searchField]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Bulk selection logic
  const allCurrentSelected =
    paginatedData.length > 0 &&
    paginatedData.every(item => selectedIds.includes(String(item[keyField])));

  const toggleSelectAll = () => {
    if (allCurrentSelected) {
      const currentIds = paginatedData.map(item => String(item[keyField]));
      setSelectedIds(prev => prev.filter(id => !currentIds.includes(id)));
    } else {
      const currentIds = paginatedData.map(item => String(item[keyField]));
      setSelectedIds(prev => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return prev.direction === 'asc'
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/90 overflow-hidden">
      {/* Top Action Toolbar */}
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search input */}
          <div className="relative min-w-[220px] max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-slate-300 bg-white py-1.5 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Optional Filter Selects */}
          {filterOptions?.map((f, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <select
                value={f.currentValue}
                onChange={e => {
                  f.onFilterChange(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {f.options.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {exportFilename && (
            <ExportDropdown filename={exportFilename} data={filteredData} />
          )}
        </div>
      </div>

      {/* Bulk selection action banner if items selected */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-blue-50/80 px-4 py-2 text-xs font-medium text-blue-900 border-b border-blue-100 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-900/50">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              {selectedIds.length}
            </span>
            <span>items selected across table</span>
          </div>
          <div className="flex items-center gap-2">
            {bulkActions}
            {onBulkDelete && (
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                onClick={() => {
                  onBulkDelete(selectedIds);
                  setSelectedIds([]);
                }}
              >
                Delete Selected
              </Button>
            )}
            <button
              onClick={() => setSelectedIds([])}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 underline text-xs cursor-pointer ml-2"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200/80 sticky top-0 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-800">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allCurrentSelected}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700"
                />
              </th>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-semibold ${col.className || ''}`}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="group flex items-center gap-1.5 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                    >
                      <span>{col.header}</span>
                      <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-8">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    actionText={emptyActionText}
                    onAction={onEmptyAction}
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map(item => {
                const id = String(item[keyField]);
                const isSelected = selectedIds.includes(id);

                return (
                  <tr
                    key={id}
                    className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${
                      isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <td className="w-10 px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectItem(id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700"
                      />
                    </td>
                    {columns.map(col => (
                      <td
                        key={col.key}
                        className={`px-4 py-3.5 align-middle ${col.className || ''}`}
                      >
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/80 px-4 py-3 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {[10, 25, 50, 100].map(s => (
              <option key={s} value={s}>
                {s} per page
              </option>
            ))}
          </select>
          <span>
            Showing{' '}
            <strong className="text-slate-800 dark:text-slate-200">
              {filteredData.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}
            </strong>{' '}
            to{' '}
            <strong className="text-slate-800 dark:text-slate-200">
              {Math.min(currentPage * pageSize, filteredData.length)}
            </strong>{' '}
            of{' '}
            <strong className="text-slate-800 dark:text-slate-200">
              {filteredData.length}
            </strong>{' '}
            records
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="h-7 w-7"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-7 w-7"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="px-2 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-7 w-7"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="h-7 w-7"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
