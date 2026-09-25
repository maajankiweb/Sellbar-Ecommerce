'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wrench, User, Mail, Phone, Award, ShieldCheck, MapPin,
  Calendar, Clock, CheckCircle2, Save, ArrowLeft, ChevronRight,
  Briefcase, Check, Sparkles
} from 'lucide-react';

export default function StaffProfilePage() {
  const [staffName, setStaffName] = useState('Karan Mehra');
  const [staffEmail, setStaffEmail] = useState('staff@selbar.com');
  const [staffPhone, setStaffPhone] = useState('+91 98205 33221');
  const [station, setStation] = useState('Inspection Bay #1 (Smartphones & Tablets)');
  const [employeeId] = useState('#STF-104');
  const [hub] = useState('Mumbai Central Logistics Hub');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setToast('Staff profile and station credentials updated!');
      setTimeout(() => setToast(''), 3000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-12 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Hero Card in White */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"
              alt="Staff Avatar"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="On Shift" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-black text-slate-900">{staffName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-900 border border-cyan-300">
                Senior QC Technician
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                ACTIVE
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">{station} • {employeeId}</p>

            <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 flex-wrap">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-cyan-600" /> {hub}</span>
              <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-amber-600" /> Apple ACiT Certified (Level 2)</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-600" /> Shift: 08:00 - 16:00 IST</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/staff"
            className="px-4 py-2 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black transition flex items-center gap-1.5 shadow-sm shadow-cyan-600/20"
          >
            Testing Queue &rarr;
          </Link>
        </div>
      </div>

      {/* Profile Form & Credentials in White */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-600" /> Technician Profile Information
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Operational identity and station credentials recorded on digital audit tags.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={staffName}
                  onChange={e => setStaffName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Email</label>
                <input
                  type="email"
                  value={staffEmail}
                  onChange={e => setStaffEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={staffPhone}
                  onChange={e => setStaffPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Station Bay</label>
                <input
                  type="text"
                  value={station}
                  onChange={e => setStation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs transition flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Professional Certifications
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Apple ACiT Certified</div>
                  <div className="text-[10px] text-slate-500">iOS & macOS Diagnostics 2024</div>
                </div>
                <span className="text-emerald-700 font-black">VALID</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Samsung STAR Level 2</div>
                  <div className="text-[10px] text-slate-500">Galaxy Display & Logic Board Repair</div>
                </div>
                <span className="text-emerald-700 font-black">VALID</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">ESD Static Safety Lead</div>
                  <div className="text-[10px] text-slate-500">ANSI/ESD S20.20 Protocol Compliance</div>
                </div>
                <span className="text-emerald-700 font-black">VALID</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
