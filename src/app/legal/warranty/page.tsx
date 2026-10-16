import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings/siteSettings';

export const metadata: Metadata = {
  title: 'Warranty Policy — Sellbar',
  description: 'Limited hardware warranty terms for refurbished devices purchased on Sellbar.',
};

export default async function WarrantyPolicyPage() {
  const settings = await getSiteSettings();

  return (
    <article className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Limited Hardware Warranty Policy</h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026 | Default Warranty: {settings.warrantyMonthsDefault} Months</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">1. Warranty Scope & Duration</h2>
        <p>
          All certified refurbished smartphones purchased through <strong>Sellbar</strong> come with a complimentary <strong>{settings.warrantyMonthsDefault}-month limited hardware warranty</strong> starting from the recorded delivery timestamp.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">2. What Is Covered</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Motherboard and internal component electrical failures not caused by external trauma.</li>
          <li>Display digitizer defects (touch unresponsiveness or factory hardware flaws).</li>
          <li>Camera hardware failure (focus mechanism, sensor failure).</li>
          <li>Microphone, earpiece, and loudspeaker audio hardware defects.</li>
          <li>Battery capacity degradation below 80% within the initial warranty term.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">3. What Is Excluded (Voiding Conditions)</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Cracked screens, dented chassis, or internal board fractures resulting from drops or accidental impact.</li>
          <li>Liquid ingress, moisture damage, or oxidation of internal ports and sensors.</li>
          <li>Damage resulting from unauthorized third-party repairs or non-OEM charger overvoltage.</li>
          <li>Custom ROM flashing, bootloader unlocking, or operating system rooting causing bricking.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">4. Claim Process</h2>
        <p>
          Warranty claims can be submitted directly through your <a href="/account" className="text-emerald-700 underline">Order History</a>. Our logistics partner will pick up the device, verify the hardware defect at our diagnostic lab, and either repair the unit with genuine parts or provide an equivalent replacement.
        </p>
      </section>

      <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
        Need warranty assistance? Contact our service desk at <a href={`mailto:${settings.supportEmail}`} className="text-emerald-700 underline">{settings.supportEmail}</a>.
      </div>
    </article>
  );
}
