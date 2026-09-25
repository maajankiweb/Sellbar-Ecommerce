'use client';

import React from 'react';

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
interface StatusBadgeProps {
  status: string;
  variant?: 'order' | 'ticket' | 'payment' | 'return';
}

const orderStatusConfig: Record<string, { label: string; cls: string }> = {
  PLACED: { label: 'Order Placed', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  PAYMENT_CONFIRMED: { label: 'Payment Confirmed', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  PROCESSING: { label: 'Processing', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  PACKED: { label: 'Packed', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  SHIPPED: { label: 'Shipped', cls: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  DELIVERED: { label: 'Delivered', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  CANCELLED: { label: 'Cancelled', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
  RETURN_REQUESTED: { label: 'Return Requested', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  RETURN_APPROVED: { label: 'Return Approved', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  REFUND_PROCESSING: { label: 'Refund Processing', cls: 'bg-purple-100 text-purple-700 border-purple-200' },
  REFUNDED: { label: 'Refunded', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  RETURN_REJECTED: { label: 'Return Rejected', cls: 'bg-rose-100 text-rose-700 border-rose-200' },
  OPEN: { label: 'Open', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  WAITING_FOR_REPLY: { label: 'Waiting for Reply', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  IN_PROGRESS: { label: 'In Progress', cls: 'bg-purple-100 text-purple-700 border-purple-200' },
  RESOLVED: { label: 'Resolved', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  CLOSED: { label: 'Closed', cls: 'bg-slate-100 text-slate-500 border-slate-200' },
  SUCCESSFUL: { label: 'Successful', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  PENDING: { label: 'Pending', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  FAILED: { label: 'Failed', cls: 'bg-rose-100 text-rose-700 border-rose-200' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = orderStatusConfig[status] || { label: status, cls: 'bg-slate-100 text-slate-600 border-slate-200' };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.cls}`}>
      {config.label}
    </span>
  );
}

// ─── RATING STARS ─────────────────────────────────────────────────────────────
interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function RatingStars({ rating, max = 5, size = 'sm', interactive = false, onChange }: RatingStarsProps) {
  const [hovered, setHovered] = React.useState(0);
  const sizes = { sm: 'h-3.5 w-3.5', md: 'h-5 w-5', lg: 'h-7 w-7' };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const val = i + 1;
        const filled = interactive ? val <= (hovered || rating) : val <= rating;
        return (
          <svg
            key={i}
            className={`${sizes[size]} ${filled ? 'text-amber-400' : 'text-slate-200'} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            fill={filled ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            onMouseEnter={() => interactive && setHovered(val)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onChange?.(val)}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        );
      })}
    </div>
  );
}

// ─── SKELETON ─────────────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-lg ${className || ''}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded" />
        <div className="h-3 bg-slate-200 rounded w-5/6" />
      </div>
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta?: { label: string; href: string };
}

export function EmptyState({ icon, title, description, cta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
        {icon}
      </div>
      <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-6">{description}</p>
      {cta && (
        <a
          href={cta.href}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm shadow-blue-600/20"
        >
          {cta.label}
        </a>
      )}
    </div>
  );
}

// ─── CONFIRMATION MODAL ────────────────────────────────────────────────────────
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ isOpen, title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'danger', onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;
  const btnCls = variant === 'danger' ? 'bg-rose-600 hover:bg-rose-700 text-white' : variant === 'warning' ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full z-10 animate-in fade-in zoom-in-95 duration-150">
        <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">{description}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${btnCls}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  const clsMap = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    info: 'bg-blue-600 text-white',
    warning: 'bg-amber-500 text-white',
  };
  return (
    <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 lg:bottom-6 lg:left-auto lg:right-6 lg:translate-x-0 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold max-w-xs animate-in slide-in-from-bottom duration-200 ${clsMap[type]}`}>
      {message}
      {onClose && (
        <button onClick={onClose} className="shrink-0 opacity-80 hover:opacity-100">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── PAGE HEADER ──────────────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">{title}</h1>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ─── TOGGLE SWITCH ────────────────────────────────────────────────────────────
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

export function ToggleSwitch({ checked, onChange, disabled }: ToggleSwitchProps) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-blue-600' : 'bg-slate-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// ─── ORDER TIMELINE ────────────────────────────────────────────────────────────
interface TimelineStep {
  label: string;
  isCompleted: boolean;
  isCurrent: boolean;
  date?: string;
  time?: string;
}

interface OrderTimelineProps {
  steps: TimelineStep[];
}

export function OrderTimeline({ steps }: OrderTimelineProps) {
  return (
    <div className="relative">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4 pb-6 last:pb-0">
          {/* Line + dot */}
          <div className="flex flex-col items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
              step.isCompleted
                ? 'bg-emerald-500 border-emerald-500'
                : step.isCurrent
                ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-600/30 ring-4 ring-blue-600/10'
                : 'bg-white border-slate-200'
            }`}>
              {step.isCompleted ? (
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : step.isCurrent ? (
                <span className="h-3 w-3 rounded-full bg-white" />
              ) : (
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              )}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-0.5 flex-1 mt-1 ${step.isCompleted ? 'bg-emerald-400' : 'bg-slate-200'}`} />
            )}
          </div>

          {/* Content */}
          <div className="pb-2 min-w-0">
            <p className={`text-sm font-semibold ${step.isCurrent ? 'text-blue-700' : step.isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
              {step.label}
            </p>
            {(step.date || step.time) && (
              <p className="text-xs text-slate-400 mt-0.5">
                {step.date}{step.date && step.time ? ' · ' : ''}{step.time}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SECTION CARD ─────────────────────────────────────────────────────────────
interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ children, className }: SectionCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden ${className || ''}`}>
      {children}
    </div>
  );
}

export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
      <h2 className="font-bold text-sm text-slate-900">{title}</h2>
      {action}
    </div>
  );
}
