'use client';

import React from 'react';
import { Mail, Phone, AtSign } from 'lucide-react';
import { detectCredentialType } from '@/lib/auth/jwt';

interface SmartCredentialInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function SmartCredentialInput({
  value,
  onChange,
  placeholder = 'Mobile number, Email, or Username',
  disabled = false,
}: SmartCredentialInputProps) {
  const detectedType = value.trim() ? detectCredentialType(value) : null;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <label className="font-semibold text-slate-700">Login Credential</label>
        {detectedType && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-in fade-in duration-150">
            {detectedType === 'email' && (
              <>
                <Mail className="w-3 h-3 text-emerald-600" />
                Detected: Email
              </>
            )}
            {detectedType === 'phone' && (
              <>
                <Phone className="w-3 h-3 text-emerald-600" />
                Detected: Mobile
              </>
            )}
            {detectedType === 'username' && (
              <>
                <AtSign className="w-3 h-3 text-emerald-600" />
                Detected: Username
              </>
            )}
          </span>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          {detectedType === 'email' ? (
            <Mail className="w-4 h-4 text-emerald-600 transition-colors" />
          ) : detectedType === 'phone' ? (
            <Phone className="w-4 h-4 text-emerald-600 transition-colors" />
          ) : detectedType === 'username' ? (
            <AtSign className="w-4 h-4 text-emerald-600 transition-colors" />
          ) : (
            <AtSign className="w-4 h-4 text-slate-400" />
          )}
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="username"
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition disabled:opacity-60"
        />
      </div>
    </div>
  );
}
