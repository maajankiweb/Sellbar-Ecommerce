import React from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertCircle, FileText } from 'lucide-react';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const legalNav = [
    { label: 'Terms of Use', href: '/legal/terms' },
    { label: 'Privacy Policy (DPDP)', href: '/legal/privacy' },
    { label: 'Refund & Returns', href: '/legal/refund' },
    { label: 'Warranty Policy', href: '/legal/warranty' },
    { label: 'Cookie Policy', href: '/legal/cookies' },
    { label: 'E-Waste Compliance', href: '/legal/e-waste' },
    { label: 'Grievance Redressal', href: '/legal/grievance' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Compliance Notice Banner */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Legal Disclaimer: </span>
            These documents serve as compliant operating templates prepared in accordance with the Information Technology Act 2000, Consumer Protection (E-Commerce) Rules 2020, and DPDP Act 2023. Final production publication requires formal review by the client&apos;s legal counsel.
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none text-xs font-semibold">
          {legalNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-500 whitespace-nowrap transition shadow-2xs"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10 text-slate-800 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
