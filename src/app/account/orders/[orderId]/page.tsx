'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { StatusBadge, OrderTimeline, SectionCard, SectionHeader, Toast } from '@/components/account/ui';
import { accountService } from '@/lib/account/mockData';
import { Order } from '@/types/account';
import {
  Package, Download, ShoppingCart, RotateCcw, ArrowLeft,
  MapPin, Truck, CreditCard, Phone, MessageSquare,
  Copy, CheckCircle, AlertTriangle, Calendar, UserCheck,
  ShieldCheck, XCircle, CheckCircle2, KeyRound, Clock, AlertCircle
} from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const initialAction = searchParams.get('action');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [copied, setCopied] = useState(false);

  // Modals state
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(initialAction === 'return');
  const [newDate, setNewDate] = useState('2026-10-18');
  const [newWindow, setNewWindow] = useState('Morning (9 AM - 1 PM)');
  const [cancelReason, setCancelReason] = useState('');
  const [returnReason, setReturnReason] = useState('Display discoloration');
  const [returnNotes, setReturnNotes] = useState('');

  useEffect(() => {
    accountService.getOrder(orderId).then(o => {
      setOrder(o || null);
      setLoading(false);
    });
  }, [orderId]);

  const copyTracking = () => {
    if (order?.trackingId) {
      navigator.clipboard.writeText(order.trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAcceptRevisedPrice = () => {
    if (!order) return;
    setOrder({
      ...order,
      sellStatus: 'PAYMENT_PENDING',
      status: 'PROCESSING',
      timeline: [
        ...order.timeline,
        {
          status: 'PAYMENT_CONFIRMED',
          label: `Revised Price Accepted (₹${order.revisedPrice?.toLocaleString('en-IN')}) - Instant Payment Initiated`,
          date: 'Just now',
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          isCompleted: true,
          isCurrent: true,
        },
      ],
    });
    setToast(`Revised price accepted! Instant payout of ₹${order.revisedPrice?.toLocaleString('en-IN')} is processing.`);
  };

  const handleRejectRevisedPrice = () => {
    if (!order) return;
    setOrder({
      ...order,
      sellStatus: 'CANCELLED',
      status: 'CANCELLED',
      timeline: [
        ...order.timeline,
        {
          status: 'CANCELLED',
          label: 'Revised Offer Declined - Order Cancelled with Zero Deductions',
          date: 'Just now',
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          isCompleted: true,
          isCurrent: true,
        },
      ],
    });
    setToast('Offer rejected. The pickup agent will safely hand back your device at zero fee.');
  };

  const handleRescheduleSubmit = () => {
    if (!order) return;
    const count = (order.rescheduleCount || 0) + 1;
    setOrder({
      ...order,
      pickupSlot: {
        date: newDate,
        window: newWindow,
      },
      rescheduleCount: count,
    });
    setShowRescheduleModal(false);
    setToast(`Pickup successfully rescheduled to ${newDate} (${newWindow})`);
  };

  const handleCancelSubmit = () => {
    if (!order) return;
    setOrder({
      ...order,
      sellStatus: 'CANCELLED',
      status: 'CANCELLED',
    });
    setShowCancelModal(false);
    setToast('Pickup cancelled. You can generate a new price quote anytime.');
  };

  const handleReturnSubmit = () => {
    setShowReturnModal(false);
    setToast('Replacement request submitted! Our concierge will contact you within 24 hours to schedule pickup.');
  };

  if (loading) {
    return (
      <AccountLayout>
        <AccountHeader />
        <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-48" />
            <div className="h-64 bg-slate-200 rounded-2xl" />
            <div className="h-48 bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </AccountLayout>
    );
  }

  if (!order) {
    return (
      <AccountLayout>
        <AccountHeader />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-1">Order not found</h3>
            <p className="text-sm text-slate-500 mb-4">This order ID could not be located in your account.</p>
            <Link
              href="/account/orders"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </AccountLayout>
    );
  }

  const isSell = order.orderType === 'SELL' || order.orderId.startsWith('ORD-SELL-');
  const isRevisedPending = order.sellStatus === 'REVISED_PRICE_PENDING';
  const isPickupScheduled = order.sellStatus === 'PICKUP_SCHEDULED' || order.sellStatus === 'EXECUTIVE_ASSIGNED';
  const canReschedule = isSell && isPickupScheduled && (order.rescheduleCount || 0) < 2;
  const isDelivered = order.status === 'DELIVERED';
  const isActiveBuy = !isSell && ['PLACED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(order.status);

  return (
    <AccountLayout>
      <AccountHeader />
      <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-4xl mx-auto w-full">
        {/* Back navigation */}
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 mb-4 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Orders
        </Link>

        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{order.orderId}</h1>
              <StatusBadge status={order.sellStatus || order.status} />
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                {isSell ? 'Sell Order' : 'Buy Order'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Initiated on {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {!isSell && order.invoiceUrl && (
              <Link
                href={order.invoiceUrl}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" />
                Invoice
              </Link>
            )}

            {isSell && order.dataWipeCertificateUrl && (
              <a
                href={order.dataWipeCertificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-semibold hover:bg-emerald-100 transition flex items-center gap-1.5"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Erase Certificate
              </a>
            )}

            <a
              href={`https://wa.me/918000000000?text=${encodeURIComponent(`Hi Sellbar Support, I have a query regarding Order ${order.orderId}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              WhatsApp Help
            </a>
          </div>
        </div>

        {/* ─── REVISED PRICE PENDING ACTION CARD ─── */}
        {isRevisedPending && (
          <div className="mb-6 bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-700 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h2 className="text-base font-bold text-amber-950">Action Required: Revised Device Offer</h2>
                <p className="text-sm text-amber-800 mt-1">
                  During doorstep physical & diagnostic testing, our certified executive noted differences from the initial online answers.
                </p>

                {/* Deductions breakdown */}
                {order.revisedPriceReasons && order.revisedPriceReasons.length > 0 && (
                  <div className="bg-white/80 rounded-xl p-3 border border-amber-200 mt-3 space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Diagnostic Deductions Breakdown</p>
                    <div className="divide-y divide-slate-100 text-xs">
                      <div className="flex justify-between py-1 font-semibold text-slate-700">
                        <span>Original Online Quote</span>
                        <span>₹{order.quotedPrice?.toLocaleString('en-IN')}</span>
                      </div>
                      {order.revisedPriceReasons.map((r, i) => (
                        <div key={i} className="flex justify-between py-1 text-rose-600">
                          <span>- {r.label}</span>
                          <span>-₹{r.deduction.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                      <div className="flex justify-between py-1.5 text-sm font-black text-slate-900 border-t border-slate-200">
                        <span>Revised Final Offer</span>
                        <span className="text-emerald-700">₹{order.revisedPrice?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs text-amber-900 mt-3">
                  You are completely protected by the <strong>Sellbar Zero-Fee Guarantee</strong>. If you decline, the executive will return your device on the spot with zero cancellation fees.
                </p>

                {/* Accept / Reject CTAs */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={handleAcceptRevisedPrice}
                    className="min-h-11 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Accept ₹{order.revisedPrice?.toLocaleString('en-IN')} & Get Paid
                  </button>
                  <button
                    onClick={handleRejectRevisedPrice}
                    className="min-h-11 px-5 py-2.5 rounded-xl bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-sm transition flex items-center gap-2 cursor-pointer"
                  >
                    <XCircle className="h-4 w-4" />
                    Decline & Cancel Free
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── ACTIVE PICKUP HANDOVER BANNER ─── */}
        {isSell && isPickupScheduled && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Pickup Handover Verification Code</p>
                <p className="text-lg font-black text-emerald-950 font-mono tracking-widest">
                  {order.orderId.slice(-4) || '7491'}
                </p>
                <p className="text-xs text-emerald-700">Share this 4-digit code with the executive only after physical inspection is complete.</p>
              </div>
            </div>

            {canReschedule && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowRescheduleModal(true)}
                  className="px-3 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
                >
                  Reschedule Slot
                </button>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Device & Timeline */}
          <div className="lg:col-span-2 space-y-5">
            {/* Device Details Card */}
            <SectionCard>
              <SectionHeader title={isSell ? "Device Scheduled for Selling" : `Purchased Refurbished Device (${order.items.length})`} />
              <div className="p-5">
                {isSell && order.sellDevice ? (
                  <div className="flex gap-4">
                    <div className="h-24 w-24 rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center shrink-0">
                      <img
                        src={order.sellDevice.image}
                        alt={order.sellDevice.model}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-base text-slate-900">{order.sellDevice.brand} {order.sellDevice.model}</h2>
                      <p className="text-xs text-slate-500 mt-0.5">{order.sellDevice.variant}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                          {order.sellDevice.conditionGrade ? `${order.sellDevice.conditionGrade} Grade` : 'Refurb Quality'}
                        </span>
                        <span className="text-xs text-slate-400">Doorstep Evaluation</span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500">Valuation:</span>
                        <span className="text-lg font-black text-slate-900">
                          ₹{(order.revisedPrice || order.quotedPrice || order.total).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {order.items.map(item => (
                      <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex gap-4">
                        <div className="h-20 w-20 rounded-xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{item.variant}</p>
                          <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                          
                          <div className="flex items-center gap-3 mt-2">
                            <span className="font-black text-base text-slate-900">₹{item.total.toLocaleString('en-IN')}</span>
                            {item.discount > 0 && (
                              <span className="text-xs line-through text-slate-400">
                                ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          {isDelivered && item.canReturn && (
                            <div className="mt-3">
                              <button
                                onClick={() => setShowReturnModal(true)}
                                className="px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-xs font-bold hover:bg-amber-100 transition flex items-center gap-1.5 cursor-pointer"
                              >
                                <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
                                Request 15-Day Free Replacement
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Timeline Card */}
            <SectionCard>
              <SectionHeader title={isSell ? "Sell Order Lifecycle" : "Delivery Shipment Tracking"} />
              <div className="p-5">
                <OrderTimeline steps={order.timeline} />
              </div>
            </SectionCard>
          </div>

          {/* Right Column: Financial Breakdown & Address */}
          <div className="space-y-5">
            {/* Price Breakdown */}
            <SectionCard>
              <SectionHeader title={isSell ? "Payout Summary" : "Payment Breakdown"} />
              <div className="p-5 space-y-2.5 text-sm">
                {isSell ? (
                  <>
                    <div className="flex justify-between text-slate-600">
                      <span>Online Base Quoted Price</span>
                      <span className="font-semibold text-slate-900">₹{order.quotedPrice?.toLocaleString('en-IN')}</span>
                    </div>
                    {order.revisedPrice && (
                      <div className="flex justify-between text-rose-600">
                        <span>Condition Deductions</span>
                        <span>-₹{((order.quotedPrice || 0) - order.revisedPrice).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>Doorstep Pickup Fee</span>
                      <span className="font-bold text-emerald-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Data Erasure Certificate</span>
                      <span className="font-bold text-emerald-600">FREE</span>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                      <span className="font-bold text-slate-900">Final Payout</span>
                      <span className="text-xl font-black text-emerald-600">
                        ₹{(order.actualPaidPrice || order.revisedPrice || order.quotedPrice || order.total).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <p className="font-semibold text-slate-700">Payout Destination:</p>
                      <p className="mt-0.5">{order.payoutDetails?.upiId || 'Instant Bank/UPI Transfer'}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Promotional Discount</span>
                        <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>Standard Shipping</span>
                      <span className="font-bold text-emerald-600">FREE</span>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                      <span className="font-bold text-slate-900">Total Paid</span>
                      <span className="text-xl font-black text-slate-900">₹{order.total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                      {order.paymentMethod}
                    </div>
                  </>
                )}
              </div>
            </SectionCard>

            {/* Address & Executive Details */}
            <SectionCard>
              <SectionHeader title={isSell ? "Pickup Location & Schedule" : "Delivery Address & Courier"} />
              <div className="p-5 space-y-4 text-xs text-slate-600">
                <div>
                  <p className="font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {isSell ? 'Pickup Address' : 'Shipping Address'}
                  </p>
                  <p className="font-semibold text-slate-900 text-sm">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                  <p className="mt-1 text-slate-500 font-medium">Contact: {order.shippingAddress.phone}</p>
                </div>

                {isSell && order.pickupSlot && (
                  <div className="pt-3 border-t border-slate-100">
                    <p className="font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                      Scheduled Slot
                    </p>
                    <p className="text-slate-900 font-medium">{order.pickupSlot.date} · {order.pickupSlot.window}</p>
                    {order.executive && (
                      <p className="mt-1 text-slate-600">
                        Assigned Agent: <span className="font-semibold text-slate-900">{order.executive.name}</span> ({order.executive.maskedPhone || order.executive.phone})
                      </p>
                    )}
                  </div>
                )}

                {!isSell && order.trackingId && (
                  <div className="pt-3 border-t border-slate-100">
                    <p className="font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5 text-indigo-600" />
                      Tracking Info
                    </p>
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl mt-1">
                      <div>
                        <p className="text-[11px] text-slate-500">{order.courierPartner}</p>
                        <p className="font-mono font-bold text-slate-900 text-xs">{order.trackingId}</p>
                      </div>
                      <button
                        onClick={copyTracking}
                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition"
                      >
                        {copied ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      {/* ─── RESCHEDULE MODAL ─── */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Reschedule Doorstep Pickup</h3>
            <p className="text-xs text-slate-500 mt-1">
              Select a new date and time window. Free rescheduling is allowed up to 2 times. (Used: {order.rescheduleCount || 0}/2)
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Select Date</label>
                <select
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="2026-10-18">18 Oct 2026 (Sunday)</option>
                  <option value="2026-10-19">19 Oct 2026 (Monday)</option>
                  <option value="2026-10-20">20 Oct 2026 (Tuesday)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Select Time Window</label>
                <select
                  value={newWindow}
                  onChange={e => setNewWindow(e.target.value)}
                  className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Morning (9 AM - 1 PM)">Morning (9 AM - 1 PM)</option>
                  <option value="Afternoon (1 PM - 5 PM)">Afternoon (1 PM - 5 PM)</option>
                  <option value="Evening (5 PM - 8 PM)">Evening (5 PM - 8 PM)</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleSubmit}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm"
              >
                Confirm New Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CANCEL PICKUP MODAL ─── */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Cancel Doorstep Pickup</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to cancel? There are no cancellation fees. Please tell us the reason:
            </p>

            <div className="mt-4">
              <select
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="">Select cancellation reason...</option>
                <option value="changed_mind">Changed my mind / Want to keep the phone</option>
                <option value="got_better_price">Found a better offer elsewhere</option>
                <option value="delay">Pickup slot delayed</option>
                <option value="other">Other reason</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Keep Order
              </button>
              <button
                disabled={!cancelReason}
                onClick={handleCancelSubmit}
                className="px-4 py-2 rounded-xl bg-rose-600 disabled:opacity-50 text-white text-xs font-bold hover:bg-rose-700 shadow-sm"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── BUY REPLACEMENT REQUEST MODAL ─── */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Request 15-Day Replacement</h3>
            <p className="text-xs text-slate-500 mt-1">
              Sellbar Assured includes a hassle-free 15-day replacement policy for all refurbished phones.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Issue Encountered</label>
                <select
                  value={returnReason}
                  onChange={e => setReturnReason(e.target.value)}
                  className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="Display discoloration">Display discoloration or touch issue</option>
                  <option value="Battery draining faster">Battery draining faster than expected</option>
                  <option value="Camera defect">Camera focusing or lens issue</option>
                  <option value="Speaker/Mic problem">Speaker / Microphone problem</option>
                  <option value="Received wrong grade">Received different cosmetic grade</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the issue observed..."
                  value={returnNotes}
                  onChange={e => setReturnNotes(e.target.value)}
                  className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">What happens next:</p>
                <p className="mt-0.5">A courier pickup will be scheduled. Once our technical bench verifies the device, a replacement unit is dispatched immediately.</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowReturnModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={handleReturnSubmit}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 shadow-sm"
              >
                Submit Replacement Request
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </AccountLayout>
  );
}
