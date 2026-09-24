'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { evaluatePasswordStrength } from '@/lib/auth/jwt';

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const strength = evaluatePasswordStrength(password);
  const { score, label, requirements } = strength;

  const getBarColor = (index: number) => {
    if (index >= score) return 'bg-slate-200';
    if (score <= 2) return 'bg-rose-500';
    if (score === 3) return 'bg-amber-500';
    if (score === 4) return 'bg-teal-500';
    return 'bg-emerald-500';
  };

  const getLabelColor = () => {
    if (score <= 2) return 'text-rose-600 bg-rose-50 border-rose-200';
    if (score === 3) return 'text-amber-600 bg-amber-50 border-amber-200';
    if (score === 4) return 'text-teal-600 bg-teal-50 border-teal-200';
    return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  };

  return (
    <div className="mt-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 text-xs animate-in fade-in duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-600 font-medium">Password Strength:</span>
        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getLabelColor()}`}>
          {label}
        </span>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-5 gap-1.5 mb-2.5">
        {[0, 1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${getBarColor(idx)}`}
          />
        ))}
      </div>

      {/* Requirements Checklist */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
        <RequirementItem satisfied={requirements.minLength} label="Min 8 characters" />
        <RequirementItem satisfied={requirements.hasUpper} label="Uppercase letter (A-Z)" />
        <RequirementItem satisfied={requirements.hasLower} label="Lowercase letter (a-z)" />
        <RequirementItem satisfied={requirements.hasNumber} label="Number (0-9)" />
        <div className="col-span-2">
          <RequirementItem satisfied={requirements.hasSpecial} label="Special symbol (!@#$%^&*)" />
        </div>
      </div>
    </div>
  );
}

function RequirementItem({ satisfied, label }: { satisfied: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-1.5 transition-colors ${satisfied ? 'text-emerald-700 font-medium' : 'text-slate-400'}`}>
      {satisfied ? (
        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      ) : (
        <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
      )}
      <span>{label}</span>
    </div>
  );
}
