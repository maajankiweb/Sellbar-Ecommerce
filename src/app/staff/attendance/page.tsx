'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Clock, CheckCircle2, Play, Pause, AlertCircle, Calendar,
  BarChart3, RefreshCw, Award, User, ShieldCheck, Zap
} from 'lucide-react';

export default function StaffAttendancePage() {
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [clockInTime, setClockInTime] = useState('08:02 AM');
  const [totalShiftMinutes, setTotalShiftMinutes] = useState(314);
  const [toast, setToast] = useState('');

  const toggleClock = () => {
    if (isClockedIn) {
      setIsClockedIn(false);
      setIsOnBreak(false);
      setToast('Clocked out of Inspection Station #1. Shift recorded!');
    } else {
      setIsClockedIn(true);
      setClockInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setToast('Clocked into Inspection Station #1. Have a productive shift!');
    }
    setTimeout(() => setToast(''), 3000);
  };

  const toggleBreak = () => {
    setIsOnBreak(!isOnBreak);
    setToast(!isOnBreak ? 'Break started. Status set to Away.' : 'Resumed shift. Ready for QC inspection!');
    setTimeout(() => setToast(''), 3000);
  };

  const hours = Math.floor(totalShiftMinutes / 60);
  const minutes = totalShiftMinutes % 60;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-12 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Header in White */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
              Biometric Shift Punch
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Shift: Morning (08:00 - 16:00 IST)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-600" />
            Station Attendance & Productivity Log
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time shift timer, break logs, and hourly device diagnostic output.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleBreak}
            disabled={!isClockedIn}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              isOnBreak
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Pause className="w-3.5 h-3.5" />
            {isOnBreak ? 'Resume Testing' : 'Log Lunch / Tea Break'}
          </button>

          <button
            onClick={toggleClock}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
              isClockedIn
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            {isClockedIn ? 'Clock Out of Station' : 'Clock In Station'}
          </button>
        </div>
      </div>

      {/* Stats Cards in White */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-500 font-bold">Shift Duration</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {hours}h {minutes}m
          </div>
          <div className="text-[10px] text-emerald-600 mt-1">Punch in: {clockInTime}</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-500 font-bold">Devices Tested Today</div>
          <div className="text-2xl font-black text-cyan-700 mt-1">23 Units</div>
          <div className="text-[10px] text-slate-500 mt-1">Target: 25 units / shift</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-500 font-bold">Grading Accuracy</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">99.4%</div>
          <div className="text-[10px] text-slate-500 mt-1">Zero manager disputes</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-500 font-bold">Monthly Attendance</div>
          <div className="text-2xl font-black text-purple-600 mt-1">100%</div>
          <div className="text-[10px] text-slate-500 mt-1">22 of 22 shifts logged</div>
        </div>
      </div>

      {/* Shift Timeline Logs in White */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          Today's Shift Activity Timeline
        </h3>

        <div className="space-y-3 text-xs">
          {[
            { time: '08:02 AM', title: 'Biometric Station Clock-In', desc: 'Station Bay #1 booted and hardware test calibrated', tag: 'ON SHIFT', color: 'emerald' },
            { time: '08:15 AM - 10:45 AM', title: 'Intake Inspection Run 1', desc: 'Inspected 12 units (Apple & Samsung)', tag: 'QC COMPLETED', color: 'cyan' },
            { time: '10:45 AM - 11:00 AM', title: 'Scheduled Morning Tea Break', desc: 'Station paused and locked', tag: 'BREAK', color: 'amber' },
            { time: '11:00 AM - 01:15 PM', title: 'High-Precision Diagnostics Run 2', desc: 'Inspected 11 units + generated packaging labels', tag: 'QC COMPLETED', color: 'cyan' },
          ].map((entry, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                  <span>{entry.time}</span>
                </div>
                <div className="font-bold text-slate-900 mt-1 text-xs">{entry.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{entry.desc}</div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                entry.color === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
                entry.color === 'cyan' ? 'bg-cyan-100 text-cyan-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {entry.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
