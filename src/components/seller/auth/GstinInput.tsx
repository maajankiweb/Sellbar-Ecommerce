'use client';

import React, { useState } from 'react';
import { Building2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export interface GstDetails {
  gstin: string;
  legalName: string;
  tradeName: string;
  state: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface GstinInputProps {
  value: string;
  onChange: (gstin: string, details?: GstDetails) => void;
  disabled?: boolean;
}

export function GstinInput({
  value,
  onChange,
  disabled = false
}: GstinInputProps) {
  const [loading, setLoading] = useState(false);
  const [verifiedDetails, setVerifiedDetails] = useState<GstDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15);
  const isValidFormat = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formattedValue);

  const handleVerify = () => {
    if (!isValidFormat) {
      setError('Please enter a valid 15-character GSTIN format.');
      return;
    }
    setLoading(true);
    setError(null);

    // Simulate real GSTIN validation
    setTimeout(() => {
      setLoading(false);
      const mockDetails: GstDetails = {
        gstin: formattedValue,
        legalName: 'MAAJANKI ELECTRONICS & TELECOM PRIVATE LIMITED',
        tradeName: 'SELBAR Tech Hub Patna',
        state: 'Bihar (10)',
        status: 'ACTIVE'
      };
      setVerifiedDetails(mockDetails);
      onChange(formattedValue, mockDetails);
    }, 800);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15);
    setVerifiedDetails(null);
    setError(null);
    onChange(val);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700">
        Goods and Services Tax ID (GSTIN) <span className="text-red-500">*</span>
      </label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={formattedValue}
            onChange={handleInputChange}
            disabled={disabled || loading}
            maxLength={15}
            placeholder="e.g. 10AAACB1234F1Z5"
            className={`w-full py-2.5 px-3 uppercase tracking-widest text-sm font-mono font-bold bg-white border rounded-lg transition-colors focus:outline-none ${
              verifiedDetails
                ? 'border-emerald-500 ring-2 ring-emerald-50 text-emerald-950'
                : error
                ? 'border-red-500 ring-2 ring-red-100 text-red-950'
                : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900'
            }`}
          />
        </div>

        <button
          type="button"
          onClick={handleVerify}
          disabled={!isValidFormat || loading || !!verifiedDetails}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : verifiedDetails ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>Verified</span>
            </>
          ) : (
            <span>Verify GSTIN</span>
          )}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Auto-Fetched Business Card */}
      {verifiedDetails && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              Verified Entity Info
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-200 text-emerald-900 rounded-full">
              ACTIVE
            </span>
          </div>
          <div className="text-xs font-bold text-slate-900">{verifiedDetails.legalName}</div>
          <div className="text-[11px] text-slate-600 flex justify-between">
            <span>Trade Name: <strong>{verifiedDetails.tradeName}</strong></span>
            <span>State: <strong>{verifiedDetails.state}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
