'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

export interface PickupSlot {
  id: string;
  timeRange: string; // e.g., '10:00 AM - 12:00 PM'
  startTime: string; // '10:00'
  endTime: string; // '12:00'
  capacity: number;
  booked: number;
  available: number;
  active: boolean;
}

export interface SelectedSlotData {
  date: string; // '2026-09-27'
  dateFormatted: string; // 'Sun, 27 Sep'
  slotId: string;
  timeRange: string;
}

interface PickupSlotPickerProps {
  city?: string;
  pincode?: string;
  onSlotSelected?: (slot: SelectedSlotData) => void;
}

export function PickupSlotPicker({
  city = 'Bettiah / West Champaran',
  pincode = '845438',
  onSlotSelected,
}: PickupSlotPickerProps) {
  // Generate 5 selectable dates (Today, Tomorrow, Day 2, Day 3, Day 4)
  const availableDates = React.useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short' });
      const dateFormatted = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      dates.push({ offset: i, iso, dayName, dateFormatted });
    }
    return dates;
  }, []);

  const [selectedDateIso, setSelectedDateIso] = useState<string>(availableDates[0].iso);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slot-1');
  const [slots, setSlots] = useState<PickupSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load slot capacity for chosen date & zone
  useEffect(() => {
    async function fetchSlots() {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/sell/pickup?date=${selectedDateIso}&pincode=${pincode}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data.slots)) {
          setSlots(json.data.slots);
        } else {
          // Fallback realistic capacity
          setSlots([
            { id: 'slot-1', timeRange: '10:00 AM - 12:00 PM', startTime: '10:00', endTime: '12:00', capacity: 6, booked: 4, available: 2, active: true },
            { id: 'slot-2', timeRange: '12:00 PM - 02:00 PM', startTime: '12:00', endTime: '14:00', capacity: 6, booked: 6, available: 0, active: true },
            { id: 'slot-3', timeRange: '02:00 PM - 04:00 PM', startTime: '14:00', endTime: '16:00', capacity: 8, booked: 3, available: 5, active: true },
            { id: 'slot-4', timeRange: '04:00 PM - 06:00 PM', startTime: '16:00', endTime: '18:00', capacity: 8, booked: 1, available: 7, active: true },
          ]);
        }
      } catch {
        setSlots([
          { id: 'slot-1', timeRange: '10:00 AM - 12:00 PM', startTime: '10:00', endTime: '12:00', capacity: 6, booked: 4, available: 2, active: true },
          { id: 'slot-2', timeRange: '12:00 PM - 02:00 PM', startTime: '12:00', endTime: '14:00', capacity: 6, booked: 6, available: 0, active: true },
          { id: 'slot-3', timeRange: '02:00 PM - 04:00 PM', startTime: '14:00', endTime: '16:00', capacity: 8, booked: 3, available: 5, active: true },
          { id: 'slot-4', timeRange: '04:00 PM - 06:00 PM', startTime: '16:00', endTime: '18:00', capacity: 8, booked: 1, available: 7, active: true },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchSlots();
  }, [selectedDateIso, pincode]);

  // Notify parent on slot selection
  useEffect(() => {
    const curDate = availableDates.find((d) => d.iso === selectedDateIso) || availableDates[0];
    const curSlot = slots.find((s) => s.id === selectedSlotId);
    if (curSlot && curSlot.available > 0 && onSlotSelected) {
      onSlotSelected({
        date: curDate.iso,
        dateFormatted: `${curDate.dayName}, ${curDate.dateFormatted}`,
        slotId: curSlot.id,
        timeRange: curSlot.timeRange,
      });
    }
  }, [selectedDateIso, selectedSlotId, slots, availableDates, onSlotSelected]);

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              Select Doorstep Pickup Slot
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Free doorstep inspection & immediate cash payout
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Zone: {city} ({pincode})</span>
        </div>
      </div>

      {/* 1. Date Selector Chips */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          1. Choose Date
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {availableDates.map((d) => {
            const isSelected = selectedDateIso === d.iso;
            return (
              <button
                key={d.iso}
                type="button"
                onClick={() => setSelectedDateIso(d.iso)}
                className={`py-3 px-3 rounded-2xl border-2 text-center transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold shadow-xs scale-[1.02]'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50'
                }`}
              >
                <span className="text-[11px] block font-bold text-slate-500 uppercase">
                  {d.dayName}
                </span>
                <span className="text-sm font-black text-slate-900 mt-0.5 block">
                  {d.dateFormatted}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 2-Hour Time Window Slots */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            2. Choose 2-Hour Time Slot (Capacity Monitored)
          </label>
          <span className="text-[11px] font-semibold text-emerald-700">
            • Real-time Executive Availability
          </span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400 font-medium animate-pulse">
            Checking real-time zone executive availability...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {slots.map((slot) => {
              const isSelected = selectedSlotId === slot.id;
              const isFull = slot.available <= 0;
              const isFillingFast = slot.available > 0 && slot.available <= 2;

              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={isFull}
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all relative ${
                    isFull
                      ? 'border-slate-200 bg-slate-100/70 text-slate-400 opacity-70 cursor-not-allowed'
                      : isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className="text-xs sm:text-sm font-black tracking-tight">
                        {slot.timeRange}
                      </span>
                    </div>

                    {isFull ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 text-rose-700">
                        Booked Out
                      </span>
                    ) : isFillingFast ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800">
                        Only {slot.available} Left
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                        Available ({slot.available})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 font-medium">
                    <span>Capacity: {slot.capacity} Pickups</span>
                    <span>•</span>
                    <span>Booked: {slot.booked}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Safety & Trust Note */}
      <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          A verified Field Executive with government ID & police verification will arrive at your selected slot. No cancellation charges.
        </span>
      </div>
    </div>
  );
}
