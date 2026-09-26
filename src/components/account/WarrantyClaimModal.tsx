'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Wrench,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Calendar,
  Clock,
  X,
  Sparkles,
  ArrowRight,
  Upload,
} from 'lucide-react';

export interface WarrantyDevice {
  id: string;
  orderNumber: string;
  deviceModel: string;
  imei: string;
  purchasedDate: string;
  warrantyValidUntil: string;
  warrantyDurationMonths: number;
  grade: string;
}

interface WarrantyClaimModalProps {
  device: WarrantyDevice;
  isOpen: boolean;
  onClose: () => void;
  onClaimSubmitted: (claim: {
    claimId: string;
    issueType: string;
    resolution: string;
    pickupDate: string;
  }) => void;
}

const ISSUE_CATEGORIES = [
  { id: 'display', label: 'Screen / Display Glitch', desc: 'Dead pixels, flickering, touch unresponsive' },
  { id: 'battery', label: 'Battery Degradation', desc: 'Battery draining fast or not holding charge' },
  { id: 'charging', label: 'Charging & Port Fault', desc: 'Does not charge or loose port connection' },
  { id: 'audio', label: 'Speaker & Mic Issue', desc: 'Distorted audio, caller cannot hear voice' },
  { id: 'camera', label: 'Camera / Sensor Error', desc: 'Blurry photos, autofocus failure, black screen' },
  { id: 'other', label: 'Other Hardware Defect', desc: 'Buttons, Wi-Fi, Bluetooth, or unexpected shutdown' },
];

export function WarrantyClaimModal({
  device,
  isOpen,
  onClose,
  onClaimSubmitted,
}: WarrantyClaimModalProps) {
  const [selectedIssue, setSelectedIssue] = useState<string>('display');
  const [issueDescription, setIssueDescription] = useState<string>('');
  const [resolutionType, setResolutionType] = useState<'REPLACEMENT' | 'DOORSTEP_REPAIR'>('DOORSTEP_REPAIR');
  const [pickupDate, setPickupDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successClaimId, setSuccessClaimId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedClaimId = `CLM-WAR-${Date.now().toString(36).toUpperCase()}`;

    try {
      await fetch('/api/v1/warranty/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimId: generatedClaimId,
          orderNumber: device.orderNumber,
          deviceImei: device.imei,
          issueType: selectedIssue,
          description: issueDescription,
          resolution: resolutionType,
          pickupDate,
        }),
      });
    } catch {
      // Local fallback
    } finally {
      setIsSubmitting(false);
      setSuccessClaimId(generatedClaimId);
      onClaimSubmitted({
        claimId: generatedClaimId,
        issueType: selectedIssue,
        resolution: resolutionType,
        pickupDate,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                1-Click Express Warranty Claim
              </span>
              <h2 className="text-base font-black text-white">{device.deviceModel}</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {successClaimId ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Warranty Claim Registered!</h3>
              <p className="text-xs text-slate-500">
                Claim Reference ID: <strong className="font-mono text-emerald-700">{successClaimId}</strong>
              </p>
            </div>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              A certified technician has been assigned to inspect and service your {device.deviceModel} at your doorstep on <strong>{pickupDate}</strong>. Zero inspection charges.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitClaim} className="p-5 sm:p-6 space-y-5">
            {/* Device Warranty Badge */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Active Coverage</span>
                <span className="font-bold text-emerald-950">12 Months Comprehensive SELBAR Shield</span>
              </div>
              <span className="text-emerald-700 font-semibold font-mono text-[11px]">
                Valid until {device.warrantyValidUntil}
              </span>
            </div>

            {/* Step 1: Select Fault Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                1. Select Hardware Fault
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ISSUE_CATEGORIES.map((cat) => {
                  const isSelected = selectedIssue === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedIssue(cat.id)}
                      className={`p-3 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span className="text-xs font-bold block">{cat.label}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">{cat.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Fault Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                2. Describe the Issue (Optional)
              </label>
              <textarea
                rows={2}
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="e.g. Lines appear on screen when playing video or battery drops from 40% to 10% suddenly."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Step 3: Preferred Resolution */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                3. Preferred Resolution
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setResolutionType('DOORSTEP_REPAIR')}
                  className={`p-3 rounded-2xl border-2 text-left transition ${
                    resolutionType === 'DOORSTEP_REPAIR'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Wrench className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="text-xs block font-bold">Doorstep OEM Repair</span>
                  <span className="text-[10px] text-slate-500 block">30-min doorstep component fix</span>
                </button>

                <button
                  type="button"
                  onClick={() => setResolutionType('REPLACEMENT')}
                  className={`p-3 rounded-2xl border-2 text-left transition ${
                    resolutionType === 'REPLACEMENT'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <RotateCcw className="w-4 h-4 text-teal-600 mb-1" />
                  <span className="text-xs block font-bold">Express Unit Replacement</span>
                  <span className="text-[10px] text-slate-500 block">Same grade replacement device</span>
                </button>
              </div>
            </div>

            {/* Step 4: Preferred Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                4. Select Doorstep Service Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={pickupDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Registering Claim...</span>
                ) : (
                  <>
                    <span>Submit Free Warranty Claim</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
