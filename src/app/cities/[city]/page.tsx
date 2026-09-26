'use client';

import React, { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  ShieldCheck,
  Smartphone,
  Star,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Phone,
  Building,
  Navigation,
  ChevronDown,
  Sparkles,
  Search,
  MessageSquare
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CITIES_DATA, CityHub } from '../page';

// City-specific stores
const CITY_STORES: Record<string, {
  name: string;
  address: string;
  phone: string;
  timing: string;
  rating: number;
  reviews: number;
}> = {
  bettiah: {
    name: 'SELBAR Experience Centre — Bettiah Flagship',
    address: 'Shop 12-14, Ground Floor, Station Road, Near Supriya Cinema, Bettiah (845438)',
    phone: '+91 98765 43210',
    timing: '10:00 AM – 08:30 PM (All 7 Days Open)',
    rating: 4.9,
    reviews: 428
  },
  bagaha: {
    name: 'SELBAR Store — Bagaha Main Market',
    address: 'Gandhi Chowk, Main Bazaar Road, Bagaha-1, West Champaran (845105)',
    phone: '+91 98765 43211',
    timing: '10:00 AM – 08:00 PM',
    rating: 4.8,
    reviews: 312
  },
  narkatiaganj: {
    name: 'SELBAR Hub — Narkatiaganj Station Road',
    address: 'Station Road, Near Railway Junction Gate 1, Narkatiaganj (845455)',
    phone: '+91 98765 43212',
    timing: '10:00 AM – 08:00 PM',
    rating: 4.8,
    reviews: 245
  },
  patna: {
    name: 'SELBAR Super Experience Hub — Boring Road',
    address: 'Plot 104, Boring Road Crossing, Near Alankar Jewellers, Patna (800001)',
    phone: '+91 98765 43213',
    timing: '10:00 AM – 09:00 PM',
    rating: 4.9,
    reviews: 1120
  },
  gorakhpur: {
    name: 'SELBAR Experience Hub — Golghar',
    address: 'Shop 4-5, City Center Mall, Golghar Main Road, Gorakhpur (273001)',
    phone: '+91 98765 43214',
    timing: '10:00 AM – 08:30 PM',
    rating: 4.8,
    reviews: 580
  },
  motihari: {
    name: 'SELBAR Store — Chhatauni Chawk',
    address: 'Near Old Bus Stand, Chhatauni, Motihari (845401)',
    phone: '+91 98765 43215',
    timing: '10:00 AM – 08:00 PM',
    rating: 4.7,
    reviews: 310
  },
  muzaffarpur: {
    name: 'SELBAR Store — Motijheel Commercial Area',
    address: 'Motijheel Road, Opposite City Hospital, Muzaffarpur (842001)',
    phone: '+91 98765 43216',
    timing: '10:00 AM – 08:30 PM',
    rating: 4.8,
    reviews: 440
  },
  'delhi-ncr': {
    name: 'SELBAR Hub — Sector 18 Noida & Connaught Place',
    address: 'Block K, Connaught Place, New Delhi & Sector 18 Commercial Hub, Noida',
    phone: '+91 98765 43217',
    timing: '09:30 AM – 09:30 PM',
    rating: 4.9,
    reviews: 2450
  }
};

// City customer reviews
const CITY_REVIEWS: Record<string, Array<{ name: string; device: string; comment: string; rating: number; area: string }>> = {
  bettiah: [
    {
      name: 'Santosh Tiwari',
      device: 'Sold iPhone 13 (128GB)',
      comment: 'Bettiah me itna fast doorstep pickup maine expect nahi kiya tha! Executive 45 minute me aa gaya aur instant UPI transfer mil gaya.',
      rating: 5,
      area: 'Station Road'
    },
    {
      name: 'Neha Pandey',
      device: 'Bought Refurbished iPhone 14 Pro',
      comment: 'Showroom condition device mila. 12 month warranty card aur bill bhi sath me aaya. 100% satisfied!',
      rating: 5,
      area: 'Supriya Cinema Road'
    }
  ],
  bagaha: [
    {
      name: 'Rajnish Kumar',
      device: 'Sold OnePlus 11R',
      comment: 'Bazaar me shop wale 20k de rahe the, SELBAR ne 24,500 direct account me credit kiya. Zero hassle.',
      rating: 5,
      area: 'Gandhi Chowk'
    }
  ],
  patna: [
    {
      name: 'Amitabh Sen',
      device: 'Sold Samsung Galaxy S23 Ultra',
      comment: 'Best recommerce service in Patna. Doorstep NIST data wipe certificate bhi mila on spot.',
      rating: 5,
      area: 'Boring Road'
    }
  ]
};

