'use client';

import React, { useState } from 'react';
import {
  Star,
  Check,
  ShieldCheck,
  Sparkles,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Sliders,
  Cpu,
  BatteryCharging,
  Eye,
  Camera,
  Layers,
  CheckCircle2,
} from 'lucide-react';

/* =========================================================================
   ECOMMERCE 8: OBJECT PRODUCT PAGE WITH CROSSFADING GALLERY,
   LAYOUT-ANIMATED FINISH SWATCHES, TABULAR SPEC SHEET & QUANTITY-AWARE ADD TO BAG
   React Bits Pro Block Specification
   ========================================================================= */

interface FinishOption {
  id: string;
  name: string;
  hex: string;
  image: string;
  availableStock: number;
}

const DEFAULT_FINISHES: FinishOption[] = [
  {
    id: 'natural-titanium',
    name: 'Natural Titanium',
    hex: '#969188',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&auto=format&fit=crop&q=80',
    availableStock: 2,
  },
  {
    id: 'blue-titanium',
    name: 'Blue Titanium',
    hex: '#3b444c',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&auto=format&fit=crop&q=80',
    availableStock: 4,
  },
  {
    id: 'white-titanium',
    name: 'White Titanium',
    hex: '#f2f1ed',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&auto=format&fit=crop&q=80',
    availableStock: 1,
  },
  {
    id: 'black-titanium',
    name: 'Black Titanium',
    hex: '#2d2d2e',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=900&auto=format&fit=crop&q=80',
    availableStock: 3,
  },
];

export interface Ecommerce8Props {
  product?: any;
  onAddToCart?: (quantity: number, finish: FinishOption) => void;
  mode?: 'full' | 'specs-only';
}

