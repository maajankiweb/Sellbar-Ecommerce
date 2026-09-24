'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RoleType } from '@/types/admin';

export interface AdminToast {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'stock' | 'review' | 'system' | 'security';
  link?: string;
}

interface AdminContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  currentRole: RoleType;
  setCurrentRole: (role: RoleType) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  toasts: AdminToast[];
  addToast: (toast: Omit<AdminToast, 'id'>) => void;
  removeToast: (id: string) => void;
  notifications: AdminNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  lastUpdated: string;
  refreshDashboard: () => void;
  isRefreshing: boolean;
}

const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-1',
    title: 'New High-Value Order #ORD-10245',
    message: 'Rahul Sharma placed an order for ₹1,28,994 (Apple iPhone 15 Pro).',
    time: '5m ago',
    read: false,
    type: 'order',
    link: '/admin/orders/ord-10245'
  },
  {
    id: 'notif-2',
    title: 'Low Stock Alert: Nike Air Max',
    message: 'Only 4 units left in inventory. Reorder threshold reached.',
    time: '25m ago',
    read: false,
    type: 'stock',
    link: '/admin/inventory'
  },
  {
    id: 'notif-3',
    title: 'New 5-Star Customer Review',
    message: 'Priya Patel reviewed Sony WH-1000XM5: "Silence is unmatched".',
    time: '1h ago',
    read: false,
    type: 'review',
    link: '/admin/reviews'
  },
  {
    id: 'notif-4',
    title: 'Payout Processed Successfully',
    message: 'Weekly settlement of ₹4,82,500 transferred to merchant bank account.',
    time: '4h ago',
    read: true,
    type: 'system',
    link: '/admin/finance'
  }
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('light');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<RoleType>('Super Admin');
  const [dateRange, setDateRange] = useState('30d');
  const [toasts, setToasts] = useState<AdminToast[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>(INITIAL_NOTIFICATIONS);
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize theme and sidebar preference from localStorage
  useEffect(() => {
    try {
      const savedSidebar = localStorage.getItem('selbar_admin_sidebar_collapsed');
      if (savedSidebar !== null) {
        setSidebarCollapsed(savedSidebar === 'true');
      }

      const savedTheme = localStorage.getItem('selbar_admin_theme') as 'light' | 'dark' | 'system' | null;
      if (savedTheme) {
        setThemeState(savedTheme);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Sync theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('selbar_admin_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('selbar_admin_theme', newTheme);
    } catch {}
  };

  const addToast = (toast: Omit<AdminToast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast({ title: 'Notifications Marked', message: 'All notifications marked as read', type: 'info' });
  };

  const clearNotifications = () => {
    setNotifications([]);
    addToast({ title: 'Cleared', message: 'Notification tray cleared', type: 'info' });
  };

  const refreshDashboard = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated('Just now');
      setIsRefreshing(false);
      addToast({ title: 'Dashboard Refreshed', message: 'Fetched latest operational metrics', type: 'success' });
    }, 600);
  };

  return (
    <AdminContext.Provider
      value={{
        sidebarCollapsed,
        toggleSidebar,
        mobileMenuOpen,
        setMobileMenuOpen,
        theme,
        setTheme,
        isSearchOpen,
        setIsSearchOpen,
        currentRole,
        setCurrentRole,
        dateRange,
        setDateRange,
        toasts,
        addToast,
        removeToast,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        lastUpdated,
        refreshDashboard,
        isRefreshing
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
