'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { PageHeader, SectionCard, SectionHeader, Toast, EmptyState, RatingStars } from '@/components/account/ui';
import { accountService } from '@/lib/account/mockData';
import { RecommendedProduct, RecentlyViewedProduct } from '@/types/account';
import { Sparkles, Eye, ShoppingCart, Heart, Clock, ArrowRight } from 'lucide-react';

function ProductCard({ product, onAddToWishlist, onAddToCart }: {
  product: RecommendedProduct;
  onAddToWishlist: (id: string) => void;
  onAddToCart: (id: string) => void;
}) {
  const [wishlisted, setWishlisted] = useState(false);

  const reasonMap: Record<string, { label: string; color: string }> = {
    purchase: { label: 'Based on purchases', color: 'bg-blue-100 text-blue-700' },
    browse: { label: 'Based on browsing', color: 'bg-purple-100 text-purple-700' },
    trending: { label: 'Trending now', color: 'bg-rose-100 text-rose-700' },
    similar: { label: 'Similar products', color: 'bg-amber-100 text-amber-700' },
  };

  const reason = reasonMap[product.reason];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md hover:border-slate-200 transition-all group">
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={() => { setWishlisted(w => !w); onAddToWishlist(product.id); }}
          className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition hover:scale-110"
        >
          <Heart className={`h-4 w-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
        </button>
        <div className="absolute top-2.5 left-2.5">
          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${reason.color}`}>
            {reason.label}
          </span>
        </div>
        {product.discount >= 30 && (
          <div className="absolute bottom-2.5 right-2.5">
            <span className="px-2 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-black">
              {product.discount}% OFF
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-sm font-semibold text-slate-900 line-clamp-2 mb-2 leading-snug">{product.name}</p>
        <div className="flex items-center gap-1.5 mb-3">
          <RatingStars rating={product.rating} />
          <span className="text-[10px] text-slate-400">({product.reviewCount.toLocaleString('en-IN')})</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="font-black text-lg text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-slate-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
        </div>
        <button
          onClick={() => onAddToCart(product.id)}
          className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition flex items-center justify-center gap-1.5"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

function RecentlyViewedItem({ item }: { item: RecentlyViewedProduct }) {
  const timeAgo = (dateStr: string) => {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 3600000;
    if (diff < 1) return `${Math.round(diff * 60)}m ago`;
    if (diff < 24) return `${Math.round(diff)}h ago`;
    return `${Math.round(diff / 24)}d ago`;
  };

  return (
    <div className="flex gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:shadow-sm transition group">
      <div className="relative shrink-0">
        <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover bg-slate-50" />
        <div className="absolute bottom-1 right-1 flex items-center gap-0.5 bg-white/90 rounded-md px-1 py-0.5">
          <Clock className="h-2.5 w-2.5 text-slate-400" />
          <span className="text-[9px] text-slate-500">{timeAgo(item.viewedAt)}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug">{item.name}</p>
        <p className="font-black text-sm text-slate-900 mt-1">₹{item.price.toLocaleString('en-IN')}</p>
        <div className="flex gap-2 mt-2">
          <button className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold">Add to Cart</button>
          <button className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold">Save</button>
        </div>
      </div>
    </div>
  );
}

function RecommendationsContent() {
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    Promise.all([
      accountService.getRecommendations(),
      accountService.getRecentlyViewed(),
    ]).then(([rec, rv]) => {
      setRecommendations(rec);
      setRecentlyViewed(rv);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-6xl mx-auto w-full">
      <PageHeader title="For You" description="Personalized picks based on your shopping history" />

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="aspect-[4/5] bg-slate-200 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-slate-900 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-slate-400" />
                  Recently Viewed
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {recentlyViewed.map(item => (
                  <RecentlyViewedItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                Recommended For You
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {recommendations.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToWishlist={(id) => setToast('Added to wishlist!')}
                  onAddToCart={(id) => setToast('Added to cart!')}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <AccountLayout>
      <AccountHeader />
      <RecommendationsContent />
    </AccountLayout>
  );
}
