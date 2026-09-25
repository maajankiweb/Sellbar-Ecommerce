'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { RatingStars, PageHeader, EmptyState, SectionCard, SectionHeader, Toast } from '@/components/account/ui';
import { accountService } from '@/lib/account/mockData';
import { WishlistProduct } from '@/types/account';
import { Heart, ShoppingCart, Bell, X, Trash2, TrendingDown, AlertCircle } from 'lucide-react';

function WishlistCard({ item, onRemove, onAddToCart }: {
  item: WishlistProduct;
  onRemove: (id: string) => void;
  onAddToCart: (item: WishlistProduct) => void;
}) {
  const discountPct = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md hover:border-slate-200 transition-all group">
      {/* Image */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {item.priceDropped && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500 text-white text-[10px] font-black shadow-md">
              <TrendingDown className="h-3 w-3" />
              ₹{item.priceDropAmount?.toLocaleString('en-IN')} Drop
            </span>
          )}
          {!item.inStock && (
            <span className="px-2 py-1 rounded-lg bg-slate-700/80 text-white text-[10px] font-bold backdrop-blur-sm">
              Out of Stock
            </span>
          )}
          {discountPct >= 30 && item.inStock && (
            <span className="px-2 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-black">
              {discountPct}% OFF
            </span>
          )}
        </div>

        {/* Remove button */}
        <button
          onClick={() => onRemove(item.id)}
          className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white transition opacity-0 group-hover:opacity-100 shadow-sm"
          aria-label="Remove from wishlist"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 mb-2">{item.name}</p>

        <div className="flex items-center gap-1.5 mb-3">
          <RatingStars rating={item.rating} />
          <span className="text-[10px] text-slate-400">({item.reviewCount.toLocaleString('en-IN')})</span>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="font-black text-lg text-slate-900">₹{item.price.toLocaleString('en-IN')}</span>
          {item.originalPrice > item.price && (
            <span className="text-xs text-slate-400 line-through">₹{item.originalPrice.toLocaleString('en-IN')}</span>
          )}
        </div>

        {item.priceDropped && (
          <div className="flex items-center gap-1 text-xs text-rose-600 font-semibold mb-3">
            <TrendingDown className="h-3.5 w-3.5" />
            Was ₹{(item.price + (item.priceDropAmount || 0)).toLocaleString('en-IN')}, now ₹{item.price.toLocaleString('en-IN')}
          </div>
        )}

        {/* CTAs */}
        {item.inStock ? (
          <div className="flex gap-2">
            <button
              onClick={() => onAddToCart(item)}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Move to Cart
            </button>
            <button className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-1.5">
            <Bell className="h-3.5 w-3.5" />
            Notify When Back
          </button>
        )}
      </div>
    </div>
  );
}

function WishlistContent() {
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    accountService.getWishlist().then(data => {
      setWishlist(data);
      setLoading(false);
    });
  }, []);

  const handleRemove = (id: string) => {
    setWishlist(prev => prev.filter(i => i.id !== id));
    setToast('Removed from wishlist');
  };

  const handleAddToCart = (item: WishlistProduct) => {
    setWishlist(prev => prev.filter(i => i.id !== item.id));
    setToast(`${item.name.split(' ').slice(0, 3).join(' ')} moved to cart!`);
  };

  const inStock = wishlist.filter(i => i.inStock);
  const outOfStock = wishlist.filter(i => !i.inStock);
  const priceDrops = wishlist.filter(i => i.priceDropped);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-slate-200 rounded-2xl aspect-[4/5] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-6xl mx-auto w-full">
      <PageHeader
        title="My Wishlist"
        description={`${wishlist.length} saved items`}
        action={
          wishlist.length > 0 ? (
            <button className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add All to Cart
            </button>
          ) : undefined
        }
      />

      {wishlist.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-8 w-8" />}
          title="Your wishlist is empty"
          description="Save items you love and get notified about price drops and restocks."
          cta={{ label: 'Explore Products', href: '/buy' }}
        />
      ) : (
        <div className="space-y-8">
          {/* Price Drop Alert */}
          {priceDrops.length > 0 && (
            <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200/60 rounded-2xl">
              <div className="h-9 w-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <TrendingDown className="h-5 w-5 text-rose-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-rose-900">Price Drop Alert 🎉</p>
                <p className="text-xs text-rose-700 mt-0.5">
                  {priceDrops.length} item{priceDrops.length > 1 ? 's' : ''} in your wishlist dropped in price. Grab them now!
                </p>
              </div>
              <button className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition">
                Buy Now
              </button>
            </div>
          )}

          {/* In Stock */}
          {inStock.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-900 mb-4">In Stock ({inStock.length})</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {inStock.map(item => (
                  <WishlistCard key={item.id} item={item} onRemove={handleRemove} onAddToCart={handleAddToCart} />
                ))}
              </div>
            </div>
          )}

          {/* Out of Stock */}
          {outOfStock.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-600 mb-4 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-slate-400" />
                Out of Stock ({outOfStock.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 opacity-75">
                {outOfStock.map(item => (
                  <WishlistCard key={item.id} item={item} onRemove={handleRemove} onAddToCart={handleAddToCart} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default function WishlistPage() {
  return (
    <AccountLayout>
      <AccountHeader />
      <WishlistContent />
    </AccountLayout>
  );
}
