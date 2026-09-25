'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckSquare, AlertTriangle, CheckCircle2, XCircle, Search, Filter,
  Phone, Mail, ArrowUpRight, ShieldCheck, ChevronRight, RefreshCw,
  ThumbsUp, ThumbsDown, Edit3, Eye, Download, ArrowLeft, Shield
} from 'lucide-react';

interface ApprovalItem {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  device: string;
  quotedAmount: number;
  finalQcAmount: number;
  conditionStatus: 'Exact Match' | 'Minor Scratches' | 'Battery Degraded' | 'Display Replaced';
  qcTechnician: string;
  station: string;
  assignedTime: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  grade: 'A+' | 'A' | 'B' | 'C';
  imei: string;
}

const INITIAL_DATA: ApprovalItem[] = [
  {
    id: 'app-1',
    orderNumber: 'SEL-88291',
    customerName: 'Aditya Kashyap',
    phone: '+91 98201 11223',
    device: 'Apple iPhone 15 Pro Max (512GB, Natural Titanium)',
    quotedAmount: 89000,
    finalQcAmount: 87500,
    conditionStatus: 'Minor Scratches',
    qcTechnician: 'Karan Mehra',
    station: 'Bay #1 - High Precision Bench',
    assignedTime: '12m ago',
    status: 'pending',
    grade: 'A',
    imei: '358941098234120',
  },
  {
    id: 'app-2',
    orderNumber: 'SEL-88295',
    customerName: 'Meera Deshmukh',
    phone: '+91 97690 44556',
    device: 'MacBook Air M2 16GB / 512GB (Midnight)',
    quotedAmount: 76000,
    finalQcAmount: 76000,
    conditionStatus: 'Exact Match',
    qcTechnician: 'Pooja Varma',
    station: 'Bay #2 - Apple Mac Bay',
    assignedTime: '34m ago',
    status: 'pending',
    grade: 'A+',
    imei: 'C02GK929MD6R',
  },
  {
    id: 'app-3',
    orderNumber: 'SEL-88302',
    customerName: 'Sanjay Reddy',
    phone: '+91 99881 77665',
    device: 'Samsung Galaxy S24 Ultra (512GB, Titanium Violet)',
    quotedAmount: 82000,
    finalQcAmount: 79000,
    conditionStatus: 'Battery Degraded',
    qcTechnician: 'Vikram Joshi',
    station: 'Diagnostic Lab',
    assignedTime: '1h ago',
    status: 'pending',
    grade: 'B',
    imei: '357891238491029',
  },
  {
    id: 'app-4',
    orderNumber: 'SEL-88188',
    customerName: 'Ritu Agarwal',
    phone: '+91 98212 99881',
    device: 'Apple iPad Pro 12.9" M2 (Wi-Fi + Cellular, 256GB)',
    quotedAmount: 64000,
    finalQcAmount: 64000,
    conditionStatus: 'Exact Match',
    qcTechnician: 'Karan Mehra',
    station: 'Bay #1 - High Precision Bench',
    assignedTime: '3h ago',
    status: 'approved',
    grade: 'A+',
    imei: 'DMPQ98210341',
  },
  {
    id: 'app-5',
    orderNumber: 'SEL-88172',
    customerName: 'Harish Nair',
    phone: '+91 98450 12891',
    device: 'Sony PlayStation 5 Disc Edition + DualSense',
    quotedAmount: 32000,
    finalQcAmount: 26000,
    conditionStatus: 'Display Replaced',
    qcTechnician: 'Vikram Joshi',
    station: 'Diagnostic Lab',
    assignedTime: '5h ago',
    status: 'rejected',
    rejectionReason: 'Reported OEM disc drive non-functional; re-inspection requested.',
    grade: 'C',
    imei: 'PS5-77891240',
  },
];

