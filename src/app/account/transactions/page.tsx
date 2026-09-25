'use client';

import React, { useState, useEffect } from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { PageHeader, SectionCard, SectionHeader, Toast, EmptyState } from '@/components/account/ui';
import { accountService } from '@/lib/account/mockData';
import { Transaction } from '@/types/account';
import { ArrowUpRight, ArrowDownLeft, Search, Filter, Download, CreditCard } from 'lucide-react';

const TYPE_ICONS: Record<string, { icon: React.ReactNode; bg: string }> = {
  PAYMENT: { icon: <ArrowUpRight className="h-4 w-4 text-rose-600" />, bg: 'bg-rose-100' },
  REFUND: { icon: <ArrowDownLeft className="h-4 w-4 text-emerald-600" />, bg: 'bg-emerald-100' },
  WALLET_CREDIT: { icon: <ArrowDownLeft className="h-4 w-4 text-blue-600" />, bg: 'bg-blue-100' },
  WALLET_DEBIT: { icon: <ArrowUpRight className="h-4 w-4 text-amber-600" />, bg: 'bg-amber-100' },
  REWARD_REDEMPTION: { icon: <CreditCard className="h-4 w-4 text-purple-600" />, bg: 'bg-purple-100' },
  GIFT_CARD: { icon: <ArrowDownLeft className="h-4 w-4 text-pink-600" />, bg: 'bg-pink-100' },
};

const TYPE_LABELS: Record<string, string> = {
  PAYMENT: 'Payment', REFUND: 'Refund', WALLET_CREDIT: 'Wallet Credit',
  WALLET_DEBIT: 'Wallet Debit', REWARD_REDEMPTION: 'Reward', GIFT_CARD: 'Gift Card',
};

function TransactionsContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    accountService.getTransactions().then(data => {
      setTransactions(data);
      setLoading(false);
    });
  }, []);

  const filtered = transactions.filter(t => {
    const matchType = typeFilter === 'ALL' || t.type === typeFilter;
    const matchSearch = !searchQ || t.description.toLowerCase().includes(searchQ.toLowerCase()) ||
      t.transactionId.toLowerCase().includes(searchQ.toLowerCase());
    return matchType && matchSearch;
  });

  const totalCredited = transactions.filter(t => ['REFUND', 'WALLET_CREDIT', 'GIFT_CARD'].includes(t.type)).reduce((s, t) => s + t.amount, 0);
  const totalDebited = transactions.filter(t => ['PAYMENT', 'WALLET_DEBIT'].includes(t.type)).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-3xl mx-auto w-full">
      <PageHeader
        title="Transactions"
        description="Complete history of your payments and refunds"
        action={
          <button className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <p className="text-xs font-semibold text-emerald-700 mb-1">Total Received</p>
          <p className="text-2xl font-black text-emerald-700">₹{totalCredited.toLocaleString('en-IN')}</p>
          <p className="text-xs text-emerald-600 mt-0.5">Refunds + Credits</p>
        </div>
        <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
          <p className="text-xs font-semibold text-rose-700 mb-1">Total Paid</p>
          <p className="text-2xl font-black text-rose-700">₹{totalDebited.toLocaleString('en-IN')}</p>
          <p className="text-xs text-rose-600 mt-0.5">Payments + Debits</p>
        </div>
      </div>

      {/* Filters */}
      <SectionCard className="mb-5">
        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['ALL', 'PAYMENT', 'REFUND', 'WALLET_CREDIT', 'REWARD_REDEMPTION'].map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  typeFilter === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {t === 'ALL' ? 'All' : TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Transaction List */}
      <SectionCard>
        <SectionHeader title={`${filtered.length} Transactions`} />
        {loading ? (
          <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="px-5 py-4 flex gap-3 animate-pulse">
                <div className="h-10 w-10 rounded-xl bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
                <div className="h-5 bg-slate-200 rounded w-24" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<CreditCard className="h-8 w-8" />}
            title="No transactions found"
            description="Your payment history will appear here."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map(t => {
              const config = TYPE_ICONS[t.type] || { icon: <CreditCard className="h-4 w-4" />, bg: 'bg-slate-100' };
              const isPositive = ['REFUND', 'WALLET_CREDIT', 'GIFT_CARD'].includes(t.type);
              return (
                <div key={t.id} className="flex items-center gap-4 px-5 py-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}>
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 line-clamp-1">{t.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-slate-400">{t.transactionId}</span>
                      <span className="text-slate-200">·</span>
                      <span className="text-xs text-slate-400">
                        {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    {t.paymentMethod && <p className="text-[10px] text-slate-400 mt-0.5">{t.paymentMethod}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-black text-base ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isPositive ? '+' : ''}₹{Math.abs(t.amount).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-slate-400">{TYPE_LABELS[t.type]}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <AccountLayout>
      <AccountHeader />
      <TransactionsContent />
    </AccountLayout>
  );
}
