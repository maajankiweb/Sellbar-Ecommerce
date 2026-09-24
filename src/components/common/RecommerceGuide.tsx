'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Smartphone,
  ShieldCheck,
  Zap,
  Truck,
  DollarSign,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Lock,
  Award,
  Layers,
  Check
} from 'lucide-react';

interface RecommerceGuideProps {
  className?: string;
}

export function RecommerceGuide({ className = '' }: RecommerceGuideProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const brandLinks = [
    { name: 'Apple', sellHref: '/sell?brand=apple', buyHref: '/buy?brand=apple' },
    { name: 'Samsung', sellHref: '/sell?brand=samsung', buyHref: '/buy?brand=samsung' },
    { name: 'OnePlus', sellHref: '/sell?brand=oneplus', buyHref: '/buy?brand=oneplus' },
    { name: 'Xiaomi', sellHref: '/sell?brand=xiaomi', buyHref: '/buy?brand=xiaomi' },
    { name: 'Vivo', sellHref: '/sell?brand=vivo', buyHref: '/buy?brand=vivo' },
    { name: 'Oppo', sellHref: '/sell?brand=oppo', buyHref: '/buy?brand=oppo' },
    { name: 'Realme', sellHref: '/sell?brand=realme', buyHref: '/buy?brand=realme' },
    { name: 'Google Pixel', sellHref: '/sell?brand=google', buyHref: '/buy?brand=google' },
    { name: 'HP', sellHref: '/sell?brand=hp', buyHref: '/buy?category=laptop' },
    { name: 'Lenovo', sellHref: '/sell?brand=lenovo', buyHref: '/buy?category=laptop' },
    { name: 'Dell', sellHref: '/sell?brand=dell', buyHref: '/buy?category=laptop' },
    { name: 'ASUS', sellHref: '/sell?brand=asus', buyHref: '/buy?category=laptop' },
  ];

  return (
    <section className={`w-full bg-white border-t border-slate-200/80 py-12 md:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Badge & Title */}
        <div className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Complete Recommerce & Buyback Guide</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
            Sell Your Old Phone & Buy Old Mobile Phones with SELBAR
          </h2>

          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              SELBAR is the best platform if you are looking to sell your old mobile phone. It offers a hassle-free experience, and you can sell your old mobile phone in less than five minutes.
            </p>
            <p>
              When you sell an old mobile phone with SELBAR, you can easily upgrade to a new one. SELBAR ensures that the phones you sell are in top condition so that people get good quality when they buy them.
            </p>
          </div>
        </div>

        {/* 2x2 Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Card 1: Sell Your Old Phone */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-teal-300 transition-colors shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Sell Your Old Phone
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">Doorstep Instant Valuation</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ready to sell old mobile phone? With SELBAR, you can easily get cash for your old mobile phone without leaving home. Just share your phone’s details, and we’ll offer you the best price. It’s that simple:
              </p>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700">
                    <strong className="text-slate-900 font-semibold">Get an Instant Quote:</strong> Enter your phone’s details on our website or app.
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs">
                  <Truck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700">
                    <strong className="text-slate-900 font-semibold">Free Home Pickup:</strong> Book a convenient time, and we’ll pick up your phone from your doorstep.
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs">
                  <DollarSign className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700">
                    <strong className="text-slate-900 font-semibold">Instant Cash Payment:</strong> Receive cash on the spot upon pickup.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-200/70">
              <Link
                href="/sell"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold transition shadow-xs"
              >
                <span>Get Instant Quote & Sell</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Which Mobile Phone Brands Can Be Sold and Bought On SELBAR? */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-teal-300 transition-colors shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Which Mobile Phone Brands Can Be Sold and Bought On SELBAR?
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">Over 20+ Leading Global Brands</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You can buy or sell almost all mobile phone brands in India. Popular laptops, tablets, and gaming consoles are also available on the go. SELBAR has more than 20 phone brands, and for every device you sell. Apart from this, we offer:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800">Assured sale at best price</span>
                </div>

                <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800">Hassle free</span>
                </div>

                <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800">Free home pick up</span>
                </div>

                <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800">Instant cash payment on pickup</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-200/70">
              <Link
                href="/sell"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition shadow-xs"
              >
                <span>View All Brands & Devices</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Buy Old Mobile Phones */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-teal-300 transition-colors shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Buy Old Mobile Phones
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">Certified Refurbished & Tested</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                SELBAR offers an affordable way to upgrade to a new phone. You can explore the vast selection of refurbished phones at low price. With SELBAR, you can be assured that you will get a highly functional phone. All refurbished phones are tested with proper quality checks to maintain the quality. On top of that, you get:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700">High-quality refurbished phones at affordable prices</span>
                </div>

                <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700"><strong>32-point</strong> quality checks</span>
                </div>

                <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700"><strong>6-month warranty</strong> on all refurbished phones</span>
                </div>

                <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs">
                  <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700"><strong>15 days</strong> replacement</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 italic pt-1">
                Upgrade your phone without stretching your budget. Discover our wide range of old mobile phones and get yours today at nearly half the price.
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-200/70">
              <Link
                href="/buy"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition shadow-xs"
              >
                <span>Browse Refurbished Store</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 4: How to Buy Old Phone From SELBAR */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-teal-300 transition-colors shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    How to Buy Old Phone From SELBAR
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">Simple 5-Step Order Process</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Buying old mobile phone from SELBAR is very easy and convenient. You just need to follow the steps below:
              </p>

              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-3 text-xs text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200/60 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                  <span>You can visit the website or App</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200/60 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                  <span>Click on the Buy Phone section to select the brand you want to purchase.</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200/60 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                  <span>Choose the model and the condition- <strong>Fair, Good, Superb</strong>. Based on your choice, the price will be displayed on the screen.</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200/60 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0">4</span>
                  <span>Enter your address and payment mode.</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200/60 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0">5</span>
                  <span>Make the payment and that’s it! Your device will be delivered to your doorstep.</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-200/70">
              <Link
                href="/buy"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition shadow-xs"
              >
                <span>Find Your Next Phone</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Data Privacy & Brand Flexibility Banner */}
        <div className="mt-8 bg-gradient-to-r from-teal-50 via-emerald-50 to-blue-50 border border-teal-200/70 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-teal-200 flex items-center justify-center text-teal-600 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">
                100% Data Privacy & Certified Sanitization
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                With SELBAR, your privacy is safe. We carefully clean every old phone to ensure that all your data is removed and secured.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-teal-200/60 text-xs sm:text-sm text-slate-600 leading-relaxed">
            You don’t need to worry about your old phone’s brand when selling or buying through SELBAR. We accept phones from most brands, so selling is easy. Pick the phone category, brand, and model you want to sell. You can also choose your brand from the quick links below.
          </div>
        </div>

        {/* Quick Brand Links Section */}
        <div className="mt-8 pt-8 border-t border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                Quick Brand Links — Sell & Buy
              </h4>
              <p className="text-xs text-slate-500">
                Direct access to top brands available on the platform
              </p>
            </div>
            <span className="text-xs text-teal-700 font-semibold">
              12+ Supported Brands
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {brandLinks.map((b) => (
              <div
                key={b.name}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-xs font-medium text-slate-700 hover:text-teal-800 transition shadow-xs"
              >
                <span className="font-semibold text-slate-900">{b.name}</span>
                <span className="text-slate-400">·</span>
                <Link href={b.sellHref} className="text-teal-600 hover:underline">
                  Sell
                </Link>
                <span className="text-slate-300">/</span>
                <Link href={b.buyHref} className="text-blue-600 hover:underline">
                  Buy
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default RecommerceGuide;
