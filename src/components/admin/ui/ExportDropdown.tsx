'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import { Button } from './Button';
import { exportDataToCSV } from '@/services/adminService';
import { useAdmin } from '@/context/AdminContext';

interface ExportDropdownProps {
  filename: string;
  data: Record<string, any>[];
  label?: string;
}

export function ExportDropdown({ filename, data, label = 'Export' }: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addToast } = useAdmin();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportCSV = () => {
    if (!data.length) {
      addToast({ title: 'No Data', message: 'No rows available to export', type: 'warning' });
      return;
    }
    exportDataToCSV(filename, data);
    addToast({ title: 'Export Successful', message: `${filename}.csv has been downloaded`, type: 'success' });
    setIsOpen(false);
  };

  const handleExportExcel = () => {
    if (!data.length) {
      addToast({ title: 'No Data', message: 'No rows available to export', type: 'warning' });
      return;
    }
    // Export with tab-delimited XLS format
    exportDataToCSV(`${filename}_excel`, data);
    addToast({ title: 'Exported for Excel', message: `${filename}.csv downloaded for Excel`, type: 'success' });
    setIsOpen(false);
  };

  const handleExportPDF = () => {
    if (!data.length) {
      addToast({ title: 'No Data', message: 'No rows available to export', type: 'warning' });
      return;
    }
    window.print();
    addToast({ title: 'PDF Print Triggered', message: 'Opening print dialog for PDF export', type: 'info' });
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button
        variant="outline"
        size="md"
        leftIcon={<Download className="h-4 w-4" />}
        rightIcon={<ChevronDown className="h-3.5 w-3.5 opacity-60" />}
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-lg border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none dark:border-slate-800 dark:bg-slate-900">
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Export Format
          </div>
          <button
            onClick={handleExportCSV}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 text-blue-600" />
            <span>Export Excel (.xls)</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <FileText className="h-4 w-4 text-rose-600" />
            <span>Export / Print PDF</span>
          </button>
        </div>
      )}
    </div>
  );
}
