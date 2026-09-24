'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import RepairFaultSelector from '@/components/repair/RepairFaultSelector';
import {
  Wrench,
  Smartphone,
  Laptop,
  Tablet,
  CheckCircle2,
  ShieldCheck,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Battery,
  Layers,
  Volume2,
  Camera,
  RotateCcw,
  SlidersHorizontal,
  Search,
  Check,
  X
} from 'lucide-react';

interface RepairService {
  id: string;
  title: string;
  deviceType: 'mobile' | 'laptop' | 'tablet';
  category: 'screen' | 'battery' | 'charging' | 'audio' | 'camera' | 'body' | 'motherboard';
  icon: any;
  description: string;
  startingPrice: number;
  time: string;
  warranty: string;
}

const ALL_SERVICES: RepairService[] = [
  {
    id: 'screen',
    title: 'Screen Replacement (OEM Grade)',
    deviceType: 'mobile',
    category: 'screen',
    icon: Layers,
    description: 'Original OEM-grade display replacement with smooth touch response and 6-month warranty.',
    startingPrice: 1299,
    time: '30 mins express',
    warranty: '6 Months'
  },
  {
    id: 'battery',
    title: 'Battery Replacement',
    deviceType: 'mobile',
    category: 'battery',
    icon: Battery,
    description: 'High-density certified lithium polymer battery with 100% battery health restore.',
    startingPrice: 799,
    time: '20 mins express',
    warranty: '12 Months'
  },
  {
    id: 'charging',
    title: 'Charging Jack / Port Repair',
    deviceType: 'mobile',
    category: 'charging',
    icon: Wrench,
    description: 'Fix loose connector, slow charging, or heating issues with precision soldering.',
    startingPrice: 499,
    time: '25 mins express',
    warranty: '3 Months'
  },
  {
    id: 'mic-speaker',
    title: 'Mic & Loudspeaker Repair',
    deviceType: 'mobile',
    category: 'audio',
    icon: Volume2,
    description: 'Resolve muffled microphone, low ear-piece sound, or crackling speaker audio.',
    startingPrice: 449,
    time: '20 mins express',
    warranty: '3 Months'
  },
  {
    id: 'camera',
    title: 'Camera Glass / Sensor Module',
    deviceType: 'mobile',
    category: 'camera',
    icon: Camera,
    description: 'Replace scratched camera glass or fix autofocus blur and sensor jitter.',
    startingPrice: 699,
    time: '35 mins express',
    warranty: '6 Months'
  },
  {
    id: 'back-glass',
    title: 'Back Glass / Housing Replacement',
    deviceType: 'mobile',
    category: 'body',
    icon: RotateCcw,
    description: 'Laser back glass removal and replacement restored to pristine factory finish.',
    startingPrice: 899,
    time: '40 mins express',
    warranty: '3 Months'
  },
  {
    id: 'laptop-screen',
    title: 'Laptop Display & Hinge Repair',
    deviceType: 'laptop',
    category: 'screen',
    icon: Laptop,
    description: 'FHD/IPS laptop screen replacement, loose hinge tightening, and bezel restoration.',
    startingPrice: 2499,
    time: '45 mins express',
    warranty: '6 Months'
  },
  {
    id: 'laptop-keyboard',
    title: 'Laptop Keyboard & Trackpad Repair',
    deviceType: 'laptop',
    category: 'body',
    icon: Wrench,
    description: 'Fix non-responsive keys, spill-damaged keyboards, and sticky trackpads.',
    startingPrice: 1199,
    time: '40 mins express',
    warranty: '6 Months'
  },
  {
    id: 'laptop-battery',
    title: 'Laptop Battery Replacement',
    deviceType: 'laptop',
    category: 'battery',
    icon: Battery,
    description: 'Certified OEM laptop battery replacement with 4-6 hours active backup.',
    startingPrice: 1899,
    time: '30 mins express',
    warranty: '12 Months'
  },
  {
    id: 'tablet-screen',
    title: 'iPad & Tablet Touch Digitizer',
    deviceType: 'tablet',
    category: 'screen',
    icon: Tablet,
    description: 'Precision laminated digitizer and glass replacement for Apple iPad and Galaxy Tab.',
    startingPrice: 1999,
    time: '60 mins express',
    warranty: '6 Months'
  }
];

const BRANDS_LIST = [
  'Apple',
  'Samsung',
  'OnePlus',
  'Xiaomi',
  'Vivo',
  'Oppo',
  'Realme',
  'HP',
  'Dell',
  'Lenovo'
];

