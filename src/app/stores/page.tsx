'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Clock,
  Search,
  CheckCircle2,
  Navigation,
  Star,
  Building,
  ShieldCheck,
  Smartphone,
  SlidersHorizontal,
  RotateCcw,
  X,
  Check
} from 'lucide-react';

const STORES = [
  {
    id: 'bettiah-1',
    name: 'SELBAR Experience Centre — Bettiah Flagship',
    address: 'Shop 12-14, Ground Floor, Station Road, Near Supriya Cinema, Bettiah',
    state: 'Bihar',
    city: 'Bettiah',
    pincode: '845438',
    phone: '+91 98765 43210',
    timing: '10:00 AM – 08:30 PM (Open All 7 Days)',
    services: ['Instant Phone Sell', 'Buy Certified Refurbished', 'Doorstep Pickup Dispatch', '30-Min Screen Repair'],
    rating: 4.9,
    reviews: 428,
  },
  {
    id: 'bagaha-1',
    name: 'SELBAR Store — Bagaha Main Market',
    address: 'Gandhi Chowk, Main Bazaar Road, Bagaha-1, West Champaran',
    state: 'Bihar',
    city: 'Bagaha',
    pincode: '845105',
    phone: '+91 98765 43211',
    timing: '10:00 AM – 08:00 PM',
    services: ['Instant Phone Sell', 'Buy Certified Refurbished', 'Battery & Screen Repair'],
    rating: 4.8,
    reviews: 312,
  },
  {
    id: 'narkatiaganj-1',
    name: 'SELBAR Experience Hub — Narkatiaganj Station',
    address: 'Station Road, Near Railway Junction Gate 1, Narkatiaganj',
    state: 'Bihar',
    city: 'Narkatiaganj',
    pincode: '845455',
    phone: '+91 98765 43212',
    timing: '10:00 AM – 08:00 PM',
    services: ['Instant Phone Sell', 'Buy Certified Refurbished', 'Certified Data Wipe', 'Cash Pickup Point'],
    rating: 4.8,
    reviews: 245,
  },
  {
    id: 'ramnagar-1',
    name: 'SELBAR Store — Ramnagar Cinema Chowk',
    address: 'Cinema Road, Main Market, Ramnagar, West Champaran',
    state: 'Bihar',
    city: 'Ramnagar',
    pincode: '845103',
    phone: '+91 98765 43213',
    timing: '10:00 AM – 07:30 PM',
    services: ['Instant Phone Sell', 'Buy Certified Refurbished', 'Free Testing Point'],
    rating: 4.7,
    reviews: 198,
  },
  {
    id: 'lauriya-1',
    name: 'SELBAR Hub — Lauriya Chowk',
    address: 'Near Ashok Pillar Historical Chowk, Main Road, Lauriya',
    state: 'Bihar',
    city: 'Lauriya',
    pincode: '845453',
    phone: '+91 98765 43214',
    timing: '10:00 AM – 07:30 PM',
    services: ['Instant Phone Sell', 'Buy Certified Refurbished', 'Doorstep Pickup Dispatch'],
    rating: 4.8,
    reviews: 164,
  },
  {
    id: 'valmikinagar-1',
    name: 'SELBAR Service Point — Valmikinagar',
    address: 'Main Gate Complex, Near Valmiki Tiger Reserve, Valmikinagar',
    state: 'Bihar',
    city: 'Valmikinagar',
    pincode: '845107',
    phone: '+91 98765 43215',
    timing: '10:00 AM – 07:00 PM',
    services: ['Doorstep Pickup Dispatch', 'Instant Phone Sell', 'Buy Certified Refurbished'],
    rating: 4.9,
    reviews: 135,
  },
];

const ALL_CITIES = ['All Cities', 'Bettiah', 'Bagaha', 'Narkatiaganj', 'Ramnagar', 'Lauriya', 'Valmikinagar'];

const ALL_SERVICES_FILTER = [
  'Instant Phone Sell',
  'Buy Certified Refurbished',
  '30-Min Screen Repair',
  'Certified Data Wipe',
  'Doorstep Pickup Dispatch'
];

