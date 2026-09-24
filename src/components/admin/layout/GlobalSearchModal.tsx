'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Package,
  ShoppingCart,
  Users,
  Tag,
  ArrowRight,
  X,
  Layers,
  Settings,
  BarChart3,
  CreditCard
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CUSTOMERS, INITIAL_COUPONS } from '@/services/adminMockData';

export function GlobalSearchModal() {
  const router = useRouter();
  const { isSearchOpen, setIsSearchOpen } = useAdmin();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  // Search through categories, pages, products, orders, customers
  const pages = [
    { title: 'Dashboard Overview', href: '/admin/dashboard', icon: BarChart3, category: 'Pages' },
    { title: 'Products Catalog', href: '/admin/products', icon: Package, category: 'Pages' },
    { title: 'Add New Product', href: '/admin/products/new', icon: Package, category: 'Pages' },
    { title: 'Inventory Management', href: '/admin/inventory', icon: Layers, category: 'Pages' },
    { title: 'Orders Directory', href: '/admin/orders', icon: ShoppingCart, category: 'Pages' },
    { title: 'Customers List', href: '/admin/customers', icon: Users, category: 'Pages' },
    { title: 'Coupons & Discounts', href: '/admin/coupons', icon: Tag, category: 'Pages' },
    { title: 'Finance & Invoices', href: '/admin/finance', icon: CreditCard, category: 'Pages' },
    { title: 'Store Settings', href: '/admin/settings', icon: Settings, category: 'Pages' },
  ].filter(p => !q || p.title.toLowerCase().includes(q));

  const matchedProducts = INITIAL_PRODUCTS.filter(
    p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
  ).slice(0, 4);

  const matchedOrders = INITIAL_ORDERS.filter(
    o => o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)
  ).slice(0, 3);

  const matchedCustomers = INITIAL_CUSTOMERS.filter(
    c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
  ).slice(0, 3);

  const matchedCoupons = INITIAL_COUPONS.filter(
    c => c.code.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
  ).slice(0, 2);

  const handleNavigate = (href: string) => {
    setIsSearchOpen(false);
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Palette Box */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden transition-all dark:border-slate-800 dark:bg-slate-900 z-50">
        {/* Input Header */}
        <div className="flex items-center border-b border-slate-100 px-4 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products, orders, customers, coupons, pages..."
            className="w-full bg-transparent px-3 py-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Pages */}
          {pages.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Navigation
              </div>
              <div className="space-y-0.5 mt-1">
                {pages.slice(0, 4).map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleNavigate(p.href)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-blue-500" />
                        <span>{p.title}</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Products */}
          {matchedProducts.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Products
              </div>
              <div className="space-y-1 mt-1">
                {matchedProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleNavigate(`/admin/products/${p.id}`)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="h-8 w-8 rounded object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {p.sku} • {p.category}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Orders */}
          {matchedOrders.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Orders
              </div>
              <div className="space-y-1 mt-1">
                {matchedOrders.map(o => (
                  <button
                    key={o.id}
                    onClick={() => handleNavigate(`/admin/orders/${o.id}`)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShoppingCart className="h-4 w-4 text-emerald-500" />
                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                          {o.orderNumber} — {o.customerName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {o.status} • {o.items.length} items
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      ₹{o.total.toLocaleString('en-IN')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customers */}
          {matchedCustomers.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Customers
              </div>
              <div className="space-y-1 mt-1">
                {matchedCustomers.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleNavigate(`/admin/customers/${c.id}`)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                          {c.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {c.email} • {c.group}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">
                      {c.totalOrders} orders
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Coupons */}
          {matchedCoupons.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Coupons
              </div>
              <div className="space-y-1 mt-1">
                {matchedCoupons.map(cp => (
                  <button
                    key={cp.id}
                    onClick={() => handleNavigate('/admin/coupons')}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Tag className="h-4 w-4 text-purple-500" />
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {cp.code}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {cp.description}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-blue-600">
                      {cp.discountType === 'fixed' ? `₹${cp.discountValue}` : `${cp.discountValue}%`} OFF
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {pages.length === 0 &&
            matchedProducts.length === 0 &&
            matchedOrders.length === 0 &&
            matchedCustomers.length === 0 && (
              <div className="py-10 text-center text-xs text-slate-400">
                No matching results found for &quot;{query}&quot;.
              </div>
            )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-[11px] text-slate-400 dark:border-slate-800 dark:bg-slate-900/60">
          <span>Tip: Use ↑ ↓ to navigate results</span>
          <div className="flex items-center gap-1">
            <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:border-slate-700 dark:bg-slate-800">
              ESC
            </kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
