'use client';

import React, { useState } from 'react';
import { RotateCcw, X, Calendar, Clock, AlertCircle, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { BuyOrder, ReturnRequest } from '@/types';

interface ReturnRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: BuyOrder;
  onSuccess: (returnReq: ReturnRequest) => void;
}

export default function ReturnRequestModal({
  isOpen,
  onClose,
  order,
  onSuccess,
}: ReturnRequestModalProps) {
  const [returnType, setReturnType] = useState<'REPLACEMENT' | 'REFUND'>('REPLACEMENT');
  const [reason, setReason] = useState('Hardware / Touch Screen Issue');
  const [notes, setNotes] = useState('');
  const [pickupDate, setPickupDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [pickupWindow, setPickupWindow] = useState('Morning (10 AM - 1 PM)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const REASONS = [
    'Hardware / Touch Screen Issue',
    'Battery Draining Fast / Charging Problem',
    'Camera / Speaker Malfunction',
    'Cosmetic Grade Not as Expected',
    'Received Wrong Color or Storage Variant',
    'Performance Lag / Software Crashing',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/v1/orders/buy/${order.id}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: returnType,
          reason,
          notes,
          pickupSlot: {
            date: pickupDate,
            window: pickupWindow,
          },
          pickupAddress: order.shippingAddress,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Failed to submit return request');
        setIsSubmitting(false);
        return;
      }

      onSuccess(data.returnRequest);
    } catch {
      setError('Network connection error. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">5-Day Return & Replacement Request</h3>
              <p className="text-[11px] text-slate-300">Doorstep Reverse Pickup for Order #{order.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Policy Notice */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block">5-Day Hassle-Free Policy</strong>
              <span>
                You are covered under our 5-day return policy. Our certified technician will verify device IMEI and condition during doorstep pickup in West Champaran.
              </span>
            </div>
          </div>

          {/* Return Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Resolution Required</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setReturnType('REPLACEMENT')}
                className={`p-3 rounded-xl border text-xs font-bold transition text-left ${
                  returnType === 'REPLACEMENT'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div>🔄 Free Replacement</div>
                <span className="text-[10px] font-normal text-slate-500 block mt-0.5">
                  Swap for another tested unit
                </span>
              </button>

              <button
                type="button"
                onClick={() => setReturnType('REFUND')}
                className={`p-3 rounded-xl border text-xs font-bold transition text-left ${
                  returnType === 'REFUND'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div>💰 Return & Refund</div>
                <span className="text-[10px] font-normal text-slate-500 block mt-0.5">
                  100% money back to original source
                </span>
              </button>
            </div>
          </div>

          {/* Reason Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Reason for Return</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Describe the Issue (Optional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Battery drops from 50% to 10% within 1 hour..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Reverse Pickup Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pickup Date</span>
              </label>
              <input
                type="date"
                required
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pickup Time Window</span>
              </label>
              <select
                value={pickupWindow}
                onChange={(e) => setPickupWindow(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold text-slate-800 bg-white focus:outline-none"
              >
                <option value="Morning (10 AM - 1 PM)">Morning (10 AM - 1 PM)</option>
                <option value="Afternoon (2 PM - 6 PM)">Afternoon (2 PM - 6 PM)</option>
              </select>
            </div>
          </div>

          {/* Pickup Address Confirmation */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Doorstep Pickup Location</span>
            </span>
            <p className="text-slate-600 text-[11px]">
              {order.shippingAddress.flatNo}, {order.shippingAddress.street}, {order.shippingAddress.city}, Bihar - {order.shippingAddress.pincode}
            </p>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Scheduling Reverse Pickup...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Return & Schedule Pickup</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
