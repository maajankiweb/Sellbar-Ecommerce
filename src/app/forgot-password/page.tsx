'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SmartCredentialInput from '@/components/auth/SmartCredentialInput';
import { ShieldCheck, ArrowRight, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please provide your mobile number, email, or username.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();

      if (!res.ok && !data.success) {
        setError(data.error || 'Unable to process request.');
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-emerald-50/30">
      <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-2xl space-y-6">
        <div className="text-center space-y-1.5">
          <div className="inline-flex p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Recover Your Account</h1>
          <p className="text-xs text-slate-500">
            Enter your registered email, mobile number, or username to receive password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-5 animate-in fade-in">
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
              <div className="space-y-1 leading-relaxed">
                <div className="font-bold text-sm text-emerald-900">Request Received</div>
                <p>
                  If an account matching <strong>{identifier}</strong> exists in our system, security verification
                  instructions have been dispatched.
                </p>
                <p className="text-[11px] text-emerald-700">Please check your inbox, spam folder, or SMS messages.</p>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <div className="font-semibold">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email, Mobile Number, or Username
                </label>
                <SmartCredentialInput
                  value={identifier}
                  onChange={(val) => {
                    setIdentifier(val);
                    setError('');
                  }}
                  placeholder="e.g. 9876543210 or name@selbar.in"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing request...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              Remember your password?{' '}
              <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
