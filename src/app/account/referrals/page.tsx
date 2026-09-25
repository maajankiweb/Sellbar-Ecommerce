'use client';

import React, { useState, useEffect } from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { PageHeader, SectionCard, SectionHeader, Toast } from '@/components/account/ui';
import { accountService } from '@/lib/account/mockData';
import { Referral } from '@/types/account';
import { Users, Copy, Share2, Gift, Check, CheckCircle, Clock, XCircle, ChevronRight } from 'lucide-react';

const REFERRAL_CODE = 'RAHUL-SELB-8823';
const EARN_PER_REFERRAL = 500;

function ReferralsContent() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    accountService.getReferrals().then(data => {
      setReferrals(data);
      setLoading(false);
    });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(REFERRAL_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setToast('Referral code copied!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join SELBAR!',
        text: `Use my referral code ${REFERRAL_CODE} and we both get ₹${EARN_PER_REFERRAL} wallet credit when you make your first purchase!`,
        url: `https://selbar.in/register?ref=${REFERRAL_CODE}`,
      });
    } else {
      handleCopy();
    }
  };

  const totalEarned = referrals.filter(r => r.status === 'SUCCESSFUL').reduce((s, r) => s + (r.rewardEarned || 0), 0);
  const successful = referrals.filter(r => r.status === 'SUCCESSFUL').length;
  const pending = referrals.filter(r => r.status === 'PENDING').length;

  const statusConfig = {
    SUCCESSFUL: { icon: <CheckCircle className="h-4 w-4 text-emerald-600" />, cls: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Completed' },
    PENDING: { icon: <Clock className="h-4 w-4 text-amber-600" />, cls: 'text-amber-600', bg: 'bg-amber-100', label: 'Pending' },
    FAILED: { icon: <XCircle className="h-4 w-4 text-slate-400" />, cls: 'text-slate-400', bg: 'bg-slate-100', label: 'Failed' },
  };

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-3xl mx-auto w-full">
      <PageHeader title="Refer & Earn" description="Invite friends and earn rewards together" />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10">
          <Users className="h-48 w-48" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="h-5 w-5" />
            <span className="font-bold text-sm">Refer a Friend Program</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-2">
            You both get <span className="text-yellow-300">₹{EARN_PER_REFERRAL}</span>
          </h2>
          <p className="text-white/80 text-sm mb-6">
            Share your code. When your friend makes their first purchase, you both get ₹{EARN_PER_REFERRAL} as SELBAR wallet credit.
          </p>

          {/* Referral Code */}
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
            <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Your Referral Code</p>
            <div className="flex items-center gap-3">
              <span className="font-mono font-black text-xl text-white flex-1 tracking-widest">{REFERRAL_CODE}</span>
              <button
                onClick={handleCopy}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 transition flex items-center gap-1.5 text-xs font-bold text-white"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 transition"
              >
                <Share2 className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            {[
              { icon: '💬', label: 'WhatsApp', action: 'wa' },
              { icon: '📲', label: 'SMS', action: 'sms' },
              { icon: '📧', label: 'Email', action: 'mail' },
            ].map(s => (
              <button
                key={s.action}
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition text-xs font-semibold text-white"
              >
                <span>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Referred', value: referrals.length, color: 'text-slate-900' },
          { label: 'Successful', value: successful, color: 'text-emerald-600' },
          { label: 'Total Earned', value: `₹${totalEarned.toLocaleString('en-IN')}`, color: 'text-amber-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
            <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <SectionCard className="mb-5">
        <SectionHeader title="How It Works" />
        <div className="p-5 space-y-4">
          {[
            { step: '1', title: 'Share your code', desc: 'Send your unique referral code to friends and family.', icon: '📤' },
            { step: '2', title: 'Friend joins & buys', desc: 'Your friend registers with your code and makes their first order.', icon: '🛒' },
            { step: '3', title: 'Both get rewarded', desc: `You and your friend each get ₹${EARN_PER_REFERRAL} wallet credit automatically!`, icon: '🎉' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-9 w-9 rounded-full bg-indigo-600 text-white text-sm font-black flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                {i < 2 && <div className="w-0.5 flex-1 bg-indigo-100 my-1" />}
              </div>
              <div className="pb-4">
                <p className="font-bold text-slate-900 flex items-center gap-2">
                  <span>{item.icon}</span>
                  {item.title}
                </p>
                <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Referral History */}
      <SectionCard>
        <SectionHeader title={`Referral History (${referrals.length})`} />
        {loading ? (
          <div className="divide-y divide-slate-100">
            {[1, 2, 3].map(i => <div key={i} className="px-5 py-4 h-16 animate-pulse bg-slate-50" />)}
          </div>
        ) : referrals.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500 text-sm">No referrals yet. Share your code to start earning!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {referrals.map(r => {
              const config = statusConfig[r.status];
              return (
                <div key={r.id} className="flex items-center gap-4 px-5 py-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-black shrink-0 ${r.status === 'SUCCESSFUL' ? 'bg-emerald-500' : r.status === 'PENDING' ? 'bg-amber-400' : 'bg-slate-300'}`}>
                    {r.friendName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{r.friendName}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.cls}`}>
                      {config.icon}
                      {config.label}
                    </div>
                    {r.rewardEarned && (
                      <p className="text-xs font-bold text-emerald-600 mt-1">+₹{r.rewardEarned}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default function ReferralsPage() {
  return (
    <AccountLayout>
      <AccountHeader />
      <ReferralsContent />
    </AccountLayout>
  );
}
