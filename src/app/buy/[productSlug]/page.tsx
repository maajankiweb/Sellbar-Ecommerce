'use client';

import React, { useState, use, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { REFURB_PRODUCTS } from '@/lib/db/data';
import { ConditionGrade } from '@/types';
import { useCart } from '@/context/CartContext';
import { DiagnosticScorecardModal } from '@/components/buy/DiagnosticScorecardModal';
import { EmiExchangeCalculator } from '@/components/buy/EmiExchangeCalculator';
import {
  Star,
  ShieldCheck,
  RotateCcw,
  Truck,
  Zap,
  ShoppingBag,
  ArrowRight,
  Heart,
  Share2,
  Check,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Eye,
  ZoomIn,
  CheckCircle2,
  Award,
  Tag,
  CreditCard,
  RefreshCw,
  Clock,
  HelpCircle,
  ThumbsUp,
  Sliders,
  Smartphone,
  Cpu,
  Battery,
  Camera,
  Layers,
  Sparkles,
  Info,
  X,
  Store,
  Shield,
  PhoneCall,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function SelbarRefurbishedProductPage({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const router = useRouter();
  const { productSlug } = use(params);
  const { addItem, setIsCartOpen } = useCart();

  const initialProduct = REFURB_PRODUCTS.find((p) => p.slug === productSlug);
  const [product, setProduct] = useState<any>(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);

  // Gallery & Options State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedGrade, setSelectedGrade] = useState<ConditionGrade>('superb');
  const [selectedStorage, setSelectedStorage] = useState<string>('64 GB');
  const [selectedColor, setSelectedColor] = useState<string>('Light Blue');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [pincode, setPincode] = useState('845438');
  const [pincodeChecked, setPincodeChecked] = useState(true);
  const [addedToast, setAddedToast] = useState(false);

  // Add-ons State (SELBAR Extended Warranty & Screen Protection)
  const [includeWarrantyAddon, setIncludeWarrantyAddon] = useState(false);
  const [includeScreenProtection, setIncludeScreenProtection] = useState(false);

  // Modals State
  const [isQcModalOpen, setIsQcModalOpen] = useState(false);
  const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/v1/products?slug=${encodeURIComponent(productSlug)}`);
        const data = await res.json();
        if (data.success && data.data) {
          setProduct(data.data);
          if (data.data.specs?.storage) {
            setSelectedStorage(data.data.specs.storage);
          }
          if (data.data.specs?.color) {
            setSelectedColor(data.data.specs.color);
          }
        }
      } catch {
        // fallback to initial
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productSlug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4 bg-[#fbfbfb]">
        <div className="w-12 h-12 border-4 border-[#42c8b7] border-t-transparent rounded-full animate-spin"></div>
        <div className="text-sm font-bold text-slate-800">Loading verified device specifications...</div>
        <p className="text-xs text-slate-400">Fetching 32-point inspection diagnostics and real-time recommerce pricing</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Product Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested device may have been sold or the URL slug has changed.
        </p>
        <Link
          href="/buy"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#42c8b7] text-white font-bold text-xs hover:bg-[#38b5a5] transition shadow-md"
        >
          Browse Refurbished Store
        </Link>
      </div>
    );
  }

  // Active Grade Calculation & Pricing Delta (Cashify Style)
  const basePrice = product.price || 7299;
  const gradePriceMap: Record<ConditionGrade, number> = {
    superb: basePrice,
    good: Math.max(2999, Math.round(basePrice * 0.92)),
    fair: Math.max(2499, Math.round(basePrice * 0.85)),
    'brand-new': Math.round(basePrice * 1.15),
  };

  const unitPrice = gradePriceMap[selectedGrade] || basePrice;
  const originalMrp = product.originalMrp || Math.round(unitPrice * 1.85);
  const discountPercent = Math.round(((originalMrp - unitPrice) / originalMrp) * 100);
  const totalSavings = originalMrp - unitPrice;
  const emiPerMonth = Math.round(unitPrice / 12);

  // Addon costs
  const warrantyCost = 599;
  const screenProtectionCost = 399;
  const finalPayablePrice =
    unitPrice + (includeWarrantyAddon ? warrantyCost : 0) + (includeScreenProtection ? screenProtectionCost : 0);

  // Multi-Angle Perspectives (Front, Back, Right Side, Left Side, Bottom & Ports, Hero 3D)
  const anglePerspectives = useMemo(() => {
    const rawImages: string[] =
      product?.images && product.images.length > 0
        ? product.images
        : ['https://s3n.cashify.in/estore/f25c0b395ebd4793b54ec0404a8232f3.webp'];

    const angleConfigs = [
      {
        id: 'front',
        name: 'Front Display View',
        short: 'Front Display',
        icon: '📱',
        badge: 'Screen & Bezel',
        desc: 'Direct front angle showcasing screen clarity, punch-hole selfie, and scratch-free display glass.',
      },
      {
        id: 'back',
        name: 'Rear Panel View',
        short: 'Back Panel',
        icon: '📷',
        badge: 'Camera Module',
        desc: 'Back panel showcasing finish, brand emblem, and camera island with pristine lens glass.',
      },
      {
        id: 'side-right',
        name: 'Right Side Profile',
        short: 'Right Side',
        icon: '📐',
        badge: 'Buttons & Rail',
        desc: 'Side profile displaying volume rockers, power button tactile response, and aerospace aluminum frame.',
      },
      {
        id: 'side-left',
        name: 'Left Side Profile',
        short: 'Left Side',
        icon: '🔍',
        badge: 'SIM Tray & Edge',
        desc: 'Opposite rail displaying flush SIM slot and clean structural frame with zero dents or bending.',
      },
      {
        id: 'ports',
        name: 'Bottom & Ports View',
        short: 'Ports & Audio',
        icon: '⚡',
        badge: 'Type-C & Grill',
        desc: 'Bottom view displaying high-speed Type-C charging port, microphone, and stereo speaker grille.',
      },
      {
        id: 'hero-3d',
        name: '3D Isometric Angle',
        short: '3D Perspective',
        icon: '✨',
        badge: 'Studio Angle',
        desc: 'Dynamic 45-degree angle displaying phone curvature, ergonomics, and camera bump depth.',
      },
    ];

    return angleConfigs.map((cfg, idx) => ({
      ...cfg,
      url: rawImages[idx] || rawImages[idx % rawImages.length],
    }));
  }, [product?.images]);

  const activeAngle = anglePerspectives[selectedImageIndex] || anglePerspectives[0];

  // Add To Cart Handler
  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedGrade}-${selectedStorage}-${includeWarrantyAddon ? 'extw' : 'std'}`,
      productId: product.id,
      title: `${product.name} (${selectedColor}, ${selectedStorage}) - ${selectedGrade.toUpperCase()}`,
      image: anglePerspectives[0]?.url || 'https://s3n.cashify.in/estore/f25c0b395ebd4793b54ec0404a8232f3.webp',
      grade: selectedGrade,
      storage: selectedStorage,
      color: selectedColor,
      price: unitPrice + (includeWarrantyAddon ? warrantyCost : 0),
      originalMrp,
      quantity: 1,
      warrantyMonths: includeWarrantyAddon ? 12 : (product.warrantyMonths || 6),
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 4000);
  };

  // Buy Now Handler
  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  // Similar Products List
  const similarProducts = REFURB_PRODUCTS.filter((p) => p.slug !== productSlug).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f7f8f9] text-[#222] pb-24 sm:pb-16 font-sans antialiased">
      {/* 32-Point QC Modal */}
      <DiagnosticScorecardModal
        isOpen={isQcModalOpen}
        onClose={() => setIsQcModalOpen(false)}
        productName={product.name}
      />

      {/* EMI & Exchange Calculator */}
      <EmiExchangeCalculator
        isOpen={isEmiModalOpen}
        onClose={() => setIsEmiModalOpen(false)}
        price={unitPrice}
        productName={product.name}
      />

      {/* Grade Explained Drawer / Modal (Cashify Grade-exp-PDP) */}
      {isGradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsGradeModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#42c8b7]">Condition Standards</span>
              <h2 className="text-xl font-extrabold text-slate-900">What are SELBAR Certified Grades?</h2>
              <p className="text-xs text-slate-500">
                Every SELBAR refurbished phone undergoes a 32-point technical diagnostic and is graded purely based on cosmetic appearance. All devices are 100% functional.
              </p>
            </div>

            <div className="space-y-3">
              {/* Superb Grade */}
              <div className="p-4 rounded-xl border-2 border-[#42c8b7]/40 bg-[#42c8b7]/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#42c8b7]" />
                    <span>Superb (Like New)</span>
                  </span>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#42c8b7] text-white">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Screen is completely scratch-free. Body looks untouched with zero to barely visible micro-scratches. Phone feels and operates just like a brand new device out of the box.
                </p>
                <div className="text-[11px] font-semibold text-[#00a599] flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Battery Health ≥ 85% • 12/6 Months Warranty</span>
                </div>
              </div>

              {/* Good Grade */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 hover:border-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900">Good</span>
                  <span className="text-xs font-bold text-slate-600">Great Balance</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Screen has minimal or no scratches. Body may have few subtle light cosmetic marks or faint scratches from normal case usage. Never opened or repaired with third-party parts.
                </p>
                <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>100% Functional • 6 Months Warranty</span>
                </div>
              </div>

              {/* Fair Grade */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 hover:border-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900">Fair (Best Value)</span>
                  <span className="text-xs font-bold text-emerald-600">Highest Discount</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Noticeable scratches or small signs of wear on the frame or back panel, but screen is clear with no cracks. Perfect if you plan to use a back cover and want maximum savings.
                </p>
                <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>100% Tested Hardware • 6 Months Warranty</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsGradeModalOpen(false)}
              className="w-full py-3 rounded-xl bg-[#42c8b7] hover:bg-[#38b5a5] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Got it, Close
            </button>
          </div>
        </div>
      )}

      {/* 360 Multi-Angle Fullscreen Inspection Modal */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl space-y-5 relative max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-black uppercase text-[#42c8b7] tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>360° Certified Angle Inspector</span>
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {product.name} — {activeAngle.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomScale((prev) => (prev === 1 ? 1.7 : 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>{zoomScale === 1 ? 'Zoom 1.7x' : 'Reset Zoom'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsZoomModalOpen(false);
                    setZoomScale(1);
                  }}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Angle Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {anglePerspectives.map((ang, idx) => (
                <button
                  key={ang.id}
                  type="button"
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    setZoomScale(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'bg-[#42c8b7] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{ang.icon}</span>
                  <span>{ang.short}</span>
                </button>
              ))}
            </div>

            {/* High-Res Viewport */}
            <div className="relative flex-1 min-h-[320px] sm:min-h-[420px] rounded-2xl bg-[#fafafa] border border-slate-100 flex items-center justify-center p-4 overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setSelectedImageIndex((prev) =>
                    prev > 0 ? prev - 1 : anglePerspectives.length - 1
                  )
                }
                className="absolute left-3 p-2.5 rounded-full bg-white/90 border border-slate-200 text-slate-700 hover:bg-white shadow-md cursor-pointer transition hover:scale-105 z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <img
                src={activeAngle.url}
                alt={activeAngle.name}
                className="max-h-full max-w-full object-contain transition-transform duration-300 drop-shadow-md"
                style={{ transform: `scale(${zoomScale})` }}
              />

              <button
                type="button"
                onClick={() =>
                  setSelectedImageIndex((prev) =>
                    prev < anglePerspectives.length - 1 ? prev + 1 : 0
                  )
                }
                className="absolute right-3 p-2.5 rounded-full bg-white/90 border border-slate-200 text-slate-700 hover:bg-white shadow-md cursor-pointer transition hover:scale-105 z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Diagnostic Verification Note */}
            <div className="p-3.5 rounded-xl bg-[#eefcf9] border border-[#42c8b7]/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#42c8b7] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-3" />
                </div>
                <span className="text-slate-800 font-bold">
                  {activeAngle.name}: {activeAngle.desc}
                </span>
              </div>
              <span className="text-[10px] font-black uppercase text-[#00a599] shrink-0 bg-white px-2 py-0.5 rounded border border-[#42c8b7]/30">
                QC Passed
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Added to Cart Toast */}
      {addedToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[#1f2937] text-white px-5 py-3.5 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 border border-slate-700">
          <div className="w-5 h-5 rounded-full bg-[#42c8b7] flex items-center justify-center text-white">
            <Check className="w-3 h-3 stroke-3" />
          </div>
          <span>Added to your SELBAR Cart!</span>
          <Link
            href="/cart"
            className="ml-2 px-3 py-1 bg-[#42c8b7] text-white rounded-lg font-black hover:bg-[#38b5a5] transition inline-flex items-center gap-1 text-[11px]"
          >
            <span>View Cart</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* =========================================================================
          1. CASHIFY BREADCRUMBS BAR
          ========================================================================= */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-2.5 text-[11px] sm:text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap">
            <Link href="/" className="hover:text-[#42c8b7] transition">Home</Link>
            <span className="text-slate-300">›</span>
            <Link href="/buy" className="hover:text-[#42c8b7] transition">Buy Refurbished Mobile Phone</Link>
            <span className="text-slate-300">›</span>
            <Link href={`/buy?brand=${product.brand?.toLowerCase()}`} className="hover:text-[#42c8b7] transition font-medium text-slate-600">
              Buy Refurbished {product.brand || 'Samsung'}
            </Link>
            <span className="text-slate-300">›</span>
            <span className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-[320px]">
              {product.name} - Refurbished
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: `${product.name} - Refurbished`, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="hover:text-[#42c8b7] flex items-center gap-1 cursor-pointer transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              type="button"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="hover:text-rose-500 flex items-center gap-1 cursor-pointer transition"
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. CORE CASHIFY 2-COLUMN PRODUCT SHOWCASE
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ---------------------------------------------------------------------
              LEFT COLUMN: PRODUCT STAGE & CASHIFY REASSURANCE STRIP (5 Cols)
              --------------------------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs relative space-y-3.5">
              
              {/* Interactive Angle Selection Chips */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#42c8b7]" />
                    <span>Every Angle View ({selectedImageIndex + 1}/{anglePerspectives.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsZoomModalOpen(true)}
                    className="text-[#42c8b7] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Full 360° Zoom</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {anglePerspectives.map((ang, idx) => (
                    <button
                      key={ang.id}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition flex items-center gap-1 cursor-pointer border ${
                        selectedImageIndex === idx
                          ? 'bg-[#42c8b7] text-white border-[#42c8b7] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span>{ang.icon}</span>
                      <span>{ang.short}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Image Stage */}
              <div className="relative aspect-square rounded-xl bg-[#fafafa] flex items-center justify-center p-4 sm:p-8 overflow-hidden group border border-slate-100">
                
                {/* Cashify Condition Grade Badge on Image */}
                <div className="absolute top-3 left-3 bg-[#42c8b7] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 uppercase tracking-wider z-10">
                  <Sparkles className="w-3 h-3" />
                  <span>Grade: {selectedGrade}</span>
                </div>

                {/* Angle Indicator Tag */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xs border border-slate-200 text-slate-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 z-10">
                  <span>{activeAngle.icon}</span>
                  <span>{activeAngle.short}</span>
                </div>

                {/* Actions Top Right */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                  <button
                    type="button"
                    onClick={() => setIsZoomModalOpen(true)}
                    title="Zoom & Inspect Angle"
                    className="p-2 rounded-full bg-white/90 border border-slate-200 text-slate-600 hover:text-[#42c8b7] shadow-xs cursor-pointer transition hover:scale-110"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="p-2 rounded-full bg-white/90 border border-slate-200 text-slate-500 hover:text-rose-500 shadow-xs cursor-pointer transition hover:scale-110"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Prev Navigation Chevron */}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev > 0 ? prev - 1 : anglePerspectives.length - 1
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white shadow-xs cursor-pointer transition z-10 opacity-75 group-hover:opacity-100 hover:scale-110"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Product Image */}
                <img
                  src={activeAngle.url}
                  alt={activeAngle.name}
                  onClick={() => setIsZoomModalOpen(true)}
                  className="max-h-[90%] max-w-[90%] object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
                />

                {/* Next Navigation Chevron */}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev < anglePerspectives.length - 1 ? prev + 1 : 0
                    )
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white shadow-xs cursor-pointer transition z-10 opacity-75 group-hover:opacity-100 hover:scale-110"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Cashify 32-Point Inspection Stamp */}
                <button
                  type="button"
                  onClick={() => setIsQcModalOpen(true)}
                  className="absolute bottom-3 left-3 bg-white/95 border border-[#42c8b7]/40 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1.5 hover:bg-[#eefcf9] transition cursor-pointer z-10"
                >
                  <Award className="w-3.5 h-3.5 text-[#42c8b7]" />
                  <span>32-Point Quality Passed</span>
                </button>

                {/* 360 Inspection Tag */}
                <div className="absolute bottom-3 right-3 bg-[#eefcf9] border border-[#42c8b7]/40 text-[#00a599] text-[9px] font-black px-2 py-0.5 rounded-full z-10 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>360° Certified</span>
                </div>
              </div>

              {/* Multi-Angle Thumbnails with Angle Chips */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {anglePerspectives.map((ang, idx) => (
                  <button
                    key={ang.id}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 sm:w-18 h-20 rounded-xl p-1 border-2 flex flex-col items-center justify-between bg-white transition cursor-pointer shrink-0 relative overflow-hidden ${
                      selectedImageIndex === idx
                        ? 'border-[#42c8b7] ring-2 ring-[#42c8b7]/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex-1 w-full flex items-center justify-center p-0.5">
                      <img src={ang.url} alt={ang.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <span
                      className={`w-full text-[9px] font-extrabold py-0.5 text-center truncate ${
                        selectedImageIndex === idx
                          ? 'bg-[#42c8b7] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {ang.short}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Angle Inspection Diagnostic Reassurance */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600 flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-3" />
                </div>
                <div>
                  <strong className="text-slate-900">{activeAngle.name}:</strong> {activeAngle.desc}
                </div>
              </div>

              {/* CASHIFY'S ICONIC 4-PILLAR BENEFIT STRIP (Under Product Image) */}
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-center">
                <div className="flex flex-col items-center gap-1 p-1">
                  <div className="w-9 h-9 rounded-full bg-[#eefcf9] flex items-center justify-center text-[#42c8b7]">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black text-slate-800 leading-tight">15 Days Refund*</span>
                  <span className="text-[9px] text-slate-400">No questions</span>
                </div>

                <div className="flex flex-col items-center gap-1 p-1">
                  <div className="w-9 h-9 rounded-full bg-[#eefcf9] flex items-center justify-center text-[#42c8b7]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black text-slate-800 leading-tight">Up to 12M Warranty</span>
                  <span className="text-[9px] text-slate-400">Free repair</span>
                </div>

                <div className="flex flex-col items-center gap-1 p-1">
                  <div className="w-9 h-9 rounded-full bg-[#eefcf9] flex items-center justify-center text-[#42c8b7]">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black text-slate-800 leading-tight">32-Point Check</span>
                  <span className="text-[9px] text-slate-400">Expert tested</span>
                </div>

                <div className="flex flex-col items-center gap-1 p-1">
                  <div className="w-9 h-9 rounded-full bg-[#eefcf9] flex items-center justify-center text-[#42c8b7]">
                    <Store className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black text-slate-800 leading-tight">200+ Stores</span>
                  <span className="text-[9px] text-slate-400">Pan India</span>
                </div>
              </div>
            </div>

            {/* CASHIFY ICONIC CTA BUTTONS (DESKTOP) */}
            <div className="hidden sm:grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleAddToCart}
                className="py-3.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border-2 border-[#42c8b7] font-extrabold text-xs sm:text-sm tracking-wide uppercase shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4 text-[#42c8b7]" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="py-3.5 px-4 rounded-xl bg-[#42c8b7] hover:bg-[#38b5a5] text-white font-extrabold text-xs sm:text-sm tracking-wide uppercase shadow-md shadow-[#42c8b7]/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <Zap className="w-4 h-4 text-white fill-white" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* ---------------------------------------------------------------------
              RIGHT COLUMN: CASHIFY PRODUCT CONFIGURATOR & PRICING (7 Cols)
              --------------------------------------------------------------------- */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Cashify Product Title & Rating */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    SELBAR Certified Recommerce
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">•</span>
                  <span className="text-[10px] font-bold text-slate-500">SKU: {product.slug?.slice(0, 8).toUpperCase() || '227394'}</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {product.name} - Refurbished
                </h1>

                {/* Rating Badge */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="inline-flex items-center gap-1 bg-[#388e3c] text-white font-black px-2 py-0.5 rounded text-xs shadow-2xs">
                    <span>{product.rating || '4.5'}</span>
                    <Star className="w-3 h-3 fill-white text-white" />
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">
                    ({product.reviewCount || 6} Reviews)
                  </span>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => setIsQcModalOpen(true)}
                    className="text-xs font-bold text-[#00a599] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>View Inspection Scorecard</span>
                  </button>
                </div>
              </div>

              {/* Price Header (Cashify Exact Design) */}
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">
                    ₹{unitPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-base text-slate-400 line-through">
                    ₹{originalMrp.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-black text-[#42c8b7] bg-[#eefcf9] px-2 py-0.5 rounded-md border border-[#42c8b7]/30">
                    {discountPercent}% OFF
                  </span>
                </div>

                {/* EMI Subtitle */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-600">
                    EMI starts at <strong className="text-slate-900 font-bold">₹{emiPerMonth}/month</strong>. Standard plans available.
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEmiModalOpen(true)}
                    className="text-[#42c8b7] font-bold hover:underline cursor-pointer"
                  >
                    View Plans
                  </button>
                </div>

                <div className="text-[11px] text-slate-400">
                  Inclusive of all taxes • Free express shipping across India
                </div>
              </div>

              {/* Cashify Sale Banner / Promo Callout */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#eefcf9] to-[#e6f9f6] border border-[#42c8b7]/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Tag className="w-4 h-4 text-[#42c8b7] shrink-0" />
                  <span>
                    <strong>More-Ya Sale:</strong> Extra ₹1,000 instant discount applied at checkout!
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase text-[#00a599] px-2 py-0.5 rounded bg-white border border-[#42c8b7]/30">
                  Active
                </span>
              </div>
            </div>

            {/* CASHIFY CONDITION GRADE SELECTOR (Core Differentiator) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Select Condition:
                </span>
                <button
                  type="button"
                  onClick={() => setIsGradeModalOpen(true)}
                  className="text-xs font-bold text-[#42c8b7] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Grade Explained</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    grade: 'superb',
                    title: 'Superb',
                    badge: 'Like New',
                    price: gradePriceMap.superb,
                    desc: 'Screen scratch-free, body like new',
                  },
                  {
                    grade: 'good',
                    title: 'Good',
                    badge: 'Great Value',
                    price: gradePriceMap.good,
                    desc: 'Minor micro-scratches on body',
                  },
                  {
                    grade: 'fair',
                    title: 'Fair',
                    badge: 'Best Value',
                    price: gradePriceMap.fair,
                    desc: 'Noticeable signs of use, fully working',
                  },
                ].map((g) => {
                  const isSelected = selectedGrade === g.grade;
                  return (
                    <button
                      key={g.grade}
                      type="button"
                      onClick={() => setSelectedGrade(g.grade as ConditionGrade)}
                      className={`p-3.5 rounded-xl border-2 text-left transition cursor-pointer relative ${
                        isSelected
                          ? 'border-[#42c8b7] bg-[#eefcf9] shadow-xs ring-1 ring-[#42c8b7]/30'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-slate-900">{g.title}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${isSelected ? 'bg-[#42c8b7] text-white' : 'bg-slate-100 text-slate-600'}`}>
                          {g.badge}
                        </span>
                      </div>
                      <div className="text-sm font-extrabold text-slate-950">
                        ₹{g.price.toLocaleString('en-IN')}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 leading-tight">{g.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CASHIFY STORAGE & RAM PILLS */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  Select Storage:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {['4 GB / 64 GB', '6 GB / 128 GB', '8 GB / 128 GB'].map((s) => {
                    const isSelected = selectedStorage.includes(s.split(' / ')[1] || s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedStorage(s.split(' / ')[1] || s)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition cursor-pointer ${
                          isSelected
                            ? 'border-[#42c8b7] bg-[#eefcf9] text-slate-900 shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CASHIFY COLOR SELECTION */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  Color: <span className="font-normal text-slate-600 capitalize">{selectedColor}</span>
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { name: 'Light Blue', hex: '#add8e6' },
                    { name: 'Black', hex: '#1e1e1e' },
                    { name: 'Laser Bronze', hex: '#cd7f32' },
                  ].map((c) => {
                    const isSelected = selectedColor.toLowerCase() === c.name.toLowerCase();
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'border-[#42c8b7] bg-[#eefcf9] text-slate-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CASHIFY PINCODE DELIVERY CHECKER */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#42c8b7]" />
                  <span>Check Delivery</span>
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={pincode}
                    maxLength={6}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-28 px-2.5 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-slate-50 text-center focus:outline-none focus:border-[#42c8b7] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPincodeChecked(true);
                      alert(`Verified express delivery for Pincode ${pincode}`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#42c8b7] hover:bg-[#38b5a5] text-white text-xs font-bold transition cursor-pointer"
                  >
                    Check
                  </button>
                </div>
              </div>

              {pincodeChecked && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Truck className="w-4 h-4 text-[#42c8b7]" />
                    <span>Delivering to {pincode} in 2-3 business days</span>
                    <span className="text-[#00a599] font-black uppercase text-[10px] ml-auto">Free Delivery</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pl-5.5">
                    Cash on Delivery (COD) Available • 15 Days Doorstep Replacement Guarantee
                  </div>
                </div>
              )}
            </div>

            {/* CASHIFY EXTENDED WARRANTY & DAMAGE PROTECTION ADD-ON */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3">
              <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
                <span>Value Added Services & Warranty</span>
                <span className="text-[10px] font-bold text-[#42c8b7]">Peace of Mind</span>
              </div>

              <div className="space-y-2.5">
                {/* 6 Months Extended Warranty Card */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 transition cursor-pointer ${
                  includeWarrantyAddon ? 'border-[#42c8b7] bg-[#eefcf9]' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={includeWarrantyAddon}
                    onChange={(e) => setIncludeWarrantyAddon(e.target.checked)}
                    className="accent-[#42c8b7] w-4 h-4 mt-0.5 rounded cursor-pointer"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Add 6 Months Extended Warranty</span>
                      <span className="text-slate-950 font-black">+₹{warrantyCost}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Extends standard coverage to 12 full months. Covers internal hardware, motherboards & electrical faults.
                    </p>
                  </div>
                </label>

                {/* Screen Damage Protection Card */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 transition cursor-pointer ${
                  includeScreenProtection ? 'border-[#42c8b7] bg-[#eefcf9]' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={includeScreenProtection}
                    onChange={(e) => setIncludeScreenProtection(e.target.checked)}
                    className="accent-[#42c8b7] w-4 h-4 mt-0.5 rounded cursor-pointer"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Add 1-Year Screen Protection</span>
                      <span className="text-slate-950 font-black">+₹{screenProtectionCost}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Covers accidental screen cracks & fluid damage with doorstep pickup and genuine replacement.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* CASHIFY AVAILABLE PAYMENT METHODS */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
              <span className="font-bold text-slate-800">Available Payment Methods:</span>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                <span className="px-2 py-0.5 bg-white rounded border border-slate-200">UPI</span>
                <span className="px-2 py-0.5 bg-white rounded border border-slate-200">Credit / Debit</span>
                <span className="px-2 py-0.5 bg-white rounded border border-slate-200">EMI</span>
                <span className="px-2 py-0.5 bg-white rounded border border-slate-200">COD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. CASHIFY TOP SPECS PILL GRID
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
            Top Specs
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#42c8b7] shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Display</span>
                <span className="text-xs font-bold text-slate-900 line-clamp-1">
                  {product.specs?.screen || '6.4" FHD+ Super AMOLED 90Hz'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#42c8b7] shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Processor</span>
                <span className="text-xs font-bold text-slate-900 line-clamp-1">
                  {product.specs?.processor || 'Helio G80 / Octa-Core'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#42c8b7] shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Rear Camera</span>
                <span className="text-xs font-bold text-slate-900 line-clamp-1">
                  {product.specs?.camera || '64MP + 8MP + 2MP + 2MP'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#42c8b7] shrink-0">
                <Battery className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Battery</span>
                <span className="text-xs font-bold text-slate-900 line-clamp-1">
                  {product.specs?.battery || '6000 mAh Fast Charging'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. SELBAR 32-POINT QUALITY CHECK BREAKDOWN
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#42c8b7]">
                Certified Quality Assurance
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                SELBAR 32-Point Quality Check
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsQcModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#eefcf9] border border-[#42c8b7]/40 text-[#00a599] font-bold text-xs hover:bg-[#42c8b7] hover:text-white transition cursor-pointer inline-flex items-center gap-1.5 w-fit"
            >
              <Award className="w-4 h-4" />
              <span>View Live QC Certificate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { title: 'Display & Touchscreen', desc: 'Zero dead pixels, smooth 90Hz touch response' },
              { title: 'Battery Health Test', desc: 'Healthy capacity > 85%, rapid charging verified' },
              { title: 'Quad Camera Setup', desc: 'Primary 64MP, Ultrawide, Macro & Selfie tested' },
              { title: 'Speakers & Dual Mics', desc: 'Stereo audio clarity, noise suppression active' },
              { title: 'Biometrics & Sensors', desc: 'Side-mounted Fingerprint & Face Unlock ok' },
              { title: 'Wireless & Cellular', desc: '4G VoLTE, Dual Band Wi-Fi, Bluetooth 5.0' },
              { title: 'Physical Ports & Keys', desc: 'Type-C jack, 3.5mm audio & volume click' },
              { title: 'Clean IMEI & Factory Reset', desc: 'NIST 800-88 sanitized, zero carrier locks' },
            ].map((qc, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-3" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">{qc.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{qc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SELBAR SEAL OF TRUST (As per Verified Recommerce Standard)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
        <div className="bg-gradient-to-br from-white via-[#fbfdfd] to-[#f0faf8] rounded-3xl border border-[#42c8b7]/30 p-6 sm:p-10 shadow-xs relative overflow-hidden">
          {/* Subtle Watermark in background */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-8 border-[#42c8b7]/10 flex items-center justify-center pointer-events-none opacity-40">
            <ShieldCheck className="w-36 h-36 text-[#42c8b7]/20" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: SELBAR Seal of Trust Points */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#42c8b7]/10 text-[#00a599] text-xs font-black uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>SELBAR Assured Quality</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  SELBAR Seal of Trust
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Every device is backed by our nationwide recommerce guarantee and doorstep assurance.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/70 shadow-2xs">
                  <div className="w-12 h-12 rounded-2xl bg-[#42c8b7] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#42c8b7]/20">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900">Up to 12-month warranty</h4>
                    <p className="text-xs text-slate-500">Comprehensive hardware protection & free doorstep repairs pan-India</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/70 shadow-2xs">
                  <div className="w-12 h-12 rounded-2xl bg-[#42c8b7] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#42c8b7]/20">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900">15-day easy returns</h4>
                    <p className="text-xs text-slate-500">No-questions-asked doorstep return or instant device replacement</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/70 shadow-2xs">
                  <div className="w-12 h-12 rounded-2xl bg-[#42c8b7] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#42c8b7]/20">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900">200+ stores Pan-India</h4>
                    <p className="text-xs text-slate-500">Walk into any authorized SELBAR experience store for instant support</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Eco-Box Branding Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-xs sm:max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6 shadow-2xl border border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[360px]">
                {/* Top Badge */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border-2 border-[#42c8b7] flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-[#42c8b7] stroke-3" />
                    </div>
                    <span className="text-xs font-black tracking-wider uppercase text-white">SELBAR ASSURED</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#42c8b7] bg-[#42c8b7]/10 px-2 py-0.5 rounded-full border border-[#42c8b7]/30">
                    SEAL OF TRUST
                  </span>
                </div>

                {/* Box Center Art */}
                <div className="py-6 space-y-3 text-center my-auto">
                  <div className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#42c8b7]">
                    BE THE CHANGE
                  </div>
                  <p className="text-xs text-slate-400 max-w-[240px] mx-auto">
                    Sustainable recommerce packaging. 100% verified, sanitized and sealed.
                  </p>
                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-300 font-bold pt-2">
                    <span>🔬 32 Pt QC</span>
                    <span>•</span>
                    <span>⭐ 50K+ Buyers</span>
                    <span>•</span>
                    <span>🏬 200+ Stores</span>
                  </div>
                </div>

                {/* Box Bottom Band */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs font-black tracking-widest text-[#42c8b7]">SELBAR</div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#42c8b7]" />
                    <span>Official Verified Warranty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. WHAT'S IN THE BOX (SELBAR Eco-Packaging)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            What&apos;s Inside The Box
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-[#fafafa] text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 mx-auto flex items-center justify-center text-[#42c8b7]">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-slate-800">Certified Phone</div>
              <div className="text-[10px] text-slate-500">100% Sanitized & Tested</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-[#fafafa] text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 mx-auto flex items-center justify-center text-[#42c8b7]">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-slate-800">Compatible Fast Cable</div>
              <div className="text-[10px] text-slate-500">Type-C High Speed Data</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-[#fafafa] text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 mx-auto flex items-center justify-center text-[#42c8b7]">
                <Info className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-slate-800">SIM Tray Ejector</div>
              <div className="text-[10px] text-slate-500">Stainless Steel Pin</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-[#fafafa] text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 mx-auto flex items-center justify-center text-[#42c8b7]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-slate-800">Warranty Card</div>
              <div className="text-[10px] text-slate-500">SELBAR Assurance</div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          6. WHY BUY REFURBISHED FROM US VS LOCAL MARKET (Comparison Table)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#42c8b7]">The Recommerce Advantage</span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Why Buy From SELBAR vs Local Second-Hand Market?
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 text-slate-500 font-bold w-1/3">Feature</th>
                  <th className="py-3 px-4 text-[#00a599] font-black w-1/3 bg-[#eefcf9] rounded-t-lg">SELBAR Certified</th>
                  <th className="py-3 px-4 text-slate-400 font-bold w-1/3">Local Second-Hand Shop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">Warranty</td>
                  <td className="py-3 px-4 font-bold text-emerald-700 bg-[#eefcf9]">Up to 12 Months Doorstep Warranty</td>
                  <td className="py-3 px-4 text-slate-500">0 to 7 Days (Verbal only)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">Inspection & Diagnostics</td>
                  <td className="py-3 px-4 font-bold text-emerald-700 bg-[#eefcf9]">Rigorous 32-Point Diagnostic Test</td>
                  <td className="py-3 px-4 text-slate-500">Casual 2-minute visual check</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">Return & Refund Policy</td>
                  <td className="py-3 px-4 font-bold text-emerald-700 bg-[#eefcf9]">15-Days Doorstep Refund / Replacement</td>
                  <td className="py-3 px-4 text-slate-500">Strictly No Refund once sold</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">Legal Tax Invoice</td>
                  <td className="py-3 px-4 font-bold text-emerald-700 bg-[#eefcf9]">100% Legal GST Invoice with verified IMEI</td>
                  <td className="py-3 px-4 text-slate-500">Usually cash slip / No bill</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">After-Sales Support</td>
                  <td className="py-3 px-4 font-bold text-emerald-700 bg-[#eefcf9]">200+ Pan-India Service Centers</td>
                  <td className="py-3 px-4 text-slate-500">Dependent on single local store</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =========================================================================
          7. FULL TECHNICAL SPECIFICATIONS
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-900">Technical Specifications</h2>
            <button
              type="button"
              onClick={() => setIsQcModalOpen(true)}
              className="text-xs font-bold text-[#42c8b7] hover:underline cursor-pointer"
            >
              View Full Diagnostic Certificate →
            </button>
          </div>

          <div className="space-y-6 text-xs">
            {/* General */}
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm mb-3">General Information</h3>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 p-3 bg-slate-50/60">
                  <span className="col-span-4 text-slate-500 font-bold">Brand & Model</span>
                  <span className="col-span-8 text-slate-900 font-medium">{product.name}</span>
                </div>
                <div className="grid grid-cols-12 p-3 bg-white">
                  <span className="col-span-4 text-slate-500 font-bold">Condition Grade</span>
                  <span className="col-span-8 text-emerald-700 font-bold uppercase">{selectedGrade} - 100% Certified Functional</span>
                </div>
                <div className="grid grid-cols-12 p-3 bg-slate-50/60">
                  <span className="col-span-4 text-slate-500 font-bold">Color</span>
                  <span className="col-span-8 text-slate-900 font-medium">{selectedColor}</span>
                </div>
                <div className="grid grid-cols-12 p-3 bg-white">
                  <span className="col-span-4 text-slate-500 font-bold">SIM Slots</span>
                  <span className="col-span-8 text-slate-900 font-medium">Dual SIM (Nano-SIM, dual stand-by)</span>
                </div>
              </div>
            </div>

            {/* Display */}
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm mb-3">Display Features</h3>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 p-3 bg-slate-50/60">
                  <span className="col-span-4 text-slate-500 font-bold">Screen Size</span>
                  <span className="col-span-8 text-slate-900 font-medium">{product.specs?.screen || '6.4 inches Super AMOLED'}</span>
                </div>
                <div className="grid grid-cols-12 p-3 bg-white">
                  <span className="col-span-4 text-slate-500 font-bold">Resolution & Refresh</span>
                  <span className="col-span-8 text-slate-900 font-medium">1080 x 2400 pixels (FHD+) @ 90Hz Smooth Display</span>
                </div>
              </div>
            </div>

            {/* Performance & Memory */}
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm mb-3">Processor & Storage</h3>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 p-3 bg-slate-50/60">
                  <span className="col-span-4 text-slate-500 font-bold">Processor</span>
                  <span className="col-span-8 text-slate-900 font-medium">{product.specs?.processor || 'Mediatek Helio G80 (12 nm) Octa-Core'}</span>
                </div>
                <div className="grid grid-cols-12 p-3 bg-white">
                  <span className="col-span-4 text-slate-500 font-bold">Internal Storage</span>
                  <span className="col-span-8 text-slate-900 font-medium">{selectedStorage}</span>
                </div>
                <div className="grid grid-cols-12 p-3 bg-slate-50/60">
                  <span className="col-span-4 text-slate-500 font-bold">RAM</span>
                  <span className="col-span-8 text-slate-900 font-medium">{product.specs?.ram || '4GB / 6GB'}</span>
                </div>
              </div>
            </div>

            {/* Camera */}
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm mb-3">Camera</h3>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 p-3 bg-slate-50/60">
                  <span className="col-span-4 text-slate-500 font-bold">Rear Camera</span>
                  <span className="col-span-8 text-slate-900 font-medium">{product.specs?.camera || '64 MP (wide) + 8 MP (ultrawide) + 2 MP + 2 MP'}</span>
                </div>
                <div className="grid grid-cols-12 p-3 bg-white">
                  <span className="col-span-4 text-slate-500 font-bold">Selfie Camera</span>
                  <span className="col-span-8 text-slate-900 font-medium">20 MP, f/2.2 Front Camera with HDR</span>
                </div>
              </div>
            </div>

            {/* Battery & Charging */}
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm mb-3">Battery & Power</h3>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 p-3 bg-slate-50/60">
                  <span className="col-span-4 text-slate-500 font-bold">Battery Capacity</span>
                  <span className="col-span-8 text-slate-900 font-medium">{product.specs?.battery || '6000 mAh Li-Po non-removable'}</span>
                </div>
                <div className="grid grid-cols-12 p-3 bg-white">
                  <span className="col-span-4 text-slate-500 font-bold">Charging</span>
                  <span className="col-span-8 text-slate-900 font-medium">Fast charging 15W supported</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          8. CASHIFY VERIFIED CUSTOMER REVIEWS
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#42c8b7]">Genuine Feedback</span>
              <h2 className="text-lg font-extrabold text-slate-900">Verified Customer Reviews</h2>
            </div>
            <button
              type="button"
              onClick={() => alert('Review submitted for verification!')}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Write a Review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 text-center sm:text-left space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <span className="text-4xl sm:text-5xl font-black text-slate-900">4.5</span>
                <div className="inline-flex items-center gap-1 bg-[#388e3c] text-white text-base font-black px-2.5 py-1 rounded-lg">
                  <span>★</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Based on 6 verified purchases across India
              </p>
            </div>

            <div className="md:col-span-8 space-y-1.5 text-xs">
              {[
                { stars: '5 ★', pct: '75%', count: 5 },
                { stars: '4 ★', pct: '25%', count: 1 },
                { stars: '3 ★', pct: '0%', count: 0 },
                { stars: '2 ★', pct: '0%', count: 0 },
                { stars: '1 ★', pct: '0%', count: 0 },
              ].map((b) => (
                <div key={b.stars} className="flex items-center gap-3">
                  <span className="w-7 text-slate-600 font-bold shrink-0">{b.stars}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#42c8b7] h-full rounded-full" style={{ width: b.pct }} />
                  </div>
                  <span className="w-8 text-slate-400 text-right shrink-0">{b.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review items */}
          <div className="divide-y divide-slate-100 pt-3">
            <div className="py-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">5 ★</span>
                <span className="font-bold text-xs text-slate-900">Good performance, light wear</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Superb quality refurbished device. Screen is completely scratch-free, body looks untouched and the 6000 mAh battery lasts 2 full days easily. Very smooth experience.
              </p>
              <div className="text-[10px] text-slate-400 pt-0.5">
                Verified Buyer • 10 days ago
              </div>
            </div>

            <div className="py-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">5 ★</span>
                <span className="font-bold text-xs text-slate-900">Pretty good, would recommend</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Functionally perfect and the Super AMOLED screen is vibrant. Passed all 32 diagnostic tests with the inspection report matching 100%. Highly recommended!
              </p>
              <div className="text-[10px] text-slate-400 pt-0.5">
                Verified Buyer • 3 weeks ago
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          9. SIMILAR REFURBISHED SMARTPHONES
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#42c8b7]">Explore More</span>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                You May Also Like
              </h2>
            </div>
            <Link href="/buy" className="text-xs font-bold text-[#42c8b7] hover:underline">
              View All Mobiles →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {similarProducts.map((p: any) => {
              const pPrice = p.price || p.grades?.[0]?.price || 7499;
              const pMrp = p.originalMrp || p.grades?.[0]?.originalMrp || Math.round(pPrice * 1.6);
              const pDisc = Math.round(((pMrp - pPrice) / pMrp) * 100);

              return (
                <Link
                  key={p.id}
                  href={`/buy/${p.slug}`}
                  className="group rounded-2xl border border-slate-200/90 p-3.5 flex flex-col justify-between hover:shadow-lg transition-all bg-white"
                >
                  <div>
                    <div className="aspect-square bg-[#fafafa] rounded-xl p-2 flex items-center justify-center overflow-hidden mb-2.5 relative">
                      <img
                        src={p.images?.[0] || 'https://s3n.cashify.in/estore/f25c0b395ebd4793b54ec0404a8232f3.webp'}
                        alt={p.name}
                        className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 text-[9px] font-black bg-[#42c8b7] text-white px-2 py-0.5 rounded-full">
                        {pDisc}% OFF
                      </span>
                    </div>

                    <h3 className="text-xs font-extrabold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#42c8b7] transition-colors">
                      {p.name} - Refurbished
                    </h3>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {p.specs?.storage || '128 GB'} • {p.specs?.ram || '6 GB RAM'}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-black text-slate-900">
                        ₹{pPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 line-through block">
                        ₹{pMrp.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#00a599]">
                      SELBAR Grade
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          10. CASHIFY MOBILE BOTTOM ACTION BAR (Sticky at Bottom on Mobile)
          ========================================================================= */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-2xl p-3 flex items-center gap-2">
        <div className="flex-1 pl-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Deal Price</div>
          <div className="text-base font-black text-slate-950">
            ₹{finalPayablePrice.toLocaleString('en-IN')}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-3 px-3 bg-white border-2 border-[#42c8b7] text-slate-900 font-extrabold text-xs uppercase rounded-xl shadow-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#42c8b7]" />
          <span>Add</span>
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 py-3 px-3 bg-[#42c8b7] text-white font-extrabold text-xs uppercase rounded-xl shadow-sm flex items-center justify-center gap-1 cursor-pointer active:scale-95"
        >
          <Zap className="w-3.5 h-3.5 fill-white" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}
