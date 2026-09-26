'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BRANDS, MODELS } from '@/lib/db/data';
import {
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface CategoryOption {
  id: 'phone' | 'laptop' | 'tablet' | 'watch';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'phone', label: 'Mobile Phone', icon: Smartphone },
  { id: 'laptop', label: 'Laptop', icon: Laptop },
  { id: 'tablet', label: 'Tablet', icon: Tablet },
  { id: 'watch', label: 'Smartwatch', icon: Watch },
];

export function HeroInstantValuation() {
  const [selectedCategory, setSelectedCategory] = useState<'phone' | 'laptop' | 'tablet' | 'watch'>('phone');
  const [selectedBrandId, setSelectedBrandId] = useState<string>('apple');
  const [selectedModelId, setSelectedModelId] = useState<string>('iphone-14');
  const [selectedVariantId, setSelectedVariantId] = useState<string>('i14-128');

  // Filter available brands for current category
  const availableBrands = useMemo(() => {
    return BRANDS.filter((b) => b.category === selectedCategory);
  }, [selectedCategory]);

  // Filter models for selected brand
  const availableModels = useMemo(() => {
    return MODELS.filter(
      (m) => m.brandId === selectedBrandId && (selectedCategory === 'phone' || m.category === selectedCategory)
    );
  }, [selectedBrandId, selectedCategory]);

  // Current model & variant
  const currentModel = useMemo(() => {
    return availableModels.find((m) => m.id === selectedModelId) || availableModels[0] || MODELS[0];
  }, [availableModels, selectedModelId]);

  const currentVariant = useMemo(() => {
    if (!currentModel?.variants || currentModel.variants.length === 0) return null;
    return currentModel.variants.find((v) => v.id === selectedVariantId) || currentModel.variants[0];
  }, [currentModel, selectedVariantId]);

  // Auto-switch brand when category changes if current brand not in list
  const handleCategoryChange = (catId: 'phone' | 'laptop' | 'tablet' | 'watch') => {
    setSelectedCategory(catId);
    const brandsInCat = BRANDS.filter((b) => b.category === catId);
    if (brandsInCat.length > 0) {
      const nextBrand = brandsInCat[0].id;
      setSelectedBrandId(nextBrand);
      const modelsInBrand = MODELS.filter((m) => m.brandId === nextBrand);
      if (modelsInBrand.length > 0) {
        setSelectedModelId(modelsInBrand[0].id);
        if (modelsInBrand[0].variants.length > 0) {
          setSelectedVariantId(modelsInBrand[0].variants[0].id);
        }
      }
    }
  };

  const handleBrandChange = (brandId: string) => {
    setSelectedBrandId(brandId);
    const modelsInBrand = MODELS.filter((m) => m.brandId === brandId);
    if (modelsInBrand.length > 0) {
      setSelectedModelId(modelsInBrand[0].id);
      if (modelsInBrand[0].variants.length > 0) {
        setSelectedVariantId(modelsInBrand[0].variants[0].id);
      }
    }
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);
    const model = MODELS.find((m) => m.id === modelId);
    if (model && model.variants.length > 0) {
      setSelectedVariantId(model.variants[0].id);
    }
  };

  const estimatedValue = currentVariant ? currentVariant.basePrice : 36500;
  const festiveBonus = 1500;
  const totalValuation = estimatedValue + festiveBonus;

  return (
    <div className="w-full max-w-5xl mx-auto -mt-6 sm:-mt-8 md:-mt-10 px-4 sm:px-6 relative z-30">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-emerald-950/20 text-white">
        {/* Top Header & Trust Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Instant Device Valuation
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Select your device in 3 clicks & calculate exact doorstep cash value
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> 72-Hour Price Lock
            </span>
            <span className="inline-flex items-center gap-1 text-teal-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> NIST 800-88 Wiped
            </span>
          </div>
        </div>

        {/* 1. Category Switcher Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 pb-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 border ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30 scale-[1.02]'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* 2. Three Dropdown Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 pb-5">
          {/* Dropdown 1: Brand */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Step 1: Brand
            </label>
            <div className="relative">
              <select
                value={selectedBrandId}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition cursor-pointer appearance-none"
              >
                {availableBrands.map((brand) => (
                  <option key={brand.id} value={brand.id} className="bg-slate-900 text-white">
                    {brand.logo} {brand.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                ▼
              </div>
            </div>
          </div>

          {/* Dropdown 2: Model */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Step 2: Model
            </label>
            <div className="relative">
              <select
                value={selectedModelId}
                onChange={(e) => handleModelChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition cursor-pointer appearance-none"
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                ▼
              </div>
            </div>
          </div>

          {/* Dropdown 3: Variant */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Step 3: Storage Variant
            </label>
            <div className="relative">
              <select
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition cursor-pointer appearance-none"
              >
                {currentModel?.variants?.map((v) => (
                  <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                    {v.storage} {v.ram ? `(${v.ram} RAM)` : ''}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* 3. Valuation Output & Direct Sell CTA */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            {currentModel?.imageUrl && (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-900 border border-slate-700 p-1 shrink-0 overflow-hidden hidden sm:flex items-center justify-center">
                <img
                  src={currentModel.imageUrl}
                  alt={currentModel.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Estimated Cash Value:</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <TrendingUp className="w-3 h-3" /> Includes ₹{festiveBonus} Bonus
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  ₹{totalValuation.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  ₹{(totalValuation * 0.85).toFixed(0)} (Market avg)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                For {currentModel?.name} {currentVariant?.storage} in working condition
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href={`/sell?brand=${selectedBrandId}&model=${selectedModelId}`}
              className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition transform hover:-translate-y-0.5"
            >
              <span>Get Exact Quote & Sell Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
