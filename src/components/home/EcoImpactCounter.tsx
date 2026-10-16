'use client';

import React from 'react';
import { Recycle, Droplets, HeartHandshake, Sparkles, ShieldCheck } from 'lucide-react';

export function EcoImpactCounter() {
  const pillars = [
    {
      id: 'p-1',
      icon: Recycle,
      title: 'E-Waste Reduction',
      desc: 'Extending the active lifecycle of mobile electronics to prevent toxic landfill pollution.',
      color: 'emerald',
    },
    {
      id: 'p-2',
      icon: ShieldCheck,
      title: 'Certified Sanitization',
      desc: 'Permanent cryptographic wiping of personal data before any device is re-listed.',
      color: 'teal',
    },
    {
      id: 'p-3',
      icon: HeartHandshake,
      title: 'Fair Value Exchange',
      desc: 'Direct doorstep payouts via UPI with transparent, algorithm-driven valuation.',
      color: 'blue',
    },
  ];

  return (
    <section className="w-full py-12 bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sustainable Circular Economy</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Our Circular Economy Commitment
            </h3>
          </div>
          <div className="text-xs text-slate-400 text-center sm:text-right">
            <span>Compliant with E-Waste (Management) Rules</span>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">{pillar.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default EcoImpactCounter;
