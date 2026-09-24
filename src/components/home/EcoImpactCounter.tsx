'use client';

import React from 'react';
import { Recycle, Droplets, HeartHandshake, Sparkles, Award } from 'lucide-react';

export function EcoImpactCounter() {
  const metrics = [
    {
      id: 'm-1',
      icon: Recycle,
      value: '14,800+ kg',
      label: 'E-Waste Diverted',
      subtext: 'Prevented hazardous heavy metal landfill pollution',
      color: 'emerald',
    },
    {
      id: 'm-2',
      icon: Droplets,
      value: '34,200+ L',
      label: 'Clean Water Conserved',
      subtext: 'Saved from raw semiconductor microchip manufacturing',
      color: 'blue',
    },
    {
      id: 'm-3',
      icon: HeartHandshake,
      value: '50,000+',
      label: 'Devices Recommerce Life',
      subtext: 'Phones & laptops extended with 12M warranty',
      color: 'teal',
    },
    {
      id: 'm-4',
      icon: Award,
      value: '₹12.5 Cr+',
      label: 'Cash Returned to Sellers',
      subtext: 'Transparent doorstep UPI valuations paid directly',
      color: 'amber',
    },
  ];

  return (
    <section className="w-full py-12 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sustainable Circular Economy</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Our Collective Environmental & Community Impact
            </h3>
          </div>
          <div className="text-xs text-slate-400 text-center sm:text-right">
            <span>Official DPDP & E-Waste Rules 2022 Certified</span>
          </div>
        </div>

        {/* 4 Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-2 hover:bg-white/10 transition-colors backdrop-blur-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {m.value}
                </div>
                <div className="text-xs font-bold text-emerald-400">
                  {m.label}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {m.subtext}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default EcoImpactCounter;