export default function CityDetailPage() {
  const params = useParams();
  const citySlug = (params?.city as string)?.toLowerCase();

  const city = CITIES_DATA.find(c => c.slug === citySlug);
  const store = CITY_STORES[citySlug] || CITY_STORES['bettiah'];
  const reviews = CITY_REVIEWS[citySlug] || CITY_REVIEWS['bettiah'];

  const [pincodeQuery, setPincodeQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!city) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="py-24 text-center">
          <h1 className="text-2xl font-bold text-slate-800">Location Not Found</h1>
          <p className="mt-2 text-slate-500">We could not find the requested service hub.</p>
          <Link href="/cities" className="mt-4 inline-block font-semibold text-emerald-600">
            ← View All Serviceable Cities
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredPincodes = city.serviceablePincodes.filter(p => p.includes(pincodeQuery));

  const FAQS = [
    {
      q: `How fast is doorstep pickup in ${city.name}?`,
      a: `In ${city.name}, we provide express doorstep pickup within ${city.expressPickupSla}. You can choose your preferred 2-hour window during quote generation.`
    },
    {
      q: `Do I get instant cash or UPI payout in ${city.name}?`,
      a: `Yes! Our certified field technician transfers 100% of the agreed valuation directly to your GPay, PhonePe, Paytm, or Bank Account right before you hand over the device.`
    },
    {
      q: `Is data wiping certified in ${city.name}?`,
      a: `Every device undergoes our certified NIST SP 800-88 data sanitization process. You receive an official digital certificate with a verifiable SHA-256 hash.`
    },
    {
      q: `Can I visit the local SELBAR Experience Store in ${city.name}?`,
      a: `Yes, you can visit our local store at ${store.address} to buy certified refurbished smartphones or get 30-minute screen and battery repairs.`
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(16,185,129,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md">
                <MapPin className="h-3.5 w-3.5" /> {city.region}, {city.state} Hub
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-5xl leading-tight">
                Sell Old Phone in <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">{city.name}</span>
                <br />Get Instant Cash at Doorstep
              </h1>

              <p className="mt-4 text-base text-slate-300 max-w-xl">
                {city.tagline} Guaranteed highest price lock, 17-point doorstep inspection, and instant UPI payment in your bank before handover.
              </p>

              {/* Service Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-200">
                <div className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-3 py-1.5 border border-slate-700">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span>{city.expressPickupSla}</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-3 py-1.5 border border-slate-700">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  <span>Instant Doorstep UPI Payout</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-3 py-1.5 border border-slate-700">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>NIST 800-88 Data Wipe</span>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={`/sell?city=${city.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-all hover:scale-105"
                >
                  <Smartphone className="h-4 w-4" /> Get Instant {city.name} Valuation
                </Link>
                <Link
                  href={`/repair?city=${city.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-3.5 text-sm font-bold text-white border border-slate-700 hover:bg-slate-700 transition-all"
                >
                  Book 30-Min Doorstep Repair
                </Link>
              </div>
            </div>

            {/* Right Card: Local Experience Centre */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-700 bg-slate-800/90 p-6 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Official Experience Store
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{store.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 rounded-md bg-emerald-500/20 px-2 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                    <Star className="h-3.5 w-3.5 fill-current" /> {store.rating}
                  </div>
                </div>

                <div className="mt-4 space-y-3 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{store.address}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{store.timing}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{store.phone}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700 flex gap-2">
                  <a
                    href={`tel:${store.phone}`}
                    className="flex-1 text-center rounded-xl bg-emerald-600/20 border border-emerald-500/30 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    Call Store
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-700 py-2.5 text-xs font-bold text-white hover:bg-slate-600 transition-colors"
                  >
                    <Navigation className="h-3.5 w-3.5" /> Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Simple Process */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            How Doorstep Device Recommerce Works in {city.name}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            3 simple steps from your couch to instant money in your bank account.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 font-extrabold text-lg">
              1
            </div>
            <h3 className="mt-4 font-bold text-slate-900">Check Instant Price</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Select your smartphone model and answer 4 quick condition questions to lock your guaranteed quote.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 font-extrabold text-lg">
              2
            </div>
            <h3 className="mt-4 font-bold text-slate-900">Free Doorstep Pickup</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Our verified technician arrives at your {city.name} home within your chosen 2-hour slot for a 17-point test.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 font-extrabold text-lg">
              3
            </div>
            <h3 className="mt-4 font-bold text-slate-900">Instant UPI Payment</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Receive 100% full payment on the spot via GPay / PhonePe / Bank along with a NIST 800-88 Data Wipe Certificate.
            </p>
          </div>
        </div>
      </section>

      {/* Serviceable Pincodes in City */}
      <section className="bg-white border-y border-slate-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Serviceable Pincodes in {city.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your 6-digit postal code to check instant doorstep technician dispatch availability.
              </p>
            </div>

            <div className="w-full md:w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter pincodes..."
                  value={pincodeQuery}
                  onChange={e => setPincodeQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {filteredPincodes.map(pin => (
              <span
                key={pin}
                className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-800"
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-600" /> {pin}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews from this city */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            What Customers in {city.name} Say About SELBAR
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Real verified doorstep transactions from your neighbourhood.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {reviews.map((rev, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">{rev.name}</h4>
                  <span className="text-xs text-slate-400">{rev.area}, {city.name}</span>
                </div>
                <div className="flex text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>

              <div className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                {rev.device}
              </div>

              <p className="mt-3 text-xs text-slate-600 leading-relaxed italic">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* City FAQs */}
      <section className="bg-slate-100/70 border-t border-slate-200 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Frequently Asked Questions — {city.name}
          </h2>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-4 text-left font-semibold text-sm text-slate-900 hover:text-emerald-600"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openFaq === idx ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Bottom Sticky Bar for City Sell CTA */}
      <div className="sticky bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800">
              Selling a device in {city.name}?
            </span>
            <p className="text-[11px] text-emerald-700 hidden sm:block">
              ⚡ {city.expressPickupSla} available right now.
            </p>
          </div>
          <Link
            href={`/sell?city=${city.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
          >
            Sell Phone in {city.name} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
