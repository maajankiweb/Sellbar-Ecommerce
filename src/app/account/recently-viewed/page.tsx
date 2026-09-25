'use client';

import React, { useState, useEffect } from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { PageHeader, SectionCard, SectionHeader } from '@/components/account/ui';
import { accountService } from '@/lib/account/mockData';
import { RecentlyViewedProduct } from '@/types/account';
import { Eye, ShoppingCart, Heart, Clock, Trash2, X } from 'lucide-react';

function RecentlyViewedContent() {
  const [items, setItems] = useState<RecentlyViewedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    accountService.getRecentlyViewed().then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hrs = diff / 3600000;
    if (hrs < 1) return `${Math.round(hrs * 60)}m ago`;
    if (hrs < 24) return `${Math.round(hrs)}h ago`;
    return `${Math.round(hrs / 24)}d ago`;
  };

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-4xl mx-auto w-full">
      <PageHeader
        title="Recently Viewed"
        description="Products you've looked at recently"
        action={
          items.length > 0 ? (
            <button
              onClick={() => setItems([])}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          ) : undefined
        }
      />

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="aspect-[3/4] bg-slate-200 rounded-2xl animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
            <Eye className="h-8 w-8" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Nothing here yet</h3>
          <p className="text-sm text-slate-500 max-w-xs">Products you browse will show up here so you can easily come back to them.</p>
          <a href="/buy" className="mt-6 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition">
            Explore Products
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md hover:border-slate-200 transition-all group">
              {/* Image */}
              <div className="relative aspect-square bg-slate-50 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Remove button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-rose-500 transition opacity-0 group-hover:opacity-100 shadow-sm"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                {!item.inStock && (
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                    <span className="px-2 py-1 rounded-lg bg-white/90 text-slate-700 text-[10px] font-bold">Out of Stock</span>
                  </div>
                )}
                {/* Time tag */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 rounded-lg px-2 py-1">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <span className="text-[10px] text-slate-500 font-medium">{timeAgo(item.viewedAt)}</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug mb-2">{item.name}</p>
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className={`h-3 w-3 ${i < Math.round(item.rating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">{item.rating}</span>
                </div>
                <p className="font-black text-base text-slate-900 mb-3">₹{item.price.toLocaleString('en-IN')}</p>

                {item.inStock ? (
                  <div className="flex gap-1.5">
                    <button className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-[10px] font-bold hover:bg-blue-700 transition flex items-center justify-center gap-1">
                      <ShoppingCart className="h-3 w-3" />
                      Cart
                    </button>
                    <button className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition">
                      <Heart className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button className="w-full py-2 rounded-xl border border-slate-200 text-slate-500 text-[10px] font-bold hover:bg-slate-50 transition">
                    Notify Me
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RecentlyViewedPage() {
  return (
    <AccountLayout>
      <AccountHeader />
      <RecentlyViewedContent />
    </AccountLayout>
  );
}
