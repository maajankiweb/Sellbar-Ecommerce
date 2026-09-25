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
  theme: 'light';
  setTheme: (theme: 'light') => void;
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
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
  resetSampleNotifications: () => void;
  lastUpdated: string;
  refreshDashboard: () => void;
  isRefreshing: boolean;
}

const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-1',
    title: 'New High-Value Order #ORD-10245',
    message: 'Rahul Sharma placed an order for ₹1,28,994 (Apple iPhone 15 Pro Max).',
    time: '5m ago',
    read: false,
    type: 'order',
    link: '/admin/orders'
  },
  {
    id: 'notif-2',
    title: 'Trade-In Approval Pending: ₹87,500',
    message: 'Inspection Bay #1 finished QC for iPhone 15 Pro. Manager authorization required.',
    time: '18m ago',
    read: false,
    type: 'security',
    link: '/manager/approvals'
  },
  {
    id: 'notif-3',
    title: 'Low Stock Alert: Refurbished MacBooks',
    message: 'Only 3 units left in Mumbai Central Hub Bin-MAC-02. Restocking recommended.',
    time: '42m ago',
    read: false,
    type: 'stock',
    link: '/manager/inventory'
  },
  {
    id: 'notif-4',
    title: 'Instant UPI Payout Disbursed',
    message: '₹38,500 credited to customer Rohit Verma for Doorstep Order #PU-77101.',
    time: '1h ago',
    read: true,
    type: 'system',
    link: '/delivery/payouts'
  },
  {
    id: 'notif-5',
    title: 'New 5-Star Customer Review',
    message: 'Priya Patel reviewed Refurbished iPhone 14: "Super fast doorstep cash payout!".',
    time: '3h ago',
    read: true,
    type: 'review',
    link: '/admin'
  }
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme: 'light' = 'light';
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<RoleType>('Super Admin');
  const [dateRange, setDateRange] = useState('30d');
  const [toasts, setToasts] = useState<AdminToast[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>(INITIAL_NOTIFICATIONS);
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize and force clean white/light theme everywhere
  useEffect(() => {
    try {
      localStorage.removeItem('selbar_admin_theme');
      const savedSidebar = localStorage.getItem('selbar_admin_sidebar_collapsed');
      if (savedSidebar !== null) {
        setSidebarCollapsed(savedSidebar === 'true');
      }
    } catch {}

    // Ensure root DOM never has 'dark' class
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

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

  const setTheme = () => {
    // Permanent light theme
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
    }
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

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    addToast({ title: 'Notification Dismissed', message: 'Notification removed from tray', type: 'info' });
  };

  const clearNotifications = () => {
    setNotifications([]);
    addToast({ title: 'Tray Cleared', message: 'All notifications cleared', type: 'info' });
  };

  const resetSampleNotifications = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
    addToast({ title: 'Notifications Reset', message: 'Sample notifications restored', type: 'success' });
  };

  const refreshDashboard = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated('Just now');
      setIsRefreshing(false);
      addToast({ title: 'Dashboard Refreshed', message: 'Operational metrics updated', type: 'success' });
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
        dismissNotification,
        clearNotifications,
        resetSampleNotifications,
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
