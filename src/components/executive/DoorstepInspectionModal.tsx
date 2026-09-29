'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Camera,
  QrCode,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Zap,
  DollarSign,
  UserCheck,
  Lock,
} from 'lucide-react';

export interface InspectionTask {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  device: string;
  expectedPrice: number;
}

interface ChecklistItem {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'minor_fault';
  deduction: number;
  note: string;
}

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: 'power', name: '1. Device Power & Boot', status: 'passed', deduction: 0, note: 'Boots cleanly into OS' },
  { id: 'display', name: '2. Display Glass & Panel', status: 'passed', deduction: 0, note: 'Zero cracks, OEM colors' },
  { id: 'touch', name: '3. Multi-Touch Digitizer', status: 'passed', deduction: 0, note: '100% responsiveness' },
  { id: 'cam_back', name: '4. Rear Primary Camera', status: 'passed', deduction: 0, note: 'Focus & OIS verified' },
  { id: 'cam_front', name: '5. Front TrueDepth Camera', status: 'passed', deduction: 0, note: 'Clean portrait capture' },
  { id: 'speaker', name: '6. Stereo Speakers', status: 'passed', deduction: 0, note: 'Crisp sound, zero distortion' },
  { id: 'mic', name: '7. Noise Cancelling Mics', status: 'passed', deduction: 0, note: 'Studio clarity audio' },
  { id: 'charging', name: '8. Type-C / Lightning Port', status: 'passed', deduction: 0, note: 'Fast charging detected' },
  { id: 'battery', name: '9. Battery Maximum Capacity', status: 'passed', deduction: 0, note: 'Battery health >85%' },
  { id: 'wifi', name: '10. Wi-Fi & MIMO Antennas', status: 'passed', deduction: 0, note: 'Connected 5GHz band' },
  { id: 'bluetooth', name: '11. Bluetooth 5.3 Radio', status: 'passed', deduction: 0, note: 'Discovers nearby beacons' },
  { id: 'sim', name: '12. 5G SIM Tray & Modem', status: 'passed', deduction: 0, note: 'VoLTE signal locked' },
  { id: 'biometrics', name: '13. Face ID / Fingerprint', status: 'passed', deduction: 0, note: 'Biometrics authenticate' },
  { id: 'gps', name: '14. GPS Location Sensor', status: 'passed', deduction: 0, note: 'Precise satellite fix' },
  { id: 'buttons', name: '15. Physical Power/Volume', status: 'passed', deduction: 0, note: 'Tactile click feedback' },
  { id: 'body', name: '16. Housing & Bezel Frame', status: 'passed', deduction: 0, note: 'Zero major dents' },
  { id: 'water', name: '17. Water Damage LDI Strip', status: 'passed', deduction: 0, note: 'LDI indicator remains white' },
];

const FAULT_DEDUCTION_MAP: Record<string, { minor: number; major: number; noteMinor: string; noteMajor: string }> = {
  power: { minor: 1500, major: 8000, noteMinor: 'Intermittent boot', noteMajor: 'Dead / No power' },
  display: { minor: 1200, major: 4500, noteMinor: 'Hairline micro-scratches', noteMajor: 'Cracked screen / Dead pixels' },
  touch: { minor: 800, major: 3500, noteMinor: 'Slight corner latency', noteMajor: 'Unresponsive dead zones' },
  cam_back: { minor: 700, major: 3000, noteMinor: 'Minor lens scuff', noteMajor: 'Black camera / OIS broken' },
  cam_front: { minor: 500, major: 2500, noteMinor: 'Speck of dust', noteMajor: 'Front cam failure' },
  speaker: { minor: 400, major: 1500, noteMinor: 'Slight crackle at 100%', noteMajor: 'Zero audio output' },
  mic: { minor: 400, major: 1500, noteMinor: 'Muffled call audio', noteMajor: 'Mic dead' },
  charging: { minor: 500, major: 1800, noteMinor: 'Loose port fit', noteMajor: 'Port not charging' },
  battery: { minor: 800, major: 2200, noteMinor: 'Health 80-84%', noteMajor: 'Service needed (<80%)' },
  wifi: { minor: 400, major: 1500, noteMinor: 'Weak reception', noteMajor: 'Wi-Fi disabled' },
  bluetooth: { minor: 300, major: 1200, noteMinor: 'Delayed pairing', noteMajor: 'Bluetooth unavailable' },
  sim: { minor: 500, major: 2000, noteMinor: 'Loose tray', noteMajor: 'No SIM detected' },
  biometrics: { minor: 600, major: 2800, noteMinor: 'Slow recognition', noteMajor: 'Hardware failure' },
  gps: { minor: 300, major: 1200, noteMinor: 'Slow lock', noteMajor: 'GPS malfunctioning' },
  buttons: { minor: 400, major: 1500, noteMinor: 'Stiff volume key', noteMajor: 'Broken switch' },
  body: { minor: 600, major: 2500, noteMinor: 'Corner paint chipping', noteMajor: 'Bent frame / Heavy dent' },
  water: { minor: 1000, major: 6000, noteMinor: 'Pinkish LDI strip', noteMajor: 'Red LDI / Liquid corrosion' },
};

