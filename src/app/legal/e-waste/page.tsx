import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings/siteSettings';

export const metadata: Metadata = {
  title: 'E-Waste Management Policy — Sellbar',
  description: 'Compliance with E-Waste (Management) Rules 2022 and environmental sustainability at Sellbar.',
};

export default async function EWastePolicyPage() {
  const settings = await getSiteSettings();

  return (
    <article className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">E-Waste Management & Compliance Policy</h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026 | Compliant with E-Waste (Management) Rules, 2022</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">1. Commitment to Circular Electronics</h2>
        <p>
          At <strong>Sellbar</strong> (<a href="https://sellbar.in" className="text-emerald-700 underline">sellbar.in</a>), our primary mission is extending the operational lifespan of electronic gadgets through professional testing, refurbishment, and ethical recommerce, thereby keeping hazardous heavy metals out of Indian landfills.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">2. Responsible End-of-Life Processing</h2>
        <p>
          Devices or individual components deemed beyond economical repair or non-functional are channeled exclusively to authorized Central Pollution Control Board (CPCB) registered recycling partners for environmentally sound dismantling and precious material recovery.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">3. Consumer Awareness: Dos and Don&apos;ts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
            <h3 className="font-bold text-emerald-900 text-xs uppercase tracking-wide">Dos:</h3>
            <ul className="list-disc pl-4 text-emerald-800 text-xs space-y-1">
              <li>Sell or recycle your old devices through certified channels.</li>
              <li>Separate lithium batteries from municipal general waste.</li>
              <li>Follow data wipe guidelines prior to device handover.</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1.5">
            <h3 className="font-bold text-rose-900 text-xs uppercase tracking-wide">Don&apos;ts:</h3>
            <ul className="list-disc pl-4 text-rose-800 text-xs space-y-1">
              <li>Do not dispose of smartphones in household garbage bins.</li>
              <li>Do not burn or manually dismantle lithium-ion batteries.</li>
              <li>Do not hand e-waste to unauthorized informal scrap dealers.</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
        To arrange safe recycling for your non-working devices, contact our environmental desk at <a href={`mailto:${settings.supportEmail}`} className="text-emerald-700 underline">{settings.supportEmail}</a>.
      </div>
    </article>
  );
}
