'use client';

import React from 'react';
import RolePortalLayout, { PortalNavItem } from '@/components/layout/RolePortalLayout';
import {
  Truck, CheckCircle2, DollarSign, History, User, Smartphone
} from 'lucide-react';

const DELIVERY_NAV_ITEMS: PortalNavItem[] = [
  {
    title: 'Daily Run Sheet',
    href: '/delivery',
    icon: Truck,
    badge: '3 Pending',
    badgeVariant: 'warning',
  },
  {
    title: 'Doorstep Verify & OTP',
    href: '/delivery/verify',
    icon: Smartphone,
    badge: 'Live',
    badgeVariant: 'primary',
  },
  {
    title: 'Instant Payouts & Cash',
    href: '/delivery/payouts',
    icon: DollarSign,
  },
  {
    title: 'Completed Runs',
    href: '/delivery/history',
    icon: History,
  },
  {
    title: 'Executive Profile',
    href: '/delivery/profile',
    icon: User,
  },
];

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  return (
    <RolePortalLayout
      roleKey="delivery"
      accentColor="emerald"
      navItems={DELIVERY_NAV_ITEMS}
    >
      {children}
    </RolePortalLayout>
  );
}
