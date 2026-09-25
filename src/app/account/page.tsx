'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AccountLayout, { useAccount } from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { StatusBadge, RatingStars, OrderTimeline, SectionCard, SectionHeader, SkeletonCard, EmptyState } from '@/components/account/ui';
import { accountService } from '@/lib/account/mockData';
import { Order, WishlistProduct, LoyaltyData, Notification } from '@/types/account';
import {
  Package, Heart, Award, Wallet, RotateCcw, AlertTriangle, Truck,
  Clock, Star, ArrowRight, ShoppingCart, Zap, Gift, Bell,
  CheckCircle, RefreshCw, MapPin, ChevronRight
} from 'lucide-react';

// ─── QUICK STAT CARD ──────────────────────────────────────────────────────────
function QuickCard({ icon, label, value, sub, href, cta }: {
  icon: React.ReactNode; label: string; value: string | number;
  sub?: string; href: string; cta: string;
}) {
  return (
    <Link href={href} className="group block">
      <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:border-slate-200 transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-slate-50 group-hover:scale-105 transition-transform duration-200">
            {icon}
          </div>
          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
        </div>
        <div className="text-2xl font-black text-slate-900 mb-0.5">{value}</div>
        <div className="text-xs font-semibold text-slate-500">{label}</div>
        {sub && <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>}
        <div className="mt-4 text-xs font-bold text-blue-600 group-hover:underline">{cta} →</div>
      </div>
    </Link>
  );
}

