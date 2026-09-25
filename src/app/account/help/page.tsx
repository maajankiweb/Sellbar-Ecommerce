'use client';

import React, { useState } from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { PageHeader, SectionCard, SectionHeader } from '@/components/account/ui';
import { HelpCircle, Search, ChevronDown, ChevronRight, Package, CreditCard, RotateCcw, Truck, ShieldCheck, Star, MessageSquare, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const HELP_CATEGORIES = [
  {
    icon: <Package className="h-5 w-5 text-blue-600" />,
    bg: 'bg-blue-50',
    title: 'Orders & Buying',
    articles: [
      { title: 'How to track my order', href: '#' },
      { title: 'Can I modify an order after placing?', href: '#' },
      { title: 'Why is my order delayed?', href: '#' },
      { title: 'Order cancellation process', href: '#' },
    ],
  },
  {
    icon: <RotateCcw className="h-5 w-5 text-amber-600" />,
    bg: 'bg-amber-50',
    title: 'Returns & Refunds',
    articles: [
      { title: 'How to initiate a return', href: '#' },
      { title: 'Return policy and conditions', href: '#' },
      { title: 'When will I get my refund?', href: '#' },
      { title: 'Return pickup not scheduled', href: '#' },
    ],
  },
  {
    icon: <CreditCard className="h-5 w-5 text-emerald-600" />,
    bg: 'bg-emerald-50',
    title: 'Payments & Billing',
    articles: [
      { title: 'Payment declined — what to do?', href: '#' },
      { title: 'How to use wallet balance', href: '#' },
      { title: 'EMI options and eligibility', href: '#' },
      { title: 'Applying coupon codes', href: '#' },
    ],
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-purple-600" />,
    bg: 'bg-purple-50',
    title: 'Account & Security',
    articles: [
      { title: 'How to change my password', href: '#' },
      { title: 'Account hacked — immediate steps', href: '#' },
      { title: 'Enabling 2-factor authentication', href: '#' },
      { title: 'Merging duplicate accounts', href: '#' },
    ],
  },
];

const QUICK_FAQS = [
  { q: 'What is the warranty on refurbished products?', a: 'All refurbished products come with a minimum 6-month warranty. Grade A and Grade B products are covered for 12 months. The warranty covers manufacturing defects and hardware failures.' },
  { q: 'How are refurbished products different from used?', a: 'Refurbished products are professionally tested, repaired, cleaned, and certified by our technicians. They meet strict quality benchmarks. Used products are as-is with no quality guarantee.' },
  { q: 'What if the product is defective on arrival?', a: 'If you receive a defective product, contact support within 48 hours. We\'ll arrange a free replacement or full refund with priority pickup within 24 hours.' },
  { q: 'Is my payment information secure?', a: 'Yes. We use 256-bit SSL encryption and are PCI-DSS Level 1 compliant. We never store CVV numbers. All payments go through RBI-regulated payment gateways.' },
  { q: 'How do I earn reward points?', a: 'You earn points on every purchase (1 point per ₹10), referrals, writing reviews, and completing your profile. Points can be redeemed for discounts and free shipping.' },
];

function HelpContent() {
  const [searchQ, setSearchQ] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-4xl mx-auto w-full">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 mb-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10"><HelpCircle className="h-48 w-48" /></div>
        <div className="relative">
          <h1 className="text-2xl font-black mb-2">How can we help you?</h1>
          <p className="text-white/80 text-sm mb-5">Search our help center or browse the categories below.</p>
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search help articles..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-slate-900 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </div>

      {/* Help Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {HELP_CATEGORIES.map(cat => (
          <SectionCard key={cat.title}>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-10 w-10 rounded-xl ${cat.bg} flex items-center justify-center shrink-0`}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-slate-900">{cat.title}</h3>
              </div>
              <div className="space-y-2">
                {cat.articles.map(article => (
                  <a
                    key={article.title}
                    href={article.href}
                    className="flex items-center gap-2 py-1.5 text-sm text-slate-600 hover:text-blue-600 transition group"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                    {article.title}
                  </a>
                ))}
              </div>
            </div>
          </SectionCard>
        ))}
      </div>

      {/* Quick FAQ */}
      <SectionCard className="mb-5">
        <SectionHeader title="Quick Answers" />
        <div className="divide-y divide-slate-100">
          {QUICK_FAQS.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-slate-50 transition"
              >
                <span className="text-sm font-semibold text-slate-900 pr-4">{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Contact Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <MessageSquare className="h-5 w-5 text-blue-600" />, bg: 'bg-blue-50', title: 'Live Chat', desc: 'Chat with our support team. Avg. response < 2 min.', cta: 'Start Chat', href: '/account/support' },
          { icon: <Star className="h-5 w-5 text-amber-500" />, bg: 'bg-amber-50', title: 'Raise a Ticket', desc: 'Submit a detailed support request. We\'ll respond in 4 hours.', cta: 'Create Ticket', href: '/account/support' },
          { icon: <ExternalLink className="h-5 w-5 text-emerald-600" />, bg: 'bg-emerald-50', title: 'Email Support', desc: 'Email us at support@selbar.in for non-urgent queries.', cta: 'Send Email', href: 'mailto:support@selbar.in' },
        ].map(item => (
          <Link
            key={item.title}
            href={item.href}
            className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:border-slate-200 transition group"
          >
            <div className={`h-11 w-11 rounded-xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
              {item.icon}
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">{item.desc}</p>
            <span className="text-xs font-bold text-blue-600 group-hover:underline">{item.cta} →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function HelpPage() {
  return (
    <AccountLayout>
      <AccountHeader />
      <HelpContent />
    </AccountLayout>
  );
}
