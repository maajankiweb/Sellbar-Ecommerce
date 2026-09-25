'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck, CheckCircle2, Clock, MapPin, Phone, AlertTriangle,
  Navigation, Shield, Check, X, ArrowRight, User, RefreshCw,
  QrCode, Award, DollarSign, Smartphone, ChevronRight, Zap,
  History, CheckSquare
} from 'lucide-react';

interface PickupTrip {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  pincode: string;
  slot: string;
  device: string;
  expectedPrice: number;
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
  otp: string;
}

const TODAY_PICKUPS: PickupTrip[] = [
  {
    id: 'p-1',
    orderNumber: 'PU-77101',
    customerName: 'Rohit Verma',
    phone: '+91 98200 45678',
    address: 'Flat 402, Sea Green Apts, Juhu Tara Road, Mumbai',
    pincode: '400049',
    slot: 'Morning (09:00 - 13:00)',
    device: 'Apple iPhone 13 (128GB, Starlight)',
    expectedPrice: 38500,
    status: 'in_transit',
    otp: '4829',
  },
  {
    id: 'p-2',
    orderNumber: 'PU-77102',
    customerName: 'Ananya Sen',
    phone: '+91 98700 12345',
    address: 'B-12, Lokhandwala Complex, Andheri West, Mumbai',
    pincode: '400053',
    slot: 'Afternoon (13:00 - 17:00)',
    device: 'OnePlus 10 Pro (256GB, Volcanic Black)',
    expectedPrice: 24000,
    status: 'pending',
    otp: '9182',
  },
  {
    id: 'p-3',
    orderNumber: 'PU-77103',
    customerName: 'Deepak Merchant',
    phone: '+91 99200 88990',
    address: 'Plot 88, SV Road, Bandra West, Mumbai',
    pincode: '400050',
    slot: 'Evening (17:00 - 20:00)',
    device: 'Samsung Galaxy S22 Ultra (256GB, Burgundy)',
    expectedPrice: 42000,
    status: 'pending',
    otp: '3319',
  },
];

