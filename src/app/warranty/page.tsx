import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings/siteSettings';
import WarrantyContent from '@/components/warranty/WarrantyContent';

export const revalidate = 3600; // ISR: 1 hour

export const metadata: Metadata = {
  title: 'Warranty Policy & 32-Point Quality Checklist | Sellbar',
  description: 'Learn about Sellbar 6-month comprehensive hardware warranty, 15-day replacement policy, and our 32-point device inspection checklist.',
  alternates: {
    canonical: 'https://sellbar.in/warranty',
  },
  openGraph: {
    title: 'Sellbar Assured Warranty & Quality Standards',
    description: 'Verified 6-month warranty, 15-day replacement, and 32-point hardware inspection.',
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
    description: 'Comprehensive warranty and 32-point quality control details for refurbished electronics.',
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
