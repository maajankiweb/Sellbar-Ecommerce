'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wrench, CheckCircle2, Clock, AlertTriangle, Play, Pause,
  QrCode, Search, Smartphone, Battery, Camera, Volume2, Wifi,
  HardDrive, Shield, Check, X, ArrowRight, User, RefreshCw,
  Award, Sparkles, AlertCircle, ChevronRight, Barcode,
  Laptop, CheckSquare
} from 'lucide-react';

interface TaskItem {
  id: string;
  orderNumber: string;
  device: string;
  imei: string;
  customerName: string;
  source: 'Doorstep Pickup' | 'Store Drop' | 'Courier Inward';
  status: 'pending' | 'in_progress' | 'passed' | 'failed';
  priority: 'high' | 'normal';
}

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 't-1',
    orderNumber: 'ORD-QC-9921',
    device: 'Apple iPhone 14 (128GB, Blue)',
    imei: '358941092837461',
    customerName: 'Aditi Nair',
    source: 'Doorstep Pickup',
    status: 'pending',
    priority: 'high',
  },
  {
    id: 't-2',
    orderNumber: 'ORD-QC-9924',
    device: 'Samsung Galaxy S23 (256GB, Phantom Black)',
    imei: '356781293847562',
    customerName: 'Kunal Singhania',
    source: 'Store Drop',
    status: 'pending',
    priority: 'normal',
  },
  {
    id: 't-3',
    orderNumber: 'ORD-QC-9928',
    device: 'OnePlus 11 5G (16GB RAM / 256GB, Titan Black)',
    imei: '864719038291042',
    customerName: 'Varun Grover',
    source: 'Courier Inward',
    status: 'pending',
    priority: 'normal',
  },
  {
    id: 't-4',
    orderNumber: 'ORD-QC-9935',
    device: 'MacBook Air M1 (8GB / 256GB, Space Gray)',
    imei: 'C02DP918Q05N',
    customerName: 'Sneha Roy',
    source: 'Doorstep Pickup',
    status: 'pending',
    priority: 'high',
  },
];

