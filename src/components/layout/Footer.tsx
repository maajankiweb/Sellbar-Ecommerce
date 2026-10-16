'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { PublicSiteSettings, DEFAULT_SITE_SETTINGS } from '@/lib/settings/siteSettings';

export default function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<PublicSiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/v1/settings');
        if (res.ok) {
          const data = await res.json();
          if (data?.settings) {
            setSettings(data.settings);
          }
        }
      } catch {
        // Fallback silently to DEFAULT_SITE_SETTINGS
      }
    }
    loadSettings();
  }, []);

  // Suppress storefront footer on admin, seller, account, user, manager, staff, or delivery routes
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/seller') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/user') ||
    pathname.startsWith('/manager') ||
    pathname.startsWith('/staff') ||
    pathname.startsWith('/delivery')
  ) {
    return null;
  }

  const supportPhone = settings.supportPhone || '+91 98765 43210';
  const supportEmail = settings.supportEmail || 'support@sellbar.in';
  const whatsappNumber = supportPhone.replace(/[^0-9]/g, '');
  const hasLegalEntity = Boolean(settings.legalEntityName && settings.gstin);

  // Check if any real social links exist (not empty and not generic placeholder domains)
  const realSocials = Object.entries(settings.socialLinks || {}).filter(
    ([_, url]) => url && url.startsWith('http') && !url.includes('example.com')
  );

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-700 pt-12 pb-24 lg:pb-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid as required by PRD & Design Spec */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Sell (Phones Only in MVP) */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              Sell Old Phone
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li>
                <Link href="/sell" className="hover:text-emerald-600 transition-colors flex items-center justify-between">
                  <span>Sell Mobile Phone</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">Instant Cash</span>
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-emerald-600 transition-colors">
                  Instant Valuation Calculator
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-emerald-600 transition-colors">
                  How Selling Works (3 Steps)
                </Link>
              </li>
              <li>
                <Link href="/cities" className="hover:text-emerald-600 transition-colors">
                  Free Doorstep Pickup Hubs
                </Link>
              </li>
              <li>
                <Link href="/coming-soon/laptop" className="hover:text-emerald-600 transition-colors text-slate-400">
                  Laptops & Tablets (Waitlist)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Buy Refurbished */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              Buy Certified Refurbished
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li>
                <Link href="/buy" className="hover:text-emerald-600 transition-colors flex items-center justify-between">
                  <span>Refurbished Smartphones</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold">Verified</span>
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-emerald-600 transition-colors">
                  {settings.warrantyMonthsDefault || 6}-Month Warranty Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/refund" className="hover:text-emerald-600 transition-colors">
                  {settings.replacementWindowDays || 15}-Day Replacement Guarantee
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-emerald-600 transition-colors">
                  Quality Checks & Cosmetic Grades
                </Link>
              </li>
              <li>
                <Link href="/coming-soon/smartwatch" className="hover:text-emerald-600 transition-colors text-slate-400">
                  Smartwatches (Coming Soon)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              Company & Help
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li>
                <Link href="/how-it-works" className="hover:text-emerald-600 transition-colors">
                  About Sellbar & Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-600 transition-colors font-bold text-slate-800">
                  Contact Us & Operating Hours
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-emerald-600 transition-colors">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/partner" className="hover:text-emerald-600 transition-colors">
                  Franchise & Retail Partner
                </Link>
              </li>
              <li>
                <Link href="/legal/grievance" className="hover:text-emerald-600 transition-colors">
                  Grievance Redressal Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust, Direct Channels & Compliance */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              Customer Support & Security
            </h4>

            <div className="space-y-2.5 text-xs">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi Sellbar, I need assistance with a mobile valuation/order.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100/80 transition"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>WhatsApp: {supportPhone}</span>
              </a>

              <a
                href={`mailto:${supportEmail}`}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 text-slate-700 font-semibold hover:bg-slate-100 transition"
              >
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">{supportEmail}</span>
              </a>
            </div>

            {/* Social links (shown strictly when real links exist) */}
            {realSocials.length > 0 && (
              <div className="pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Connect</span>
                <div className="flex items-center gap-2">
                  {realSocials.map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-[10px] font-bold capitalize transition"
                    >
                      {platform}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Trust badge */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Certified Data Erased Before Resale</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Entity details (Condition CD-07: NEVER show placeholder entity details, hide until real) */}
        {hasLegalEntity && (
          <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
            <div className="font-bold text-slate-700">{settings.legalEntityName} {settings.tradeName ? `(Trade: ${settings.tradeName})` : ''}</div>
            <div>GSTIN: {settings.gstin}</div>
            {settings.registeredAddress?.line1 && (
              <div>
                Registered Address: {settings.registeredAddress.line1}, {settings.registeredAddress.city}, {settings.registeredAddress.state} - {settings.registeredAddress.pincode}
              </div>
            )}
          </div>
        )}

        {/* Payment Methods Strip */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">100% Secure Payments:</span>
            <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-700">UPI</span>
            <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-700">RuPay</span>
            <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-700">Visa / Mastercard</span>
            <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-700">NetBanking</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <Link href="/legal/terms" className="hover:text-slate-900 transition">Terms of Use</Link>
            <Link href="/legal/privacy" className="hover:text-slate-900 transition">Privacy Policy</Link>
            <Link href="/legal/refund" className="hover:text-slate-900 transition">Refund & Replacement</Link>
            <Link href="/legal/cookies" className="hover:text-slate-900 transition">Cookies</Link>
            <Link href="/legal/e-waste" className="hover:text-slate-900 transition">E-Waste</Link>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Sellbar (sellbar.in). All rights reserved.
          </p>
          <p className="text-[11px] text-slate-400">
            Built by{' '}
            <a
              href="https://maajankiwebtech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-700 hover:text-emerald-600 transition underline underline-offset-2"
            >
              Maajanki Web Tech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
