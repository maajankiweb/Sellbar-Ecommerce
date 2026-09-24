'use client';

import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  Percent,
  DollarSign,
  Calendar,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { DataTable, Column } from '@/components/admin/ui/DataTable';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import { Modal } from '@/components/admin/ui/Modal';
import { adminService } from '@/services/adminService';
import { CouponItem } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';

export default function AdminCouponsPage() {
  const { addToast } = useAdmin();
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Coupon state
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minPurchase, setMinPurchase] = useState<number>(1000);
  const [maxDiscount, setMaxDiscount] = useState<number>(1500);
  const [usageLimit, setUsageLimit] = useState<number>(500);
  const [endDate, setEndDate] = useState('2026-12-31');

  const fetchCoupons = async () => {
    setIsLoading(true);
    const data = await adminService.getCoupons();
    setCoupons(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async () => {
    if (!code.trim()) return;
    await adminService.saveCoupon({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue: Number(discountValue),
      minPurchase: Number(minPurchase),
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      usageLimit: Number(usageLimit),
      endDate,
      status: 'active',
    });
    addToast({
      title: 'Coupon Created',
      message: `Code ${code.toUpperCase()} is active and applicable at checkout.`,
      type: 'success',
    });
    setIsModalOpen(false);
    setCode('');
    setDescription('');
    fetchCoupons();
  };

  const handleDelete = async (id: string) => {
    await adminService.deleteCoupon(id);
    addToast({ title: 'Coupon Removed', message: 'Discount code deactivated.', type: 'info' });
    fetchCoupons();
  };

  const columns: Column<CouponItem>[] = [
    {
      key: 'code',
      header: 'Coupon Code',
      sortable: true,
      render: c => (
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-blue-50 px-2.5 py-1 font-mono font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            {c.code}
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(c.code);
              addToast({ title: 'Code Copied', message: `Copied ${c.code}`, type: 'info' });
            }}
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
            title="Copy code"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Discount Terms',
      render: c => (
        <div>
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {c.discountType === 'percentage'
              ? `${c.discountValue}% OFF`
              : `Flat ₹${c.discountValue.toLocaleString('en-IN')} OFF`}
          </div>
          <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
            {c.description}
          </div>
        </div>
      ),
    },
    {
      key: 'minPurchase',
      header: 'Min Spend',
      sortable: true,
      render: c => (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          ₹{c.minPurchase.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'usageCount',
      header: 'Usage / Cap',
      sortable: true,
      render: c => (
        <div className="text-xs">
          <span className="font-bold text-slate-900 dark:text-white">
            {c.usageCount}
          </span>
          <span className="text-slate-400 font-normal"> / {c.usageLimit}</span>
        </div>
      ),
    },
    {
      key: 'endDate',
      header: 'Expiry Date',
      sortable: true,
      render: c => (
        <span className="text-xs text-slate-500 font-mono">
          {c.endDate}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: c => (
        <Badge variant={c.status === 'active' ? 'success' : 'neutral'} size="sm" dot>
          {c.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      className: 'text-right',
      render: c => (
        <button
          onClick={() => handleDelete(c.id)}
          className="rounded p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
          title="Delete coupon"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Coupons & Discount Rules
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Create promotional voucher codes, minimum purchase conditions, and user redemption limits
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Create Coupon
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={coupons}
        keyField="id"
        searchPlaceholder="Search coupons by code or description..."
        exportFilename="selbar_discount_coupons"
      />

      {/* Create Coupon Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Promotional Coupon"
        description="Configure discount rules, threshold requirements, and expiry dates"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateCoupon}>
              Publish Coupon
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Coupon Voucher Code *
            </label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. FESTIVE2026"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={e => setDiscountType(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹ INR)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Discount Value
              </label>
              <input
                type="number"
                value={discountValue}
                onChange={e => setDiscountValue(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Minimum Cart Total (₹)
              </label>
              <input
                type="number"
                value={minPurchase}
                onChange={e => setMinPurchase(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Max Redemption Limit
              </label>
              <input
                type="number"
                value={usageLimit}
                onChange={e => setUsageLimit(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Public Description
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. 10% instant discount on orders above ₹1,000"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
