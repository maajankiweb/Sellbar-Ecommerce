'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAccount } from './AccountLayout';
import {
  Menu, Search, Bell, ShoppingCart, ChevronRight, User, Package,
  Settings, LogOut, X, CheckCheck, ExternalLink,
} from 'lucide-react';

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: { label: string; href: string }[] = [{ label: 'Account', href: '/account' }];
  const labels: Record<string, string> = {
    profile: 'Profile', addresses: 'Addresses', preferences: 'Communication Preferences',
    orders: 'My Orders', wishlist: 'Wishlist', 'recently-viewed': 'Recently Viewed',
    recommendations: 'For You', 'payment-methods': 'Payment Methods',
    transactions: 'Transactions', wallet: 'Wallet', 'gift-cards': 'Gift Cards',
    rewards: 'Loyalty & Rewards', referrals: 'Referrals', support: 'Support',
    help: 'Help Center', reviews: 'Reviews', security: 'Security',
    'login-activity': 'Login Activity', settings: 'Account Settings', returns: 'Returns',
  };
  let acc = '';
  for (const seg of segments.slice(1)) {
    acc += '/' + seg;
    crumbs.push({ label: labels[seg] || seg, href: '/account' + acc });
  }
  return crumbs;
}

export default function AccountHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { setSidebarOpen, notifications, unreadCount, markAllRead } = useAccount();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-xs">
      <div className="px-4 sm:px-6 h-16 flex items-center gap-3">
        {/* Hamburger (Mobile) */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-1 text-sm flex-1 min-w-0">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb.href}>
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />}
              {i === breadcrumbs.length - 1 ? (
                <span className="font-semibold text-slate-900 truncate">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-slate-500 hover:text-slate-900 transition shrink-0">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
        <div className="lg:hidden flex-1" />

        {/* Search */}
        {searchOpen ? (
          <div className="flex-1 flex items-center gap-2 max-w-sm">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search orders, products, help..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
            <button onClick={() => setSearchOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
            className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
                {notifications.slice(0, 6).map(n => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 hover:bg-slate-50 transition cursor-pointer ${!n.isRead ? 'bg-blue-50/40' : ''}`}
                    onClick={() => markAllRead()}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-blue-500' : 'bg-slate-300'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 leading-snug">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-snug line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {new Date(n.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-slate-100">
                <Link href="/account/settings" className="flex items-center justify-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline">
                  View all notifications
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Cart */}
        <Link href="/cart" className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition" aria-label="Cart">
          <ShoppingCart className="h-5 w-5" />
        </Link>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition"
          >
            <img
              src={user?.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff&size=64` : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64'}
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="font-semibold text-sm text-slate-900 truncate">{user?.name || 'Guest'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
              </div>
              <div className="py-1">
                {[
                  { href: '/account/profile', label: 'My Profile', icon: User },
                  { href: '/account/orders', label: 'Orders', icon: Package },
                  { href: '/account/settings', label: 'Settings', icon: Settings },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Icon className="h-4 w-4 text-slate-400" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <div className="py-1 border-t border-slate-100">
                <button
                  onClick={() => { logout(); setProfileOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
