'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface DeviceCategoryItem {
  id: string;
  name: string;
  icon: string;
  href: string;
  badge?: string;
}

const OLD_DEVICE_CATEGORIES: DeviceCategoryItem[] = [
  {
    id: 'phone',
    name: 'Sell Phone',
    icon: '/images/services/sell-phone.svg',
    href: '/sell?category=phone',
  },
  {
    id: 'laptop',
    name: 'Sell Laptop',
    icon: '/images/services/sell-laptop.svg',
    href: '/sell?category=laptop',
  },
  {
    id: 'tv',
    name: 'Sell TV',
    icon: '/images/services/sell-tv.svg',
    href: '/sell?category=tv',
  },
  {
    id: 'tablet',
    name: 'Sell Tablet',
    icon: '/images/services/sell-tablet.svg',
    href: '/sell?category=tablet',
  },
  {
    id: 'gaming',
    name: 'Sell Gaming Consoles',
    icon: '/images/services/sell-gaming.svg',
    href: '/sell?category=gaming',
  },
  {
    id: 'smartwatch',
    name: 'Sell Smartwatch',
    icon: '/images/services/sell-smartwatch.svg',
    href: '/sell?category=smartwatch',
  },
  {
    id: 'speakers',
    name: 'Sell Smart Speakers',
    icon: '/images/services/sell-speakers.svg',
    href: '/sell?category=speakers',
  },
  {
    id: 'more',
    name: 'Sell More',
    icon: '/images/services/sell-more.svg',
    href: '/sell',
  },
];

const NEW_DEVICE_CATEGORIES: DeviceCategoryItem[] = [
  {
    id: 'new-phone',
    name: 'Sell Phone',
    icon: '/images/services/sell-phone.svg',
    href: '/sell?category=phone&condition=new',
  },
  {
    id: 'new-laptop',
    name: 'Sell Laptop',
    icon: '/images/services/sell-laptop.svg',
    href: '/sell?category=laptop&condition=new',
  },
  {
    id: 'new-tv',
    name: 'Sell TV',
    icon: '/images/services/sell-tv.svg',
    href: '/sell?category=tv&condition=new',
  },
  {
    id: 'new-tablet',
    name: 'Sell Tablet',
    icon: '/images/services/sell-tablet.svg',
    href: '/sell?category=tablet&condition=new',
  },
  {
    id: 'new-gaming',
    name: 'Sell Gaming Consoles',
    icon: '/images/services/sell-gaming.svg',
    href: '/sell?category=gaming&condition=new',
  },
  {
    id: 'new-smartwatch',
    name: 'Sell Smartwatch',
    icon: '/images/services/sell-smartwatch.svg',
    href: '/sell?category=smartwatch&condition=new',
  },
  {
    id: 'new-speakers',
    name: 'Sell Smart Speakers',
    icon: '/images/services/sell-speakers.svg',
    href: '/sell?category=speakers&condition=new',
  },
  {
    id: 'new-more',
    name: 'Sell More',
    icon: '/images/services/sell-more.svg',
    href: '/sell?condition=new',
  },
];

export default function SellOldVsNewSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. SELL YOUR OLD DEVICE NOW */}
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Sell Your Old Device Now
          </h2>
          <Link
            href="/sell"
            className="text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-800 hover:underline"
          >
            View All &rarr;
          </Link>
        </div>

        {/* 8-Card Grid matching Cashify Design */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2.5 sm:gap-3.5 md:gap-4">
          {OLD_DEVICE_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group flex flex-col items-center focus:outline-none"
            >
              {/* Rounded Mint Container */}
              <div className="w-full aspect-[1.12] sm:h-24 md:h-28 rounded-2xl bg-[#eef7f6] group-hover:bg-[#e2f3f1] transition-all duration-200 p-2 sm:p-2.5 flex items-center justify-center group-hover:shadow-md group-hover:-translate-y-1">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={cat.icon}
                    alt={cat.name}
                    width={110}
                    height={90}
                    className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform duration-200"
                    unoptimized
                  />
                </div>
              </div>

              {/* Text Label Below Card */}
              <span className="text-xs sm:text-[13px] font-semibold text-slate-900 text-center mt-2 leading-tight tracking-tight group-hover:text-teal-700 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. SELL YOUR NEW DEVICE NOW */}
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Sell Your New Device Now
          </h2>
          <Link
            href="/sell?condition=new"
            className="text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-800 hover:underline"
          >
            View All &rarr;
          </Link>
        </div>

        {/* 8-Card Grid matching Cashify Design */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2.5 sm:gap-3.5 md:gap-4">
          {NEW_DEVICE_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group flex flex-col items-center focus:outline-none"
            >
              {/* Rounded Mint Container */}
              <div className="w-full aspect-[1.12] sm:h-24 md:h-28 rounded-2xl bg-[#eef7f6] group-hover:bg-[#e2f3f1] transition-all duration-200 p-2 sm:p-2.5 flex items-center justify-center group-hover:shadow-md group-hover:-translate-y-1">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={cat.icon}
                    alt={cat.name}
                    width={110}
                    height={90}
                    className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform duration-200"
                    unoptimized
                  />
                </div>
              </div>

              {/* Text Label Below Card */}
              <span className="text-xs sm:text-[13px] font-semibold text-slate-900 text-center mt-2 leading-tight tracking-tight group-hover:text-teal-700 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
