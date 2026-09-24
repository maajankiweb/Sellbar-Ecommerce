'use client';

import React, { useState, useMemo, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { REFURB_PRODUCTS, BRANDS } from '@/lib/db/data';
import { ConditionGrade } from '@/types';
import ProductComparisonModal from '@/components/buy/ProductComparisonModal';
import { GradeVisualizerModal } from '@/components/buy/GradeVisualizerModal';
import { DiagnosticScorecardModal } from '@/components/buy/DiagnosticScorecardModal';
import { EmiExchangeCalculator } from '@/components/buy/EmiExchangeCalculator';
import ScarcityViewerBadge from '@/components/buy/ScarcityViewerBadge';
import {
  Sparkles,
  ShieldCheck,
  Star,
  Search,
  Filter,
  Check,
  ArrowRight,
  SlidersHorizontal,
  RotateCcw,
  Scale,
  Heart,
  HardDrive,
  Cpu,
  Calculator,
  ClipboardCheck,
  HelpCircle,
} from 'lucide-react';

function BuyCatalogContent() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get('brand') || 'all';
  const initialCategory = searchParams.get('category') || 'all';

  const [productsList, setProductsList] = useState<any[]>(REFURB_PRODUCTS);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedGrade, setSelectedGrade] = useState<ConditionGrade | 'all'>('all');
  const [selectedStorage, setSelectedStorage] = useState<string>('all');
  const [selectedRam, setSelectedRam] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Comparison State
  const [compareItems, setCompareItems] = useState<any[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // New Modals State (3.1, 3.2, 3.3)
  const [gradeModalProduct, setGradeModalProduct] = useState<string | null>(null);
  const [diagnosticProduct, setDiagnosticProduct] = useState<string | null>(null);
  const [emiCalculatorData, setEmiCalculatorData] = useState<{ name: string; price: number } | null>(null);

  // Wishlist State (LocalStorage)
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('selbar_wishlist');
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      try {
        localStorage.setItem('selbar_wishlist', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const toggleCompare = (prod: any) => {
    setCompareItems((prev) => {
      const exists = prev.some((p) => p.id === prod.id);
      if (exists) {
        return prev.filter((p) => p.id !== prod.id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 devices at a time');
        return prev;
      }
      return [...prev, prod];
    });
  };

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch('/api/v1/products');
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setProductsList(data.data);
        }
      } catch {
        // keep initial REFURB_PRODUCTS
      }
    }
    loadCatalog();
  }, []);

  const CATEGORIES = [
    { id: 'all', label: 'All Gadgets', count: productsList.length },
    { id: 'new-phone', label: '📱 New Phones', count: productsList.filter((p) => p.categoryGroup === 'new-phone' || p.category === 'new-phone').length },
    { id: 'old-phone', label: '🔄 Old Phones (Refurbished)', count: productsList.filter((p) => p.categoryGroup === 'old-phone' || p.category === 'old-phone' || (!p.categoryGroup && (p.category === 'phone' || !p.category))).length },
    { id: 'new-laptop', label: '💻 New Laptops', count: productsList.filter((p) => p.categoryGroup === 'new-laptop' || p.category === 'new-laptop').length },
    { id: 'old-laptop', label: '🔄 Old Laptops (Refurbished)', count: productsList.filter((p) => p.categoryGroup === 'old-laptop' || p.category === 'old-laptop' || p.category === 'laptop').length },
    { id: 'tablet', label: '📲 Tablets & iPads', count: productsList.filter((p) => p.category === 'tablet' || p.categoryGroup === 'tablet').length },
    { id: 'smartwatch', label: '⌚ Smartwatches', count: productsList.filter((p) => p.category === 'smartwatch' || p.categoryGroup === 'smartwatch').length },
    { id: 'cameras', label: '📷 Cameras & Lenses', count: productsList.filter((p) => p.category === 'cameras' || p.categoryGroup === 'cameras').length },
    { id: 'gaming', label: '🎮 Gaming Consoles', count: productsList.filter((p) => p.category === 'gaming' || p.categoryGroup === 'gaming').length },
    { id: 'accessories', label: '🔌 New Accessories', count: productsList.filter((p) => p.category === 'accessories' || p.categoryGroup === 'accessories').length },
    { id: 'new-desktop', label: '🖥️ Desktops & PCs', count: productsList.filter((p) => p.categoryGroup === 'new-desktop' || p.category === 'new-desktop' || p.categoryGroup === 'old-desktop').length },
  ];

  const filteredProducts = useMemo(() => {
    return productsList
      .filter((prod) => {
        const matchesBrand =
          selectedBrand === 'all' || prod.brand.toLowerCase() === selectedBrand.toLowerCase();
        const matchesSearch =
          !searchQuery.trim() || prod.name.toLowerCase().includes(searchQuery.toLowerCase());
        const topGrade = prod.grades?.[0] || { price: prod.price || 0, grade: 'superb' };
        const matchesPrice = (topGrade.price || prod.price || 0) <= maxPrice;
        const matchesGrade =
          selectedGrade === 'all' || prod.grades?.some((g: any) => g.grade === selectedGrade);

        const matchesCategory =
          selectedCategory === 'all' ||
          prod.categoryGroup === selectedCategory ||
          (selectedCategory === 'old-phone' && (!prod.categoryGroup && prod.category === 'phone')) ||
          prod.category === selectedCategory;

        const matchesStorage =
          selectedStorage === 'all' ||
          (prod.specs?.storage && prod.specs.storage.includes(selectedStorage));

        const matchesRam =
          selectedRam === 'all' ||
          (prod.specs?.ram && prod.specs.ram.includes(selectedRam));

        return matchesBrand && matchesSearch && matchesPrice && matchesGrade && matchesCategory && matchesStorage && matchesRam;
      })
      .sort((a, b) => {
        const priceA = a.grades?.[0]?.price || a.price || 0;
        const priceB = b.grades?.[0]?.price || b.price || 0;
        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [productsList, selectedBrand, selectedCategory, searchQuery, maxPrice, selectedGrade, selectedStorage, selectedRam, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Product Comparison Modal */}
      <ProductComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        products={compareItems}
        onRemoveProduct={(id) => setCompareItems((prev) => prev.filter((p) => p.id !== id))}
      />

      {/* 3.1 360° Cosmetic Grade Visualizer Modal */}
      <GradeVisualizerModal
        isOpen={!!gradeModalProduct}
        onClose={() => setGradeModalProduct(null)}
        productName={gradeModalProduct || 'Selected Smartphone'}
      />

      {/* 3.2 32-Point Diagnostic Scorecard Modal */}
      <DiagnosticScorecardModal
        isOpen={!!diagnosticProduct}
        onClose={() => setDiagnosticProduct(null)}
        productName={diagnosticProduct || 'Selected Smartphone'}
      />

      {/* 3.3 No-Cost EMI & Exchange Calculator Modal */}
      {emiCalculatorData && (
        <EmiExchangeCalculator
          isOpen={!!emiCalculatorData}
          onClose={() => setEmiCalculatorData(null)}
          productName={emiCalculatorData.name}
          price={emiCalculatorData.price}
        />
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-10 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Certified Refurbished Recommerce Store</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Flagship Smartphones & Laptops at Up to 50% Off
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Every device undergoes our certified 32-point hardware and battery health inspection. Backed by 12 months comprehensive warranty and 5 days replacement policy.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-emerald-400 font-semibold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 1-Year SELBAR Warranty
            </span>
            <span className="flex items-center gap-1">
              <RotateCcw className="w-4 h-4" /> 5-Day Hassle-Free Replacement
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4" /> 100% Data-Wiped & Sanitized
            </span>
          </div>

          {/* Quick Explainer Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <button
              onClick={() => setGradeModalProduct('SELBAR Device Grade Guide')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition border border-white/10"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cosmetic Grade Visualizer (A / B / C)</span>
            </button>
            <button
              onClick={() => setDiagnosticProduct('SELBAR Certified Quality Check')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition border border-white/10"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sample 32-Point Diagnostic Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs h-fit space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>Filters</span>
            </div>
            <button
              onClick={() => {
                setSelectedBrand('all');
                setSelectedGrade('all');
                setSelectedStorage('all');
                setSelectedRam('all');
                setMaxPrice(150000);
                setSearchQuery('');
              }}
              className="text-xs text-slate-400 hover:text-emerald-600 font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Search Model</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phone or laptop..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Category</label>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[10px] text-slate-400">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Brand</label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              <button
                onClick={() => setSelectedBrand('all')}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedBrand === 'all'
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Brands
              </button>
              {BRANDS.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrand(brand.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                    selectedBrand === brand.id
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{brand.logo}</span>
                  <span>{brand.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Condition Grade Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Condition Grade</label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {(['all', 'superb', 'good', 'fair'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`py-1.5 px-2 rounded-xl text-center font-bold capitalize transition ${
                    selectedGrade === g
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Storage Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Storage Capacity</label>
            <div className="flex flex-wrap gap-1 text-xs">
              {['all', '64GB', '128GB', '256GB', '512GB', '1TB'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStorage(st)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                    selectedStorage === st
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* RAM Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">RAM</label>
            <div className="flex flex-wrap gap-1 text-xs">
              {['all', '4GB', '6GB', '8GB', '12GB', '16GB'].map((ram) => (
                <button
                  key={ram}
                  onClick={() => setSelectedRam(ram)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                    selectedRam === ram
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {ram.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
              <span>Max Price</span>
              <span className="text-emerald-700 font-extrabold">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={15000}
              max={150000}
              step={5000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹15,000</span>
              <span>₹150,000+</span>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Category Horizontal Quick Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          {/* Top Sort & Count Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-700">
              Showing <span className="text-emerald-700 font-extrabold">{filteredProducts.length}</span> devices in catalog
            </span>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 text-xs focus:outline-none"
              >
                <option value="featured">Featured Deals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No refurbished devices match your filters</h3>
              <p className="text-xs text-slate-500 mt-1">Try expanding the price range or resetting filters.</p>
              <button
                onClick={() => {
                  setSelectedBrand('all');
                  setMaxPrice(150000);
                  setSelectedGrade('all');
                  setSelectedStorage('all');
                  setSelectedRam('all');
                }}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => {
                const topGrade = prod.grades?.[0] || {
                  price: prod.price || 0,
                  originalMrp: prod.originalMrp || prod.price || 0,
                  grade: prod.conditionType === 'new' ? 'brand-new' : 'superb',
                };
                const price = topGrade.price || prod.price || 0;
                const originalMrp = topGrade.originalMrp || prod.originalMrp || price;
                const discount =
                  originalMrp > price ? Math.round(((originalMrp - price) / originalMrp) * 100) : 0;
                const img =
                  prod.images?.[0] ||
                  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800';

                const isWished = wishlist.includes(prod.id);
                const isCompared = compareItems.some((p) => p.id === prod.id);

                return (
                  <div
                    key={prod.id || prod.slug}
                    className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition flex flex-col justify-between overflow-hidden group relative"
                  >
                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(prod.id)}
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white transition"
                    >
                      <Heart className={`w-4 h-4 ${isWished ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    <div>
                      {/* Image & Discount Badge */}
                      <div className="relative aspect-4/3 bg-slate-50 p-6 flex items-center justify-center overflow-hidden border-b border-slate-100">
                        <img
                          src={img}
                          alt={prod.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                        />
                        {discount > 0 && (
                          <div className="absolute top-3 left-3 bg-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                            {discount}% OFF
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setGradeModalProduct(prod.name)}
                          className="absolute bottom-3 left-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase transition flex items-center gap-1 shadow-xs"
                          title="Click to view 360° Cosmetic Grade guide"
                        >
                          <span>{prod.conditionType === 'new' ? 'Brand New' : `Grade ${topGrade.grade.toUpperCase()}`}</span>
                          <HelpCircle className="w-2.5 h-2.5 text-emerald-600" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2">
                        {/* 3.4 Scarcity & Live Viewer Badge */}
                        <ScarcityViewerBadge productId={prod.id || prod.slug} stockCount={prod.stock || 2} />

                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {prod.brand}
                        </div>
                        <h2 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition line-clamp-1">
                          {prod.name}
                        </h2>

                        <div className="text-xs text-slate-500 flex items-center gap-2">
                          <span>{prod.specs?.storage || 'Standard'}</span>
                          {prod.specs?.ram && (
                            <>
                              <span>•</span>
                              <span>{prod.specs?.ram} RAM</span>
                            </>
                          )}
                        </div>

                        {prod.offerText && (
                          <div className="text-[11px] font-bold text-rose-600 line-clamp-1">
                            🔥 {prod.offerText}
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-slate-800">{prod.rating || 4.8}</span>
                          <span className="text-slate-400">({prod.reviewCount || 10} verified)</span>
                        </div>

                        <div className="pt-2 flex flex-wrap items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                            {prod.warrantyMonths || 12}-Mo Warranty
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[10px]">
                            5-Day Replacement
                          </span>
                        </div>

                        {/* Interactive Micro-Actions (3.2 & 3.3) */}
                        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setDiagnosticProduct(prod.name)}
                            className="inline-flex items-center gap-1 hover:text-emerald-700 font-semibold transition"
                          >
                            <ClipboardCheck className="w-3 h-3 text-emerald-600" />
                            <span>32-Pt QC Report</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEmiCalculatorData({ name: prod.name, price })}
                            className="inline-flex items-center gap-1 hover:text-emerald-700 font-semibold transition"
                          >
                            <Calculator className="w-3 h-3 text-emerald-600" />
                            <span>Calc EMI</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-slate-100 mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-base font-black text-slate-950">
                            ₹{topGrade.price.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-slate-400 line-through">
                            ₹{topGrade.originalMrp.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <Link
                          href={`/buy/${prod.slug}`}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1"
                        >
                          <span>Buy Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {/* Compare Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleCompare(prod)}
                        className={`w-full py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${
                          isCompared
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                        }`}
                      >
                        <Scale className="w-3 h-3" />
                        <span>{isCompared ? 'Added to Compare' : 'Compare Specs'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Compare Tray */}
      {compareItems.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-6 py-3.5 rounded-full shadow-2xl border border-slate-700 flex items-center gap-4 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold">
              Comparing {compareItems.length} {compareItems.length === 1 ? 'device' : 'devices'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-full text-xs font-black transition"
            >
              View Comparison
            </button>
            <button
              onClick={() => setCompareItems([])}
              className="text-xs text-slate-400 hover:text-white transition underline"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuyCatalogPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-slate-400">Loading refurbished store...</div>}>
      <BuyCatalogContent />
    </Suspense>
  );
}
