'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Eye,
  Mail,
  Phone,
  ShieldAlert,
  Sparkles,
  ShoppingBag,
  DollarSign
} from 'lucide-react';
import { DataTable, Column } from '@/components/admin/ui/DataTable';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import { StatCard } from '@/components/admin/ui/StatCard';
import { adminService } from '@/services/adminService';
import { CustomerProfile } from '@/types/admin';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [groupFilter, setGroupFilter] = useState('all');

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const res = await adminService.getCustomers({ group: groupFilter });
      setCustomers(res.items);
      setIsLoading(false);
    }
    load();
  }, [groupFilter]);

  const totalSpentAll = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const vipCount = customers.filter(c => c.group === 'VIP').length;

  const columns: Column<CustomerProfile>[] = [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      render: c => (
        <div className="flex items-center gap-3">
          <img
            src={c.avatar}
            alt={c.name}
            className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
          />
          <div>
            <Link
              href={`/admin/customers/${c.id}`}
              className="font-semibold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 block"
            >
              {c.name}
            </Link>
            <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
              {c.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Contact Phone',
      render: c => (
        <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
          {c.phone}
        </span>
      ),
    },
    {
      key: 'group',
      header: 'Group Tier',
      sortable: true,
      render: c => (
        <Badge
          variant={
            c.group === 'VIP'
              ? 'purple'
              : c.group === 'Regular'
              ? 'info'
              : c.group === 'Blocked'
              ? 'danger'
              : 'neutral'
          }
          size="sm"
        >
          {c.group}
        </Badge>
      ),
    },
    {
      key: 'totalOrders',
      header: 'Orders',
      sortable: true,
      render: c => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {c.totalOrders} order{c.totalOrders > 1 ? 's' : ''}
        </span>
      ),
    },
    {
      key: 'totalSpent',
      header: 'Lifetime Spend',
      sortable: true,
      render: c => (
        <span className="font-bold text-slate-900 dark:text-white">
          ₹{c.totalSpent.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'lastOrderDate',
      header: 'Last Active',
      sortable: true,
      render: c => (
        <span className="text-xs text-slate-400 font-mono">
          {c.lastOrderDate}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: c => (
        <Link href={`/admin/customers/${c.id}`}>
          <Button variant="outline" size="sm" leftIcon={<Eye className="h-3.5 w-3.5" />}>
            Profile
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Customer Directory
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          View customer lifetime value, historical order trajectories, and VIP tiers
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Registered Shoppers"
          value={customers.length}
          icon={<Users className="h-4 w-4" />}
          iconBg="bg-blue-50 dark:bg-blue-950/60"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="VIP Club Members"
          value={vipCount}
          icon={<Sparkles className="h-4 w-4" />}
          iconBg="bg-purple-50 dark:bg-purple-950/60"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <StatCard
          title="Cumulative Spend"
          value={`₹${(totalSpentAll / 100000).toFixed(1)}L`}
          icon={<DollarSign className="h-4 w-4" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
      </div>

      <DataTable
        columns={columns}
        data={customers}
        keyField="id"
        searchPlaceholder="Search customers by name, email or mobile..."
        searchField={c => `${c.name} ${c.email} ${c.phone}`}
        exportFilename="selbar_customer_directory"
        filterOptions={[
          {
            label: 'Group Tier',
            currentValue: groupFilter,
            onFilterChange: setGroupFilter,
            options: [
              { label: 'All Customer Groups', value: 'all' },
              { label: 'VIP Shoppers', value: 'VIP' },
              { label: 'Regular', value: 'Regular' },
              { label: 'New', value: 'New' },
              { label: 'Blocked', value: 'Blocked' },
            ],
          },
        ]}
      />
    </div>
  );
}
