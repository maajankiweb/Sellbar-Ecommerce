'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  History, CheckCircle2, ShieldCheck, MapPin, Search, Filter,
  Phone, Eye, Download, ArrowLeft, ArrowUpRight
} from 'lucide-react';

interface RunReceipt {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  address: string;
  device: string;
  amount: number;
  tamperSeal: string;
  signatureStatus: 'Customer Signed' | 'OTP Verified';
}

const HISTORICAL_RUNS: RunReceipt[] = [
  {
    id: 'run-1',
    orderNumber: 'PU-77101',
    date: 'Today, 11:24 AM',
    customerName: 'Rohit Verma',
    address: 'Juhu Tara Road, Mumbai',
    device: 'Apple iPhone 13 (128GB, Starlight)',
    amount: 38500,
    tamperSeal: 'TP-992014',
    signatureStatus: 'OTP Verified',
  },
  {
    id: 'run-2',
    orderNumber: 'PU-77094',
    date: '24 Sep 2026, 04:12 PM',
    customerName: 'Priya Sen',
    address: 'Kalyani Nagar, Pune',
    device: 'MacBook Air M1 (256GB, Gold)',
    amount: 52000,
    tamperSeal: 'TP-992008',
    signatureStatus: 'Customer Signed',
  },
  {
    id: 'run-3',
    orderNumber: 'PU-77088',
    date: '24 Sep 2026, 01:45 PM',
    customerName: 'Arjun Kapur',
    address: 'Viman Nagar, Pune',
    device: 'OnePlus 11 5G (256GB, Titan Black)',
    amount: 29000,
    tamperSeal: 'TP-992005',
    signatureStatus: 'OTP Verified',
  },
  {
    id: 'run-4',
    orderNumber: 'PU-77071',
    date: '23 Sep 2026, 05:30 PM',
    customerName: 'Meghna Nair',
    address: 'Bandra West, Mumbai',
    device: 'iPad Pro 11" M2 (128GB, Space Gray)',
    amount: 47000,
    tamperSeal: 'TP-991982',
    signatureStatus: 'Customer Signed',
  },
];

export default function DeliveryHistoryPage() {
  const [runs, setRuns] = useState<RunReceipt[]>(HISTORICAL_RUNS);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState('');

  const filtered = runs.filter(r => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.orderNumber.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.device.toLowerCase().includes(q) ||
        r.tamperSeal.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
              Completed Run Archives
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500">{runs.length} Verified Collections</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-600" />
            Completed Doorstep Run Receipts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Historical proof-of-handover, tamper bag custody codes, and customer digital acceptance.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search order, customer, tamper tag..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Run Receipts Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Order / Handover Time</th>
                <th className="py-3.5 px-4">Device Model</th>
                <th className="py-3.5 px-4">Customer & Location</th>
                <th className="py-3.5 px-4">Tamper Bag ID</th>
                <th className="py-3.5 px-4 text-right">Settled Amount</th>
                <th className="py-3.5 px-4 text-center">Verification</th>
                <th className="py-3.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(run => (
                <tr key={run.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900 text-xs">{run.orderNumber}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{run.date}</div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {run.device}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">{run.customerName}</div>
                    <div className="text-[10px] text-slate-500">{run.address}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-emerald-600">
                    {run.tamperSeal}
                  </td>

                  <td className="py-3.5 px-4 text-right font-black text-emerald-600 text-sm">
                    ₹{run.amount.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                      {run.signatureStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setToast(`Receipt for ${run.orderNumber} downloaded!`);
                        setTimeout(() => setToast(''), 2500);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition cursor-pointer"
                      title="Download PDF Receipt"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
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
