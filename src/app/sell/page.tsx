'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BRANDS, MODELS } from '@/lib/db/data';
import {
  Search,
  ArrowRight,
  Sparkles,
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  SlidersHorizontal,
  RotateCcw,
  Check,
  X,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { DeviceDiagnosticWizard } from '@/components/sell/DeviceDiagnosticWizard';
import { PriceLockBanner } from '@/components/sell/PriceLockBanner';

function SellCatalogContent() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get('brand') || 'all';

  const [selectedCategory, setSelectedCategory] = useState<'phone' | 'laptop' | 'tablet' | 'watch'>('phone');
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [minPrice, setMinPrice] = useState<number>(5000);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'valuation-desc' | 'valuation-asc' | 'popular'>('valuation-desc');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [diagnosticModal, setDiagnosticModal] = useState<{
    isOpen: boolean;
    model: any | null;
  }>({ isOpen: false, model: null });
  const [lockedOffer, setLockedOffer] = useState<{
    price: number;
    modelName: string;
  } | null>(null);

  const filteredModels = useMemo(() => {
    return MODELS.filter((model) => {
      const matchesCategory = selectedCategory === 'phone' || model.category === selectedCategory;
      const matchesBrand = selectedBrand === 'all' || model.brandId.toLowerCase() === selectedBrand.toLowerCase();
      const matchesSearch = !searchQuery.trim() || model.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const maxVal = Math.max(...model.variants.map((v) => v.basePrice));
      const matchesPrice = maxVal >= minPrice && maxVal <= maxPrice;

      const matchesYear = selectedYear === 'all' || (model.releaseYear && model.releaseYear.toString() === selectedYear);

      return matchesCategory && matchesBrand && matchesSearch && matchesPrice && matchesYear;
    }).sort((a, b) => {
      const maxA = Math.max(...a.variants.map((v) => v.basePrice));
      const maxB = Math.max(...b.variants.map((v) => v.basePrice));
      if (sortBy === 'valuation-desc') return maxB - maxA;
      if (sortBy === 'valuation-asc') return maxA - maxB;
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    });
  }, [selectedCategory, selectedBrand, searchQuery, minPrice, maxPrice, selectedYear, sortBy]);

  const resetAllFilters = () => {
    setSelectedBrand('all');
    setSelectedCategory('phone');
    setSearchQuery('');
    setMinPrice(5000);
    setMaxPrice(100000);
    setSelectedYear('all');
    setSortBy('valuation-desc');
  };

  const isFiltered =
    selectedBrand !== 'all' ||
    selectedCategory !== 'phone' ||
    searchQuery.trim() !== '' ||
    minPrice !== 5000 ||
    maxPrice !== 100000 ||
    selectedYear !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Instant Valuation & Doorstep Pickup</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Sell Old Phone for Instant Cash
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Choose your device model, answer 4 quick condition questions, and get cash at your doorstep.
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
            <span>Filters</span>
            {isFiltered && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid with Left Filter Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-24 space-y-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <span>Filters</span>
              </div>
              {isFiltered && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Search Device</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. iPhone 14, S23..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
              <div className="space-y-1">
                {[
                  { id: 'phone', label: '📱 Mobile Phones', active: true },
                  { id: 'laptop', label: '💻 Laptops (Phase 2)', active: false },
                  { id: 'tablet', label: '📲 Tablets (Phase 2)', active: false },
                  { id: 'watch', label: '⌚ Smartwatches (Phase 2)', active: false }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    disabled={!cat.active}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                        : cat.active
                        ? 'text-slate-700 hover:bg-slate-50'
                        : 'text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.id && <Check className="w-3 h-3 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Brand</label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => setSelectedBrand('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
                    selectedBrand === 'all'
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Brands</span>
                  <span className="text-[10px] text-slate-400">({MODELS.length})</span>
                </button>
                {BRANDS.map((brand) => {
                  const count = MODELS.filter((m) => m.brandId.toLowerCase() === brand.id.toLowerCase()).length;
                  return (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() => setSelectedBrand(brand.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
                        selectedBrand === brand.id
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{brand.logo}</span>
                        <span>{brand.name}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Valuation Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Max Valuation</span>
                <span className="text-emerald-700">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={100000}
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                <span>₹10,000</span>
                <span>₹1,00,000</span>
              </div>
            </div>

            {/* Release Year Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Release Year</label>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {['all', '2023', '2022', '2021'].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setSelectedYear(yr)}
                    className={`py-1.5 px-2 rounded-lg text-center font-medium border text-xs transition ${
                      selectedYear === yr
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {yr === 'all' ? 'All Years' : yr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content Area: Models Feed */}
        <main className="lg:col-span-3 space-y-4">
          {lockedOffer && (
            <PriceLockBanner price={lockedOffer.price} modelName={lockedOffer.modelName} />
          )}

          {/* Active Filter Chips & Sort Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-medium text-slate-600">
              Showing <strong className="text-slate-900">{filteredModels.length}</strong> devices available for sell
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-slate-400" />
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="valuation-desc">Highest Valuation First</option>
                <option value="valuation-asc">Lowest Valuation First</option>
                <option value="popular">Most Popular Devices</option>
              </select>
            </div>
          </div>

          {/* Active Chips Row */}
          {isFiltered && (
            <div className="flex flex-wrap items-center gap-1.5 py-1">
              <span className="text-xs font-semibold text-slate-400">Active:</span>
              {selectedBrand !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span>Brand: {selectedBrand}</span>
                  <button type="button" onClick={() => setSelectedBrand('all')} className="hover:text-emerald-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {maxPrice < 100000 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span>Up to ₹{maxPrice.toLocaleString()}</span>
                  <button type="button" onClick={() => setMaxPrice(100000)} className="hover:text-emerald-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedYear !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span>Year: {selectedYear}</span>
                  <button type="button" onClick={() => setSelectedYear('all')} className="hover:text-emerald-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs text-orange-600 hover:underline font-semibold ml-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Models Grid */}
          {filteredModels.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
              <Smartphone className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No matching models found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your search query or expanding the price range slider.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
              {filteredModels.map((model) => {
                const maxVal = Math.max(...model.variants.map((v) => v.basePrice));

                return (
                  <Link
                    key={model.id}
                    href={`/sell/${model.slug}`}
                    className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-400 transition flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div>
                      {/* Image Container */}
                      <div className="aspect-square rounded-2xl bg-slate-50 p-4 mb-3 flex items-center justify-center overflow-hidden border border-slate-100">
                        <img
                          src={model.imageUrl}
                          alt={model.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                        />
                      </div>

                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {model.brandId}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5 group-hover:text-emerald-700 transition">
                        {model.name}
                      </h3>
                      {model.releaseYear && (
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Released: {model.releaseYear}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Get up to</span>
                        <span className="text-sm font-black text-emerald-700">
                          ₹{maxVal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDiagnosticModal({ isOpen: true, model });
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-[11px] font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Diagnose</span>
                        </button>
                        <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-slate-600 transition shrink-0">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Bottom Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="relative z-10 w-full max-h-[85vh] bg-white rounded-t-3xl p-5 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Filter Devices</h3>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Brand</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBrand('all')}
                  className={`p-2 rounded-xl text-xs font-semibold border ${
                    selectedBrand === 'all' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200'
                  }`}
                >
                  All Brands
                </button>
                {BRANDS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBrand(b.id)}
                    className={`p-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${
                      selectedBrand === b.id ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200'
                    }`}
                  >
                    <span>{b.logo}</span>
                    <span>{b.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Apply ({filteredModels.length} devices)
            </button>
          </div>
        </div>
      )}

      {diagnosticModal.isOpen && diagnosticModal.model && (
        <DeviceDiagnosticWizard
          modelName={diagnosticModal.model.name}
          baseValuation={Math.max(...diagnosticModal.model.variants.map((v: any) => v.basePrice))}
          isOpen={diagnosticModal.isOpen}
          onClose={() => setDiagnosticModal({ isOpen: false, model: null })}
          onComplete={(finalPrice) => {
            setLockedOffer({
              price: finalPrice,
              modelName: diagnosticModal.model.name,
            });
            setDiagnosticModal({ isOpen: false, model: null });
          }}
        />
      )}
    </div>
  );
}

export default function SellCatalogPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-slate-400">Loading catalog...</div>}>
      <SellCatalogContent />
    </Suspense>
  );
}
