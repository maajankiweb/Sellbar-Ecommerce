'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building, User, Mail, Phone, Award, ShieldCheck, MapPin,
  Calendar, Clock, CheckCircle2, Save, ArrowLeft, ChevronRight,
  Briefcase, CreditCard, Store, Check, Sparkles
} from 'lucide-react';

export default function SellerProfilePage() {
  const [storeName, setStoreName] = useState('Apex Refurbished Tech Hub');
  const [ownerName, setOwnerName] = useState('Sameer Chawla');
  const [contactEmail, setContactEmail] = useState('seller@selbar.com');
  const [contactPhone, setContactPhone] = useState('+91 98211 99882');
  const [gstin, setGstin] = useState('27AAACA9921D1Z8');
  const [warehouseAddress, setWarehouseAddress] = useState('Gala #14, Royal Industrial Estate, Sakinaka, Andheri East, Mumbai - 400072');
  const [settlementBank, setSettlementBank] = useState('HDFC Bank • Account ending in 9842 • IFSC: HDFC0000240');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setToast('Merchant business profile and settlement coordinates updated!');
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
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-600 font-black text-2xl shadow-xs shrink-0">
            <Store className="w-10 h-10" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-black text-slate-900">{storeName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
                Verified Recommerce Partner
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                TIER 1 SELLER
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Authorized Merchant #{gstin.slice(-8)} • Managed by {ownerName}</p>

            <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 flex-wrap">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-600" /> {contactEmail}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-blue-600" /> {contactPhone}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-blue-600" /> Mumbai Logistics Hub</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/seller"
            className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            Seller Central &rarr;
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" /> Business Entity & GST Coordinates
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Official entity information used for legal tax invoicing and weekly bank disbursements.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Store / Merchant Trade Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Authorized Representative</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official GSTIN Number</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={e => setGstin(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono text-emerald-600 font-bold text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Settlement Bank Coordinates</label>
                <input
                  type="text"
                  value={settlementBank}
                  onChange={e => setSettlementBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Courier Pickup & Warehouse Address</label>
                <textarea
                  rows={2}
                  value={warehouseAddress}
                  onChange={e => setWarehouseAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Merchant Settings'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Platform Tier & Privileges
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">SELBAR Certified Shield</div>
                  <div className="text-[10px] text-slate-500">1-Year warranty badging on listings</div>
                </div>
                <span className="text-emerald-700 font-black">ACTIVE</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Priority Courier Dispatch</div>
                  <div className="text-[10px] text-slate-500">Same-day BlueDart air pickups</div>
                </div>
                <span className="text-emerald-700 font-black">ENABLED</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Discounted Commission Tier</div>
                  <div className="text-[10px] text-slate-500">7.0% Flat fee across Apple & Samsung</div>
                </div>
                <span className="text-emerald-700 font-black">LOCKED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
