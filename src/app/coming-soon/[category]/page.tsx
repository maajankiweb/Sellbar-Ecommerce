import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Smartphone, Bell, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ category: string }>;
}

const CATEGORY_MAP: Record<string, { title: string; subtitle: string; icon: string }> = {
  laptop: {
    title: 'Refurbished & Pre-Owned Laptops',
    subtitle: 'We are expanding our verified diagnostics to laptops soon. Get notified when we launch MacBook, Dell, HP & Lenovo trade-ins.',
    icon: '💻',
  },
  tablet: {
    title: 'iPads & Android Tablets',
    subtitle: 'Tablet buyback and certified refurbished sales are launching in the next phase.',
    icon: '📱',
  },
  smartwatch: {
    title: 'Smartwatches & Fitness Bands',
    subtitle: 'Apple Watch, Galaxy Watch & top wearables are arriving soon with full battery health verification.',
    icon: '⌚',
  },
  gaming: {
    title: 'Gaming Consoles & Accessories',
    subtitle: 'PlayStation, Xbox & Nintendo buyback and refurbished console sales are on our roadmap.',
    icon: '🎮',
  },
  tv: {
    title: 'Smart TVs & Home Entertainment',
    subtitle: 'Doorstep inspection for smart televisions is launching in select metro hubs soon.',
    icon: '📺',
  },
  repair: {
    title: 'Doorstep Mobile Repair',
    subtitle: 'Genuine screen and battery replacements at your doorstep with 6-month warranty will be live soon.',
    icon: '🔧',
  },
  recycle: {
    title: 'Responsible E-Waste Recycling',
    subtitle: 'Zero-landfill certified electronics recycling with doorstep pickup is launching shortly.',
    icon: '♻️',
  },
  other: {
    title: 'New Categories Launching Soon',
    subtitle: 'Sellbar is currently focused on mobile phones for guaranteed 24-hour service. Join the waitlist for other devices.',
    icon: '✨',
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const info = CATEGORY_MAP[category.toLowerCase()] || CATEGORY_MAP.other;
  return {
    title: `${info.title} — Coming Soon | Sellbar`,
    description: info.subtitle,
  };
}

export default async function ComingSoonCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const info = CATEGORY_MAP[category.toLowerCase()] || CATEGORY_MAP.other;

  return (
    <div className="min-h-[70vh] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-10 text-center">
        {/* Back Link */}
        <div className="flex justify-start mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Badge & Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-50 text-3xl shadow-inner mb-4">
          {info.icon}
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/80 mb-3">
          MVP Scope Focus: Mobile Phones Live Now
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          {info.title}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed mb-8 max-w-md mx-auto">
          {info.subtitle}
        </p>

        {/* Waitlist Form */}
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200/80 mb-8 text-left">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-emerald-600" />
            Get Priority Notification
          </h2>
          <form className="space-y-3" action="#" method="POST">
            <div>
              <label htmlFor="waitlist-email" className="sr-only">Email address</label>
              <input
                id="waitlist-email"
                type="email"
                required
                placeholder="Enter your email or phone number"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
            >
              <span>Notify Me When Live</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            No spam. We will only notify you when this category launches in your city.
          </p>
        </div>

        {/* Active Phone Actions */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <div className="text-xs font-bold text-slate-700">Looking for Mobile Phones?</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/sell"
              className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Sell Old Phone</span>
            </Link>
            <Link
              href="/buy"
              className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-blue-600" />
              <span>Buy Refurbished</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
