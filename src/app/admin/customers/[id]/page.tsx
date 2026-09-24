'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Star,
  Clock,
  Edit,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';
import { StatCard } from '@/components/admin/ui/StatCard';
import { adminService } from '@/services/adminService';
import { CustomerProfile, AdminOrder } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';

export default function CustomerProfilePage() {
  const params = useParams();
  const customerId = String(params.id);
  const { addToast } = useAdmin();

  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const cust = await adminService.getCustomerById(customerId);
      if (cust) {
        setCustomer(cust);
        // Load customer orders
        const ordersRes = await adminService.getOrders({ search: cust.name, limit: 10 });
        setOrders(ordersRes.items);
      }
      setIsLoading(false);
    }
    load();
  }, [customerId]);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        Loading customer record...
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-12 text-center">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Customer Not Found
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          No profile matches the provided identifier.
        </p>
        <Link href="/admin/customers">
          <Button variant="outline">Back to Directory</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/customers"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="h-12 w-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {customer.name}
                </h1>
                <Badge
                  variant={customer.group === 'VIP' ? 'purple' : 'info'}
                  size="sm"
                >
                  {customer.group}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {customer.email} • {customer.phone}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              addToast({
                title: 'Email Triggered',
                message: `Opened direct inquiry to ${customer.email}`,
                type: 'info',
              })
            }
            leftIcon={<Mail className="h-4 w-4" />}
          >
            Send Email
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Lifetime Revenue"
          value={`₹${customer.totalSpent.toLocaleString('en-IN')}`}
          icon={<DollarSign className="h-4 w-4" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Orders Count"
          value={customer.totalOrders}
          icon={<ShoppingBag className="h-4 w-4" />}
          iconBg="bg-blue-50 dark:bg-blue-950/60"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Average Order Value"
          value={`₹${customer.averageOrderValue.toLocaleString('en-IN')}`}
          icon={<TrendingUp className="h-4 w-4" />}
          iconBg="bg-purple-50 dark:bg-purple-950/60"
          iconColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Order History ({orders.length})
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.map(o => (
                <div
                  key={o.id}
                  className="py-3.5 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="font-bold text-blue-600 hover:underline dark:text-blue-400 text-sm"
                    >
                      {o.orderNumber}
                    </Link>
                    <div className="text-[11px] text-slate-400">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', {
                        dateStyle: 'medium',
                      })}{' '}
                      • {o.items.length} item{o.items.length > 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-slate-900 dark:text-white">
                      ₹{o.total.toLocaleString('en-IN')}
                    </div>
                    <Badge variant="neutral" size="sm">
                      {o.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Address & Notes */}
        <div className="space-y-6">
          {/* Default Address */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/90 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Primary Shipping Address
              </h4>
              <MapPin className="h-3.5 w-3.5 text-blue-500" />
            </div>
            {customer.addresses[0] && (
              <>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {customer.addresses[0].fullName}
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {customer.addresses[0].street}
                  <br />
                  {customer.addresses[0].city}, {customer.addresses[0].state} -{' '}
                  {customer.addresses[0].pincode}
                </p>
                <p className="text-slate-500 font-mono">
                  {customer.addresses[0].phone}
                </p>
              </>
            )}
          </div>

          {/* CRM Notes */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/90 space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Internal Team Notes
            </h4>
            <p className="text-slate-600 dark:text-slate-300 italic bg-slate-50 p-3 rounded-lg border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
              &quot;{customer.notes || 'No custom notes recorded for this customer profile.'}&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
