'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Percent,
  Package,
  AlertTriangle,
  ArrowRight,
  Eye,
  FileText,
  Clock,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Calendar,
  Filter
} from 'lucide-react';
import { StatCard } from '@/components/admin/ui/StatCard';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import { RevenueAreaChart } from '@/components/admin/charts/RevenueAreaChart';
import { OrdersBarChart } from '@/components/admin/charts/OrdersBarChart';
import { SalesDonutChart } from '@/components/admin/charts/SalesDonutChart';
import { LocationGeoBreakdown } from '@/components/admin/charts/LocationGeoBreakdown';
import { ConversionFunnelChart } from '@/components/admin/charts/ConversionFunnelChart';
import { adminService } from '@/services/adminService';
import { AdminOrder, AdminProduct, DashboardKPISummary } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { dateRange, setDateRange, addToast, isRefreshing } = useAdmin();
  const [kpi, setKpi] = useState<DashboardKPISummary | null>(null);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [topProducts, setTopProducts] = useState<AdminProduct[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [kpiData, ordersRes, productsRes] = await Promise.all([
        adminService.getDashboardSummary(dateRange),
        adminService.getOrders({ limit: 5 }),
        adminService.getProducts({ limit: 8 }),
      ]);
      setKpi(kpiData);
      setRecentOrders(ordersRes.items);

      // Sort products by salesCount for top products
      const sorted = [...productsRes.items].sort((a, b) => b.salesCount - a.salesCount);
      setTopProducts(sorted.slice(0, 4));

      // Filter low stock products
      const lowStock = productsRes.items.filter(
        p => p.stockStatus === 'low_stock' || p.stockStatus === 'out_of_stock'
      );
      setLowStockProducts(lowStock);
      setIsLoading(false);
    }
    loadData();
  }, [dateRange, isRefreshing]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Processing':
        return 'info';
      case 'Shipped':
        return 'purple';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
      case 'Failed':
        return 'danger';
      case 'Refunded':
      case 'Returned':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Top Banner & Date Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Operational Dashboard
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Real-time sales velocity, order fulfillment pipelines, and inventory alerts
          </p>
        </div>

        {/* Global Date Filter Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={dateRange}
              onChange={e => {
                setDateRange(e.target.value);
                addToast({ title: 'Period Updated', message: `Filtered by ${e.target.value}`, type: 'info' });
              }}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="today">Today (Live)</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="3m">Last 3 Months</option>
              <option value="1y">This Fiscal Year</option>
            </select>
          </div>

          <Link href="/admin/orders">
            <Button variant="primary" size="md">
              View All Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Revenue"
          value={kpi ? `₹${kpi.totalRevenue.toLocaleString('en-IN')}` : '₹12,48,500'}
          change={kpi?.revenueChangePct || 18.4}
          changeText="vs last period"
          icon={<DollarSign className="h-4 w-4" />}
          iconBg="bg-blue-50 dark:bg-blue-950/60"
          iconColor="text-blue-600 dark:text-blue-400"
          sparklineData={[12, 18, 14, 22, 28, 32, 45, 42, 58]}
        />
        <StatCard
          title="Total Orders"
          value={kpi ? kpi.totalOrders : 3248}
          change={kpi?.ordersChangePct || 12.8}
          icon={<ShoppingCart className="h-4 w-4" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
          iconColor="text-emerald-600 dark:text-emerald-400"
          sparklineData={[24, 28, 22, 35, 40, 38, 48, 52, 60]}
        />
        <StatCard
          title="Customers"
          value={kpi ? kpi.totalCustomers : 8492}
          change={kpi?.customersChangePct || 9.6}
          icon={<Users className="h-4 w-4" />}
          iconBg="bg-purple-50 dark:bg-purple-950/60"
          iconColor="text-purple-600 dark:text-purple-400"
          sparklineData={[10, 14, 18, 22, 26, 30, 32, 36, 42]}
        />
        <StatCard
          title="Avg Order Value"
          value={kpi ? `₹${kpi.averageOrderValue.toLocaleString('en-IN')}` : '₹2,840'}
          change={kpi?.aovChangePct || 5.4}
          icon={<TrendingUp className="h-4 w-4" />}
          iconBg="bg-amber-50 dark:bg-amber-950/60"
          iconColor="text-amber-600 dark:text-amber-400"
          sparklineData={[28, 26, 30, 32, 31, 35, 34, 38, 40]}
        />
        <StatCard
          title="Conversion Rate"
          value={kpi ? `${kpi.conversionRate}%` : '3.82%'}
          change={kpi?.conversionChangePct || 0.8}
          icon={<Percent className="h-4 w-4" />}
          iconBg="bg-rose-50 dark:bg-rose-950/60"
          iconColor="text-rose-600 dark:text-rose-400"
          sparklineData={[2.8, 3.1, 3.0, 3.4, 3.5, 3.6, 3.8, 3.82]}
        />
      </div>

      {/* Main Charts Row: Revenue Area Chart (2 cols) & Orders Bar Chart (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueAreaChart initialRange={dateRange} />
        </div>
        <div className="lg:col-span-1">
          <OrdersBarChart />
        </div>
      </div>

      {/* Second Charts Row: Sales Donut, Conversion Funnel, Location Geo Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SalesDonutChart />
        <ConversionFunnelChart />
        <LocationGeoBreakdown />
      </div>

      {/* Operational Grids: Recent Orders & Alerts + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 Columns) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/90 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Recent Orders
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest customer purchases requiring dispatch or verification
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1"
            >
              All Orders <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50/70 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-100 dark:bg-slate-800/50 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Payment</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentOrders.map(order => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-white">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {order.orderNumber}
                      </Link>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {order.items.length} items
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {order.customerName}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={getStatusVariant(order.status)} size="sm" dot>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition-colors"
                        title="View Order Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Low Stock Alerts & Top Products */}
        <div className="space-y-6">
          {/* Low Stock Alert Widget (Section 9) */}
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/30 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200/60 dark:border-amber-900/40">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Low Stock Alerts
                  </h4>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400">
                    Immediate supplier restock required
                  </p>
                </div>
              </div>
              <Link href="/admin/inventory">
                <Button variant="outline" size="sm" className="text-xs">
                  View Inventory
                </Button>
              </Link>
            </div>

            <div className="mt-3.5 space-y-3">
              {lowStockProducts.map(p => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-white p-2.5 shadow-2xs border border-amber-100 dark:bg-slate-900 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="h-9 w-9 rounded-md object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {p.sku}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold shrink-0 ${
                      p.stock === 0
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-400'
                    }`}
                  >
                    {p.stock === 0 ? 'Out of Stock' : `Only ${p.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Products (Section 8) */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Top Products
              </h4>
              <Link
                href="/admin/products"
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                All Products
              </Link>
            </div>

            <div className="mt-3.5 space-y-3">
              {topProducts.map(tp => (
                <div key={tp.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={tp.images[0]}
                      alt={tp.name}
                      className="h-9 w-9 rounded-md object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {tp.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {tp.salesCount} sold • ₹{tp.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    {tp.rating} ★
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