export default function StaffDashboard() {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const [toast, setToast] = useState('');
  const [qcChecks, setQcChecks] = useState({
    imeiMatch: false,
    displayTouch: false,
    cameraFocus: false,
    batteryHealth: false,
    biometrics: false,
    dataWiped: false,
  });

  const allChecksPassed = Object.values(qcChecks).every(Boolean);

  const startTask = (task: TaskItem) => {
    setActiveTask(task);
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'in_progress' } : t));
    setQcChecks({
      imeiMatch: false,
      displayTouch: false,
      cameraFocus: false,
      batteryHealth: false,
      biometrics: false,
      dataWiped: false,
    });
  };

  const completeQc = (passed: boolean) => {
    if (!activeTask) return;
    setTasks(prev => prev.map(t => t.id === activeTask.id ? { ...t, status: passed ? 'passed' : 'failed' } : t));
    setToast(passed ? 'QC passed! Barcode label generated and unit routed to packaging.' : 'Unit flagged with defects. Routed to re-calibration.');
    setActiveTask(null);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-100 text-cyan-900 border border-cyan-300">
              QC Inspection Bay #1
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Technician: Karan Mehra (ACiT Certified #STF-104)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Device Testing Queue & Intake
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Conduct standardized hardware evaluations, verify customer descriptions, and grade refurbishments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/staff/diagnostics"
            className="px-4 py-2 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black transition flex items-center gap-1.5 shadow-sm shadow-cyan-600/20"
          >
            Launch 64-Pt Suite &rarr;
          </Link>
        </div>
      </div>

      {/* Metrics Row in White */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs font-bold text-slate-500">Inward Queue</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length} Devices
          </div>
          <div className="text-[10px] text-cyan-700 mt-1">Ready for testing bench</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs font-bold text-slate-500">Passed Today</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">19 Units</div>
          <div className="text-[10px] text-slate-500 mt-1">Grade A+/A certified</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs font-bold text-slate-500">Discrepancies Flagged</div>
          <div className="text-2xl font-black text-rose-600 mt-1">2 Units</div>
          <div className="text-[10px] text-slate-500 mt-1">Re-quoted to customer</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs font-bold text-slate-500">Average Bench Time</div>
          <div className="text-2xl font-black text-slate-900 mt-1">9.8 mins</div>
          <div className="text-[10px] text-emerald-600 mt-1">Within standard SLA (&lt;12m)</div>
        </div>
      </div>

      {/* Quick Access to Subpages in White */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/staff/diagnostics"
          className="group p-5 rounded-3xl bg-white border border-slate-200 hover:border-cyan-400 hover:shadow-md transition flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center mb-3">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-cyan-800 transition flex items-center gap-1.5">
              64-Point Diagnostic Bench
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition text-cyan-600" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Full hardware calibration suite: OLED subpixels, True Tone, touch matrix, multi-lens cameras, and acoustic sensors.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-cyan-700">
            Open Interactive Bench &rarr;
          </div>
        </Link>

        <Link
          href="/staff/packaging"
          className="group p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-800 transition flex items-center gap-1.5">
              Packaging & Intake Barcodes
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition text-blue-600" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Thermal sticker printer integration, anti-static sealed envelope verification, and warehouse bin allocation.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-blue-700">
            Print Thermal Labels &rarr;
          </div>
        </Link>

        <Link
          href="/staff/attendance"
          className="group p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800 transition flex items-center gap-1.5">
              Shift Log & Station Punch
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition text-emerald-600" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Track station clock-in, duty hours, break rotation logs, and live hourly inspection count.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-700">
            View Shift Stats &rarr;
          </div>
        </Link>
      </div>

      {/* Main Testing Queue & Fast Inspection Workspace in White */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Device Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-600" />
              Incoming Devices Queue
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">Auto-refreshes (15s)</span>
          </div>

          <div className="space-y-3">
            {tasks.map(task => (
              <div
                key={task.id}
                onClick={() => startTask(task)}
                className={`p-4 rounded-2xl border transition cursor-pointer relative overflow-hidden ${
                  activeTask?.id === task.id
                    ? 'bg-cyan-50 border-cyan-400 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {task.priority === 'high' && (
                  <span className="absolute top-0 right-0 px-2 py-0.5 bg-rose-500 text-white font-mono text-[9px] font-black rounded-bl-xl uppercase">
                    HIGH PRIORITY
                  </span>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-cyan-700 font-bold">{task.orderNumber}</span>
                    <h3 className="text-xs font-bold text-slate-900 mt-0.5">{task.device}</h3>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">IMEI: {task.imei}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-[10px]">
                  <span className="text-slate-500">Cust: {task.customerName}</span>
                  <span className={`font-bold uppercase ${
                    task.status === 'passed' ? 'text-emerald-700' :
                    task.status === 'failed' ? 'text-rose-700' :
                    task.status === 'in_progress' ? 'text-cyan-700' : 'text-amber-700'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Test Bench */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Active Test Bench</span>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-cyan-600" />
                  {activeTask ? activeTask.device : 'No Device Selected'}
                </h2>
              </div>

              {activeTask && (
                <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-cyan-100 text-cyan-900 border border-cyan-300">
                  {activeTask.orderNumber}
                </span>
              )}
            </div>

            {activeTask ? (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-500">IMEI:</span>
                    <div className="font-mono font-bold text-slate-900 mt-0.5">{activeTask.imei}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Inward Channel:</span>
                    <div className="font-bold text-slate-900 mt-0.5">{activeTask.source}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700">Quick 6-Point Intake Checklist:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { key: 'imeiMatch', label: 'IMEI / Blacklist Check', icon: QrCode },
                      { key: 'displayTouch', label: 'Display & Touch Matrix', icon: Smartphone },
                      { key: 'cameraFocus', label: 'Camera & Flash Sensor', icon: Camera },
                      { key: 'batteryHealth', label: 'Battery Capacity (>= 85%)', icon: Battery },
                      { key: 'biometrics', label: 'FaceID / Fingerprint', icon: Shield },
                      { key: 'dataWiped', label: 'DoD 5220-M Data Wiped', icon: HardDrive },
                    ].map(item => {
                      const Icon = item.icon;
                      const isChecked = (qcChecks as any)[item.key];
                      return (
                        <div
                          key={item.key}
                          onClick={() => setQcChecks({ ...qcChecks, [item.key]: !isChecked })}
                          className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
                            isChecked
                              ? 'bg-cyan-50 border-cyan-400 text-slate-900'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-cyan-600 text-white' : 'border border-slate-300'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <Icon className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                          <span className="text-xs font-bold truncate">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => completeQc(false)}
                    className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Flag Defect
                  </button>

                  <button
                    onClick={() => completeQc(true)}
                    disabled={!allChecksPassed}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      allChecksPassed
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Pass & Generate Intake Label
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <Smartphone className="w-12 h-12 mx-auto text-slate-300" />
                <div className="text-xs font-semibold text-slate-600">Testing Bench Idle</div>
                <p className="text-[11px] max-w-sm mx-auto text-slate-500">
                  Select a device from the queue on the left to begin hardware evaluation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
