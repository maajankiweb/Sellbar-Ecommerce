'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Play,
  X,
  Star,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

/* =========================================================================
   TYPE DEFINITIONS
   ========================================================================= */
export interface UnboxingVideo {
  id: string;
  title: string;
  productName: string;
  category: 'all' | 'phones' | 'laptops' | 'wearables' | 'gaming';
  thumbnail: string;
  youtubeId: string;
  duration: string;
  views: string;
  rating: number;
  reviewCount: number;
  reviewerName: string;
  reviewerRole: string;
  reviewerAvatar: string;
  summary: string;
  pros: string[];
  cons: string[];
  refurbGrade: string;
  buyUrl: string;
  sellUrl: string;
  uploadDate: string; // ISO format for SEO VideoObject schema
}

/* =========================================================================
   CURATED UNBOXING & HANDS-ON REVIEW DATA
   ========================================================================= */
const UNBOXING_VIDEOS: UnboxingVideo[] = [
  {
    id: 'vid-1',
    title: 'Apple iPhone 14 Pro Unboxing: Superb Refurbished Condition Test',
    productName: 'Apple iPhone 14 Pro (128GB - Deep Purple)',
    category: 'phones',
    thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    youtubeId: 'xqyUdNxWazA', // iPhone unboxing & testing showcase
    duration: '4:28',
    views: '38.4K',
    rating: 4.9,
    reviewCount: 420,
    reviewerName: 'Aarav Sharma',
    reviewerRole: 'Lead QC Diagnostic Engineer',
    reviewerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    summary: 'Full unboxing inspection of a Grade A certified iPhone 14 Pro. Testing TrueTone, Dynamic Island, 120Hz ProMotion, and 94% OEM battery capacity.',
    pros: ['Pristine Ceramic Shield screen', '94% Original Battery Health', 'Full FaceID & LiDAR verified'],
    cons: ['Ships in SELBAR Eco-Kraft retail box (non-Apple box)'],
    refurbGrade: 'Grade A (Superb)',
    buyUrl: '/buy?category=old-phone&brand=Apple',
    sellUrl: '/sell?category=phone',
    uploadDate: '2026-08-15T10:00:00+05:30',
  },
  {
    id: 'vid-2',
    title: 'MacBook Air M1 in 2026: Still Worth It Refurbished?',
    productName: 'Apple MacBook Air M1 (8GB / 256GB SSD - Space Grey)',
    category: 'laptops',
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    youtubeId: 'bkW5wGzMhUo', // MacBook Air M1 performance review
    duration: '6:15',
    views: '54.2K',
    rating: 4.8,
    reviewCount: 680,
    reviewerName: 'Rohan Mehta',
    reviewerRole: 'Mac Hardware Architect',
    reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    summary: 'Complete benchmark stress test: 4K timeline rendering, 15-tab multitasking, keyboard tactile travel inspection, and 30-watt magnetic charger testing.',
    pros: ['Silent fanless thermal design', 'Battery health at 91% (148 cycles)', '1-Year SELBAR warranty card included'],
    cons: ['Maximum 1 external monitor output natively'],
    refurbGrade: 'Grade A (Superb)',
    buyUrl: '/buy?category=old-laptop&brand=Apple',
    sellUrl: '/sell?category=laptop',
    uploadDate: '2026-08-20T14:30:00+05:30',
  },
  {
    id: 'vid-3',
    title: 'Samsung Galaxy S23 5G Refurbished Unboxing & Camera Stress Test',
    productName: 'Samsung Galaxy S23 5G (128GB - Phantom Black)',
    category: 'phones',
    thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
    youtubeId: '6Z1n8qBwQYQ', // Galaxy S23 unboxing
    duration: '5:10',
    views: '29.8K',
    rating: 4.8,
    reviewCount: 310,
    reviewerName: 'Pooja Verma',
    reviewerRole: 'Mobile Imaging Specialist',
    reviewerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    summary: 'Testing the 50MP triple sensor, Snapdragon 8 Gen 2 efficiency, ultrasonic fingerprint speed, and physical chassis durability under macro lens.',
    pros: ['Compact ergonomic 6.1" form factor', '50MP crisp low-light photos', '120Hz Dynamic AMOLED display'],
    cons: ['25W charging speed is slower than Chinese flagships'],
    refurbGrade: 'Grade A+ (Like New)',
    buyUrl: '/buy?category=old-phone&brand=Samsung',
    sellUrl: '/sell?category=phone',
    uploadDate: '2026-08-28T16:00:00+05:30',
  },
  {
    id: 'vid-4',
    title: 'PlayStation 5 Disc Edition Refurbished Setup & Gameplay Run',
    productName: 'Sony PlayStation 5 Disc Console (White / Custom Plate)',
    category: 'gaming',
    thumbnail: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
    youtubeId: 'RkC0l4iekYo', // PS5 Unboxing & setup
    duration: '7:42',
    views: '61.5K',
    rating: 4.9,
    reviewCount: 890,
    reviewerName: 'Kunal Roy',
    reviewerRole: 'Console Gaming Expert',
    reviewerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    summary: 'Opening a pre-owned certified PS5: HDMI 2.1 port testing, DualSense haptic feedback inspection, 825GB high-speed SSD health audit, and disc drive eject test.',
    pros: ['DualSense controller with 0% stick drift', 'Super-quiet internal heatsink fan', 'Includes HDMI 2.1 & braided power cord'],
    cons: ['Large physical footprint for small TV cabinets'],
    refurbGrade: 'Certified Refurbished',
    buyUrl: '/buy?category=gaming',
    sellUrl: '/sell?category=gaming',
    uploadDate: '2026-09-02T11:15:00+05:30',
  },
  {
    id: 'vid-5',
    title: 'Apple Watch Series 8 Unboxing: ECG, Heart Rate & Battery Test',
    productName: 'Apple Watch Series 8 GPS (45mm - Midnight Aluminium)',
    category: 'wearables',
    thumbnail: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
    youtubeId: '4t24ZfK_fJ8', // Apple Watch Series 8 review
    duration: '3:50',
    views: '22.1K',
    rating: 4.7,
    reviewCount: 275,
    reviewerName: 'Neha Singh',
    reviewerRole: 'Wearable Tech Specialist',
    reviewerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    summary: 'Unboxing inspection with watchOS 10: testing ECG sensor electrodes, digital crown smooth rotation, screen scratch inspection, and fast magnetic puck charger.',
    pros: ['Always-On Retina display with 1000 nits', 'Blood oxygen & ECG sensors verified', 'Fresh hygienic silicone sport band'],
    cons: ['1-day battery life requires daily night charging'],
    refurbGrade: 'Grade A (Superb)',
    buyUrl: '/buy?category=smartwatch',
    sellUrl: '/sell?category=smartwatch',
    uploadDate: '2026-09-08T09:30:00+05:30',
  },
  {
    id: 'vid-6',
    title: 'Lenovo ThinkPad T14 Gen 2: Corporate Workhorse Review',
    productName: 'Lenovo ThinkPad T14 Gen 2 (Intel Core i5 - 16GB / 512GB)',
    category: 'laptops',
    thumbnail: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
    youtubeId: 'V9w9h88YI4o', // ThinkPad T14 review
    duration: '6:55',
    views: '34.7K',
    rating: 4.8,
    reviewCount: 440,
    reviewerName: 'Vikram Batra',
    reviewerRole: 'Enterprise Fleet QC Lead',
    reviewerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    summary: 'Military-spec MIL-STD-810H durability audit, dual-RAM channel memory check, spill-resistant keyboard tactile test, and thermal benchmark under heavy compile loads.',
    pros: ['Legendary ThinkPad keyboard with TrackPoint', 'Dual Thunderbolt 4 ports & full-size HDMI', 'Replaceable battery & expandable memory'],
    cons: ['Plain utilitarian matte black plastic styling'],
    refurbGrade: 'Enterprise Grade A',
    buyUrl: '/buy?category=old-laptop&brand=Lenovo',
    sellUrl: '/sell?category=laptop',
    uploadDate: '2026-09-12T13:45:00+05:30',
  },
];

