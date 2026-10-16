import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings/siteSettings';

export const metadata: Metadata = {
  title: 'Terms of Service — Sellbar',
  description: 'Terms and Conditions governing the use of Sellbar recommerce services in India.',
};

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <article className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Terms of Use & Service Agreement</h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026 | Effective for sellbar.in</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">1. Introduction & Acceptance of Terms</h2>
        <p>
          Welcome to <strong>Sellbar</strong> (available at <a href="https://sellbar.in" className="text-emerald-700 underline">sellbar.in</a>). By accessing or using our website, mobile application, or any associated doorstep recommerce services, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">2. Device Buyback (Sell Flow) Eligibility & Representations</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>You represent and warrant that you are at least 18 years of age and the sole legal owner of the device offered for sale.</li>
          <li>The device must not be stolen, blacklisted, financed under an active non-cleared hypothecation, or involved in any pending law enforcement dispute.</li>
          <li>Online quotes generated on Sellbar are valid for <strong>{settings.quoteValidityHours} hours</strong> from the time of generation.</li>
          <li>At physical inspection, our field executive verifies the declared condition. If discrepancies exist, an adjusted quote will be presented. You retain full right to decline the revised quote with zero penalty or doorstep fee.</li>
          <li>Upon receipt of payment via UPI or Bank Transfer, device ownership irreversibly transfers to Sellbar.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">3. Purchase of Refurbished Electronics (Buy Flow)</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Every refurbished device sold on Sellbar is tested with a multi-point quality check and assigned an explicit cosmetic condition grade (Fair, Good, or Superb).</li>
          <li>Purchases are protected by our default <strong>{settings.warrantyMonthsDefault}-month limited hardware warranty</strong> and a <strong>{settings.replacementWindowDays}-day replacement window</strong> in accordance with our Warranty & Refund Policies.</li>
          <li>Orders must be pre-paid via our authorized payment gateway (Razorpay). Cash on Delivery is currently {settings.codEnabled ? 'enabled' : 'disabled'} during this operating phase.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">4. Customer Data Sanitization Notice</h2>
        <p>
          While Sellbar performs certified cryptographic data wiping upon device intake, the customer is strictly responsible for backing up all personal contacts, photos, and messages and removing all Google / iCloud accounts and factory reset protection prior to handing over the device.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">5. Governing Law & Jurisdiction</h2>
        <p>
          These terms are governed by the laws of India. Any legal dispute or proceeding arising out of or related to these terms shall be subject to the exclusive jurisdiction of the competent courts in India.
        </p>
      </section>

      <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
        Questions regarding our Terms? Contact our legal desk at <a href={`mailto:${settings.supportEmail}`} className="text-emerald-700 underline">{settings.supportEmail}</a>.
      </div>
    </article>
  );
}
