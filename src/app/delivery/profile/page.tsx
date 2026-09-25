'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck, User, Mail, Phone, Award, ShieldCheck, MapPin,
  Calendar, Clock, CheckCircle2, Save, ArrowLeft, ChevronRight,
  Navigation, DollarSign, Smartphone, CreditCard, Briefcase
} from 'lucide-react';

export default function DeliveryProfilePage() {
  const [partnerName, setPartnerName] = useState('Rajesh Shinde');
  const [partnerPhone, setPartnerPhone] = useState('+91 98200 45678');
  const [partnerEmail, setPartnerEmail] = useState('delivery@selbar.com');
  const [vehicleNumber, setVehicleNumber] = useState('MH 02 CZ 4492 (Honda Activa 6G)');
  const [assignedZone, setAssignedZone] = useState('Mumbai West Corridor (400049, 400050, 400053, 400058)');
  const [payoutUpi, setPayoutUpi] = useState('rajesh.shinde@okhdfcbank');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setToast('Delivery executive profile & payout details updated successfully!');
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

      {/* Hero Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
              alt="Delivery Partner Avatar"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-300 shadow-sm"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="On Duty" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-black text-slate-900">{partnerName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                Doorstep Field Executive
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                ON ACTIVE RUN
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Field Logistics Fleet • #DEL-902</p>

            <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 flex-wrap">
              <span className="flex items-center gap-1.5"><Navigation className="w-3.5 h-3.5 text-emerald-600" /> {assignedZone}</span>
              <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-amber-500" /> 4.96 ★ Doorstep Rating (524 Trips)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/delivery"
            className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center gap-1.5 shadow-xs"
          >
            Run Sheet &rarr;
          </Link>
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" /> Executive Profile & Operational Vehicle
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Official credentials, vehicle registration, and doorstep payout UPI coordinate.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={e => setPartnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Mobile (For Customer Calls)</label>
                <input
                  type="text"
                  value={partnerPhone}
                  onChange={e => setPartnerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Registered Vehicle Details</label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={e => setVehicleNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Personal Incentive UPI VPA</label>
                <input
                  type="text"
                  value={payoutUpi}
                  onChange={e => setPayoutUpi(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-emerald-600 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Corridor & Pincodes</label>
                <input
                  type="text"
                  value={assignedZone}
                  onChange={e => setAssignedZone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> KYC & Background Verification
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Driving License</div>
                  <div className="text-[10px] text-slate-500">MH-02-2018-0091823</div>
                </div>
                <span className="text-emerald-700 font-black">VERIFIED</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Police Clearance Certificate</div>
                  <div className="text-[10px] text-slate-500">Clean criminal background check</div>
                </div>
                <span className="text-emerald-700 font-black">CLEARED</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Device Diagnostics Training</div>
                  <div className="text-[10px] text-slate-500">SELBAR Level 1 Field Cert</div>
                </div>
                <span className="text-emerald-700 font-black">CERTIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
