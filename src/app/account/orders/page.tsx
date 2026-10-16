'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { StatusBadge, PageHeader, EmptyState, SkeletonCard, SectionCard } from '@/components/account/ui';
import { accountService } from '@/lib/account/mockData';
import { Order } from '@/types/account';
import {
  Package, Search, Download, RefreshCw, RotateCcw, ShoppingCart,
  ChevronRight, Truck, Clock, AlertTriangle, Calendar, UserCheck,
  ShieldCheck, FileCheck, CheckCircle2, XCircle
} from 'lucide-react';

type TabType = 'ALL' | 'SELL' | 'BUY';

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: 'All Statuses', value: 'ALL' },
  { label: 'Pickup Scheduled', value: 'PICKUP_SCHEDULED' },
  { label: 'Price Review Needed', value: 'REVISED_PRICE_PENDING' },
  { label: 'Out for Delivery / Pickup', value: 'OUT_FOR_DELIVERY' },
  { label: 'Delivered / Completed', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const DATE_FILTERS = [
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 3 months', days: 90 },
  { label: 'Last 6 months', days: 180 },
  { label: 'Last year', days: 365 },
];

function SellOrderCard({ order }: { order: Order }) {
  const isRevisedPending = order.sellStatus === 'REVISED_PRICE_PENDING';
  const isCompleted = order.sellStatus === 'COMPLETED' || order.status === 'DELIVERED';
  const isPickupScheduled = order.sellStatus === 'PICKUP_SCHEDULED' || order.sellStatus === 'EXECUTIVE_ASSIGNED';

  return (
    <div className={`bg-white rounded-2xl border transition-all overflow-hidden hover:shadow-md ${
      isRevisedPending ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200/80 hover:border-slate-300'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-5 py-3 border-b ${
        isRevisedPending ? 'bg-amber-50/70 border-amber-200' : 'bg-slate-50/70 border-slate-100'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700 font-mono tracking-tight">{order.orderId}</span>
          <span className="text-slate-300">·</span>
          <span className="text-xs font-medium text-slate-500">
            Sell Order · {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <StatusBadge status={order.sellStatus || order.status} />
      </div>

      {/* Revised Price Alert Bar */}
      {isRevisedPending && (
        <div className="px-5 py-3 bg-amber-100/60 border-b border-amber-200 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs text-amber-900">
            <p className="font-bold">Diagnostic Revision: Action Required</p>
            <p className="text-amber-800 mt-0.5">
              Pickup executive evaluated your device and offered a revised valuation of{' '}
              <span className="font-black text-slate-900">₹{order.revisedPrice?.toLocaleString('en-IN')}</span>{' '}
              (Original Quote: ₹{order.quotedPrice?.toLocaleString('en-IN')}). Please review line-item reasons to accept or cancel free.
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex gap-4">
          <div className="h-20 w-20 rounded-xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0">
            {order.sellDevice?.image ? (
              <img
                src={order.sellDevice.image}
                alt={order.sellDevice.model}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <Package className="h-8 w-8 text-slate-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-base font-bold text-slate-900 leading-tight">
                  {order.sellDevice?.brand} {order.sellDevice?.model}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{order.sellDevice?.variant}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-baseline gap-3 mt-3">
              {isRevisedPending ? (
                <>
                  <div>
                    <span className="text-xs text-slate-500 block">Revised Payout</span>
                    <span className="text-xl font-black text-emerald-600">
                      ₹{order.revisedPrice?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block line-through">
                      Quoted ₹{order.quotedPrice?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </>
              ) : (
                <div>
                  <span className="text-xs text-slate-500 block">
                    {isCompleted ? 'Final Payout Received' : 'Guaranteed Price Lock'}
                  </span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{(order.actualPaidPrice || order.quotedPrice || order.total).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              <span className="text-xs font-semibold text-slate-500 self-center">
                via {order.payoutMode || 'Instant UPI'}
              </span>
            </div>

            {/* Pickup / Executive Details */}
            {order.pickupSlot && isPickupScheduled && (
              <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                  <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                  Slot: {order.pickupSlot.date} ({order.pickupSlot.window})
                </span>
                {order.executive && (
                  <span className="inline-flex items-center gap-1.5 text-slate-600">
                    <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                    Agent: {order.executive.name} ({order.executive.maskedPhone || order.executive.phone})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 px-5 pb-4 pt-1 bg-white border-t border-slate-50">
        <Link
          href={`/account/orders/${order.orderId}`}
          className={`min-h-11 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            isRevisedPending
              ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
          }`}
        >
          {isRevisedPending ? (
            <>Review Revised Price <ChevronRight className="h-3.5 w-3.5" /></>
          ) : (
            <>View Order & Timeline <ChevronRight className="h-3.5 w-3.5" /></>
          )}
        </Link>

        {isCompleted && order.dataWipeCertificateUrl && (
          <a
            href={order.dataWipeCertificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-11 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Data Erase Certificate
          </a>
        )}

        <a
          href={`https://wa.me/918000000000?text=${encodeURIComponent(`Hi Sellbar team, I need help regarding Sell Order ${order.orderId}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-11 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-1.5 ml-auto"
        >
          WhatsApp Concierge
        </a>
      </div>
    </div>
  );
}

function BuyOrderCard({ order }: { order: Order }) {
  const isActive = ['PLACED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(order.status);
  const isDelivered = order.status === 'DELIVERED';
  const primaryItem = order.items[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-md hover:border-slate-300 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700 font-mono tracking-tight">{order.orderId}</span>
          <span className="text-slate-300">·</span>
          <span className="text-xs font-medium text-slate-500">
            Buy Order · {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Items */}
      <div className="p-5">
        <div className="flex gap-4">
          <div className="h-20 w-20 rounded-xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0">
            {primaryItem?.image ? (
              <img
                src={primaryItem.image}
                alt={primaryItem.name}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <Package className="h-8 w-8 text-slate-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-slate-900 leading-tight line-clamp-1">{primaryItem?.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{primaryItem?.variant}</p>
            
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100">
                6-Month Warranty
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">
                15-Day Free Replacement
              </span>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <span className="font-black text-xl text-slate-900">₹{order.total.toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-400">via {order.paymentMethod}</span>
            </div>

            {isActive && order.expectedDelivery && (
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-indigo-700">
                <Truck className="h-3.5 w-3.5" />
                Courier: {order.courierPartner || 'Delhivery Express'} · Expected: {new Date(order.expectedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </div>
            )}
            {isDelivered && order.deliveredAt && (
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-700">
                <Clock className="h-3.5 w-3.5" />
                Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 px-5 pb-4 pt-1 bg-white border-t border-slate-50">
        <Link
          href={`/account/orders/${order.orderId}`}
          className="min-h-11 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          {isActive ? <><Truck className="h-3.5 w-3.5" /> Track Shipment</> : <><ChevronRight className="h-3.5 w-3.5" /> Order Details</>}
        </Link>

        {order.invoiceUrl && (
          <Link
            href={order.invoiceUrl}
            className="min-h-11 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Download Invoice
          </Link>
        )}

        {isDelivered && primaryItem?.canReturn && (
          <Link
            href={`/account/orders/${order.orderId}?action=return`}
            className="min-h-11 px-4 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
            Request Replacement
          </Link>
        )}
      </div>
    </div>
  );
}

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [searchQ, setSearchQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState(365);

  useEffect(() => {
    accountService.getOrders().then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const filtered = orders.filter(o => {
    // Tab filter
    const isSell = o.orderType === 'SELL' || o.orderId.startsWith('ORD-SELL-');
    if (activeTab === 'SELL' && !isSell) return false;
    if (activeTab === 'BUY' && isSell) return false;

    // Status filter
    if (statusFilter !== 'ALL') {
      const currentStatus = o.sellStatus || o.status;
      if (currentStatus !== statusFilter) return false;
    }

    // Search filter
    if (searchQ) {
      const q = searchQ.toLowerCase();
      const matchId = o.orderId.toLowerCase().includes(q);
      const matchDevice = o.sellDevice ? `${o.sellDevice.brand} ${o.sellDevice.model}`.toLowerCase().includes(q) : false;
      const matchItems = o.items.some(i => i.name.toLowerCase().includes(q));
      if (!matchId && !matchDevice && !matchItems) return false;
    }

    // Date filter
    const daysSince = (Date.now() - new Date(o.placedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince > dateFilter) return false;

    return true;
  });

  const sellCount = orders.filter(o => o.orderType === 'SELL' || o.orderId.startsWith('ORD-SELL-')).length;
  const buyCount = orders.length - sellCount;

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-4xl mx-auto w-full">
      <PageHeader
        title="My Orders"
        description="Track old phone pickups, instant payouts, and refurbished device deliveries"
      />

      {/* Tabs: All / Sell / Buy */}
      <div className="flex border-b border-slate-200 mb-5">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'ALL'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All Orders
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">{orders.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('SELL')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'SELL'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Sell Phone Pickups
          <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800">{sellCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('BUY')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'BUY'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Refurbished Purchases
          <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-800">{buyCount}</span>
        </button>
      </div>

      {/* Search & Filters */}
      <SectionCard className="mb-6">
        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Order ID (ORD-...) or phone model..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50 text-slate-900"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Status Pills */}
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    statusFilter === f.value
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Timeframe:</span>
              <select
                value={dateFilter}
                onChange={e => setDateFilter(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                {DATE_FILTERS.map(d => (
                  <option key={d.days} value={d.days}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="h-8 w-8 text-slate-400" />}
          title="No orders found"
          description={searchQ ? `No orders match "${searchQ}".` : "You have no active orders in this section."}
          cta={{ label: activeTab === 'SELL' ? 'Sell an Old Phone' : 'Browse Refurbished Phones', href: activeTab === 'SELL' ? '/sell' : '/buy' }}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map(order => {
            const isSell = order.orderType === 'SELL' || order.orderId.startsWith('ORD-SELL-');
            return isSell ? (
              <SellOrderCard key={order.id} order={order} />
            ) : (
              <BuyOrderCard key={order.id} order={order} />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AccountLayout>
      <AccountHeader />
      <OrdersContent />
    </AccountLayout>
  );
}
