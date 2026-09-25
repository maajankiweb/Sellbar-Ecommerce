'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Warehouse, Package, AlertTriangle, CheckCircle2, ShieldCheck,
  TrendingDown, TrendingUp, Search, Filter, RefreshCw, Plus,
  Layers, ArrowUpRight, Box, BarChart3, Bell
} from 'lucide-react';

interface InventoryBin {
  id: string;
  binCode: string;
  category: string;
  currentUnits: number;
  safetyThreshold: number;
  grade: 'Grade A+' | 'Grade A' | 'Grade B' | 'Recycle/Scrap';
  status: 'optimal' | 'low_stock' | 'critical' | 'overflow';
  hubLocation: string;
  lastAudited: string;
}

const INITIAL_BINS: InventoryBin[] = [
  {
    id: 'bin-1',
    binCode: 'BIN-APL-01',
    category: 'Apple iPhone (14 & 15 Series)',
    currentUnits: 46,
    safetyThreshold: 20,
    grade: 'Grade A+',
    status: 'optimal',
    hubLocation: 'Aisle 2 - High Security Vault',
    lastAudited: 'Today, 10:30 AM',
  },
  {
    id: 'bin-2',
    binCode: 'BIN-SAM-03',
    category: 'Samsung Galaxy S23/S24 Ultra',
    currentUnits: 8,
    safetyThreshold: 15,
    grade: 'Grade A',
    status: 'low_stock',
    hubLocation: 'Aisle 3 - Shelf B',
    lastAudited: 'Yesterday',
  },
  {
    id: 'bin-3',
    binCode: 'BIN-MAC-02',
    category: 'MacBook Air & Pro (M1/M2/M3)',
    currentUnits: 28,
    safetyThreshold: 12,
    grade: 'Grade A+',
    status: 'optimal',
    hubLocation: 'Aisle 1 - Padded Rack',
    lastAudited: 'Today, 09:15 AM',
  },
  {
    id: 'bin-4',
    binCode: 'BIN-ONE-05',
    category: 'OnePlus Flagships (11/12 Series)',
    currentUnits: 4,
    safetyThreshold: 10,
    grade: 'Grade B',
    status: 'critical',
    hubLocation: 'Aisle 4 - Shelf C',
    lastAudited: '2 days ago',
  },
  {
    id: 'bin-5',
    binCode: 'BIN-PKG-01',
    category: 'Tamper-Evident Anti-Static Pouch & Bubble Seals',
    currentUnits: 320,
    safetyThreshold: 200,
    grade: 'Grade A',
    status: 'optimal',
    hubLocation: 'Packaging Intake Bay',
    lastAudited: 'Today, 08:00 AM',
  },
  {
    id: 'bin-6',
    binCode: 'BIN-SCR-99',
    category: 'De-energized Batteries for E-Waste Disposal',
    currentUnits: 84,
    safetyThreshold: 100,
    grade: 'Recycle/Scrap',
    status: 'optimal',
    hubLocation: 'Hazmat Fire-Proof Lockbox',
    lastAudited: 'Today, 11:00 AM',
  },
];

export default function ManagerInventoryPage() {
  const [bins, setBins] = useState<InventoryBin[]>(INITIAL_BINS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'optimal' | 'low_stock' | 'critical'>('all');
  const [toast, setToast] = useState('');

  const filtered = bins.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.binCode.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.grade.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const lowStockCount = bins.filter(b => b.status === 'low_stock' || b.status === 'critical').length;

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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
              Hub Warehouse & Bin Storage
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-amber-700 font-bold">
              {lowStockCount} Bins Below Safety Threshold
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Warehouse className="w-6 h-6 text-emerald-600" />
            Stock Levels & Safety Thresholds
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time hub inventory bins, grading splits, safety buffer stock, and e-waste quarantine hold.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setToast('Stock audit manifest synchronized with Central ERP.');
              setTimeout(() => setToast(''), 2500);
            }}
            className="px-4 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer border border-slate-200 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-audit Stock
          </button>
        </div>
      </div>

      {/* Overview Cards in White */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-500 font-bold">Total Stored Units</div>
          <div className="text-2xl font-black text-slate-900 mt-1">490 Units</div>
          <div className="text-[10px] text-emerald-600 mt-1">Across 6 active warehouse bins</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-500 font-bold">Grade A+ (Prime Ready)</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">74 Units</div>
          <div className="text-[10px] text-slate-400 mt-1">Ready for D2C Storefront shipment</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-500 font-bold">Low Stock Warning</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{lowStockCount} Bins</div>
          <div className="text-[10px] text-amber-700 mt-1">Restock trade-in intake suggested</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-500 font-bold">Quarantine / Scrap</div>
          <div className="text-2xl font-black text-rose-600 mt-1">84 Units</div>
          <div className="text-[10px] text-slate-400 mt-1">R2 certified recycling batch</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1.5 rounded-2xl w-full sm:w-auto shadow-2xs">
          {(['all', 'optimal', 'low_stock', 'critical'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                statusFilter === tab
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.replace('_', ' ')} ({tab === 'all' ? bins.length : bins.filter(b => b.status === tab).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search bin code, model, grade..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Table in White */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Bin Code & Aisle</th>
                <th className="py-3.5 px-4">Category / Item</th>
                <th className="py-3.5 px-4">Refurb Grade</th>
                <th className="py-3.5 px-4 text-center">Current / Safety Threshold</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Last Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(bin => (
                <tr key={bin.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900 text-xs">{bin.binCode}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{bin.hubLocation}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{bin.category}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      bin.grade === 'Grade A+' ? 'bg-emerald-100 text-emerald-800' :
                      bin.grade === 'Grade A' ? 'bg-blue-100 text-blue-800' :
                      bin.grade === 'Grade B' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {bin.grade}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="font-mono text-sm font-black text-slate-900">
                      {bin.currentUnits} <span className="text-slate-400 font-normal">/ {bin.safetyThreshold} min</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      bin.status === 'optimal'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : bin.status === 'low_stock'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      {bin.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right text-slate-500 font-mono text-[11px]">
                    {bin.lastAudited}
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
