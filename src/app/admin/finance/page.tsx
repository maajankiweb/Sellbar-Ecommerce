'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  CreditCard,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  RotateCcw
} from 'lucide-react';
import { StatCard } from '@/components/admin/ui/StatCard';
import { DataTable, Column } from '@/components/admin/ui/DataTable';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import { ExportDropdown } from '@/components/admin/ui/ExportDropdown';

interface Transaction {
  id: string;
  txNumber: string;
  orderNumber: string;
  type: 'sale' | 'refund' | 'payout';
  amount: number;
  gateway: string;
  status: 'settled' | 'pending' | 'failed';
  date: string;
}

export default function AdminFinancePage() {
  const transactions: Transaction[] = [
    { id: 'tx-1', txNumber: 'TXN-992101', orderNumber: 'ORD-10245', type: 'sale', amount: 128994, gateway: 'Razorpay UPI', status: 'settled', date: '2026-09-24 10:15' },
    { id: 'tx-2', txNumber: 'TXN-992100', orderNumber: 'ORD-10244', type: 'sale', amount: 25990, gateway: 'HDFC Card', status: 'settled', date: '2026-09-23 14:41' },
    { id: 'tx-3', txNumber: 'TXN-992099', orderNumber: 'ORD-10241', type: 'refund', amount: 134900, gateway: 'ICICI NetBanking', status: 'settled', date: '2026-09-19 10:15' },
    { id: 'tx-4', txNumber: 'PAY-4412', orderNumber: 'Settlement #88', type: 'payout', amount: 482500, gateway: 'HDFC Current A/C', status: 'settled', date: '2026-09-18 18:00' },
  ];

  const columns: Column<Transaction>[] = [
    {
      key: 'txNumber',
      header: 'Transaction ID',
      sortable: true,
      render: t => (
        <div>
          <span className="font-mono font-bold text-slate-900 dark:text-white block">
            {t.txNumber}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {t.orderNumber}
          </span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: t => (
        <span
          className={`rounded-md px-2 py-0.5 text-xs font-semibold capitalize ${
            t.type === 'sale'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              : t.type === 'refund'
              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
              : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
          }`}
        >
          {t.type}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: t => (
        <span
          className={`font-bold ${
            t.type === 'refund'
              ? 'text-rose-600'
              : 'text-slate-900 dark:text-white'
          }`}
        >
          {t.type === 'refund' ? '-' : '+'}₹{t.amount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'gateway',
      header: 'Gateway Channel',
      render: t => (
        <span className="text-xs text-slate-600 dark:text-slate-300">
          {t.gateway}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Settlement Status',
      render: t => (
        <Badge variant={t.status === 'settled' ? 'success' : 'warning'} size="sm">
          {t.status}
        </Badge>
      ),
    },
    {
      key: 'date',
      header: 'Date & Time',
      sortable: true,
      render: t => (
        <span className="text-xs text-slate-400 font-mono">
          {t.date}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Finance & Settlements
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Track bank disbursements, GST tax liabilities, merchant fees, and transaction ledgers
          </p>
        </div>

        <ExportDropdown filename="selbar_financial_statement" data={transactions} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Net Revenue"
          value="₹12,48,500"
          change={18.4}
          icon={<DollarSign className="h-4 w-4" />}
          iconBg="bg-blue-50 dark:bg-blue-950/60"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Total Settlements"
          value="₹11,13,600"
          icon={<CreditCard className="h-4 w-4" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Total Refunds"
          value="₹1,34,900"
          icon={<RotateCcw className="h-4 w-4" />}
          iconBg="bg-rose-50 dark:bg-rose-950/60"
          iconColor="text-rose-600 dark:text-rose-400"
        />
        <StatCard
          title="Accrued GST (18%)"
          value="₹2,24,730"
          icon={<FileSpreadsheet className="h-4 w-4" />}
          iconBg="bg-purple-50 dark:bg-purple-950/60"
          iconColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      <DataTable
        columns={columns}
        data={transactions}
        keyField="id"
        searchPlaceholder="Search transactions by reference number..."
        exportFilename="selbar_transactions_ledger"
      />
    </div>
  );
}
