'use client';

import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Navigation,
  Phone,
  MessageSquare,
  ShieldCheck,
  Star,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  Zap,
  RotateCcw,
  UserCheck,
  AlertCircle,
} from 'lucide-react';

export interface TechnicianInfo {
  id: string;
  name: string;
  phone: string;
  rating: number;
  completedJobs: number;
  photoUrl: string;
  vehicle: string;
  vehicleNumber: string;
  badge: string;
  currentLat: number;
  currentLng: number;
}

interface LiveTechnicianTrackerProps {
  orderNumber?: string;
  customerAddress?: string;
  serviceType?: string;
  onArrived?: () => void;
}

export function LiveTechnicianTracker({
  orderNumber = 'REP-99214',
  customerAddress = 'Station Road, Bettiah, West Champaran (845438)',
  serviceType = 'Doorstep Screen Replacement (OEM Grade-A)',
  onArrived,
}: LiveTechnicianTrackerProps) {
  // 30-minute countdown simulation
  const [secondsRemaining, setSecondsRemaining] = useState<number>(1380); // 23 mins
  const [progressPercent, setProgressPercent] = useState<number>(45);
  const [currentStage, setCurrentStage] = useState<'DISPATCHED' | 'EN_ROUTE' | 'NEARBY' | 'ARRIVED'>('EN_ROUTE');
  const [isCalling, setIsCalling] = useState(false);

  const technician: TechnicianInfo = {
    id: 'TECH-409',
    name: 'Sameer Khan',
    phone: '+91 98765 12098',
    rating: 4.94,
    completedJobs: 1480,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    vehicle: 'Hero Electric Optima (Green Fleet)',
    vehicleNumber: 'BR-22-AX-8910',
    badge: 'Certified Master Technician • Police Verified',
    currentLat: 26.8021,
    currentLng: 84.5032,
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCurrentStage('ARRIVED');
          if (onArrived) onArrived();
          return 0;
        }
        const next = prev - 1;
        // update progress
        const total = 1800; // 30 mins
        const done = total - next;
        setProgressPercent(Math.min(100, Math.round((done / total) * 100)));

        if (next < 300) {
          setCurrentStage('NEARBY');
        } else if (next < 1200) {
          setCurrentStage('EN_ROUTE');
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onArrived]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedCountdown = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
      {/* Top Banner: ETA & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Navigation className="w-6 h-6 text-emerald-600 animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-wider">
                Live Doorstep Dispatch • Order #{orderNumber}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-800">
                GPS Active
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
              Technician Arriving in <span className="text-emerald-600 font-mono">{formattedCountdown}</span> mins
            </h3>
          </div>
        </div>

        <div className="text-right sm:text-right">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Est. Distance</span>
          <span className="text-sm font-black text-slate-800">1.8 km away • Smooth Traffic</span>
        </div>
      </div>

      {/* Progress Bar & Milestone Stages */}
      <div className="space-y-3">
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 h-full rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-4 text-center text-[11px] font-bold">
          <div className="text-emerald-700">1. Dispatched</div>
          <div className={`${progressPercent >= 35 ? 'text-emerald-700' : 'text-slate-400'}`}>2. On the Way</div>
          <div className={`${progressPercent >= 75 ? 'text-emerald-700' : 'text-slate-400'}`}>3. Near Doorstep</div>
          <div className={`${progressPercent >= 100 ? 'text-emerald-700' : 'text-slate-400'}`}>4. Reached</div>
        </div>
      </div>

      {/* Interactive Map Visualizer Container */}
      <div className="relative w-full h-52 sm:h-60 rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 flex items-center justify-center p-4">
        {/* Subtle Map Grid lines */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Route Line SVG Simulation */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 60 160 Q 180 80, 320 120 T 540 80"
            fill="none"
            stroke="#10b981"
            strokeWidth="4"
            strokeDasharray="6 6"
            className="animate-[dash_30s_linear_infinite]"
          />
        </svg>

        {/* Hub Pin (Start) */}
        <div className="absolute left-8 bottom-10 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-600 text-slate-300 flex items-center justify-center text-[10px] font-bold shadow-md">
            Hub
          </div>
          <span className="text-[9px] font-mono text-slate-400 mt-1">Patna Central</span>
        </div>

        {/* Moving Technician Vehicle Marker */}
        <div
          className="absolute transition-all duration-1000 flex flex-col items-center z-10"
          style={{
            left: `${Math.min(80, Math.max(15, progressPercent))}%`,
            top: '35%',
          }}
        >
          <div className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] uppercase shadow-lg shadow-emerald-500/40 mb-1 flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 fill-current" />
            <span>Sameer (EV)</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-400 border-2 border-white shadow-xl flex items-center justify-center text-slate-950">
            <Navigation className="w-5 h-5 fill-slate-950" />
          </div>
        </div>

        {/* Customer Location Pin (Destination) */}
        <div className="absolute right-8 top-10 flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-rose-600 border-2 border-white text-white flex items-center justify-center shadow-lg animate-bounce">
            <MapPin className="w-5 h-5 fill-white" />
          </div>
          <span className="text-[10px] font-bold text-white bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700 mt-1">
            Your Home
          </span>
        </div>

        {/* Map Overlay Badge */}
        <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-700/80 text-[10px] text-slate-300 font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time GPS Coordinate Bridge</span>
        </div>
      </div>

      {/* Technician Profile Card & Direct Action Buttons */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="relative">
            <img
              src={technician.photoUrl}
              alt={technician.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-black text-slate-900">{technician.name}</h4>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/60">
                <Star className="w-3 h-3 fill-amber-500" /> {technician.rating}
              </span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1 mt-0.5">
              <UserCheck className="w-3 h-3 text-emerald-600" />
              <span>{technician.badge}</span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">
              {technician.vehicle} • {technician.vehicleNumber} ({technician.completedJobs}+ doorstep repairs)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <a
            href={`tel:${technician.phone}`}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Technician</span>
          </a>

          <a
            href={`https://wa.me/919876512098?text=Hi%20Sameer,%20regarding%20my%20repair%20order%20${orderNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Safety & Service Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-1">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block">Service Destination</span>
            <span className="text-[11px] text-slate-500">{customerAddress}</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block">Requested Service</span>
            <span className="text-[11px] text-slate-500">{serviceType} (30-min doorstep fix)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add CSS keyframes helper to document if not present
function Check({ className }: { className?: string }) {
  return (
    <svg className={className || "w-3 h-3 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}
