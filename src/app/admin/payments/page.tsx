'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Lock,
  Settings,
  ShieldCheck,
  Smartphone,
  Banknote,
  Building2,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';
import { useAdmin } from '@/context/AdminContext';

interface PaymentProvider {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'test_mode' | 'disabled';
  fee: string;
  icon: string;
  keyId: string;
}

export default function AdminPaymentsPage() {
  const { addToast } = useAdmin();

  const [providers, setProviders] = useState<PaymentProvider[]>([
    { id: 'rzp', name: 'Razorpay Payment Suite', category: 'UPI, Cards & NetBanking', status: 'active', fee: '2.0% + GST', icon: '⚡', keyId: 'rzp_live_••••••••••••' },
    { id: 'stripe', name: 'Stripe International', category: 'Global Credit/Debit Cards', status: 'active', fee: '2.9% + ₹25', icon: '💳', keyId: 'pk_live_••••••••••••' },
    { id: 'cod', name: 'Cash on Delivery (COD)', category: 'Pay at Doorstep', status: 'active', fee: '₹40 handling fee', icon: '💵', keyId: 'N/A' },
    { id: 'paypal', name: 'PayPal Express', category: 'Cross-Border Wallets', status: 'test_mode', fee: '3.4% + $0.30', icon: '🅿️', keyId: 'sb-client-••••••••' },
  ]);

  const toggleStatus = (id: string) => {
    setProviders(prev =>
      prev.map(p => {
        if (p.id === id) {
          const next = p.status === 'active' ? 'disabled' : 'active';
          addToast({ title: 'Gateway Updated', message: `${p.name} marked as ${next}`, type: 'info' });
          return { ...p, status: next };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Payment Gateways & Methods
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Configure transaction routing, merchant keys, webhook signing, and transaction fees
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {providers.map(p => (
          <div
            key={p.id}
            className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/90 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl dark:bg-slate-800">
                    {p.icon}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-400">{p.category}</p>
                  </div>
                </div>

                <Badge
                  variant={p.status === 'active' ? 'success' : p.status === 'test_mode' ? 'warning' : 'neutral'}
                  size="sm"
                  dot={p.status === 'active'}
                >
                  {p.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="mt-5 space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="flex justify-between text-slate-500">
                  <span>Merchant Key ID</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {p.keyId}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Processing Fee</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {p.fee}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> AES-256 GCM
              </span>
              <Button
                variant={p.status === 'active' ? 'outline' : 'primary'}
                size="sm"
                onClick={() => toggleStatus(p.id)}
              >
                {p.status === 'active' ? 'Disable' : 'Enable Live'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
