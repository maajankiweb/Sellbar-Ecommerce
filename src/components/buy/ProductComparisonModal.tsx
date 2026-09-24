'use client';

import React from 'react';
import { X, Check, ShieldCheck, Cpu, Battery, Camera, HardDrive, Smartphone, Scale } from 'lucide-react';
import { RefurbProduct } from '@/types';

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: any[];
  onRemoveProduct: (id: string) => void;
}

export default function ProductComparisonModal({
  isOpen,
  onClose,
  products,
  onRemoveProduct,
}: ProductComparisonModalProps) {
  if (!isOpen || products.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Side-by-Side Device Comparison</h3>
              <p className="text-[11px] text-slate-500">Compare technical specifications, condition grades, and pricing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Products Summary Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="hidden sm:flex flex-col justify-end p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-xs font-bold text-slate-400">
              Technical Specification
            </div>

            {products.map((prod) => {
              const bestGrade = prod.grades?.[0] || { price: prod.price || 0, originalMrp: prod.originalMrp || 0 };
              return (
                <div key={prod.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs relative flex flex-col items-center text-center">
                  <button
                    onClick={() => onRemoveProduct(prod.id)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 rounded-full hover:bg-rose-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <img
                    src={prod.images?.[0] || prod.image || '/images/phone-placeholder.png'}
                    alt={prod.name}
                    className="w-24 h-24 object-contain mb-3"
                  />
                  <h4 className="text-xs font-black text-slate-900 line-clamp-2">{prod.name}</h4>
                  <div className="mt-2 text-sm font-extrabold text-emerald-700">
                    ₹{bestGrade.price.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400 line-through">
                    ₹{bestGrade.originalMrp.toLocaleString('en-IN')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Specs Table */}
          <div className="space-y-3 text-xs">
            {/* Processor */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-2.5 border-b border-slate-100 items-center">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                <span>Processor</span>
              </span>
              {products.map((prod) => (
                <span key={prod.id} className="text-slate-800 font-medium">
                  {prod.specs?.processor || 'Flagship Octa-Core Processor'}
                </span>
              ))}
            </div>

            {/* RAM & Storage */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-2.5 border-b border-slate-100 items-center">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
                <span>RAM & Storage</span>
              </span>
              {products.map((prod) => (
                <span key={prod.id} className="text-slate-800 font-medium">
                  {prod.specs?.ram || '8 GB'} RAM / {prod.specs?.storage || '128 GB'}
                </span>
              ))}
            </div>

            {/* Display */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-2.5 border-b border-slate-100 items-center">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Display</span>
              </span>
              {products.map((prod) => (
                <span key={prod.id} className="text-slate-800 font-medium">
                  {prod.specs?.screen || '120Hz Super AMOLED Display'}
                </span>
              ))}
            </div>

            {/* Camera */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-2.5 border-b border-slate-100 items-center">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                <span>Camera</span>
              </span>
              {products.map((prod) => (
                <span key={prod.id} className="text-slate-800 font-medium">
                  {prod.specs?.camera || 'Pro Ultra-Clear Quad/Triple Camera'}
                </span>
              ))}
            </div>

            {/* Battery */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-2.5 border-b border-slate-100 items-center">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Battery className="w-3.5 h-3.5 text-emerald-600" />
                <span>Battery</span>
              </span>
              {products.map((prod) => (
                <span key={prod.id} className="text-slate-800 font-medium">
                  {prod.specs?.battery || 'All-Day Fast Charging Battery'}
                </span>
              ))}
            </div>

            {/* Warranty & Return Window */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-2.5 border-b border-slate-100 items-center">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Policy</span>
              </span>
              {products.map((prod) => (
                <span key={prod.id} className="text-emerald-700 font-bold">
                  {prod.warrantyMonths || 12} Mo Warranty + {prod.replacementDays || 5}-Day Replacement
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
          >
            Done Comparing
          </button>
        </div>
      </div>
    </div>
  );
}
