'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, CheckCircle2, Clock, Printer, Truck, Search,
  Filter, Package, ArrowLeft, ArrowUpRight, Check
} from 'lucide-react';

interface SellerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  shippingAddress: string;
  device: string;
  grade: string;
  amount: number;
  orderDate: string;
  courier: string;
  awbNumber: string;
  status: 'PENDING_PACKING' | 'READY_FOR_PICKUP' | 'SHIPPED' | 'DELIVERED';
}

const INITIAL_ORDERS: SellerOrder[] = [
  {
    id: 'ord-1',
    orderNumber: 'ORD-SEL-88192',
    customerName: 'Deepak Merchant',
    shippingAddress: 'Plot 88, SV Road, Bandra West, Mumbai - 400050',
    device: 'Apple iPhone 14 Pro (128GB, Deep Purple)',
    grade: 'Grade A+',
    amount: 68500,
    orderDate: 'Today, 09:30 AM',
    courier: 'BlueDart Express',
    awbNumber: 'BD-771920481',
    status: 'READY_FOR_PICKUP',
  },
  {
    id: 'ord-2',
    orderNumber: 'ORD-SEL-88195',
    customerName: 'Alok Nath',
    shippingAddress: 'Flat 12, Sunrise Residency, Koramangala, Bengaluru - 560034',
    device: 'MacBook Air M2 16GB / 512GB (Midnight)',
    grade: 'Grade A+',
    amount: 84000,
    orderDate: 'Today, 11:15 AM',
    courier: 'Delhivery Surface',
    awbNumber: 'DLV-992140192',
    status: 'PENDING_PACKING',
  },
  {
    id: 'ord-3',
    orderNumber: 'ORD-SEL-88180',
    customerName: 'Shreya Kapoor',
    shippingAddress: 'Sector 42, Golf Course Road, Gurugram - 122002',
    device: 'Samsung Galaxy S23 Ultra (256GB, Phantom Black)',
    grade: 'Grade A',
    amount: 72000,
    orderDate: 'Yesterday',
    courier: 'BlueDart Express',
    awbNumber: 'BD-771891029',
    status: 'SHIPPED',
  },
];

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<SellerOrder[]>(INITIAL_ORDERS);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [toast, setToast] = useState('');

  const filtered = orders.filter(o => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    return true;
  });

  const markReadyForPickup = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'READY_FOR_PICKUP' } : o));
    setToast('Order marked packed! Courier pickup manifest requested.');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
              Fulfillment Operations
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500">{orders.length} Active Orders</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-600" />
            Customer Orders & Dispatch Manifest
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate shipping labels, pack refurbished orders, and coordinate carrier pickup.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setToast('Manifest sheet downloaded for today’s carrier pickups!');
              setTimeout(() => setToast(''), 2500);
            }}
            className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-2 border border-slate-200 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print Daily Dispatch Manifest
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1.5 rounded-2xl w-full sm:w-auto shadow-xs">
        {['all', 'PENDING_PACKING', 'READY_FOR_PICKUP', 'SHIPPED'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterStatus === tab
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Order / Time</th>
                <th className="py-3.5 px-4">Device & Grade</th>
                <th className="py-3.5 px-4">Customer & Address</th>
                <th className="py-3.5 px-4">Courier / AWB</th>
                <th className="py-3.5 px-4 text-right">Order Value</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900 text-xs">{order.orderNumber}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{order.orderDate}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{order.device}</div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 mt-1 inline-block">
                      {order.grade}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">{order.customerName}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-xs">{order.shippingAddress}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">{order.courier}</div>
                    <div className="font-mono text-[10px] text-amber-700 font-bold mt-0.5">AWB: {order.awbNumber}</div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-black text-emerald-600 text-sm">
                    ₹{order.amount.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      order.status === 'READY_FOR_PICKUP'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : order.status === 'SHIPPED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {order.status === 'PENDING_PACKING' ? (
                      <button
                        onClick={() => markReadyForPickup(order.id)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] transition cursor-pointer"
                      >
                        Mark Packed
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setToast(`Shipping label for ${order.orderNumber} sent to printer!`);
                          setTimeout(() => setToast(''), 2500);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition cursor-pointer"
                        title="Print AWB Label"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