export default function ManagerApprovalsPage() {
  const [items, setItems] = useState<ApprovalItem[]>(INITIAL_DATA);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [toast, setToast] = useState('');
  const [editAmount, setEditAmount] = useState<number | null>(null);

  const filtered = items.filter(item => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.orderNumber.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.device.toLowerCase().includes(q) ||
        item.qcTechnician.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApprove = (id: string, amountOverride?: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'approved',
          finalQcAmount: amountOverride ?? item.finalQcAmount,
        };
      }
      return item;
    }));
    setToast('Trade-in quote approved! Automated UPI payout dispatched to customer.');
    setSelectedItem(null);
    setEditAmount(null);
    setTimeout(() => setToast(''), 3500);
  };

  const handleReject = (id: string, reason: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'rejected',
          rejectionReason: reason || 'Manager secondary audit required.',
        };
      }
      return item;
    }));
    setToast('Order rejected. Device routed back to Technician Calibration Bench.');
    setSelectedItem(null);
    setTimeout(() => setToast(''), 3500);
  };

  const pendingCount = items.filter(i => i.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
              Operations Sign-Off Queue
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-amber-700 font-bold">{pendingCount} Awaiting Manager Action</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-amber-600" />
            High-Value Trade-In Approvals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Devices with trade-in values exceeding ₹50,000 mandate Operations Manager sign-off before instant UPI release.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Signing Authority</div>
            <div className="text-xs font-bold text-slate-800">Up to ₹2,50,000 / trade-in</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1.5 rounded-2xl w-full sm:w-auto shadow-2xs">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                filterStatus === tab
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab === 'all' ? `All Items (${items.length})` : `${tab} (${items.filter(i => i.status === tab).length})`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search order, customer, IMEI..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Main Table in White */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Order / IMEI</th>
                <th className="py-3.5 px-4">Device & Grade</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">QC Tech & Bay</th>
                <th className="py-3.5 px-4 text-right">Quoted vs Final</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900 text-xs">{item.orderNumber}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">IMEI: {item.imei}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.assignedTime}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-xs">{item.device}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        item.grade === 'A+' ? 'bg-emerald-100 text-emerald-800' :
                        item.grade === 'A' ? 'bg-blue-100 text-blue-800' :
                        item.grade === 'B' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        Grade {item.grade}
                      </span>
                      <span className="text-[10px] text-slate-500">{item.conditionStatus}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{item.customerName}</div>
                    <div className="text-[10px] text-slate-500">{item.phone}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">{item.qcTechnician}</div>
                    <div className="text-[10px] text-slate-500">{item.station}</div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="text-sm font-black text-emerald-600">
                      ₹{item.finalQcAmount.toLocaleString('en-IN')}
                    </div>
                    {item.quotedAmount !== item.finalQcAmount && (
                      <div className="text-[10px] text-slate-400 line-through">
                        ₹{item.quotedAmount.toLocaleString('en-IN')}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      item.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : item.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        title="View Full Inspection Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {item.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <ThumbsUp className="w-3 h-3" /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(item.id, 'Manager secondary inspection requested.')}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] transition flex items-center gap-1 cursor-pointer"
                          >
                            <ThumbsDown className="w-3 h-3" /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Modal in White */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-black text-amber-700">{selectedItem.orderNumber}</span>
                <h3 className="text-base font-black text-slate-900">{selectedItem.device}</h3>
              </div>
              <button
                onClick={() => { setSelectedItem(null); setEditAmount(null); }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <div className="text-slate-500">Customer</div>
                <div className="font-bold text-slate-900 mt-0.5">{selectedItem.customerName}</div>
                <div className="text-[11px] text-slate-500">{selectedItem.phone}</div>
              </div>
              <div>
                <div className="text-slate-500">Inspecting Technician</div>
                <div className="font-bold text-slate-900 mt-0.5">{selectedItem.qcTechnician}</div>
                <div className="text-[11px] text-slate-500">{selectedItem.station}</div>
              </div>
              <div>
                <div className="text-slate-500">IMEI / Serial</div>
                <div className="font-mono font-bold text-amber-800 mt-0.5">{selectedItem.imei}</div>
              </div>
              <div>
                <div className="text-slate-500">Assigned Grade</div>
                <div className="font-bold text-emerald-700 mt-0.5">Grade {selectedItem.grade} ({selectedItem.conditionStatus})</div>
              </div>
            </div>

            {/* Payout Adjustment Section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Website Initial Quote:</span>
                <span className="font-bold text-slate-700">₹{selectedItem.quotedAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Technician Final Evaluation:</span>
                <span className="font-bold text-emerald-700">₹{selectedItem.finalQcAmount.toLocaleString('en-IN')}</span>
              </div>

              {selectedItem.status === 'pending' && (
                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-[11px] text-slate-600 mb-1 font-bold">
                    Manager Quote Override (Optional):
                  </label>
                  <input
                    type="number"
                    defaultValue={selectedItem.finalQcAmount}
                    onChange={e => setEditAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {selectedItem.status === 'pending' ? (
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleApprove(selectedItem.id, editAmount || undefined)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <ThumbsUp className="w-4 h-4" /> Sign-Off & Disburse
                </button>
                <button
                  onClick={() => handleReject(selectedItem.id, 'Manager secondary inspection requested.')}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition cursor-pointer"
                >
                  Reject
                </button>
              </div>
            ) : (
              <div className="text-center py-2 text-xs font-bold text-slate-500">
                This transaction has already been {selectedItem.status}.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
