'use client';

import React from 'react';
import { Phone, CheckCircle2, AlertCircle } from 'lucide-react';

export interface PhoneInputIndiaProps {
  value: string;
  onChange: (phone: string, isValid: boolean) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  label?: string;
  helperText?: string;
}

export function PhoneInputIndia({
  value,
  onChange,
  disabled = false,
  autoFocus = false,
  label = 'Mobile Number',
  helperText = 'We will send a 6-digit verification OTP'
}: PhoneInputIndiaProps) {
  const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
  const isValid = /^[6-9]\d{9}$/.test(digitsOnly);
  const isComplete = digitsOnly.length === 10;
  const hasError = isComplete && !isValid;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    const valid = /^[6-9]\d{9}$/.test(raw);
    onChange(raw, valid);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-slate-700">
          {label} <span className="text-red-500">*</span>
        </label>
      )}

      <div className="relative flex items-center">
        {/* Country Code Prefix (+91 India) */}
        <div className="flex items-center gap-1.5 pl-3 pr-2.5 py-2.5 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg text-xs font-bold text-slate-800 select-none">
          <span className="text-base leading-none">🇮🇳</span>
          <span>+91</span>
        </div>

        {/* Input Field */}
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={10}
          value={digitsOnly}
          onChange={handleChange}
          disabled={disabled}
          autoFocus={autoFocus}
          placeholder="Enter 10-digit mobile"
          className={`w-full py-2.5 px-3 text-sm font-semibold tracking-wide text-slate-900 bg-white border rounded-r-lg transition-colors focus:outline-none ${
            hasError
              ? 'border-red-500 ring-2 ring-red-100'
              : isValid
              ? 'border-emerald-500 ring-2 ring-emerald-50'
              : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
          }`}
        />

        {/* Status Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {isValid ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : hasError ? (
            <AlertCircle className="w-4 h-4 text-red-500" />
          ) : (
            <Phone className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Helper text or Error message */}
      <div className="text-[11px]">
        {hasError ? (
          <p className="text-red-600 font-medium">Please enter a valid Indian number starting with 6, 7, 8 or 9.</p>
        ) : (
          <p className="text-slate-500">{helperText}</p>
        )}
      </div>
    </div>
  );
}
