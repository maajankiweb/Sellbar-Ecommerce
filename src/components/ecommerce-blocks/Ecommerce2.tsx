'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  Star,
  Check,
  ShieldCheck,
  Sparkles,
  X,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

/* =========================================================================
   ECOMMERCE 2: PRODUCT CATALOG WITH SIDEBAR BRAND FILTER, COLOR SWATCHES & FEATURE CHIPS
   React Bits Pro Block Specification
   ========================================================================= */

export interface CatalogProduct {
  id: string;
  slug?: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  colors: { name: string; hex: string }[];
  features: string[];
  image: string;
  badge?: string;
  inStock: boolean;
}

export interface Ecommerce2Props {
  currentCategory?: string;
  onSelectProduct?: (product: CatalogProduct) => void;
  layout?: 'catalog' | 'related-grid';
  title?: string;
}

const CATALOG_DATA: CatalogProduct[] = [
  {
    id: 'cat-1',
    slug: 'apple-iphone-14-pro-max',
    name: 'Apple iPhone 14 Pro Max (128GB)',
    brand: 'Apple',
    category: 'Smartphones',
    price: 58999,
    originalPrice: 139900,
    rating: 4.9,
    reviewsCount: 380,
    colors: [
      { name: 'Deep Purple', hex: '#4b384c' },
      { name: 'Space Black', hex: '#1c1c1e' },
      { name: 'Gold', hex: '#fae7cf' },
      { name: 'Silver', hex: '#f2f2f2' },
    ],
    features: ['5G Ready', '120Hz ProMotion', 'Dynamic Island', 'Grade A Superb'],
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    badge: 'Flagship Deal',
    inStock: true,
  },
  {
    id: 'cat-2',
    slug: 'samsung-galaxy-s23-ultra-5g',
    name: 'Samsung Galaxy S23 Ultra 5G (256GB)',
    brand: 'Samsung',
    category: 'Smartphones',
    price: 54999,
    originalPrice: 124999,
    rating: 4.8,
    reviewsCount: 290,
    colors: [
      { name: 'Phantom Black', hex: '#222222' },
      { name: 'Cream', hex: '#fdfbf7' },
      { name: 'Green', hex: '#405043' },
    ],
    features: ['200MP Camera', 'S-Pen Included', '5G Ready', 'Under ₹60k'],
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    badge: 'Popular',
    inStock: true,
  },
  {
    id: 'cat-3',
    slug: 'apple-macbook-air-m2',
    name: 'Apple MacBook Air M2 (8GB / 256GB SSD)',
    brand: 'Apple',
    category: 'Laptops',
    price: 56999,
    originalPrice: 114900,
    rating: 4.9,
    reviewsCount: 512,
    colors: [
      { name: 'Midnight', hex: '#1c2230' },
      { name: 'Starlight', hex: '#f0e6d6' },
      { name: 'Space Grey', hex: '#5f6368' },
    ],
    features: ['Apple M2 Chip', 'Liquid Retina', 'MagSafe 3', '18h Battery'],
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    badge: 'Top Rated',
    inStock: true,
  },
  {
    id: 'cat-4',
    slug: 'oneplus-11-5g',
    name: 'OnePlus 11 5G (16GB / 256GB - Titan Black)',
    brand: 'OnePlus',
    category: 'Smartphones',
    price: 34999,
    originalPrice: 61999,
    rating: 4.7,
    reviewsCount: 240,
    colors: [
      { name: 'Titan Black', hex: '#181818' },
      { name: 'Eternal Green', hex: '#2d4d43' },
    ],
    features: ['Hasselblad Camera', '100W SuperVOOC', '5G Ready', 'Under ₹40k'],
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    badge: 'Best Value',
    inStock: true,
  },
  {
    id: 'cat-5',
    slug: 'google-pixel-7-pro',
    name: 'Google Pixel 7 Pro (128GB - Hazel)',
    brand: 'Google',
    category: 'Smartphones',
    price: 38999,
    originalPrice: 84999,
    rating: 4.6,
    reviewsCount: 195,
    colors: [
      { name: 'Hazel', hex: '#777e74' },
      { name: 'Obsidian', hex: '#212121' },
      { name: 'Snow', hex: '#f8f8f8' },
    ],
    features: ['Google Tensor G2', 'Pure Android', '5x Telephoto', 'Under ₹40k'],
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    inStock: true,
  },
  {
    id: 'cat-6',
    slug: 'apple-ipad-pro-11-m1',
    name: 'Apple iPad Pro 11-inch M1 (128GB WiFi)',
    brand: 'Apple',
    category: 'Tablets',
    price: 43999,
    originalPrice: 71900,
    rating: 4.9,
    reviewsCount: 310,
    colors: [
      { name: 'Space Grey', hex: '#5f6368' },
      { name: 'Silver', hex: '#e8e8e8' },
    ],
    features: ['Apple M1 Chip', '120Hz ProMotion', 'Apple Pencil 2', 'Grade A Superb'],
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    badge: 'Pro Pick',
    inStock: true,
  },
];

