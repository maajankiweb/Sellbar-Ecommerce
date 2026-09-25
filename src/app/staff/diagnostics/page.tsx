'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wrench, CheckCircle2, AlertTriangle, Play, Smartphone, Battery,
  Camera, Volume2, Wifi, HardDrive, Shield, Check, X, RefreshCw,
  Sliders, Mic, Bluetooth, Radio, Cpu, Award, Zap, ArrowLeft
} from 'lucide-react';

interface DiagnosticCategory {
  title: string;
  tests: {
    id: string;
    name: string;
    description: string;
    status: 'passed' | 'failed' | 'untested';
    metric?: string;
  }[];
}

const INITIAL_CATEGORIES: DiagnosticCategory[] = [
  {
    title: 'Display & Touch Matrix',
    tests: [
      { id: 'disp-1', name: 'OLED Subpixel Uniformity', description: 'RGB test pattern: No dead/stuck pixels or burn-in', status: 'passed', metric: '100% Uniform' },
      { id: 'disp-2', name: 'Multi-Touch Grid (10-Finger)', description: 'Capacitive touch matrix response latency', status: 'passed', metric: '1.2ms latency' },
      { id: 'disp-3', name: 'TrueTone & Ambient Light', description: 'Color temperature calibration with ambient sensor', status: 'passed', metric: 'Calibrated' },
      { id: 'disp-4', name: 'High Refresh Rate (120Hz ProMotion)', description: 'Variable frame rate smoothness verification', status: 'untested' },
    ],
  },
  {
    title: 'Battery & Power Subsystem',
    tests: [
      { id: 'bat-1', name: 'Battery Health Capacity', description: 'Current maximum capacity vs design capacity', status: 'passed', metric: '89% Health' },
      { id: 'bat-2', name: 'Charge Cycle Count', description: 'Hardware gas-gauge EEPROM readout', status: 'passed', metric: '342 Cycles' },
      { id: 'bat-3', name: 'Fast Charging Thermal Rate', description: 'PD 27W charging wattage & temperature curve', status: 'untested', metric: '26.8W Active' },
      { id: 'bat-4', name: 'Qi / MagSafe Wireless Induction', description: 'Coil resonance and reverse charging check', status: 'untested' },
    ],
  },
  {
    title: 'Optics & Computational Camera',
    tests: [
      { id: 'cam-1', name: 'Primary Wide Camera (OIS)', description: 'Sensor optical image stabilization & focus sharpness', status: 'passed', metric: 'OIS Locked' },
      { id: 'cam-2', name: 'Ultrawide & Macro Lens', description: 'Edge distortion and auto-macro switching', status: 'passed' },
      { id: 'cam-3', name: 'Telephoto Periscope 5x', description: 'Tetraprism zoom clarity & dual OIS alignment', status: 'untested' },
      { id: 'cam-4', name: 'TrueDepth Front Infrared', description: 'Dot projector and flood illuminator health', status: 'passed', metric: 'Enclave Valid' },
    ],
  },
  {
    title: 'Acoustics & Sensors',
    tests: [
      { id: 'ac-1', name: 'Stereo Speakers (THD)', description: 'Upper earpiece and bottom firing distortion check', status: 'passed', metric: '<0.1% THD' },
      { id: 'ac-2', name: 'Beamforming Triple Microphones', description: 'Studio mic SNR and active noise cancellation', status: 'passed' },
      { id: 'ac-3', name: '6-Axis Gyro & Accelerometer', description: 'Inertial measurement unit orientation responsiveness', status: 'passed' },
      { id: 'ac-4', name: 'Barometric Pressure Altimeter', description: 'Weather sealing pressure differential (Water resistance test)', status: 'untested' },
    ],
  },
  {
    title: 'Wireless, Enclave & Storage',
    tests: [
      { id: 'net-1', name: '5G Sub-6 & mmWave Bands', description: 'Carrier aggregation and RSSI signal strength', status: 'passed', metric: '-68 dBm' },
      { id: 'net-2', name: 'Wi-Fi 6E & Bluetooth 5.3', description: 'MIMO throughput and peripheral pairing', status: 'passed' },
      { id: 'net-3', name: 'Apple Secure Enclave / Titan M2', description: 'Biometric cryptographic keys and zero tampering', status: 'passed', metric: 'OEM Verified' },
      { id: 'net-4', name: 'NAND Flash S.M.A.R.T.', description: 'DoD 5220.22-M sanitization & block wear level', status: 'passed', metric: '0 Bad Blocks' },
    ],
  },
];

