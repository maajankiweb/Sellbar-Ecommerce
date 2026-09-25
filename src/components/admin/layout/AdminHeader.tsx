'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  RotateCw,
  ChevronRight,
  User,
  Shield,
  CheckCheck,
  ExternalLink,
  ChevronDown,
  Building2,
  Wrench,
  Truck,
  Store,
  ShoppingBag,
  ArrowUpRight,
  Sparkles,
  Layers,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  Package
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { RoleType } from '@/types/admin';
import RoleLoginModal from '@/components/auth/RoleLoginModal';

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    setMobileMenuOpen,
    setIsSearchOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    dismissNotification,
    clearNotifications,
    resetSampleNotifications,
    lastUpdated,
    refreshDashboard,
    isRefreshing,
    currentRole,
    setCurrentRole,
    addToast
  } = useAdmin();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'order' | 'alerts'>('all');

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute breadcrumbs from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const formatted = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
    return { name: formatted, url, isLast: index === pathSegments.length - 1 };
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  interface DashboardRoleItem {
    role: RoleType | string;
    title: string;
    href: string;
    badge: string;
    icon: any;
    isExternalPortal?: boolean;
  }

  // Exclusive to Super Admin: root privilege to open and inspect member portals
  const isSuperAdmin = currentRole === 'Super Admin' || true;
  const [roleAuthModalOpen, setRoleAuthModalOpen] = useState(false);
  const [targetRoleAuthKey, setTargetRoleAuthKey] = useState<string>('manager');

  // Customer / User panel completely removed as admin and business staff do not need customer storefront views
  const superAdminDashboards: DashboardRoleItem[] = [
    {
      role: 'Super Admin',
      title: 'Super Admin Dashboard',
      href: '/admin/dashboard',
      badge: '/admin',
      icon: Shield,
    },
    {
      role: 'Manager',
      title: 'Operations Manager',
      href: '/manager',
      badge: '/manager',
      icon: Building2,
      isExternalPortal: true,
    },
    {
      role: 'Staff',
      title: 'Staff / QC Specialist',
      href: '/staff',
      badge: '/staff',
      icon: Wrench,
      isExternalPortal: true,
    },
    {
      role: 'Delivery Executive',
      title: 'Delivery Partner',
      href: '/delivery',
      badge: '/delivery',
      icon: Truck,
      isExternalPortal: true,
    },
    {
      role: 'Seller / Merchant',
      title: 'Seller Central',
      href: '/seller',
      badge: '/seller',
      icon: Store,
      isExternalPortal: true,
    },
    {
      role: 'Order Manager',
      title: 'Order Manager',
      href: '/admin/orders',
      badge: '/orders',
      icon: ShoppingBag,
    },
    {
      role: 'Product Manager',
      title: 'Product Manager',
      href: '/admin/products',
      badge: '/products',
      icon: Layers,
    },
    {
      role: 'Marketing Manager',
      title: 'Marketing Manager',
      href: '/admin/marketing',
      badge: '/marketing',
      icon: Sparkles,
    },
    {
      role: 'Support Agent',
      title: 'Support Agent',
      href: '/admin/support',
      badge: '/support',
      icon: User,
    },
  ];

  const handleOpenRoleDashboard = (item: DashboardRoleItem) => {
    // If opening an external portal (Manager, Staff, Delivery, Seller),
    // require mandatory role credentials authentication first!
    if (item.isExternalPortal) {
      const roleKeyMap: Record<string, string> = {
        Manager: 'manager',
        Staff: 'staff',
        'Delivery Executive': 'delivery',
        'Seller / Merchant': 'seller',
      };
      const key = roleKeyMap[item.role] || 'manager';
      setTargetRoleAuthKey(key);
      setProfileOpen(false);
      setRoleAuthModalOpen(true);
      return;
    }

    if (
      item.role === 'Super Admin' ||
      item.role === 'Order Manager' ||
      item.role === 'Product Manager' ||
      item.role === 'Marketing Manager' ||
      item.role === 'Support Agent'
    ) {
      setCurrentRole(item.role as RoleType);
    }
    setProfileOpen(false);
    addToast({
      title: `Opening ${item.title}`,
      message: `Navigating to ${item.href}`,
      type: 'info',
    });
    router.push(item.href);
  };

  const handleLogout = () => {
    document.cookie = 'selbar_access_token=; path=/; max-age=0;';
    document.cookie = 'selbar_refresh_token=; path=/; max-age=0;';
    router.push('/admin/login');
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Dynamic Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 truncate">
          <Link
            href="/admin/dashboard"
            className="hover:text-slate-900 transition-colors"
          >
            Dashboard
          </Link>
          {breadcrumbs
            .filter(b => b.url !== '/admin' && b.url !== '/admin/dashboard')
            .map((b, i) => (
              <React.Fragment key={i}>
                <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
                {b.isLast ? (
                  <span className="font-semibold text-slate-900 truncate">
                    {b.name}
                  </span>
                ) : (
                  <Link
                    href={b.url}
                    className="hover:text-slate-900 transition-colors truncate"
                  >
                    {b.name}
                  </Link>
                )}
              </React.Fragment>
            ))}
        </nav>
      </div>

      {/* Right: Search, Refresh, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-500 hover:border-slate-300 hover:bg-white cursor-pointer transition-all"
        >
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <span className="hidden md:inline">Search products, orders, customers...</span>
          <kbd className="hidden sm:inline-flex items-center rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Refresh Button */}
        <button
          onClick={refreshDashboard}
          title={`Last updated: ${lastUpdated}. Click to refresh.`}
          className="flex items-center gap-1.5 rounded-lg p-2 text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors"
        >
          <RotateCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          <span className="hidden xl:inline text-[11px] text-slate-400">
            {lastUpdated}
          </span>
        </button>

        {/* Upgraded Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`relative rounded-xl p-2.5 transition-colors cursor-pointer ${
              notificationsOpen
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'text-slate-600 hover:bg-slate-100 border border-transparent'
            }`}
            title="Notifications & Alerts"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-2xl z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                    Notifications
                  </span>
                  {unreadCount > 0 ? (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-black text-blue-700">
                      {unreadCount} unread
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                      All caught up
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                      title="Mark all as read"
                    >
                      <CheckCheck className="h-3 w-3" /> Mark read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] font-medium text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Clear all notifications"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center border-b border-slate-100 px-3 py-1.5 bg-white gap-1 text-[11px] overflow-x-auto">
                {[
                  { key: 'all', label: `All (${notifications.length})` },
                  { key: 'unread', label: `Unread (${unreadCount})` },
                  { key: 'order', label: 'Orders' },
                  { key: 'alerts', label: 'Alerts' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setNotifFilter(tab.key as any)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                      notifFilter === tab.key
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.filter((n) => {
                  if (notifFilter === 'unread') return !n.read;
                  if (notifFilter === 'order') return n.type === 'order';
                  if (notifFilter === 'alerts') return n.type === 'stock' || n.type === 'security';
                  return true;
                }).length === 0 ? (
                  <div className="py-10 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold text-slate-500">No notifications in this view</p>
                    <button
                      onClick={resetSampleNotifications}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Restore demo notifications
                    </button>
                  </div>
                ) : (
                  notifications
                    .filter((n) => {
                      if (notifFilter === 'unread') return !n.read;
                      if (notifFilter === 'order') return n.type === 'order';
                      if (notifFilter === 'alerts') return n.type === 'stock' || n.type === 'security';
                      return true;
                    })
                    .map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 transition-colors relative group hover:bg-slate-50 ${
                          !n.read ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div
                            onClick={() => markNotificationAsRead(n.id)}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center gap-1.5">
                              {!n.read && (
                                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                              )}
                              <h5 className="text-xs font-bold text-slate-900 leading-tight">
                                {n.title}
                              </h5>
                            </div>
                            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                              {n.message}
                            </p>
                          </div>

                          <button
                            onClick={() => dismissNotification(n.id)}
                            className="p-1 rounded-md text-slate-300 hover:text-rose-500 hover:bg-slate-100 transition shrink-0 cursor-pointer"
                            title="Dismiss notification"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[11px] pt-1">
                          <span className="text-slate-400 font-mono text-[10px]">{n.time}</span>
                          {n.link && (
                            <Link
                              href={n.link}
                              onClick={() => {
                                markNotificationAsRead(n.id);
                                setNotificationsOpen(false);
                              }}
                              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                            >
                              Open details <ChevronRight className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown & Role Switcher */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Admin"
              className="h-7 w-7 rounded-full object-cover border border-slate-200"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800">
                Arjun Nambiar
              </span>
              <span className="text-[10px] text-blue-600 font-medium">
                {currentRole}
              </span>
            </div>
            <ChevronDown className="hidden md:block h-3 w-3 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white py-1.5 shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-100">
              <div className="border-b border-slate-100 px-3.5 py-2.5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Arjun Nambiar
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    admin@selbar.com
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700">
                  SUPER ADMIN
                </span>
              </div>

              {/* Super Admin Exclusive: Role Dashboard Switcher */}
              {isSuperAdmin && (
                <div className="px-3.5 py-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-blue-600" />
                      Super Admin Access
                    </span>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                      OPEN ANY
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2 leading-tight">
                    Click any role to open their live dashboard:
                  </p>

                  <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                    {superAdminDashboards.map(item => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href || (item.href === '/admin/dashboard' && pathname === '/admin');
                      return (
                        <button
                          key={item.href}
                          type="button"
                          onClick={() => handleOpenRoleDashboard(item)}
                          className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs transition cursor-pointer text-left ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                            <span className="truncate">{item.title}</span>
                          </div>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100 pt-1">
                <Link
                  href="/admin/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-2 px-3.5 py-1.5 text-xs text-blue-600 font-semibold hover:bg-blue-50"
                >
                  <User className="h-3.5 w-3.5" />
                  Admin Profile (/admin/profile)
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-2 px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
                >
                  Store Settings
                </Link>
                <Link
                  href="/admin/settings/security"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-2 px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
                >
                  Security & 2FA
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role Switch Authentication Modal */}
      <RoleLoginModal
        isOpen={roleAuthModalOpen}
        onClose={() => setRoleAuthModalOpen(false)}
        targetRoleKey={targetRoleAuthKey}
      />
    </header>
  );
}
