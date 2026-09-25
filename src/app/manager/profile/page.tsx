'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2, User, Mail, Phone, ShieldCheck, MapPin, Award,
  Calendar, Clock, CheckCircle2, Save, ArrowLeft, ChevronRight,
  Briefcase, Key, Users, AlertCircle, Laptop, Lock, Shield
} from 'lucide-react';

export default function ManagerProfilePage() {
  const [managerName, setManagerName] = useState('Vikramaditya Rao');
  const [managerEmail, setManagerEmail] = useState('manager@selbar.com');
  const [managerPhone, setManagerPhone] = useState('+91 98204 88771');
  const [hubLocation, setHubLocation] = useState('Mumbai Central Hub (Andheri East)');
  const [department, setDepartment] = useState('Warehouse & Quality Operations');
  const [employeeId, setEmployeeId] = useState('#MGR-4401');
  const [signingLimit, setSigningLimit] = useState('₹2,50,000 per transaction');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setToast('Manager profile and security thresholds saved successfully!');
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
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80"
              alt="Manager Avatar"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="On Shift" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-black text-slate-900">{managerName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Operations & Hub Manager
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                ON DUTY
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">{department} • {employeeId}</p>

            <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 flex-wrap">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-600" /> {hubLocation}</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Executive Clearance Level 3</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-600" /> Morning Shift (08:00 - 16:00 IST)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/manager"
            className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-sm shadow-amber-500/20"
          >
            Hub Dashboard &rarr;
          </Link>
        </div>
      </div>

      {/* Grid in White */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-600" /> Official Manager Credentials
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Designated operational identity and escalation parameters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={managerName}
                  onChange={e => setManagerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  value={managerEmail}
                  onChange={e => setManagerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Mobile / Escalations</label>
                <input
                  type="text"
                  value={managerPhone}
                  onChange={e => setManagerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Central Hub</label>
                <input
                  type="text"
                  value={hubLocation}
                  onChange={e => setHubLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Single Approval Authority Cap</label>
                <input
                  type="text"
                  value={signingLimit}
                  onChange={e => setSigningLimit(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-emerald-700 font-bold text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" /> {isSaving ? 'Saving Changes...' : 'Save Profile Settings'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Jurisdiction & Clearances */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Operational Authorizations
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Instant UPI Disbursement</div>
                  <div className="text-[10px] text-slate-500">Direct Razorpay/Cashfree payout sign-off</div>
                </div>
                <span className="text-emerald-700 font-black">ACTIVE</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Device Grading Override</div>
                  <div className="text-[10px] text-slate-500">Can override technician QC deduction</div>
                </div>
                <span className="text-emerald-700 font-black">AUTHORIZED</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">E-Waste Scrap Clearance</div>
                  <div className="text-[10px] text-slate-500">Disposal batch sign-off for hazardous units</div>
                </div>
                <span className="text-emerald-700 font-black">AUTHORIZED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
