'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
  Percent,
  Calendar
} from 'lucide-react';
import { StatCard } from '@/components/admin/ui/StatCard';
import { RevenueAreaChart } from '@/components/admin/charts/RevenueAreaChart';
import { OrdersBarChart } from '@/components/admin/charts/OrdersBarChart';
import { SalesDonutChart } from '@/components/admin/charts/SalesDonutChart';
import { ConversionFunnelChart } from '@/components/admin/charts/ConversionFunnelChart';
import { LocationGeoBreakdown } from '@/components/admin/charts/LocationGeoBreakdown';

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState('30d');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            E-Commerce Business Analytics
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Deep dive into gross merchandise value (GMV), conversion funnels, CAC, and category growth
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={range}
            onChange={e => setRange(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="3m">Last Quarter</option>
            <option value="1y">Full Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Gross Merchandise Value"
          value="₹14,02,400"
          change={18.4}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          title="Net Sales (After Returns)"
          value="₹12,48,500"
          change={16.1}
          icon={<ShoppingCart className="h-4 w-4" />}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <StatCard
          title="Customer Retention Rate"
          value="42.8%"
          change={4.2}
          icon={<Users className="h-4 w-4" />}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-50 dark:bg-purple-950/60"
        />
        <StatCard
          title="Avg Lifetime Value (LTV)"
          value="₹38,200"
          change={6.9}
          icon={<TrendingUp className="h-4 w-4" />}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-950/60"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueAreaChart initialRange={range} />
        </div>
        <div className="lg:col-span-1">
          <OrdersBarChart />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SalesDonutChart />
        <ConversionFunnelChart />
        <LocationGeoBreakdown />
      </div>
    </div>
  );
}
