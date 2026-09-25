'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { StatusBadge, PageHeader, EmptyState, SkeletonCard, SectionCard } from '@/components/account/ui';
import { accountService } from '@/lib/account/mockData';
import { Order, OrderStatus } from '@/types/account';
import { Package, Search, Download, RefreshCw, RotateCcw, ShoppingCart, Filter, ChevronRight, Truck, Clock } from 'lucide-react';

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Returned', value: 'RETURN_REQUESTED' },
];

const DATE_FILTERS = [
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 3 months', days: 90 },
  { label: 'Last 6 months', days: 180 },
  { label: 'Last year', days: 365 },
];

function OrderCard({ order }: { order: Order }) {
  const isActive = ['PLACED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(order.status);
  const isDelivered = order.status === 'DELIVERED';
  const canReturn = isDelivered && order.items.some(i => i.canReturn);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md hover:border-slate-200 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500">{order.orderId}</span>
          <span className="text-slate-200">·</span>
          <span className="text-xs text-slate-400">
            {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Items */}
      <div className="px-5 py-4">
        <div className="flex gap-4">
          <div className="flex gap-2 shrink-0">
            {order.items.slice(0, 2).map((item, i) => (
              <img
                key={item.id}
                src={item.image}
                alt={item.name}
                className={`h-16 w-16 rounded-xl object-cover bg-slate-100 border border-slate-100 ${i > 0 ? '-ml-4' : ''}`}
              />
            ))}
            {order.items.length > 2 && (
              <div className="h-16 w-16 -ml-4 rounded-xl bg-slate-100 border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                +{order.items.length - 2}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 line-clamp-1">{order.items[0].name}</p>
            {order.items.length > 1 && (
              <p className="text-xs text-slate-400 mt-0.5">{order.items.length} items total</p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <span className="font-black text-lg text-slate-900">₹{order.total.toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-400">via {order.paymentMethod.split(' ')[0]}</span>
            </div>
            {isActive && order.expectedDelivery && (
              <div className="flex items-center gap-1 mt-1.5 text-xs font-semibold text-blue-700">
                <Truck className="h-3.5 w-3.5" />
                Expected: {new Date(order.expectedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </div>
            )}
            {isDelivered && order.deliveredAt && (
              <div className="flex items-center gap-1 mt-1.5 text-xs font-semibold text-emerald-600">
                <Clock className="h-3.5 w-3.5" />
                Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 px-5 pb-4">
        <Link
          href={`/account/orders/${order.orderId}`}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5"
        >
          {isActive ? <><Truck className="h-3.5 w-3.5" /> Track Order</> : <><ChevronRight className="h-3.5 w-3.5" /> View Details</>}
        </Link>
        <Link
          href={`/account/orders/${order.orderId}`}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
        >
          View Details
        </Link>
        <button className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition flex items-center gap-1.5">
          <Download className="h-3.5 w-3.5" />
          Invoice
        </button>
        <button className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition flex items-center gap-1.5">
          <ShoppingCart className="h-3.5 w-3.5" />
          Reorder
        </button>
        {canReturn && (
          <Link
            href="/account/returns"
            className="px-4 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Return Item
          </Link>
        )}
      </div>
    </div>
  );
}

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
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
    const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchSearch = !searchQ || o.orderId.toLowerCase().includes(searchQ.toLowerCase()) ||
      o.items.some(i => i.name.toLowerCase().includes(searchQ.toLowerCase()));
    const daysSince = (Date.now() - new Date(o.placedAt).getTime()) / (1000 * 60 * 60 * 24);
    const matchDate = daysSince <= dateFilter;
    return matchStatus && matchSearch && matchDate;
  });

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-4xl mx-auto w-full">
      <PageHeader
        title="My Orders"
        description={`${orders.length} orders placed`}
      />

      {/* Search & Filters */}
      <SectionCard className="mb-5">
        <div className="p-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search orders by ID or product name..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50"
            />
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  statusFilter === f.value
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Date Filters */}
          <div className="flex flex-wrap gap-2">
            {DATE_FILTERS.map(f => (
              <button
                key={f.days}
                onClick={() => setDateFilter(f.days)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                  dateFilter === f.days
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Order List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="h-8 w-8" />}
          title="No orders found"
          description={searchQ ? `No orders match "${searchQ}". Try a different search.` : "No orders yet. Start shopping to see your orders here."}
          cta={{ label: 'Start Shopping', href: '/buy' }}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
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
