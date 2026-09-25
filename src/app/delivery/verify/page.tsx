'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Smartphone, CheckCircle2, ShieldCheck, Check, X, RefreshCw,
  Zap, Lock, AlertTriangle, ArrowLeft, Camera, Phone, MapPin
} from 'lucide-react';

export default function DeliveryVerifyPage() {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [toast, setToast] = useState('');
  const [checklist, setChecklist] = useState({
    modelMatch: false,
    displayTouch: false,
    bodyScratches: false,
    cameraOperational: false,
    icloudLoggedOut: false,
    tamperBagSealed: false,
  });

  const [deviceInfo] = useState({
    orderNumber: 'PU-77101',
    customerName: 'Rohit Verma',
    phone: '+91 98200 45678',
    address: 'Flat 402, Sea Green Apts, Juhu Tara Road, Mumbai',
    device: 'Apple iPhone 13 (128GB, Starlight)',
    expectedPrice: 38500,
    validOtp: '4829',
    tamperBagNumber: 'TP-992014',
  });

  const [paymentDone, setPaymentDone] = useState(false);
  const allChecked = Object.values(checklist).every(Boolean);

  const handleVerifyAndPayout = () => {
    if (otp !== deviceInfo.validOtp) {
      setToast('Invalid OTP! Please cross-check with the customer.');
      setTimeout(() => setToast(''), 3000);
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setPaymentDone(true);
      setToast(`Instant UPI Disbursement of ₹${deviceInfo.expectedPrice.toLocaleString('en-IN')} Successful!`);
      setTimeout(() => setToast(''), 4000);
    }, 1200);
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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
              Active Doorstep Inspection
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-mono">Order {deviceInfo.orderNumber}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-emerald-600" />
            Doorstep OTP Verification & Instant Payout
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Conduct 6-point physical verification, seal unit in anti-tamper bag, and enter customer OTP to release cash.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${deviceInfo.phone}`}
            className="px-4 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" /> Call Customer
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Device & Customer Info in White */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Customer & Device Summary
            </h2>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div>
                <span className="text-slate-500">Customer Name:</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{deviceInfo.customerName}</div>
                <div className="text-[11px] text-slate-500">{deviceInfo.phone}</div>
              </div>

              <div>
                <span className="text-slate-500">Pickup Address:</span>
                <div className="text-slate-700 mt-0.5 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{deviceInfo.address}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500">Device Model:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{deviceInfo.device}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Cash Payout:</span>
                  <div className="font-black text-emerald-600 text-base">
                    ₹{deviceInfo.expectedPrice.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Tamper Pouch ID assigned: <strong>{deviceInfo.tamperBagNumber}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Inspection Checklist & OTP Form in White */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Physical Inspection Checklist
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {[
                { key: 'modelMatch', label: 'Device Model Matches Quote' },
                { key: 'displayTouch', label: 'Touch Screen Responsive' },
                { key: 'bodyScratches', label: 'Body Condition Verified' },
                { key: 'cameraOperational', label: 'Front & Rear Cameras Working' },
                { key: 'icloudLoggedOut', label: 'iCloud / Google FRP Signed Out' },
                { key: 'tamperBagSealed', label: 'Sealed Inside Tamper Bag' },
              ].map(item => {
                const isChecked = (checklist as any)[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => setChecklist({ ...checklist, [item.key]: !isChecked })}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-400 text-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${
                      isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="font-bold text-xs truncate">{item.label}</span>
                  </div>
                );
              })}
            </div>

            {paymentDone ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <div className="text-base font-black text-slate-900">Payment Credited Instantly</div>
                <p className="text-xs text-slate-600">
                  Transaction ID: <span className="font-mono text-emerald-700 font-bold">UPI-REF-99210488219</span>
                </p>
                <div className="pt-2">
                  <Link
                    href="/delivery"
                    className="inline-block px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm"
                  >
                    Return to Run Sheet &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label className="font-bold text-slate-700">Enter Customer 4-Digit Pickup OTP</label>
                    <span className="text-[11px] text-slate-500 font-mono">Demo OTP: {deviceInfo.validOtp}</span>
                  </div>
                  <input
                    type="text"
                    maxLength={4}
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="e.g. 4829"
                    className="w-full text-center tracking-widest text-2xl font-mono font-black py-3 rounded-2xl border border-slate-300 bg-white text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  onClick={handleVerifyAndPayout}
                  disabled={otp.length !== 4 || !allChecked || isVerifying}
                  className={`w-full py-3.5 rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                    otp.length === 4 && allChecked && !isVerifying
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Disbursing UPI Payment...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Verify OTP & Disburse ₹{deviceInfo.expectedPrice.toLocaleString('en-IN')}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
