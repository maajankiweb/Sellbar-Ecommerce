'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  HelpCircle,
  ArrowRight,
  Search,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Smartphone,
  RotateCcw,
  Wrench,
  Lock,
  MessageSquare,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  PhoneCall,
  Clock,
  ExternalLink
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'selling' | 'buying' | 'repair' | 'privacy' | 'terms';
  tag: string;
  q: string;
  a: string;
}

const FAQ_DATA: FaqItem[] = [
  // Selling
  {
    id: 's-1',
    category: 'selling',
    tag: 'Doorstep Valuation',
    q: 'How does SELBAR compute my phone valuation?',
    a: 'We evaluate your device using our proprietary real-time algorithmic pricing engine based on brand, exact storage/RAM variant, physical cosmetic wear, screen scratches, and hardware tests. The itemized price breakdown is completely transparent with zero hidden deductibles.'
  },
  {
    id: 's-2',
    category: 'selling',
    tag: 'Free Pickup',
    q: 'Is doorstep pickup really 100% free?',
    a: 'Yes, absolutely free with zero convenience charges. Even if our technician visits and you decide not to sell after the live physical inspection, you owe nothing.'
  },
  {
    id: 's-3',
    category: 'selling',
    tag: 'Instant Payment',
    q: 'How quickly is the cash or UPI transferred?',
    a: 'Instantly right at your doorstep! Our field technician triggers the instant IMPS/UPI transfer directly to your phone, and you receive the SMS bank confirmation before handing over the device.'
  },
  {
    id: 's-4',
    category: 'selling',
    tag: 'Price Guarantee',
    q: 'How long is my instant online quote valid?',
    a: 'Your generated price quote is locked and guaranteed for 72 hours. This gives you ample time to backup your data and schedule your preferred pickup slot.'
  },
  {
    id: 's-5',
    category: 'selling',
    tag: 'Document Checklist',
    q: 'What documents are required when handing over the phone?',
    a: 'You only need one valid Government ID (Aadhaar Card, Driving License, or Voter ID) for KYC verification. If available, original box, invoice, and accessories help you unlock top-tier valuation bonuses.'
  },

  // Buying
  {
    id: 'b-1',
    category: 'buying',
    tag: 'Condition Grading',
    q: 'What is the difference between Superb, Good, and Fair grades?',
    a: 'Grade A (Superb) has zero scratches and looks pristine like showroom stock (>90% battery health). Grade B (Good) has flawless screen with 1–2 tiny micro-scratches on bezel (>85% battery). Grade C (Fair) has noticeable cosmetic wear on the back cover but 100% operational hardware at maximum discounts up to 65% off.'
  },
  {
    id: 'b-2',
    category: 'buying',
    tag: 'Warranty Coverage',
    q: 'Does a refurbished phone come with a warranty and return window?',
    a: 'Yes! Every refurbished device comes with a 12-Month SELBAR Assured Hardware Warranty and a 15-Day Hassle-Free Replacement / Refund window.'
  },
  {
    id: 'b-3',
    category: 'buying',
    tag: 'Box Contents',
    q: 'What accessories come inside the box?',
    a: 'Your phone arrives in an official SELBAR branded shockproof box containing a certified fast-charging cable, SIM ejector tool, quality test report card, and a stamped warranty certificate.'
  },
  {
    id: 'b-4',
    category: 'buying',
    tag: 'Original Parts',
    q: 'Are all internal parts 100% original and verified?',
    a: 'Yes. Every device is audited with specialized OEM diagnostic firmware to verify that screens, cameras, motherboards, and battery components are authentic and uncompromised.'
  },

  // Repair
  {
    id: 'r-1',
    category: 'repair',
    tag: 'Doorstep Repair',
    q: 'How does doorstep mobile repair work?',
    a: 'You choose your model and the fault (e.g. cracked screen, drained battery). Our certified technician visits your home or office with specialized ESD tools and performs the repair in front of your eyes in 30 minutes.'
  },
  {
    id: 'r-2',
    category: 'repair',
    tag: 'Repair Warranty',
    q: 'Do repairs come with a warranty?',
    a: 'Yes. All screen replacements and internal hardware repairs carry an official 6-month warranty. If the touch digitizer fails, we swap it for free without asking questions.'
  },
  {
    id: 'r-3',
    category: 'repair',
    tag: 'Genuine Spares',
    q: 'What quality of spare parts are used during repair?',
    a: 'We only utilize Grade-A OEM-grade parts with strict color reproduction, brightness levels, and haptic touch fidelity matching factory specifications.'
  },

  // Privacy
  {
    id: 'p-1',
    category: 'privacy',
    tag: 'Data Sanitization',
    q: 'Will my personal photos or WhatsApp messages be seen?',
    a: 'Never. Our intake process conducts military-standard NIST 800-88 multi-pass cryptographic data sanitization that overwrites every flash sector. You also receive an official Data Erasure Certificate with an immutable SHA-256 hash.'
  },
  {
    id: 'p-2',
    category: 'privacy',
    tag: 'Legal Compliance',
    q: 'Is SELBAR compliant with the India DPDP Act 2023?',
    a: 'Yes. We strictly adhere to India’s Digital Personal Data Protection Act 2023 as a registered Data Fiduciary with dedicated Grievance Officer oversight.'
  },

  // Terms & Conditions
  {
    id: 't-1',
    category: 'terms',
    tag: 'Eligibility',
    q: 'What are the terms of use for buyback transactions?',
    a: 'Sellers must be at least 18 years old and the lawful owner of the device. Devices reported lost, stolen, or blacklisted on telecom registries will be reported to law enforcement authorities under our strict anti-fraud policy.'
  },
  {
    id: 't-2',
    category: 'terms',
    tag: 'Cancellation',
    q: 'Can I cancel or reschedule my pickup appointment?',
    a: 'Yes, you can reschedule or cancel your pickup slot at any time through your Account dashboard or by replying to the WhatsApp confirmation message with zero cancellation fee.'
  }
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'selling' | 'buying' | 'repair' | 'privacy' | 'terms'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<string[]>(['s-1', 'b-1', 'r-1']);
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<string, 'yes' | 'no'>>({});

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleHelpful = (id: string, value: 'yes' | 'no') => {
    setHelpfulFeedback((prev) => ({ ...prev, [id]: value }));
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const categories = [
    { id: 'all', label: 'All Questions', count: FAQ_DATA.length, icon: HelpCircle },
    { id: 'selling', label: 'Selling Phone', count: FAQ_DATA.filter((f) => f.category === 'selling').length, icon: Smartphone },
    { id: 'buying', label: 'Buying Refurbished', count: FAQ_DATA.filter((f) => f.category === 'buying').length, icon: RotateCcw },
    { id: 'repair', label: 'Doorstep Repair', count: FAQ_DATA.filter((f) => f.category === 'repair').length, icon: Wrench },
    { id: 'privacy', label: 'Data Privacy', count: FAQ_DATA.filter((f) => f.category === 'privacy').length, icon: Lock },
    { id: 'terms', label: 'Terms & Policies', count: FAQ_DATA.filter((f) => f.category === 'terms').length, icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/70 text-teal-700 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Help Center & Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Frequently Asked <span className="text-teal-600">Questions</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Find answers to common questions about doorstep buyback, live payouts, 32-point refurbished quality checks, warranty claims, and certified data erasure.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto pt-3">
            <div className="relative group">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-teal-600 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
              <input
                type="text"
                placeholder="Search questions (e.g. valuation, warranty, pickup, data wipe)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 shadow-sm focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-teal-600/20 shadow-md scale-102'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accordion FAQ Feed */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-base text-slate-800">No questions found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn’t find any questions matching "{searchQuery}". Try a different keyword or reset categories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl mt-2 transition"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              const feedback = helpfulFeedback[faq.id];
              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                    isOpen
                      ? 'border-teal-500/80 shadow-md ring-1 ring-teal-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="space-y-1.5 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[10px] font-bold tracking-wide uppercase border border-teal-200/50">
                          {faq.tag}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {faq.q}
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
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40 animate-in fade-in-50 duration-150 space-y-4">
                      <p>{faq.a}</p>

                      {/* Helpful Reaction Strip */}
                      <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                        <span>Was this answer helpful?</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleHelpful(faq.id, 'yes')}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition ${
                              feedback === 'yes'
                                ? 'bg-teal-50 text-teal-700 border-teal-300'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>Yes</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleHelpful(faq.id, 'no')}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition ${
                              feedback === 'no'
                                ? 'bg-rose-50 text-rose-700 border-rose-300'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <ThumbsDown className="w-3 h-3" />
                            <span>No</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Comprehensive Help & Support Desk Banner */}
        <div className="p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl shadow-xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-lg">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400">
                <MessageSquare className="w-4 h-4" />
                <span>24/7 Multi-Channel Support</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Still have a question or need instant help?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our support team and doorstep technicians are active 7 days a week from 9:00 AM to 9:00 PM across India.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <Link
                href="/stores"
                className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Locate Nearby Store</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="tel:1800735227"
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition border border-slate-700 flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-teal-400" />
                <span>1800-SELBAR</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
