"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BRANDS, MODELS, REFURB_PRODUCTS } from "@/lib/db/data";
import { useCart } from "@/context/CartContext";
import { ConditionGrade } from "@/types";
import { BrandMarquee } from "@/components/common/BrandMarquee";
import { RecommerceGuide } from "@/components/common/RecommerceGuide";
import { FaqSection } from "@/components/common/FaqSection";
import { RefurbVsNewSlider } from "@/components/home/RefurbVsNewSlider";
import { AmazonFeatureCards } from "@/components/home/AmazonFeatureCards";
import { BestSellersAccessories } from "@/components/home/BestSellersAccessories";
import { LiveActivityTicker } from "@/components/home/LiveActivityTicker";
import { EcoImpactCounter } from "@/components/home/EcoImpactCounter";
import { CustomerReviewsCarousel } from "@/components/home/CustomerReviewsCarousel";
import { ProductUnboxingReviews } from "@/components/home/ProductUnboxingReviews";
import SellOldVsNewSection from "@/components/home/SellOldVsNewSection";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Star,
  Smartphone,
  Laptop,
  Monitor,
  Watch,
  Tablet,
  Tv,
  Gamepad2,
  Headphones,
  Camera,
  Wrench,
  Recycle,
  Building,
  Search,
  Check,
  ChevronDown,
  ShoppingBag,
  TrendingDown,
  Award,
  Truck,
  RotateCcw,
  BadgePercent,
  HeartHandshake,
  Quote,
  QrCode,
  Layers,
  ChevronRight,
  HelpCircle,
  BookOpen,
  DollarSign,
  Tag,
  Wind,
} from "lucide-react";

