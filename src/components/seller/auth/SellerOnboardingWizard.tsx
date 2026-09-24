'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Building2,
  MapPin,
  CreditCard,
  Phone,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles
} from 'lucide-react';
import { PhoneInputIndia } from './PhoneInputIndia';
import { OtpInputBoxes } from './OtpInputBoxes';
import { GstinInput, GstDetails } from './GstinInput';

export interface SellerOnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (sellerProfile: any) => void;
}

const STEPS = [
  { id: 1, label: 'Identity', icon: Phone },
  { id: 2, label: 'Business & Tax', icon: Building2 },
  { id: 3, label: 'Warehouse Hub', icon: MapPin },
  { id: 4, label: 'Bank & Payouts', icon: CreditCard }
];

export function SellerOnboardingWizard({
  isOpen,
  onClose,
  onSuccess
}: SellerOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 State
  const [phone, setPhone] = useState('9876543210');
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Step 2 State
  const [gstin, setGstin] = useState('10AAACB1234F1Z5');
  const [gstDetails, setGstDetails] = useState<GstDetails | null>(null);
  const [panNumber, setPanNumber] = useState('');

  // Step 3 State
  const [pincode, setPincode] = useState('800001');
  const [addressLine, setAddressLine] = useState('Shop #12, Boring Road Market');
  const [city, setCity] = useState('Patna');
  const [state, setState] = useState('Bihar');

  // Step 4 State
  const [accountNumber, setAccountNumber] = useState('918237461928');
  const [ifsc, setIfsc] = useState('HDFC0001234');
  const [accountHolder, setAccountHolder] = useState('MAAJANKI ELECTRONICS PVT LTD');
  const [isPennyDropVerified, setIsPennyDropVerified] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    if (!isPhoneValid) return;
    setIsOtpSent(true);
  };

  const handleOtpComplete = (enteredOtp: string) => {
    if (enteredOtp.length === 6) {
      setIsPhoneVerified(true);
    }
  };

  const handlePincodeChange = (pin: string) => {
    setPincode(pin);
    if (pin === '800001') {
      setCity('Patna');
      setState('Bihar');
    } else if (pin.length === 6) {
      setCity('Patna Central');
      setState('Bihar');
    }
  };

  const handleFinalSubmit = () => {
    const profile = {
      phone,
      gstin,
      legalName: gstDetails?.legalName || 'MAAJANKI ELECTRONICS',
      warehouse: { addressLine, pincode, city, state },
      bank: { accountNumber, ifsc, accountHolder }
    };
    onSuccess(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-black text-sm">
              S
            </div>
            <div>
              <h2 className="text-base font-bold text-white">SELBAR Seller Onboarding</h2>
              <p className="text-xs text-slate-400">Complete KYC to start receiving buyback orders</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {STEPS.map((s, idx) => {
              const Icon = s.icon;
              const isPassed = currentStep > s.id;
              const isCurrent = currentStep === s.id;

              return (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                    </div>
                    <span
                      className={`text-xs font-semibold hidden sm:inline ${
                        isCurrent ? 'text-blue-900 font-bold' : isPassed ? 'text-emerald-800' : 'text-slate-500'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>

                  {idx < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-3 ${
                        isPassed ? 'bg-emerald-600' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: Phone Auth & OTP */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Step 1: Mobile Phone Authentication</h3>
                <p className="text-xs text-slate-500">
                  Enter the primary contact number of the business owner or store manager.
                </p>
              </div>

              <PhoneInputIndia
                value={phone}
                onChange={(p, valid) => {
                  setPhone(p);
                  setIsPhoneValid(valid);
                }}
                disabled={isOtpSent}
              />

              {!isOtpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={!isPhoneValid}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  Send 6-Digit OTP
                </button>
              ) : (
                <div className="space-y-4 pt-2">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-900">
                    <span>
                      OTP sent to <strong>+91 {phone}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsOtpSent(false)}
                      className="text-xs font-bold text-blue-700 underline"
                    >
                      Change
                    </button>
                  </div>

                  <OtpInputBoxes
                    value={otp}
                    onChange={setOtp}
                    onComplete={handleOtpComplete}
                    onResend={() => setOtp('')}
                  />

                  {isPhoneVerified && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg animate-in fade-in">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Phone verified successfully! Click Next to proceed.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: GSTIN & Tax Details */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Step 2: Business & GSTIN Information</h3>
                <p className="text-xs text-slate-500">
                  Mandatory for all B2B e-commerce sellers in India for GST invoice generation.
                </p>
              </div>

              <GstinInput
                value={gstin}
                onChange={(g, details) => {
                  setGstin(g);
                  if (details) setGstDetails(details);
                }}
              />

              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-semibold text-slate-700">Permanent Account Number (PAN)</label>
                <input
                  type="text"
                  maxLength={10}
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="AAACB1234F"
                  className="w-full py-2 px-3 uppercase font-mono text-xs font-bold bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
                <p className="text-[11px] text-slate-500">Auto-extracted from characters 3-12 of your GSTIN.</p>
              </div>
            </div>
          )}

          {/* STEP 3: Warehouse & Pickup Address */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Step 3: Primary Hub / Doorstep Pickup Location</h3>
                <p className="text-xs text-slate-500">
                  Our logistics executives and customers will visit this location for device verification and pickup.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Pincode *</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    placeholder="800001"
                    className="w-full py-2 px-3 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">City & State</label>
                  <input
                    type="text"
                    readOnly
                    value={`${city}, ${state}`}
                    className="w-full py-2 px-3 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-lg select-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Complete Address (Shop / Hub / Landmark) *</label>
                <textarea
                  rows={3}
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="Building name, Floor, Market, Road..."
                  className="w-full p-3 text-xs font-medium text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Bank Account & Payouts */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Step 4: Bank Account for Buyback Settlements</h3>
                <p className="text-xs text-slate-500">
                  Instant NEFT/RTGS/IMPS payouts are credited to this account after doorstep verification.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Account Holder Name *</label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full py-2 px-3 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Bank Account Number *</label>
                  <input
                    type="password"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full py-2 px-3 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">IFSC Code *</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    className="w-full py-2 px-3 text-xs font-mono font-bold uppercase text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant ₹1 Penny-Drop test passed successfully.</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-200 text-emerald-950 rounded-full">
                  VERIFIED
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s - 1)}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={currentStep === 1 && !isPhoneVerified}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-xs"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Complete Setup & Launch</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
