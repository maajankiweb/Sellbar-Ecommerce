'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { PageHeader, SectionCard, SectionHeader, Toast } from '@/components/account/ui';
import { accountService } from '@/lib/account/mockData';
import { LoyaltyData } from '@/types/account';
import {
  Award, Gift, Zap, TrendingUp, History, ChevronRight,
  Check, Star, Truck, ShoppingCart, Crown, ArrowRight
} from 'lucide-react';

const TIER_COLORS = {
  SILVER: { bg: 'from-slate-400 to-slate-500', text: 'text-slate-700', light: 'bg-slate-100', border: 'border-slate-300' },
  GOLD: { bg: 'from-amber-400 to-orange-500', text: 'text-amber-700', light: 'bg-amber-50', border: 'border-amber-200' },
  PLATINUM: { bg: 'from-purple-500 to-indigo-600', text: 'text-purple-700', light: 'bg-purple-50', border: 'border-purple-200' },
};

const TIER_BENEFITS = {
  SILVER: ['1x points on purchases', 'Free shipping on orders ₹999+', 'Access to sale events', 'Email support'],
  GOLD: ['2x points on purchases', 'Free shipping on orders ₹499+', 'Early access to sales', 'Birthday bonus (2x points)', 'Priority support'],
  PLATINUM: ['3x points on purchases', 'Always free shipping', 'VIP early access (48hrs)', 'Birthday bonus (3x points)', 'Dedicated account manager', 'Exclusive member gifts'],
};

function RewardCard({ reward, canRedeem, onRedeem }: {
  reward: { id: string; title: string; description: string; pointsRequired: number; value: string; type: string; expiresAt?: string };
  canRedeem: boolean;
  onRedeem: (id: string) => void;
}) {
  const icons: Record<string, React.ReactNode> = {
    DISCOUNT: <ShoppingCart className="h-5 w-5 text-blue-600" />,
    FREE_SHIPPING: <Truck className="h-5 w-5 text-emerald-600" />,
    GIFT: <Gift className="h-5 w-5 text-rose-500" />,
    CASHBACK: <Zap className="h-5 w-5 text-amber-500" />,
  };

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-all ${canRedeem ? 'border-slate-200 hover:border-blue-200' : 'border-slate-100 opacity-75'}`}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
            {icons[reward.type] || <Award className="h-5 w-5 text-slate-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900">{reward.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{reward.description}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-black text-lg text-slate-900">{reward.pointsRequired.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-slate-400">points</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
            Save {reward.value}
          </span>
          <button
            onClick={() => onRedeem(reward.id)}
            disabled={!canRedeem}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              canRedeem
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {canRedeem ? 'Redeem' : `Need ${reward.pointsRequired.toLocaleString('en-IN')} pts`}
          </button>
        </div>
      </div>
    </div>
  );
}

function RewardsContent() {
  const [loyalty, setLoyalty] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState<'rewards' | 'history'>('rewards');

  useEffect(() => {
    accountService.getLoyalty().then(data => {
      setLoyalty(data);
      setLoading(false);
    });
  }, []);

  const handleRedeem = (id: string) => {
    const reward = loyalty?.rewards.find(r => r.id === id);
    if (reward) setToast(`🎉 "${reward.title}" coupon sent to your email!`);
  };

  if (loading || !loyalty) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-slate-200 rounded-2xl" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map(i => <div key={i} className="h-36 bg-slate-200 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  const tierColor = TIER_COLORS[loyalty.tier];
  const pct = Math.round(((loyalty.points - loyalty.tierMinPoints) / (loyalty.tierMaxPoints - loyalty.tierMinPoints)) * 100);

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-4xl mx-auto w-full">
      <PageHeader title="Loyalty & Rewards" description="Earn points on every purchase and redeem for exclusive benefits" />

      {/* Tier Banner */}
      <div className={`bg-gradient-to-br ${tierColor.bg} rounded-2xl p-6 text-white mb-6 relative overflow-hidden`}>
        <div className="absolute right-0 top-0 opacity-10">
          <Crown className="h-40 w-40" />
        </div>
        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Crown className="h-5 w-5" />
              <span className="font-black text-sm uppercase tracking-widest">{loyalty.tier} Tier</span>
            </div>
            <p className="text-5xl font-black mb-1">{loyalty.points.toLocaleString('en-IN')}</p>
            <p className="text-white/70 text-sm mb-4">Available Points</p>

            {loyalty.nextTier && (
              <div>
                <div className="flex items-center justify-between text-xs text-white/70 mb-1.5">
                  <span>{loyalty.tier}</span>
                  <span className="font-semibold">{loyalty.nextTier}</span>
                </div>
                <div className="h-2.5 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-white/70 mt-1.5">
                  {loyalty.pointsToNextTier?.toLocaleString('en-IN')} pts more to reach <span className="font-bold text-white">{loyalty.nextTier}</span>
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="font-bold text-white/80 text-xs uppercase tracking-wider mb-3">Your {loyalty.tier} Benefits</p>
            <div className="space-y-1.5">
              {loyalty.benefits.slice(0, 5).map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </div>
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 max-w-xs">
        {[
          { id: 'rewards' as const, label: 'Redeem Rewards', icon: <Gift className="h-3.5 w-3.5" /> },
          { id: 'history' as const, label: 'Points History', icon: <History className="h-3.5 w-3.5" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rewards Grid */}
      {activeTab === 'rewards' && (
        <div className="space-y-3">
          {loyalty.rewards.map(reward => (
            <RewardCard
              key={reward.id}
              reward={reward}
              canRedeem={loyalty.points >= reward.pointsRequired}
              onRedeem={handleRedeem}
            />
          ))}
        </div>
      )}

      {/* Points History */}
      {activeTab === 'history' && (
        <SectionCard>
          <SectionHeader title="Points History" />
          <div className="divide-y divide-slate-100">
            {loyalty.pointsHistory.map(entry => (
              <div key={entry.id} className="flex items-center gap-4 px-5 py-4">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${entry.type === 'EARNED' ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                  {entry.type === 'EARNED' ? (
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Gift className="h-4 w-4 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 line-clamp-1">{entry.activity}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`font-black text-base ${entry.type === 'EARNED' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {entry.type === 'EARNED' ? '+' : ''}{entry.points.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] text-slate-400">Bal: {entry.balance.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default function RewardsPage() {
  return (
    <AccountLayout>
      <AccountHeader />
      <RewardsContent />
    </AccountLayout>
  );
}
