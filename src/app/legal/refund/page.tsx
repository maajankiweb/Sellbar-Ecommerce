import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings/siteSettings';

export const metadata: Metadata = {
  title: 'Refund & Replacement Policy — Sellbar',
  description: 'Policy governing replacements and refunds for certified refurbished phones on Sellbar.',
};

export default async function RefundPolicyPage() {
  const settings = await getSiteSettings();

  return (
    <article className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Replacement & Refund Policy</h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026 | Effective Window: {settings.replacementWindowDays} Days</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">1. {settings.replacementWindowDays}-Day Hassle-Free Replacement Window</h2>
        <p>
          Every certified refurbished mobile phone purchased from <strong>Sellbar</strong> is eligible for a replacement or return within <strong>{settings.replacementWindowDays} calendar days</strong> from the date of confirmed delivery.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">2. Eligibility Conditions for Return or Replacement</h2>
        <p>A return or replacement request is accepted if:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>The device develops an unresolvable hardware failure (screen touch malfunction, speaker defect, camera hardware fault, charging circuit failure).</li>
          <li>The cosmetic condition received is demonstrably worse than the purchased condition grade (e.g., Fair received when Superb was ordered).</li>
          <li>The device is returned in its original condition with the original IMEI sticker, box, and any accompanying accessories.</li>
          <li>The device has not suffered physical drop damage, liquid ingress, unauthorized third-party disassembly, or root/bootloader tampering after delivery.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">3. Resolution Hierarchy & Refund Processing</h2>
        <ol className="list-decimal pl-5 space-y-1">
          <li><strong>Direct Unit Replacement:</strong> If eligible, Sellbar will first ship a certified replacement unit of identical model, variant, and grade.</li>
          <li><strong>Full Refund:</strong> If a matching replacement unit is out of stock, a 100% refund will be issued to the original payment source (via Razorpay) within 5–7 business days following reverse inspection at our hub.</li>
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">4. Pre-Dispatch Order Cancellation</h2>
        <p>
          You may cancel any Buy order free of charge at any time prior to courier dispatch. Automatic full refunds are credited back to your original payment method immediately upon cancellation.
        </p>
      </section>

      <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
        To initiate a return or replacement, log into your <a href="/account" className="text-emerald-700 underline">Account Dashboard</a> or reach our support team at <a href={`mailto:${settings.supportEmail}`} className="text-emerald-700 underline">{settings.supportEmail}</a>.
      </div>
    </article>
  );
}
