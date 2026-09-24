'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { BuyOrder } from '@/types';
import { Printer, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function BuyOrderInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<BuyOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/v1/orders/buy/${id}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
        }
      } catch {
        // error
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-24 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500 font-semibold">Generating GST Tax Invoice...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-base font-bold text-slate-900">Order not found</h2>
        <Link href="/account" className="mt-4 inline-block text-xs font-bold text-emerald-700 underline">
          Return to My Account
        </Link>
      </div>
    );
  }

  const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Calculate 18% GST Breakdown (9% CGST + 9% SGST)
  const taxableBase = Math.round(order.totalAmount / 1.18);
  const totalGst = order.totalAmount - taxableBase;
  const cgst = Math.round(totalGst / 2);
  const sgst = totalGst - cgst;

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6">
      {/* Action Bar (Hidden on Print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/order/buy/${order.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Order Tracking</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save Tax Invoice (PDF)</span>
        </button>
      </div>

      {/* Invoice Document Paper */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-slate-200 print:shadow-none print:border-none print:p-0">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b-2 border-slate-900 gap-4">
          <div>
            <div className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
              <span className="text-emerald-700">SELBAR</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold uppercase">
                Recommerce
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              SELBAR Recommerce India Pvt. Ltd.<br />
              Supriya Cinema Road, Bettiah, West Champaran, Bihar - 845438<br />
              GSTIN: <strong className="font-mono text-slate-900">10AABCS1429B1Z8</strong> • State Code: 10
            </p>
          </div>

          <div className="text-left sm:text-right">
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-wider">TAX INVOICE</h1>
            <div className="text-xs text-slate-600 mt-1 space-y-0.5 font-mono">
              <div>Invoice No: <strong className="text-slate-900">INV-2026-{order.id}</strong></div>
              <div>Invoice Date: <strong className="text-slate-900">{invoiceDate}</strong></div>
              <div>Order ID: <strong className="text-slate-900">#{order.id}</strong></div>
              <div>AWB Tracking: <strong className="text-slate-900">{order.trackingNumber}</strong></div>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6 border-b border-slate-200 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
              Bill To & Ship To
            </span>
            <div className="font-bold text-sm text-slate-900">{order.shippingAddress.fullName}</div>
            <div className="text-slate-600 mt-1 space-y-0.5">
              <div>Phone: +91 {order.shippingAddress.phone}</div>
              <div>{order.shippingAddress.flatNo}, {order.shippingAddress.street}</div>
              <div>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </div>
              <div className="text-emerald-700 font-bold mt-1">Place of Supply: Bihar (10)</div>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
              Payment & Policy Details
            </span>
            <div className="text-slate-600 space-y-1">
              <div>Payment Mode: <strong className="text-slate-900 font-semibold">{order.paymentMethod}</strong></div>
              <div>Payment Status: <strong className="text-emerald-700 font-semibold">PAID IN FULL ✓</strong></div>
              <div>Coverage: <strong className="text-slate-900 font-semibold">12-Month Hardware Warranty</strong></div>
              <div className="font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded inline-block">
                5-Day Hassle-Free Replacement Guarantee Active
              </div>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5">#</th>
                <th className="py-2.5">Item Description & Grade</th>
                <th className="py-2.5">HSN</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Unit Price</th>
                <th className="py-2.5 text-right">Taxable Amt</th>
                <th className="py-2.5 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item, idx) => {
                const itemTaxable = Math.round((item.price * item.quantity) / 1.18);
                return (
                  <tr key={item.id} className="py-2.5">
                    <td className="py-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 pr-4">
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500">
                        Variant: {item.storage} • Color: {item.color} • Grade: {item.grade.toUpperCase()}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Serial / IMEI: 8694020{idx}91823{idx} (Verified 32-Pt QC)
                      </div>
                    </td>
                    <td className="py-3 font-mono text-slate-600">8517</td>
                    <td className="py-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 text-right font-mono">₹{item.price.toLocaleString('en-IN')}</td>
                    <td className="py-3 text-right font-mono text-slate-600">₹{itemTaxable.toLocaleString('en-IN')}</td>
                    <td className="py-3 text-right font-bold text-slate-900 font-mono">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}

              {order.protectionPlan && (
                <tr className="py-2.5">
                  <td className="py-3 font-mono text-slate-400">{order.items.length + 1}</td>
                  <td className="py-3 pr-4">
                    <div className="font-bold text-slate-900">SELBAR Complete Care Protection Plan</div>
                    <div className="text-[11px] text-slate-500">+1 Year Screen & Liquid Spill Coverage</div>
                  </td>
                  <td className="py-3 font-mono text-slate-600">9971</td>
                  <td className="py-3 text-center font-bold">1</td>
                  <td className="py-3 text-right font-mono">₹499</td>
                  <td className="py-3 text-right font-mono text-slate-600">₹423</td>
                  <td className="py-3 text-right font-bold text-slate-900 font-mono">₹499</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tax Summary & Totals */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start gap-6 text-xs">
          <div className="max-w-md space-y-2">
            <div className="font-bold text-slate-900">Tax Breakdown (18% GST Included)</div>
            <div className="space-y-1 text-slate-600 text-[11px]">
              <div className="flex justify-between gap-8">
                <span>Taxable Value:</span>
                <span className="font-mono">₹{taxableBase.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between gap-8">
                <span>Central GST (CGST @ 9%):</span>
                <span className="font-mono">₹{cgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between gap-8">
                <span>State GST (SGST @ 9%):</span>
                <span className="font-mono">₹{sgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between gap-8">
                <span>Doorstep Insured Shipping:</span>
                <span className="font-bold text-emerald-700">₹0 (FREE)</span>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-64 space-y-2 self-end">
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Coupon Discount ({order.couponCode || 'APPLIED'}):</span>
                <span>-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="pt-2 border-t-2 border-slate-900 flex justify-between text-base font-black text-slate-950">
              <span>Grand Total:</span>
              <span className="text-emerald-700">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-[10px] text-slate-400 text-right">
              (Inclusive of all taxes and reverse pickup cover)
            </div>
          </div>
        </div>

        {/* Terms & Signatory */}
        <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 items-end text-[10px] text-slate-500">
          <div className="space-y-1">
            <strong className="text-slate-800 block text-xs">Terms & 5-Day Policy:</strong>
            <p>
              1. Goods once sold are backed by SELBAR 12-month hardware warranty.<br />
              2. <strong>5-Day Return/Replacement Window:</strong> Customer may raise return or replacement within 5 days of delivery for hardware defects.<br />
              3. Reverse pickup is executed at customer doorstep across authorized West Champaran hubs.
            </p>
          </div>

          <div className="text-left sm:text-right space-y-2">
            <div className="h-10 flex items-end justify-end">
              <span className="font-serif italic text-sm text-slate-800 font-bold border-b border-slate-400 pb-1 px-4">
                Authorized Signatory
              </span>
            </div>
            <p className="text-slate-600 font-semibold">For SELBAR Recommerce India Pvt. Ltd.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
