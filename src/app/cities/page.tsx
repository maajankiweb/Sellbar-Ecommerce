'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight,
  Building,
  CheckCircle2,
  Navigation,
  Smartphone,
  PhoneCall
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export interface CityHub {
  slug: string;
  name: string;
  state: string;
  region: string;
  expressPickupSla: string; // e.g. "2-Hour Express"
  activeFieldExecutives: number;
  experienceStoresCount: number;
  popularModels: string[];
  serviceablePincodes: string[];
  tagline: string;
  isFlagship?: boolean;
}

export const CITIES_DATA: CityHub[] = [
  {
    slug: 'bettiah',
    name: 'Bettiah',
    state: 'Bihar',
    region: 'West Champaran',
    expressPickupSla: '2-Hour Express Doorstep',
    activeFieldExecutives: 14,
    experienceStoresCount: 1,
    popularModels: ['iPhone 13', 'OnePlus 11R', 'Galaxy S23', 'Redmi Note 12 Pro'],
    serviceablePincodes: ['845438', '845456', '845439', '845454'],
    tagline: 'SELBAR Flagship Recommerce Hub with 30-min Express Screen Repair and Instant Doorstep Cash Payout.',
    isFlagship: true
  },
  {
    slug: 'bagaha',
    name: 'Bagaha',
    state: 'Bihar',
    region: 'West Champaran',
    expressPickupSla: '2-Hour Express Doorstep',
    activeFieldExecutives: 9,
    experienceStoresCount: 1,
    popularModels: ['iPhone 14', 'Vivo V29', 'Realme 11 Pro', 'Samsung A54'],
    serviceablePincodes: ['845105', '845101', '845104', '845103'],
    tagline: 'Fastest smartphone valuation & doorstep pickup across Bagaha-1 & Bagaha-2 bazaar areas.'
  },
  {
    slug: 'narkatiaganj',
    name: 'Narkatiaganj',
    state: 'Bihar',
    region: 'West Champaran',
    expressPickupSla: '3-Hour Doorstep Pickup',
    activeFieldExecutives: 7,
    experienceStoresCount: 1,
    popularModels: ['iPhone 12', 'OnePlus Nord CE 3', 'Redmi 12 5G', 'Oppo Reno 10'],
    serviceablePincodes: ['845455', '845457', '845453'],
    tagline: 'Certified device buyback hub near Railway Junction with instant cash transfer and NIST data wiping.'
  },
  {
    slug: 'motihari',
    name: 'Motihari',
    state: 'Bihar',
    region: 'East Champaran',
    expressPickupSla: '3-Hour Doorstep Pickup',
    activeFieldExecutives: 11,
    experienceStoresCount: 1,
    popularModels: ['iPhone 13 Pro', 'Samsung Galaxy S22', 'OnePlus 10T', 'Poco X5 Pro'],
    serviceablePincodes: ['845401', '845402', '845415', '845422'],
    tagline: 'Covering Chhatauni, Balua Bazaar, and Raja Bazaar with zero-deduction price locks.'
  },
  {
    slug: 'patna',
    name: 'Patna',
    state: 'Bihar',
    region: 'Patna Metro',
    expressPickupSla: '2-Hour Priority Pickup',
    activeFieldExecutives: 32,
    experienceStoresCount: 2,
    popularModels: ['iPhone 15 Pro', 'Galaxy S24 Ultra', 'MacBook Air M2', 'OnePlus 12'],
    serviceablePincodes: ['800001', '800020', '800013', '800014', '800024', '800026'],
    tagline: 'Full metro coverage across Boring Road, Kankarbagh, Bailey Road, and Danapur.'
  },
  {
    slug: 'gorakhpur',
    name: 'Gorakhpur',
    state: 'Uttar Pradesh',
    region: 'Purvanchal',
    expressPickupSla: '3-Hour Doorstep Pickup',
    activeFieldExecutives: 18,
    experienceStoresCount: 1,
    popularModels: ['iPhone 14 Plus', 'Galaxy Z Flip 5', 'iQOO Neo 7', 'Vivo X90'],
    serviceablePincodes: ['273001', '273004', '273008', '273010', '273015'],
    tagline: 'Trusted doorstep device valuation serving Golghar, Civil Lines, and Medical College Road.'
  },
  {
    slug: 'muzaffarpur',
    name: 'Muzaffarpur',
    state: 'Bihar',
    region: 'North Bihar',
    expressPickupSla: '3-Hour Doorstep Pickup',
    activeFieldExecutives: 15,
    experienceStoresCount: 1,
    popularModels: ['iPhone 13', 'OnePlus 11R', 'Samsung A34', 'Realme GT Neo'],
    serviceablePincodes: ['842001', '842002', '842003', '842004'],
    tagline: 'Doorstep pickup and verified refurbishment coverage across Mithanpura and Motijheel.'
  },
  {
    slug: 'delhi-ncr',
    name: 'Delhi NCR',
    state: 'Delhi / UP / Haryana',
    region: 'National Capital Region',
    expressPickupSla: 'Same-Day 90-Min Superfast',
    activeFieldExecutives: 65,
    experienceStoresCount: 3,
    popularModels: ['iPhone 15 Pro Max', 'Galaxy S24 Ultra', 'Pixel 8 Pro', 'MacBook Pro'],
    serviceablePincodes: ['110001', '110025', '201301', '201309', '122001', '122002'],
    tagline: 'Express doorstep technician dispatch covering Delhi, Noida, Gurgaon, and Ghaziabad.'
  }
];

