'use client';

import React from 'react';
import { Clock, CheckCircle2, Truck, AlertTriangle, XCircle, RotateCcw } from 'lucide-react';

export type OrderStatusType =
  | 'PENDING'
  | 'QC_PASSED'
  | 'READY_FOR_PICKUP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export interface OrderStatusBadgeProps {
  status: OrderStatusType;
  urgency?: 'NORMAL' | 'URGENT' | 'OVERDUE';
}

export function OrderStatusBadge({
  status,
  urgency = 'NORMAL'
}: OrderStatusBadgeProps) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Pending Verification',
          icon: Clock,
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500'
        };
      case 'QC_PASSED':
        return {
          label: 'QC Verified',
          icon: CheckCircle2,
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-500'
        };
      case 'READY_FOR_PICKUP':
        return {
          label: 'Ready for Pickup',
          icon: Truck,
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          dot: 'bg-purple-500'
        };
      case 'IN_TRANSIT':
        return {
          label: 'In Transit',
          icon: Truck,
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
          dot: 'bg-sky-500'
        };
      case 'DELIVERED':
        return {
          label: 'Delivered & Paid',
          icon: CheckCircle2,
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500'
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          icon: XCircle,
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          dot: 'bg-slate-500'
        };
      case 'RETURNED':
        return {
          label: 'Return Requested',
          icon: RotateCcw,
          bg: 'bg-red-50 text-red-800 border-red-200',
          dot: 'bg-red-500'
        };
      default:
        return {
          label: status,
          icon: Clock,
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          dot: 'bg-slate-500'
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
      </span>

      {urgency === 'URGENT' && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200 animate-pulse">
          <AlertTriangle className="w-2.5 h-2.5" />
          <span>SLA Urgent</span>
        </span>
      )}

      {urgency === 'OVERDUE' && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
          <AlertTriangle className="w-2.5 h-2.5" />
          <span>Overdue</span>
        </span>
      )}
    </div>
  );
}
