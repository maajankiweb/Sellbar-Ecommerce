'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

export function ToastContainer() {
  const { toasts, removeToast } = useAdmin();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
          error: <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />,
          warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
          info: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-200 dark:border-emerald-900/60',
          error: 'border-rose-200 dark:border-rose-900/60',
          warning: 'border-amber-200 dark:border-amber-900/60',
          info: 'border-blue-200 dark:border-blue-900/60',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-white p-4 shadow-lg transition-all dark:bg-slate-900 ${borders[toast.type]} animate-slide-up`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
                {toast.title}
              </h5>
              {toast.message && (
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
