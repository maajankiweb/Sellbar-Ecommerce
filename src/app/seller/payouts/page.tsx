'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CreditCard, CheckCircle2, Download, TrendingUp, Calendar,
  Building2, ArrowUpRight, FileText, RefreshCw, DollarSign
} from 'lucide-react';

interface SettlementEntry {
  id: string;
  cycle: string;
  disbursedDate: string;
  grossOrdersAmount: number;
  commissionFee: number;
  netPayout: number;
  bankRef: string;
  status: 'settled' | 'pending';
}

const SETTLEMENT_DATA: SettlementEntry[] = [
  {
    id: 'set-1',
    cycle: '16 Sep - 22 Sep 2026',
    disbursedDate: '23 Sep 2026',
    grossOrdersAmount: 342000,
    commissionFee: 23940,
    netPayout: 318060,
    bankRef: 'HDFC-NEFT-99104821',
    status: 'settled',
  },
  {
    id: 'set-2',
    cycle: '09 Sep - 15 Sep 2026',
    disbursedDate: '16 Sep 2026',
    grossOrdersAmount: 289000,
    commissionFee: 20230,
    netPayout: 268770,
    bankRef: 'HDFC-NEFT-98410291',
    status: 'settled',
  },
  {
    id: 'set-3',
    cycle: 'Current Cycle (23 Sep - 29 Sep)',
    disbursedDate: 'Scheduled: 30 Sep 2026',
    grossOrdersAmount: 146000,
    commissionFee: 10220,
    netPayout: 135780,
    bankRef: 'Pending Clearing',
    status: 'pending',
  },
];

export default function SellerPayoutsPage() {
  const [settlements, setSettlements] = useState<SettlementEntry[]>(SETTLEMENT_DATA);
  const [toast, setToast] = useState('');

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
              Escrow & Weekly Settlements
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500">Bank: HDFC Bank (A/C **9842)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            Bank Settlements & Commission Statements
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Weekly automated NEFT bank deposits, platform commission breakdown, and GST tax invoice receipts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setToast('GST tax invoices zip downloaded!');
              setTimeout(() => setToast(''), 2500);
            }}
            className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-2 border border-slate-200 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download Tax Invoices
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-500 font-bold">Total Settled (Lifetime)</div>
          <div className="text-2xl font-black text-slate-900 mt-1">₹5,86,830</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">Direct NEFT credited</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-500 font-bold">Upcoming Settlement</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">₹1,35,780</div>
          <div className="text-[10px] text-slate-500 mt-1">Clearing on 30 Sep 2026</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-500 font-bold">Standard Platform Fee</div>
          <div className="text-2xl font-black text-blue-600 mt-1">7.0%</div>
          <div className="text-[10px] text-slate-500 mt-1">Tier 1 Certified Vendor rate</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-500 font-bold">Escrow Protection</div>
          <div className="text-2xl font-black text-purple-600 mt-1">100% Insured</div>
          <div className="text-[10px] text-slate-500 mt-1">7-Day return reserve escrow</div>
        </div>
      </div>

      {/* Settlement Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Billing Cycle</th>
                <th className="py-3.5 px-4">Payout Date</th>
                <th className="py-3.5 px-4 text-right">Gross GMV</th>
                <th className="py-3.5 px-4 text-right">SELBAR Fee (7%)</th>
                <th className="py-3.5 px-4 text-right">Net Credited Payout</th>
                <th className="py-3.5 px-4">Bank UTR Number</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {settlements.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {item.cycle}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">
                    {item.disbursedDate}
                  </td>

                  <td className="py-3.5 px-4 text-right text-slate-700">
                    ₹{item.grossOrdersAmount.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 text-right text-rose-600 font-bold">
                    -₹{item.commissionFee.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 text-right font-black text-emerald-600 text-sm">
                    ₹{item.netPayout.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-amber-700 font-bold">
                    {item.bankRef}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      item.status === 'settled'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {item.status}
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