export default function DeliveryDashboard() {
  const [pickups, setPickups] = useState<PickupTrip[]>(TODAY_PICKUPS);
  const [activePickup, setActivePickup] = useState<PickupTrip | null>(TODAY_PICKUPS[0]);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [toast, setToast] = useState('');

  const completedCount = pickups.filter(p => p.status === 'completed').length;
  const totalPayout = pickups.reduce((acc, p) => p.status === 'completed' ? acc + p.expectedPrice : acc, 0);

  const handleVerifyOtpAndPayout = () => {
    if (!activePickup) return;
    if (enteredOtp !== activePickup.otp) {
      setToast('Incorrect OTP! Please ask customer for the 4-digit SMS OTP.');
      setTimeout(() => setToast(''), 3000);
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setPickups(prev => prev.map(p => p.id === activePickup.id ? { ...p, status: 'completed' } : p));
      setActivePickup({ ...activePickup, status: 'completed' });
      setIsVerifying(false);
      setToast(`Verified! ₹${activePickup.expectedPrice.toLocaleString('en-IN')} instantly credited to customer account via UPI.`);
      setTimeout(() => setToast(''), 4000);
    }, 1200);
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

      {/* Header in White */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
              Field Operations Run Sheet
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Executive: Rajesh Shinde (#DEL-902)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Doorstep Buyback & Pickups
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Conduct doorstep diagnostics, verify customer OTP, and release instant UPI payment on the spot.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/delivery/verify"
            className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center gap-1.5 shadow-sm shadow-emerald-600/20"
          >
            Doorstep OTP Bench &rarr;
          </Link>
        </div>
      </div>

      {/* Metric Cards in White */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs font-bold text-slate-500">Assigned Pickups</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{pickups.length} Visits</div>
          <div className="text-[10px] text-emerald-700 mt-1">Route: Western Suburbs Mumbai</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs font-bold text-slate-500">Completed & Disbursed</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{completedCount} of {pickups.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">100% on-time SLA</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs font-bold text-slate-500">Cash Disbursed Today</div>
          <div className="text-2xl font-black text-slate-900 mt-1">₹{totalPayout.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-cyan-700 mt-1">Direct customer UPI escrow</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs font-bold text-slate-500">Daily Fuel & Incentive</div>
          <div className="text-2xl font-black text-amber-600 mt-1">₹850</div>
          <div className="text-[10px] text-slate-500 mt-1">₹350 fuel + ₹500 completion bonus</div>
        </div>
      </div>

      {/* Quick Navigation to Subpages in White */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/delivery/verify"
          className="group p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800 transition flex items-center gap-1.5">
              Doorstep OTP & Verification
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition text-emerald-600" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Verify customer 4-digit OTP, inspect physical condition against quote, and initiate immediate bank UPI payout.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-700">
            Verify Active Device &rarr;
          </div>
        </Link>

        <Link
          href="/delivery/payouts"
          className="group p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-800 transition flex items-center gap-1.5">
              Instant Payouts & Daily Ledger
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition text-amber-600" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Real-time ledger of completed customer settlements, instant UPI transaction IDs, and daily travel allowance.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-amber-700">
            View Earnings & Payouts &rarr;
          </div>
        </Link>

        <Link
          href="/delivery/history"
          className="group p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
              <History className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-800 transition flex items-center gap-1.5">
              Completed Run Receipts
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition text-blue-600" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Historical archive of customer handovers, tamper seal serial numbers, digital signatures, and route maps.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-blue-700">
            Browse Run Archives &rarr;
          </div>
        </Link>
      </div>

      {/* Main Pickups Sheet in White */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Route Pickups */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-600" />
              Scheduled Doorstep Stops
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">Today: Mumbai Western Route</span>
          </div>

          <div className="space-y-3">
            {pickups.map(pickup => (
              <div
                key={pickup.id}
                onClick={() => { setActivePickup(pickup); setEnteredOtp(''); }}
                className={`p-4 rounded-2xl border transition cursor-pointer relative overflow-hidden ${
                  activePickup?.id === pickup.id
                    ? 'bg-emerald-50 border-emerald-400 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-emerald-700 font-bold">{pickup.orderNumber}</span>
                    <h3 className="text-xs font-bold text-slate-900 mt-0.5">{pickup.customerName}</h3>
                    <div className="text-[11px] text-slate-600 font-medium mt-1">{pickup.device}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-600">
                      ₹{pickup.expectedPrice.toLocaleString('en-IN')}
                    </span>
                    <div className="text-[10px] text-slate-400 uppercase mt-0.5">UPI Payout</div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {pickup.address}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                    pickup.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : pickup.status === 'in_transit'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {pickup.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick OTP Verification & Customer Payout Card */}
        <div className="lg:col-span-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Doorstep Verification Desk</span>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  {activePickup ? activePickup.customerName : 'Select a Stop'}
                </h2>
              </div>
              {activePickup && (
                <a
                  href={`tel:${activePickup.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> Call Customer
                </a>
              )}
            </div>

            {activePickup ? (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Device Model:</span>
                    <span className="font-bold text-slate-900">{activePickup.device}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Agreed Cashfree Quote:</span>
                    <span className="font-black text-emerald-600 text-sm">₹{activePickup.expectedPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Customer Address:</span>
                    <span className="text-slate-700 text-right">{activePickup.address}</span>
                  </div>
                </div>

                {activePickup.status === 'completed' ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <div className="text-sm font-black text-slate-900">Payment Disbursed Successfully</div>
                    <p className="text-xs text-slate-600">
                      ₹{activePickup.expectedPrice.toLocaleString('en-IN')} credited to customer UPI ID. Device secured inside tamper bag #TP-{activePickup.orderNumber}.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <label className="font-bold text-slate-700">Enter Customer 4-Digit Pickup OTP</label>
                        <span className="text-[11px] text-slate-500 font-mono">Demo OTP: {activePickup.otp}</span>
                      </div>
                      <input
                        type="text"
                        maxLength={4}
                        value={enteredOtp}
                        onChange={e => setEnteredOtp(e.target.value)}
                        placeholder="e.g. 4829"
                        className="w-full text-center tracking-widest text-2xl font-mono font-black py-3 rounded-2xl border border-slate-300 bg-white text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <button
                      onClick={handleVerifyOtpAndPayout}
                      disabled={enteredOtp.length !== 4 || isVerifying}
                      className={`w-full py-3.5 rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                        enteredOtp.length === 4 && !isVerifying
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Processing UPI Payment...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          Verify OTP & Release ₹{activePickup.expectedPrice.toLocaleString('en-IN')} Payout
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <Truck className="w-12 h-12 mx-auto text-slate-300" />
                <div className="text-xs font-semibold text-slate-600">Select a doorstep stop to verify</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
