'use client';

import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Percent,
  Plus,
  Play,
  Pause,
  ArrowUpRight
} from 'lucide-react';
import { StatCard } from '@/components/admin/ui/StatCard';
import { DataTable, Column } from '@/components/admin/ui/DataTable';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import { Modal } from '@/components/admin/ui/Modal';
import { adminService } from '@/services/adminService';
import { MarketingCampaign } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';

export default function AdminMarketingPage() {
  const { addToast } = useAdmin();
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Campaign Form
  const [name, setName] = useState('');
  const [channel, setChannel] = useState<'Google Ads' | 'Meta' | 'Email' | 'Influencer'>('Google Ads');
  const [budget, setBudget] = useState<number>(50000);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await adminService.getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalRev = campaigns.reduce((acc, c) => acc + c.revenue, 0);
  const avgRoas = (totalRev / (totalSpend || 1)).toFixed(2);

  const handleCreate = () => {
    if (!name.trim()) return;
    const newCamp: MarketingCampaign = {
      id: `cmp-${Date.now()}`,
      name,
      channel,
      budget: Number(budget),
      spend: 0,
      revenue: 0,
      roas: 0,
      orders: 0,
      conversionRate: 0,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-11-30',
    };
    setCampaigns(prev => [newCamp, ...prev]);
    setIsModalOpen(false);
    setName('');
    addToast({ title: 'Campaign Created', message: `${newCamp.name} is now tracking`, type: 'success' });
  };

  const columns: Column<MarketingCampaign>[] = [
    {
      key: 'name',
      header: 'Campaign Name',
      sortable: true,
      render: c => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">
            {c.name}
          </span>
          <span className="text-[11px] text-slate-400">
            {c.startDate} to {c.endDate}
          </span>
        </div>
      ),
    },
    {
      key: 'channel',
      header: 'Channel',
      sortable: true,
      render: c => (
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {c.channel}
        </span>
      ),
    },
    {
      key: 'budget',
      header: 'Budget / Spend',
      sortable: true,
      render: c => (
        <div className="text-xs">
          <div className="font-bold text-slate-800 dark:text-slate-200">
            ₹{c.spend.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-400">
            of ₹{c.budget.toLocaleString('en-IN')} cap
          </div>
        </div>
      ),
    },
    {
      key: 'revenue',
      header: 'Attributed Revenue',
      sortable: true,
      render: c => (
        <span className="font-bold text-slate-900 dark:text-white">
          ₹{c.revenue.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'roas',
      header: 'ROAS',
      sortable: true,
      render: c => (
        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
          {c.roas}x
        </span>
      ),
    },
    {
      key: 'orders',
      header: 'Orders',
      sortable: true,
      render: c => (
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {c.orders}
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Performance Marketing Dashboard
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Monitor customer acquisition costs (CAC), return on ad spend (ROAS), and promotional channels
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Create Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Ad Spend"
          value={`₹${totalSpend.toLocaleString('en-IN')}`}
          icon={<DollarSign className="h-4 w-4" />}
          iconBg="bg-blue-50 dark:bg-blue-950/60"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Total Attributed Revenue"
          value={`₹${totalRev.toLocaleString('en-IN')}`}
          icon={<ShoppingCart className="h-4 w-4" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Average Blended ROAS"
          value={`${avgRoas}x`}
          change={12.4}
          icon={<TrendingUp className="h-4 w-4" />}
          iconBg="bg-purple-50 dark:bg-purple-950/60"
          iconColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      <DataTable
        columns={columns}
        data={campaigns}
        keyField="id"
        searchPlaceholder="Search campaigns by title or channel..."
        exportFilename="selbar_marketing_campaigns"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Launch Marketing Campaign"
        description="Configure budget caps and channel tracking tags"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Launch Campaign
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Diwali Mega Electronics Drop"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Channel
              </label>
              <select
                value={channel}
                onChange={e => setChannel(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="Google Ads">Google Ads (Search & Shopping)</option>
                <option value="Meta">Meta (Instagram & Facebook)</option>
                <option value="Email">Email Newsletters</option>
                <option value="Influencer">Influencer Affiliate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Budget Cap (₹)
              </label>
              <input
                type="number"
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
