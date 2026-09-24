'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Mail,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Percent
} from 'lucide-react';
import { StatCard } from '@/components/admin/ui/StatCard';
import { DataTable, Column } from '@/components/admin/ui/DataTable';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import { useAdmin } from '@/context/AdminContext';

interface AbandonedCartItem {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  itemsCount: number;
  itemNames: string;
  cartValue: number;
  abandonedAt: string;
  recoveryStatus: 'unsent' | 'email_sent' | 'recovered';
}

export default function AdminAbandonedCartsPage() {
  const { addToast } = useAdmin();
  const [carts, setCarts] = useState<AbandonedCartItem[]>([
    {
      id: 'cart-1',
      customerName: 'Kunal Singhania',
      email: 'kunal.s@gmail.com',
      phone: '+91 98200 44112',
      itemsCount: 1,
      itemNames: 'Apple iPhone 15 Pro (Natural Titanium)',
      cartValue: 124999,
      abandonedAt: '2 hours ago',
      recoveryStatus: 'unsent',
    },
    {
      id: 'cart-2',
      customerName: 'Ananya Deshmukh',
      email: 'ananya.d@outlook.com',
      phone: '+91 97110 55223',
      itemsCount: 2,
      itemNames: 'Sony WH-1000XM5, Anker 737 Power Bank',
      cartValue: 38989,
      abandonedAt: '5 hours ago',
      recoveryStatus: 'email_sent',
    },
    {
      id: 'cart-3',
      customerName: 'Varun Nair',
      email: 'varun.nair@techco.in',
      phone: '+91 99220 88991',
      itemsCount: 1,
      itemNames: 'Apple MacBook Air M3 (Starlight)',
      cartValue: 134900,
      abandonedAt: '1 day ago',
      recoveryStatus: 'recovered',
    },
  ]);

  const handleSendRecovery = (id: string, channel: 'email' | 'whatsapp') => {
    setCarts(prev =>
      prev.map(c => (c.id === id ? { ...c, recoveryStatus: 'email_sent' } : c))
    );
    addToast({
      title: 'Recovery Notification Sent',
      message: `Automated 5% incentive discount sent via ${channel.toUpperCase()}.`,
      type: 'success',
    });
  };

  const columns: Column<AbandonedCartItem>[] = [
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: c => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">
            {c.customerName}
          </div>
          <div className="text-[11px] text-slate-400">
            {c.email} • {c.phone}
          </div>
        </div>
      ),
    },
    {
      key: 'itemNames',
      header: 'Items in Bag',
      render: c => (
        <div>
          <div className="font-medium text-slate-800 dark:text-slate-200 text-xs">
            {c.itemNames}
          </div>
          <span className="text-[10px] text-slate-400">
            {c.itemsCount} total item{c.itemsCount > 1 ? 's' : ''}
          </span>
        </div>
      ),
    },
    {
      key: 'cartValue',
      header: 'Value',
      sortable: true,
      render: c => (
        <span className="font-bold text-slate-900 dark:text-white">
          ₹{c.cartValue.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'abandonedAt',
      header: 'Dropped',
      render: c => (
        <span className="text-xs text-slate-400 font-mono">
          {c.abandonedAt}
        </span>
      ),
    },
    {
      key: 'recoveryStatus',
      header: 'Status',
      render: c => (
        <Badge
          variant={
            c.recoveryStatus === 'recovered'
              ? 'success'
              : c.recoveryStatus === 'email_sent'
              ? 'warning'
              : 'neutral'
          }
          size="sm"
        >
          {c.recoveryStatus.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Trigger Campaign',
      className: 'text-right',
      render: c => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSendRecovery(c.id, 'email')}
            leftIcon={<Mail className="h-3.5 w-3.5" />}
          >
            Email
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSendRecovery(c.id, 'whatsapp')}
            leftIcon={<MessageSquare className="h-3.5 w-3.5" />}
            className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
          >
            WhatsApp
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Abandoned Cart Recovery
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Recover lost revenue with targeted multi-channel email, SMS, and WhatsApp retention triggers
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Potential Lost Revenue"
          value="₹2,98,888"
          icon={<ShoppingBag className="h-4 w-4" />}
          iconBg="bg-rose-50 dark:bg-rose-950/60"
          iconColor="text-rose-600 dark:text-rose-400"
        />
        <StatCard
          title="Carts Recovered"
          value="18.2%"
          change={3.4}
          icon={<TrendingUp className="h-4 w-4" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Recovered Value (30D)"
          value="₹1,34,900"
          icon={<DollarSign className="h-4 w-4" />}
          iconBg="bg-blue-50 dark:bg-blue-950/60"
          iconColor="text-blue-600 dark:text-blue-400"
        />
      </div>

      <DataTable
        columns={columns}
        data={carts}
        keyField="id"
        searchPlaceholder="Search abandoned carts by customer name or phone..."
        exportFilename="selbar_abandoned_carts"
      />
    </div>
  );
}
