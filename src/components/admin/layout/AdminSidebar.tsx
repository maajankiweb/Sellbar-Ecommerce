'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingCart,
  ShoppingBag,
  Users,
  Megaphone,
  Tag,
  Globe,
  FileText,
  Image as ImageIcon,
  BarChart3,
  CreditCard,
  Truck,
  ShieldCheck,
  Headphones,
  Star,
  UserCheck,
  KeyRound,
  History,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number | string }>;
  badge?: string | number;
  badgeVariant?: 'primary' | 'warning' | 'danger' | 'neutral';
}

interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    sidebarCollapsed,
    toggleSidebar,
    mobileMenuOpen,
    setMobileMenuOpen,
    currentRole,
    addToast
  } = useAdmin();

  // Collapsible state for groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    catalog: true,
    orders: true,
    customers: false,
    marketing: false,
    content: false,
    analytics: false,
    finance: false,
    shipping: false,
    payments: false,
    support: false,
    reviews: false,
    users: false,
    settings: false,
  });

  // Automatically open group containing active path
  useEffect(() => {
    if (pathname.includes('/products') || pathname.includes('/categories') || pathname.includes('/inventory')) {
      setExpandedGroups(p => ({ ...p, catalog: true }));
    } else if (pathname.includes('/orders') || pathname.includes('/abandoned-carts')) {
      setExpandedGroups(p => ({ ...p, orders: true }));
    } else if (pathname.includes('/marketing') || pathname.includes('/coupons') || pathname.includes('/seo')) {
      setExpandedGroups(p => ({ ...p, marketing: true }));
    } else if (pathname.includes('/settings')) {
      setExpandedGroups(p => ({ ...p, settings: true }));
    }
  }, [pathname]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const navGroups: NavGroup[] = [
    {
      id: 'main',
      title: 'MAIN',
      items: [
        { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      id: 'catalog',
      title: 'CATALOG',
      items: [
        { title: 'All Products', href: '/admin/products', icon: Package },
        { title: 'Add Product', href: '/admin/products/new', icon: Package },
        { title: 'Categories', href: '/admin/categories', icon: Layers },
        { title: 'Inventory', href: '/admin/inventory', icon: Boxes, badge: '4 Low', badgeVariant: 'warning' },
      ],
    },
    {
      id: 'orders',
      title: 'ORDERS',
      items: [
        { title: 'All Orders', href: '/admin/orders', icon: ShoppingCart, badge: '5 New', badgeVariant: 'primary' },
        { title: 'Abandoned Carts', href: '/admin/abandoned-carts', icon: ShoppingBag },
      ],
    },
    {
      id: 'customers',
      title: 'CUSTOMERS',
      items: [
        { title: 'Customers Directory', href: '/admin/customers', icon: Users },
      ],
    },
    {
      id: 'marketing',
      title: 'MARKETING',
      items: [
        { title: 'Campaigns', href: '/admin/marketing', icon: Megaphone },
        { title: 'Coupons & Discounts', href: '/admin/coupons', icon: Tag },
        { title: 'SEO & Metadata', href: '/admin/seo', icon: Globe },
      ],
    },
    {
      id: 'content',
      title: 'CONTENT',
      items: [
        { title: 'Content Management', href: '/admin/content', icon: FileText },
        { title: 'Media Library', href: '/admin/media', icon: ImageIcon },
      ],
    },
    {
      id: 'analytics',
      title: 'ANALYTICS',
      items: [
        { title: 'Sales Analytics', href: '/admin/analytics', icon: BarChart3 },
      ],
    },
    {
      id: 'finance',
      title: 'FINANCE',
      items: [
        { title: 'Finance & Invoices', href: '/admin/finance', icon: CreditCard },
      ],
    },
    {
      id: 'shipping',
      title: 'SHIPPING',
      items: [
        { title: 'Shipping & Delivery', href: '/admin/shipping', icon: Truck },
      ],
    },
    {
      id: 'payments',
      title: 'PAYMENTS',
      items: [
        { title: 'Payment Gateways', href: '/admin/payments', icon: CreditCard },
      ],
    },
    {
      id: 'support',
      title: 'SUPPORT',
      items: [
        { title: 'Support Tickets', href: '/admin/support', icon: Headphones, badge: '2', badgeVariant: 'danger' },
      ],
    },
    {
      id: 'reviews',
      title: 'REVIEWS',
      items: [
        { title: 'Review Moderation', href: '/admin/reviews', icon: Star, badge: '1', badgeVariant: 'warning' },
      ],
    },
    {
      id: 'users',
      title: 'USERS & ACCESS',
      items: [
        { title: 'Admin Users', href: '/admin/users', icon: UserCheck },
        { title: 'Roles & Permissions', href: '/admin/roles', icon: KeyRound },
        { title: 'Activity Logs', href: '/admin/activity-logs', icon: History },
      ],
    },
    {
      id: 'settings',
      title: 'SETTINGS',
      items: [
        { title: 'Store Settings', href: '/admin/settings', icon: Settings },
        { title: 'General Info', href: '/admin/settings/general', icon: Settings },
        { title: 'Payment Settings', href: '/admin/settings/payments', icon: CreditCard },
        { title: 'Shipping Config', href: '/admin/settings/shipping', icon: Truck },
        { title: 'Notifications', href: '/admin/settings/notifications', icon: Megaphone },
        { title: 'Security & 2FA', href: '/admin/settings/security', icon: ShieldCheck },
      ],
    },
  ];

  const handleLogout = () => {
    // Clear cookies
    document.cookie = 'selbar_access_token=; path=/; max-age=0;';
    document.cookie = 'selbar_refresh_token=; path=/; max-age=0;';
    addToast({ title: 'Logged Out', message: 'You have been safely signed out.', type: 'info' });
    router.push('/admin/login');
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-slate-900 text-slate-100">
      {/* Brand Header */}
      <div
        className={`flex h-16 shrink-0 items-center border-b border-slate-800 transition-all ${
          sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'
        }`}
      >
        {!sidebarCollapsed ? (
          <>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2.5 font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-black text-white shadow-md shadow-blue-500/30">
                S
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wide text-white">SELBAR ADMIN</span>
                <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">Enterprise OS</span>
              </div>
            </Link>

            {/* Desktop collapse toggle button */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex rounded-lg p-2 text-white bg-slate-800/90 hover:bg-slate-700 hover:text-white transition-all cursor-pointer border border-slate-700 shadow-xs"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4 text-white" strokeWidth={2.5} />
            </button>
          </>
        ) : (
          /* Desktop expand toggle button when collapsed */
          <div className="flex items-center justify-center w-full">
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-800 hover:bg-blue-600 text-white transition-all cursor-pointer border border-slate-700/90 hover:border-blue-500 shadow-sm group"
              title="Expand Sidebar"
            >
              <ChevronRight className="h-5 w-5 text-white group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* Mobile close button */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden rounded-lg p-1.5 text-white hover:bg-slate-800"
        >
          <X className="h-5 w-5 text-white" strokeWidth={2.5} />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {navGroups.map(group => {
          const isMain = group.id === 'main';
          // When collapsed, always display all group icons so everything is accessible
          const isExpanded = sidebarCollapsed || isMain || expandedGroups[group.id];

          return (
            <div key={group.id} className="space-y-1">
              {/* Group Title or Subtle Divider when Collapsed */}
              {!isMain && (
                !sidebarCollapsed ? (
                  <div
                    onClick={() => toggleGroup(group.id)}
                    className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase select-none transition-colors cursor-pointer hover:text-white"
                  >
                    <span>{group.title}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                        isExpanded ? 'rotate-0' : '-rotate-90'
                      }`}
                      strokeWidth={2.2}
                    />
                  </div>
                ) : (
                  <div className="my-2 mx-auto w-8 h-px bg-slate-800" />
                )
              )}

              {/* Items */}
              {isExpanded && (
                <div className="space-y-1">
                  {group.items.map(item => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/admin/dashboard' &&
                        pathname.startsWith(item.href) &&
                        ![
                          '/admin/products/new',
                          '/admin/settings/general',
                          '/admin/settings/payments',
                          '/admin/settings/shipping',
                          '/admin/settings/notifications',
                          '/admin/settings/security',
                        ].includes(pathname));

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        title={item.title}
                        className={`group relative flex items-center transition-all ${
                          sidebarCollapsed
                            ? 'w-11 h-11 mx-auto justify-center rounded-xl'
                            : 'gap-3 rounded-lg px-3 py-2 text-xs font-semibold'
                        } ${
                          isActive
                            ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                            : 'text-white hover:bg-slate-800/90 hover:text-white'
                        }`}
                      >
                        {/* High-contrast bold white icon */}
                        <Icon
                          className={`shrink-0 text-white transition-transform group-hover:scale-110 ${
                            sidebarCollapsed ? 'h-5 w-5' : 'h-4 w-4'
                          }`}
                          strokeWidth={2.5}
                        />

                        {!sidebarCollapsed && (
                          <span className="flex-1 truncate text-white">{item.title}</span>
                        )}

                        {/* Collapsed badge indicator dot */}
                        {sidebarCollapsed && item.badge && (
                          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-blue-400 ring-2 ring-slate-900" />
                        )}

                        {/* Collapsed floating tooltip on hover */}
                        {sidebarCollapsed && (
                          <div className="pointer-events-none fixed left-[84px] z-50 hidden rounded-md bg-slate-950 px-2.5 py-1 text-xs font-bold text-white shadow-2xl ring-1 ring-slate-700 group-hover:block whitespace-nowrap">
                            {item.title}
                            {item.badge && (
                              <span className="ml-1.5 px-1.5 py-0.2 rounded bg-blue-600 text-[10px] text-white">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}

                        {!sidebarCollapsed && item.badge && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-tight ${
                              item.badgeVariant === 'warning'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : item.badgeVariant === 'danger'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer User Profile Card */}
      <div className="shrink-0 border-t border-slate-800 p-3 bg-slate-950/40">
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'flex-col justify-center' : ''}`}>
          <div className="relative group cursor-pointer" title={sidebarCollapsed ? 'Arjun Nambiar (Super Admin)' : undefined}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Admin Avatar"
              className="h-9 w-9 rounded-full object-cover border border-slate-700"
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
          </div>

          {!sidebarCollapsed ? (
            <>
              <div className="flex flex-1 flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate">
                  Arjun Nambiar
                </span>
                <span className="text-[10px] text-blue-400 truncate">
                  {currentRole}
                </span>
              </div>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-white" strokeWidth={2.4} />
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 hover:text-rose-400 transition-colors cursor-pointer mt-1"
            >
              <LogOut className="h-4 w-4 text-white" strokeWidth={2.4} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:flex-col border-r border-slate-800 transition-all duration-200 ${
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Off-Canvas Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Slide-out Menu */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl transition-transform animate-slide-right">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
