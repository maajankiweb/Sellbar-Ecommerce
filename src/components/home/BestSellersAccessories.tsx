'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';

interface AccessoryItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  href: string;
}

const ACCESSORY_PRODUCTS: AccessoryItem[] = [
  {
    id: 'acc-1',
    name: 'Ailun Glass Screen Protector 2-Pack (Ultra HD Clear 9H Hardness)',
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&auto=format&fit=crop&q=80',
    price: 399,
    originalPrice: 999,
    rating: 4.6,
    reviewsCount: 14280,
    badge: '#1 Best Seller',
    href: '/buy?category=accessories',
  },
  {
    id: 'acc-2',
    name: '10FT Fast Charging USB-C to USB-C Braided Cables (2-Pack)',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80',
    price: 349,
    originalPrice: 799,
    rating: 4.7,
    reviewsCount: 9810,
    href: '/buy?category=accessories',
  },
  {
    id: 'acc-3',
    name: '20W PD Dual USB-C Fast Wall Charger Power Adapters (2-Pack)',
    image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=400&auto=format&fit=crop&q=80',
    price: 699,
    originalPrice: 1499,
    rating: 4.8,
    reviewsCount: 18450,
    badge: 'Popular',
    href: '/buy?category=accessories',
  },
  {
    id: 'acc-4',
    name: 'Slim Multi-Angle Magnetic Smart Folio Stand Case (Navy Blue)',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&auto=format&fit=crop&q=80',
    price: 899,
    originalPrice: 1899,
    rating: 4.6,
    reviewsCount: 6240,
    href: '/buy?category=accessories',
  },
  {
    id: 'acc-5',
    name: 'Shockproof Protective Laptop Sleeve Bag with Front Zipper Pocket',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80',
    price: 799,
    originalPrice: 1599,
    rating: 4.8,
    reviewsCount: 11200,
    badge: 'Top Rated',
    href: '/buy?category=accessories',
  },
  {
    id: 'acc-6',
    name: 'Premium 9H Tempered Glass Screen Guard with Alignment Frame',
    image: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=400&auto=format&fit=crop&q=80',
    price: 299,
    originalPrice: 699,
    rating: 4.5,
    reviewsCount: 4890,
    href: '/buy?category=accessories',
  },
  {
    id: 'acc-7',
    name: 'Paperfeel Matte Screen Protector for Drawing & Note-Taking with Stylus',
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&auto=format&fit=crop&q=80',
    price: 549,
    originalPrice: 1199,
    rating: 4.7,
    reviewsCount: 7350,
    badge: 'Artist Pick',
    href: '/buy?category=accessories',
  },
  {
    id: 'acc-8',
    name: 'Anker Nano 30W PIQ 3.0 Ultra-Compact Fast Wall Charger (Black)',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400&auto=format&fit=crop&q=80',
    price: 1299,
    originalPrice: 2199,
    rating: 4.9,
    reviewsCount: 21300,
    badge: 'Fast GaN',
    href: '/buy?category=accessories',
  },
];

export function BestSellersAccessories() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <section className="w-full py-8 sm:py-10 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Section Title */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Best Sellers in Computers & Accessories
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              High performance cables, chargers, cases, and protective guards
            </p>
          </div>

          <Link
            href="/buy?category=accessories"
            className="text-xs font-bold text-[#007185] hover:text-[#c7511f] hover:underline hidden sm:inline-block"
          >
            See more in Accessories ➔
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Scroll left"
              className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg hover:shadow-xl flex items-center justify-center text-slate-800 hover:text-black transition z-20 cursor-pointer hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
            </button>
          )}

          {/* Horizontal Product Strip */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto scrollbar-none py-2 px-1"
          >
            {ACCESSORY_PRODUCTS.map((item) => {
              const discount = Math.round(
                ((item.originalPrice - item.price) / item.originalPrice) * 100
              );

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="w-[180px] sm:w-[210px] shrink-0 bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl p-3 flex flex-col justify-between hover:shadow-md transition-all group/item"
                >
                  <div>
                    {/* Badge */}
                    <div className="h-5 mb-1.5 flex items-center justify-between">
                      {item.badge ? (
                        <span className="text-[10px] font-bold bg-[#FBF0E6] text-[#C45500] px-1.5 py-0.5 rounded leading-none">
                          {item.badge}
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className="text-[10px] font-bold text-[#CC0C39]">
                        -{discount}%
                      </span>
                    </div>

                    {/* Product Image */}
                    <div className="h-36 sm:h-40 w-full flex items-center justify-center p-2 mb-2 bg-slate-50/50 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain group-hover/item:scale-106 transition-transform duration-300"
                      />
                    </div>

                    {/* Title */}
                    <h3
                      className="text-xs sm:text-[13px] text-slate-900 font-medium leading-snug line-clamp-2 min-h-[34px] group-hover/item:text-[#007185] transition-colors"
                      title={item.name}
                    >
                      {item.name}
                    </h3>
                  </div>

                  {/* Rating & Price */}
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-[11px] text-slate-600 mb-1">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="ml-1 font-bold text-slate-800">{item.rating}</span>
                      </div>
                      <span className="text-slate-400 text-[10px]">
                        ({item.reviewsCount > 1000 ? `${(item.reviewsCount / 1000).toFixed(1)}k` : item.reviewsCount})
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[11px] font-bold text-slate-900">₹</span>
                      <span className="text-base sm:text-lg font-black text-slate-950">
                        {item.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-slate-400 line-through text-xs font-normal">
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Scroll right"
              className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg hover:shadow-xl flex items-center justify-center text-slate-800 hover:text-black transition z-20 cursor-pointer hover:scale-105 active:scale-95"
            >
              <ArrowRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
