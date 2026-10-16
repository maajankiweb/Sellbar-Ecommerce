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
  RotateCcw,
  AlertTriangle,
  ShieldAlert,
  Check,
  XCircle
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

interface SellerPayoutItem {
  id: string;
  orderNumber: string;
  sellerName: string;
  phone: string;
  payoutMode: 'UPI' | 'Instant Cash';
  amount: number;
  utr?: string;
  handoverOtpVerified: boolean;
  sellerIdCaptured: boolean;
  mismatchFlag?: 'UTR_MISSING' | 'AMOUNT_DISCREPANCY' | 'ID_MISSING' | 'NONE';
  requiresAdminApproval: boolean;
  adminApproved: boolean;
  status: 'PENDING_APPROVAL' | 'RECONCILED' | 'FLAGGED_MISMATCH';
  date: string;
}

export default function AdminFinancePage() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'seller_payouts'>('seller_payouts');

  const [payouts, setPayouts] = useState<SellerPayoutItem[]>([
    {
      id: 'pay-1',
      orderNumber: 'SB-2026-104928',
      sellerName: 'Vikram Roy',
      phone: '+91 98350 11223',
      payoutMode: 'UPI',
      amount: 42500,
      utr: 'UTR492019482910',
      handoverOtpVerified: true,
      sellerIdCaptured: true,
      mismatchFlag: 'NONE',
      requiresAdminApproval: true,
      adminApproved: false,
      status: 'PENDING_APPROVAL',
      date: '2026-10-15 14:20',
    },
    {
      id: 'pay-2',
      orderNumber: 'SB-2026-104919',
      sellerName: 'Rohit Kumar',
      phone: '+91 91234 56789',
      payoutMode: 'UPI',
      amount: 8500,
      utr: '',
      handoverOtpVerified: true,
      sellerIdCaptured: true,
      mismatchFlag: 'UTR_MISSING',
      requiresAdminApproval: false,
      adminApproved: false,
      status: 'FLAGGED_MISMATCH',
      date: '2026-10-15 11:05',
    },
    {
      id: 'pay-3',
      orderNumber: 'SB-2026-104880',
      sellerName: 'Anita Gupta',
      phone: '+91 94312 99881',
      payoutMode: 'Instant Cash',
      amount: 6200,
      handoverOtpVerified: true,
      sellerIdCaptured: false,
      mismatchFlag: 'ID_MISSING',
      requiresAdminApproval: false,
      adminApproved: false,
      status: 'FLAGGED_MISMATCH',
      date: '2026-10-14 16:40',
    },
    {
      id: 'pay-4',
      orderNumber: 'SB-2026-104855',
      sellerName: 'Kamesh Singh',
      phone: '+91 97711 22334',
      payoutMode: 'Instant Cash',
      amount: 7800,
      handoverOtpVerified: true,
      sellerIdCaptured: true,
      mismatchFlag: 'NONE',
      requiresAdminApproval: false,
      adminApproved: true,
      status: 'RECONCILED',
      date: '2026-10-14 10:15',
    },
  ]);

  const handleApprovePayout = (id: string) => {
    setPayouts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, adminApproved: true, status: 'RECONCILED' } : p
      )
    );
  };

  const transactions: Transaction[] = [
    { id: 'tx-1', txNumber: 'TXN-992101', orderNumber: 'SB-2026-10245', type: 'sale', amount: 128994, gateway: 'Razorpay UPI', status: 'settled', date: '2026-09-24 10:15' },
    { id: 'tx-2', txNumber: 'TXN-992100', orderNumber: 'SB-2026-10244', type: 'sale', amount: 25990, gateway: 'HDFC Card', status: 'settled', date: '2026-09-23 14:41' },
    { id: 'tx-3', txNumber: 'TXN-992099', orderNumber: 'SB-2026-10241', type: 'refund', amount: 134900, gateway: 'ICICI NetBanking', status: 'settled', date: '2026-09-19 10:15' },
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

  const payoutColumns: Column<SellerPayoutItem>[] = [
    {
      key: 'orderNumber',
      header: 'Sell Order & Customer',
      sortable: true,
      render: p => (
        <div>
          <span className="font-mono font-bold text-slate-900 dark:text-white block">
            {p.orderNumber}
          </span>
          <span className="text-xs text-slate-500">
            {p.sellerName} • {p.phone}
          </span>
        </div>
      ),
    },
    {
      key: 'payoutMode',
      header: 'Payout Method',
      sortable: true,
      render: p => (
        <span className="rounded-md px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {p.payoutMode}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Disbursement',
      sortable: true,
      render: p => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">
            ₹{p.amount.toLocaleString('en-IN')}
          </span>
          {p.amount > 10000 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 font-semibold dark:text-amber-400">
              <ShieldAlert className="w-3 h-3" />
              Above ₹10k Limit (CD-05)
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'utr',
      header: 'Controls (UTR / OTP / ID)',
      render: p => (
        <div className="space-y-1 text-xs">
          {p.payoutMode === 'UPI' ? (
            <div className="flex items-center gap-1">
              <span className="text-slate-400">UTR:</span>
              {p.utr ? (
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {p.utr}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-rose-600 font-semibold">
                  <XCircle className="w-3 h-3" />
                  Missing UTR (Blocked)
                </span>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-0.5 text-[11px]">
              <span className={p.handoverOtpVerified ? 'text-emerald-600 font-medium' : 'text-rose-600'}>
                OTP: {p.handoverOtpVerified ? '✓ Verified' : '✗ Pending'}
              </span>
              <span className={p.sellerIdCaptured ? 'text-emerald-600 font-medium' : 'text-rose-600 font-semibold'}>
                Seller ID: {p.sellerIdCaptured ? '✓ Captured' : '✗ Missing Proof'}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'mismatchFlag',
      header: 'Reconciliation Audit',
      render: p => {
        if (p.mismatchFlag === 'UTR_MISSING') {
          return (
            <Badge variant="danger" size="sm" dot>
              Mismatch: No UTR
            </Badge>
          );
        }
        if (p.mismatchFlag === 'ID_MISSING') {
          return (
            <Badge variant="danger" size="sm" dot>
              Mismatch: No ID Proof
            </Badge>
          );
        }
        if (p.requiresAdminApproval && !p.adminApproved) {
          return (
            <Badge variant="warning" size="sm" dot>
              Pending Approval (&gt;₹10k)
            </Badge>
          );
        }
        return (
          <Badge variant="success" size="sm" dot>
            Reconciled
          </Badge>
        );
      },
    },
    {
      key: 'id',
      header: 'Action',
      render: p => {
        if (p.status === 'RECONCILED' || p.adminApproved) {
          return (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
              <Check className="w-3.5 h-3.5" />
              Approved
            </span>
          );
        }
        if (p.mismatchFlag && p.mismatchFlag !== 'NONE') {
          return (
            <span className="text-[11px] text-slate-400">
              Fix mismatch first
            </span>
          );
        }
        return (
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleApprovePayout(p.id)}
          >
            Approve Payout
          </Button>
        );
      },
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
            Track bank disbursements, seller payout reconciliation queue, and transaction ledgers (CD-05)
          </p>
        </div>

        <ExportDropdown
          filename={activeTab === 'seller_payouts' ? 'sellbar_seller_payouts_reconciliation' : 'sellbar_financial_statement'}
          data={activeTab === 'seller_payouts' ? payouts : transactions}
        />
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
          title="Pending Payout Approval"
          value="₹42,500"
          icon={<ShieldAlert className="h-4 w-4" />}
          iconBg="bg-amber-50 dark:bg-amber-950/60"
          iconColor="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          title="Accrued GST (18%)"
          value="₹2,24,730"
          icon={<FileSpreadsheet className="h-4 w-4" />}
          iconBg="bg-purple-50 dark:bg-purple-950/60"
          iconColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('seller_payouts')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'seller_payouts'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Seller Payout Reconciliation Queue (CD-05)
          <span className="ml-2 px-2 py-0.5 rounded-full text-[11px] bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            {payouts.filter(p => p.status !== 'RECONCILED').length} Actionable
          </span>
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'transactions'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Merchant Sales & Gateway Ledger
        </button>
      </div>

      {activeTab === 'seller_payouts' ? (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-300">
            <span className="font-bold text-slate-800 dark:text-slate-100">CD-05 Enforcement:</span> UPI transfers require confirmed UTR reference. Cash payouts require Handover OTP + Seller ID capture. Any payout exceeding the configurable per-order threshold (₹10,000) is held for manual admin approval.
          </div>
          <DataTable
            columns={payoutColumns}
            data={payouts}
            keyField="id"
            searchPlaceholder="Search payouts by order number or seller name..."
            exportFilename="sellbar_seller_payout_reconciliation"
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={transactions}
          keyField="id"
          searchPlaceholder="Search transactions by reference number..."
          exportFilename="sellbar_transactions_ledger"
        />
      )}
    </div>
  );
}
