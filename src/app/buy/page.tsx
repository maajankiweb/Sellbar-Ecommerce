import { Metadata } from 'next';
import { Suspense } from 'react';
import BuyCatalogContent from '@/components/buy/BuyCatalogContent';

export const metadata: Metadata = {
  title: 'Buy Certified Refurbished Phones & Electronics | Sellbar',
  description: 'Shop quality-checked refurbished smartphones and electronics with verified 6-month warranty, 15-day replacement policy, and fast courier delivery across India.',
  alternates: {
    canonical: 'https://sellbar.in/buy',
  },
  openGraph: {
    title: 'Certified Refurbished Flagships at Up to 50% Off | Sellbar',
    description: 'Quality-checked smartphones with 6 months warranty and 15 days replacement.',
    url: 'https://sellbar.in/buy',
    siteName: 'Sellbar',
    type: 'website',
  },
};

export default function BuyCatalogPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Certified Refurbished Phones & Electronics',
    url: 'https://sellbar.in/buy',
    description: 'Explore certified refurbished smartphones quality-checked before sale with verified warranty.',
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
          name: 'Buy Refurbished',
          item: 'https://sellbar.in/buy',
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
            Loading certified refurbished devices...
          </div>
        }
      >
        <BuyCatalogContent />
      </Suspense>
    </>
  );
}
