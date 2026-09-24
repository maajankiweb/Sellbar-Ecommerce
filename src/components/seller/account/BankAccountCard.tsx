'use client';

import React from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowUpRight } from 'lucide-react';

export interface BankAccountDetails {
  bankName: string;
  accountHolder: string;
  maskedAccountNumber: string;
  ifsc: string;
  accountType: 'Current' | 'Savings';
  isVerified: boolean;
  payoutSchedule: string;
}

export interface BankAccountCardProps {
  account: BankAccountDetails;
  onChangeBank?: () => void;
}

export function BankAccountCard({
  account,
  onChangeBank
}: BankAccountCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{account.bankName}</h4>
            <span className="text-xs text-slate-500 font-medium">{account.accountType} Business Account</span>
          </div>
        </div>

        {account.isVerified && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Penny-Drop Verified</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-lg text-xs">
        <div>
          <span className="text-slate-400 font-medium block">Account Holder</span>
          <span className="font-bold text-slate-800">{account.accountHolder}</span>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Account Number</span>
          <span className="font-mono font-bold text-slate-800">{account.maskedAccountNumber}</span>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">IFSC Code</span>
          <span className="font-mono font-bold text-slate-800 uppercase">{account.ifsc}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Settlements: <strong>{account.payoutSchedule}</strong></span>
        </div>

        {onChangeBank && (
          <button
            type="button"
            onClick={onChangeBank}
            className="font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Change Bank</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
