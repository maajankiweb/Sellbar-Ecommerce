'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingDown,
  Filter,
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck,
  ArrowUpDown,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  Smartphone,
  Info
} from 'lucide-react';

interface ScreenerDevice {
  id: string;
  brand: string;
  model: string;
  image: string;
  originalMrp: number;
  refurbPrice: number;
  sellPrice: number;
  grade: 'SUPERB' | 'GOOD' | 'FAIR';
  storage: string;
  ram: string;
  depreciationPercent: number;
  warrantyMonths: number;
  monthlyTrend: number[]; // 6 months trend
}

const SAMPLE_SCREENER_DEVICES: ScreenerDevice[] = [
  {
    id: 'sc_1',
    brand: 'Apple',
    model: 'iPhone 14',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80',
    originalMrp: 79900,
    refurbPrice: 42999,
    sellPrice: 34500,
    grade: 'SUPERB',
    storage: '128GB',
    ram: '6GB',
    depreciationPercent: 46,
    warrantyMonths: 12,
    monthlyTrend: [48000, 46500, 45000, 44000, 43500, 42999],
  },
  {
    id: 'sc_2',
    brand: 'Apple',
    model: 'iPhone 13',
    image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500&auto=format&fit=crop&q=80',
    originalMrp: 69900,
    refurbPrice: 34499,
    sellPrice: 26800,
    grade: 'GOOD',
    storage: '128GB',
    ram: '4GB',
    depreciationPercent: 51,
    warrantyMonths: 12,
    monthlyTrend: [41000, 39000, 37500, 36000, 35000, 34499],
  },
  {
    id: 'sc_3',
    brand: 'Samsung',
    model: 'Galaxy S23 5G',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80',
    originalMrp: 74999,
    refurbPrice: 38999,
    sellPrice: 29800,
    grade: 'SUPERB',
    storage: '256GB',
    ram: '8GB',
    depreciationPercent: 48,
    warrantyMonths: 12,
    monthlyTrend: [46000, 44000, 42000, 40500, 39500, 38999],
  },
  {
    id: 'sc_4',
    brand: 'OnePlus',
    model: 'OnePlus 11 5G',
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500&auto=format&fit=crop&q=80',
    originalMrp: 56999,
    refurbPrice: 29999,
    sellPrice: 22500,
    grade: 'GOOD',
    storage: '128GB',
    ram: '8GB',
    depreciationPercent: 47,
    warrantyMonths: 6,
    monthlyTrend: [35000, 33500, 32000, 31000, 30500, 29999],
  },
  {
    id: 'sc_5',
    brand: 'Samsung',
    model: 'Galaxy A54 5G',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    originalMrp: 38999,
    refurbPrice: 18499,
    sellPrice: 13200,
    grade: 'FAIR',
    storage: '128GB',
    ram: '8GB',
    depreciationPercent: 53,
    warrantyMonths: 6,
    monthlyTrend: [22000, 21000, 20000, 19500, 19000, 18499],
  },
  {
    id: 'sc_6',
    brand: 'Xiaomi',
    model: 'Redmi Note 12 Pro+ 5G',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80',
    originalMrp: 29999,
    refurbPrice: 14999,
    sellPrice: 10400,
    grade: 'GOOD',
    storage: '256GB',
    ram: '8GB',
    depreciationPercent: 50,
    warrantyMonths: 6,
    monthlyTrend: [18000, 17200, 16500, 15800, 15300, 14999],
  },
  {
    id: 'sc_7',
    brand: 'Apple',
    model: 'iPhone 12',
    image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&auto=format&fit=crop&q=80',
    originalMrp: 59900,
    refurbPrice: 24999,
    sellPrice: 18500,
    grade: 'FAIR',
    storage: '64GB',
    ram: '4GB',
    depreciationPercent: 58,
    warrantyMonths: 6,
    monthlyTrend: [30000, 28500, 27000, 26000, 25500, 24999],
  },
  {
    id: 'sc_8',
    brand: 'Realme',
    model: 'Realme 11 Pro+ 5G',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80',
    originalMrp: 27999,
    refurbPrice: 13999,
    sellPrice: 9800,
    grade: 'GOOD',
    storage: '256GB',
    ram: '8GB',
    depreciationPercent: 50,
    warrantyMonths: 6,
    monthlyTrend: [17000, 16200, 15500, 14800, 14200, 13999],
  },
];

