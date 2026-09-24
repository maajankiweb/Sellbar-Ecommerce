'use client';

import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; dotColor: string; border: string }> = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-400',
      dotColor: 'bg-emerald-500',
      border: 'border-emerald-200 dark:border-emerald-800/60',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-400',
      dotColor: 'bg-amber-500',
      border: 'border-amber-200 dark:border-amber-800/60',
    },
    danger: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-400',
      dotColor: 'bg-rose-500',
      border: 'border-rose-200 dark:border-rose-800/60',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-700 dark:text-blue-400',
      dotColor: 'bg-blue-500',
      border: 'border-blue-200 dark:border-blue-800/60',
    },
    neutral: {
      bg: 'bg-slate-100 dark:bg-slate-800/60',
      text: 'text-slate-700 dark:text-slate-300',
      dotColor: 'bg-slate-400',
      border: 'border-slate-200 dark:border-slate-700',
    },
    purple: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      text: 'text-indigo-700 dark:text-indigo-400',
      dotColor: 'bg-indigo-500',
      border: 'border-indigo-200 dark:border-indigo-800/60',
    },
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  const current = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-colors ${current.bg} ${current.text} ${current.border} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${current.dotColor} animate-pulse`} />}
      {children}
    </span>
  );
}