/* =========================================================================
   CATEGORY TABS CONFIGURATION
   ========================================================================= */
const CATEGORY_TABS = [
  { id: 'all', label: 'All Unboxings' },
  { id: 'phones', label: 'Smartphones' },
  { id: 'laptops', label: 'Laptops & MacBooks' },
  { id: 'wearables', label: 'Smartwatches & Audio' },
  { id: 'gaming', label: 'Gaming Consoles' },
];

/* =========================================================================
   MAIN COMPONENT: ProductUnboxingReviews
   ========================================================================= */
export function ProductUnboxingReviews() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<UnboxingVideo | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter videos based on active category
  const filteredVideos =
    activeTab === 'all'
      ? UNBOXING_VIDEOS
      : UNBOXING_VIDEOS.filter((v) => v.category === activeTab);

  /* -----------------------------------------------------------------------
     SEO SCHEMA (VideoObject JSON-LD for Rich Google Video Snippets)
     ----------------------------------------------------------------------- */
  const videoObjectSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: UNBOXING_VIDEOS.map((video, index) => ({
      '@type': 'VideoObject',
      position: index + 1,
      name: video.title,
      description: video.summary,
      thumbnailUrl: [video.thumbnail],
      uploadDate: video.uploadDate,
      duration: `PT${video.duration.replace(':', 'M')}S`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${video.youtubeId}`,
      publisher: {
        '@type': 'Organization',
        name: 'SELBAR Recommerce India',
        logo: {
          '@type': 'ImageObject',
          url: 'https://selbar.in/images/logo/logo.svg',
        },
      },
    })),
  };

  return (
    <section
      id="product-unboxings"
      className="w-full py-12 sm:py-16 bg-gradient-to-b from-white via-slate-50/70 to-white border-t border-slate-200/80 relative"
      aria-label="Product Unboxing and Expert Reviews"
    >
      {/* Inject SEO VideoObject Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObjectSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* =================================================================
            1. SECTION HEADER
            ================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>32-Point Quality Diagnostics</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Product Unboxing & <span className="text-[#00a599]">Expert Reviews</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              See the exact physical condition, original OEM parts, and performance tests before buying or selling. Watch our certified QC technicians unbox live recommerce stock.
            </p>
          </div>

          {/* YouTube Channel link / reassurance badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="text-left">
                <span className="font-bold text-slate-900 block leading-tight">100% Verified Stock</span>
                <span className="text-[10px] text-slate-500">Every device tested on camera</span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================
            2. CATEGORY FILTER TABS
            ================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 pt-1">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md scale-102'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100/80 hover:text-slate-950'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* =================================================================
            3. VIDEO REVIEWS GRID (Responsive: 1 col mobile, 2 tablet, 3 desktop)
            ================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <article
              key={video.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
            >
              {/* VIDEO THUMBNAIL CONTAINER (Facade Pattern: Click to Play Modal) */}
              <div
                role="button"
                tabIndex={0}
                aria-label={`Play unboxing video: ${video.title}`}
                onClick={() => setSelectedVideo(video)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedVideo(video);
                  }
                }}
                className="relative aspect-video w-full bg-slate-900 overflow-hidden cursor-pointer select-none group/thumb"
              >
                {/* Lazy-loaded High Resolution Thumbnail */}
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover/thumb:scale-106 transition-transform duration-500 opacity-90 group-hover/thumb:opacity-100"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Top Badges (Refurb Grade & QC Passed) */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{video.refurbGrade}</span>
                  </span>

                  <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-300" />
                    <span>{video.duration}</span>
                  </span>
                </div>

                {/* Centered Pulsing Play Button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#00a599]/90 text-white flex items-center justify-center shadow-lg group-hover/thumb:scale-115 group-hover/thumb:bg-[#00a599] transition-all duration-300 ring-4 ring-white/30 backdrop-blur-xs">
                    <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom stats inside thumbnail */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] pointer-events-none">
                  <span className="flex items-center gap-1 opacity-90">
                    <Eye className="w-3 h-3" />
                    <span>{video.views}</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold text-amber-300">
                    Click to Watch
                  </span>
                </div>
              </div>

              {/* CARD DETAILS & REVIEW HIGHLIGHTS */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-4">
                <div>
                  {/* Rating & Review Count */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-slate-900 font-extrabold">{video.rating}</span>
                      <span className="text-slate-400 text-[11px] font-normal">
                        ({video.reviewCount} customer reviews)
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                      QC Verified
                    </span>
                  </div>

                  {/* Video Title */}
                  <h3
                    className="font-bold text-sm sm:text-base text-slate-900 leading-snug line-clamp-2 group-hover:text-[#00a599] transition-colors cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                    title={video.title}
                  >
                    {video.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-2">
                    {video.summary}
                  </p>

                  {/* Key Pros Highlight Chips */}
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Tested Highlights
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {video.pros.slice(0, 2).map((pro) => (
                        <span
                          key={pro}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-semibold"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                          <span className="truncate max-w-[210px]">{pro}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* BOTTOM ACTIONS: Watch Full Review & Buy/Sell CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedVideo(video)}
                    className="text-xs font-bold text-[#00a599] hover:text-[#00877d] inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Watch Full Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={video.buyUrl}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-colors shadow-2xs"
                    >
                      Buy Model
                    </Link>
                    <Link
                      href={video.sellUrl}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-colors"
                    >
                      Sell Old
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* =================================================================
            4. TRUST FOOTER BANNER
            ================================================================= */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                Want a video unboxing of your specific order before dispatch?
              </h4>
              <p className="text-xs text-slate-600">
                We share IMEI-tagged 15-second QC video previews upon request for every high-value purchase.
              </p>
            </div>
          </div>

          <Link
            href="/buy"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors shrink-0"
          >
            Explore Certified Devices ➔
          </Link>
        </div>
      </div>

      {/* =================================================================
          5. MODAL VIDEO PLAYER (Fast-Loading YouTube Embed with Backdrop Blur)
          ================================================================= */}
      {selectedVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-video-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in-0 duration-200"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Prevent clicking modal content from closing it
          >
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2 overflow-hidden pr-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <h3
                  id="modal-video-title"
                  className="text-xs sm:text-sm font-bold truncate text-slate-200"
                >
                  {selectedVideo.title}
                </h3>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                aria-label="Close video player"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player (16:9 Aspect Ratio) */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>

            {/* Modal Footer: Review Breakdown & Action CTAs */}
            <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 text-white space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-base text-white">
                    {selectedVideo.productName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="text-emerald-400 font-bold">{selectedVideo.refurbGrade}</span>
                    <span>•</span>
                    <span className="flex items-center text-amber-400">
                      ★ {selectedVideo.rating} ({selectedVideo.reviewCount} reviews)
                    </span>
                    <span>•</span>
                    <span>Reviewed by {selectedVideo.reviewerName} ({selectedVideo.reviewerRole})</span>
                  </div>
                </div>

                {/* Instant Purchase / Sell Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={selectedVideo.buyUrl}
                    onClick={() => setSelectedVideo(null)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition shadow-md"
                  >
                    Buy This Certified Model
                  </Link>
                  <Link
                    href={selectedVideo.sellUrl}
                    onClick={() => setSelectedVideo(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                  >
                    Sell Your Old Phone
                  </Link>
                </div>
              </div>

              {/* Pros & Cons Box inside Modal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                {/* Pros */}
                <div className="bg-slate-950/60 rounded-xl p-3 border border-emerald-500/20">
                  <div className="font-bold text-emerald-400 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Lab Tested Strengths (Pros)</span>
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {selectedVideo.pros.map((p) => (
                      <li key={p} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons / Attention */}
                <div className="bg-slate-950/60 rounded-xl p-3 border border-amber-500/20">
                  <div className="font-bold text-amber-400 mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Things to Note (Cons)</span>
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {selectedVideo.cons.map((c) => (
                      <li key={c} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
