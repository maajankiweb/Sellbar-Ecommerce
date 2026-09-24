'use client';

import React, { useRef, useState, useEffect } from 'react';
import { RotateCw, ShieldCheck } from 'lucide-react';

export interface OtpInputBoxesProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  onComplete?: (otp: string) => void;
  onResend?: () => void;
  disabled?: boolean;
  resendCooldownSeconds?: number;
}

export function OtpInputBoxes({
  length = 6,
  value,
  onChange,
  onComplete,
  onResend,
  disabled = false,
  resendCooldownSeconds = 30
}: OtpInputBoxesProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(resendCooldownSeconds);

  // Split string into array of characters
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  // Resend Timer Countdown
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendClick = () => {
    if (timer > 0) return;
    setTimer(resendCooldownSeconds);
    onChange('');
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
    if (onResend) {
      onResend();
    }
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.slice(-1).replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = char;
    const newOtp = newDigits.join('');
    onChange(newOtp);

    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.length === length && onComplete) {
      onComplete(newOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;

    onChange(pasted);
    const nextFocusIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[nextFocusIndex]?.focus();

    if (pasted.length === length && onComplete) {
      onComplete(pasted);
    }
  };

  return (
    <div className="space-y-4">
      {/* 6 Boxes Row */}
      <div className="flex items-center justify-between gap-2 sm:gap-2.5">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[i] || ''}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-black rounded-lg border transition-all select-none focus:outline-none ${
              digits[i]
                ? 'border-blue-600 bg-blue-50/40 text-blue-950 ring-1 ring-blue-600'
                : 'border-slate-300 bg-white text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
            }`}
          />
        ))}
      </div>

      {/* Timer & Resend CTA */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Auto-secure verification</span>
        </div>

        <div>
          {timer > 0 ? (
            <span className="text-slate-400 font-medium tabular-nums">
              Resend in <strong className="text-slate-700">00:{timer.toString().padStart(2, '0')}</strong>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendClick}
              className="text-blue-600 hover:text-blue-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCw className="w-3 h-3" />
              <span>Resend OTP</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