// ─── ACTION REQUIRED ITEM ─────────────────────────────────────────────────────
function ActionItem({ icon, iconBg, label, title, message, ctaLabel, ctaHref, type }: {
  icon: React.ReactNode; iconBg: string; label: string; title: string; message: string;
  ctaLabel: string; ctaHref: string; type: 'info' | 'warning' | 'success';
}) {
  const typeCls = {
    info: 'border-l-blue-500 bg-blue-50/30',
    warning: 'border-l-amber-500 bg-amber-50/30',
    success: 'border-l-emerald-500 bg-emerald-50/30',
  }[type];
  const labelCls = {
    info: 'text-blue-700 bg-blue-100',
    warning: 'text-amber-700 bg-amber-100',
    success: 'text-emerald-700 bg-emerald-100',
  }[type];
  const btnCls = {
    info: 'bg-blue-600 hover:bg-blue-700 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  }[type];

  return (
    <div className={`flex gap-4 p-4 rounded-xl border-l-4 ${typeCls} border border-transparent`}>
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${labelCls}`}>{label}</span>
        </div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{message}</p>
      </div>
      <Link
        href={ctaHref}
        className={`shrink-0 self-center px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${btnCls}`}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

// ─── ORDER CARD ───────────────────────────────────────────────────────────────
function CurrentOrderCard({ order }: { order: Order }) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white overflow-hidden relative">
      {/* Decorative */}
      <div className="absolute right-0 top-0 h-full w-48 opacity-10">
        <div className="absolute right-4 top-4 h-32 w-32 rounded-full border-4 border-white" />
        <div className="absolute right-16 top-16 h-16 w-16 rounded-full border-2 border-white" />
      </div>

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">{order.orderId}</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold flex items-center gap-1">
                <Truck className="h-3 w-3" />
                Out for Delivery
              </span>
            </div>
            <p className="font-bold text-lg leading-tight">{order.items[0].name}</p>
            {order.items.length > 1 && (
              <p className="text-white/70 text-xs mt-0.5">+ {order.items.length - 1} other item{order.items.length > 2 ? 's' : ''}</p>
            )}
          </div>
          <img
            src={order.items[0].image}
            alt={order.items[0].name}
            className="h-14 w-14 rounded-xl object-cover border-2 border-white/30 shrink-0"
          />
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div>
            <p className="text-white/60 text-xs">Total</p>
            <p className="font-black text-xl">₹{order.total.toLocaleString('en-IN')}</p>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div>
            <p className="text-white/60 text-xs flex items-center gap-1"><Clock className="h-3 w-3" /> Expected</p>
            <p className="font-semibold text-sm">Today, {new Date(order.expectedDelivery || '').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
          </div>
          {order.courierPartner && (
            <>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <p className="text-white/60 text-xs">Carrier</p>
                <p className="font-semibold text-xs">{order.courierPartner}</p>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/account/orders/${order.orderId}`}
            className="flex-1 py-2.5 px-4 rounded-xl bg-white text-blue-700 text-sm font-bold text-center hover:bg-blue-50 transition"
          >
            Track Order
          </Link>
          <Link
            href={`/account/orders/${order.orderId}`}
            className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition border border-white/20"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT MINI CARD ────────────────────────────────────────────────────────
function ProductMiniCard({ item }: { item: WishlistProduct }) {
  const discountPct = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-3 flex gap-3 hover:shadow-sm transition group">
      <div className="relative shrink-0">
        <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover bg-slate-50" />
        {item.priceDropped && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-white text-[8px] font-black flex items-center justify-center">↓</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug">{item.name}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="font-black text-sm text-slate-900">₹{item.price.toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-400 line-through">₹{item.originalPrice.toLocaleString('en-IN')}</span>
          <span className="text-[10px] font-bold text-emerald-600">{discountPct}% off</span>
        </div>
        {item.priceDropped && (
          <p className="text-[10px] text-rose-600 font-semibold mt-0.5 flex items-center gap-0.5">
            <Bell className="h-2.5 w-2.5" />
            Dropped ₹{item.priceDropAmount?.toLocaleString('en-IN')}
          </p>
        )}
        <Link
          href="/cart"
          className="mt-2 flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline"
        >
          <ShoppingCart className="h-3 w-3" />
          Add to Cart
        </Link>
      </div>
    </div>
  );
}

// ─── REWARD BANNER ────────────────────────────────────────────────────────────
function RewardBanner({ loyalty }: { loyalty: LoyaltyData }) {
  const pct = Math.round(((loyalty.points - loyalty.tierMinPoints) / (loyalty.tierMaxPoints - loyalty.tierMinPoints)) * 100);
  return (
    <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 rounded-2xl p-5 text-white relative overflow-hidden">
      <div className="absolute right-0 top-0 opacity-10">
        <Award className="h-32 w-32" />
      </div>
      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          <Award className="h-5 w-5" />
          <span className="font-black text-sm uppercase tracking-wider">{loyalty.tier} Member</span>
        </div>
        <p className="text-3xl font-black mb-1">{loyalty.points.toLocaleString('en-IN')} <span className="text-base font-semibold text-white/80">points</span></p>
        <div className="h-2 bg-white/30 rounded-full mb-1 overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-white/80">
          {loyalty.pointsToNextTier?.toLocaleString('en-IN')} points to <span className="font-bold">{loyalty.nextTier}</span>
        </p>
        <Link
          href="/account/rewards"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-orange-600 text-sm font-bold hover:bg-orange-50 transition"
        >
          <Gift className="h-4 w-4" />
          Redeem Points
        </Link>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
function DashboardContent() {
  const { user } = useAuth();
  const { notifications } = useAccount();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [loyalty, setLoyalty] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const displayName = user?.name?.split(' ')[0] || 'there';

  useEffect(() => {
    Promise.all([
      accountService.getOrders(),
      accountService.getWishlist(),
      accountService.getLoyalty(),
    ]).then(([o, w, l]) => {
      setOrders(o);
      setWishlist(w);
      setLoyalty(l);
      setLoading(false);
    });
  }, []);

  const activeOrder = orders.find(o => ['PLACED', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(o.status));
  const activeReturn = orders.find(o => ['RETURN_REQUESTED', 'REFUND_PROCESSING'].includes(o.status));
  const pendingReviewOrders = orders.filter(o => o.status === 'DELIVERED' && o.items.some(i => !i.isReviewed));
  const wishlistDrops = wishlist.filter(w => w.priceDropped);
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const walletBalance = 1250;
  const rewardPoints = loyalty?.points ?? 0;

  // Action required items
  const actionItems = [
    ...(activeOrder ? [{
      icon: <Truck className="h-5 w-5 text-blue-600" />,
      iconBg: 'bg-blue-100',
      label: 'Delivery Today',
      title: `${activeOrder.orderId} — Arriving Today`,
      message: 'Your package is out for delivery. Expected by 6 PM.',
      ctaLabel: 'Track Order',
      ctaHref: `/account/orders/${activeOrder.orderId}`,
      type: 'info' as const,
    }] : []),
    ...(activeReturn ? [{
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
      iconBg: 'bg-amber-100',
      label: 'Return Active',
      title: `${activeReturn.orderId} — Refund in Progress`,
      message: `Refund of ₹${activeReturn.total.toLocaleString('en-IN')} being processed.`,
      ctaLabel: 'Track Return',
      ctaHref: '/account/returns',
      type: 'warning' as const,
    }] : []),
    ...(pendingReviewOrders.length > 0 ? [{
      icon: <Star className="h-5 w-5 text-emerald-600" />,
      iconBg: 'bg-emerald-100',
      label: 'Rate Product',
      title: `${pendingReviewOrders[0].items.find(i => !i.isReviewed)?.name}`,
      message: 'Share your experience and help other buyers.',
      ctaLabel: 'Write Review',
      ctaHref: '/account/reviews',
      type: 'success' as const,
    }] : []),
    ...(wishlistDrops.length > 0 ? [{
      icon: <Bell className="h-5 w-5 text-rose-600" />,
      iconBg: 'bg-rose-100',
      label: 'Price Drop',
      title: `${wishlistDrops[0].name}`,
      message: `Price dropped by ₹${wishlistDrops[0].priceDropAmount?.toLocaleString('en-IN')}. Now ₹${wishlistDrops[0].price.toLocaleString('en-IN')}.`,
      ctaLabel: 'Buy Now',
      ctaHref: '/account/wishlist',
      type: 'warning' as const,
    }] : []),
  ];

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-5xl xl:max-w-6xl mx-auto w-full">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          {greeting}, {displayName}! 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">Here's what's happening with your account today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <QuickCard icon={<Package className="h-5 w-5 text-blue-600" />} label="Total Orders" value={orders.length} href="/account/orders" cta="View Orders" />
        <QuickCard icon={<Heart className="h-5 w-5 text-rose-500" />} label="Saved Items" value={wishlist.length} sub={wishlistDrops.length > 0 ? `${wishlistDrops.length} price drop${wishlistDrops.length > 1 ? 's' : ''}` : undefined} href="/account/wishlist" cta="View Wishlist" />
        <QuickCard icon={<Award className="h-5 w-5 text-amber-500" />} label="Reward Points" value={rewardPoints.toLocaleString('en-IN')} sub={loyalty?.tier + ' Tier'} href="/account/rewards" cta="Redeem Points" />
        <QuickCard icon={<Wallet className="h-5 w-5 text-emerald-600" />} label="Wallet Balance" value={`₹${walletBalance.toLocaleString('en-IN')}`} href="/account/wallet" cta="View Wallet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Required */}
          {actionItems.length > 0 && (
            <SectionCard>
              <SectionHeader title="⚡ Action Required" />
              <div className="p-4 space-y-3">
                {actionItems.map((item, i) => (
                  <ActionItem key={i} {...item} />
                ))}
              </div>
            </SectionCard>
          )}

          {/* Current Order Tracking */}
          {loading ? (
            <SkeletonCard />
          ) : activeOrder ? (
            <div>
              <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-600" />
                Current Order
              </h2>
              <CurrentOrderCard order={activeOrder} />
            </div>
          ) : null}

          {/* Recent Orders */}
          <SectionCard>
            <SectionHeader
              title="Recent Orders"
              action={
                <Link href="/account/orders" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                  View All <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              }
            />
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {orders.slice(0, 3).map(order => (
                  <div key={order.id} className="px-5 py-4 hover:bg-slate-50 transition">
                    <div className="flex items-start gap-3">
                      <img
                        src={order.items[0].image}
                        alt={order.items[0].name}
                        className="h-14 w-14 rounded-xl object-cover bg-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-500">{order.orderId}</p>
                            <p className="text-sm font-semibold text-slate-900 line-clamp-1">{order.items[0].name}</p>
                            {order.items.length > 1 && <p className="text-xs text-slate-400">+{order.items.length - 1} more</p>}
                          </div>
                          <StatusBadge status={order.status} />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-black text-slate-900">₹{order.total.toLocaleString('en-IN')}</span>
                          <div className="flex gap-2">
                            <Link href={`/account/orders/${order.orderId}`} className="text-xs text-blue-600 font-semibold hover:underline">
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Rewards Banner */}
          {loyalty && <RewardBanner loyalty={loyalty} />}

          {/* Wishlist Highlights */}
          {wishlist.length > 0 && (
            <SectionCard>
              <SectionHeader
                title="💛 Wishlist"
                action={
                  <Link href="/account/wishlist" className="text-xs text-blue-600 font-semibold hover:underline">
                    View All ({wishlist.length})
                  </Link>
                }
              />
              <div className="p-3 space-y-2">
                {wishlist.slice(0, 3).map(item => (
                  <ProductMiniCard key={item.id} item={item} />
                ))}
              </div>
            </SectionCard>
          )}

          {/* Quick Support */}
          <SectionCard>
            <SectionHeader title="Support" />
            <div className="p-4 space-y-2">
              {[
                { icon: <Truck className="h-4 w-4 text-blue-600" />, label: 'Track Order', href: '/account/orders' },
                { icon: <RotateCcw className="h-4 w-4 text-amber-600" />, label: 'Returns & Refunds', href: '/account/returns' },
                { icon: <Zap className="h-4 w-4 text-purple-600" />, label: 'Support Tickets', href: '/account/support' },
                { icon: <MapPin className="h-4 w-4 text-rose-600" />, label: 'Manage Addresses', href: '/account/addresses' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition group"
                >
                  <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-slate-700 flex-1">{item.label}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE EXPORT ──────────────────────────────────────────────────────────────
export default function AccountDashboard() {
  return (
    <AccountLayout>
      <AccountHeader />
      <DashboardContent />
    </AccountLayout>
  );
}
