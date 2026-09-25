'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2, Users, CheckCircle2, Clock, AlertTriangle, ArrowUpRight,
  TrendingUp, Package, ShieldCheck, ChevronRight, Search, Filter,
  Phone, Mail, Calendar, UserCheck, RefreshCw, Eye, ThumbsUp, ThumbsDown,
  Warehouse, Truck, BarChart3, Bell, ArrowLeft, LogOut, User,
  CheckSquare, Activity, AlertCircle, ArrowRight
} from 'lucide-react';

interface HighValueApproval {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  device: string;
  quotedAmount: number;
  finalQcAmount: number;
  conditionStatus: 'Exact Match' | 'Minor Scratches' | 'Battery Degraded';
  qcTechnician: string;
  assignedTime: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  station: string;
  shift: string;
  tasksCompleted: number;
  status: 'on_shift' | 'break' | 'off_duty';
  avatar: string;
}

const INITIAL_APPROVALS: HighValueApproval[] = [
  {
    id: 'app-1',
    orderNumber: 'SEL-88291',
    customerName: 'Aditya Kashyap',
    phone: '+91 98201 11223',
    device: 'Apple iPhone 15 Pro Max (512GB, Natural Titanium)',
    quotedAmount: 89000,
    finalQcAmount: 87500,
    conditionStatus: 'Minor Scratches',
    qcTechnician: 'Karan Mehra (Staff #STF-104)',
    assignedTime: '12m ago',
    status: 'pending',
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
    qcTechnician: 'Pooja Varma (Staff #STF-108)',
    assignedTime: '34m ago',
    status: 'pending',
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
    qcTechnician: 'Vikram Joshi (Staff #STF-112)',
    assignedTime: '1h ago',
    status: 'pending',
  },
];

