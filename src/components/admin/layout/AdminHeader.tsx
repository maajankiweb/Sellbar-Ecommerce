'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Laptop,
  RotateCw,
  ChevronRight,
  User,
  Shield,
  CheckCheck,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { RoleType } from '@/types/admin';

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    setMobileMenuOpen,
    theme,
    setTheme,
    setIsSearchOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    lastUpdated,
    refreshDashboard,
    isRefreshing,
    currentRole,
    setCurrentRole,
    addToast
  } = useAdmin();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setThemeOpen(false);
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

  const rolesList: RoleType[] = [
    'Super Admin',
    'Order Manager',
    'Product Manager',
    'Marketing Manager',
    'Support Agent',
  ];

  const handleRoleChange = (role: RoleType) => {
    setCurrentRole(role);
    setProfileOpen(false);
    addToast({
      title: 'Active Role Switched',
      message: `Now operating with permissions of: ${role}`,
      type: 'info'
    });
  };

  const handleLogout = () => {
    document.cookie = 'selbar_access_token=; path=/; max-age=0;';
    document.cookie = 'selbar_refresh_token=; path=/; max-age=0;';
    router.push('/admin/login');
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Dynamic Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
          <Link
            href="/admin/dashboard"
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          {breadcrumbs
            .filter(b => b.url !== '/admin' && b.url !== '/admin/dashboard')
            .map((b, i) => (
              <React.Fragment key={i}>
                <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
                {b.isLast ? (
                  <span className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {b.name}
                  </span>
                ) : (
                  <Link
                    href={b.url}
                    className="hover:text-slate-900 dark:hover:text-white transition-colors truncate"
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
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-500 hover:border-slate-300 hover:bg-white dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:border-slate-600 cursor-pointer transition-all"
        >
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <span className="hidden md:inline">Search products, orders, customers...</span>
          <kbd className="hidden sm:inline-flex items-center rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Refresh Button */}
        <button
          onClick={refreshDashboard}
          title={`Last updated: ${lastUpdated}. Click to refresh.`}
          className="flex items-center gap-1.5 rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <RotateCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          <span className="hidden xl:inline text-[11px] text-slate-400">
            {lastUpdated}
          </span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
                  >
                    <CheckCheck className="h-3 w-3" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3.5 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                        !n.read ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="text-xs font-semibold text-slate-900 dark:text-white">
                          {n.title}
                        </h5>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {n.time}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {n.message}
                      </p>
                      {n.link && (
                        <Link
                          href={n.link}
                          onClick={() => setNotificationsOpen(false)}
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400"
                        >
                          View Details <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Dropdown */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => setThemeOpen(!themeOpen)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <Moon className="h-4 w-4 text-blue-400" />
            ) : theme === 'light' ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Laptop className="h-4 w-4" />
            )}
          </button>

          {themeOpen && (
            <div className="absolute right-0 mt-2 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50 text-xs">
              <button
                onClick={() => {
                  setTheme('light');
                  setThemeOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 cursor-pointer ${
                  theme === 'light' ? 'bg-blue-50 text-blue-600 dark:bg-slate-800' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <Sun className="h-3.5 w-3.5 text-amber-500" /> Light
              </button>
              <button
                onClick={() => {
                  setTheme('dark');
                  setThemeOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 cursor-pointer ${
                  theme === 'dark' ? 'bg-blue-50 text-blue-600 dark:bg-slate-800' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <Moon className="h-3.5 w-3.5 text-blue-400" /> Dark
              </button>
              <button
                onClick={() => {
                  setTheme('system');
                  setThemeOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 cursor-pointer ${
                  theme === 'system' ? 'bg-blue-50 text-blue-600 dark:bg-slate-800' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <Laptop className="h-3.5 w-3.5 text-slate-400" /> System
              </button>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown & Role Switcher */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Admin"
              className="h-7 w-7 rounded-full object-cover border border-slate-300 dark:border-slate-700"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Arjun Nambiar
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                {currentRole}
              </span>
            </div>
            <ChevronDown className="hidden md:block h-3 w-3 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="border-b border-slate-100 px-3.5 py-2.5 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Arjun Nambiar
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  admin@selbar.com
                </p>
              </div>

              {/* Role Switcher */}
              <div className="px-3.5 py-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Role Preview
                </span>
                <div className="mt-1 space-y-0.5">
                  {rolesList.map(r => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-xs cursor-pointer ${
                        currentRole === r
                          ? 'bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950 dark:text-blue-300'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{r}</span>
                      {currentRole === r && (
                        <Shield className="h-3 w-3 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <Link
                  href="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-2 px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Store Settings
                </Link>
                <Link
                  href="/admin/settings/security"
                  onClick={() => setProfileOpen(false)}
                  className="flex w-full items-center gap-2 px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Security & 2FA
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                >
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
