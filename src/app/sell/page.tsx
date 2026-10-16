import { Metadata } from 'next';
import { Suspense } from 'react';
import SellCatalogContent from '@/components/sell/SellCatalogContent';

export const revalidate = 3600; // ISR: 1 hour cache revalidation

export const metadata: Metadata = {
  title: 'Sell Old Phone Online for Instant Cash | Sellbar',
  description: 'Sell your old smartphone online with instant transparent price calculation, free doorstep pickup, and instant UPI payment across India.',
  alternates: {
    canonical: 'https://sellbar.in/sell',
  },
  openGraph: {
    title: 'Sell Old Mobile Phones for Highest Value | Sellbar',
    description: 'Instant valuation, 72-hour price lock, and free doorstep pickup with instant payment.',
    url: 'https://sellbar.in/sell',
    siteName: 'Sellbar',
    type: 'website',
  },
};

export default function SellCatalogPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Sell Old Phones Online',
    url: 'https://sellbar.in/sell',
    description: 'Sell your used or old smartphone online with instant doorstep cash payout and data wipe.',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://sellbar.in',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Sell Phone',
          item: 'https://sellbar.in/sell',
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto p-12 text-center text-slate-500 font-semibold text-xs">
            Loading Sellbar device catalog...
          </div>
        }
      >
        <SellCatalogContent />
      </Suspense>
    </>
  );
}
