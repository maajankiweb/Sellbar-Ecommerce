'use client';

import React from 'react';
import Link from 'next/link';

export function AmazonFeatureCards() {
  return (
    <section className="w-full py-6 sm:py-8 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4-Card Quad Grid with Purple Ambient Column Accents */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
          {/* CARD 1: Get your game on (Gaming Consoles & PCs - Single Large Hero Image) */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
            {/* Soft purple accent bar on left */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 via-fuchsia-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div>
              <h3 className="text-lg sm:text-[21px] font-extrabold text-slate-900 leading-snug tracking-tight mb-3">
                Get your game on
              </h3>

              <Link href="/buy?category=gaming" className="block overflow-hidden rounded-lg bg-purple-50/60 relative aspect-square sm:h-[268px] w-full group/img">
                <img
                  src="https://images.unsplash.com/photo-1612287233207-68b329486c4f?w=700&auto=format&fit=crop&q=80"
                  alt="Get your game on - Gaming console controller, headset, and laptop setup"
                  className="w-full h-full object-cover group-hover/img:scale-104 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/20 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
              </Link>
            </div>

            <div className="pt-4 mt-auto">
              <Link
                href="/buy?category=gaming"
                className="text-xs sm:text-[13px] font-semibold text-[#007185] hover:text-[#c7511f] hover:underline inline-flex items-center gap-1 transition-colors"
              >
                <span>Shop gaming</span>
              </Link>
            </div>
          </div>

          {/* CARD 2: Refurbished Tech under ₹9,999 (2x2 Grid - 100% Electronics) */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 via-fuchsia-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div>
              <h3 className="text-lg sm:text-[21px] font-extrabold text-slate-900 leading-snug tracking-tight mb-3">
                Certified Tech under ₹9,999
              </h3>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {/* Item 1: Smartwatch */}
                <Link href="/buy?category=smartwatch" className="group/item block">
                  <div className="aspect-square bg-slate-50 rounded-md overflow-hidden mb-1 flex items-center justify-center p-1">
                    <img
                      src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=350&auto=format&fit=crop&q=80"
                      alt="Smartwatches"
                      className="w-full h-full object-cover rounded group-hover/item:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-800 font-medium leading-tight block group-hover/item:text-[#007185] transition-colors">
                    Smartwatches
                  </span>
                </Link>

                {/* Item 2: Wireless Earbuds */}
                <Link href="/buy?category=audio" className="group/item block">
                  <div className="aspect-square bg-slate-50 rounded-md overflow-hidden mb-1 flex items-center justify-center p-1">
                    <img
                      src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=350&auto=format&fit=crop&q=80"
                      alt="Wireless Earbuds"
                      className="w-full h-full object-cover rounded group-hover/item:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-800 font-medium leading-tight block group-hover/item:text-[#007185] transition-colors">
                    Wireless Earbuds
                  </span>
                </Link>

                {/* Item 3: Tablets */}
                <Link href="/buy?category=tablet" className="group/item block">
                  <div className="aspect-square bg-slate-50 rounded-md overflow-hidden mb-1 flex items-center justify-center p-1">
                    <img
                      src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=350&auto=format&fit=crop&q=80"
                      alt="Tablets & iPads"
                      className="w-full h-full object-cover rounded group-hover/item:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-800 font-medium leading-tight block group-hover/item:text-[#007185] transition-colors">
                    Tablets & iPads
                  </span>
                </Link>

                {/* Item 4: Smart Speakers */}
                <Link href="/buy?category=speakers" className="group/item block">
                  <div className="aspect-square bg-slate-50 rounded-md overflow-hidden mb-1 flex items-center justify-center p-1">
                    <img
                      src="https://images.unsplash.com/photo-1543512214-318c7553f230?w=350&auto=format&fit=crop&q=80"
                      alt="Smart Speakers"
                      className="w-full h-full object-cover rounded group-hover/item:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-800 font-medium leading-tight block group-hover/item:text-[#007185] transition-colors">
                    Smart Speakers
                  </span>
                </Link>
              </div>
            </div>

            <div className="pt-4 mt-auto">
              <Link
                href="/buy"
                className="text-xs sm:text-[13px] font-semibold text-[#007185] hover:text-[#c7511f] hover:underline inline-flex items-center gap-1 transition-colors"
              >
                <span>Shop budget electronics</span>
              </Link>
            </div>
          </div>

          {/* CARD 3: Top categories in Electronics (1 Top Wide + 3 Small Bottom - 100% Electronics) */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 via-fuchsia-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div>
              <h3 className="text-lg sm:text-[21px] font-extrabold text-slate-900 leading-snug tracking-tight mb-3">
                Top categories in Electronics
              </h3>

              {/* Top Large Feature Image: Laptops */}
              <Link href="/buy?category=old-laptop" className="group/top block mb-3">
                <div className="h-32 sm:h-36 w-full rounded-md overflow-hidden bg-slate-100 mb-1">
                  <img
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80"
                    alt="MacBooks & Laptops"
                    className="w-full h-full object-cover group-hover/top:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[11px] sm:text-xs text-slate-800 font-medium block group-hover/top:text-[#007185] transition-colors">
                  MacBooks & Laptops
                </span>
              </Link>

              {/* Bottom 3 Mini Columns: Phones, TVs, Cameras */}
              <div className="grid grid-cols-3 gap-2">
                <Link href="/buy?category=old-phone" className="group/sub block text-center">
                  <div className="aspect-square bg-slate-100 rounded-md overflow-hidden mb-1">
                    <img
                      src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=250&auto=format&fit=crop&q=80"
                      alt="Phones"
                      className="w-full h-full object-cover group-hover/sub:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-800 font-medium block truncate group-hover/sub:text-[#007185] transition-colors">
                    Phones
                  </span>
                </Link>

                <Link href="/buy?category=tv" className="group/sub block text-center">
                  <div className="aspect-square bg-slate-100 rounded-md overflow-hidden mb-1">
                    <img
                      src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=250&auto=format&fit=crop&q=80"
                      alt="Smart TVs"
                      className="w-full h-full object-cover group-hover/sub:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-800 font-medium block truncate group-hover/sub:text-[#007185] transition-colors">
                    Smart TVs
                  </span>
                </Link>

                <Link href="/buy?category=cameras" className="group/sub block text-center">
                  <div className="aspect-square bg-slate-100 rounded-md overflow-hidden mb-1">
                    <img
                      src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=250&auto=format&fit=crop&q=80"
                      alt="Cameras"
                      className="w-full h-full object-cover group-hover/sub:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-800 font-medium block truncate group-hover/sub:text-[#007185] transition-colors">
                    Cameras
                  </span>
                </Link>
              </div>
            </div>

            <div className="pt-4 mt-auto">
              <Link
                href="/buy"
                className="text-xs sm:text-[13px] font-semibold text-[#007185] hover:text-[#c7511f] hover:underline inline-flex items-center gap-1 transition-colors"
              >
                <span>Explore all categories</span>
              </Link>
            </div>
          </div>

          {/* CARD 4: Sell Old Gadgets for Instant Cash (2x2 Grid - 100% Selling Electronics Devices) */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 via-fuchsia-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div>
              <h3 className="text-lg sm:text-[21px] font-extrabold text-slate-900 leading-snug tracking-tight mb-3">
                Sell Old Gadgets for Cash
              </h3>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {/* Item 1: Sell Phone */}
                <Link href="/sell?category=phone" className="group/item block">
                  <div className="aspect-square bg-slate-50 rounded-md overflow-hidden mb-1 flex items-center justify-center p-1">
                    <img
                      src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=350&auto=format&fit=crop&q=80"
                      alt="Sell Phone"
                      className="w-full h-full object-cover rounded group-hover/item:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-800 font-medium leading-tight block group-hover/item:text-[#007185] transition-colors">
                    Sell Phone
                  </span>
                </Link>

                {/* Item 2: Sell Laptop */}
                <Link href="/sell?category=laptop" className="group/item block">
                  <div className="aspect-square bg-slate-50 rounded-md overflow-hidden mb-1 flex items-center justify-center p-1">
                    <img
                      src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=350&auto=format&fit=crop&q=80"
                      alt="Sell Laptop"
                      className="w-full h-full object-cover rounded group-hover/item:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-800 font-medium leading-tight block group-hover/item:text-[#007185] transition-colors">
                    Sell Laptop
                  </span>
                </Link>

                {/* Item 3: Sell Tablet */}
                <Link href="/sell?category=tablet" className="group/item block">
                  <div className="aspect-square bg-slate-50 rounded-md overflow-hidden mb-1 flex items-center justify-center p-1">
                    <img
                      src="https://images.unsplash.com/photo-1561154464-82e9adf32764?w=350&auto=format&fit=crop&q=80"
                      alt="Sell Tablet"
                      className="w-full h-full object-cover rounded group-hover/item:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-800 font-medium leading-tight block group-hover/item:text-[#007185] transition-colors">
                    Sell Tablet
                  </span>
                </Link>

                {/* Item 4: Sell Smartwatch */}
                <Link href="/sell?category=smartwatch" className="group/item block">
                  <div className="aspect-square bg-slate-50 rounded-md overflow-hidden mb-1 flex items-center justify-center p-1">
                    <img
                      src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=350&auto=format&fit=crop&q=80"
                      alt="Sell Smartwatch"
                      className="w-full h-full object-cover rounded group-hover/item:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-800 font-medium leading-tight block group-hover/item:text-[#007185] transition-colors">
                    Sell Smartwatch
                  </span>
                </Link>
              </div>
            </div>

            <div className="pt-4 mt-auto">
              <Link
                href="/sell"
                className="text-xs sm:text-[13px] font-semibold text-[#007185] hover:text-[#c7511f] hover:underline inline-flex items-center gap-1 transition-colors"
              >
                <span>Check valuation now</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
