'use client';

import React, { useEffect } from 'react';
import { X, Check } from 'lucide-react';

/* ==============================================================================
   1. RESPONSIVE CONTAINER (Section 104)
   Fluid padding: Mobile 16px (px-4), Tablet 24px (px-6), Desktop 32px (px-8), 40px (px-10)
   Max width: 1440px with margin-inline: auto
   ============================================================================== */
export interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function ResponsiveContainer({
  children,
  className = '',
  as: Component = 'div',
  ...props
}: ResponsiveContainerProps) {
  return (
    <Component
      className={`w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-10 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

/* ==============================================================================
   2. RESPONSIVE GRID (Section 111)
   Mobile: 1 or 2 cols, Tablet: 2 or 3 cols, Desktop: 3-4 cols, 2xl: 4-5 cols
   ============================================================================== */
export interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: {
    default?: 1 | 2;
    sm?: 2 | 3;
    md?: 2 | 3 | 4;
    lg?: 3 | 4 | 5;
    xl?: 4 | 5 | 6;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ResponsiveGrid({
  children,
  cols = { default: 2, sm: 2, md: 3, lg: 4, xl: 4 },
  gap = 'md',
  className = '',
  ...props
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-2.5 sm:gap-3',
    md: 'gap-3 sm:gap-4 lg:gap-5',
    lg: 'gap-4 sm:gap-6 lg:gap-8',
  }[gap];

  const defaultCol = cols.default === 1 ? 'grid-cols-1' : 'grid-cols-2';
  const smCol = cols.sm ? (cols.sm === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2') : '';
  const mdCol = cols.md ? (cols.md === 4 ? 'md:grid-cols-4' : cols.md === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2') : '';
  const lgCol = cols.lg ? (cols.lg === 5 ? 'lg:grid-cols-5' : cols.lg === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3') : '';
  const xlCol = cols.xl ? (cols.xl === 6 ? 'xl:grid-cols-6' : cols.xl === 5 ? 'xl:grid-cols-5' : 'xl:grid-cols-4') : '';

  return (
    <div
      className={`grid ${defaultCol} ${smCol} ${mdCol} ${lgCol} ${xlCol} ${gapClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/* ==============================================================================
   3. RESPONSIVE CARD
   Adaptive padding, zero overflow clipping, touch-friendly min targets
   ============================================================================== */
export interface ResponsiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'flat' | 'interactive' | 'highlight';
}

export function ResponsiveCard({
  children,
  className = '',
  variant = 'default',
  ...props
}: ResponsiveCardProps) {
  const variantStyles = {
    default: 'bg-white border border-slate-200/90 shadow-2xs rounded-2xl sm:rounded-3xl',
    flat: 'bg-slate-50 border border-slate-200/80 rounded-2xl sm:rounded-3xl',
    interactive:
      'bg-white border border-slate-200 hover:border-emerald-500/60 hover:shadow-md transition-all duration-200 cursor-pointer rounded-2xl sm:rounded-3xl active:scale-[0.99]',
    highlight:
      'bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-200 shadow-sm rounded-2xl sm:rounded-3xl',
  }[variant];

  return (
    <div
      className={`p-4 sm:p-5 lg:p-6 transition-all ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/* ==============================================================================
   4. RESPONSIVE TABLE WITH ADAPTIVE MOBILE CARDS (Section 114)
   Desktop: Clean data table with controlled horizontal scroll inside container
   Mobile: Adaptive card layout to eliminate horizontal table fatigue
   ============================================================================== */
export interface ResponsiveTableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

export interface ResponsiveTableProps<T> {
  columns: ResponsiveTableColumn<T>[];
  data: T[];
  keyField: keyof T;
  renderMobileCard?: (item: T) => React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
}

export function ResponsiveTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  renderMobileCard,
  emptyState,
  className = '',
}: ResponsiveTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
        {emptyState || 'No records found.'}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile Card Presentation (< 768px) */}
      {renderMobileCard ? (
        <div className="block md:hidden space-y-3">
          {data.map((item) => (
            <div
              key={String(item[keyField])}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs"
            >
              {renderMobileCard(item)}
            </div>
          ))}
        </div>
      ) : null}

      {/* Desktop & Tablet Table (md+) or Fallback if no renderMobileCard provided */}
      <div
        className={`${
          renderMobileCard ? 'hidden md:block' : 'block'
        } overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs`}
      >
        <table className="w-full text-left text-xs sm:text-sm text-slate-700">
          <thead className="bg-slate-50/90 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 sm:px-5 sm:py-3.5 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={String(item[keyField])} className="hover:bg-slate-50/60 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 sm:px-5 sm:py-3.5 ${col.className || ''}`}>
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==============================================================================
   5. MOBILE BOTTOM SHEET / DRAWER (Section 115 & 116)
   Slides up from bottom on mobile, handles safe-area-inset-bottom
   ============================================================================== */
export interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function MobileBottomSheet({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: MobileBottomSheetProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Content Dialog */}
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] z-10 animate-sheet-up overflow-hidden pb-[env(safe-area-inset-bottom,0px)]">
        {/* Drag handle for mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==============================================================================
   6. STICKY MOBILE CTA (Section 106, 107, 141)
   Sticks to bottom of screen on mobile, respects safe-area-inset-bottom
   ============================================================================== */
export interface StickyMobileCTAProps {
  children: React.ReactNode;
  className?: string;
}

export function StickyMobileCTA({ children, className = '' }: StickyMobileCTAProps) {
  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-slate-200/90 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] ${className}`}
    >
      <div className="max-w-md mx-auto w-full flex items-center justify-between gap-3">
        {children}
      </div>
    </div>
  );
}

/* ==============================================================================
   7. STATUS BADGE
   Standardized color-coded status badges for orders, quotes, grades
   ============================================================================== */
export interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand';
  className?: string;
}

export function StatusBadge({ status, variant = 'neutral', className = '' }: StatusBadgeProps) {
  const styles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    brand: 'bg-teal-50 text-teal-800 border-teal-200',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize shrink-0 ${styles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      <span>{status.replace(/_/g, ' ')}</span>
    </span>
  );
}

/* ==============================================================================
   8. STEPPER (Section 106)
   1 Device -> 2 Condition -> 3 Price -> 4 Pickup -> 5 Confirm
   ============================================================================== */
export interface StepperProps {
  steps: { id: string | number; title: string; subtitle?: string }[];
  currentStep: number; // 0-indexed
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export function Stepper({ steps, currentStep, onStepClick, className = '' }: StepperProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Mobile Stepper: compact progress indicator */}
      <div className="sm:hidden flex items-center justify-between mb-2">
        <span className="text-xs font-black text-slate-900">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.title}
        </span>
        <span className="text-[11px] font-bold text-emerald-600">
          {Math.round(((currentStep + 1) / steps.length) * 100)}%
        </span>
      </div>
      <div className="sm:hidden w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-4">
        <div
          className="h-full bg-emerald-600 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Tablet & Desktop Stepper: horizontal connected steps */}
      <div className="hidden sm:flex items-center justify-between relative">
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={step.id}
              onClick={() => isDone && onStepClick?.(idx)}
              className={`flex flex-col items-center z-10 bg-white px-2 ${
                isDone ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isCurrent
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 shadow-sm'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
              </div>
              <span
                className={`text-[11px] font-bold mt-1.5 whitespace-nowrap ${
                  isCurrent ? 'text-slate-950 font-black' : isDone ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
