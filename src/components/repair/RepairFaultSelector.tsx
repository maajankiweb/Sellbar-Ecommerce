'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Sparkles,
  Layers,
  Battery,
  Camera,
  Volume2,
  Cpu,
  Wrench,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface PartFault {
  id: string;
  name: string;
  category: string;
  hotspot: { x: number; y: number }; // percentage coords on wireframe
  symptoms: string[];
  durationMinutes: number;
  oemPrice: number;
  compatiblePrice: number;
  oemWarranty: string;
  compatibleWarranty: string;
  description: string;
}

const SMARTPHONE_PARTS: PartFault[] = [
  {
    id: 'display',
    name: 'OLED / Touch Display Assembly',
    category: 'Screen & Touch',
    hotspot: { x: 50, y: 38 },
    symptoms: ['Cracked front glass', 'Vertical green lines', 'Touch unresponsive / ghost touch', 'Black ink spots'],
    durationMinutes: 30,
    oemPrice: 2899,
    compatiblePrice: 1599,
    oemWarranty: '6 Months Replacement',
    compatibleWarranty: '3 Months Replacement',
    description: 'Factory-calibrated OLED / AMOLED screen with 120Hz smooth refresh rate and true-tone color reproduction.',
  },
  {
    id: 'battery',
    name: 'High-Capacity Lithium Battery Cell',
    category: 'Power Subsystem',
    hotspot: { x: 50, y: 56 },
    symptoms: ['Fast battery draining', 'Phone shuts down at 20%', 'Device overheating while charging', 'Swollen back cover'],
    durationMinutes: 20,
    oemPrice: 1499,
    compatiblePrice: 999,
    oemWarranty: '12 Months Replacement',
    compatibleWarranty: '6 Months Replacement',
    description: 'High-density safety-certified battery restored to 100% maximum capacity and 800+ charge cycles.',
  },
  {
    id: 'camera',
    name: 'Rear Triple Camera & Sapphire Glass',
    category: 'Optics & Sensor',
    hotspot: { x: 30, y: 18 },
    symptoms: ['Blurry photos / no autofocus', 'Cracked camera lens glass', 'Camera app crashes or shows black screen', 'Shaky OIS optical motor'],
    durationMinutes: 25,
    oemPrice: 1899,
    compatiblePrice: 1199,
    oemWarranty: '6 Months Replacement',
    compatibleWarranty: '3 Months Replacement',
    description: 'Original precision lens optics with optical image stabilization (OIS) and dust-free chamber sealing.',
  },
  {
    id: 'charging',
    name: 'USB-C Charging Port & Mic Sub-Board',
    category: 'Charging Port',
    hotspot: { x: 50, y: 88 },
    symptoms: ['Cable falls out / loose fit', 'Slow or intermittent charging', 'Microphone voice muffled on calls', 'Headphone jack not detected'],
    durationMinutes: 25,
    oemPrice: 899,
    compatiblePrice: 599,
    oemWarranty: '6 Months Replacement',
    compatibleWarranty: '3 Months Replacement',
    description: 'Reinforced gold-plated USB-C connector board with dual noise-cancelling primary call microphone.',
  },
  {
    id: 'speaker',
    name: 'Stereo Loudspeaker & Earpiece',
    category: 'Audio System',
    hotspot: { x: 70, y: 88 },
    symptoms: ['Distorted or crackling sound', 'Very low earpiece call volume', 'No ringtone or media audio'],
    durationMinutes: 20,
    oemPrice: 749,
    compatiblePrice: 499,
    oemWarranty: '6 Months Replacement',
    compatibleWarranty: '3 Months Replacement',
    description: 'Acoustic dynamic speaker driver tuned for clear high frequencies and punchy bass resonance.',
  },
  {
    id: 'motherboard',
    name: 'Logic Board & Power IC Chip',
    category: 'Micro-Soldering',
    hotspot: { x: 50, y: 28 },
    symptoms: ['Dead phone / will not turn on', 'Restart loop on logo', 'Water damage / short circuit', 'Wi-Fi or Bluetooth greyed out'],
    durationMinutes: 60,
    oemPrice: 2499,
    compatiblePrice: 1699,
    oemWarranty: '3 Months Warranty',
    compatibleWarranty: '1 Month Warranty',
    description: 'Level-3 precision SMD micro-soldering and thermal thermal pad replacement by master electronics engineers.',
  },
];

interface RepairFaultSelectorProps {
  onSelectFault?: (fault: PartFault, tier: 'oem' | 'compatible') => void;
}