export function Ecommerce8({ product, onAddToCart, mode = 'full' }: Ecommerce8Props = {}) {
  // Build finishes from product images if provided
  const finishes: FinishOption[] = React.useMemo(() => {
    if (product?.images && product.images.length > 0) {
      const colorName = product?.specs?.color || 'Titanium Slate';
      return product.images.map((img: string, idx: number) => ({
        id: `finish-${idx}`,
        name: idx === 0 ? colorName : `${colorName} View ${idx + 1}`,
        hex: idx === 0 ? '#1f2937' : idx === 1 ? '#475569' : idx === 2 ? '#94a3b8' : '#e2e8f0',
        image: img,
        availableStock: Math.max(1, (product.stock || 4) - idx),
      }));
    }
    return DEFAULT_FINISHES;
  }, [product]);

  const [activeFinish, setActiveFinish] = useState<FinishOption>(finishes[0] || DEFAULT_FINISHES[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'diagnostics'>('specs');
  const [addedNotice, setAddedNotice] = useState(false);

  // Sync active finish when product changes
  React.useEffect(() => {
    if (finishes.length > 0) {
      setActiveFinish(finishes[0]);
    }
  }, [finishes]);

  const productName = product?.name || 'Apple iPhone 15 Pro Max (Refurbished Flagship)';
  const unitPrice = product?.price || 78999;
  const originalPrice = product?.originalMrp || Math.round(unitPrice * 1.45);
  const totalPrice = unitPrice * quantity;

  const specSheet = React.useMemo(() => {
    return [
      { label: 'Processor', value: product?.specs?.processor || 'Apple A17 Pro / Flagship Octa-Core' },
      { label: 'Display & Screen', value: product?.specs?.screen || '6.7-inch Super Retina XDR OLED (120Hz)' },
      { label: 'RAM & Memory', value: product?.specs?.ram || '8GB High-Speed LPDDR5X' },
      { label: 'Storage', value: product?.specs?.storage || '128GB / 256GB UFS 4.0 Storage' },
      { label: 'Battery Capacity', value: product?.specs?.battery ? `${product.specs.battery} (OEM Battery Health Verified)` : '4,422 mAh (95%+ OEM Health)' },
      { label: 'Main Camera', value: product?.specs?.camera || '48MP Quad-Pixel with 5x Optical Telephoto' },
      { label: 'Condition Grade', value: product?.conditionType === 'new' ? 'Brand New Sealed Pack' : 'Superb (Grade A) - 100% Functional' },
      { label: 'Warranty & Testing', value: `${product?.warrantyMonths || 12} Months SELBAR Full Coverage • 32-Point Certified` },
      { label: 'Doorstep Return', value: `${product?.replacementDays || 15} Days Easy Return & Doorstep Replacement` },
    ];
  }, [product]);

  const handleIncrement = () => {
    if (quantity < (activeFinish.availableStock || 5)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(quantity, activeFinish);
    }
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  if (mode === 'specs-only') {
    return (
      <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 lg:p-10 my-4 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-[#00a599] uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#00a599]" />
              Hardware Architecture & QC Audit
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Technical Specifications & Diagnostics
            </h2>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>32-Point Inspected</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Finish & Gallery Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl bg-gradient-to-b from-slate-100/80 via-slate-50 to-slate-100/80 border border-slate-200/80 p-6 flex items-center justify-center overflow-hidden shadow-inner">
              <img
                key={activeFinish.id}
                src={activeFinish.image}
                alt={activeFinish.name}
                className="max-h-[85%] max-w-[85%] object-contain drop-shadow-xl transition-all duration-300"
              />
              <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold">
                Finish: {activeFinish.name}
              </div>
            </div>

            {/* Finishes selection */}
            {finishes.length > 1 && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">Available OEM Finishes:</span>
                <div className="flex flex-wrap gap-2">
                  {finishes.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setActiveFinish(f)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 cursor-pointer transition ${
                        activeFinish.id === f.id
                          ? 'border-[#00a599] bg-white text-[#00a599] ring-2 ring-[#00a599]/20 font-bold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-300" style={{ backgroundColor: f.hex }} />
                      <span>{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tabular Spec Sheet & Diagnostics */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`text-xs font-bold pb-2 transition cursor-pointer border-b-2 -mb-2 ${
                  activeTab === 'specs'
                    ? 'border-[#00a599] text-[#00a599]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Tabular Spec Sheet
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('diagnostics')}
                className={`text-xs font-bold pb-2 transition cursor-pointer border-b-2 -mb-2 ${
                  activeTab === 'diagnostics'
                    ? 'border-[#00a599] text-[#00a599]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                32-Point Audit Card
              </button>
            </div>

            {activeTab === 'specs' ? (
              <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left divide-y divide-slate-100">
                  <tbody className="divide-y divide-slate-100">
                    {specSheet.map((spec, idx) => (
                      <tr key={spec.label} className={idx % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'}>
                        <td className="py-2.5 px-4 font-bold text-slate-700 w-2/5">
                          {spec.label}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600 font-medium">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>SELBAR 32-Point Automated Diagnostics Verified</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Every device undergoes hardware validation for biometric enclaves (FaceID / TouchID), OEM display digitizer, dual optical image stabilization, battery discharge health, 5G carrier bands, and thermal dissipation.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> 100% Genuine OEM Parts</span>
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Factory Data Sanitized</span>
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Battery Health 85%+</span>
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> CPCB E-Waste Certified</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-8 lg:p-10 my-6 space-y-8">
      {/* SECTION BANNER */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold text-[#00a599] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00a599]" />
            Ecommerce 8 Block • Object Showcase & Hardware Spec Sheet
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            {productName}
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Certified Recommerce</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* =================================================================
            LEFT: CROSSFADING GALLERY (6 Cols)
            ================================================================= */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Object Showcase with Crossfading Transition */}
          <div className="relative aspect-square w-full rounded-3xl bg-gradient-to-b from-slate-100/80 via-slate-50 to-slate-100/80 border border-slate-200/80 p-8 flex items-center justify-center overflow-hidden shadow-inner">
            {/* Live Crossfading Gallery Image */}
            <img
              key={activeFinish.id}
              src={activeFinish.image}
              alt={`iPhone 15 Pro Max in ${activeFinish.name}`}
              className="max-h-[85%] max-w-[85%] object-contain drop-shadow-2xl transition-all duration-500 animate-in fade-in-0 zoom-in-95"
            />

            {/* Floating Finish Label */}
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold shadow-md">
              Finish: {activeFinish.name}
            </div>

            {/* Scarcity Low Stock Pill */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
              Only {activeFinish.availableStock} in stock
            </div>
          </div>

          {/* LAYOUT-ANIMATED FINISH SWATCHES */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">Choose Titanium Finish</span>
              <span className="text-slate-500 font-medium">Grade A Superb</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {finishes.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setActiveFinish(f);
                    setQuantity(1);
                  }}
                  className={`p-2.5 rounded-xl border-2 transition-all flex items-center gap-2.5 cursor-pointer ${
                    activeFinish.id === f.id
                      ? 'border-[#00a599] bg-white ring-2 ring-[#00a599]/20 shadow-xs'
                      : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-slate-300 shrink-0 shadow-2xs"
                    style={{ backgroundColor: f.hex }}
                  />
                  <div className="text-left overflow-hidden">
                    <span className="text-xs font-bold text-slate-800 block truncate">
                      {f.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-400 block leading-none">
                      {f.availableStock} left
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* =================================================================
            RIGHT: SPECS, QUANTITY-AWARE ADD TO BAG & TABULAR SHEET (6 Cols)
            ================================================================= */}
        <div className="lg:col-span-6 space-y-6">
          {/* Title & Pricing */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-500 text-xs font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-slate-900 font-black">{product?.rating || 4.9}</span>
              <span className="text-slate-400 font-normal">({product?.reviewCount || 340} verified recommerce buyers)</span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl sm:text-4xl font-black text-slate-950">
                    ₹{unitPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-base text-slate-400 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-xs font-bold text-emerald-600 mt-1">
                  You save ₹{(originalPrice - unitPrice).toLocaleString('en-IN')} ({Math.round(((originalPrice - unitPrice) / originalPrice) * 100)}% off retail)
                </div>
              </div>

              <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                Free Express Ship
              </span>
            </div>
          </div>

          {/* QUANTITY-AWARE ADD TO BAG MODULE */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Select Quantity</span>
                <span className="text-[11px] text-slate-500">
                  Maximum {activeFinish.availableStock} units allowed per customer
                </span>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center bg-white border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-black text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= activeFinish.availableStock}
                  className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Total Subtotal & Action CTA */}
            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Subtotal</span>
                <div className="text-xl font-black text-slate-900">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </div>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 py-3 px-5 rounded-xl bg-[#00a599] hover:bg-[#008f84] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                Add {quantity} to Bag • ₹{totalPrice.toLocaleString('en-IN')}
              </button>
            </div>

            {addedNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 text-center animate-in fade-in">
                ✓ Successfully added {quantity} unit(s) to your bag!
              </div>
            )}
          </div>

          {/* TABULAR SPEC SHEET & DIAGNOSTIC AUDIT */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`text-xs font-bold pb-1 transition cursor-pointer border-b-2 -mb-2 ${
                  activeTab === 'specs'
                    ? 'border-[#00a599] text-[#00a599]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Tabular Spec Sheet
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('diagnostics')}
                className={`text-xs font-bold pb-1 transition cursor-pointer border-b-2 -mb-2 ${
                  activeTab === 'diagnostics'
                    ? 'border-[#00a599] text-[#00a599]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                32-Point Audit Card
              </button>
            </div>

            {activeTab === 'specs' ? (
              <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left divide-y divide-slate-100">
                  <tbody className="divide-y divide-slate-100">
                    {specSheet.map((spec, idx) => (
                      <tr key={spec.label} className={idx % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'}>
                        <td className="py-2.5 px-4 font-bold text-slate-700 w-1/3">
                          {spec.label}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>SELBAR 32-Point Automated Diagnostics Passed</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  All OEM sensors, TrueDepth cameras, 5G baseband chips, OLED brightness levels, and battery thermal sensors match original factory tolerances. 100% certified genuine parts.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ecommerce8;