export default function HomePage() {
  const { addItem } = useCart();
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [activeCategoryPill, setActiveCategoryPill] = useState("all");

  // Dynamic Products state from Database API
  const [liveProducts, setLiveProducts] = useState<any[]>(REFURB_PRODUCTS);
  const phoneScrollRef = useRef<HTMLDivElement>(null);
  const laptopScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPhoneLeft, setCanScrollPhoneLeft] = useState(false);
  const [canScrollPhoneRight, setCanScrollPhoneRight] = useState(true);
  const [canScrollLaptopLeft, setCanScrollLaptopLeft] = useState(false);
  const [canScrollLaptopRight, setCanScrollLaptopRight] = useState(true);

  const checkScrollState = (
    ref: React.RefObject<HTMLDivElement | null>,
    setLeft: React.Dispatch<React.SetStateAction<boolean>>,
    setRight: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setLeft(scrollLeft > 10);
      setRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollCarousel = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right",
    setLeft: React.Dispatch<React.SetStateAction<boolean>>,
    setRight: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(() => checkScrollState(ref, setLeft, setRight), 350);
    }
  };

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch("/api/v1/products");
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setLiveProducts(data.data);
        }
      } catch {
        // keep fallback
      }
    }
    loadCatalog();
  }, []);

  // 1. HERO CAROUSEL SLIDER STATE
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);

  const HERO_SLIDES = [
    {
      id: 1,
      badge: "Instant Cash Valuation",
      title: "Sell Old Phone for Instant Cash",
      subtitle:
        "Free 2-Hour Express Pickup • Instant On-Spot UPI Transfer • 100% Certified Data Wipe",
      ctaText: "Sell Phone Now",
      ctaHref: "/sell",
      secondaryText: "Check Phone Price",
      secondaryHref: "/sell",
      bgGradient: "from-emerald-700 via-teal-700 to-emerald-900",
      tagline: "Best Price Guaranteed • Zero Bargaining",
      badgeColor: "bg-emerald-500/30 text-emerald-200 border-emerald-400/30",
      image:
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      badge: "Super Sale • Up to 60% Off",
      title: "Buy Certified Refurbished Flagships",
      subtitle:
        "Inspected with 32-Point Quality Checklist • 12-Month SELBAR Warranty • 15-Day Return",
      ctaText: "Shop Refurbished Phones",
      ctaHref: "/buy?category=old-phone",
      secondaryText: "View All Deals",
      secondaryHref: "/buy",
      bgGradient: "from-teal-800 via-cyan-800 to-slate-900",
      tagline: "iPhone 14 from ₹39,999 • Galaxy S23 from ₹38,999",
      badgeColor: "bg-amber-400/20 text-amber-200 border-amber-400/30",
      image:
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      badge: "Express Laptop Buyback",
      title: "Sell Old Laptop & MacBooks",
      subtitle:
        "Highest Resale Valuation in India • Safe NIST 800-88 Data Sanitization • Free Pickup",
      ctaText: "Sell Old Laptop",
      ctaHref: "/sell?category=laptop",
      secondaryText: "Browse Refurb Laptops",
      secondaryHref: "/buy?category=old-laptop",
      bgGradient: "from-blue-900 via-indigo-900 to-slate-950",
      tagline: "MacBook, ThinkPad, Dell, HP & ASUS",
      badgeColor: "bg-blue-400/20 text-blue-200 border-blue-400/30",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: 4,
      badge: "30-Minute Express Fix",
      title: "Mobile Screen & Battery Repair",
      subtitle:
        "Expert Certified Lab Technicians • 100% Original OEM Display • 6-Month Warranty",
      ctaText: "Book Device Repair",
      ctaHref: "/repair",
      secondaryText: "Check Repair Cost",
      secondaryHref: "/repair",
      bgGradient: "from-rose-900 via-pink-900 to-slate-950",
      tagline: "Screen, Battery, Speaker, Camera & Mic Fixes",
      badgeColor: "bg-rose-400/20 text-rose-200 border-rose-400/30",
      image:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    },
  ];

  // Hero Slider Auto-rotation
  useEffect(() => {
    if (isSliderHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isSliderHovered, HERO_SLIDES.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  // 2. CASHIFY EXACT SERVICES GRID (16 Items Matching User Screenshot)
  const SERVICES_GRID = [
    // Row 1
    {
      id: "sell-phone",
      title: "Sell Phone",
      image: "/images/services/sell-phone.svg",
      href: "/sell",
    },
    {
      id: "buy-gadgets",
      title: "Buy Gadgets",
      image: "/images/services/buy-gadgets.svg",
      href: "/buy",
    },
    {
      id: "buy-phone",
      title: "Buy Phone",
      image: "/images/services/buy-phone.svg",
      href: "/buy?category=old-phone",
    },
    {
      id: "buy-laptops",
      title: "Buy Laptops",
      image: "/images/services/buy-laptops.svg",
      href: "/buy?category=old-laptop",
    },
    {
      id: "rent-ps5",
      title: "Rent PS5",
      image: "/images/services/rent-ps5.svg",
      href: "/screener",
    },
    {
      id: "buy-cameras",
      title: "Buy Cameras & Lenses",
      image: "/images/services/buy-cameras.svg",
      href: "/buy",
    },
    {
      id: "pixel-upgrade",
      title: "Pixel Upgrade",
      image: "/images/services/pixel-upgrade.svg",
      href: "/sell",
    },
    {
      id: "buy-gaming",
      title: "Buy Gaming Consoles",
      image: "/images/services/buy-gaming.svg",
      href: "/buy",
    },
    // Row 2
    {
      id: "repair-phone",
      title: "Repair Phone",
      image: "/images/services/repair-phone.svg",
      href: "/repair",
    },
    {
      id: "repair-laptop",
      title: "Repair Laptop",
      image: "/images/services/repair-laptop.svg",
      href: "/repair",
    },
    {
      id: "find-new-phone",
      title: "Find New Phone",
      image: "/images/services/find-new-phone.svg",
      href: "/buy?category=new-phone",
    },
    {
      id: "nearby-stores",
      title: "Nearby Stores",
      image: "/images/services/nearby-stores.svg",
      href: "/stores",
    },
    {
      id: "new-accessories",
      title: "New Accessories",
      image: "/images/services/new-accessories.svg",
      href: "/buy",
    },
    {
      id: "buy-smartwatches",
      title: "Buy Smartwatches",
      image: "/images/services/buy-smartwatches.svg",
      href: "/buy",
    },
    {
      id: "recycle",
      title: "Recycle",
      image: "/images/services/recycle.svg",
      href: "/recycle",
    },
    {
      id: "buy-tablets",
      title: "Buy Tablets",
      image: "/images/services/buy-tablets.svg",
      href: "/buy?category=tablet",
    },
  ];

  // 3. CART HANDLER
  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    const topGrade = product.grades?.[0] || {
      grade: product.conditionType === "new" ? "brand-new" : "superb",
      price: product.price || 0,
      originalMrp: product.originalMrp || product.price || 0,
    };
    const price = topGrade.price || product.price || 0;
    const mrp = topGrade.originalMrp || product.originalMrp || price;

    addItem({
      id: `${product.id || product.slug}_cart`,
      productId: product.id || product.slug,
      title: product.name,
      image:
        product.images?.[0] ||
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
      grade: topGrade.grade as ConditionGrade,
      storage: product.specs?.storage || "Standard",
      color: product.specs?.color || "Standard",
      price,
      originalMrp: mrp,
      quantity: 1,
      warrantyMonths: product.warrantyMonths || 12,
    });
    setAddedProductId(product.id || product.slug);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  // Filtered Refurbished Phones
  const phoneProducts = liveProducts.filter(
    (p) =>
      p.category === "phone" ||
      p.category === "old-phone" ||
      p.categoryGroup === "old-phone" ||
      p.category === "new-phone" ||
      p.categoryGroup === "new-phone",
  );

  // Filtered Refurbished Laptops
  const laptopProducts = liveProducts.filter(
    (p) =>
      p.category === "laptop" ||
      p.category === "old-laptop" ||
      p.categoryGroup === "old-laptop" ||
      p.category === "new-laptop" ||
      p.categoryGroup === "new-laptop",
  );

  return (
    <div className="space-y-16 pb-20 overflow-hidden bg-[#fafbfc]">
      {/* 1. HERO SECTION: FULL-WIDTH IMAGE CAROUSEL SLIDER */}
      <section
        className="relative bg-slate-950 text-white overflow-hidden"
        onMouseEnter={() => setIsSliderHovered(true)}
        onMouseLeave={() => setIsSliderHovered(false)}
      >
        <div className="relative min-h-[440px] sm:min-h-[480px] md:min-h-[500px] flex items-center">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center ${
                  isActive
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0 pointer-events-none"
                } bg-gradient-to-r ${slide.bgGradient}`}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 flex flex-col md:flex-row items-center justify-between gap-8">
                  {/* Left Text & CTA */}
                  <div className="space-y-4 max-w-xl text-center md:text-left">
                    <div
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm shadow-xs ${slide.badgeColor}`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{slide.badge}</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
                      {slide.title}
                    </h1>

                    <p className="text-xs sm:text-base text-slate-200 leading-relaxed font-normal">
                      {slide.subtitle}
                    </p>

                    <div className="text-[11px] font-semibold text-emerald-300">
                      ✓ {slide.tagline}
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                      <Link
                        href={slide.ctaHref}
                        className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 flex items-center gap-2"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <Link
                        href={slide.secondaryHref}
                        className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition backdrop-blur-sm"
                      >
                        {slide.secondaryText}
                      </Link>
                    </div>
                  </div>

                  {/* Right Image Graphic */}
                  <div className="relative w-72 sm:w-80 md:w-96 aspect-square shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition duration-500"
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Left / Right Arrow Controls */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition hover:scale-110"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition hover:scale-110"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all rounded-full ${
                  currentSlide === idx
                    ? "w-8 h-2.5 bg-emerald-400"
                    : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. OUR SERVICES (EXACT CASHIFY 2-ROW IMAGE GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            Our Services
          </h2>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 md:gap-5">
          {SERVICES_GRID.map((srv) => (
            <Link
              key={srv.id}
              href={srv.href}
              className="flex flex-col items-center group transition"
            >
              {/* Soft mint/teal card box with high-res service product photo */}
              <div className="w-full aspect-[1.12] sm:h-24 md:h-28 rounded-2xl bg-[#eef7f6] hover:bg-[#e4f3f1] border border-teal-100/60 p-2 sm:p-2.5 flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-sm">
                <img
                  src={srv.image}
                  alt={srv.title}
                  className="w-full h-full object-contain filter drop-shadow-xs transition duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              {/* Service Name below */}
              <span className="text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-emerald-700 transition-colors text-center mt-2 leading-tight">
                {srv.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. JUST FOR YOU / CATEGORY QUICK SELECTOR PILLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "all", label: "⚡ All Gadgets", href: "/buy" },
            {
              id: "new-phone",
              label: "📱 New Phones",
              href: "/buy?category=new-phone",
            },
            {
              id: "old-phone",
              label: "🔄 Refurbished Phones",
              href: "/buy?category=old-phone",
            },
            {
              id: "new-laptop",
              label: "💻 New Laptops",
              href: "/buy?category=new-laptop",
            },
            {
              id: "old-laptop",
              label: "🔄 Refurbished Laptops",
              href: "/buy?category=old-laptop",
            },
            {
              id: "new-desktop",
              label: "🖥️ New Desktops & PCs",
              href: "/buy?category=new-desktop",
            },
            {
              id: "old-desktop",
              label: "🔄 Refurbished Desktops",
              href: "/buy?category=old-desktop",
            },
            { id: "smartwatch", label: "⌚ Smartwatches", href: "/buy" },
            { id: "tablet", label: "📱 Tablets & iPads", href: "/buy" },
          ].map((pill) => (
            <Link
              key={pill.id}
              href={pill.href}
              className="px-4 py-2 rounded-2xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 transition shrink-0 shadow-2xs"
            >
              {pill.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 5. BUY REFURBISHED DEVICES (CASHIFY SCREENSHOT MATCHING ROW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            Buy Refurbished Devices
          </h2>

          <Link
            href="/buy?category=old-phone"
            className="text-xs sm:text-sm font-bold text-[#009B77] hover:text-[#007F60] hover:underline transition"
          >
            View All
          </Link>
        </div>

        <div className="relative group/carousel">
          {/* Left Floating Scroll Arrow (Only shown when scrolled right) */}
          {canScrollPhoneLeft && (
            <button
              type="button"
              onClick={() =>
                scrollCarousel(
                  phoneScrollRef,
                  "left",
                  setCanScrollPhoneLeft,
                  setCanScrollPhoneRight
                )
              }
              aria-label="Scroll refurbished devices left"
              className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200/90 shadow-md hover:shadow-lg flex items-center justify-center text-slate-800 hover:text-black transition z-20 cursor-pointer hidden sm:flex hover:scale-105 active:scale-95 animate-in fade-in duration-200"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
            </button>
          )}

          <div
            ref={phoneScrollRef}
            onScroll={() =>
              checkScrollState(
                phoneScrollRef,
                setCanScrollPhoneLeft,
                setCanScrollPhoneRight
              )
            }
            className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none scroll-smooth px-1"
          >
            {phoneProducts.slice(0, 10).map((phone) => {
              const topGrade = phone.grades?.[0] || {
                price: phone.price || 39499,
                originalMrp: phone.originalMrp || 73600,
                grade: "superb",
              };
              const price = topGrade.price || phone.price || 39499;
              const originalMrp =
                topGrade.originalMrp || phone.originalMrp || 73600;
              const discount =
                originalMrp > price
                  ? Math.round(((originalMrp - price) / originalMrp) * 100)
                  : 0;
              const savings =
                originalMrp > price ? originalMrp - price : 10000;
              const ratingVal = phone.rating ? Number(phone.rating).toFixed(1) : "4.8";

              return (
                <Link
                  key={phone.id || phone.slug}
                  href={`/buy/${phone.slug}`}
                  className="flex flex-col justify-between w-[215px] sm:w-[235px] md:w-[245px] lg:w-[250px] shrink-0 bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 hover:shadow-md hover:border-slate-300 transition duration-200 cursor-pointer group select-none relative"
                >
                  <div>
                    {/* Top Row: Assured Badge */}
                    <div className="flex items-center justify-between min-h-[22px] mb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full border-[1.5px] border-[#009B77] flex items-center justify-center bg-white text-[#009B77] shrink-0">
                          <svg
                            className="w-3 h-3 stroke-[2.5]"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <div className="bg-black text-white px-1.5 py-0.5 rounded leading-none flex flex-col items-center">
                          <span className="text-[7px] font-black tracking-wider text-white">
                            SELBAR
                          </span>
                          <span className="text-[5px] font-bold text-slate-300 tracking-wider">
                            ASSURED
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Product Image */}
                    <div className="h-36 sm:h-40 md:h-44 w-full flex items-center justify-center p-1.5 my-1 overflow-hidden">
                      <img
                        src={phone.images?.[0]}
                        alt={phone.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Savings Green Tag */}
                    <div className="mt-2">
                      <span className="inline-block bg-[#E8F8F0] text-[#12805C] text-xs font-bold px-2 py-0.5 rounded">
                        ₹{savings.toLocaleString("en-IN")} OFF
                      </span>
                    </div>

                    {/* Product Title */}
                    <h3
                      className="font-bold text-xs sm:text-[13px] text-slate-900 leading-snug line-clamp-2 min-h-[36px] mt-1.5 group-hover:text-[#009B77] transition"
                      title={phone.name}
                    >
                      {phone.name}
                    </h3>
                  </div>

                  {/* Sale Tag, Rating & Pricing Row */}
                  <div className="mt-3 pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-[#1C3E8E] text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-tight">
                        More-Ya Sale
                      </span>
                      <div className="flex items-center gap-1 border border-slate-200 rounded px-1.5 py-0.5 text-[11px] font-bold text-slate-700 bg-white shadow-2xs">
                        <span>{ratingVal}</span>
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 mt-2 pt-0.5">
                      <span className="text-[#FF4D4F] font-bold text-sm sm:text-base">
                        -{discount}%
                      </span>
                      <span className="font-black text-slate-950 text-sm sm:text-base">
                        ₹{price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-slate-400 line-through text-xs font-normal">
                        ₹{originalMrp.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right Floating Scroll Arrow */}
          {canScrollPhoneRight && (
            <button
              type="button"
              onClick={() =>
                scrollCarousel(
                  phoneScrollRef,
                  "right",
                  setCanScrollPhoneLeft,
                  setCanScrollPhoneRight
                )
              }
              aria-label="Scroll refurbished devices right"
              className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200/90 shadow-md hover:shadow-lg flex items-center justify-center text-slate-800 hover:text-black transition z-20 cursor-pointer hidden sm:flex hover:scale-105 active:scale-95 animate-in fade-in duration-200"
            >
              <ArrowRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          )}
        </div>
      </section>

      {/* 6. REFURBISHED LAPTOPS (CASHIFY SCREENSHOT MATCHING ROW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            Refurbished Laptops
          </h2>

          <Link
            href="/buy?category=old-laptop"
            className="text-xs sm:text-sm font-bold text-[#009B77] hover:text-[#007F60] hover:underline transition"
          >
            View All
          </Link>
        </div>

        <div className="relative group/carousel">
          {/* Left Floating Scroll Arrow (Only shown when scrolled right) */}
          {canScrollLaptopLeft && (
            <button
              type="button"
              onClick={() =>
                scrollCarousel(
                  laptopScrollRef,
                  "left",
                  setCanScrollLaptopLeft,
                  setCanScrollLaptopRight
                )
              }
              aria-label="Scroll refurbished laptops left"
              className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200/90 shadow-md hover:shadow-lg flex items-center justify-center text-slate-800 hover:text-black transition z-20 cursor-pointer hidden sm:flex hover:scale-105 active:scale-95 animate-in fade-in duration-200"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
            </button>
          )}

          <div
            ref={laptopScrollRef}
            onScroll={() =>
              checkScrollState(
                laptopScrollRef,
                setCanScrollLaptopLeft,
                setCanScrollLaptopRight
              )
            }
            className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none scroll-smooth px-1"
          >
            {laptopProducts.slice(0, 10).map((laptop) => {
              const topGrade = laptop.grades?.[0] || {
                price: laptop.price || 125799,
                originalMrp: laptop.originalMrp || 180999,
                grade: "superb",
              };
              const price = topGrade.price || laptop.price || 125799;
              const originalMrp =
                topGrade.originalMrp || laptop.originalMrp || 180999;
              const discount =
                originalMrp > price
                  ? Math.round(((originalMrp - price) / originalMrp) * 100)
                  : 0;
              const savings =
                originalMrp > price ? originalMrp - price : 35000;
              const ratingVal = laptop.rating ? Number(laptop.rating).toFixed(1) : "4.8";

              // Exact database stock: check top-level product stock first, then top grade stock
              const stockLeft =
                typeof laptop.stock === "number"
                  ? laptop.stock
                  : typeof topGrade.stock === "number"
                  ? topGrade.stock
                  : 0;

              return (
                <Link
                  key={laptop.id || laptop.slug}
                  href={`/buy/${laptop.slug}`}
                  className="flex flex-col justify-between w-[215px] sm:w-[235px] md:w-[245px] lg:w-[250px] shrink-0 bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 hover:shadow-md hover:border-slate-300 transition duration-200 cursor-pointer group select-none relative"
                >
                  <div>
                    {/* Top Row: Assured Badge & Urgency Badge */}
                    <div className="flex items-center justify-between min-h-[22px] mb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full border-[1.5px] border-[#009B77] flex items-center justify-center bg-white text-[#009B77] shrink-0">
                          <svg
                            className="w-3 h-3 stroke-[2.5]"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <div className="bg-black text-white px-1.5 py-0.5 rounded leading-none flex flex-col items-center">
                          <span className="text-[7px] font-black tracking-wider text-white">
                            SELBAR
                          </span>
                          <span className="text-[5px] font-bold text-slate-300 tracking-wider">
                            ASSURED
                          </span>
                        </div>
                      </div>

                      {/* Red Urgency "X left" Badge from Database */}
                      {stockLeft > 0 && (
                        <span className="text-[11px] font-semibold text-[#FF4D4F] border border-[#FFA39E] bg-[#FFF1F0] px-2 py-0.5 rounded">
                          {stockLeft} left
                        </span>
                      )}
                    </div>

                    {/* Product Image */}
                    <div className="h-36 sm:h-40 md:h-44 w-full flex items-center justify-center p-1.5 my-1 overflow-hidden">
                      <img
                        src={laptop.images?.[0]}
                        alt={laptop.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Savings Green Tag */}
                    <div className="mt-2">
                      <span className="inline-block bg-[#E8F8F0] text-[#12805C] text-xs font-bold px-2 py-0.5 rounded">
                        ₹{savings.toLocaleString("en-IN")} OFF
                      </span>
                    </div>

                    {/* Product Title */}
                    <h3
                      className="font-bold text-xs sm:text-[13px] text-slate-900 leading-snug line-clamp-2 min-h-[36px] mt-1.5 group-hover:text-[#009B77] transition"
                      title={laptop.name}
                    >
                      {laptop.name}
                    </h3>
                  </div>

                  {/* Sale Tag, Rating & Pricing Row */}
                  <div className="mt-3 pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-[#1C3E8E] text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-tight">
                        More-Ya Sale
                      </span>
                      <div className="flex items-center gap-1 border border-slate-200 rounded px-1.5 py-0.5 text-[11px] font-bold text-slate-700 bg-white shadow-2xs">
                        <span>{ratingVal}</span>
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 mt-2 pt-0.5">
                      <span className="text-[#FF4D4F] font-bold text-sm sm:text-base">
                        -{discount}%
                      </span>
                      <span className="font-black text-slate-950 text-sm sm:text-base">
                        ₹{price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-slate-400 line-through text-xs font-normal">
                        ₹{originalMrp.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right Floating Scroll Arrow */}
          {canScrollLaptopRight && (
            <button
              type="button"
              onClick={() =>
                scrollCarousel(
                  laptopScrollRef,
                  "right",
                  setCanScrollLaptopLeft,
                  setCanScrollLaptopRight
                )
              }
              aria-label="Scroll refurbished laptops right"
              className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200/90 shadow-md hover:shadow-lg flex items-center justify-center text-slate-800 hover:text-black transition z-20 cursor-pointer hidden sm:flex hover:scale-105 active:scale-95 animate-in fade-in duration-200"
            >
              <ArrowRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          )}
        </div>
      </section>

      {/* 6.1 SELL YOUR OLD DEVICE NOW & SELL YOUR NEW DEVICE NOW */}
      <SellOldVsNewSection />

      {/* 6.5 REFURBISHED VS BRAND NEW COMPARISON SLIDER */}
      <RefurbVsNewSlider />

      {/* 6.6 AMAZON-STYLE 4-CARD FEATURE DISCOVERY GRID */}
      <AmazonFeatureCards />

      {/* 6.7 BEST SELLERS IN COMPUTERS & ACCESSORIES CAROUSEL */}
      <BestSellersAccessories />

      {/* 7. CASHIFY GREEN MIDDLE PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-3 max-w-xl z-10 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider inline-block">
              Free 2-Hour Express Pickup
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Get Instant Cash For Your Old Phone
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              No bargaining. No market trips. Enter your phone model, get a
              guaranteed price quote, and get paid instantly via UPI upon pickup.
            </p>
            <div className="pt-2">
              <Link
                href="/sell"
                className="px-6 py-3.5 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-black text-xs sm:text-sm shadow-xl transition inline-flex items-center gap-2"
              >
                <span>Check Your Phone's Exact Value ➔</span>
              </Link>
            </div>
          </div>

          <div className="w-56 sm:w-64 aspect-square shrink-0 flex items-center justify-center z-10">
            <img
              src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80"
              alt="Phone Valuation"
              className="h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* 8. HOW SELBAR WORKS (3 SIMPLE STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
            How SELBAR Buyback Works
          </h2>
          <p className="text-xs text-slate-500">
            We make selling electronics as effortless as ordering a meal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 font-black text-xl flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="font-bold text-base text-slate-950">Check Price</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Select your gadget model and answer 4 quick questions about screen
              and body condition to see your guaranteed quote.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 font-black text-xl flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="font-bold text-base text-slate-950">
              Schedule Free Pickup
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Choose your preferred date and time slot. Our verified field
              executive arrives right at your home or office.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-black text-xl flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="font-bold text-base text-slate-950">
              Get Instant Payment
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Executive conducts a 5-minute diagnostic test and transfers 100%
              agreed money to your UPI or Bank before leaving.
            </p>
          </div>
        </div>
      </section>

      {/* 9. DARK CHARCOAL TESTIMONIALS SECTION (EXACT CASHIFY SIGNATURE CONTRAST) */}
      <section className="bg-[#111827] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-emerald-400" />
                <span>4.5 / 5 Rating on Google Reviews & Trustpilot</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                Trusted by 60 Lakh+ Happy Users and Major Brands
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                <div className="text-xl font-black text-emerald-400">60L+</div>
                <div className="text-[10px] text-slate-400">
                  Devices Recommerce
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                <div className="text-xl font-black text-amber-400">
                  ₹850 Cr+
                </div>
                <div className="text-[10px] text-slate-400">Cash Disbursed</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/70 p-6 rounded-3xl border border-slate-700 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "Sold my iPhone 13 within 2 hours of placing the order. The
                  technician tested the phone and transferred ₹34,500 directly
                  to my GPay before taking the phone. Super transparent!"
                </p>
              </div>
              <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">Amitesh Ranjan</div>
                  <div className="text-[10px] text-slate-400">
                    Patna • Seller
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  Verified Seller
                </span>
              </div>
            </div>

            <div className="bg-slate-800/70 p-6 rounded-3xl border border-slate-700 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "Purchased a refurbished Galaxy S23 from Selbar. Honestly, I
                  couldn't find a single scratch. Battery health is 98%, and
                  came with an official 1-year warranty card. Saved ₹36,000!"
                </p>
              </div>
              <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">Sneha Kapoor</div>
                  <div className="text-[10px] text-slate-400">
                    Noida • Buyer
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold">
                  Verified Buyer
                </span>
              </div>
            </div>

            <div className="bg-slate-800/70 p-6 rounded-3xl border border-slate-700 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "Got my cracked OnePlus 11 screen repaired at my office
                  reception in 25 minutes. Touch response is flawless and got 6
                  months warranty. Highly recommended."
                </p>
              </div>
              <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">Rohit Verma</div>
                  <div className="text-[10px] text-slate-400">
                    Bengaluru • Repair
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                  Certified Repair
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. BRAND PARTNERS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
          Certified Recommerce For All Major Brands
        </div>

        <BrandMarquee />
      </section>

      {/* 11. SELBAR EXCLUSIVES & PROMO DEALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-950">
          Selbar Exclusives
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 space-y-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[10px] font-extrabold uppercase">
              Exchange Bonus
            </span>
            <h3 className="font-bold text-sm text-slate-950">
              Extra ₹2,500 on Flagships
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Exchange any old iPhone or Galaxy S series and get an additional
              ₹2,500 cashback credit.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 space-y-2">
            <span className="px-2 py-0.5 rounded-md bg-blue-200 text-blue-900 text-[10px] font-extrabold uppercase">
              Student Special
            </span>
            <h3 className="font-bold text-sm text-slate-950">
              10% Off on Laptops
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verified college students get an extra 10% discount on all
              certified ThinkPads and MacBooks.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 space-y-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 text-[10px] font-extrabold uppercase">
              App Only Deal
            </span>
            <h3 className="font-bold text-sm text-slate-950">
              ₹500 App Welcome Bonus
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Download the SELBAR mobile app and get a ₹500 instant voucher on
              your first buyback order.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/80 space-y-2">
            <span className="px-2 py-0.5 rounded-md bg-purple-200 text-purple-900 text-[10px] font-extrabold uppercase">
              B2B Enterprise
            </span>
            <h3 className="font-bold text-sm text-slate-950">
              Corporate IT Buyback
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Selling company laptops in bulk? Get GST invoice, bulk evaluation,
              and priority logistics.
            </p>
          </div>
        </div>
      </section>

      {/* 11.5 SUSTAINABLE ECO-IMPACT METRICS */}
      <EcoImpactCounter />

      {/* 11.8 VERIFIED CUSTOMER REVIEWS CAROUSEL */}
      <CustomerReviewsCarousel />

      {/* 11.9 PRODUCT UNBOXING & HANDS-ON VIDEO REVIEWS (BEFORE FAQ) */}
      <ProductUnboxingReviews />

      {/* 12. FREQUENTLY ASKED QUESTIONS */}
      <FaqSection />

      {/* 13. TECH BUZZ / ARTICLES & NEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">
              Tech Buzz & News
            </h2>
            <p className="text-xs text-slate-500">
              Guides, gadget comparisons, and smart tips
            </p>
          </div>
          <Link
            href="/faq"
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            Read More Articles ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3 p-4">
            <div className="h-44 w-full rounded-2xl overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80"
                alt="iPhone 16 vs 15"
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
              Gadget Comparison • 4 min read
            </div>
            <h3 className="font-bold text-sm text-slate-950 leading-snug">
              iPhone 16 Pro vs iPhone 15 Pro: Is the Camera & Battery Upgrade
              Worth It?
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              We break down the real world performance differences, titanium
              durability, and resale value depreciation.
            </p>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3 p-4">
            <div className="h-44 w-full rounded-2xl overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80"
                alt="Refurbished Laptops"
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>
            <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
              Buying Guide • 5 min read
            </div>
            <h3 className="font-bold text-sm text-slate-950 leading-snug">
              Top 5 Refurbished Laptops Under ₹30,000 for Students in India
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              Why business laptops like Lenovo ThinkPads and Dell Latitudes
              outperform budget new plastic laptops.
            </p>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3 p-4">
            <div className="h-44 w-full rounded-2xl overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80"
                alt="Data Security"
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>
            <div className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
              Privacy & Security • 3 min read
            </div>
            <h3 className="font-bold text-sm text-slate-950 leading-snug">
              Military-Grade NIST 800-88 Data Wiping: How SELBAR Protects Your
              Privacy
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              Simple factory reset does not delete your photos permanently.
              Learn how professional digital sanitization works.
            </p>
          </div>
        </div>
      </section>

      {/* 14. MOBILE APP DOWNLOAD BANNER */}
      <section
        id="download-app"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-4 max-w-lg z-10 text-center md:text-left">
            <span className="px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider inline-block">
              SELBAR Mobile App
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Download The SELBAR App
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Book doorstep pickups in 60 seconds, get exclusive flash discounts
              on refurbished gadgets, and track your cash payout in real-time.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <div
                role="button"
                onClick={() =>
                  alert("SELBAR Android App is under active development and will be live on Google Play Store soon!")
                }
                className="px-5 py-3 rounded-2xl bg-white text-slate-950 font-bold text-xs shadow-lg flex items-center gap-3 border border-white/60 hover:bg-slate-50 transition cursor-pointer select-none"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186A2.296 2.296 0 0 1 3 20.615V3.385c0-.623.23-1.19.609-1.571z" fill="#00E676"/>
                  <path d="M17.18 8.613L4.85 1.488a2.316 2.316 0 0 0-1.241-.326l10.183 10.838 3.388-3.387z" fill="#FF3D00"/>
                  <path d="M17.18 15.387l-3.388-3.387L3.609 22.838c.38.083.795-.015 1.241-.326l12.33-7.125z" fill="#FFD600"/>
                  <path d="M21.575 11.082l-4.395-2.469-3.388 3.387 3.388 3.387 4.395-2.469c.813-.47.813-1.366 0-1.836z" fill="#00B0FF"/>
                </svg>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold leading-none">GET IT ON</div>
                  <div className="text-sm font-black text-slate-900 leading-tight">Google Play</div>
                </div>
                <span className="ml-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider border border-amber-200">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 z-10">
            {/* QR Code */}
            <div className="hidden sm:flex flex-col items-center bg-white p-4 rounded-3xl text-slate-900 shadow-xl space-y-2">
              <QrCode className="w-24 h-24 text-slate-900" />
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Android • Soon
              </span>
            </div>

            <div className="w-44 sm:w-52 aspect-square flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&auto=format&fit=crop&q=80"
                alt="SELBAR App on Phone"
                className="h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 15. RECOMMERCE & BUYBACK GUIDE SECTION (BEFORE FOOTER) */}
      <RecommerceGuide />

      {/* LIVE RECENT ACTIVITY FLOATING TICKER */}
      <LiveActivityTicker />
    </div>
  );
}
