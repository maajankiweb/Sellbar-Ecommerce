import React from 'react';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/settings/siteSettings';
import { AUTHORIZED_LOCATIONS, STAGING_SEEDED_LOCATIONS } from '@/lib/location/config';
import { Mail, Phone, MessageSquare, MapPin, Clock, Send, ArrowRight, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Sellbar Support & Pickup Hubs — sellbar.in',
  description: 'Get in touch with Sellbar customer support. Fast assistance via WhatsApp, phone, and email for sell quotes, doorstep pickup, and refurbished device orders.',
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const supportPhone = settings.supportPhone || '+91 98765 43210';
  const supportEmail = settings.supportEmail || 'support@sellbar.in';
  const whatsappUrl = `https://wa.me/${supportPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hi Sellbar, I have a query regarding my order/device valuation.'
  )}`;

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            Customer Support & Pickup Hubs
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Can We Help You Today?
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Have questions about doorstep pickup, device condition valuation, or refurbished warranty? We are here to assist you 7 days a week.
          </p>
        </div>

        {/* 3 Direct Support Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {/* WhatsApp Channel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900 mb-1">WhatsApp Fast Support</h2>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Fastest response for order status, quick valuation doubts, or address updates.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/70 px-4 py-2 rounded-xl transition"
            >
              <span>Chat on WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Phone Channel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Helpline Phone</h2>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Direct telephone line for pickup scheduling coordination & delivery assistance.
            </p>
            <a
              href={`tel:${supportPhone.replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-4 py-2 rounded-xl transition"
            >
              <span>{supportPhone}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Email Channel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Email Desk</h2>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Official email for warranty inquiries, commercial partnerships, or grievance matters.
            </p>
            <a
              href={`mailto:${supportEmail}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/70 px-4 py-2 rounded-xl transition"
            >
              <span>{supportEmail}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 2-Column: Contact Form + Operational Coverage Hubs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Send Us a Direct Message</h2>
            <p className="text-xs text-slate-500 mb-6">
              Fill out the form below and our team will get back to you within 2-4 business hours.
            </p>

            <form className="space-y-4" action="#" method="POST">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="name">
                    Your Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="e.g. Rahul Kumar"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="phone">
                    Phone Number (+91) *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="subject">
                    Subject / Concern
                  </label>
                  <select
                    id="subject"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="sell">Selling a Phone / Price Quote</option>
                    <option value="buy">Buying Refurbished Phone</option>
                    <option value="warranty">Warranty or Replacement Claim</option>
                    <option value="pickup">Doorstep Pickup Rescheduling</option>
                    <option value="partner">Franchise or Retail Partner</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="message">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  placeholder="Please describe your query or order ID..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Send Support Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right: Operational Hubs & Service Information */}
          <div className="lg:col-span-5 space-y-6">
            {/* Operational Hours */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Operating Hours</h3>
                  <div className="text-xs text-emerald-700 font-semibold">Active Doorstep Operations</div>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <li className="flex justify-between">
                  <span>Monday – Saturday:</span>
                  <span className="font-bold text-slate-900">09:30 AM – 07:30 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-bold text-slate-900">10:00 AM – 05:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Doorstep Pickup Slots:</span>
                  <span className="font-bold text-emerald-700">2-Hour Dedicated Windows</span>
                </li>
              </ul>
            </div>

            {/* Active Service Hubs */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Doorstep Pickup Coverage</h3>
                  <div className="text-xs text-slate-500">Tier-2/3 Regional Hubs</div>
                </div>
              </div>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Free 24-hour doorstep inspection is currently active across verified locations:
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(AUTHORIZED_LOCATIONS.length > 0 ? AUTHORIZED_LOCATIONS : STAGING_SEEDED_LOCATIONS).map((loc) => (
                  <span
                    key={loc.id}
                    className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-semibold"
                  >
                    {loc.name}
                  </span>
                ))}
              </div>
              <Link
                href="/cities"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>View Full City Serviceability Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Grievance Officer & Statutory Details */}
            <div className="bg-slate-100/70 p-5 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Statutory Compliance</span>
              </div>
              <p className="text-[11px]">
                For legal grievances under Consumer Protection Act & DPDP rules, visit our{' '}
                <Link href="/legal/grievance" className="text-emerald-700 font-bold underline">
                  Grievance Redressal Mechanism
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