export default function RepairFaultSelector({ onSelectFault }: RepairFaultSelectorProps) {
  const [selectedPart, setSelectedPart] = useState<PartFault>(SMARTPHONE_PARTS[0]);
  const [selectedTier, setSelectedTier] = useState<'oem' | 'compatible'>('oem');
  const [bookedSuccess, setBookedSuccess] = useState(false);

  const activePrice = selectedTier === 'oem' ? selectedPart.oemPrice : selectedPart.compatiblePrice;
  const activeWarranty = selectedTier === 'oem' ? selectedPart.oemWarranty : selectedPart.compatibleWarranty;

  const handleBookNow = () => {
    if (onSelectFault) {
      onSelectFault(selectedPart, selectedTier);
    }
    setBookedSuccess(true);
    setTimeout(() => setBookedSuccess(false), 4000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden p-6 sm:p-10 space-y-8">
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Fault Anatomy Explorer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Diagnose Your Device & Compare Part Pricing
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tap any hotspot on the smartphone diagram to inspect faulty hardware, symptoms, and transparent pricing.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 text-xs">
          <Clock className="w-4 h-4 text-emerald-600" />
          <div>
            <div className="font-bold text-slate-900">Express In 30 Mins</div>
            <div className="text-[10px] text-slate-500">Tested with OEM quality parts</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive Wireframe Phone Diagram (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-64 h-[440px] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-white/10 select-none">
            {/* Phone Bezel & Screen Area */}
            <div className="relative w-full h-full bg-slate-900/90 rounded-[34px] overflow-hidden border border-slate-700/60 p-4 flex flex-col justify-between">
              {/* Dynamic Island / Camera Notch */}
              <div className="w-20 h-4 bg-black rounded-full mx-auto shadow-inner flex items-center justify-end px-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
              </div>

              {/* Wireframe Internal Schematic Overlay */}
              <div className="absolute inset-4 rounded-2xl border border-dashed border-emerald-500/20 pointer-events-none flex flex-col justify-around opacity-40">
                <div className="h-20 border-b border-dashed border-emerald-500/20"></div>
                <div className="h-28 border-b border-dashed border-emerald-500/20"></div>
                <div className="h-16"></div>
              </div>

              {/* Hotspot Pins */}
              {SMARTPHONE_PARTS.map((part) => {
                const isSelected = selectedPart.id === part.id;
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => setSelectedPart(part)}
                    style={{ left: `${part.hotspot.x}%`, top: `${part.hotspot.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-transform ${
                      isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                    }`}
                    title={part.name}
                  >
                    <span className="relative flex h-8 w-8 items-center justify-center">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          isSelected ? 'bg-emerald-400' : 'bg-slate-400'
                        }`}
                      ></span>
                      <span
                        className={`relative inline-flex items-center justify-center rounded-full h-7 w-7 text-[10px] font-black shadow-lg border-2 ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-white ring-2 ring-emerald-400/50'
                            : 'bg-white text-slate-900 border-slate-300'
                        }`}
                      >
                        {part.id === 'display' && <Layers className="w-3.5 h-3.5" />}
                        {part.id === 'battery' && <Battery className="w-3.5 h-3.5" />}
                        {part.id === 'camera' && <Camera className="w-3.5 h-3.5" />}
                        {part.id === 'charging' && <Wrench className="w-3.5 h-3.5" />}
                        {part.id === 'speaker' && <Volume2 className="w-3.5 h-3.5" />}
                        {part.id === 'motherboard' && <Cpu className="w-3.5 h-3.5" />}
                      </span>
                    </span>
                  </button>
                );
              })}

              {/* Bottom Home Indicator Bar */}
              <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto"></div>
            </div>
          </div>

          {/* Quick part selector pill list */}
          <div className="flex flex-wrap gap-1.5 justify-center mt-4 max-w-sm">
            {SMARTPHONE_PARTS.map((part) => (
              <button
                key={part.id}
                onClick={() => setSelectedPart(part)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                  selectedPart.id === part.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {part.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Detailed Diagnostics & Part Pricing Calculator (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50/70 rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-6">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              {selectedPart.category}
            </div>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">
              {selectedPart.name}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {selectedPart.description}
            </p>
          </div>

          {/* Common Symptoms Checklist */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <span className="text-[11px] font-bold text-slate-900 block">
              Common Defect Symptoms:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedPart.symptoms.map((symptom, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{symptom}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Part Tier Selector: OEM Genuine vs Compatible High-Grade */}
          <div>
            <span className="text-xs font-bold text-slate-800 mb-2.5 block">
              Select Replacement Component Grade:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* OEM Genuine */}
              <button
                type="button"
                onClick={() => setSelectedTier('oem')}
                className={`p-4 rounded-2xl border text-left transition relative ${
                  selectedTier === 'oem'
                    ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white/60 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase">
                    ⭐ Recommended
                  </span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedTier === 'oem' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'}`}>
                    {selectedTier === 'oem' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                  </div>
                </div>
                <div className="font-black text-sm text-slate-900">OEM Factory Original</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Original manufacturer specs & calibration</div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-base font-black text-slate-950">₹{selectedPart.oemPrice.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-emerald-700 font-bold">• {selectedPart.oemWarranty}</span>
                </div>
              </button>

              {/* Compatible High-Grade */}
              <button
                type="button"
                onClick={() => setSelectedTier('compatible')}
                className={`p-4 rounded-2xl border text-left transition relative ${
                  selectedTier === 'compatible'
                    ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white/60 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase">
                    💡 Budget Pick
                  </span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedTier === 'compatible' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'}`}>
                    {selectedTier === 'compatible' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                  </div>
                </div>
                <div className="font-black text-sm text-slate-900">Compatible Grade-A</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Lab-tested high quality aftermarket</div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-base font-black text-slate-950">₹{selectedPart.compatiblePrice.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-emerald-700 font-bold">• {selectedPart.compatibleWarranty}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Pricing & Booking Action Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Estimated All-Inclusive Repair Fee</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-950">₹{activePrice.toLocaleString('en-IN')}</span>
                <span className="text-xs text-slate-500 line-through">₹{(activePrice * 1.4).toFixed(0)}</span>
                <span className="text-xs text-emerald-600 font-bold">Includes Labor & Parts Warranty</span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Estimated repair time: {selectedPart.durationMinutes} mins</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBookNow}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 shrink-0"
            >
              <span>{bookedSuccess ? '✓ Booking Initiated' : 'Book Device Repair'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {bookedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold animate-in fade-in flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Great! Your repair fault profile for {selectedPart.name} is saved. Scroll down to select your service appointment.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