export default function StoresPage() {
  const [searchCity, setSearchCity] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedService, setSelectedService] = useState('all');
  const [minRating, setMinRating] = useState<number>(0);

  const filteredStores = useMemo(() => {
    return STORES.filter((store) => {
      const matchesSearch =
        !searchCity.trim() ||
        store.city.toLowerCase().includes(searchCity.toLowerCase()) ||
        store.name.toLowerCase().includes(searchCity.toLowerCase()) ||
        store.pincode.includes(searchCity);

      const matchesCity = selectedCity === 'All Cities' || store.city === selectedCity;
      const matchesService = selectedService === 'all' || store.services.includes(selectedService);
      const matchesRating = store.rating >= minRating;

      return matchesSearch && matchesCity && matchesService && matchesRating;
    });
  }, [searchCity, selectedCity, selectedService, minRating]);

  const resetFilters = () => {
    setSearchCity('');
    setSelectedCity('All Cities');
    setSelectedService('all');
    setMinRating(0);
  };

  const isFiltered =
    searchCity.trim() !== '' ||
    selectedCity !== 'All Cities' ||
    selectedService !== 'all' ||
    minRating > 0;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Building className="w-3.5 h-3.5" />
            <span>50+ Experience Centres & Verification Hubs</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Find A SELBAR Store <span className="text-emerald-600">Near You</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Walk in to sell your old device for instant cash, experience certified refurbished phones, or get screen repair in 30 minutes.
          </p>
        </div>
      </div>

      {/* Main 2-Column Grid with Left Filter Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-24 space-y-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <span>Store Filters</span>
              </div>
              {isFiltered && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-orange-600 hover:underline font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Search Location</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="City, PIN, area..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>
            </div>

            {/* City Facet */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">City / Region</label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {ALL_CITIES.map((c) => {
                  const count = c === 'All Cities' ? STORES.length : STORES.filter((s) => s.city === c).length;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedCity(c)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
                        selectedCity === c
                          ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{c}</span>
                      <span className="text-[10px] text-slate-400">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* In-Store Services Facet */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Available Services</label>
              <div className="space-y-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedService('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition flex items-center justify-between ${
                    selectedService === 'all'
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All In-Store Services</span>
                  {selectedService === 'all' && <Check className="w-3 h-3 text-emerald-600" />}
                </button>
                {ALL_SERVICES_FILTER.map((srv) => (
                  <button
                    key={srv}
                    type="button"
                    onClick={() => setSelectedService(srv)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition flex items-center justify-between ${
                      selectedService === srv
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{srv}</span>
                    {selectedService === srv && <Check className="w-3 h-3 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Rating Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Rating</label>
              <div className="grid grid-cols-3 gap-1 text-xs">
                {[
                  { label: 'All', val: 0 },
                  { label: '4.5+ ★', val: 4.5 },
                  { label: '4.8+ ★', val: 4.8 }
                ].map((r) => (
                  <button
                    key={r.label}
                    type="button"
                    onClick={() => setMinRating(r.val)}
                    className={`py-1.5 px-2 rounded-lg text-center font-medium border transition ${
                      minRating === r.val
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content Area: Store Cards */}
        <main className="lg:col-span-3 space-y-4">
          {/* Active Chips & Count Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-medium text-slate-600">
              Showing <strong className="text-slate-900">{filteredStores.length}</strong> official SELBAR experience centres
            </div>

            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-orange-600 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Stores Feed */}
          {filteredStores.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No stores found in this area</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for a nearby district or clear your service filters. Free doorstep pickup is available anywhere in Bihar!
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                          Open Today
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-slate-950 mt-1">
                        {store.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{store.address}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{store.rating}</span>
                      <span className="text-slate-400 font-normal">({store.reviews})</span>
                    </div>
                  </div>

                  {/* Services Tag Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                    {store.services.map((svc) => (
                      <span
                        key={svc}
                        className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        ✓ {svc}
                      </span>
                    ))}
                  </div>

                  {/* Footer Timings & Action Links */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{store.timing}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700">{store.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Get Directions</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
