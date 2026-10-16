'use client';

import React from 'react';
import { Star, ShieldCheck, HeartHandshake, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export interface CustomerStory {
  id: string;
  name: string;
  avatar?: string;
  city: string;
  device: string;
  action: 'sold' | 'bought';
  rating: number;
  date: string;
  comment: string;
}

interface CustomerReviewsCarouselProps {
  stories?: CustomerStory[];
}

export function CustomerReviewsCarousel({ stories = [] }: CustomerReviewsCarouselProps) {
  // Honest state: If no verified reviews exist in DB, display an honest empty state
  const hasRealReviews = stories.length > 0;

  return (
    <section className="w-full py-16 bg-slate-50 border-t border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Customer Feedback</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Real Experiences from Real Customers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Every review on Sellbar is tied to a genuine, completed Sell or Buy order. No fake ratings, zero fabricated testimonials.
          </p>
        </div>

        {hasRealReviews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: story.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">{story.date}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">&ldquo;{story.comment}&rdquo;</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{story.name}</span>
                    <span className="text-slate-400 ml-1.5">({story.city})</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold">{story.device}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-xs">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Verified Reviews Awaiting Initial Orders
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We believe in 100% transparent commerce. Verified customer reviews will appear here once initial completed orders are rated by sellers and buyers.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/sell"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
              >
                Sell Your Phone
              </Link>
              <Link
                href="/buy"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs transition"
              >
                Explore Refurbished
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default CustomerReviewsCarousel;
