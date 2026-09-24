'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import AuthModal from '../auth/AuthModal';

export default function StorefrontLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // If inside admin panel, seller dashboard, or account management portal,
  // completely suppress the storefront Header, Footer, CartDrawer, and AuthModal
  const isDashboardRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/seller') ||
    pathname.startsWith('/account');

  if (isDashboardRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>
      <CartDrawer />
      <AuthModal />
      <Footer />
    </>
  );
}