const BRANDS = ['All', 'Apple', 'Samsung', 'OnePlus', 'Google'];

const FEATURE_CHIPS = [
  '5G Ready',
  '120Hz ProMotion',
  'Under ₹40k',
  'Grade A Superb',
  'Apple M1/M2',
  'Hasselblad Camera',
];

export function Ecommerce2({
  currentCategory,
  onSelectProduct,
  layout = 'catalog',
  title,
}: Ecommerce2Props = {}) {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'low-high' | 'high-low' | 'rating'>('featured');

  if (layout === 'related-grid') {
    const displayList = CATALOG_DATA.slice(0, 4);
    return (
      <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 lg:p-10 my-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-[#00a599] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00a599]" />
              Certified Recommendations
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              {title || 'Similar & Related Certified Devices'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => router.push('/buy')}
            className="text-xs font-bold text-[#00a599] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Explore All Models</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayList.map((p) => {
            const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between hover:shadow-lg transition-all group hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    {p.badge ? (
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                        {p.badge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {p.brand}
                      </span>
                    )}
                    <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">
                      -{discount}%
                    </span>
                  </div>

                  <div className="aspect-square bg-slate-50 rounded-xl p-3 flex items-center justify-center overflow-hidden mb-3 relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 mb-2">
                    {p.colors.map((c) => (
                      <span
                        key={c.name}
                        className="w-3 h-3 rounded-full border border-slate-300 shadow-2xs"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>

                  <h3
                    className="font-bold text-xs sm:text-[13px] text-slate-900 leading-snug line-clamp-2 min-h-[34px] group-hover:text-[#00a599] transition-colors"
                    title={p.name}
                  >
                    {p.name}
                  </h3>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.features.slice(0, 2).map((feat) => (
                      <span
                        key={feat}
                        className="text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-black text-slate-950 text-sm">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-slate-400 line-through text-[10px]">
                        ₹{p.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{p.rating}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectProduct) {
                        onSelectProduct(p);
                      } else if (p.slug) {
                        router.push(`/buy/${p.slug}`);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-[#00a599] text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                  >
                    View Model
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Toggle Feature Chip
  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  // Reset Filters
  const resetFilters = () => {
    setSelectedBrand('All');
    setSelectedColor(null);
    setSelectedChips([]);
    setSearchQuery('');
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return CATALOG_DATA.filter((item) => {
      // Brand Filter
      if (selectedBrand !== 'All' && item.brand !== selectedBrand) return false;

      // Color Filter
      if (selectedColor && !item.colors.some((c) => c.name === selectedColor)) return false;

      // Feature Chips
      if (selectedChips.length > 0) {
        const hasAllChips = selectedChips.every((chip) =>
          item.features.some((f) => f.toLowerCase().includes(chip.toLowerCase()))
        );
        if (!hasAllChips) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'low-high') return a.price - b.price;
      if (sortBy === 'high-low') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
  }, [selectedBrand, selectedColor, selectedChips, searchQuery, sortBy]);

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-8 lg:p-10 my-6 space-y-6">
      {/* SECTION HEADER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold text-[#00a599] uppercase tracking-wider">
            Ecommerce 2 Block • Certified Recommerce
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Refurbished Catalog & Brand Filters
          </h2>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search devices..."
              className="pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00a599]/30 focus:border-[#00a599] w-48 sm:w-60"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="featured">Featured Deals</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="rating">Top Customer Rating</option>
          </select>
        </div>
      </div>

      {/* FEATURE CHIPS ROW */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter Chips:
        </span>
        {FEATURE_CHIPS.map((chip) => {
          const active = selectedChips.includes(chip);
          return (
            <button
              key={chip}
              type="button"
              onClick={() => toggleChip(chip)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                active
                  ? 'bg-slate-900 text-white shadow-xs scale-102'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              {chip}
            </button>
          );
        })}

        {(selectedBrand !== 'All' || selectedColor || selectedChips.length > 0 || searchQuery) && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-bold text-rose-600 hover:underline shrink-0 ml-2 cursor-pointer flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Clear all
          </button>
        )}
      </div>

      {/* MAIN LAYOUT: SIDEBAR BRAND FILTER (Left) + PRODUCT GRID (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* =================================================================
            LEFT SIDEBAR FILTERS (3 Cols)
            ================================================================= */}
        <aside className="lg:col-span-3 space-y-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 h-fit">
          {/* Brand Filter List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Brands
              </span>
              <span className="text-[11px] text-slate-400">
                {CATALOG_DATA.length} models
              </span>
            </div>

            <div className="space-y-1">
              {BRANDS.map((b) => {
                const count =
                  b === 'All'
                    ? CATALOG_DATA.length
                    : CATALOG_DATA.filter((p) => p.brand === b).length;

                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBrand(b)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                      selectedBrand === b
                        ? 'bg-[#00a599] text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200/60'
                    }`}
                  >
                    <span>{b}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                        selectedBrand === b ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Swatches Filter */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Color Swatches
              </span>
              {selectedColor && (
                <button
                  type="button"
                  onClick={() => setSelectedColor(null)}
                  className="text-[10px] font-bold text-rose-600 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Space Black', hex: '#1c1c1e' },
                { name: 'Deep Purple', hex: '#4b384c' },
                { name: 'Silver', hex: '#e2e8f0' },
                { name: 'Midnight', hex: '#1c2230' },
                { name: 'Gold', hex: '#fae7cf' },
                { name: 'Hazel', hex: '#777e74' },
              ].map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(selectedColor === c.name ? null : c.name)}
                  title={c.name}
                  className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer relative flex items-center justify-center ${
                    selectedColor === c.name
                      ? 'border-[#00a599] scale-110 shadow-sm ring-2 ring-[#00a599]/30'
                      : 'border-slate-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {selectedColor === c.name && (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        c.hex === '#fae7cf' || c.hex === '#e2e8f0' ? 'text-black' : 'text-white'
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Reassurance Badge */}
          <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-1.5 text-xs text-slate-600">
            <div className="font-bold text-slate-900 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SELBAR Guarantee</span>
            </div>
            <p className="text-[11px] leading-tight text-slate-500">
              1-year official warranty, 32-point QC checklist, and 15-day return window on every unit.
            </p>
          </div>
        </aside>

        {/* =================================================================
            RIGHT PRODUCT GRID (9 Cols)
            ================================================================= */}
        <main className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-200 rounded-3xl space-y-3">
              <p className="text-sm font-bold text-slate-700">No products match your filter criteria.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((p) => {
                const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between hover:shadow-lg transition-all group hover:-translate-y-0.5"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-2">
                        {p.badge ? (
                          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                            {p.badge}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {p.brand}
                          </span>
                        )}
                        <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">
                          -{discount}%
                        </span>
                      </div>

                      {/* Product Thumbnail with Color Swatches */}
                      <div className="aspect-square bg-slate-50 rounded-xl p-3 flex items-center justify-center overflow-hidden mb-3 relative">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Color Dots */}
                      <div className="flex items-center gap-1.5 mb-2">
                        {p.colors.map((c) => (
                          <span
                            key={c.name}
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>

                      {/* Title */}
                      <h3
                        className="font-bold text-xs sm:text-[13px] text-slate-900 leading-snug line-clamp-2 min-h-[34px] group-hover:text-[#00a599] transition-colors"
                        title={p.name}
                      >
                        {p.name}
                      </h3>

                      {/* Feature Chips */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.features.slice(0, 2).map((feat) => (
                          <span
                            key={feat}
                            className="text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-black text-slate-950 text-sm sm:text-base">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-slate-400 line-through text-[11px]">
                            ₹{p.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{p.rating}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectProduct) {
                            onSelectProduct(p);
                          } else if (p.slug) {
                            router.push(`/buy/${p.slug}`);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-[#00a599] text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                      >
                        Buy Model
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Ecommerce2;
