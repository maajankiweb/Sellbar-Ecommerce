import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings/siteSettings';

export const metadata: Metadata = {
  title: 'Cookie Policy — Sellbar',
  description: 'Information regarding the use of cookies and consent on Sellbar.',
};

export default async function CookiePolicyPage() {
  const settings = await getSiteSettings();

  return (
    <article className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Cookie Policy & Consent Management</h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026 | sellbar.in</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">1. What Are Cookies?</h2>
        <p>
          Cookies are small text files placed on your browser or device when you visit <strong>Sellbar</strong> (<a href="https://sellbar.in" className="text-emerald-700 underline">sellbar.in</a>). They assist in session security, keeping you logged in, maintaining items in your cart, and remembering your preferences.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">2. Types of Cookies We Use</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Strictly Necessary Cookies:</strong> Essential for authentication, secure token rotation, CSRF defense, and shopping cart persistence. These cannot be switched off.</li>
          <li><strong>Functional Cookies:</strong> Retain your preferred diagnostic answers during quote calculation and saved delivery pincodes.</li>
          <li><strong>Performance & Analytics Cookies:</strong> Measure traffic and page interactions (e.g. Google Analytics) strictly after explicit consent is granted via our consent banner.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">3. Managing Your Preferences</h2>
        <p>
          You can modify or withdraw your cookie consent at any time through our on-site Cookie Preferences banner or through your browser settings. Blocking essential cookies may impact account access and checkout functionality.
        </p>
      </section>

      <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
        Inquiries regarding cookie usage can be addressed to <a href={`mailto:${settings.supportEmail}`} className="text-emerald-700 underline">{settings.supportEmail}</a>.
      </div>
    </article>
  );
}