export default function CitiesDirectoryPage() {
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');

  const filteredCities = CITIES_DATA.filter(city => {
    const matchesSearch =
      city.name.toLowerCase().includes(search.toLowerCase()) ||
      city.region.toLowerCase().includes(search.toLowerCase()) ||
      city.serviceablePincodes.some(p => p.includes(search));
    const matchesState = selectedState === 'ALL' || city.state.includes(selectedState);
    return matchesSearch && matchesState;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" /> Direct Doorstep Service Across Bihar & Beyond
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            SELBAR Service Hubs & <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Doorstep Coverage</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            Experience lightning-fast smartphone buyback, certified refurbishment, and instant doorstep UPI payments in your city. Select your town below.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search city, town, or 6-digit pincode..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-400 backdrop-blur-md focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Directory */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* State Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-8">
          {['ALL', 'Bihar', 'Uttar Pradesh', 'Delhi'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                selectedState === st
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {st === 'ALL' ? 'All Locations' : st}
            </button>
          ))}
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCities.map(city => (
            <Link
              key={city.slug}
              href={`/cities/${city.slug}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-xl"
            >
              {city.isFlagship && (
                <div className="absolute top-0 right-0 rounded-bl-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  Flagship Hub
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {city.name}
                    </h2>
                    <span className="text-xs text-slate-500 font-medium">
                      {city.region}, {city.state}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  {city.tagline}
                </p>

                {/* Key Badges */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-medium text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>{city.expressPickupSla}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 pt-1">
                    <span>Active Executives: <strong className="text-slate-800">{city.activeFieldExecutives}</strong></span>
                    <span>Stores: <strong className="text-slate-800">{city.experienceStoresCount} Hub</strong></span>
                  </div>
                </div>

                {/* Pincodes preview */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] uppercase font-semibold text-slate-400">Pincodes Served:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {city.serviceablePincodes.slice(0, 4).map(pin => (
                      <span key={pin} className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-700">
                        {pin}
                      </span>
                    ))}
                    {city.serviceablePincodes.length > 4 && (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                        +{city.serviceablePincodes.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between font-semibold text-xs text-emerald-600 pt-3 border-t border-slate-100">
                <span>View Doorstep Services</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="bg-white border-y border-slate-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-emerald-100 p-3 text-emerald-600 mb-3">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900">Guaranteed Doorstep Slot</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Pick a 2-hour window. Our background-verified technician arrives on time at your door.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-full bg-blue-100 p-3 text-blue-600 mb-3">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900">NIST 800-88 Data Wipe</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Military-grade cryptographic wiping certificate generated before your device leaves your hands.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-full bg-purple-100 p-3 text-purple-600 mb-3">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900">Instant UPI Doorstep Transfer</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                100% full payout credited directly into your GPay, PhonePe, or Bank account before device handover.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