export default function DiagnosticsPage() {
  const [categories, setCategories] = useState<DiagnosticCategory[]>(INITIAL_CATEGORIES);
  const [selectedDevice, setSelectedDevice] = useState({
    name: 'Apple iPhone 15 Pro Max',
    imei: '358941098234120',
    serial: 'K39L2048X0',
    intakeGrade: 'Pending Calibration',
  });
  const [toast, setToast] = useState('');
  const [runningAll, setRunningAll] = useState(false);

  const toggleTest = (catIdx: number, testIdx: number, newStatus: 'passed' | 'failed') => {
    setCategories(prev => {
      const copy = [...prev];
      copy[catIdx].tests[testIdx].status = newStatus;
      return copy;
    });
  };

  const runAllAutomated = () => {
    setRunningAll(true);
    setTimeout(() => {
      setCategories(prev =>
        prev.map(cat => ({
          ...cat,
          tests: cat.tests.map(t => ({
            ...t,
            status: 'passed',
          })),
        }))
      );
      setRunningAll(false);
      setToast('Automated 64-point diagnostic test run completed! 100% Passed.');
      setTimeout(() => setToast(''), 3000);
    }, 1200);
  };

  const totalTests = categories.reduce((acc, c) => acc + c.tests.length, 0);
  const passedTests = categories.reduce((acc, c) => acc + c.tests.filter(t => t.status === 'passed').length, 0);
  const failedTests = categories.reduce((acc, c) => acc + c.tests.filter(t => t.status === 'failed').length, 0);
  const scorePercent = Math.round((passedTests / totalTests) * 100);

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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-100 text-cyan-900 border border-cyan-300">
              Diagnostic Hardware Test Suite
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-mono">SELBAR V5.4 Precision Rig</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-cyan-600" />
            64-Point Diagnostic Bench
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connected DUT: <strong className="text-slate-900">{selectedDevice.name}</strong> (IMEI: <span className="font-mono text-cyan-700">{selectedDevice.imei}</span>)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={runAllAutomated}
            disabled={runningAll}
            className="px-4 py-2 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm shadow-cyan-600/20 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            {runningAll ? 'Running Automated Telemetry...' : 'Run Auto-Scan Suite'}
          </button>
        </div>
      </div>

      {/* Score Summary in White */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-500 font-bold">Diagnostic Integrity Score</div>
          <div className="text-2xl font-black text-cyan-700 mt-1">{scorePercent}% Passed</div>
          <div className="text-[10px] text-slate-400 mt-1">{passedTests} of {totalTests} sub-tests verified</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-500 font-bold">Recommended Grading</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {failedTests > 0 ? 'Grade B (Refurb Needed)' : scorePercent >= 95 ? 'Grade A+ (Pristine)' : 'Grade A'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Algorithmic cosmetic & spec score</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-500 font-bold">OEM Parts Enclave</div>
          <div className="text-2xl font-black text-slate-900 mt-1">100% Genuine</div>
          <div className="text-[10px] text-emerald-600 mt-1">No aftermarket screen/battery warning</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-500 font-bold">Water Seal Integrity</div>
          <div className="text-2xl font-black text-purple-600 mt-1">IP68 Intact</div>
          <div className="text-[10px] text-slate-400 mt-1">Pressure chamber test +4.2 kPa</div>
        </div>
      </div>

      {/* Categories & Test Rows in White */}
      <div className="space-y-6">
        {categories.map((cat, catIdx) => (
          <div key={cat.title} className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-600" />
                {cat.title}
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                {cat.tests.filter(t => t.status === 'passed').length}/{cat.tests.length} OK
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cat.tests.map((test, testIdx) => (
                <div
                  key={test.id}
                  className={`p-3.5 rounded-2xl border transition flex items-start justify-between gap-3 ${
                    test.status === 'passed'
                      ? 'bg-slate-50/70 border-emerald-300'
                      : test.status === 'failed'
                      ? 'bg-rose-50 border-rose-300'
                      : 'bg-slate-50/40 border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{test.name}</span>
                      {test.metric && (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-cyan-100 text-cyan-800">
                          {test.metric}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 leading-snug">{test.description}</div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleTest(catIdx, testIdx, 'passed')}
                      className={`p-1.5 rounded-xl border transition cursor-pointer ${
                        test.status === 'passed'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-500 border-slate-300 hover:text-slate-900'
                      }`}
                      title="Mark Passed"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                    <button
                      onClick={() => toggleTest(catIdx, testIdx, 'failed')}
                      className={`p-1.5 rounded-xl border transition cursor-pointer ${
                        test.status === 'failed'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white text-slate-500 border-slate-300 hover:text-slate-900'
                      }`}
                      title="Flag Defect"
                    >
                      <X className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Certification Footer in White */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="text-xs font-bold text-slate-900">Digital QC Certificate Generated</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Signed by Technician #STF-104 (Cryptographic SHA-256 Stamp: <span className="font-mono text-cyan-700">7f2a..9b11</span>)
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/staff/packaging"
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black transition flex items-center gap-1.5 shadow-sm shadow-cyan-600/20"
          >
            Proceed to Packaging & Print Barcode &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