export default function RepairPage() {
  const [selectedDeviceType, setSelectedDeviceType] = useState<'all' | 'mobile' | 'laptop' | 'tablet'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(4000);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingModalService, setBookingModalService] = useState<RepairService | null>(null);
  const [pincode, setPincode] = useState('800001');
  const [phone, setPhone] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredServices = useMemo(() => {
    return ALL_SERVICES.filter((svc) => {
      const matchesType = selectedDeviceType === 'all' || svc.deviceType === selectedDeviceType;
      const matchesCategory = selectedCategory === 'all' || svc.category === selectedCategory;
      const matchesPrice = svc.startingPrice <= maxPrice;
      const matchesSearch =
        !searchQuery.trim() ||
        svc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        svc.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesCategory && matchesPrice && matchesSearch;
    });
  }, [selectedDeviceType, selectedCategory, maxPrice, searchQuery]);

  const resetFilters = () => {
    setSelectedDeviceType('all');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMaxPrice(4000);
    setSearchQuery('');
  };

  const isFiltered =
    selectedDeviceType !== 'all' ||
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    maxPrice !== 4000 ||
    searchQuery.trim() !== '';

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    setIsBooked(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Wrench className="w-3.5 h-3.5" />
            <span>Certified Gadget Repair Service</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Fast, Certified <span className="text-emerald-600">Device Repair</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Screen, battery, and camera replacements performed by certified engineers within 30 minutes with up to 12 months warranty.
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
            <span>Filter Repairs</span>
            {isFiltered && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
          </button>
        </div>
      </div>

      {/* 4.1 Interactive Smartphone Anatomy Fault Selector */}
      <RepairFaultSelector />

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Side Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-24 space-y-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <span>Repair Filters</span>
              </div>
              {isFiltered && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-orange-600 hover:underline font-semibold cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Search Issue</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. screen, battery, jack..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Device Type Facet */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Device Type</label>
              <div className="space-y-1">
                {[
                  { id: 'all', label: 'All Devices', icon: Wrench },
                  { id: 'mobile', label: 'Mobile Phones', icon: Smartphone },
                  { id: 'laptop', label: 'Laptops', icon: Laptop },
                  { id: 'tablet', label: 'iPads & Tablets', icon: Tablet }
                ].map((d) => {
                  const Icon = d.icon;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDeviceType(d.id as any)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                        selectedDeviceType === d.id
                          ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{d.label}</span>
                      </span>
                      {selectedDeviceType === d.id && <Check className="w-3 h-3 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Repair Category Facet */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Common Issues</label>
              <div className="space-y-1 text-xs">
                {[
                  { id: 'all', label: 'All Issues' },
                  { id: 'screen', label: '📱 Screen Replacement' },
                  { id: 'battery', label: '🔋 Battery Issue' },
                  { id: 'charging', label: '⚡ Charging Port' },
                  { id: 'audio', label: '🔊 Mic & Speaker' },
                  { id: 'camera', label: '📷 Camera Glass' },
                  { id: 'body', label: '🔄 Back Glass & Body' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.id && <Check className="w-3 h-3 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Compatibility Facet */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Brand</label>
              <div className="flex flex-wrap gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedBrand('all')}
                  className={`px-2 py-1 rounded-md text-xs font-medium border ${
                    selectedBrand === 'all'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All
                </button>
                {BRANDS_LIST.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBrand(b)}
                    className={`px-2 py-1 rounded-md text-xs font-medium border ${
                      selectedBrand === b
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Budget Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Max Budget</span>
                <span className="text-emerald-700">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={500}
                max={4000}
                step={200}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                <span>₹500</span>
                <span>₹4,000+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content Area: Available Repair Services */}
        <main className="lg:col-span-3 space-y-6">
          {/* Active Chips Bar */}
          {isFiltered && (
            <div className="flex flex-wrap items-center gap-1.5 p-3 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
              <span className="text-xs font-semibold text-slate-400">Filters:</span>
              {selectedDeviceType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span>Device: {selectedDeviceType}</span>
                  <button type="button" onClick={() => setSelectedDeviceType('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span>Issue: {selectedCategory}</span>
                  <button type="button" onClick={() => setSelectedCategory('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedBrand !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span>Brand: {selectedBrand}</span>
                  <button type="button" onClick={() => setSelectedBrand('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-orange-600 hover:underline font-semibold ml-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((svc) => {
              const Icon = svc.icon;
              return (
                <div
                  key={svc.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-emerald-300 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-medium">Starting at</span>
                        <div className="text-base font-black text-emerald-700">
                          ₹{svc.startingPrice.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{svc.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{svc.description}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{svc.time}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setBookingModalService(svc)}
                      className="px-4 py-1.5 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>Book Service</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">6–12 Months Warranty</div>
                <div className="text-[11px] text-slate-500">Free replacement for defects</div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">30-Minute Turnaround</div>
                <div className="text-[11px] text-slate-500">Repaired right at your door</div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-purple-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">No Fix, No Fee</div>
                <div className="text-[11px] text-slate-500">100% transparent pricing</div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Booking Modal */}
      {bookingModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Schedule Device Repair</h3>
                <p className="text-xs text-slate-500">{bookingModalService.title}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setBookingModalService(null);
                  setIsBooked(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isBooked ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Repair Appointment Confirmed!</h4>
                <p className="text-xs text-slate-500">
                  Our certified technician will call you within 15 minutes to confirm the technician arrival time at PIN {pincode}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setBookingModalService(null);
                    setIsBooked(false);
                  }}
                  className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Your Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10-digit mobile"
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Service PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 800001"
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                  <span>Starting Quote:</span>
                  <strong className="text-sm font-black">₹{bookingModalService.startingPrice.toLocaleString()}</strong>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Confirm Doorstep Technician
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
