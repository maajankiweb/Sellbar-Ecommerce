'use client';

import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  ChevronDown,
  RotateCcw,
  Truck,
  CheckCircle2,
  Heart,
  Share2,
  Sparkles,
  Layers,
  Battery,
  Zap,
} from 'lucide-react';

/* =========================================================================
   ECOMMERCE 1: PRODUCT PAGE WITH THUMBNAIL RAIL, FIT TOGGLE & ACCORDIONS
   React Bits Pro Block Specification
   ========================================================================= */

interface ProductData {
  title: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  sku: string;
  images: string[];
  grades: {
    id: string;
    label: string;
    price: number;
    badge: string;
    desc: string;
  }[];
  fits: {
    id: string;
    label: string;
    sublabel: string;
  }[];
  accordions: {
    id: string;
    title: string;
    content: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const DEMO_PRODUCT: ProductData = {
  title: 'Apple iPhone 14 Pro (128GB - Deep Purple)',
  brand: 'Apple',
  category: 'Flagship Smartphone',
  price: 48999,
  originalPrice: 119900,
  rating: 4.9,
  reviewsCount: 428,
  sku: 'SLB-IP14P-PUR-128',
  images: [
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=900&auto=format&fit=crop&q=80',
  ],
  grades: [
    {
      id: 'superb',
      label: 'Superb (Grade A)',
      price: 48999,
      badge: 'Most Popular',
      desc: 'Flawless glass, zero dents, 90%+ OEM battery health.',
    },
    {
      id: 'like-new',
      label: 'Like New (Grade A+)',
      price: 52499,
      badge: 'Mint Condition',
      desc: 'Showroom fresh condition, 95%+ battery, pristine chassis.',
    },
    {
      id: 'fair',
      label: 'Fair (Grade B)',
      price: 44999,
      badge: 'Best Value',
      desc: 'Minor hairline micro-scratches on bezel, 100% functional.',
    },
  ],
  fits: [
    { id: '128gb', label: '128GB', sublabel: 'Standard Fit' },
    { id: '256gb', label: '256GB', sublabel: 'Pro Choice' },
    { id: '512gb', label: '512GB', sublabel: 'Creator Max' },
  ],
  accordions: [
    {
      id: 'qc',
      title: '32-Point Diagnostic Test Report',
      icon: ShieldCheck,
      content:
        'Passed rigorous lab examination: TrueTone display calibrated, LiDAR operational, optical camera stabilization verified, FaceID responsive, clean OEM audio transducers, and NIST 800-88 sanitized.',
    },
    {
      id: 'warranty',
      title: '12-Month Comprehensive SELBAR Warranty',
      icon: Sparkles,
      content:
        'Includes 1-year coverage for motherboard, screen components, audio receivers, and battery performance. Free doorstep pickup and priority repair if any hardware defect arises.',
    },
    {
      id: 'shipping',
      title: 'Express Delivery & 15-Day Hassle-Free Returns',
      icon: Truck,
      content:
        'Free 2-hour express delivery in covered districts (Bettiah, Bagaha, Narkatiaganj) and 2-4 days nationwide. Enjoy a 15-day trial period with 100% money-back guarantee.',
    },
    {
      id: 'battery',
      title: 'Battery Health & Packaging Specs',
      icon: Battery,
      content:
        'Certified OEM battery health audited at 92% to 98%. Ships in tamper-proof SELBAR Eco-Kraft recycled box with MFi-certified fast braided charging cable and SIM ejector tool.',
    },
  ],
};

export interface Ecommerce1Props {
  product?: any;
  onAddToCart?: (grade: any, fit: any) => void;
  onBuyNow?: (grade: any, fit: any) => void;
}

export function Ecommerce1({ product, onAddToCart, onBuyNow }: Ecommerce1Props = {}) {
  const currentProduct: ProductData = product
    ? {
        title: product.name || DEMO_PRODUCT.title,
        brand: product.brand || DEMO_PRODUCT.brand,
        category: product.category || DEMO_PRODUCT.category,
        price: product.price || DEMO_PRODUCT.price,
        originalPrice: product.originalMrp || product.price || DEMO_PRODUCT.originalPrice,
        rating: product.rating || 4.9,
        reviewsCount: product.reviewCount || 340,
        sku: product.id || product.slug || 'SELBAR-CERT-01',
        images:
          Array.isArray(product.images) && product.images.length > 0
            ? product.images
            : DEMO_PRODUCT.images,
        grades: Array.isArray(product.grades) && product.grades.length > 0
          ? product.grades.map((g: any) => ({
              id: g.grade || 'superb',
              label: g.title || (g.grade === 'brand-new' ? 'Brand New' : 'Superb (Grade A)'),
              price: g.price || product.price,
              badge: g.grade === 'brand-new' ? 'Sealed Pack' : 'Most Popular',
              desc: g.description || '100% genuine hardware, 32-point QC passed, full warranty.',
            }))
          : DEMO_PRODUCT.grades,
        fits: product.specs?.storage
          ? [
              { id: 'standard', label: product.specs.storage, sublabel: 'Installed Fit' },
              { id: 'high', label: 'Cloud Boost', sublabel: '+2TB Cloud' },
            ]
          : DEMO_PRODUCT.fits,
        accordions: DEMO_PRODUCT.accordions,
      }
    : DEMO_PRODUCT;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedGrade, setSelectedGrade] = useState(currentProduct.grades[0].id);
  const [selectedFit, setSelectedFit] = useState(currentProduct.fits[0].id);
  const [openAccordion, setOpenAccordion] = useState<string | null>('qc');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const activeGradeObj =
    currentProduct.grades.find((g) => g.id === selectedGrade) ||
    currentProduct.grades[0];

  const savingsPercent = Math.max(
    0,
    Math.round(
      ((currentProduct.originalPrice - activeGradeObj.price) /
        currentProduct.originalPrice) *
        100
    )
  );

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-8 lg:p-10 my-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* =================================================================
            LEFT RAIL: THUMBNAIL RAIL + HERO GALLERY (5 Cols)
            ================================================================= */}
        <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
          {/* Vertical Thumbnail Rail */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto shrink-0 pb-2 sm:pb-0 scrollbar-none">
            {DEMO_PRODUCT.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(idx)}
                aria-label={`View product image ${idx + 1}`}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-slate-50 cursor-pointer ${
                  selectedImage === idx
                    ? 'border-[#00a599] ring-2 ring-[#00a599]/30 scale-102'
                    : 'border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>

          {/* Main Showcase Hero Image */}
          <div className="relative flex-1 aspect-square rounded-3xl bg-gradient-to-b from-slate-50 to-slate-100/70 border border-slate-200/80 p-6 flex items-center justify-center overflow-hidden group">
            {/* Top Savings & Verified Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black uppercase tracking-wider shadow-sm">
                Save {savingsPercent}%
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-slate-800 border border-slate-200 text-[10px] font-bold shadow-2xs">
                32-Point QC Passed
              </span>
            </div>

            {/* Quick Actions (Wishlist & Share) */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Add to wishlist"
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 text-slate-700 hover:text-rose-600 flex items-center justify-center shadow-xs transition hover:scale-105"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
              </button>
              <button
                type="button"
                aria-label="Share product"
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 text-slate-700 hover:text-slate-950 flex items-center justify-center shadow-xs transition hover:scale-105"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Image Preview with Smooth Hover Lift */}
            <img
              src={currentProduct.images[selectedImage] || currentProduct.images[0]}
              alt={currentProduct.title}
              className="max-h-[85%] max-w-[85%] object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* =================================================================
            RIGHT COLUMN: DETAILS, FIT TOGGLE & ACCORDIONS (6 Cols)
            ================================================================= */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header / Brand / Rating */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#00a599] uppercase tracking-wider mb-1">
                <span>{currentProduct.brand}</span>
                <span>•</span>
                <span>{currentProduct.category}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {currentProduct.title}
              </h1>

              {/* Rating & SKU */}
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-900">{currentProduct.rating}</span>
                  <span className="text-slate-400">({currentProduct.reviewsCount} verified reviews)</span>
                </div>
                <span>•</span>
                <span className="font-mono text-[11px] text-slate-400">SKU: {currentProduct.sku}</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-baseline justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  Refurbished Deal Price
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-slate-950">
                    ₹{activeGradeObj.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-slate-400 line-through">
                    ₹{currentProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-3 py-1.5 rounded-xl">
                Save ₹{(currentProduct.originalPrice - activeGradeObj.price).toLocaleString('en-IN')} ({savingsPercent}% OFF)
              </span>
            </div>

            {/* VARIANT TOGGLE: REFURBISHED GRADE */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Select Condition Grade</span>
                <span className="text-[#00a599] font-medium cursor-pointer hover:underline">
                  32-Point Quality Inspected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {currentProduct.grades.map((grade) => (
                  <button
                    key={grade.id}
                    type="button"
                    onClick={() => setSelectedGrade(grade.id)}
                    className={`p-3 rounded-2xl text-left border-2 transition-all cursor-pointer relative ${
                      selectedGrade === grade.id
                        ? 'border-[#00a599] bg-[#eef7f6] ring-2 ring-[#00a599]/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {grade.label.split('(')[0]}
                      </span>
                      {selectedGrade === grade.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00a599] shrink-0" />
                      )}
                    </div>
                    <span className="text-xs font-black text-slate-800 mt-1 block">
                      ₹{grade.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      {grade.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* FIT / STORAGE TOGGLE: Standard vs High-Capacity Fits */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Storage / Capacity Fit</span>
                <span className="text-slate-400 text-[11px]">Free cloud setup</span>
              </div>

              <div className="flex items-center gap-2">
                {currentProduct.fits.map((fit) => (
                  <button
                    key={fit.id}
                    type="button"
                    onClick={() => setSelectedFit(fit.id)}
                    className={`flex-1 py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedFit === fit.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-black leading-tight">{fit.label}</div>
                    <div
                      className={`text-[9px] uppercase tracking-wider font-semibold ${
                        selectedFit === fit.id ? 'text-slate-300' : 'text-slate-400'
                      }`}
                    >
                      {fit.sublabel}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onAddToCart) {
                    onAddToCart(activeGradeObj, selectedFit);
                  } else {
                    alert(`Added ${currentProduct.title} (${activeGradeObj.label}) to cart!`);
                  }
                }}
                className="flex-1 py-3.5 px-5 rounded-2xl bg-[#00a599] hover:bg-[#008f84] text-white font-extrabold text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                Add to Cart • ₹{activeGradeObj.price.toLocaleString('en-IN')}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onBuyNow) {
                    onBuyNow(activeGradeObj, selectedFit);
                  } else {
                    alert('Proceeding to Express UPI Checkout!');
                  }
                }}
                className="py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                Buy Now
              </button>
            </div>

            {/* ACCORDION DETAILS SECTION */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              {currentProduct.accordions.map((item) => {
                const Icon = item.icon;
                const isOpen = openAccordion === item.id;

                return (
                  <div
                    key={item.id}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(item.id)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-900">
                        <Icon className="w-4 h-4 text-[#00a599] shrink-0" />
                        <span>{item.title}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#00a599]' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {item.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ecommerce1;
