'use client';

import React from 'react';
import RolePortalLayout, { PortalNavItem } from '@/components/layout/RolePortalLayout';
import {
  Store, ShoppingBag, PackageCheck, CreditCard, User, Layers
} from 'lucide-react';

const SELLER_NAV_ITEMS: PortalNavItem[] = [
  {
    title: 'Merchant Central',
    href: '/seller',
    icon: Store,
  },
  {
    title: 'Refurb Inventory',
    href: '/seller/inventory',
    icon: Layers,
    badge: '18 SKUs',
    badgeVariant: 'primary',
  },
  {
    title: 'Customer Orders',
    href: '/seller/orders',
    icon: ShoppingBag,
    badge: '2 New',
    badgeVariant: 'warning',
  },
  {
    title: 'Bank Settlements',
    href: '/seller/payouts',
    icon: CreditCard,
  },
  {
    title: 'Merchant Profile',
    href: '/seller/profile',
    icon: User,
  },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RolePortalLayout
      roleKey="seller"
      accentColor="blue"
      navItems={SELLER_NAV_ITEMS}
    >
      {children}
    </RolePortalLayout>
  );
}
