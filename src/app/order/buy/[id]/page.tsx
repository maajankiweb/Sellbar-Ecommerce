'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { BuyOrder, BuyOrderState, ReturnRequest } from '@/types';
import ReturnRequestModal from '@/components/order/ReturnRequestModal';
import LiveTrackingMap from '@/components/delivery/LiveTrackingMap';
import DeliveryRatingModal from '@/components/order/DeliveryRatingModal';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  FileText,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  Printer,
  ChevronRight,
  Star,
} from 'lucide-react';

const BUY_TIMELINE: { state: BuyOrderState; title: string; desc: string }[] = [
  { state: 'PLACED', title: 'Order Confirmed', desc: 'Item allocated and payment verified' },
  { state: 'PACKED', title: 'Quality Check & Packed', desc: '32-point inspection passed and sealed in tamper-proof box' },
  { state: 'SHIPPED', title: 'In Transit with Courier', desc: 'Dispatched with insured doorstep courier' },
  { state: 'OUT_FOR_DELIVERY', title: 'Out for Delivery', desc: 'Local delivery agent en route to your address' },
  { state: 'DELIVERED', title: 'Delivered', desc: 'Open-box inspection completed successfully' },
];

export default function BuyOrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<BuyOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/v1/orders/buy/${id}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
          // If delivered and not yet rated, auto-prompt rating modal
          const alreadyRated = typeof window !== 'undefined' && localStorage.getItem(`rated_${id}`);
          if (alreadyRated) {
            setHasRated(true);
          } else if (data.data.state === 'DELIVERED') {
            setTimeout(() => {
              setIsRatingModalOpen(true);
            }, 1200);
          }
        } else {
          setError(data.error || 'Order not found');
        }
      } catch {
        setError('Failed to fetch buy order status.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  const handleReturnSuccess = (returnReq: ReturnRequest) => {
    setIsReturnModalOpen(false);
    if (order) {
      setOrder({
        ...order,
        state: 'RETURN_REQUESTED',
        returnRequest: returnReq,
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-4 text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-base font-bold text-slate-800">Fetching Shipment Status...</h2>
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

  const orderStateIndex = BUY_TIMELINE.findIndex((s) => s.state === order.state);
  const currentStep = orderStateIndex !== -1 ? orderStateIndex : order.state === 'RETURN_REQUESTED' ? 4 : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Return Request Modal */}
      <ReturnRequestModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        order={order}
        onSuccess={handleReturnSuccess}
      />

      {/* Customer Delivery Rating Modal */}
      <DeliveryRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        orderId={order.id}
        courierName={order.courierPartner || 'SELBAR Delivery Partner'}
        onSuccess={() => {
          setHasRated(true);
          if (typeof window !== 'undefined') localStorage.setItem(`rated_${order.id}`, 'true');
        }}
      />

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-emerald-600/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Order Verified & Insured</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">Order #{order.id}</h1>
            <p className="text-xs text-emerald-100">
              Courier Partner: <strong className="text-white">{order.courierPartner || 'SELBAR Express'}</strong> • AWB:{' '}
              <strong className="font-mono text-white">{order.trackingNumber}</strong>
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="bg-white/15 p-3 rounded-2xl backdrop-blur-md text-left sm:text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Total Amount</span>
              <span className="text-2xl font-black text-white">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-white/80 block mt-0.5">Via {order.paymentMethod}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/order/buy/${order.id}/invoice`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-emerald-800 text-xs font-bold shadow-md hover:bg-emerald-50 transition"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Download Tax Invoice</span>
              </Link>

              {order.state === 'DELIVERED' && (
                <button
                  onClick={() => setIsRatingModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-md transition"
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{hasRated ? 'Edit Delivery Rating' : 'Rate Your Delivery'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live Interactive Map with Smooth Marker Interpolation */}
      {(order.state === 'SHIPPED' || order.state === 'OUT_FOR_DELIVERY' || order.state === 'DELIVERED') && (
        <LiveTrackingMap
          orderId={order.id}
          destination={{
            lat: 19.076,
            lng: 72.8777,
            address: `${order.shippingAddress.flatNo}, ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.pincode}`,
          }}
        />
      )}

      {/* Active Return Status Banner (if return requested) */}
      {order.returnRequest && (
        <div className="p-6 bg-amber-50 border-2 border-amber-300 rounded-3xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-700 animate-spin" />
              <h3 className="text-sm font-bold text-amber-900">
                5-Day Return/Replacement Ticket Active: #{order.returnRequest.id}
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900">
              Status: {order.returnRequest.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-amber-800 pt-1">
            <div>
              <span className="text-amber-600 text-[10px] uppercase font-bold block">Type</span>
              <strong>{order.returnRequest.type}</strong>
            </div>
            <div>
              <span className="text-amber-600 text-[10px] uppercase font-bold block">Reason</span>
              <span>{order.returnRequest.reason}</span>
            </div>
            <div>
              <span className="text-amber-600 text-[10px] uppercase font-bold block">Pickup Slot</span>
              <span>
                {order.returnRequest.pickupSlot.date} ({order.returnRequest.pickupSlot.window})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Progress Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
        <h2 className="text-base font-bold text-slate-900">Shipment Delivery Progress</h2>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {BUY_TIMELINE.map((step, idx) => {
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

      {/* Ordered Items & Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ordered items */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Purchased Items</h3>
          <div className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex gap-3 first:pt-0 last:pb-0 items-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-14 h-14 object-contain rounded-xl bg-slate-50 p-1 border border-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                  <div className="text-[11px] text-slate-500">
                    Qty: {item.quantity} • Grade: {item.grade.toUpperCase()}
                  </div>
                  <div className="text-xs font-bold text-emerald-700 mt-1">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivery Address</h3>
          <div className="text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-900">{order.shippingAddress.fullName}</div>
            <div>Phone: +91 {order.shippingAddress.phone}</div>
            <div>{order.shippingAddress.flatNo}, {order.shippingAddress.street}</div>
            <div>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">SELBAR 12-Month Warranty:</span>
            <span className="font-bold text-emerald-700">Active ✓</span>
          </div>
        </div>
      </div>

      {/* 5-Day Return / Replacement Policy Action */}
      <div className="p-6 bg-emerald-50/70 rounded-3xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <RotateCcw className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-900">5-Day Hassle-Free Replacement Policy</h4>
            <p className="text-[11px] text-slate-600 max-w-md">
              Need a swap or facing hardware issues? You can raise a return/replacement request within 5 days of delivery. Free doorstep reverse pickup in West Champaran.
            </p>
          </div>
        </div>

        {!order.returnRequest ? (
          <button
            onClick={() => setIsReturnModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shrink-0 shadow-md shadow-emerald-700/20"
          >
            Raise 5-Day Return / Replacement
          </button>
        ) : (
          <span className="text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-300">
            ✓ Ticket #{order.returnRequest.id} Under Processing
          </span>
        )}
      </div>

      <div className="text-center">
        <Link href="/account" className="text-xs font-bold text-emerald-700 hover:underline">
          ← Return to My Account & Orders
        </Link>
      </div>
    </div>
  );
}
