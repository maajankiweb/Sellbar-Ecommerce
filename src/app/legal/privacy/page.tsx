import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings/siteSettings';

export const metadata: Metadata = {
  title: 'Privacy Policy (DPDP Act 2023) — Sellbar',
  description: 'Digital Personal Data Protection Act 2023 compliant privacy notice for Sellbar users.',
};

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();

  return (
    <article className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Privacy Notice & DPDP Compliance</h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026 | Compliant with DPDP Act 2023 (India)</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">1. Data Fiduciary Identity</h2>
        <p>
          <strong>Sellbar</strong> (<a href="https://sellbar.in" className="text-emerald-700 underline">sellbar.in</a>) operates as a Data Fiduciary under the Digital Personal Data Protection Act 2023 (DPDP Act). We are dedicated to transparent, lawful, and purpose-limited processing of personal data.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">2. Categories of Personal Data Collected</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Identity & Contact Data:</strong> Mobile phone number, full name, delivery and pickup physical addresses, and optional email address.</li>
          <li><strong>Transaction & Payout Data:</strong> UPI VPA (Virtual Payment Address) or masked bank account details solely for disbursing device sale proceeds. Card details are processed directly by our RBI-licensed payment gateway (Razorpay) and never stored on Sellbar servers.</li>
          <li><strong>Device Identification Data:</strong> IMEI numbers, device serial numbers, diagnostic scores, and condition photographs captured during inspection.</li>
          <li><strong>Technical Identifiers:</strong> IP addresses (anonymized/hashed for quote abuse prevention) and session cookies necessary for shopping cart functionality.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">3. Purpose of Processing</h2>
        <p>Personal data is processed strictly for:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Facilitating scheduled doorstep device inspections and courier shipments.</li>
          <li>Dispatching transactional OTPs via SMS (MSG91) and critical order status updates via email.</li>
          <li>Preventing fraudulent recommerce transactions and complying with statutory record-keeping regulations.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">4. Data Principal Rights (Under DPDP Act 2023)</h2>
        <p>You have the legal right to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Access & Summary:</strong> Request a full summary of your personal data processed by Sellbar.</li>
          <li><strong>Correction & Erasure:</strong> Request the correction of inaccurate data or the erasure of your personal data once statutory retention periods expire.</li>
          <li><strong>Grievance Redressal:</strong> File an inquiry or complaint directly with our designated Grievance Officer.</li>
        </ul>
        <p className="mt-2 text-slate-600">
          To exercise your rights, visit your <a href="/account" className="text-emerald-700 underline">User Account Settings</a> or email <a href={`mailto:${settings.grievanceOfficer?.email || settings.supportEmail}`} className="text-emerald-700 underline">{settings.grievanceOfficer?.email || settings.supportEmail}</a>.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">5. Data Retention & Cryptographic Sanitization</h2>
        <p>
          Any device acquired through Sellbar undergoes permanent cryptographic data wiping before resale or parts processing. Customer transaction records are retained only as required under applicable Indian taxation and commercial law.
        </p>
      </section>
    </article>
  );
}