export default function ScreenerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState(80000);
  const [sortBy, setSortBy] = useState<'discount' | 'priceLow' | 'priceHigh'>('discount');
  const [watchlist, setWatchlist] = useState<string[]>(['sc_1', 'sc_3']);
  const [activeChartDevice, setActiveChartDevice] = useState<ScreenerDevice>(SAMPLE_SCREENER_DEVICES[0]);
  const [isAlertSaved, setIsAlertSaved] = useState(false);

  const toggleWatchlist = (id: string) => {
    setWatchlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredDevices = useMemo(() => {
    return SAMPLE_SCREENER_DEVICES.filter((d) => {
      const matchesSearch =
        d.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand === 'ALL' || d.brand === selectedBrand;
      const matchesGrade = selectedGrade === 'ALL' || d.grade === selectedGrade;
      const matchesPrice = d.refurbPrice <= maxPrice;
      return matchesSearch && matchesBrand && matchesGrade && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'discount') return b.depreciationPercent - a.depreciationPercent;
      if (sortBy === 'priceLow') return a.refurbPrice - b.refurbPrice;
      if (sortBy === 'priceHigh') return b.refurbPrice - a.refurbPrice;
      return 0;
    });
  }, [searchQuery, selectedBrand, selectedGrade, maxPrice, sortBy]);

  const brands = ['ALL', 'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme'];
  const grades = ['ALL', 'SUPERB', 'GOOD', 'FAIR'];

  // SVG Chart Calculation for active device trend
  const chartPoints = useMemo(() => {
    const trend = activeChartDevice.monthlyTrend;
    const min = Math.min(...trend) * 0.95;
    const max = Math.max(...trend) * 1.05;
    const height = 120;
    const width = 360;

    return trend.map((val, idx) => {
      const x = (idx / (trend.length - 1)) * width;
      const y = height - ((val - min) / (max - min)) * height;
      return `${x},${y}`;
    }).join(' ');
  }, [activeChartDevice]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10 max-w-7xl mx-auto">
      {/* Header & Value Proposition */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-time Market Valuation Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Recommerce Screener & Price Trends
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Track real-time smartphone price depreciation, compare doorstep buyback quotes with certified refurbished prices, and identify high-value device upgrades with warranty.
        </p>
      </div>

      {/* Top Analytics Panel (Interactive Visual Trends) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Trend Graph Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Price Depreciation Curve (Last 6 Months)
              </span>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>{activeChartDevice.brand} {activeChartDevice.model}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                  {activeChartDevice.storage}
                </span>
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400">Current Refurb Price</span>
              <div className="text-xl font-extrabold text-emerald-600">
                ₹{activeChartDevice.refurbPrice.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* SVG Trend Curve */}
          <div className="relative pt-6 pb-2">
            <svg viewBox="0 0 360 130" className="w-full h-32 overflow-visible">
              <defs>
                <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Fill area */}
              <polygon
                points={`0,130 ${chartPoints} 360,130`}
                fill="url(#trendGradient)"
              />
              {/* Stroke line */}
              <polyline
                fill="none"
                stroke="#059669"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={chartPoints}
              />
            </svg>
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-2 border-t border-slate-100">
              <span>6 Months Ago</span>
              <span>4 Months Ago</span>
              <span>2 Months Ago</span>
              <span className="text-emerald-700 font-bold">Today (Lowest)</span>
            </div>
          </div>

          {/* Key Value Metrics */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Original MRP</span>
              <div className="text-sm font-bold text-slate-800">
                ₹{activeChartDevice.originalMrp.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
              <span className="text-[10px] text-emerald-800 font-semibold uppercase">Total Saved</span>
              <div className="text-sm font-bold text-emerald-700">
                {activeChartDevice.depreciationPercent}% OFF
              </div>
            </div>
            <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100">
              <span className="text-[10px] text-blue-800 font-semibold uppercase">Doorstep Cash Quote</span>
              <div className="text-sm font-bold text-blue-700">
                ₹{activeChartDevice.sellPrice.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Right Watchlist & Alert Widget (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Bookmark className="w-4 h-4 text-amber-500" />
                <span>Your Saved Watchlist ({watchlist.length})</span>
              </div>
              <span className="text-xs text-slate-400">Live price alerts</span>
            </div>

            <div className="space-y-2">
              {SAMPLE_SCREENER_DEVICES.filter((d) => watchlist.includes(d.id)).map((d) => (
                <div
                  key={d.id}
                  onClick={() => setActiveChartDevice(d)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                    activeChartDevice.id === d.id
                      ? 'border-emerald-600 bg-emerald-50/40'
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{d.model}</div>
                      <div className="text-[10px] text-slate-500">{d.storage} • {d.grade}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-emerald-700">
                      ₹{d.refurbPrice.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold">
                      {d.depreciationPercent}% Saved
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <TrendingDown className="w-4 h-4" />
              <span>Instant Price-Drop Notification</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Get notified via SMS/WhatsApp when price drops on any device in your watchlist.
            </p>
            <button
              onClick={() => setIsAlertSaved(!isAlertSaved)}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                isAlertSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-950 hover:bg-slate-100'
              }`}
            >
              {isAlertSaved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Price Drop Alerts Enabled</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Enable Watchlist Alerts</span>
                </>
              )}
            </button>
          </div>
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
                <span>Screener Filters</span>
              </div>
              {(selectedBrand !== 'ALL' || selectedGrade !== 'ALL' || maxPrice !== 80000 || searchQuery.trim() !== '') && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBrand('ALL');
                    setSelectedGrade('ALL');
                    setMaxPrice(80000);
                    setSearchQuery('');
                  }}
                  className="text-xs text-orange-600 hover:underline font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Search Box */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Search Device</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. iPhone 14, S23..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Brand Facet */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Brand</label>
              <div className="space-y-1">
                {brands.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBrand(b)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
                      selectedBrand === b
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{b === 'ALL' ? 'All Brands' : b}</span>
                    {selectedBrand === b && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Grade Facet */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Condition Grade</label>
              <div className="space-y-1">
                {grades.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGrade(g)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
                      selectedGrade === g
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{g === 'ALL' ? 'All Grades' : `${g} Grade`}</span>
                    {selectedGrade === g && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Max Refurb Price</span>
                <span className="text-emerald-700">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={80000}
                step={2000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                <span>₹10,000</span>
                <span>₹80,000</span>
              </div>
            </div>

            {/* Sort Order Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Sort Criteria</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-500"
              >
                <option value="discount">Highest Savings %</option>
                <option value="priceLow">Price (Low to High)</option>
                <option value="priceHigh">Price (High to Low)</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="lg:col-span-3 space-y-6">

      {/* Screener Devices Data Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Watch</th>
                <th className="py-3.5 px-4">Device Model</th>
                <th className="py-3.5 px-4">Grade & Specs</th>
                <th className="py-3.5 px-4">Original MRP</th>
                <th className="py-3.5 px-4 text-emerald-700">Refurb Price</th>
                <th className="py-3.5 px-4 text-blue-700">Sell Price (Cash)</th>
                <th className="py-3.5 px-4">Savings %</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredDevices.map((device) => {
                const isWatchlisted = watchlist.includes(device.id);
                return (
                  <tr
                    key={device.id}
                    className={`hover:bg-slate-50/80 transition cursor-pointer ${
                      activeChartDevice.id === device.id ? 'bg-emerald-50/30' : ''
                    }`}
                    onClick={() => setActiveChartDevice(device)}
                  >
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(device.id);
                        }}
                        className="p-1 rounded-lg hover:bg-slate-200 transition"
                      >
                        {isWatchlisted ? (
                          <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-950">
                      <div className="flex items-center gap-2">
                        <span>{device.brand} {device.model}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold mr-2 ${
                        device.grade === 'SUPERB'
                          ? 'bg-emerald-100 text-emerald-800'
                          : device.grade === 'GOOD'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {device.grade}
                      </span>
                      <span className="text-slate-500">{device.storage} • {device.ram}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 line-through">
                      ₹{device.originalMrp.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-700">
                      ₹{device.refurbPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-blue-700">
                      ₹{device.sellPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-black text-[11px]">
                        {device.depreciationPercent}% OFF
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/sell?search=${encodeURIComponent(device.model)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-block px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition"
                      >
                        Sell This
                      </Link>
                      <Link
                        href={`/buy?search=${encodeURIComponent(device.model)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-block px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition"
                      >
                        Buy Refurb
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}
