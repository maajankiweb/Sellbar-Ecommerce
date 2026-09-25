'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package, TrendingUp, Clock, ShieldCheck, CreditCard, Bell,
  Search, ChevronRight, CheckCircle2, Store, Layers, ArrowRight,
  Sparkles, ShoppingBag, PlusCircle, AlertCircle, DollarSign
} from 'lucide-react';

export default function SellerDashboard() {
  const [toast, setToast] = useState('');

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-12 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-300">
              Verified Merchant Central
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500">Merchant: Apex Refurbished Tech Hub (#MER-8820)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Seller Central & Refurb Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your certified refurbished inventory, dispatch B2B & retail orders, and view weekly settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/seller/inventory"
            className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> List New Inventory
          </Link>
        </div>
      </div>

      {/* Metric Summary Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Today's Unit Sales</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">14 Units</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +18.4% vs last week
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Pending Courier Dispatch</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1">3 Orders</div>
          <div className="text-[11px] text-slate-500 mt-1">1 Bluedart pickup today</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Escrow Balance Ready</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">₹1,46,000</div>
          <div className="text-[10px] text-slate-500 mt-1">Settlement batch: Tomorrow 10 AM</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Refurb Quality Score</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">99.4%</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">Tier 1 Certified Vendor</div>
        </div>
      </div>

      {/* Quick Navigation to Subpages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/seller/inventory"
          className="group p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-sm transition flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition flex items-center gap-1.5">
              Refurbished Catalog & Stock
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Upload refurbished devices, set Grade A/B/C pricing, toggle SELBAR 1-year warranty badges, and manage stock thresholds.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-blue-600">
            Manage Catalog (18 SKUs) &rarr;
          </div>
        </Link>

        <Link
          href="/seller/orders"
          className="group p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-500 hover:shadow-sm transition flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-600 transition flex items-center gap-1.5">
              Customer Orders & Dispatches
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Print courier shipping labels, pack items in tamper-proof bags, schedule carrier pickup, and track AWB manifests.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-amber-600">
            View Active Orders (3 Pending) &rarr;
          </div>
        </Link>

        <Link
          href="/seller/payouts"
          className="group p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition flex items-center gap-1.5">
              Bank Settlements & Ledger
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              View completed T+2 bank deposits, escrow clearance releases, GST commission tax invoices, and payout breakdowns.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-600">
            View Settlement Ledger &rarr;
          </div>
        </Link>
      </div>

      {/* Orders Preview */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-blue-600" />
            Recent Orders Awaiting Courier Handover
          </h3>
          <Link
            href="/seller/orders"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            All Orders &rarr;
          </Link>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {[
            { id: 'ORD-SEL-88192', customer: 'Deepak Merchant', item: 'Apple iPhone 14 Pro (128GB, Deep Purple) - Grade A+', amount: 68500, courier: 'BlueDart Express', status: 'READY_FOR_PICKUP' },
            { id: 'ORD-SEL-88195', customer: 'Alok Nath', item: 'MacBook Air M2 16GB / 512GB (Midnight) - Grade A+', amount: 84000, courier: 'Delhivery Surface', status: 'PENDING_PACKING' },
          ].map(order => (
            <div key={order.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 font-mono font-bold text-slate-900">
                  <span>{order.id}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 font-sans font-medium">{order.customer}</span>
                </div>
                <div className="text-slate-800 font-semibold mt-0.5">{order.item}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Assigned Courier: {order.courier}</div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right">
                  <div className="text-sm font-black text-emerald-600">₹{order.amount.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Prepaid</div>
                </div>

                <Link
                  href="/seller/orders"
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
                >
                  Print Label
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
