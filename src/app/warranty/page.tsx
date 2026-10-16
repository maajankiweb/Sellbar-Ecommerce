import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings/siteSettings';
import WarrantyContent from '@/components/warranty/WarrantyContent';

export const revalidate = 3600; // ISR: 1 hour

export const metadata: Metadata = {
  title: 'Warranty Policy & Quality Inspection Standards | Sellbar',
  description: 'Learn about Sellbar comprehensive hardware warranty, replacement policy, and our quality inspection standards.',
  alternates: {
    canonical: 'https://sellbar.in/warranty',
  },
  openGraph: {
    title: 'Sellbar Assured Warranty & Quality Standards',
    description: 'Verified warranty, replacement policy, and hardware quality inspection standards.',
    url: 'https://sellbar.in/warranty',
    siteName: 'Sellbar',
    type: 'website',
  },
};

export default async function WarrantyPage() {
  const settings = await getSiteSettings();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Sellbar Assured Warranty & Quality Standards',
    url: 'https://sellbar.in/warranty',
    description: 'Comprehensive warranty and quality control details for refurbished electronics.',
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
          name: 'Warranty Policy',
          item: 'https://sellbar.in/warranty',
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
      <WarrantyContent
        warrantyMonths={settings.warrantyMonthsDefault}
        replacementDays={settings.replacementWindowDays}
      />
    </>
  );
}
