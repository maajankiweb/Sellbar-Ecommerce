'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Eye,
  FileText,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { DataTable, Column } from '@/components/admin/ui/DataTable';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import { Modal } from '@/components/admin/ui/Modal';
import { adminService } from '@/services/adminService';
import { AdminOrder, OrderStatus } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';

export default function AdminOrdersPage() {
  const { addToast } = useAdmin();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Quick status update modal state
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Processing');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    const res = await adminService.getOrders({
      status: statusFilter,
      paymentMethod: paymentFilter,
      limit: 100,
    });
    setOrders(res.items);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, paymentFilter]);

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    await adminService.updateOrderStatus(selectedOrder.id, newStatus, statusNote);
    addToast({
      title: 'Order Status Updated',
      message: `${selectedOrder.orderNumber} is now marked as ${newStatus}.`,
      type: 'success',
    });
    setIsUpdating(false);
    setSelectedOrder(null);
    setStatusNote('');
    fetchOrders();
  };

  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Processing':
        return 'info';
      case 'Shipped':
      case 'Packed':
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

  const columns: Column<AdminOrder>[] = [
    {
      key: 'orderNumber',
      header: 'Order ID',
      sortable: true,
      render: o => (
        <div>
          <Link
            href={`/admin/orders/${o.id}`}
            className="font-bold text-blue-600 hover:underline dark:text-blue-400 block"
          >
            {o.orderNumber}
          </Link>
          <div className="text-[11px] text-slate-400">
            {new Date(o.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: o => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">
            {o.customerName}
          </div>
          <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
            {o.customerEmail}
          </div>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      render: o => (
        <div className="text-xs">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {o.items.length} item{o.items.length > 1 ? 's' : ''}
          </span>
          <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
            {o.items.map(i => i.productName).join(', ')}
          </div>
        </div>
      ),
    },
    {
      key: 'total',
      header: 'Total Amount',
      sortable: true,
      render: o => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white">
            ₹{o.total.toLocaleString('en-IN')}
          </span>
          {o.discount > 0 && (
            <div className="text-[10px] text-emerald-600 font-medium">
              Saved ₹{o.discount.toLocaleString('en-IN')}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Payment',
      sortable: true,
      render: o => (
        <div>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {o.paymentMethod}
          </span>
          <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
            {o.paymentStatus}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: o => (
        <Badge variant={getStatusVariant(o.status)} size="sm" dot>
          {o.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: o => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/orders/${o.id}`}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 transition-colors"
            title="Inspect Order Details"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedOrder(o);
              setNewStatus(o.status);
            }}
          >
            Update
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Order Fulfillment Center
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Manage customer orders, track payments, generate manifests, and handle returns
          </p>
        </div>
      </div>

      {/* Status Filter Tab Pills */}
      <div className="flex overflow-x-auto gap-1 border-b border-slate-200 pb-2 dark:border-slate-800 text-xs font-semibold">
        {[
          { label: 'All Orders', value: 'all' },
          { label: 'Pending', value: 'pending' },
          { label: 'Processing', value: 'processing' },
          { label: 'Packed', value: 'packed' },
          { label: 'Shipped', value: 'shipped' },
          { label: 'Delivered', value: 'delivered' },
          { label: 'Cancelled', value: 'cancelled' },
          { label: 'Refunded', value: 'refunded' },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`rounded-lg px-3 py-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              statusFilter === tab.value
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders DataTable */}
      <DataTable
        columns={columns}
        data={orders}
        keyField="id"
        searchPlaceholder="Search orders by ID, customer name or email..."
        searchField={o => `${o.orderNumber} ${o.customerName} ${o.customerEmail}`}
        exportFilename="selbar_orders_report"
        filterOptions={[
          {
            label: 'Payment Method',
            currentValue: paymentFilter,
            onFilterChange: setPaymentFilter,
            options: [
              { label: 'All Payment Methods', value: 'all' },
              { label: 'UPI', value: 'UPI' },
              { label: 'Credit/Debit Card', value: 'Credit/Debit Card' },
              { label: 'Cash on Delivery', value: 'Cash on Delivery' },
              { label: 'Net Banking', value: 'Net Banking' },
            ],
          },
        ]}
      />

      {/* Quick Status Update Modal */}
      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={`Update Order Status: ${selectedOrder?.orderNumber}`}
        description={`Customer: ${selectedOrder?.customerName} • Total: ₹${selectedOrder?.total.toLocaleString('en-IN')}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateStatus}
              isLoading={isUpdating}
            >
              Update Status
            </Button>
          </>
        }
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                New Order Status
              </label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as OrderStatus)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="Pending">Pending Verification</option>
                <option value="Processing">Processing / Allocation</option>
                <option value="Packed">Packed & Sealed</option>
                <option value="Shipped">Dispatched / Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Timeline Audit Notes
              </label>
              <textarea
                rows={3}
                value={statusNote}
                onChange={e => setStatusNote(e.target.value)}
                placeholder="e.g. Courier picked up package. Tracking number updated to DEL-9938210."
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
