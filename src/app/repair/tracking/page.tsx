'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Wrench, ShieldCheck } from 'lucide-react';
import { LiveTechnicianTracker } from '@/components/repair/LiveTechnicianTracker';

export default function RepairTrackingPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link
            href="/repair"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Repair Services
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Live Doorstep Technician Dispatch
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-800">
              Live ETA
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time GPS vehicle coordinates and estimated time of arrival for your confirmed repair appointment.
          </p>
        </div>

        <LiveTechnicianTracker
          orderNumber="REP-99214"
          customerAddress="Station Road, Bettiah, West Champaran (845438)"
          serviceType="Doorstep Screen Replacement (OEM Grade-A)"
        />
      </div>
    </div>
  );
}
