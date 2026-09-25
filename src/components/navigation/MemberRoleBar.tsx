'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield, Building2, Wrench, Truck, Store, User,
  ChevronDown, ExternalLink, Sparkles, Layers, X
} from 'lucide-react';

export const MEMBER_ROLES = [
  {
    role: 'Super Admin',
    badge: 'Executive',
    dashboardUrl: '/admin',
    profileUrl: '/admin/profile',
    color: 'from-blue-600 to-indigo-600',
    border: 'border-blue-500/40',
    text: 'text-blue-400',
    icon: Shield,
    description: 'System-wide control, financials, role matrix, and core catalog.',
  },
  {
    role: 'Operations Manager',
    badge: 'Hub Command',
    dashboardUrl: '/manager',
    profileUrl: '/manager/profile',
    color: 'from-amber-500 to-orange-600',
    border: 'border-amber-500/40',
    text: 'text-amber-400',
    icon: Building2,
    description: 'Warehouse shift roster, high-value trade-in approvals & stock thresholds.',
  },
  {
    role: 'Staff / QC Specialist',
    badge: 'Station Floor',
    dashboardUrl: '/staff',
    profileUrl: '/staff/profile',
    color: 'from-cyan-500 to-blue-600',
    border: 'border-cyan-500/40',
    text: 'text-cyan-400',
    icon: Wrench,
    description: 'Hardware diagnostics bench, 6-point device testing & packing intake.',
  },
  {
    role: 'Delivery Field Executive',
    badge: 'Doorstep Ops',
    dashboardUrl: '/delivery',
    profileUrl: '/delivery/profile',
    color: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-500/40',
    text: 'text-emerald-400',
    icon: Truck,
    description: 'Doorstep customer buyback visits, OTP verification & instant UPI payout.',
  },
  {
    role: 'Seller / Merchant',
    badge: 'Vendor Partner',
    dashboardUrl: '/seller',
    profileUrl: '/seller/profile',
    color: 'from-purple-600 to-indigo-600',
    border: 'border-purple-500/40',
    text: 'text-purple-400',
    icon: Store,
    description: 'Certified seller portal, catalog listings, orders, and settlements.',
  },
  {
    role: 'Customer / User',
    badge: 'Storefront Member',
    dashboardUrl: '/user',
    profileUrl: '/user/profile',
    color: 'from-emerald-600 to-cyan-600',
    border: 'border-emerald-500/40',
    text: 'text-emerald-400',
    icon: User,
    description: 'Customer panel, orders, trade-in buybacks, wallet, rewards & profile.',
  },
];

export default function MemberRoleBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Switcher Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-950/95 text-white border border-slate-700 shadow-2xl hover:scale-105 transition-all text-xs font-bold backdrop-blur-xl group"
          title="Switch Member Portals & Profiles"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Layers className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span>Member Roles & Dashboards</span>
        </button>
      )}

      {/* Expanded Modal / Drawer */}
      {isOpen && (
        <div className="w-96 max-w-[calc(100vw-2rem)] bg-slate-950/95 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl p-4 text-white animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-black">SELBAR Member Portals</div>
                <div className="text-[10px] text-slate-400">All Role Dashboards & Profiles</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {MEMBER_ROLES.map((m) => {
              const Icon = m.icon;
              const isCurrentDashboard = pathname.startsWith(m.dashboardUrl);
              const isCurrentProfile = pathname === m.profileUrl;

              return (
                <div
                  key={m.role}
                  className={`p-3 rounded-2xl border transition ${
                    isCurrentDashboard || isCurrentProfile
                      ? 'bg-slate-900 border-cyan-500/50'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${m.color} flex items-center justify-center text-white shrink-0 shadow-xs`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white leading-tight">{m.role}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{m.badge}</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    {m.description}
                  </p>

                  <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-slate-800/80">
                    <Link
                      href={m.dashboardUrl}
                      onClick={() => setIsOpen(false)}
                      className={`flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-bold text-center transition ${
                        isCurrentDashboard && !isCurrentProfile
                          ? 'bg-cyan-500 text-slate-950 font-black'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      Dashboard ({m.dashboardUrl})
                    </Link>

                    <Link
                      href={m.profileUrl}
                      onClick={() => setIsOpen(false)}
                      className={`flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-bold text-center transition ${
                        isCurrentProfile
                          ? 'bg-cyan-500 text-slate-950 font-black'
                          : 'bg-slate-800 hover:bg-slate-700 text-cyan-300'
                      }`}
                    >
                      Profile ({m.profileUrl})
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