const STAFF_ROSTER: StaffMember[] = [
  { id: '1', name: 'Karan Mehra', role: 'Senior QC Specialist', station: 'Inspection Bay #1', shift: 'Morning (8AM - 4PM)', tasksCompleted: 19, status: 'on_shift', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
  { id: '2', name: 'Pooja Varma', role: 'Laptop & Mac Specialist', station: 'Inspection Bay #2', shift: 'Morning (8AM - 4PM)', tasksCompleted: 14, status: 'on_shift', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  { id: '3', name: 'Rohan Salvi', role: 'Packaging Associate', station: 'Pack & Dispatch #3', shift: 'Morning (8AM - 4PM)', tasksCompleted: 38, status: 'on_shift', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80' },
  { id: '4', name: 'Vikram Joshi', role: 'Hardware Diagnostic Tech', station: 'Diagnostic Lab', shift: 'Morning (8AM - 4PM)', tasksCompleted: 16, status: 'break', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { id: '5', name: 'Neha Chhabra', role: 'Dispatch Lead', station: 'Logistics Dock', shift: 'Morning (8AM - 4PM)', tasksCompleted: 44, status: 'on_shift', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' },
];

export default function ManagerDashboard() {
  const [selectedHub, setSelectedHub] = useState('Mumbai Central Hub (Andheri East)');
  const [approvals, setApprovals] = useState<HighValueApproval[]>(INITIAL_APPROVALS);
  const [toast, setToast] = useState('');

  const handleApprove = (id: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
    setToast('Order approved for instant customer UPI disbursement!');
    setTimeout(() => setToast(''), 3000);
  };

  const handleReject = (id: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
    setToast('Order sent back for secondary QC calibration.');
    setTimeout(() => setToast(''), 3000);
  };

  const pendingApprovalsCount = approvals.filter(a => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-12 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Hub Header & Status Bar in White */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
              Hub Command Center
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Shift Active: Morning 08:00 - 16:00</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Operations & Warehouse Control
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise intake throughput, technician productivity, and high-value trade-in payouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-slate-700">
            <Warehouse className="w-4 h-4 text-amber-600" />
            <select
              value={selectedHub}
              onChange={e => setSelectedHub(e.target.value)}
              className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="Mumbai Central Hub (Andheri East)">Mumbai Central Hub (Andheri East)</option>
              <option value="Bengaluru South Hub (Koramangala)">Bengaluru South Hub (Koramangala)</option>
              <option value="Delhi NCR Logistics Hub (Gurugram)">Delhi NCR Logistics Hub (Gurugram)</option>
            </select>
          </div>

          <Link
            href="/manager/approvals"
            className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-sm shadow-amber-500/20"
          >
            Review Approvals ({pendingApprovalsCount})
          </Link>
        </div>
      </div>

      {/* Key Hub KPI Cards in White */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Intake Today</span>
            <Package className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">128 Units</div>
          <div className="mt-1 flex items-center text-[11px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5 mr-1" /> +14.2% vs yesterday
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">High-Value Queue</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600">{pendingApprovalsCount} Awaiting</div>
          <div className="mt-1 text-[11px] text-slate-500">
            Total liability: ₹2,42,500
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Staff on Duty</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">14 / 16</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold">
            87.5% Station occupancy
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">QC Pass SLA</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600">98.4%</div>
          <div className="mt-1 text-[11px] text-slate-500">
            Avg test turnaround: 11m
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards to Subpages in White */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/manager/approvals"
          className="group p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-800 transition flex items-center gap-1.5">
              High-Value Approvals
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition text-amber-600" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Verify devices quoted above ₹50,000, calibrate technician deductions, and release instant UPI disbursements.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
            <span>{pendingApprovalsCount} Pending Authorization</span>
            <span className="text-[10px] text-slate-400">Go to Queue &rarr;</span>
          </div>
        </Link>

        <Link
          href="/manager/staff"
          className="group p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-800 transition flex items-center gap-1.5">
              Staff Shifts & Roster
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition text-blue-600" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Monitor technician station allocation, daily completed inspections, shift breaks, and testing speed.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
            <span>8 Active Technicians</span>
            <span className="text-[10px] text-slate-400">View Roster &rarr;</span>
          </div>
        </Link>

        <Link
          href="/manager/inventory"
          className="group p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <Warehouse className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800 transition flex items-center gap-1.5">
              Stock & Safety Thresholds
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition text-emerald-600" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Manage Grade A+/B/C refurbished bins, packaging safety materials, and flag automated restocking triggers.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>2 Critical Reorders</span>
            <span className="text-[10px] text-slate-400">Manage Stock &rarr;</span>
          </div>
        </Link>
      </div>

      {/* Live Approval Section Preview in White */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              High-Value Trade-In Approvals (&gt; ₹50,000)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Immediate manager sign-off required prior to automated customer UPI credit disbursement.
            </p>
          </div>
          <Link
            href="/manager/approvals"
            className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
          >
            Full Table <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {approvals.map(approval => (
            <div key={approval.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-amber-700">{approval.orderNumber}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-bold text-slate-900">{approval.customerName}</span>
                  <span className="text-xs text-slate-500">({approval.phone})</span>
                </div>
                <div className="text-xs font-medium text-slate-700">{approval.device}</div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                  <span>QC Tech: <strong className="text-slate-700">{approval.qcTechnician}</strong></span>
                  <span>•</span>
                  <span>Condition: <span className="text-amber-800 font-semibold">{approval.conditionStatus}</span></span>
                  <span>•</span>
                  <span>Received: {approval.assignedTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-center">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Final Approved Quote</div>
                  <div className="text-base font-black text-emerald-600">₹{approval.finalQcAmount.toLocaleString('en-IN')}</div>
                  {approval.quotedAmount !== approval.finalQcAmount && (
                    <div className="text-[10px] text-slate-400 line-through">₹{approval.quotedAmount.toLocaleString('en-IN')}</div>
                  )}
                </div>

                {approval.status === 'pending' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(approval.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(approval.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                ) : (
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider ${
                    approval.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}>
                    {approval.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Bench Overview in White */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            Station Manning & Live Shift Roster
          </h3>
          <Link
            href="/manager/staff"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            Manage All Staff <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STAFF_ROSTER.slice(0, 3).map(staff => (
            <div key={staff.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <img
                src={staff.avatar}
                alt={staff.name}
                className="w-10 h-10 rounded-xl object-cover border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900 truncate">{staff.name}</div>
                  <span className={`w-2 h-2 rounded-full ${staff.status === 'on_shift' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </div>
                <div className="text-[11px] text-slate-500 truncate">{staff.station}</div>
                <div className="text-[10px] text-amber-700 font-bold mt-0.5">{staff.tasksCompleted} units inspected today</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
