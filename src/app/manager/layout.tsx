'use client';

import React from 'react';
import RolePortalLayout, { PortalNavItem } from '@/components/layout/RolePortalLayout';
import {
  Building2, CheckSquare, Users, Warehouse, User, BarChart3
} from 'lucide-react';

const MANAGER_NAV_ITEMS: PortalNavItem[] = [
  {
    title: 'Hub Command',
    href: '/manager',
    icon: Building2,
  },
  {
    title: 'Trade-in Approvals',
    href: '/manager/approvals',
    icon: CheckSquare,
    badge: '3 High Value',
    badgeVariant: 'warning',
  },
  {
    title: 'Staff Roster & Shifts',
    href: '/manager/staff',
    icon: Users,
    badge: '8 Active',
    badgeVariant: 'primary',
  },
  {
    title: 'Hub Inventory & Safety',
    href: '/manager/inventory',
    icon: Warehouse,
    badge: '2 Low Stock',
    badgeVariant: 'danger',
  },
  {
    title: 'Manager Profile',
    href: '/manager/profile',
    icon: User,
  },
];

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RolePortalLayout
      roleKey="manager"
      accentColor="amber"
      navItems={MANAGER_NAV_ITEMS}
    >
      {children}
    </RolePortalLayout>
  );
}
