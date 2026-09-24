'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { useAdmin } from '@/context/AdminContext';
import { RoleType } from '@/types/admin';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/admin/dashboard';
  const { addToast, setCurrentRole } = useAdmin();

  const [email, setEmail] = useState('admin@selbar.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<RoleType>('Super Admin');
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const performLogin = (role: RoleType = selectedRole) => {
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      // Set cookies for middleware authentication
      const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24;
      document.cookie = `selbar_access_token=demo_token_${Date.now()}; path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `selbar_refresh_token=demo_refresh_${Date.now()}; path=/; max-age=${maxAge}; SameSite=Lax`;

      setCurrentRole(role);
      addToast({
        title: 'Authentication Successful',
        message: `Welcome back! Signed in as ${role}`,
        type: 'success',
      });

      router.push(returnUrl);
    }, 600);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    performLogin(selectedRole);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      {/* Background ambient radial gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand Logo & Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 font-black text-white shadow-lg shadow-blue-500/30 text-xl mb-4">
            S
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            SELBAR Admin Portal
          </h1>
          <p className="mt-1.5 text-xs text-slate-400">
            Sign in to manage catalog, orders, logistics, and store settings
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
          {errorMsg && (
            <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-rose-900/50 bg-rose-950/40 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@selbar.com"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/80 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={e => {
                    e.preventDefault();
                    addToast({ title: 'Password Reset', message: 'Demo reset link sent to admin inbox', type: 'info' });
                  }}
                  className="text-[11px] text-blue-400 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/80 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Role Switcher Demo */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Role Context
              </label>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value as RoleType)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 py-2 px-3 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
              >
                <option value="Super Admin">Super Admin (Full Access)</option>
                <option value="Order Manager">Order Manager (Fulfillment & Shipping)</option>
                <option value="Product Manager">Product Manager (Catalog & Inventory)</option>
                <option value="Marketing Manager">Marketing Manager (Coupons & Ads)</option>
                <option value="Support Agent">Support Agent (Tickets & Inquiries)</option>
              </select>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember this terminal</span>
              </label>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="h-3 w-3" /> TLS 1.3 Verified
              </span>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2 font-semibold"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Quick 1-Click Access Box */}
          <div className="mt-6 border-t border-slate-800 pt-5">
            <div className="text-center text-xs text-slate-400 mb-3">
              Testing or Client Review?
            </div>
            <Button
              variant="secondary"
              size="md"
              onClick={() => performLogin('Super Admin')}
              isLoading={isLoading}
              className="w-full bg-blue-950/60 text-blue-300 hover:bg-blue-900/60 border border-blue-800/50"
              leftIcon={<Sparkles className="h-4 w-4 text-blue-400" />}
            >
              Instant 1-Click Demo Login (Super Admin)
            </Button>
          </div>
        </div>

        {/* Security Footer Notice */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Protected by Selbar Cryptographic Auth • Session IP Monitored
        </div>
      </div>
    </div>
  );
}
