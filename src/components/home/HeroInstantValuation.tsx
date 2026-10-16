'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BRANDS, MODELS } from '@/lib/db/data';
import {
  Smartphone,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export function HeroInstantValuation() {
  const phoneBrands = useMemo(() => {
    return BRANDS.filter((b) => b.category === 'phone' || !b.category);
  }, []);

  const [selectedBrandId, setSelectedBrandId] = useState<string>('apple');
  const [selectedModelId, setSelectedModelId] = useState<string>('iphone-14');
  const [selectedVariantId, setSelectedVariantId] = useState<string>('i14-128');

  // Filter models for selected phone brand
  const availableModels = useMemo(() => {
    return MODELS.filter((m) => m.brandId === selectedBrandId && (m.category === 'phone' || !m.category));
  }, [selectedBrandId]);

  // Current model & variant
  const currentModel = useMemo(() => {
    return availableModels.find((m) => m.id === selectedModelId) || availableModels[0] || MODELS[0];
  }, [availableModels, selectedModelId]);

  const currentVariant = useMemo(() => {
    if (!currentModel?.variants || currentModel.variants.length === 0) return null;
    return currentModel.variants.find((v) => v.id === selectedVariantId) || currentModel.variants[0];
  }, [currentModel, selectedVariantId]);

  const handleBrandChange = (brandId: string) => {
    setSelectedBrandId(brandId);
    const modelsInBrand = MODELS.filter((m) => m.brandId === brandId && (m.category === 'phone' || !m.category));
    if (modelsInBrand.length > 0) {
      setSelectedModelId(modelsInBrand[0].id);
      if (modelsInBrand[0].variants && modelsInBrand[0].variants.length > 0) {
        setSelectedVariantId(modelsInBrand[0].variants[0].id);
      }
    }
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);
    const model = MODELS.find((m) => m.id === modelId);
    if (model && model.variants && model.variants.length > 0) {
      setSelectedVariantId(model.variants[0].id);
    }
  };

  const estimatedValue = currentVariant ? currentVariant.basePrice : 36500;

  return (
    <div className="w-full max-w-5xl mx-auto -mt-6 sm:-mt-8 md:-mt-10 px-4 sm:px-6 relative z-30">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-emerald-950/20 text-white">
        {/* Top Header & Trust Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
                  Instant Phone Valuation Calculator
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Transparent Base
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Calculate estimated cash value for your phone in 3 simple steps
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Free Doorstep Pickup
            </span>
            <span className="inline-flex items-center gap-1 text-teal-400 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" /> Instant Pay at Inspection
            </span>
          </div>
        </div>

        {/* 3 Step Selectors: Brand -> Model -> Storage */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 pb-5">
          {/* Step 1: Brand */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Step 1: Phone Brand
            </label>
            <div className="relative">
              <select
                value={selectedBrandId}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition cursor-pointer appearance-none"
              >
                {phoneBrands.map((brand) => (
                  <option key={brand.id} value={brand.id} className="bg-slate-900 text-white">
                    {brand.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Step 2: Model */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Step 2: Phone Model
            </label>
            <div className="relative">
              <select
                value={selectedModelId}
                onChange={(e) => handleModelChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition cursor-pointer appearance-none"
              >
                {availableModels.length > 0 ? (
                  availableModels.map((model) => (
                    <option key={model.id} value={model.id} className="bg-slate-900 text-white">
                      {model.name} {model.releaseYear ? `(${model.releaseYear})` : ''}
                    </option>
                  ))
                ) : (
                  <option value="" disabled className="bg-slate-900 text-slate-500">
                    No models available
                  </option>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Step 3: Storage Variant */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Step 3: Storage Variant
            </label>
            <div className="relative">
              <select
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition cursor-pointer appearance-none"
              >
                {currentModel?.variants?.map((v) => (
                  <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                    {v.storage} {v.ram ? `(${v.ram} RAM)` : ''}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Valuation Output & Honest Disclosure */}
        <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full md:w-auto">
            {currentModel?.imageUrl && (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-900 border border-slate-700 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                <img
                  src={currentModel.imageUrl}
                  alt={currentModel.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div>
              <div className="text-xs font-semibold text-slate-400">
                Estimated Value for {currentModel?.name} ({currentVariant?.storage}):
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                  Up to ₹{estimatedValue.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                * Final price depends on actual physical & functional condition inspection.
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <Link
              href={`/sell?brand=${selectedBrandId}&model=${selectedModelId}`}
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition transform hover:-translate-y-0.5"
            >
              <span>Check Exact Price & Sell</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroInstantValuation;
