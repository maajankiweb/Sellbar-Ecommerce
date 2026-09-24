'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Printer,
  Download,
  RotateCcw,
  XCircle,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Mail,
  Phone,
  CreditCard,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';
import { Modal } from '@/components/admin/ui/Modal';
import { adminService } from '@/services/adminService';
import { AdminOrder, OrderStatus } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = String(params.id);
  const { addToast } = useAdmin();

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('Processing');
  const [timelineNotes, setTimelineNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const data = await adminService.getOrderById(orderId);
      if (data) {
        setOrder(data);
        setSelectedStatus(data.status);
      }
      setIsLoading(false);
    }
    load();
  }, [orderId]);

  const handleStatusUpdate = async () => {
    if (!order) return;
    setIsUpdating(true);
    const updated = await adminService.updateOrderStatus(order.id, selectedStatus, timelineNotes);
    if (updated) {
      setOrder(updated);
      addToast({
        title: 'Status Updated',
        message: `Order status is now ${selectedStatus}.`,
        type: 'success',
      });
    }
    setIsUpdating(false);
    setIsStatusModalOpen(false);
    setTimelineNotes('');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    const updated = await adminService.updateOrderStatus(order.id, 'Cancelled', 'Cancelled by admin from Order Details');
    if (updated) setOrder(updated);
    addToast({ title: 'Order Cancelled', message: 'Order was marked as cancelled.', type: 'warning' });
  };

  const handleRefundOrder = async () => {
    if (!order) return;
    const updated = await adminService.updateOrderStatus(order.id, 'Refunded', 'Full refund initiated to original payment source');
    if (updated) setOrder(updated);
    addToast({ title: 'Refund Initiated', message: `₹${order.total} credited back to ${order.customerName}`, type: 'info' });
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-12 text-center">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Order Not Found
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          The requested order could not be located in our fulfillment database.
        </p>
        <Link href="/admin/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const getStatusVariant = (st: OrderStatus) => {
    switch (st) {
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
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Action Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {order.orderNumber}
              </h1>
              <Badge variant={getStatusVariant(order.status)} size="md" dot>
                {order.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Placed on{' '}
              {new Date(order.createdAt).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="h-4 w-4" />}
          >
            Print Invoice
          </Button>

          {order.status !== 'Cancelled' && order.status !== 'Refunded' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefundOrder}
                leftIcon={<RotateCcw className="h-4 w-4" />}
              >
                Refund
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelOrder}
                className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                Cancel Order
              </Button>
            </>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsStatusModalOpen(true)}
          >
            Update Status
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Items & Timeline, Right Customer & Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Table */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Purchased Items ({order.items.length})
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items.map(item => (
                <div
                  key={item.id}
                  className="py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="h-12 w-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                        {item.productName}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        SKU: {item.sku} {item.variantTitle && `• ${item.variantTitle}`}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        ₹{item.unitPrice.toLocaleString('en-IN')} × {item.quantity}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm font-bold text-slate-900 dark:text-white shrink-0">
                    ₹{item.totalPrice.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  ₹{order.subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount ({order.couponCode || 'PROMO'})</span>
                  <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Estimated Shipping</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Estimated GST Tax (18%)</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  ₹{order.tax.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Grand Total</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Chronological Order Timeline */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Fulfillment Journey & Timeline
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {order.timeline.map((event, idx) => (
                <div key={event.id || idx} className="relative">
                  <span
                    className={`absolute -left-6 top-1 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-900 ${
                      event.completed
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    {event.completed && <CheckCircle2 className="h-3 w-3" />}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <h5 className="text-xs font-semibold text-slate-900 dark:text-white">
                      {event.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {event.timestamp}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>

            {order.carrier && order.trackingNumber && (
              <div className="mt-5 rounded-lg bg-blue-50/60 p-3 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-900/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                  <Truck className="h-4 w-4" />
                  <span>
                    Carrier: <strong>{order.carrier}</strong> • AWB:{' '}
                    <strong className="font-mono">{order.trackingNumber}</strong>
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() =>
                    addToast({
                      title: 'Tracking Carrier',
                      message: `Querying ${order.carrier} API for real-time geolocation`,
                      type: 'info',
                    })
                  }
                >
                  Live Track
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Customer Details & Addresses */}
        <div className="space-y-6">
          {/* Customer Profile Card */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/90 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Customer Details
            </h4>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold dark:bg-blue-950 dark:text-blue-300">
                {order.customerName.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white text-sm">
                  {order.customerName}
                </div>
                <div className="text-xs text-slate-400">ID: {order.customerId}</div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{order.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{order.customerPhone}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/90 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Shipping Address
              </h4>
              <MapPin className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <p className="font-semibold text-slate-900 dark:text-white">
              {order.shippingAddress.fullName}
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {order.shippingAddress.street}
              {order.shippingAddress.locality && `, ${order.shippingAddress.locality}`}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
              {order.shippingAddress.pincode}
            </p>
            <p className="text-slate-500 font-mono">
              Contact: {order.shippingAddress.phone}
            </p>
          </div>

          {/* Billing & Payment Method */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/90 space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Payment Information
            </h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {order.paymentMethod}
                </span>
              </div>
              <Badge variant="success" size="sm">
                {order.paymentStatus}
              </Badge>
            </div>
            <p className="text-slate-500 text-[11px]">
              Secured & verified through Razorpay PCI-DSS Level 1 Gateway.
            </p>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title={`Update Order Status`}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleStatusUpdate}
              isLoading={isUpdating}
            >
              Confirm Update
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select New Stage
            </label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value as OrderStatus)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Timeline Note
            </label>
            <textarea
              rows={3}
              value={timelineNotes}
              onChange={e => setTimelineNotes(e.target.value)}
              placeholder="e.g. Courier picked up parcel from Whitefield Fulfillment Hub"
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
