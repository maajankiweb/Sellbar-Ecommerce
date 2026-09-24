'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { SellOrder, SellOrderState } from '@/types';
import {
  CheckCircle2,
  Clock,
  User,
  Phone,
  ShieldCheck,
  FileText,
  MapPin,
  Calendar,
  AlertCircle,
  Download,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const TIMELINE_STEPS: { state: SellOrderState; title: string; desc: string }[] = [
  {
    state: 'QUOTED',
    title: 'Order Initiated',
    desc: 'Fair market valuation locked in database',
  },
  {
    state: 'PICKUP_SCHEDULED',
    title: 'Pickup Confirmed',
    desc: 'Doorstep pickup slot reserved with regional hub',
  },
  {
    state: 'EXECUTIVE_ASSIGNED',
    title: 'Executive Dispatched',
    desc: 'Technician assigned with certified diagnostic toolkit',
  },
  {
    state: 'INSPECTED',
    title: '5-Min Doorstep Inspection',
    desc: 'Hardware, display and biometric verification done',
  },
  {
    state: 'PAID',
    title: 'Payment Credited',
    desc: 'Instant UPI/Cash transfer completed + Data Wipe certified',
  },
];

export default function SellOrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<SellOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCertModal, setShowCertModal] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/v1/orders/sell/${id}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
        } else {
          setError(data.error || 'Order not found');
        }
      } catch {
        setError('Failed to fetch order tracking status.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-4 text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-base font-bold text-slate-800">Fetching Order Details...</h2>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Order Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">{error || 'Please check your Order ID.'}</p>
        <Link href="/account" className="mt-4 inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold">
          Go to My Orders
        </Link>
      </div>
    );
  }

  const orderStateIndex = TIMELINE_STEPS.findIndex((s) => s.state === order.state);
  const currentStep = orderStateIndex !== -1 ? orderStateIndex : 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Success Card */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-emerald-600/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Doorstep Pickup Booked</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">Order ID: #{order.id}</h1>
            <p className="text-xs text-emerald-100">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>

          <div className="bg-white/15 p-3 rounded-2xl backdrop-blur-md text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-emerald-200 block">Payout Amount</span>
            <span className="text-2xl font-black text-white">₹{order.quotedPrice.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-white/80 block mt-0.5">Mode: {order.payoutMode}</span>
          </div>
        </div>
      </div>

      {/* Device & Slot Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Device */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <img
            src={order.deviceSummary.image}
            alt={order.deviceSummary.model}
            className="w-14 h-14 object-contain rounded-xl bg-slate-50 p-1 border border-slate-100 shrink-0"
          />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">{order.deviceSummary.brand}</span>
            <h3 className="text-xs font-bold text-slate-900">{order.deviceSummary.model}</h3>
            <span className="text-[11px] text-emerald-700 font-semibold">{order.deviceSummary.variant}</span>
          </div>
        </div>

        {/* Slot */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Scheduled Slot</span>
            <h3 className="text-xs font-bold text-slate-900">{order.pickupSlot.date}</h3>
            <span className="text-[11px] text-slate-500">{order.pickupSlot.window}</span>
          </div>
        </div>

        {/* Address */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Pickup Location</span>
            <h3 className="text-xs font-bold text-slate-900 truncate">{order.pickupAddress.flatNo}, {order.pickupAddress.street}</h3>
            <span className="text-[11px] text-slate-500">{order.pickupAddress.city} - {order.pickupAddress.pincode}</span>
          </div>
        </div>
      </div>

      {/* Progress Timeline (PRD FR-S10) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
        <h2 className="text-base font-bold text-slate-900">Doorstep Fulfillment Timeline</h2>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {TIMELINE_STEPS.map((step, idx) => {
            const isDone = idx <= currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={step.state} className="relative group">
                <div
                  className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition ${
                    isDone
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 bg-white text-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xs sm:text-sm font-bold ${isCurrent ? 'text-emerald-700' : isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.title}
                    </h3>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 animate-pulse">
                        Current Status
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Executive & Data Wipe Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Executive */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-base flex items-center justify-center shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Field Executive</span>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {order.executive?.name || 'Rahul Sharma (Field Expert)'}
            </h4>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3" />
              {order.executive?.phone || '+91 98765 00000'}
            </span>
          </div>
        </div>

        {/* Data-Wipe Guarantee Certificate */}
        <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-200 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <ShieldCheck className="w-8 h-8 text-emerald-700 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-emerald-950">Data-Wipe Certificate</h4>
              <p className="text-[11px] text-emerald-700">DoD 5220.22-M military grade compliance</p>
            </div>
          </div>
          <button
            onClick={() => setShowCertModal(true)}
            className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Certificate</span>
          </button>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xl relative">
            <div className="text-center space-y-2 pb-4 border-b border-slate-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-950">SELBAR Certified Data Erasure Guarantee</h3>
              <p className="text-xs text-slate-500">Official Certificate of Destruction & Digital Sanitation</p>
            </div>

            <div className="py-4 space-y-2.5 text-xs text-slate-700 font-mono bg-slate-50 p-4 rounded-2xl my-4 border border-slate-200">
              <div className="flex justify-between"><span>Certificate No:</span><span className="font-bold text-slate-900">CERT-SLB-{order.id}</span></div>
              <div className="flex justify-between"><span>Device Model:</span><span className="font-bold text-slate-900">{order.deviceSummary.model}</span></div>
              <div className="flex justify-between"><span>Variant:</span><span>{order.deviceSummary.variant}</span></div>
              <div className="flex justify-between"><span>Order Ref:</span><span>#{order.id}</span></div>
              <div className="flex justify-between"><span>Erasure Standard:</span><span className="text-emerald-700 font-bold">NIST 800-88 / DoD 5220.22-M</span></div>
              <div className="flex justify-between"><span>Compliance:</span><span>India DPDP Act 2023</span></div>
            </div>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              This document certifies that all personal files, passwords, and biometrics on the device are irreversibly eradicated upon intake prior to refurbishing.
            </p>

            <button
              onClick={() => setShowCertModal(false)}
              className="w-full mt-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* Back to Account Link */}
      <div className="text-center">
        <Link href="/account" className="text-xs font-bold text-emerald-700 hover:underline">
          ← Return to My Account & Orders
        </Link>
      </div>
    </div>
  );
}
