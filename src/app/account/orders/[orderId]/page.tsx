'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { StatusBadge, OrderTimeline, PageHeader, SectionCard, SectionHeader, RatingStars, Toast } from '@/components/account/ui';
import { accountService } from '@/lib/account/mockData';
import { Order } from '@/types/account';
import {
  Package, Download, ShoppingCart, RotateCcw, Star, ArrowLeft,
  MapPin, Truck, CreditCard, ChevronRight, Phone, MessageSquare,
  Copy, CheckCircle
} from 'lucide-react';

function PriceSummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2 ${highlight ? 'border-t border-slate-100 pt-3 mt-1' : ''}`}>
      <span className={`text-sm ${highlight ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{label}</span>
      <span className={`${highlight ? 'text-lg font-black text-slate-900' : 'text-sm font-semibold text-slate-900'}`}>{value}</span>
    </div>
  );
}

function OrderDetailContent() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [copied, setCopied] = useState(false);

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

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-64 bg-slate-200 rounded-2xl" />
          <div className="h-48 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 mb-1">Order not found</h3>
          <p className="text-sm text-slate-500 mb-4">This order doesn't exist or may have been removed.</p>
          <Link href="/account/orders" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition">
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  const isActive = ['PLACED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(order.status);
  const isDelivered = order.status === 'DELIVERED';

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-4xl mx-auto w-full">
      {/* Back */}
      <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-4 transition">
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-black text-slate-900">{order.orderId}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Placed on {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setToast('Invoice downloaded!')}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" />
            Invoice
          </button>
          <button
            onClick={() => setToast('Items added to cart!')}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-1.5"
          >
            <ShoppingCart className="h-4 w-4" />
            Reorder
          </button>
          <Link
            href="/account/support"
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <MessageSquare className="h-4 w-4" />
            Support
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Items + Timeline */}
        <div className="lg:col-span-2 space-y-5">
          {/* Order Items */}
          <SectionCard>
            <SectionHeader title={`Order Items (${order.items.length})`} />
            <div className="divide-y divide-slate-100">
              {order.items.map(item => (
                <div key={item.id} className="px-5 py-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.variant}</p>
                      <p className="text-xs text-slate-400">SKU: {item.sku} · Qty: {item.quantity}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-black text-base text-slate-900">₹{item.total.toLocaleString('en-IN')}</span>
                        {item.discount > 0 && (
                          <>
                            <span className="text-xs line-through text-slate-400">₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}</span>
                            <span className="text-xs font-bold text-emerald-600">-₹{item.discount.toLocaleString('en-IN')}</span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button
                          onClick={() => setToast('Added to cart!')}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition"
                        >
                          Buy Again
                        </button>
                        {!item.isReviewed && isDelivered && (
                          <Link
                            href="/account/reviews"
                            className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-100 transition flex items-center gap-1"
                          >
                            <Star className="h-3 w-3" />
                            Write Review
                          </Link>
                        )}
                        {item.canReturn && isDelivered && (
                          <Link
                            href="/account/returns"
                            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition flex items-center gap-1"
                          >
                            <RotateCcw className="h-3 w-3" />
                            Return
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Order Timeline */}
          <SectionCard>
            <SectionHeader title="Order Timeline" />
            <div className="p-5">
              <OrderTimeline steps={order.timeline} />
            </div>
          </SectionCard>
        </div>

        {/* Right: Summary + Shipping */}
        <div className="space-y-5">
          {/* Price Summary */}
          <SectionCard>
            <SectionHeader title="Price Summary" />
            <div className="px-5 py-4 space-y-0.5">
              <PriceSummaryRow label="Subtotal" value={`₹${order.subtotal.toLocaleString('en-IN')}`} />
              {order.discount > 0 && <PriceSummaryRow label="Discount" value={`-₹${order.discount.toLocaleString('en-IN')}`} />}
              <PriceSummaryRow label="Shipping" value={order.shipping === 0 ? 'FREE' : `₹${order.shipping}`} />
              {order.tax > 0 && <PriceSummaryRow label="Tax (GST)" value={`₹${order.tax.toLocaleString('en-IN')}`} />}
              {order.walletCredit && order.walletCredit > 0 ? <PriceSummaryRow label="Wallet Credit" value={`-₹${order.walletCredit.toLocaleString('en-IN')}`} /> : null}
              {order.rewardDiscount && order.rewardDiscount > 0 ? <PriceSummaryRow label="Rewards Discount" value={`-₹${order.rewardDiscount.toLocaleString('en-IN')}`} /> : null}
              <PriceSummaryRow label="Total Paid" value={`₹${order.total.toLocaleString('en-IN')}`} highlight />
              <div className="pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CreditCard className="h-3.5 w-3.5" />
                  {order.paymentMethod}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Shipping Info */}
          <SectionCard>
            <SectionHeader title="Shipping Details" />
            <div className="px-5 py-4 space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Delivery Address</p>
                <div className="flex gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.line1}</p>
                    {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                    <p className="flex items-center gap-1 mt-1 text-slate-500">
                      <Phone className="h-3 w-3" />
                      {order.shippingAddress.phone}
                    </p>
                  </div>
                </div>
              </div>

              {order.trackingId && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Tracking</p>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                    <div className="flex-1">
                      <p className="text-xs text-slate-500">{order.courierPartner}</p>
                      <p className="font-mono font-bold text-sm text-slate-900">{order.trackingId}</p>
                    </div>
                    <button
                      onClick={copyTracking}
                      className="p-2 rounded-lg hover:bg-slate-200 transition text-slate-500"
                    >
                      {copied ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  {isActive && (
                    <button
                      onClick={() => setToast('Opening tracking page...')}
                      className="mt-2 w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <Truck className="h-4 w-4" />
                      Track Shipment
                    </button>
                  )}
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <AccountLayout>
      <AccountHeader />
      <OrderDetailContent />
    </AccountLayout>
  );
}
