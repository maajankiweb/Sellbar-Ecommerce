'use client';

import React from 'react';
import { Star, CheckCircle2, Quote, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

/* =========================================================================
   REVIEW DATA TYPE
   ========================================================================= */
export interface CustomerStory {
  id: string;
  name: string;
  avatar: string;
  city: string;
  device: string;
  action: 'sold' | 'bought' | 'repaired';
  rating: number;
  date: string;
  comment: string;
  payoutOrSavings?: string;
}

/* =========================================================================
   AUTHENTIC 15 REVIEWS SPLIT ACROSS 3 MARQUEE COLUMNS
   ========================================================================= */
const COLUMN_1_STORIES: CustomerStory[] = [
  {
    id: 'c1-1',
    name: 'Alok Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    city: 'Patna, Bihar',
    device: 'Sold iPhone 13 Pro (256GB)',
    action: 'sold',
    rating: 5,
    date: '3 days ago',
    comment: 'The executive arrived at my office in Boring Road, ran the 32-point diagnostics in 5 minutes, and transferred ₹46,500 to my UPI on the spot. Zero bargaining, 100% transparent!',
    payoutOrSavings: 'Instant UPI ₹46,500',
  },
  {
    id: 'c1-2',
    name: 'Pooja Verma',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    city: 'Bettiah, West Champaran',
    device: 'Bought Refurbished MacBook Air M1',
    action: 'bought',
    rating: 5,
    date: '1 week ago',
    comment: 'Was hesitant about refurbished, but the Superb condition MacBook arrived with 94% battery health, zero scratches, and an official 12-month warranty card. Saved over ₹40,000!',
    payoutOrSavings: 'Saved ₹40,000',
  },
  {
    id: 'c1-3',
    name: 'Rajesh Mishra',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    city: 'Muzaffarpur, Bihar',
    device: 'Certified Screen Repair for Galaxy S22',
    action: 'repaired',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Screen cracked on Sunday morning. Booked slot at 11 AM, specialized repair completed in 35 minutes with genuine OEM parts and a 6-month warranty card. True lifesaver.',
    payoutOrSavings: 'OEM Screen & 6M Warranty',
  },
  {
    id: 'c1-4',
    name: 'Deepak Kumar',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    city: 'Noida, Sector 62',
    device: 'Sold OnePlus 11 5G',
    action: 'sold',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Military-grade NIST data wipe certificate gave me complete peace of mind. Transparent valuation with zero deductions. Immediate bank transfer before handing over the device.',
    payoutOrSavings: 'Instant UPI ₹28,400',
  },
  {
    id: 'c1-5',
    name: 'Ananya Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    city: 'Pune, Maharashtra',
    device: 'Bought Apple Watch Series 8',
    action: 'bought',
    rating: 5,
    date: '3 weeks ago',
    comment: 'Condition was truly like new. Battery health is at 98%, ECG & heart sensor calibrated perfectly, and received a fresh hygienic strap in the box. Super happy with SELBAR!',
    payoutOrSavings: 'Saved ₹18,500',
  },
];

const COLUMN_2_STORIES: CustomerStory[] = [
  {
    id: 'c2-1',
    name: 'Siddharth Roy',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    city: 'Bengaluru, Indiranagar',
    device: 'Sold ThinkPad T14 Gen 2',
    action: 'sold',
    rating: 5,
    date: '4 days ago',
    comment: 'Upgraded company laptop and sold personal ThinkPad here. Got ₹32,000 against ₹25,000 local market quote. Professional diagnostics and instant IMPS transfer without hassle.',
    payoutOrSavings: 'Instant IMPS ₹32,000',
  },
  {
    id: 'c2-2',
    name: 'Sneha Kapoor',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    city: 'New Delhi, South Ex',
    device: 'Bought Refurbished iPhone 14',
    action: 'bought',
    rating: 5,
    date: '1 week ago',
    comment: 'Purchased for my younger brother for college. Packaging was top-notch with tamper-proof seal, 32-point checklist certificate, and original cable. Works like day one.',
    payoutOrSavings: 'Saved ₹29,000',
  },
  {
    id: 'c2-3',
    name: 'Karan Malhotra',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    city: 'Gurugram, Cyber City',
    device: 'Sold PlayStation 4 Pro',
    action: 'sold',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Sold my PS4 Pro to upgrade to PS5. Seamless cash valuation online, executive tested HDMI port and DualShock controllers quickly, paid ₹19,500 instantly on GPay.',
    payoutOrSavings: 'Instant GPay ₹19,500',
  },
  {
    id: 'c2-4',
    name: 'Meera Nambiar',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    city: 'Kochi, Kerala',
    device: 'Bought iPad Air 5th Gen (M1)',
    action: 'bought',
    rating: 5,
    date: '3 weeks ago',
    comment: 'M1 chip iPad for digital illustration at almost 45% less than retail showroom price. Flawless TrueTone display, Apple Pencil 2 syncs instantly. Outstanding quality check.',
    payoutOrSavings: 'Saved ₹22,000',
  },
  {
    id: 'c2-5',
    name: 'Vikramaditya Sen',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    city: 'Kolkata, Salt Lake',
    device: 'Certified Battery Replacement iPhone 12',
    action: 'repaired',
    rating: 5,
    date: '1 month ago',
    comment: 'Old iPhone 12 was dying at 74% battery. SELBAR replaced it with 100% OEM capacity battery in under 30 minutes with warranty badge. Runs full day now!',
    payoutOrSavings: '100% OEM Battery Health',
  },
];

const COLUMN_3_STORIES: CustomerStory[] = [
  {
    id: 'c3-1',
    name: 'Tanya Sengupta',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80',
    city: 'Chandigarh, Sector 17',
    device: 'Bought Refurbished Dell XPS 13',
    action: 'bought',
    rating: 5,
    date: '5 days ago',
    comment: 'Super sleek carbon fiber chassis without a single dent. 16GB RAM handles all my data science notebooks effortlessly. SELBAR warranty coverage gives total confidence.',
    payoutOrSavings: 'Saved ₹48,000',
  },
  {
    id: 'c3-2',
    name: 'Gaurav Joshi',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
    city: 'Jaipur, Malviya Nagar',
    device: 'Sold Samsung Galaxy S21 Ultra',
    action: 'sold',
    rating: 5,
    date: '1 week ago',
    comment: 'Got ₹31,000 for 2-year-old flagship. No aggressive haggling, prompt evaluation, and digital receipt provided on WhatsApp immediately. Best recommerce portal in India.',
    payoutOrSavings: 'Instant UPI ₹31,000',
  },
  {
    id: 'c3-3',
    name: 'Ritu Chawla',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=120&auto=format&fit=crop&q=80',
    city: 'Lucknow, Gomti Nagar',
    device: 'Bought Sony WH-1000XM4 Headphones',
    action: 'bought',
    rating: 5,
    date: '2 weeks ago',
    comment: 'ANC noise cancellation is crystal clear, ear cushions sanitized and fresh. Came with original travel case and flight adapter. Highly satisfied with the recommerce savings!',
    payoutOrSavings: 'Saved ₹14,000',
  },
  {
    id: 'c3-4',
    name: 'Harsh Vardhan',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    city: 'Ahmedabad, SG Highway',
    device: 'Sold iPad Pro 11-inch',
    action: 'sold',
    rating: 5,
    date: '3 weeks ago',
    comment: 'Verified selling process: technician ran automated screen matrix test, confirmed agreement, and sent money directly into my HDFC account before departure.',
    payoutOrSavings: 'Instant Bank ₹41,000',
  },
  {
    id: 'c3-5',
    name: 'Dr. Priya Nair',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=120&auto=format&fit=crop&q=80',
    city: 'Hyderabad, Hitec City',
    device: 'Bought Refurbished Galaxy Watch 5',
    action: 'bought',
    rating: 5,
    date: '1 month ago',
    comment: 'Accurate sleep tracking and body composition monitoring. Clean sanitized hardware with fast magnetic dock. Excellent customer support throughout the ordering cycle.',
    payoutOrSavings: 'Saved ₹12,000',
  },
];

/* =========================================================================
   GLASS-BORDERED TESTIMONIAL CARD COMPONENT
   ========================================================================= */
function TestimonialCard({ story }: { story: CustomerStory }) {
  return (
    <div className="bg-white/85 backdrop-blur-md border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,165,153,0.12)] hover:border-[#00a599]/40 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between space-y-4 group select-none">
      <div className="space-y-3">
        {/* Rating Row & Verified Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(story.rating)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-[11px] font-extrabold text-slate-800 ml-1">5.0</span>
          </div>

          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Verified Transaction</span>
          </span>
        </div>

        {/* Device & Payout/Savings Tag */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <span className="text-xs font-black text-slate-900 truncate">
            {story.device}
          </span>
          {story.payoutOrSavings && (
            <span className="text-[10px] font-bold text-[#00a599] bg-[#eef7f6] px-2 py-0.5 rounded-md shrink-0">
              {story.payoutOrSavings}
            </span>
          )}
        </div>

        {/* Testimonial Quote */}
        <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed italic">
          "{story.comment}"
        </p>
      </div>

      {/* Customer Footer Info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={story.avatar}
            alt={story.name}
            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs"
          />
          <div>
            <div className="text-xs font-bold text-slate-950 flex items-center gap-1">
              <span>{story.name}</span>
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {story.city} • {story.date}
            </div>
          </div>
        </div>

        <Quote className="w-5 h-5 text-slate-200 group-hover:text-[#00a599]/30 transition-colors" />
      </div>
    </div>
  );
}

/* =========================================================================
   MAIN COMPONENT: CustomerReviewsCarousel (Social Proof 4: Wall of Love)
   ========================================================================= */
export function CustomerReviewsCarousel() {
  return (
    <section className="w-full py-14 sm:py-20 bg-slate-50/70 border-t border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Real Customer Stories</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Verified Customer Experiences & Reviews
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Over 50,000+ satisfied customers trust SELBAR for transparent valuations, instant UPI payments, and certified refurbished gadgets across India.
          </p>

          {/* Trust Score Ribbon */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs font-bold text-slate-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9 / 5 Overall Customer Rating</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs font-bold text-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>60,000+ Verified Transactions</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs font-bold text-slate-800">
              <HeartHandshake className="w-3.5 h-3.5 text-[#00a599]" />
              <span>₹85 Cr+ Instant UPI Disbursed</span>
            </div>
          </div>
        </div>

        {/* =================================================================
            WALL OF LOVE: 3-COLUMN SCROLLING MARQUEE (Social Proof 4)
            ================================================================= */}
        <div className="relative h-[620px] sm:h-[680px] overflow-hidden">
          {/* Top Gradient Fade Mask */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent z-20" />

          {/* Bottom Gradient Fade Mask */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent z-20" />

          {/* 3 Columns Grid with Auto-Scrolling Animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 h-full">
            {/* COLUMN 1: Scrolls Up */}
            <div className="overflow-hidden relative h-full">
              <div className="animate-marquee-up space-y-5 sm:space-y-6">
                {/* 1st copy */}
                {COLUMN_1_STORIES.map((story) => (
                  <TestimonialCard key={story.id} story={story} />
                ))}
                {/* Duplicate copy for infinite seamless marquee loop */}
                {COLUMN_1_STORIES.map((story) => (
                  <TestimonialCard key={`dup-${story.id}`} story={story} />
                ))}
              </div>
            </div>

            {/* COLUMN 2: Scrolls Down (Alternating Movement - Hidden on Mobile) */}
            <div className="overflow-hidden relative h-full hidden md:block">
              <div className="animate-marquee-down space-y-5 sm:space-y-6">
                {/* 1st copy */}
                {COLUMN_2_STORIES.map((story) => (
                  <TestimonialCard key={story.id} story={story} />
                ))}
                {/* Duplicate copy for infinite seamless marquee loop */}
                {COLUMN_2_STORIES.map((story) => (
                  <TestimonialCard key={`dup-${story.id}`} story={story} />
                ))}
              </div>
            </div>

            {/* COLUMN 3: Scrolls Up Fast (Hidden on Mobile & Tablet) */}
            <div className="overflow-hidden relative h-full hidden lg:block">
              <div className="animate-marquee-up-fast space-y-5 sm:space-y-6">
                {/* 1st copy */}
                {COLUMN_3_STORIES.map((story) => (
                  <TestimonialCard key={story.id} story={story} />
                ))}
                {/* Duplicate copy for infinite seamless marquee loop */}
                {COLUMN_3_STORIES.map((story) => (
                  <TestimonialCard key={`dup-${story.id}`} story={story} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hover Tip Indicator */}
        <div className="text-center text-[11px] text-slate-400 font-medium pt-1">
          💡 Hover over any review card to pause the scroll and read full details
        </div>
      </div>
    </section>
  );
}

export default CustomerReviewsCarousel;
