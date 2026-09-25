'use client';

import React, { useState, useEffect } from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { PageHeader, SectionCard, SectionHeader, Toast, ConfirmModal, EmptyState } from '@/components/account/ui';
import { accountService } from '@/lib/account/mockData';
import { PaymentMethod } from '@/types/account';
import { CreditCard, Plus, Trash2, Star, Check, Shield } from 'lucide-react';

const CARD_BRAND_LOGOS: Record<string, { text: string; bg: string; color: string }> = {
  VISA: { text: 'VISA', bg: 'bg-blue-600', color: 'text-white' },
  MASTERCARD: { text: 'MC', bg: 'bg-orange-500', color: 'text-white' },
  RUPAY: { text: 'RuPay', bg: 'bg-emerald-600', color: 'text-white' },
  AMEX: { text: 'AMEX', bg: 'bg-indigo-700', color: 'text-white' },
};

function CreditCardVisual({ pm }: { pm: PaymentMethod }) {
  const brand = pm.cardBrand ? CARD_BRAND_LOGOS[pm.cardBrand] : null;
  return (
    <div className="relative h-44 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white shadow-lg">
      {/* Background pattern */}
      <div className="absolute right-0 top-0 h-full opacity-10">
        <div className="absolute right-8 top-8 h-32 w-32 rounded-full border-4 border-white" />
        <div className="absolute right-24 top-24 h-16 w-16 rounded-full border-2 border-white" />
      </div>
      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <div className="h-6 w-8 rounded-sm bg-amber-400" />
            <div className="h-3 w-6 rounded-sm bg-amber-300/50 ml-1" />
          </div>
          {brand && (
            <div className={`px-2.5 py-1 rounded-lg ${brand.bg} ${brand.color} text-xs font-black`}>
              {brand.text}
            </div>
          )}
        </div>
        <div className="flex-1 flex items-center">
          <p className="font-mono text-lg tracking-widest text-white/90">•••• •••• •••• {pm.maskedNumber}</p>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/50 text-[9px] uppercase tracking-widest">Card Holder</p>
            <p className="font-semibold text-sm">Rahul Sharma</p>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-[9px] uppercase tracking-widest">Expires</p>
            <p className="font-semibold text-sm">{String(pm.expiryMonth).padStart(2, '0')}/{String(pm.expiryYear).slice(-2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentMethodCard({ pm, onDelete, onSetDefault }: {
  pm: PaymentMethod;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}) {
  const typeConfig: Record<string, { icon: React.ReactNode; bg: string; label: string }> = {
    UPI: { icon: <span className="text-emerald-600 font-black text-[10px]">UPI</span>, bg: 'bg-emerald-50', label: 'UPI' },
    WALLET: { icon: <span className="text-purple-600 font-black text-[10px]">W</span>, bg: 'bg-purple-50', label: 'Wallet' },
    NETBANKING: { icon: <span className="text-blue-600 font-black text-[10px]">NET</span>, bg: 'bg-blue-50', label: 'Net Banking' },
  };

  const isCard = pm.type === 'CARD';

  if (isCard) {
    return (
      <div className={`relative rounded-2xl border overflow-hidden ${pm.isDefault ? 'border-blue-200' : 'border-slate-100'}`}>
        <CreditCardVisual pm={pm} />
        {pm.isDefault && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full">
            <Check className="h-2.5 w-2.5" />
            DEFAULT
          </div>
        )}
        <div className="bg-white p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">{pm.label}</p>
            <p className="text-xs text-slate-400">Expires {pm.expiryMonth}/{pm.expiryYear}</p>
          </div>
          <div className="flex gap-2">
            {!pm.isDefault && (
              <button
                onClick={() => onSetDefault(pm.id)}
                className="px-3 py-1.5 rounded-xl border border-blue-200 text-xs font-bold text-blue-600 hover:bg-blue-50 transition"
              >
                Set Default
              </button>
            )}
            <button
              onClick={() => onDelete(pm.id)}
              className="p-1.5 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 transition"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const config = typeConfig[pm.type] || typeConfig.UPI;
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border bg-white transition hover:shadow-sm ${pm.isDefault ? 'border-blue-200 shadow-sm shadow-blue-50' : 'border-slate-100'}`}>
      <div className={`h-12 w-12 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-900">{pm.label}</p>
          {pm.isDefault && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-0.5">
              <Check className="h-2.5 w-2.5" />
              Default
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400">{pm.upiId || pm.walletName || pm.bankName}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        {!pm.isDefault && (
          <button onClick={() => onSetDefault(pm.id)} className="p-1.5 rounded-xl border border-blue-200 text-blue-500 hover:bg-blue-50 transition">
            <Star className="h-4 w-4" />
          </button>
        )}
        <button onClick={() => onDelete(pm.id)} className="p-1.5 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 transition">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function PaymentMethodsContent() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [addType, setAddType] = useState<'CARD' | 'UPI'>('CARD');
  const [upiInput, setUpiInput] = useState('');

  useEffect(() => {
    accountService.getPaymentMethods().then(data => {
      setMethods(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = (id: string) => {
    setMethods(prev => prev.filter(m => m.id !== id));
    setDeleteId(null);
    setToast('Payment method removed.');
  };

  const handleSetDefault = (id: string) => {
    setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
    setToast('Default payment method updated!');
  };

  const handleAddUpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiInput.includes('@')) return;
    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: 'UPI',
      label: 'UPI',
      upiId: upiInput,
      isDefault: false,
    };
    setMethods(prev => [...prev, newMethod]);
    setShowAddForm(false);
    setUpiInput('');
    setToast('UPI ID added successfully!');
  };

  const cards = methods.filter(m => m.type === 'CARD');
  const others = methods.filter(m => m.type !== 'CARD');

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-3xl mx-auto w-full">
      <PageHeader
        title="Payment Methods"
        description="Manage your saved payment options"
        action={
          <button
            onClick={() => setShowAddForm(s => !s)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Method
          </button>
        }
      />

      {/* Add Form */}
      {showAddForm && (
        <SectionCard className="mb-5">
          <SectionHeader title="Add Payment Method" />
          <div className="p-5 space-y-4">
            <div className="flex gap-2">
              {(['CARD', 'UPI'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setAddType(t)}
                  className={`px-4 py-2 rounded-xl border text-sm font-semibold transition ${addType === t ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  {t === 'CARD' ? '💳 Credit / Debit Card' : '📱 UPI ID'}
                </button>
              ))}
            </div>

            {addType === 'CARD' && (
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  You'll be redirected to a secure payment gateway to add your card.
                </p>
                <button className="mt-3 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition">
                  Add Card Securely
                </button>
              </div>
            )}

            {addType === 'UPI' && (
              <form onSubmit={handleAddUpi} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">UPI ID</label>
                  <input
                    required
                    value={upiInput}
                    onChange={e => setUpiInput(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition">
                    Verify & Add
                  </button>
                </div>
              </form>
            )}
          </div>
        </SectionCard>
      )}

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-200 rounded-2xl" />)}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cards */}
          {cards.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Debit / Credit Cards
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cards.map(pm => (
                  <PaymentMethodCard key={pm.id} pm={pm} onDelete={id => setDeleteId(id)} onSetDefault={handleSetDefault} />
                ))}
              </div>
            </div>
          )}

          {/* Others */}
          {others.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-700 text-sm mb-3">UPI, Wallets & Net Banking</h2>
              <div className="space-y-3">
                {others.map(pm => (
                  <PaymentMethodCard key={pm.id} pm={pm} onDelete={id => setDeleteId(id)} onSetDefault={handleSetDefault} />
                ))}
              </div>
            </div>
          )}

          {methods.length === 0 && (
            <EmptyState
              icon={<CreditCard className="h-8 w-8" />}
              title="No payment methods saved"
              description="Add a payment method for faster and easier checkout."
            />
          )}

          {/* Security Note */}
          <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200/60 rounded-2xl">
            <Shield className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">Your payment info is secure</p>
              <p className="text-xs text-emerald-700 mt-0.5">We use 256-bit SSL encryption and never store your CVV number. All payments are PCI-DSS compliant.</p>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Remove Payment Method"
        description="Are you sure you want to remove this payment method? You'll need to re-add it to use it again."
        confirmLabel="Remove"
        variant="danger"
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default function PaymentMethodsPage() {
  return (
    <AccountLayout>
      <AccountHeader />
      <PaymentMethodsContent />
    </AccountLayout>
  );
}
