'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users, UserCheck, Clock, ShieldCheck, Award, ArrowUpRight,
  Filter, Search, CheckCircle2, AlertCircle, Phone, Mail,
  Calendar, Building2, UserPlus, RefreshCw
} from 'lucide-react';

interface StaffTech {
  id: string;
  name: string;
  employeeCode: string;
  role: string;
  station: string;
  shift: string;
  tasksCompleted: number;
  accuracyRate: string;
  avgTimePerUnit: string;
  status: 'on_shift' | 'break' | 'off_duty';
  avatar: string;
  contact: string;
}

const INITIAL_STAFF: StaffTech[] = [
  {
    id: '1',
    name: 'Karan Mehra',
    employeeCode: 'STF-104',
    role: 'Senior QC Specialist',
    station: 'Bay #1 - High Precision Bench',
    shift: 'Morning (08:00 - 16:00)',
    tasksCompleted: 23,
    accuracyRate: '99.4%',
    avgTimePerUnit: '10.5 mins',
    status: 'on_shift',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    contact: '+91 98201 44332',
  },
  {
    id: '2',
    name: 'Pooja Varma',
    employeeCode: 'STF-108',
    role: 'Laptop & Mac Specialist',
    station: 'Bay #2 - Apple Mac Lab',
    shift: 'Morning (08:00 - 16:00)',
    tasksCompleted: 16,
    accuracyRate: '98.8%',
    avgTimePerUnit: '14.2 mins',
    status: 'on_shift',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    contact: '+91 97690 12890',
  },
  {
    id: '3',
    name: 'Rohan Salvi',
    employeeCode: 'STF-110',
    role: 'Packaging Associate',
    station: 'Pack & Dispatch #3',
    shift: 'Morning (08:00 - 16:00)',
    tasksCompleted: 42,
    accuracyRate: '100%',
    avgTimePerUnit: '4.8 mins',
    status: 'on_shift',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    contact: '+91 99881 22345',
  },
  {
    id: '4',
    name: 'Vikram Joshi',
    employeeCode: 'STF-112',
    role: 'Hardware Diagnostic Tech',
    station: 'Diagnostic Lab',
    shift: 'Morning (08:00 - 16:00)',
    tasksCompleted: 19,
    accuracyRate: '97.9%',
    avgTimePerUnit: '11.8 mins',
    status: 'break',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    contact: '+91 98112 33441',
  },
  {
    id: '5',
    name: 'Neha Chhabra',
    employeeCode: 'STF-115',
    role: 'Logistics Dock Lead',
    station: 'Intake Bay #4',
    shift: 'Morning (08:00 - 16:00)',
    tasksCompleted: 48,
    accuracyRate: '99.8%',
    avgTimePerUnit: '3.5 mins',
    status: 'on_shift',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    contact: '+91 98220 55667',
  },
  {
    id: '6',
    name: 'Amitabh Sen',
    employeeCode: 'STF-120',
    role: 'Display & Glass Technician',
    station: 'Micro-Soldering Station',
    shift: 'Evening (16:00 - 00:00)',
    tasksCompleted: 0,
    accuracyRate: '99.1%',
    avgTimePerUnit: '18.0 mins',
    status: 'off_duty',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    contact: '+91 99203 11899',
  },
];

export default function ManagerStaffPage() {
  const [staffList, setStaffList] = useState<StaffTech[]>(INITIAL_STAFF);
  const [statusFilter, setStatusFilter] = useState<'all' | 'on_shift' | 'break' | 'off_duty'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState('');

  const filtered = staffList.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.employeeCode.toLowerCase().includes(q) ||
        s.station.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleStatus = (id: string) => {
    setStaffList(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus: StaffTech['status'] =
          s.status === 'on_shift' ? 'break' : s.status === 'break' ? 'on_shift' : 'on_shift';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
    setToast('Technician status updated!');
    setTimeout(() => setToast(''), 2500);
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

      {/* Header in White */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-300">
              Shift Roster & Stations
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-emerald-700 font-bold">
              {staffList.filter(s => s.status === 'on_shift').length} Active Technicians on Floor
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Operations Staff & Bench Roster
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise testing bay allocations, break rotations, and daily technician unit throughput.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setToast('Shift attendance sync completed with biometrics terminal.');
              setTimeout(() => setToast(''), 2500);
            }}
            className="px-4 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer border border-slate-200 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sync Biometric Punch
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1.5 rounded-2xl w-full sm:w-auto shadow-2xs">
          {(['all', 'on_shift', 'break', 'off_duty'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                statusFilter === tab
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.replace('_', ' ')} ({tab === 'all' ? staffList.length : staffList.filter(s => s.status === tab).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by technician name, ID, bay..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Staff Grid in White */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(staff => (
          <div
            key={staff.id}
            className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <img
                src={staff.avatar}
                alt={staff.name}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 truncate">{staff.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    staff.status === 'on_shift'
                      ? 'bg-emerald-100 text-emerald-800'
                      : staff.status === 'break'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {staff.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">{staff.role} • <span className="font-mono text-slate-700">{staff.employeeCode}</span></div>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Assigned Station:</span>
                <span className="font-bold text-slate-800">{staff.station}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Shift Schedule:</span>
                <span className="text-slate-700">{staff.shift}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Tested Units Today:</span>
                <span className="font-black text-amber-700">{staff.tasksCompleted} devices</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Accuracy & Speed:</span>
                <span className="text-emerald-700 font-bold">{staff.accuracyRate} ({staff.avgTimePerUnit})</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => toggleStatus(staff.id)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                {staff.status === 'on_shift' ? 'Log Break' : 'Resume Shift'}
              </button>
              <a
                href={`tel:${staff.contact}`}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition"
                title={`Call ${staff.contact}`}
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
