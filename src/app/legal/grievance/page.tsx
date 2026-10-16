import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings/siteSettings';

export const metadata: Metadata = {
  title: 'Grievance Redressal — Sellbar',
  description: 'Statutory grievance redressal mechanism and officer details under Consumer Protection Rules 2020.',
};

export default async function GrievancePage() {
  const settings = await getSiteSettings();

  return (
    <article className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Grievance Redressal Mechanism</h1>
        <p className="text-xs text-slate-500 mt-1">In compliance with Consumer Protection (E-Commerce) Rules 2020 & IT Act 2000</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">1. Grievance Officer Designation</h2>
        <p>
          In accordance with the Information Technology Act 2000, Consumer Protection (E-Commerce) Rules 2020, and the Digital Personal Data Protection Act 2023, the details of the designated Grievance Officer for <strong>Sellbar</strong> (<a href="https://sellbar.in" className="text-emerald-700 underline">sellbar.in</a>) are provided below:
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2 mt-3">
          <div>
            <span className="font-bold text-slate-700">Designation: </span>
            <span>Grievance & Privacy Officer</span>
          </div>
          <div>
            <span className="font-bold text-slate-700">Official Email: </span>
            <a href={`mailto:${settings.grievanceOfficer?.email || 'grievance@sellbar.in'}`} className="text-emerald-700 font-semibold underline">
              {settings.grievanceOfficer?.email || 'grievance@sellbar.in'}
            </a>
          </div>
          <div>
            <span className="font-bold text-slate-700">Support Desk: </span>
            <span>{settings.supportEmail}</span>
          </div>
          {settings.grievanceOfficer?.phone && (
            <div>
              <span className="font-bold text-slate-700">Contact Number: </span>
              <span>{settings.grievanceOfficer.phone}</span>
            </div>
          )}
          {settings.legalEntityName && (
            <div>
              <span className="font-bold text-slate-700">Entity: </span>
              <span>{settings.legalEntityName}</span>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">2. Grievance Escalation & Timelines</h2>
        <ol className="list-decimal pl-5 space-y-1">
          <li><strong>Step 1 (Customer Support):</strong> For order status, pickup queries, or inspection questions, first reach our frontline team via <a href={`mailto:${settings.supportEmail}`} className="text-emerald-700 underline">{settings.supportEmail}</a>. Most queries are resolved within 24 hours.</li>
          <li><strong>Step 2 (Officer Escalation):</strong> If your ticket is unresolved after 48 hours or relates to data privacy or consumer disputes, email our Grievance Officer directly.</li>
          <li><strong>Acknowledgment:</strong> All formal grievances are acknowledged with a tracking ticket number within <strong>48 hours</strong> of receipt.</li>
          <li><strong>Resolution:</strong> Formal grievances are investigated and redressed within <strong>30 calendar days</strong> in accordance with statutory guidelines.</li>
        </ol>
      </section>
    </article>
  );
}
