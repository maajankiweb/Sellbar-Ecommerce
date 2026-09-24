'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, QrCode, Smartphone, CreditCard, Lock, X, RefreshCw } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  method: 'UPI' | 'Credit/Debit Card' | 'NetBanking' | 'Cash on Delivery';
  amount: number;
  phoneNumber: string;
  customerName: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  method,
  amount,
  phoneNumber,
  customerName,
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('892');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  if (!isOpen) return null;

  const handleCodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setOtpError('Please enter the 4-digit OTP');
      return;
    }
    // Accept 4321 or any 4 digit code for testing
    if (otp.length < 4) {
      setOtpError('OTP must be 4 digits');
      return;
    }
    setLoading(true);
    setOtpError('');
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1200);
  };

  const handleOnlinePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200/80 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight">
                {method === 'Cash on Delivery' ? 'COD Verification' : 'SELBAR Secure Gateway'}
              </h3>
              <p className="text-[11px] text-emerald-100 font-medium">
                256-bit Bank Grade Encrypted Payment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Pill */}
        <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-xs font-semibold text-emerald-900">
          <span>Amount Payable:</span>
          <span className="text-base font-black text-emerald-700">₹{amount.toLocaleString('en-IN')}</span>
        </div>

        {/* Body based on payment method */}
        <div className="p-6 space-y-5">
          {method === 'Cash on Delivery' && (
            <form onSubmit={handleCodSubmit} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-amber-200">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Confirm Cash on Delivery</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Doorstep contact: <strong className="text-slate-800 font-bold">+91 {phoneNumber}</strong>. 4-digit order confirmation code has been dispatched to your registered email.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 block mb-1">Sandbox Demo OTP:</span>
                <span className="text-sm font-mono font-bold tracking-widest text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-md">
                  4321
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                  Enter 4-Digit Confirmation Code
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • •"
                  className="w-full text-center tracking-widest text-xl font-black py-2.5 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:outline-none"
                  autoFocus
                />
                {otpError && (
                  <p className="text-xs text-rose-600 text-center mt-1 font-medium">{otpError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm COD Order</span>
                  </>
                )}
              </button>
            </form>
          )}

          {method === 'UPI' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Scan QR or Pay with UPI App</h4>
                <p className="text-xs text-slate-500">Scan using Google Pay, PhonePe, Paytm, or BHIM</p>
              </div>

              {/* Dynamic QR Box */}
              <div className="flex justify-center">
                <div className="p-3 bg-white rounded-2xl border-2 border-emerald-500/40 shadow-md inline-block">
                  <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="white" />
                    <rect x="10" y="10" width="25" height="25" fill="#0f172a" />
                    <rect x="15" y="15" width="15" height="15" fill="white" />
                    <rect x="18" y="18" width="9" height="9" fill="#059669" />
                    <rect x="65" y="10" width="25" height="25" fill="#0f172a" />
                    <rect x="70" y="15" width="15" height="15" fill="white" />
                    <rect x="73" y="18" width="9" height="9" fill="#059669" />
                    <rect x="10" y="65" width="25" height="25" fill="#0f172a" />
                    <rect x="15" y="70" width="15" height="15" fill="white" />
                    <rect x="18" y="73" width="9" height="9" fill="#059669" />
                    {/* Matrix dots */}
                    <rect x="42" y="15" width="6" height="6" fill="#0f172a" />
                    <rect x="52" y="22" width="6" height="6" fill="#059669" />
                    <rect x="42" y="42" width="16" height="16" fill="#059669" />
                    <rect x="25" y="45" width="8" height="8" fill="#0f172a" />
                    <rect x="68" y="45" width="8" height="8" fill="#0f172a" />
                    <rect x="42" y="68" width="8" height="8" fill="#0f172a" />
                    <rect x="65" y="68" width="12" height="12" fill="#0f172a" />
                    <rect x="80" y="80" width="8" height="8" fill="#059669" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 py-1.5 px-3 rounded-lg">
                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                <span>UPI ID: <strong className="font-mono text-slate-900">selbar.recommerce@upi</strong></span>
              </div>

              <button
                type="button"
                onClick={handleOnlinePayment}
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Confirming UPI Payment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>I Have Paid (Simulate Approval)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {method === 'Credit/Debit Card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <CreditCard className="w-4 h-4 text-emerald-600 absolute right-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Valid Thru</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleOnlinePayment}
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{amount.toLocaleString('en-IN')} via 3D Secure</span>
                  </>
                )}
              </button>
            </div>
          )}

          {method === 'NetBanking' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Select Your Bank</label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2 rounded-xl border text-xs font-semibold text-left transition ${
                        selectedBank === bank ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleOnlinePayment}
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Redirecting to {selectedBank}...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authenticate via {selectedBank}</span>
                  </>
                )}
              </button>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>5-Day Replacement Guarantee & Open-Box Verification Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
