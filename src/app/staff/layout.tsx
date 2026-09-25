'use client';

import React from 'react';
import RolePortalLayout, { PortalNavItem } from '@/components/layout/RolePortalLayout';
import {
  Laptop, CheckCircle2, QrCode, Clock, User, Wrench
} from 'lucide-react';

const STAFF_NAV_ITEMS: PortalNavItem[] = [
  {
    title: 'Testing Queue',
    href: '/staff',
    icon: Laptop,
    badge: '4 In Queue',
    badgeVariant: 'warning',
  },
  {
    title: '64-Pt Diagnostics',
    href: '/staff/diagnostics',
    icon: Wrench,
    badge: 'Bench Ready',
    badgeVariant: 'primary',
  },
  {
    title: 'Packaging & Labels',
    href: '/staff/packaging',
    icon: QrCode,
  },
  {
    title: 'Shift & Attendance',
    href: '/staff/attendance',
    icon: Clock,
  },
  {
    title: 'Technician Profile',
    href: '/staff/profile',
    icon: User,
  },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <RolePortalLayout
      roleKey="staff"
      accentColor="cyan"
      navItems={STAFF_NAV_ITEMS}
    >
      {children}
    </RolePortalLayout>
  );
}
