'use client';

import React, { useState, useMemo } from 'react';
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
  Filter,
} from 'lucide-react';
import { DeviceDiagnosticWizard } from '@/components/sell/DeviceDiagnosticWizard';
import { PriceLockBanner } from '@/components/sell/PriceLockBanner';

export function SellCatalogContent() {
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
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySent, setNotifySent] = useState(false);

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
      return 0;
    });
  }, [selectedCategory, selectedBrand, searchQuery, minPrice, maxPrice, selectedYear, sortBy]);

  const activeBrands = useMemo(() => {
    return BRANDS.filter((b) => selectedCategory === 'phone' || b.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Banner & Value Proposition */}
      <div className="relative rounded-3xl bg-linear-to-r from-emerald-800 via-teal-800 to-slate-900 p-8 sm:p-12 text-white overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-xs border border-emerald-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Valuation &amp; Doorstep Cash</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Sell Old Phone for <span className="text-emerald-400">Instant Cash</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Select your phone brand and model, complete our quick transparent questionnaire, and lock your price with free doorstep pickup across India.
          </p>
        </div>
      </div>

      {/* Price Lock Sticky Banner if available */}
      {lockedOffer && (
        <PriceLockBanner
          modelName={lockedOffer.modelName}
          price={lockedOffer.price}
        />
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'phone', label: 'Mobile Phones', icon: Smartphone },
          { id: 'laptop', label: 'Laptops (Coming Soon)', icon: Laptop },
          { id: 'tablet', label: 'Tablets (Coming Soon)', icon: Tablet },
          { id: 'watch', label: 'Smartwatches (Coming Soon)', icon: Watch },
        ].map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {selectedCategory !== 'phone' ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center max-w-xl mx-auto space-y-4 my-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 capitalize">
            Sell {selectedCategory}s — Coming Soon
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            We are currently optimizing doorstep diagnostic inspection and dedicated technician routes for {selectedCategory}s. Enter your email to be notified when doorstep pickup launches!
          </p>
          {notifySent ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
              ✓ Thank you! We will notify you as soon as {selectedCategory} buyback launches.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (notifyEmail.trim()) setNotifySent(true);
              }}
              className="flex gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-600"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
              >
                Notify Me
              </button>
            </form>
          )}
        </div>
      ) : (
        <>
          {/* Brand Grid Selector */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Brand
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-8 gap-3">
              <button
                onClick={() => setSelectedBrand('all')}
                className={`p-3 rounded-2xl border text-center font-bold text-xs transition ${
                  selectedBrand === 'all'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                All Brands
              </button>
              {activeBrands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrand(brand.id)}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs transition flex flex-col items-center justify-center gap-1.5 ${
                    selectedBrand === brand.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span>{brand.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Models Grid & Search */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search phone model (e.g. iPhone 14, S23 Ultra)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs placeholder:text-slate-400 focus:outline-emerald-500"
                />
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Showing <span className="font-bold text-slate-900">{filteredModels.length}</span> models
              </div>
            </div>

            {/* Model Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredModels.map((model) => {
                const maxValuation = Math.max(...model.variants.map((v) => v.basePrice));
                return (
                  <div
                    key={model.id}
                    onClick={() => setDiagnosticModal({ isOpen: true, model })}
                    className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs hover:shadow-lg transition cursor-pointer group flex flex-col justify-between space-y-3"
                  >
                    <div className="aspect-square w-full rounded-2xl bg-slate-50 flex items-center justify-center p-3 overflow-hidden">
                      <img
                        src={(model as any).imageUrl || (model as any).image || '/images/devices/placeholder.svg'}
                        alt={model.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition line-clamp-1">
                        {model.name}
                      </h3>
                      <div className="text-[11px] text-slate-500">
                        Get up to <span className="font-bold text-emerald-700">₹{maxValuation.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <span>Get Value</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
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

export default SellCatalogContent;
