'use client';

import React, { useState, useEffect } from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { PageHeader, SectionCard, SectionHeader, Toast } from '@/components/account/ui';
import { accountService } from '@/lib/account/mockData';
import { WalletData } from '@/types/account';
import {
  Wallet, ArrowUpRight, ArrowDownLeft, Plus, Gift, Info,
  Clock, AlertCircle, CreditCard, ChevronRight
} from 'lucide-react';

function WalletContent() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [redeemCode, setRedeemCode] = useState('');

  useEffect(() => {
    accountService.getWallet().then(data => {
      setWallet(data);
      setLoading(false);
    });
  }, []);

  const handleRedeem = () => {
    if (!redeemCode.trim()) return;
    setToast('Gift card applied! ₹2,000 added to wallet.');
    setRedeemCode('');
  };

  if (loading || !wallet) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-slate-200 rounded-2xl" />
          <div className="h-48 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-3xl mx-auto w-full">
      <PageHeader title="Wallet & Store Credit" description="Manage your SELBAR wallet balance and store credits" />

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10">
          <Wallet className="h-40 w-40" />
        </div>
        <div className="relative">
          <p className="text-white/70 text-sm mb-1">Total Wallet Balance</p>
          <p className="text-5xl font-black mb-4">₹{wallet.availableBalance.toLocaleString('en-IN')}</p>

          {wallet.pendingBalance > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-white/70" />
              <span className="text-sm text-white/80">₹{wallet.pendingBalance.toLocaleString('en-IN')} pending credit</span>
            </div>
          )}

          {wallet.expiringCredit > 0 && (
            <div className="flex items-center gap-2 bg-amber-500/30 rounded-xl px-3 py-2">
              <AlertCircle className="h-4 w-4 text-amber-200" />
              <span className="text-sm text-white">
                ₹{wallet.expiringCredit.toLocaleString('en-IN')} expiring on {new Date(wallet.expiryDate!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Redeem Gift Card */}
      <SectionCard className="mb-5">
        <SectionHeader title="Redeem Gift Card / Coupon" />
        <div className="p-5">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Gift className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={redeemCode}
                onChange={e => setRedeemCode(e.target.value.toUpperCase())}
                placeholder="Enter code (e.g. GIFT-SELB-XXXX-YYYY)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-slate-50 uppercase"
              />
            </div>
            <button
              onClick={handleRedeem}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition flex items-center gap-2 shrink-0"
            >
              <Plus className="h-4 w-4" />
              Apply
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <Info className="h-3.5 w-3.5" />
            Enter gift card or promo code to add balance to your wallet
          </p>
        </div>
      </SectionCard>

      {/* How to Use */}
      <SectionCard className="mb-5">
        <SectionHeader title="How Wallet Works" />
        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <ArrowDownLeft className="h-5 w-5 text-emerald-600" />, title: 'Get Credits', desc: 'Earn via referrals, orders, refunds, and promotions', bg: 'bg-emerald-50' },
            { icon: <CreditCard className="h-5 w-5 text-blue-600" />, title: 'Use at Checkout', desc: 'Apply wallet balance to pay for your orders', bg: 'bg-blue-50' },
            { icon: <Gift className="h-5 w-5 text-purple-600" />, title: 'Never Loses Value', desc: 'Balance stays until you use it (some credits expire)', bg: 'bg-purple-50' },
          ].map(item => (
            <div key={item.title} className="flex gap-3 p-3 rounded-xl bg-slate-50">
              <div className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Transaction History */}
      <SectionCard>
        <SectionHeader title="Transaction History" />
        <div className="divide-y divide-slate-100">
          {wallet.transactions.map(txn => (
            <div key={txn.id} className="flex items-center gap-4 px-5 py-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${txn.type === 'CREDIT' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                {txn.type === 'CREDIT' ? (
                  <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-rose-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">{txn.description}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className={`font-black text-base ${txn.type === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-slate-400">Bal: ₹{txn.balanceAfter.toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default function WalletPage() {
  return (
    <AccountLayout>
      <AccountHeader />
      <WalletContent />
    </AccountLayout>
  );
}
