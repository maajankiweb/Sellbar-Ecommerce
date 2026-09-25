'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Lock, KeyRound, Shield, AlertCircle, CheckCircle2,
  X, Eye, EyeOff, Sparkles, ArrowRight, User
} from 'lucide-react';
import { ROLE_CREDENTIALS, verifyRoleCredentials, RoleCredential } from '@/lib/auth/roleAuth';

interface RoleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRoleKey: string; // 'manager' | 'staff' | 'delivery' | 'seller' | 'super_admin'
  onSuccess?: () => void;
}

export default function RoleLoginModal({
  isOpen,
  onClose,
  targetRoleKey,
  onSuccess,
}: RoleLoginModalProps) {
  const router = useRouter();
  const cred: RoleCredential | undefined = ROLE_CREDENTIALS[targetRoleKey];

  const [identifier, setIdentifier] = useState(cred?.defaultEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync state if targetRoleKey changes
  React.useEffect(() => {
    if (cred) {
      setIdentifier(cred.defaultEmail);
      setPassword('');
      setError('');
    }
  }, [targetRoleKey, cred]);

  if (!isOpen || !cred) return null;

  const handleFillDemo = () => {
    setIdentifier(cred.defaultEmail);
    setPassword(cred.demoPassword);
    setError('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 450));

    const result = verifyRoleCredentials(cred.role, identifier, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Authentication failed. Please verify credentials.');
      return;
    }

    // Success: close modal and navigate to target dashboard
    onClose();
    if (onSuccess) {
      onSuccess();
    } else {
      router.push(cred.dashboardUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <img
            src={cred.avatar}
            alt={cred.name}
            className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-500/30 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                {cred.title} Login
              </h2>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                AUTH REQUIRED
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {cred.designation}
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 mb-4 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
          <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong>Mandatory Role Isolation:</strong> Entering this dashboard requires explicit authentication with <strong>{cred.title}</strong> credentials.
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 mb-4 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Role Username or Email
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={cred.defaultEmail}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter role password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Credentials Pill */}
          <div className="flex items-center justify-between text-[11px] pt-1">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              Auto-Fill Demo ({cred.defaultEmail} / {cred.demoPassword})
            </button>
            <span className="text-slate-400">Target: {cred.dashboardUrl}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              'Verifying Credentials...'
            ) : (
              <>
                <KeyRound className="w-3.5 h-3.5" />
                Authenticate & Open {cred.title} Dashboard
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