interface DoorstepInspectionModalProps {
  task: InspectionTask;
  isOpen: boolean;
  onClose: () => void;
  onCompleteHandover: (result: {
    finalPrice: number;
    imei: string;
    serial: string;
    handoverOtp: string;
    deviceId: string;
  }) => void;
}

export function DoorstepInspectionModal({
  task,
  isOpen,
  onClose,
  onCompleteHandover,
}: DoorstepInspectionModalProps) {
  const [step, setStep] = useState<'checklist' | 'customer_review' | 'handover_otp'>('checklist');
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [imei, setImei] = useState('358941098234120');
  const [serial, setSerial] = useState('G6TZ1028X1');
  const [customerOtp, setCustomerOtp] = useState('');
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [photos, setPhotos] = useState<Record<string, string>>({});

  const photoCategories = [
    { key: 'front', label: 'Front' },
    { key: 'back', label: 'Back' },
    { key: 'display', label: 'Display' },
    { key: 'corners', label: 'Corners' },
    { key: 'imei', label: 'IMEI/Serial' },
    { key: 'damage', label: 'Damage' },
  ];

  if (!isOpen) return null;

  // Calculate live deductions
  const totalDeductions = items.reduce((acc, item) => acc + item.deduction, 0);
  const finalPrice = Math.max(1000, task.expectedPrice - totalDeductions);

  const handleStatusChange = (id: string, newStatus: 'passed' | 'minor_fault' | 'failed') => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const config = FAULT_DEDUCTION_MAP[id];
        let deduction = 0;
        let note = 'Passed OEM verification';
        if (newStatus === 'minor_fault' && config) {
          deduction = config.minor;
          note = config.noteMinor;
        } else if (newStatus === 'failed' && config) {
          deduction = config.major;
          note = config.noteMajor;
        }
        return { ...item, status: newStatus, deduction, note };
      })
    );
  };

  const handleProceedToReview = () => {
    if (!imei.trim() || imei.length < 14) {
      setErrorMessage('Please enter a valid 15-digit device IMEI number.');
      return;
    }
    setErrorMessage('');
    setStep('customer_review');
  };

  const handleConfirmCustomerHandover = async () => {
    if (customerOtp.length !== 4) {
      setErrorMessage('Please enter the 4-digit handover OTP from the customer.');
      return;
    }

    setIsFinalizing(true);
    setErrorMessage('');

    try {
      const generatedDeviceId = `DEV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

      // Call API to finalize inspection & initiate payout
      const res = await fetch('/api/v1/orders/sell-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: task.orderNumber,
          deviceId: generatedDeviceId,
          imei,
          serial,
          originalPrice: task.expectedPrice,
          finalPrice,
          handoverOtp: customerOtp,
          executiveId: 'EXEC-701',
          deductions: items.filter((i) => i.deduction > 0),
        }),
      });

      onCompleteHandover({
        finalPrice,
        imei,
        serial,
        handoverOtp: customerOtp,
        deviceId: generatedDeviceId,
      });
    } catch {
      // Mock fallback
      const generatedDeviceId = `DEV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      onCompleteHandover({
        finalPrice,
        imei,
        serial,
        handoverOtp: customerOtp,
        deviceId: generatedDeviceId,
      });
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden my-0 sm:my-auto max-h-[94vh] flex flex-col">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Doorstep Inspection & Handover
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-800 text-slate-300">
                  {task.orderNumber}
                </span>
              </div>
              <h2 className="text-sm sm:text-base md:text-lg font-black tracking-tight mt-0.5 text-white">
                {task.device}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: 17-POINT HARDWARE CHECKLIST */}
        {step === 'checklist' && (
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
            {/* Customer & Quote Summary Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 block">Customer</span>
                <span className="font-bold text-slate-900 truncate block">{task.customerName}</span>
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 block">Initial Estimate</span>
                <span className="font-bold text-slate-900">₹{task.expectedPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 block">Current Adjusted Price</span>
                <span className="font-black text-emerald-600 text-sm">
                  ₹{finalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Device Identifiers Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Device IMEI Number (15 Digits) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <QrCode className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={imei}
                    onChange={(e) => setImei(e.target.value)}
                    placeholder="Dial *#06# to read IMEI"
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Serial Number (Optional)
                </label>
                <input
                  type="text"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  placeholder="e.g. G6TZ1028X1"
                  className="w-full px-3 py-2 text-xs font-mono font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Device Physical Evidence Photos (Section 109) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Physical Evidence Photos</span>
                </h4>
                <span className="text-[10px] text-slate-400">Camera Quick Upload</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {photoCategories.map((cat) => (
                  <label
                    key={cat.key}
                    className="flex flex-col items-center justify-center p-2 rounded-xl border border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/40 cursor-pointer min-h-[64px] transition text-center group active:scale-95"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setPhotos((prev) => ({ ...prev, [cat.key]: url }));
                        }
                      }}
                    />
                    {photos[cat.key] ? (
                      <div className="relative w-full h-12 rounded-lg overflow-hidden border border-emerald-500">
                        <img src={photos[cat.key]} alt={cat.label} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-[8px] font-black text-white text-center">✓ {cat.label}</span>
                      </div>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
                        <span className="text-[10px] font-bold text-slate-600 mt-1">{cat.label}</span>
                      </>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* 17-Point Inspection Scroll Area */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  17-Point Physical & Functional Checklist
                </h4>
                <span className="text-[11px] font-semibold text-slate-500">
                  {items.filter((i) => i.status === 'passed').length}/17 Passed
                </span>
              </div>

              <div className="max-h-64 sm:max-h-72 overflow-y-auto pr-1 space-y-2 divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.id} className="pt-2.5 pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block">{item.name}</span>
                      <span className="text-[11px] text-slate-500">{item.note}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:gap-1.5 w-full sm:w-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'passed')}
                        className={`min-h-[40px] px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition flex items-center justify-center cursor-pointer active:scale-95 ${
                          item.status === 'passed'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        ✓ Pass
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'minor_fault')}
                        className={`min-h-[40px] px-2 py-1.5 rounded-xl font-bold text-[10px] sm:text-[11px] transition flex items-center justify-center text-center cursor-pointer active:scale-95 ${
                          item.status === 'minor_fault'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Minor (-₹{FAULT_DEDUCTION_MAP[item.id]?.minor})
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'failed')}
                        className={`min-h-[40px] px-2 py-1.5 rounded-xl font-bold text-[10px] sm:text-[11px] transition flex items-center justify-center text-center cursor-pointer active:scale-95 ${
                          item.status === 'failed'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Fail (-₹{FAULT_DEDUCTION_MAP[item.id]?.major})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {errorMessage}
              </div>
            )}

            {/* Bottom Footer Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] sm:pb-0">
              <div className="flex items-center justify-between sm:block">
                <span className="text-xs text-slate-500 block">Total Deductions:</span>
                <span className="text-xs font-bold text-rose-600">
                  -₹{totalDeductions.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="button"
                onClick={handleProceedToReview}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
              >
                <span>Present Final Price to Customer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CUSTOMER PRICE REVIEW SCREEN */}
        {step === 'customer_review' && (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-400">Original Online Estimate</span>
                <span className="text-sm font-bold text-slate-300">
                  ₹{task.expectedPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs text-rose-400">Inspection Adjustments</span>
                <span className="text-sm font-bold text-rose-400">
                  -₹{totalDeductions.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                    Final Cash Offer
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Guaranteed instant UPI / Bank transfer
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-white">
                  ₹{finalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Itemized Deductions list */}
            {totalDeductions > 0 && (
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 space-y-2">
                <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Itemized Inspection Adjustments:
                </h5>
                <ul className="text-xs text-amber-800 space-y-1">
                  {items
                    .filter((i) => i.deduction > 0)
                    .map((i) => (
                      <li key={i.id} className="flex justify-between">
                        <span>• {i.name}: {i.note}</span>
                        <span className="font-bold text-rose-600">-₹{i.deduction}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Legal Consent Declaration */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Customer Handover Agreement</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                &quot;I, {task.customerName}, hereby confirm that I am the rightful owner of this {task.device} (IMEI: {imei}). I consent to selling this device to SELBAR for the final agreed amount of ₹{finalPrice.toLocaleString('en-IN')} and authorize immediate NIST 800-88 data sanitization.&quot;
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep('checklist')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs"
              >
                Back to Inspection
              </button>

              <button
                type="button"
                onClick={() => setStep('handover_otp')}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <UserCheck className="w-4 h-4" />
                <span>Customer Accepts • Enter Handover OTP</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: OTP VERIFICATION & HANDOVER COMPLETION */}
        {step === 'handover_otp' && (
          <div className="p-5 sm:p-6 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>

            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-black text-slate-900">
                Verify Customer Handover OTP
              </h3>
              <p className="text-xs text-slate-500">
                Ask {task.customerName} for the 4-digit SMS OTP sent to {task.phone} to authorize device transfer and trigger instant bank payout.
              </p>
            </div>

            <div className="max-w-xs mx-auto">
              <input
                type="text"
                maxLength={4}
                value={customerOtp}
                onChange={(e) => setCustomerOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="4-digit OTP"
                className="w-full text-center tracking-[0.5em] text-2xl font-black py-3 border-2 border-emerald-500/40 rounded-2xl bg-emerald-50/30 text-emerald-950 focus:outline-none focus:border-emerald-600"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Default Demo OTP: 4829
              </span>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium max-w-sm mx-auto">
                {errorMessage}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('customer_review')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs"
              >
                Back
              </button>

              <button
                type="button"
                disabled={isFinalizing || customerOtp.length !== 4}
                onClick={handleConfirmCustomerHandover}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/25 disabled:opacity-50"
              >
                {isFinalizing ? (
                  <span>Initiating Instant Payout...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Complete Handover & Release ₹{finalPrice.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
