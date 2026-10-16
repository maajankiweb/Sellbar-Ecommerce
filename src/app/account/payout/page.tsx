'use client';

import React, { useState } from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { PageHeader, SectionCard, SectionHeader, Toast } from '@/components/account/ui';
import {
  CreditCard, ShieldCheck, CheckCircle2, AlertCircle, Building2,
  Smartphone, Lock, RefreshCw, KeyRound, ArrowRight
} from 'lucide-react';

interface PayoutMethod {
  type: 'UPI' | 'BANK';
  vpa?: string;
  accountNumber?: string;
  maskedAccount?: string;
  ifsc?: string;
  bankName?: string;
  branchName?: string;
  accountHolder: string;
  isVerified: boolean;
  lastUpdated: string;
}

export default function PayoutDetailsPage() {
  const [currentPayout, setCurrentPayout] = useState<PayoutMethod>({
    type: 'UPI',
    vpa: 'rahul@okhdfcbank',
    accountHolder: 'Rahul Sharma',
    isVerified: true,
    lastUpdated: '15 Oct 2026',
  });

  const [activeTab, setActiveTab] = useState<'UPI' | 'BANK'>('UPI');
  const [toast, setToast] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [vpaInput, setVpaInput] = useState('');
  const [bankAccNumber, setBankAccNumber] = useState('');
  const [bankAccNumberConfirm, setBankAccNumberConfirm] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankLookupName, setBankLookupName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('Rahul Sharma');
  const [formError, setFormError] = useState('');

  // OTP Verification Modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [pendingUpdate, setPendingUpdate] = useState<Partial<PayoutMethod> | null>(null);

  // Handle IFSC lookup simulation
  const handleIfscChange = (val: string) => {
    const clean = val.toUpperCase().trim();
    setIfscCode(clean);
    if (clean.length === 11) {
      if (clean.startsWith('HDFC')) {
        setBankLookupName('HDFC Bank, Bailey Road Branch, Patna');
      } else if (clean.startsWith('SBIN')) {
        setBankLookupName('State Bank of India, Main Branch, Patna');
      } else if (clean.startsWith('ICIC')) {
        setBankLookupName('ICICI Bank, Boring Road Branch, Patna');
      } else {
        setBankLookupName('Verified Indian Scheduled Bank');
      }
    } else {
      setBankLookupName('');
    }
  };

  const handleStartSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (activeTab === 'UPI') {
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
      if (!upiRegex.test(vpaInput.trim())) {
        setFormError('Please enter a valid UPI ID (e.g. yourname@okhdfcbank, mobile@upi)');
        return;
      }
      setPendingUpdate({
        type: 'UPI',
        vpa: vpaInput.trim(),
        accountHolder: accountHolderName.trim(),
        isVerified: true,
        lastUpdated: 'Just now',
      });
      setShowOtpModal(true);
    } else {
      if (!bankAccNumber || bankAccNumber.length < 9) {
        setFormError('Please enter a valid Bank Account Number (minimum 9 digits).');
        return;
      }
      if (bankAccNumber !== bankAccNumberConfirm) {
        setFormError('Account numbers do not match. Please verify both fields.');
        return;
      }
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(ifscCode)) {
        setFormError('Please enter a valid 11-character IFSC Code (e.g. HDFC0000001).');
        return;
      }
      setPendingUpdate({
        type: 'BANK',
        accountNumber: bankAccNumber,
        maskedAccount: `•••• •••• ${bankAccNumber.slice(-4)}`,
        ifsc: ifscCode,
        bankName: bankLookupName || 'Verified Scheduled Bank',
        accountHolder: accountHolderName.trim(),
        isVerified: true,
        lastUpdated: 'Just now',
      });
      setShowOtpModal(true);
    }
  };

  const handleVerifyOtp = () => {
    if (otpValue.length !== 6) {
      setOtpError('Please enter the 6-digit OTP sent to your registered mobile number.');
      return;
    }
    if (pendingUpdate) {
      setCurrentPayout(pendingUpdate as PayoutMethod);
      setShowOtpModal(false);
      setIsEditing(false);
      setOtpValue('');
      setOtpError('');
      setToast('Payout destination verified and updated successfully!');
    }
  };

  return (
    <AccountLayout>
      <AccountHeader />
      <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-4xl mx-auto w-full">
        <PageHeader
          title="Selling Payout Details"
          description="Manage your verified bank account or UPI ID for instant doorstep payment when selling old phones."
        />

        {/* Security & Instant Transfer Assurance Banner */}
        <div className="mb-6 bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-emerald-950">Sellbar Instant Doorstep Payout Protection</h2>
            <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
              When our certified executive inspects your phone at your door, payment is sent immediately to this verified destination before device handover. Exactly one active payout method is linked to prevent identity fraud.
            </p>
          </div>
        </div>

        {/* Active Payout Method Card */}
        <SectionCard className="mb-6">
          <SectionHeader
            title="Active Payout Destination"
            action={
              !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition cursor-pointer"
                >
                  Change Payout Details
                </button>
              )
            }
          />
          <div className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-sm shrink-0">
                  {currentPayout.type === 'UPI' ? (
                    <Smartphone className="h-6 w-6 text-emerald-600" />
                  ) : (
                    <Building2 className="h-6 w-6 text-indigo-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">
                      {currentPayout.type === 'UPI' ? currentPayout.vpa : currentPayout.maskedAccount}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="h-3 w-3" /> VERIFIED
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Account Holder: <span className="font-semibold text-slate-700">{currentPayout.accountHolder}</span>
                    {currentPayout.bankName && ` · ${currentPayout.bankName}`}
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-400 sm:text-right">
                <p>Status: Active</p>
                <p>Last verified: {currentPayout.lastUpdated}</p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Change Payout Form */}
        {isEditing && (
          <SectionCard>
            <SectionHeader title="Update Payout Destination" />
            <div className="p-5">
              {/* Type Switcher */}
              <div className="flex gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => { setActiveTab('UPI'); setFormError(''); }}
                  className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    activeTab === 'UPI'
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  Instant UPI (VPA)
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('BANK'); setFormError(''); }}
                  className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    activeTab === 'BANK'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-800 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  Direct Bank Account (IMPS/NEFT)
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  {formError}
                </div>
              )}

              <form onSubmit={handleStartSave} className="space-y-4">
                {activeTab === 'UPI' ? (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      UPI ID / VPA <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. mobile@okhdfcbank or yourname@upi"
                      value={vpaInput}
                      onChange={e => setVpaInput(e.target.value)}
                      className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                      required
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Supports Google Pay, PhonePe, Paytm, and all BHIM UPI handles.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Bank Account Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="password"
                          placeholder="Enter account number"
                          value={bankAccNumber}
                          onChange={e => setBankAccNumber(e.target.value)}
                          className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Confirm Account Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Re-enter account number"
                          value={bankAccNumberConfirm}
                          onChange={e => setBankAccNumberConfirm(e.target.value)}
                          className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Bank IFSC Code <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. HDFC0000001"
                        maxLength={11}
                        value={ifscCode}
                        onChange={e => handleIfscChange(e.target.value)}
                        className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 uppercase font-mono"
                        required
                      />
                      {bankLookupName && (
                        <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> {bankLookupName}
                        </p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Beneficiary Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={accountHolderName}
                    onChange={e => setAccountHolderName(e.target.value)}
                    className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-900"
                    required
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Must match government ID and bank records for instant penny-drop validation.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setFormError(''); }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="min-h-11 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                  >
                    Proceed to OTP Verification <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </SectionCard>
        )}

        {/* OTP Security Modal */}
        {showOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Security Verification</h3>
                  <p className="text-xs text-slate-500">Confirm changes to your selling payout destination</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                For your account security, enter the 6-digit verification code sent to your registered mobile number (+91 98765-XXXXX).
              </p>

              {otpError && (
                <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                  {otpError}
                </div>
              )}

              <div className="mt-4">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otpValue}
                  onChange={e => setOtpValue(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center text-2xl font-mono tracking-widest p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowOtpModal(false); setOtpValue(''); setOtpError(''); }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm"
                >
                  Verify & Save Destination
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && <Toast message={toast} onClose={() => setToast('')} />}
      </div>
    </AccountLayout>
  );
}
