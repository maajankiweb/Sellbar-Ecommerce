import type { Metadata } from 'next';
import { AdminProvider } from '@/context/AdminContext';
import { AdminLayoutShell } from '@/components/admin/layout/AdminLayoutShell';

export const metadata: Metadata = {
  title: 'SELBAR Admin | Modern E-Commerce Operating System',
  description: 'Enterprise administration, analytics, order fulfillment, catalog, and inventory management.',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </AdminProvider>
  );
}
