'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import SmartCredentialInput from '@/components/auth/SmartCredentialInput';
import { ShieldCheck, Eye, EyeOff, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

function LoginForm() {
  const { isLoggedIn, loginWithCredentials } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/account';

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lockoutMinutes, setLockoutMinutes] = useState<number | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      router.push(returnUrl);
    }
  }, [isLoggedIn, returnUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credential.trim() || !password) {
      setError('Please provide your identifier and password.');
      return;
    }

    setLoading(true);
    setError('');
    setLockoutMinutes(null);

    const result = await loginWithCredentials(credential, password, rememberMe);
    setLoading(false);

    if (!result.success) {
      if (result.locked) {
        setLockoutMinutes(result.remainingMinutes || 30);
        setError(result.error || 'Account is temporarily locked.');
      } else {
        setError(result.error || 'Invalid credentials. Please verify your details.');
      }
    } else {
      router.push(returnUrl);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-2xl space-y-6">
      <div className="text-center space-y-1.5">
        <div className="inline-flex p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600 mb-2">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to SELBAR</h1>
        <p className="text-xs text-slate-500">Access your device sell quotes, orders, warranty, and seller portal.</p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <div>
            <div className="font-semibold">{error}</div>
            {lockoutMinutes && (
              <div className="mt-1 text-[11px] text-rose-600">
                Security cooldown active for {lockoutMinutes} minute(s).
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email, Mobile Number, or Username
          </label>
          <SmartCredentialInput
            value={credential}
            onChange={(val) => {
              setCredential(val);
              setError('');
            }}
            placeholder="e.g. 9876543210 or name@selbar.in or rohit_01"
            disabled={loading}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700">Password</label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter your password"
              disabled={loading}
              className="w-full px-4 py-3 pl-10 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-slate-600">Remember this device for 30 days</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer text-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
        Don&apos;t have an account yet?{' '}
        <Link
          href={`/register${returnUrl !== '/account' ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
          className="font-bold text-emerald-600 hover:text-emerald-700"
        >
          Create free account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-emerald-50/30">
      <Suspense fallback={<div className="text-sm text-slate-500">Loading sign in...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
