'use client';

import React from 'react';

interface BrandItem {
  name: string;
  category: string;
  renderLogo: () => React.ReactNode;
}

const BRANDS: BrandItem[] = [
  {
    name: 'Apple',
    category: 'iPhones & MacBooks',
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 fill-slate-900 group-hover:fill-black transition-colors" viewBox="0 0 170 170">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.66-7.86-11.89-14.45-5.35-8.33-9.58-17.78-12.7-28.36-3.12-10.58-4.68-20.73-4.68-30.45 0-12.63 3.36-23.33 10.08-32.1 6.72-8.77 15.22-13.28 25.5-13.52 4.9.11 10.37 1.35 16.42 3.73 6.05 2.37 9.87 3.65 11.45 3.82 2.39-.42 6.35-1.74 11.87-3.95 5.52-2.22 10.6-3.23 15.23-3.04 8.79.44 16.32 3.12 22.59 8.04 6.27 4.92 10.74 11.3 13.41 19.14-7.85 4.74-11.72 11.24-11.61 19.5.11 7.42 3.01 13.62 8.71 18.6 5.7 4.98 12.35 7.74 19.95 8.28-1.5 4.88-3.37 10.08-5.61 15.61zM119.22 33.19c0-6.19 2.22-11.96 6.67-17.3 4.45-5.34 9.94-8.83 16.47-10.47.53 1.3.8 2.65.8 4.05 0 6.07-2.3 11.82-6.9 17.26-4.6 5.44-10.15 8.87-16.65 10.29-.14-1.27-.39-2.54-.39-3.83z" />
        </svg>
        <span className="font-bold text-sm text-slate-900 tracking-tight">Apple</span>
      </div>
    )
  },
  {
    name: 'Samsung',
    category: 'Galaxy Series',
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-black text-xs tracking-widest uppercase shadow-xs">
          SAMSUNG
        </span>
      </div>
    )
  },
  {
    name: 'OnePlus',
    category: 'Flagships & Nord',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-xs bg-red-600 text-white flex items-center justify-center font-black text-xs">
          1+
        </div>
        <span className="font-black text-sm text-slate-900 tracking-wider">ONEPLUS</span>
      </div>
    )
  },
  {
    name: 'Xiaomi',
    category: 'Redmi & Xiaomi',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center font-black text-[11px] shadow-xs">
          mi
        </div>
        <span className="font-extrabold text-sm text-slate-900 tracking-tight">Xiaomi</span>
      </div>
    )
  },
  {
    name: 'Vivo',
    category: 'V & X Series',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <span className="font-black text-base text-blue-600 tracking-tight lowercase font-sans">
          vivo
        </span>
      </div>
    )
  },
  {
    name: 'Oppo',
    category: 'Reno & Find',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <span className="font-black text-sm tracking-widest text-emerald-700 uppercase font-mono">
          OPPO
        </span>
      </div>
    )
  },
  {
    name: 'Realme',
    category: 'GT & Number Series',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-xs bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
          r
        </div>
        <span className="font-black text-sm text-slate-900 lowercase tracking-normal">
          realme
        </span>
      </div>
    )
  },
  {
    name: 'Google Pixel',
    category: 'Pixel & Tensor',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27A7.18 7.18 0 0 1 4.9 12c0-.79.14-1.57.38-2.27V6.58H1.25A11.97 11.97 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15C6.23 6.85 8.88 4.75 12 4.75z"
          />
        </svg>
        <span className="font-bold text-sm text-slate-900 tracking-tight">Google Pixel</span>
      </div>
    )
  },
  {
    name: 'HP',
    category: 'Pavilion & Envy',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <div className="w-6 h-6 rounded-full bg-sky-700 text-white flex items-center justify-center font-bold text-xs italic">
          hp
        </div>
        <span className="font-bold text-sm text-slate-900 tracking-tight">HP Laptops</span>
      </div>
    )
  },
  {
    name: 'Lenovo',
    category: 'ThinkPad & IdeaPad',
    renderLogo: () => (
      <div className="flex items-center">
        <span className="px-2 py-0.5 bg-red-600 text-white font-bold text-xs tracking-wider">
          Lenovo
        </span>
      </div>
    )
  },
  {
    name: 'Dell',
    category: 'XPS & Inspiron',
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <div className="w-6 h-6 rounded-full border-2 border-sky-800 text-sky-800 flex items-center justify-center font-black text-[10px] tracking-tight">
          DELL
        </div>
        <span className="font-extrabold text-sm text-slate-900">Dell</span>
      </div>
    )
  },
  {
    name: 'ASUS',
    category: 'ROG & ZenBook',
    renderLogo: () => (
      <div className="flex items-center">
        <span className="font-black text-sm tracking-widest text-slate-900 uppercase font-mono">
          ASUS
        </span>
      </div>
    )
  }
];

export function BrandMarquee() {
  return (
    <div className="relative w-full overflow-hidden py-3">
      {/* Gradient Mask on Left (Smooth Fade) */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-slate-100 via-slate-100/80 to-transparent z-10" />

      {/* Gradient Mask on Right (Smooth Fade) */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-slate-100 via-slate-100/80 to-transparent z-10" />

      {/* Infinite Scrolling Track (Right to Left) */}
      <div className="animate-marquee-infinite flex items-center gap-4 sm:gap-6 py-1">
        {/* Set 1 */}
        {BRANDS.map((brand) => (
          <div
            key={`brand-1-${brand.name}`}
            className="group flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 shrink-0 cursor-default select-none"
          >
            {brand.renderLogo()}
            <span className="hidden sm:inline-block text-[11px] font-medium text-slate-400 pl-1 border-l border-slate-200">
              {brand.category}
            </span>
          </div>
        ))}

        {/* Duplicate Set 2 for 100% Seamless Infinite Loop */}
        {BRANDS.map((brand) => (
          <div
            key={`brand-2-${brand.name}`}
            className="group flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 shrink-0 cursor-default select-none"
          >
            {brand.renderLogo()}
            <span className="hidden sm:inline-block text-[11px] font-medium text-slate-400 pl-1 border-l border-slate-200">
              {brand.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
