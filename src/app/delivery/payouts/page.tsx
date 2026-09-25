'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign, CheckCircle2, ArrowUpRight, TrendingUp, Calendar,
  Wallet, ShieldCheck, Download, RefreshCw, CreditCard
} from 'lucide-react';

interface PayoutTransaction {
  id: string;
  orderNumber: string;
  customerName: string;
  device: string;
  amount: number;
  time: string;
  method: 'UPI Instant Payout' | 'Direct IMPS';
  refNumber: string;
  status: 'settled' | 'processing';
}

const INITIAL_TRANSACTIONS: PayoutTransaction[] = [
  {
    id: 'tx-1',
    orderNumber: 'PU-77101',
    customerName: 'Rohit Verma',
    device: 'Apple iPhone 13 (128GB)',
    amount: 38500,
    time: 'Today, 11:24 AM',
    method: 'UPI Instant Payout',
    refNumber: 'UPI/492104928109',
    status: 'settled',
  },
  {
    id: 'tx-2',
    orderNumber: 'PU-77094',
    customerName: 'Priya Sen',
    device: 'MacBook Air M1 (256GB)',
    amount: 52000,
    time: 'Yesterday, 04:12 PM',
    method: 'UPI Instant Payout',
    refNumber: 'UPI/492098412091',
    status: 'settled',
  },
  {
    id: 'tx-3',
    orderNumber: 'PU-77088',
    customerName: 'Arjun Kapur',
    device: 'OnePlus 11 5G (256GB)',
    amount: 29000,
    time: 'Yesterday, 01:45 PM',
    method: 'UPI Instant Payout',
    refNumber: 'UPI/492087612984',
    status: 'settled',
  },
];

export default function DeliveryPayoutsPage() {
  const [transactions, setTransactions] = useState<PayoutTransaction[]>(INITIAL_TRANSACTIONS);
  const [toast, setToast] = useState('');

  const totalDisbursed = transactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-12 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Header in White */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
              Escrow Payout Ledger
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Direct Customer UPI settlements</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-amber-600" />
            Instant Payouts & Daily Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track bank confirmations, instant door-step customer settlements, and daily travel incentives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setToast('Payout statement downloaded!');
              setTimeout(() => setToast(''), 2500);
            }}
            className="px-4 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-2 border border-slate-200 shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download Statement
          </button>
        </div>
      </div>

      {/* KPI Cards in White */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs font-bold text-slate-500">Total Customer Payouts</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹{totalDisbursed.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-600 mt-1">Across 3 verified doorstep visits</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs font-bold text-slate-500">Daily Fuel Allowance</div>
          <div className="text-2xl font-black text-amber-600 mt-1">₹350</div>
          <div className="text-[10px] text-slate-400 mt-1">45 kms covered today</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs font-bold text-slate-500">Pickup Incentive Earned</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">₹500</div>
          <div className="text-[10px] text-emerald-600 mt-1">₹150 - ₹200 per device tier</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs font-bold text-slate-500">Escrow Balance Remaining</div>
          <div className="text-2xl font-black text-blue-600 mt-1">₹1,80,500</div>
          <div className="text-[10px] text-slate-400 mt-1">SELBAR corporate float pool</div>
        </div>
      </div>

      {/* Ledger Table in White */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xs font-black uppercase text-slate-600 tracking-wider">
            Doorstep Settlement Transactions
          </h2>
          <span className="text-xs text-slate-400 font-mono">Cashfree Auto-Disburse API</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Order / Time</th>
                <th className="py-3.5 px-4">Customer & Device</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Bank Ref Number</th>
                <th className="py-3.5 px-4 text-right">Disbursed Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900 text-xs">{tx.orderNumber}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{tx.time}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{tx.customerName}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{tx.device}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-slate-600 font-medium">{tx.method}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-amber-700 font-bold">
                    {tx.refNumber}
                  </td>

                  <td className="py-3.5 px-4 text-right font-black text-emerald-600 text-sm">
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {tx.status}
                    </span>
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
