'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  HelpCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  ShieldCheck,
  Wrench,
  RotateCcw,
  Lock,
  MessageSquare
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'selling' | 'buying' | 'repair' | 'warranty' | 'privacy';
  question: string;
  answer: string;
  tag: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'selling',
    tag: 'Instant Sell',
    question: 'How does SELBAR determine the valuation of my old smartphone?',
    answer: 'SELBAR utilizes an AI-driven transparent valuation engine. The quote is calculated based on brand, exact model/storage variant, cosmetic condition (scratches, dents), screen integrity, and hardware diagnostic checks. What we quote online is guaranteed for 72 hours with zero doorstep price haggling.'
  },
  {
    id: 'faq-2',
    category: 'selling',
    tag: 'Express Service',
    question: 'Is device pickup really free, and how fast is payout processed?',
    answer: 'Pickup and valuation are 100% free with zero convenience or inspection fees. Even if you decline the quote after physical inspection, you pay nothing. Once you accept, an instant IMPS / UPI bank transfer is initiated directly to your account.'
  },
  {
    id: 'faq-3',
    category: 'buying',
    tag: 'Refurbished Quality',
    question: 'What quality checks are performed on refurbished phones?',
    answer: 'Every refurbished device undergoes an exhaustive 32-point hardware and software diagnostic test. We inspect screen digitizers, battery health (>85%), cameras, microphones, biometric sensors, connectivity, and motherboard circuits to ensure 100% factory-level functionality.'
  },
  {
    id: 'faq-4',
    category: 'warranty',
    tag: 'Warranty & Replacement',
    question: 'What warranty and replacement policy do you offer on purchases?',
    answer: 'All certified refurbished smartphones and laptops come with an Assured 12-Month Comprehensive Hardware Warranty and a 15-day hassle-free replacement or money-back guarantee. If anything goes wrong, we repair or replace it at zero cost.'
  },
  {
    id: 'faq-5',
    category: 'repair',
    tag: 'Device Repair',
    question: 'How does 30-minute mobile repair work?',
    answer: 'Simply select your device model and issue (cracked screen, degraded battery, speaker fault). Our certified technicians complete the repair using high-grade OEM parts and return your tested device within 30 to 45 minutes.'
  },
  {
    id: 'faq-6',
    category: 'privacy',
    tag: 'Data Sanitization',
    question: 'Is my personal data completely safe when selling my phone?',
    answer: 'Yes! SELBAR strictly adheres to the Digital Personal Data Protection (DPDP) Act 2023. Every device is wiped using NIST 800-88 military-grade algorithms that cryptographically overwrite all storage sectors. You also receive an official Digital Data Erasure Certificate with an immutable SHA-256 verification hash.'
  }
];

export function FaqSection() {
  const [activeTab, setActiveTab] = useState<'all' | 'selling' | 'buying' | 'repair' | 'warranty' | 'privacy'>('all');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-3']);

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = activeTab === 'all'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter((item) => item.category === activeTab);

  const tabs = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'selling', label: 'Sell Device', icon: Smartphone },
    { id: 'buying', label: 'Buy Refurbished', icon: RotateCcw },
    { id: 'repair', label: 'Repair', icon: Wrench },
    { id: 'warranty', label: 'Warranty', icon: ShieldCheck },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock },
  ];

  return (
    <section id="faq-section" className="w-full py-16 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Badge & Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/70 text-teal-700 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Got Questions? We’ve Got <span className="text-teal-600">Answers</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Everything you need to know about doorstep buyback, instant digital payouts, certified refurbished quality checks, and doorstep phone repairs.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-teal-600/20 shadow-md scale-102'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                  isOpen
                    ? 'border-teal-500/80 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1.5 pr-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold tracking-wide uppercase">
                      {faq.tag}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                      isOpen
                        ? 'bg-teal-50 text-teal-700 rotate-180'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50 animate-in fade-in-50 duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-400">
              <MessageSquare className="w-4 h-4" />
              <span>Dedicated Helpdesk Available</span>
            </div>
            <h4 className="text-base sm:text-lg font-black text-white">
              Still have questions or need custom assistance?
            </h4>
            <p className="text-xs text-slate-400">
              Check our complete knowledge base or visit any of our nearby verified experience centers.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-center">
            <Link
              href="/faq"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <span>View All 25+ FAQs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
