'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { mockNotifications, mockProfile } from '@/lib/account/mockData';
import { Notification } from '@/types/account';
import {
  LayoutDashboard, User, MapPin, Bell, Package, Heart, Eye, Sparkles,
  CreditCard, RotateCcw, Wallet, Gift, Award, Users, LifeBuoy,
  Star, ShieldCheck, ActivitySquare, Settings, LogOut, HelpCircle,
  ChevronRight, X, ShoppingCart, Home, Menu,
  MessageSquare, ChevronDown,
} from 'lucide-react';

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
interface AccountContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);
export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used inside AccountLayout');
  return ctx;
}

// ─── NAV GROUPS ──────────────────────────────────────────────────────────────
const navGroups = [
  {
    label: 'ACCOUNT',
    items: [
      { href: '/account', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { href: '/account/profile', label: 'Profile', icon: User },
      { href: '/account/addresses', label: 'Addresses', icon: MapPin },
      { href: '/account/preferences', label: 'Communication', icon: Bell },
    ],
  },
  {
    label: 'SHOPPING',
    items: [
      { href: '/account/orders', label: 'My Orders', icon: Package },
      { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
      { href: '/account/recently-viewed', label: 'Recently Viewed', icon: Eye },
      { href: '/account/recommendations', label: 'For You', icon: Sparkles },
    ],
  },
  {
    label: 'PAYMENTS',
    items: [
      { href: '/account/payment-methods', label: 'Payment Methods', icon: CreditCard },
      { href: '/account/transactions', label: 'Transactions', icon: RotateCcw },
      { href: '/account/wallet', label: 'Wallet / Store Credit', icon: Wallet },
      { href: '/account/gift-cards', label: 'Gift Cards', icon: Gift },
    ],
  },
  {
    label: 'REWARDS',
    items: [
      { href: '/account/rewards', label: 'Loyalty & Rewards', icon: Award },
      { href: '/account/referrals', label: 'Referral Program', icon: Users },
    ],
  },
  {
    label: 'SUPPORT',
    items: [
      { href: '/account/support', label: 'Support Tickets', icon: LifeBuoy },
      { href: '/account/help', label: 'Help Center', icon: HelpCircle },
      { href: '/account/reviews', label: 'My Reviews', icon: Star },
    ],
  },
  {
    label: 'SECURITY',
    items: [
      { href: '/account/security', label: 'Password & Security', icon: ShieldCheck },
      { href: '/account/login-activity', label: 'Login Activity', icon: ActivitySquare },
      { href: '/account/settings', label: 'Account Settings', icon: Settings },
    ],
  },
];

// ─── SIDEBAR CONTENT ─────────────────────────────────────────────────────────
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const toggleGroup = (label: string) => {
    setCollapsed(c => ({ ...c, [label]: !c[label] }));
  };

  return (
    <div className="flex h-full flex-col bg-white border-r border-slate-100">
      {/* Brand / Close */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 shrink-0">
        <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight">
          <span className="text-blue-600">SEL</span>
          <span className="text-emerald-600">BAR</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="px-4 py-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={mockProfile.avatar}
              alt={mockProfile.name}
              className="h-11 w-11 rounded-full object-cover border-2 border-emerald-500/30"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm text-slate-900 truncate">{mockProfile.name}</p>
            <p className="text-xs text-slate-500 truncate">{mockProfile.email}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold">
                <Award className="h-2.5 w-2.5" />
                {mockProfile.tier}
              </span>
              <span className="text-[10px] text-slate-400">{mockProfile.points.toLocaleString('en-IN')} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-3 space-y-1 px-2">
        {navGroups.map(group => {
          const isGroupCollapsed = collapsed[group.label];
          return (
            <div key={group.label}>
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex items-center justify-between w-full px-3 py-1.5 mb-1 group"
              >
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase group-hover:text-slate-600 transition-colors">
                  {group.label}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-slate-300 transition-transform duration-200 ${isGroupCollapsed ? '-rotate-90' : ''}`}
                />
              </button>

              {!isGroupCollapsed && (
                <div className="space-y-0.5 mb-3">
                  {group.items.map(item => {
                    const Icon = item.icon;
                    const active = isActive(item.href, item.exact);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                          active
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 shrink-0 transition-colors ${
                            active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                        <span className="flex-1">{item.label}</span>
                        {active && <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-slate-100 p-3 space-y-1">
        <Link
          href="/account/help"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
        >
          <HelpCircle className="h-4 w-4 text-slate-400" />
          Help
        </Link>
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ─── ACCOUNT LAYOUT ───────────────────────────────────────────────────────────
export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const markRead = (id: string) => setNotifications(n => n.map(notif => notif.id === id ? { ...notif, isRead: true } : notif));
  const markAllRead = () => setNotifications(n => n.map(notif => ({ ...notif, isRead: true })));

  return (
    <AccountContext.Provider value={{ sidebarOpen, setSidebarOpen, notifications, unreadCount, markRead, markAllRead }}>
      <div className="min-h-screen bg-slate-50">

        {/* Desktop Sidebar */}
        <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:flex-col lg:w-64 xl:w-72 z-30">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative w-72 max-w-[85vw] shadow-2xl animate-in slide-in-from-left duration-200">
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="lg:pl-64 xl:pl-72 flex flex-col min-h-screen">
          {children}
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 safe-area-bottom">
          <div className="grid grid-cols-5 h-16">
            {[
              { href: '/', label: 'Home', icon: Home },
              { href: '/account/orders', label: 'Orders', icon: Package },
              { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
              { href: '/cart', label: 'Cart', icon: ShoppingCart },
              { href: '/account', label: 'Account', icon: User },
            ].map(item => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                    active ? 'text-blue-600' : 'text-slate-500'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </AccountContext.Provider>
  );
}
