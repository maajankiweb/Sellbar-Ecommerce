'use client';

import React, { useState, useEffect } from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { PageHeader, SectionCard, SectionHeader, Toast, ConfirmModal } from '@/components/account/ui';
import { accountService } from '@/lib/account/mockData';
import { LoginActivity } from '@/types/account';
import { ActivitySquare, Monitor, Smartphone, Tablet, MapPin, Clock, ShieldAlert, LogOut, CheckCircle, AlertTriangle } from 'lucide-react';

function getDeviceIcon(device: string) {
  const d = device.toLowerCase();
  if (d.includes('iphone') || d.includes('android') || d.includes('galaxy') || d.includes('pixel')) {
    return <Smartphone className="h-5 w-5 text-blue-600" />;
  }
  if (d.includes('ipad') || d.includes('tablet')) {
    return <Tablet className="h-5 w-5 text-purple-600" />;
  }
  return <Monitor className="h-5 w-5 text-slate-600" />;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function LoginActivityContent() {
  const [sessions, setSessions] = useState<LoginActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);
  const [revokeAll, setRevokeAll] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    accountService.getLoginActivity().then(data => {
      setSessions(data);
      setLoading(false);
    });
  }, []);

  const handleRevoke = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
    setRevokeTarget(null);
    setToast('Session terminated successfully.');
  };

  const handleRevokeAll = () => {
    setSessions(prev => prev.filter(s => s.isCurrentSession));
    setRevokeAll(false);
    setToast('All other sessions have been signed out.');
  };

  const otherSessions = sessions.filter(s => !s.isCurrentSession);

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-3xl mx-auto w-full">
      <PageHeader
        title="Login Activity"
        description="Monitor all devices signed in to your account"
        action={
          otherSessions.length > 0 ? (
            <button
              onClick={() => setRevokeAll(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out All Others
            </button>
          ) : undefined
        }
      />

      {/* Security Tip */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200/60 rounded-2xl mb-6">
        <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Keep your account secure</p>
          <p className="text-xs text-amber-700 mt-0.5">
            If you see an unfamiliar device or location, terminate that session immediately and change your password.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-28 bg-slate-200 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map(session => (
            <div
              key={session.id}
              className={`bg-white rounded-2xl border p-5 transition hover:shadow-sm ${session.isCurrentSession ? 'border-emerald-200 shadow-sm shadow-emerald-50' : 'border-slate-100'}`}
            >
              <div className="flex items-start gap-4">
                {/* Device icon */}
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${session.isCurrentSession ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                  {getDeviceIcon(session.device)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-slate-900">{session.device}</p>
                        {session.isCurrentSession && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                            <CheckCircle className="h-3 w-3" />
                            Current Session
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{session.browser} · {session.os}</p>
                    </div>
                    {!session.isCurrentSession && (
                      <button
                        onClick={() => setRevokeTarget(session.sessionId)}
                        className="shrink-0 px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 transition flex items-center gap-1"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {session.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {session.isCurrentSession ? 'Active now' : timeAgo(session.loggedInAt)}
                    </span>
                    <span className="font-mono">{session.ipAddress}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <p className="text-xs text-slate-500 leading-relaxed">
          <strong className="text-slate-700">Note:</strong> Sessions expire automatically after 30 days of inactivity. Location is approximate based on IP address and may not be exact.
        </p>
      </div>

      <ConfirmModal
        isOpen={!!revokeTarget}
        title="Sign Out This Device"
        description="This will immediately end the session on that device. They'll need to sign in again to access your account."
        confirmLabel="Sign Out"
        variant="danger"
        onConfirm={() => revokeTarget && handleRevoke(revokeTarget)}
        onCancel={() => setRevokeTarget(null)}
      />

      <ConfirmModal
        isOpen={revokeAll}
        title="Sign Out All Other Devices"
        description="This will immediately end all sessions except your current device. All other devices will need to sign in again."
        confirmLabel="Sign Out All"
        variant="danger"
        onConfirm={handleRevokeAll}
        onCancel={() => setRevokeAll(false)}
      />

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default function LoginActivityPage() {
  return (
    <AccountLayout>
      <AccountHeader />
      <LoginActivityContent />
    </AccountLayout>
  );
}
