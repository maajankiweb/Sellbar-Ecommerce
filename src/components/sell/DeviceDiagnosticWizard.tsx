'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  Zap,
  Check
} from 'lucide-react';

interface DiagnosticWizardProps {
  modelName: string;
  baseValuation: number;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (finalPrice: number, breakdown: any) => void;
}

export function DeviceDiagnosticWizard({
  modelName,
  baseValuation,
  isOpen,
  onClose,
  onComplete,
}: DiagnosticWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Diagnostic states
  const [screenCondition, setScreenCondition] = useState<'flawless' | 'minor' | 'cracked'>('flawless');
  const [bodyCondition, setBodyCondition] = useState<'flawless' | 'minor' | 'dents'>('flawless');
  const [functionalTests, setFunctionalTests] = useState<{
    touchWorking: boolean;
    faceIdWorking: boolean;
    cameraWorking: boolean;
    batteryHealthy: boolean;
  }>({
    touchWorking: true,
    faceIdWorking: true,
    cameraWorking: true,
    batteryHealthy: true,
  });
  const [accessories, setAccessories] = useState<{
    box: boolean;
    charger: boolean;
    invoice: boolean;
  }>({
    box: true,
    charger: true,
    invoice: true,
  });

  if (!isOpen) return null;

  // Calculate live dynamic price
  let computedPrice = baseValuation;

  // Screen adjustments
  if (screenCondition === 'minor') computedPrice -= Math.round(baseValuation * 0.08);
  if (screenCondition === 'cracked') computedPrice -= Math.round(baseValuation * 0.25);

  // Body adjustments
  if (bodyCondition === 'minor') computedPrice -= Math.round(baseValuation * 0.05);
  if (bodyCondition === 'dents') computedPrice -= Math.round(baseValuation * 0.15);

  // Functional faults
  if (!functionalTests.touchWorking) computedPrice -= Math.round(baseValuation * 0.2);
  if (!functionalTests.faceIdWorking) computedPrice -= Math.round(baseValuation * 0.12);
  if (!functionalTests.cameraWorking) computedPrice -= Math.round(baseValuation * 0.1);
  if (!functionalTests.batteryHealthy) computedPrice -= Math.round(baseValuation * 0.08);

  // Accessories Bonus
  if (accessories.box) computedPrice += 500;
  if (accessories.charger) computedPrice += 800;
  if (accessories.invoice) computedPrice += 1200;

  // Minimum fallback safeguard
  if (computedPrice < 1000) computedPrice = 1000;

  const handleFinish = () => {
    onComplete(computedPrice, {
      screenCondition,
      bodyCondition,
      functionalTests,
      accessories,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Live Price Counter */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>4-Step Visual Diagnostic Engine</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
              {modelName}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-semibold">Live Quotation</div>
              <div className="text-lg sm:text-xl font-black text-emerald-700">
                ₹{computedPrice.toLocaleString('en-IN')}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4 Step Progress Pills */}
        <div className="grid grid-cols-4 gap-2 pt-4 pb-2">
          {[
            { step: 1, label: 'Screen' },
            { step: 2, label: 'Body' },
            { step: 3, label: 'Hardware' },
            { step: 4, label: 'Accessories' },
          ].map((s) => (
            <div
              key={s.step}
              className={`py-1.5 rounded-xl text-center text-xs font-bold transition-all ${
                currentStep === s.step
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : currentStep > s.step
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>

        {/* Step Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* STEP 1: SCREEN CONDITION */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900">
                  What is the physical condition of the screen display?
                </h4>
                <p className="text-xs text-slate-500">
                  Select the closest match. We use optical testing at doorstep.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'flawless',
                    title: 'Flawless',
                    desc: 'Zero visible scratches, screen looks showroom fresh',
                    tag: 'Top Value',
                  },
                  {
                    id: 'minor',
                    title: 'Minor Wear',
                    desc: '1–2 tiny hairline scratches only visible under light',
                    tag: '-8% Cut',
                  },
                  {
                    id: 'cracked',
                    title: 'Cracked Glass',
                    desc: 'Visible cracks, lines, or dead pixel spots',
                    tag: '-25% Cut',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setScreenCondition(opt.id as any)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition ${
                      screenCondition === opt.id
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{opt.title}</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {opt.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: BODY & FRAME */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900">
                  What is the condition of the phone's outer frame and back glass?
                </h4>
                <p className="text-xs text-slate-500">
                  Inspect the metal bezel edges, speaker grilles, and camera housing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'flawless',
                    title: 'Pristine Frame',
                    desc: 'No dents, bends, or paint peeling on side edges',
                    tag: 'Full Quote',
                  },
                  {
                    id: 'minor',
                    title: 'Normal Wear',
                    desc: 'Light rubbing marks from normal everyday case use',
                    tag: '-5% Cut',
                  },
                  {
                    id: 'dents',
                    title: 'Noticeable Dents',
                    desc: 'Heavy corner impact dents or bent body chassis',
                    tag: '-15% Cut',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setBodyCondition(opt.id as any)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition ${
                      bodyCondition === opt.id
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{opt.title}</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {opt.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: FUNCTIONAL HARDWARE CHECKLIST */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900">
                  Quick Functional Checklist
                </h4>
                <p className="text-xs text-slate-500">
                  Toggle off any component that is currently faulty or non-responsive.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    key: 'touchWorking',
                    label: 'Touch Display & Digitizer',
                    desc: 'Smooth response across full screen',
                  },
                  {
                    key: 'faceIdWorking',
                    label: 'Face ID / Fingerprint Sensor',
                    desc: 'Biometric unlock operational',
                  },
                  {
                    key: 'cameraWorking',
                    label: 'Front & Rear Cameras',
                    desc: 'Sharp autofocus and flash functioning',
                  },
                  {
                    key: 'batteryHealthy',
                    label: 'Battery Health (>85%)',
                    desc: 'No sudden shutdowns or fast drain',
                  },
                ].map((t) => {
                  const isChecked = (functionalTests as any)[t.key];
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() =>
                        setFunctionalTests((prev) => ({
                          ...prev,
                          [t.key]: !isChecked,
                        }))
                      }
                      className={`p-3.5 rounded-2xl border text-left flex items-start justify-between gap-3 transition ${
                        isChecked
                          ? 'border-emerald-300 bg-emerald-50/50'
                          : 'border-rose-300 bg-rose-50/50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs text-slate-900">{t.label}</div>
                        <div className="text-[10px] text-slate-500">{t.desc}</div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isChecked ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'
                        }`}
                      >
                        {isChecked ? '✓' : '✕'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: ACCESSORIES BONUS PAYOUT */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900">
                  Do you have original accessories? (Bonus Cash!)
                </h4>
                <p className="text-xs text-slate-500">
                  Having box or bill unlocks instant bonus cash added to your payout.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    key: 'box',
                    title: 'Original Retail Box',
                    bonus: '+₹500 Bonus',
                    desc: 'Matching IMEI box packaging',
                  },
                  {
                    key: 'charger',
                    title: 'Original Fast Charger',
                    bonus: '+₹800 Bonus',
                    desc: 'OEM brand adapter & cable',
                  },
                  {
                    key: 'invoice',
                    title: 'Valid Retail Bill',
                    bonus: '+₹1,200 Bonus',
                    desc: 'Original GST tax invoice',
                  },
                ].map((acc) => {
                  const isChecked = (accessories as any)[acc.key];
                  return (
                    <button
                      key={acc.key}
                      type="button"
                      onClick={() =>
                        setAccessories((prev) => ({
                          ...prev,
                          [acc.key]: !isChecked,
                        }))
                      }
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition ${
                        isChecked
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                          : 'border-slate-200 bg-white opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{acc.title}</span>
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {acc.bonus}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">{acc.desc}</p>
                      <div className="pt-1 text-[11px] font-bold text-emerald-700">
                        {isChecked ? '✓ Included' : '+ Tap to add'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-md shadow-slate-900/20 transition flex items-center gap-2"
            >
              <span>Lock Quote at ₹{computedPrice.toLocaleString('en-IN')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeviceDiagnosticWizard;
