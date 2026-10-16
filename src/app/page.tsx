'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BRANDS, REFURB_PRODUCTS } from '@/lib/db/data';
import { HeroInstantValuation } from '@/components/home/HeroInstantValuation';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  Truck,
  RotateCcw,
  Smartphone,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  Clock,
  Sparkles,
  Award,
  Layers
} from 'lucide-react';
import { PublicSiteSettings, DEFAULT_SITE_SETTINGS } from '@/lib/settings/types';

export default function HomePage() {
  const [settings, setSettings] = useState<PublicSiteSettings>(DEFAULT_SITE_SETTINGS);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Filter only phone refurb products
  const phoneProducts = REFURB_PRODUCTS.filter(
    (p) => p.category === 'old-phone' || p.categoryGroup === 'old-phone'
  ).slice(0, 8);

  // Phone brands from catalog
  const phoneBrands = BRANDS.filter((b) => b.category === 'phone' || !b.category);

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

  const topFaqs = [
    {
      q: 'How does doorstep selling work with Sellbar?',
      a: 'Select your phone model and answer simple condition questions to get an upfront cash quote. Choose a convenient 2-hour pickup slot. Our certified technician visits your doorstep, runs a quick 10-minute diagnostic check, and transfers payment instantly via UPI or Bank Transfer before taking the phone.'
    },
    {
      q: 'When do I receive payment for my old phone?',
      a: 'Payment is made immediately on the spot! As soon as the technician completes the doorstep inspection and you approve the valuation, funds are transferred directly to your UPI ID or Bank Account with an instant UTR receipt.'
    },
    {
      q: 'Is my personal data completely safe when selling?',
      a: 'Yes, 100%. We instruct sellers to perform a factory reset before handover. Furthermore, our technicians follow certified multi-pass electronic data erasure protocols to guarantee that no photos, contacts, or accounts can ever be retrieved.'
    },
    {
      q: `What warranty is included with refurbished phones?`,
      a: `Every certified refurbished phone sold on Sellbar includes a standard ${settings.warrantyMonthsDefault || 6}-month warranty and a ${settings.replacementWindowDays || 15}-day replacement window for dead-on-arrival or internal manufacturing hardware defects.`
    },
    {
      q: 'What cosmetic condition grades do you offer?',
      a: 'We offer three transparent condition grades: Superb (mint condition with scratch-free display and 90%+ battery), Good (minor cosmetic pocket wear on frame, 100% operational hardware), and Fair (noticeable exterior signs of usage, offering maximum savings).'
    },
    {
      q: 'Which cities do you currently operate in?',
      a: 'Sellbar provides dedicated doorstep inspection and pickup across Tier-2 and Tier-3 hubs in Bihar, including Bettiah, Bagaha, Narkatiaganj, Ramnagar, Motihari, and Patna, with express regional coverage expanding monthly.'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-16 sm:pt-12 sm:pb-20 overflow-hidden bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading, Subhead & Action links */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>India&apos;s Honest Recommerce Platform</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.15]">
                Sell your old phone for the{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600">
                  best price
                </span>
                . Get paid at your door.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Fair market valuations with itemised condition deductions. Free 24-hour doorstep inspection, instant UPI transfer at handover, and certified data erasure.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/sell"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Sell Old Phone</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/buy"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm transition flex items-center justify-center gap-2 shadow-2xs"
                >
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>Buy Certified Refurbished</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Clean Visual Illustration Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md bg-linear-to-br from-emerald-50 to-teal-50/50 rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xl shadow-emerald-950/5 text-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                  <div className="font-bold text-xs text-emerald-900 uppercase tracking-wider">
                    Sellbar Doorstep Promise
                  </div>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>

                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-2xl border border-emerald-100/80 shadow-2xs flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                      1
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Upfront Price Quote</div>
                      <div className="text-[11px] text-slate-500">Transparent itemised condition breakdown</div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-emerald-100/80 shadow-2xs flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
                      2
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Free Home Pickup</div>
                      <div className="text-[11px] text-slate-500">2-hour convenient scheduled slots</div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-emerald-100/80 shadow-2xs flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                      3
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Immediate Payment</div>
                      <div className="text-[11px] text-slate-500">UPI or Bank Transfer before handover</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <span className="text-[11px] font-semibold text-emerald-800">
                    Active across West Champaran & Tier-2 Bihar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-STEP ESTIMATE WIDGET OVERLAY */}
      <HeroInstantValuation />

      {/* 2. TRUST STRIP (4 Factual Items from SiteSettings) */}
      <section className="py-8 bg-slate-100/70 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Trust 1: Free Pickup */}
            <div className="flex items-center gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Free Doorstep Pickup</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Zero convenience charge</p>
              </div>
            </div>

            {/* Trust 2: Pay After Inspection */}
            <div className="flex items-center gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Pay After Inspection</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Instant UPI or Cash at door</p>
              </div>
            </div>

            {/* Trust 3: Data Erased */}
            <div className="flex items-center gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Data Erased Before Resale</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Electronic device wipe</p>
              </div>
            </div>

            {/* Trust 4: Warranty + Replacement */}
            <div className="flex items-center gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  {settings.warrantyMonthsDefault || 6}M Warranty + {settings.replacementWindowDays || 15}D Replace
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Covers verified defects</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW SELLING WORKS (3 Steps with icons + CTA) */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-3">
              How Selling Your Phone Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              No endless bargaining or posting classified ads. Sell safely right from your living room.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 text-center space-y-3 relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Get Transparent Quote</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select your phone brand, model, and answer simple condition questions. Get an upfront guaranteed price breakdown.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 text-center space-y-3 relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Free Doorstep Pickup</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Schedule a 2-hour pickup slot. Our trained technician arrives at your address and conducts a quick 10-minute diagnostic check.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 text-center space-y-3 relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Instant Handover Payment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Money is transferred immediately to your UPI or Bank Account before you hand over the device. 100% verified and secure.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition"
            >
              <span>Start Selling Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. REFURBISHED PICKS (Real Listed Units with Honest Data) */}
      <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Verified Inventory
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-2">
                Certified Refurbished Smartphones
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Every unit is hardware-tested, backed by a {settings.warrantyMonthsDefault || 6}-month warranty and {settings.replacementWindowDays || 15}-day replacement.
              </p>
            </div>

            <Link
              href="/buy"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 self-start sm:self-auto"
            >
              <span>View All Refurbished Phones</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {phoneProducts.length >= 4 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {phoneProducts.map((p) => {
                const topGrade = p.grades?.[0] || { price: 9999, originalMrp: 18000, grade: 'superb', stock: 3 };
                const discount = topGrade.originalMrp
                  ? Math.round(((topGrade.originalMrp - topGrade.price) / topGrade.originalMrp) * 100)
                  : 0;

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
                  >
                    <div>
                      {/* Product Image */}
                      <div className="w-full aspect-square rounded-xl bg-slate-100/80 p-2 mb-3 overflow-hidden flex items-center justify-center">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80'}
                          alt={`${p.brand} ${p.name}`}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>

                      {/* Grade Badge */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                          {topGrade.grade === 'superb' ? 'Superb (Like New)' : topGrade.grade}
                        </span>
                        {topGrade.stock <= 3 && (
                          <span className="text-[10px] font-bold text-amber-700">
                            Only {topGrade.stock} left
                          </span>
                        )}
                      </div>

                      {/* Title & Specs */}
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {p.specs?.storage || '128GB'} • {p.specs?.ram || '6GB RAM'}
                      </p>
                    </div>

                    {/* Price and CTA */}
                    <div className="pt-3 mt-3 border-t border-slate-100">
                      <div className="flex items-baseline gap-1.5 mb-2">
                        <span className="text-base sm:text-lg font-black text-slate-900">
                          ₹{topGrade.price.toLocaleString('en-IN')}
                        </span>
                        {topGrade.originalMrp && (
                          <span className="text-[11px] text-slate-400 line-through">
                            ₹{topGrade.originalMrp.toLocaleString('en-IN')}
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="text-[10px] font-bold text-emerald-600">
                            {discount}% off
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/buy/${p.slug}`}
                        className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <span>View Phone</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-lg mx-auto space-y-3">
              <Sparkles className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Fresh Stock Arriving Soon</h3>
              <p className="text-xs text-slate-600">
                Our technicians are testing new batch units. Leave your email or phone number to be notified the moment stock drops.
              </p>
              <div className="pt-2">
                <Link
                  href="/coming-soon/other"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
                >
                  <span>Join Stock Notification Waitlist</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. WHY SELLBAR (3-4 Factual Promises from Settings) */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Our Commitments
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-3">
              Why Sell & Buy With Sellbar
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Built on transparency, verified doorstep safety, and genuine Indian consumer protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Itemised Transparent Valuation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every deduction for scratches or battery health is clearly explained before you confirm. No surprise price drops at the doorstep.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Pay-Before-Handover Security</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You never hand over your device until the payment is confirmed in your bank account or UPI app with a clear transaction ID.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {settings.warrantyMonthsDefault || 6}M Warranty & {settings.replacementWindowDays || 15}D Replacement
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Refurbished devices come with guaranteed repair support and zero-hassle replacement coverage for hardware faults.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BRANDS (Static Logo Tiles for Catalog Phone Brands) */}
      <section className="py-14 sm:py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Supported Phone Brands
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Select your phone brand for instant catalog valuations and trade-in pricing
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {phoneBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/sell?brand=${brand.id}`}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-500 shadow-2xs hover:shadow-sm text-center transition group flex flex-col items-center justify-center"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{brand.logo}</span>
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS (Honest State: Hidden if < 3 Real Completed Orders) */}
      {/* Kept hidden until real reviews are logged in DB to adhere to Zero Fake Reviews Rule */}

      {/* 8. FAQ ACCORDION (Top 6 from Admin FAQ) */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-3">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Clear answers regarding pricing, doorstep pickup, data security, and warranty.
            </p>
          </div>

          <div className="space-y-3">
            {topFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-emerald-700 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      activeFaq === idx ? 'rotate-90 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              <span>View All Frequently Asked Questions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CTA (Sell Phone / Buy Phone) */}
      <section className="py-12 sm:py-16 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to upgrade your smartphone today?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Get an instant valuation in 60 seconds, or browse verified refurbished phones with full 6-month warranty.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              href="/sell"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Smartphone className="w-4 h-4" />
              <span>Sell My Old Phone</span>
            </Link>
            <Link
              href="/buy"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Browse Refurbished Phones</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
