'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserSessionInfo } from '@/context/AuthContext';
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import {
  ShieldCheck,
  KeyRound,
  Smartphone,
  Monitor,
  Tablet,
  LogOut,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  Lock,
} from 'lucide-react';

export default function SecurityCenterPage() {
  const { user, isLoggedIn, isLoading, listSessions, revokeSession, revokeAllOtherSessions } = useAuth();
  const router = useRouter();

  // Sessions state
  const [sessions, setSessions] = useState<UserSessionInfo[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [sessionActionLoading, setSessionActionLoading] = useState(false);

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Protect route
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login?returnUrl=/account/security');
    }
  }, [isLoading, isLoggedIn, router]);

  // Load sessions
  const fetchSessions = async () => {
    setLoadingSessions(true);
    const data = await listSessions();
    setSessions(data);
    setLoadingSessions(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchSessions();
    }
  }, [isLoggedIn]);

  const handleRevokeSingle = async (sessionId: string) => {
    setSessionActionLoading(true);
    const ok = await revokeSession(sessionId);
    if (ok) {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    }
    setSessionActionLoading(false);
  };

  const handleRevokeOthers = async () => {
    if (!confirm('Are you sure you want to sign out from all other devices?')) return;
    setSessionActionLoading(true);
    const ok = await revokeAllOtherSessions();
    if (ok) {
      setSessions((prev) => prev.filter((s) => s.isCurrentSession));
    }
    setSessionActionLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/v1/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setPasswordError(data.error || 'Failed to update password.');
      } else {
        setPasswordSuccess(data.message || 'Password changed successfully! Other sessions have been signed out.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        fetchSessions(); // Refresh session list
      }
    } catch {
      setPasswordError('Network error while changing password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-5 h-5 text-emerald-600" />;
      case 'tablet':
        return <Tablet className="w-5 h-5 text-emerald-600" />;
      default:
        return <Monitor className="w-5 h-5 text-emerald-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <AccountLayout>
      <AccountHeader />
      <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 mb-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Account Dashboard</span>
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <ShieldCheck className="w-7 h-7 text-emerald-600" />
              <span>Security Center</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your credentials, two-factor authentication, active login sessions, and devices.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              Account Status: Active
            </span>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Change Password</h2>
              <p className="text-xs text-slate-500">Ensure your account uses a secure password with 8+ characters.</p>
            </div>
          </div>

          {passwordSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div>{passwordSuccess}</div>
            </div>
          )}

          {passwordError && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div>{passwordError}</div>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  disabled={passwordLoading}
                  className="w-full px-4 py-2.5 pl-10 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 chars, 1 uppercase, 1 special symbol"
                  required
                  disabled={passwordLoading}
                  className="w-full px-4 py-2.5 pl-10 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrengthMeter password={newPassword} />
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  disabled={passwordLoading}
                  className="w-full px-4 py-2.5 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordLoading || !newPassword}
              className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm flex items-center gap-2 transition disabled:opacity-50 cursor-pointer text-xs"
            >
              {passwordLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        </div>

        {/* Active Sessions Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Active Device Sessions</h2>
                <p className="text-xs text-slate-500">
                  Devices currently signed into your account. If you spot unfamiliar activity, sign out immediately.
                </p>
              </div>
            </div>

            {sessions.length > 1 && (
              <button
                onClick={handleRevokeOthers}
                disabled={sessionActionLoading}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 transition cursor-pointer disabled:opacity-50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out All Other Devices</span>
              </button>
            )}
          </div>

          {loadingSessions ? (
            <div className="py-8 flex items-center justify-center text-slate-400 text-xs gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Loading active sessions...</span>
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">No active sessions found.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {sessions.map((session) => (
                <div key={session.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 bg-slate-100 rounded-2xl shrink-0 mt-0.5">
                      {getDeviceIcon(session.device)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {session.browser} on {session.operatingSystem}
                        </span>
                        {session.isCurrentSession && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                            Current Session
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {session.approximateLocation}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Last active: {new Date(session.lastUsedAt).toLocaleDateString()} at{' '}
                          {new Date(session.lastUsedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!session.isCurrentSession && (
                    <button
                      onClick={() => handleRevokeSingle(session.id)}
                      disabled={sessionActionLoading}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition border border-rose-100 self-start sm:self-center cursor-pointer"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </AccountLayout>
  );
}
