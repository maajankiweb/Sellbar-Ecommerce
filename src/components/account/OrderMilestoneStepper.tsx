'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  UserCheck,
  Phone,
  ShieldCheck,
  Zap,
  Download,
  FileCheck,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export interface OrderMilestoneProps {
  orderId: string;
  orderType: 'sell' | 'buy';
  currentStage: 'booked' | 'assigned' | 'inspected' | 'completed';
  deviceTitle: string;
  amount: number;
  scheduledDate?: string;
  scheduledTime?: string;
  technicianName?: string;
  technicianPhone?: string;
  utrNumber?: string;
  upiId?: string;
}

export default function OrderMilestoneStepper({
  orderId,
  orderType = 'sell',
  currentStage = 'assigned',
  deviceTitle,
  amount,
  scheduledDate = 'Tomorrow',
  scheduledTime = '11:00 AM - 01:00 PM',
  technicianName = 'Vikram Sharma',
  technicianPhone = '+91 98765 43210',
  utrNumber = 'UTR983204918234',
  upiId = 'customer@okhdfcbank',
}: OrderMilestoneProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [receiptDownloaded, setReceiptDownloaded] = useState(false);

  const stageRank = {
    booked: 1,
    assigned: 2,
    inspected: 3,
    completed: 4,
  };

  const currentRank = stageRank[currentStage] || 2;

  const steps = [
    {
      step: 1,
      id: 'booked',
      title: orderType === 'sell' ? 'Slot Booked' : 'Order Placed',
      description: `${scheduledDate} • ${scheduledTime}`,
      badge: 'OTP Protected',
    },
    {
      step: 2,
      id: 'assigned',
      title: orderType === 'sell' ? 'Technician Assigned' : 'Out for Delivery',
      description: technicianName,
      badge: 'Live GPS Tracking',
    },
    {
      step: 3,
      id: 'inspected',
      title: orderType === 'sell' ? 'Diagnostic Inspection' : 'Delivery Verification',
      description: '32-Point Diagnostics',
      badge: 'Verified',
    },
    {
      step: 4,
      id: 'completed',
      title: orderType === 'sell' ? 'Instant UPI Payout' : 'Delivered & Protected',
      description: `₹${amount.toLocaleString('en-IN')}`,
      badge: 'Instant Transfer',
    },
  ];

  const handleDownloadReceipt = () => {
    setReceiptDownloaded(true);
    const content = `SELBAR INSTANT PAYOUT RECEIPT\n-----------------------------------\nOrder ID: ${orderId}\nDevice: ${deviceTitle}\nAmount Paid: INR ${amount}\nUTR Number: ${utrNumber}\nPaid To: ${upiId}\nStatus: SUCCESS / NEFT-IMPS\nDate: ${new Date().toLocaleDateString('en-IN')}\nSELBAR Technologies Pvt Ltd\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SELBAR_Payout_Receipt_${orderId}.txt`;
    link.click();
    setTimeout(() => setReceiptDownloaded(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition hover:shadow-md">
      {/* Header bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {orderType === 'sell' ? 'Express Buyback Order' : 'Refurbished Device Order'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                #{orderId}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">{deviceTitle}</h4>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase text-slate-400 block font-bold">
              {orderType === 'sell' ? 'Agreed Payout' : 'Order Total'}
            </span>
            <span className="text-base font-black text-emerald-400">
              ₹{amount.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition"
            title={isExpanded ? 'Collapse timeline' : 'Expand timeline'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Stepper Timeline Body */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* 4-Stage Horizontal Stepper */}
          <div className="relative">
            {/* Background connecting line */}
            <div className="hidden sm:block absolute top-1/2 -translate-y-1/2 left-6 right-6 h-1 bg-slate-100 rounded-full z-0">
              <div
                className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                style={{
                  width: `${((currentRank - 1) / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
              {steps.map((s) => {
                const isPassed = s.step <= currentRank;
                const isCurrent = s.step === currentRank;

                return (
                  <div
                    key={s.step}
                    className={`flex items-start sm:flex-col sm:items-center text-left sm:text-center gap-3 sm:gap-2 p-3 sm:p-0 rounded-2xl ${
                      isCurrent ? 'bg-emerald-50/60 sm:bg-transparent border border-emerald-200 sm:border-0' : ''
                    }`}
                  >
                    {/* Circle Node */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition shadow-sm border-2 ${
                        isPassed
                          ? 'bg-emerald-600 border-emerald-600 text-white ring-4 ring-emerald-50'
                          : 'bg-white border-slate-300 text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : s.step}
                    </div>

                    {/* Step Info */}
                    <div className="space-y-0.5">
                      <div className="flex items-center sm:justify-center gap-1.5">
                        <span className="text-xs font-black text-slate-900">{s.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{s.description}</p>
                      {isCurrent && (
                        <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mt-1">
                          ● Current Stage
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Context Drawer for Current Stage */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
            {currentRank === 2 && (
              /* Stage 2: Technician Details */
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
                      {technicianName.charAt(0)}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center" title="Verified Technician">
                      <ShieldCheck className="w-2.5 h-2.5 text-white" />
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{technicianName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        SELBAR Field Engineer
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>Arriving in West Champaran • On Motorcycle</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${technicianPhone}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Engineer</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => alert(`Technician ${technicianName} is en route. Contact number: ${technicianPhone}`)}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
                  >
                    Live Status
                  </button>
                </div>
              </div>
            )}

            {currentRank >= 3 && (
              /* Stage 3 or 4: UPI Settlement or UTR Receipt */
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>Instant UPI Settlement Record</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Settled to <span className="font-mono font-bold text-slate-800">{upiId}</span> • Reference UTR: <span className="font-mono font-bold text-slate-800">{utrNumber}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{receiptDownloaded ? '✓ Downloaded' : 'Download UTR Receipt'}</span>
                </button>
              </div>
            )}

            {currentRank === 1 && (
              <div className="flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Slot scheduled for {scheduledDate} between {scheduledTime}. Technician assignment in progress.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
