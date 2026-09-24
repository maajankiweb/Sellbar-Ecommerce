'use client';

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  ChevronRight,
  MapPin,
  Calendar,
  CheckCircle2,
  PackageCheck,
  Truck,
  ArrowUpRight
} from 'lucide-react';
import { OrderStatusBadge, OrderStatusType } from './OrderStatusBadge';

export interface OrderItemData {
  title: string;
  variant: string;
  grade: 'Grade A (Flawless)' | 'Grade B (Good)' | 'Grade C (Fair)';
  sku: string;
  imei?: string;
  price: number;
  imageUrl?: string;
}

export interface SellerOrderData {
  id: string;
  placedAt: string;
  paymentMode: 'PREPAID - UPI' | 'COD' | 'NET_BANKING';
  totalAmount: number;
  status: OrderStatusType;
  urgency?: 'NORMAL' | 'URGENT' | 'OVERDUE';
  slaDeadline?: string;
  customerCity: string;
  customerPincode: string;
  items: OrderItemData[];
}

export interface OrderCardProps {
  order: SellerOrderData;
  onUpdateStatus?: (orderId: string, nextStatus: OrderStatusType) => void;
  onPrintLabel?: (orderId: string) => void;
  onDownloadInvoice?: (orderId: string) => void;
}

const STEPPER_STAGES: { key: OrderStatusType; label: string }[] = [
  { key: 'PENDING', label: 'Received' },
  { key: 'QC_PASSED', label: 'QC Passed' },
  { key: 'READY_FOR_PICKUP', label: 'Pickup Ready' },
  { key: 'IN_TRANSIT', label: 'In Transit' },
  { key: 'DELIVERED', label: 'Delivered' }
];

export function OrderCard({
  order,
  onUpdateStatus,
  onPrintLabel,
  onDownloadInvoice
}: OrderCardProps) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatusType>(order.status);

  // Compute active milestone index
  const stageKeys = STEPPER_STAGES.map((s) => s.key);
  const activeStageIndex = stageKeys.indexOf(currentStatus);

  const handleNextStage = () => {
    if (activeStageIndex < stageKeys.length - 1) {
      const next = stageKeys[activeStageIndex + 1];
      setCurrentStatus(next);
      if (onUpdateStatus) onUpdateStatus(order.id, next);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden transition-all hover:border-slate-300">
      {/* Card Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200">
              {order.id}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{order.placedAt}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {order.customerCity} ({order.customerPincode})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-2 py-0.5 text-[11px] font-bold rounded-md border ${
              order.paymentMode === 'PREPAID - UPI'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {order.paymentMode}
          </span>

          <div className="text-sm font-black text-slate-900 tracking-tight">
            ₹{order.totalAmount.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Card Body: Items & Status */}
      <div className="p-4 space-y-4">
        {/* Status Badge & SLA Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <OrderStatusBadge status={currentStatus} urgency={order.urgency} />

          {order.slaDeadline && (
            <span className="text-xs text-slate-500">
              Pickup SLA: <strong className="text-slate-800 font-semibold">{order.slaDeadline}</strong>
            </span>
          )}
        </div>

        {/* Product Items List */}
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3.5">
              {/* Product Thumbnail */}
              <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400 font-bold text-xs">
                📱
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {item.title}
                </h4>
                <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">{item.variant}</span>
                  <span>•</span>
                  <span className="px-1.5 py-0.2 rounded-xs bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    {item.grade}
                  </span>
                  {item.imei && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-slate-500">IMEI: {item.imei}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-slate-900">
                  ₹{item.price.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400">Qty: 1</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stepper Progress Bar (Amazon/Flipkart Fusion) */}
        {currentStatus !== 'CANCELLED' && currentStatus !== 'RETURNED' && (
          <div className="pt-2">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between text-[11px] text-slate-600 mb-2 font-medium">
                <span>Fulfillment Lifecycle</span>
                <span className="text-blue-600 font-semibold">
                  Stage {activeStageIndex + 1} of {STEPPER_STAGES.length}
                </span>
              </div>

              {/* Stepper Line */}
              <div className="flex items-center justify-between relative">
                {STEPPER_STAGES.map((st, i) => {
                  const isCompleted = activeStageIndex >= i;
                  const isCurrent = activeStageIndex === i;

                  return (
                    <div key={st.key} className="flex-1 flex flex-col items-center relative z-10">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                          isCompleted
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                        } ${isCurrent ? 'ring-2 ring-blue-300' : ''}`}
                      >
                        {isCompleted ? '✓' : i + 1}
                      </div>
                      <span
                        className={`text-[10px] mt-1 text-center font-medium ${
                          isCompleted ? 'text-blue-900 font-bold' : 'text-slate-400'
                        }`}
                      >
                        {st.label}
                      </span>
                    </div>
                  );
                })}

                {/* Connecting track line */}
                <div className="absolute top-2.5 left-4 right-4 h-0.5 bg-slate-200 -z-0" />
                <div
                  className="absolute top-2.5 left-4 h-0.5 bg-blue-600 -z-0 transition-all duration-300"
                  style={{
                    width: `${Math.max(0, (activeStageIndex / (STEPPER_STAGES.length - 1)) * 90)}%`
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPrintLabel && onPrintLabel(order.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Shipping Label</span>
          </button>

          <button
            type="button"
            onClick={() => onDownloadInvoice && onDownloadInvoice(order.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Tax Invoice</span>
          </button>
        </div>

        {activeStageIndex < stageKeys.length - 1 && currentStatus !== 'CANCELLED' && (
          <button
            type="button"
            onClick={handleNextStage}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors cursor-pointer"
          >
            <span>Advance to {STEPPER_STAGES[activeStageIndex + 1]?.label}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
