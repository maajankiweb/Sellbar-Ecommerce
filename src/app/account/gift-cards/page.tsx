'use client';

import React, { useState, useEffect } from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { PageHeader, SectionCard, SectionHeader, Toast, EmptyState } from '@/components/account/ui';
import { accountService } from '@/lib/account/mockData';
import { GiftCard } from '@/types/account';
import { Gift, Plus, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const STATUS_CONFIG = {
  ACTIVE: { label: 'Active', cls: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle className="h-3.5 w-3.5" /> },
  USED: { label: 'Used', cls: 'bg-slate-100 text-slate-500', icon: <CheckCircle className="h-3.5 w-3.5" /> },
  EXPIRED: { label: 'Expired', cls: 'bg-rose-100 text-rose-600', icon: <XCircle className="h-3.5 w-3.5" /> },
};

function GiftCardItem({ card }: { card: GiftCard }) {
  const config = STATUS_CONFIG[card.status];
  const pct = Math.round((card.balance / card.originalAmount) * 100);

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-all ${card.status === 'ACTIVE' ? 'border-emerald-200/70' : 'border-slate-100 opacity-80'}`}>
      {/* Visual */}
      <div className={`relative p-5 ${card.status === 'ACTIVE' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-slate-400 to-slate-500'}`}>
        <div className="absolute right-0 top-0 opacity-10">
          <Gift className="h-24 w-24" />
        </div>
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${config.cls}`}>
              {config.icon}
              {config.label}
            </span>
            <Gift className="h-5 w-5 text-white/80" />
          </div>
          <p className="text-3xl font-black text-white mb-1">₹{card.balance.toLocaleString('en-IN')}</p>
          <p className="text-white/70 text-xs">of ₹{card.originalAmount.toLocaleString('en-IN')} original value</p>

          {card.status === 'ACTIVE' && (
            <div className="mt-3">
              <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-white/70 text-[10px] mt-1">{pct}% remaining</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Gift Card Code</p>
            <p className="font-mono text-sm font-bold text-slate-900 tracking-wider">{card.code}</p>
          </div>
          {card.status === 'ACTIVE' && (
            <button className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition">
              Use at Checkout
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          {card.status === 'ACTIVE'
            ? `Valid until ${new Date(card.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
            : card.status === 'EXPIRED'
            ? `Expired on ${new Date(card.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
            : `Fully used · Redeemed ${new Date(card.redeemedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
          }
        </div>
      </div>
    </div>
  );
}

function GiftCardsContent() {
  const [cards, setCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemCode, setRedeemCode] = useState('');
  const [toast, setToast] = useState('');
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    accountService.getGiftCards().then(data => {
      setCards(data);
      setLoading(false);
    });
  }, []);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!redeemCode.trim()) return;
    setRedeeming(true);
    await new Promise(r => setTimeout(r, 1000));
    const newCard: GiftCard = {
      id: `gc_${Date.now()}`,
      code: redeemCode.toUpperCase(),
      balance: 1000,
      originalAmount: 1000,
      expiryDate: '2027-03-31',
      redeemedAt: new Date().toISOString(),
      status: 'ACTIVE',
    };
    setCards(prev => [newCard, ...prev]);
    setRedeemCode('');
    setRedeeming(false);
    setToast('Gift card added! ₹1,000 is now available for use.');
  };

  const active = cards.filter(c => c.status === 'ACTIVE');
  const past = cards.filter(c => c.status !== 'ACTIVE');

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-3xl mx-auto w-full">
      <PageHeader title="Gift Cards" description="Manage and redeem your SELBAR gift cards" />

      {/* Redeem Form */}
      <SectionCard className="mb-6">
        <SectionHeader title="Redeem a Gift Card" />
        <form onSubmit={handleRedeem} className="p-5 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Gift className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                required
                value={redeemCode}
                onChange={e => setRedeemCode(e.target.value.toUpperCase())}
                placeholder="Enter gift card code (e.g. GIFT-SELB-XXXX-YYYY)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={redeeming}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-60 flex items-center gap-2 shrink-0"
            >
              {redeeming ? <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="h-4 w-4" />}
              {redeeming ? 'Verifying...' : 'Redeem'}
            </button>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Gift cards are credited instantly and can be used at checkout.
          </p>
        </form>
      </SectionCard>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map(i => <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse" />)}
        </div>
      ) : cards.length === 0 ? (
        <EmptyState
          icon={<Gift className="h-8 w-8" />}
          title="No gift cards"
          description="Redeem a gift card code above to add store credit to your account."
        />
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-900 mb-3">Active Gift Cards ({active.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {active.map(card => <GiftCardItem key={card.id} card={card} />)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-500 mb-3">Past Gift Cards</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-75">
                {past.map(card => <GiftCardItem key={card.id} card={card} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default function GiftCardsPage() {
  return (
    <AccountLayout>
      <AccountHeader />
      <GiftCardsContent />
    </AccountLayout>
  );
}
