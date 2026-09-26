'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Boxes,
  ShieldCheck,
  Wrench,
  Award,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Search,
  ArrowRight,
  TrendingUp,
  Cpu,
  Smartphone,
  Lock,
  RotateCcw,
  Check,
  X,
  RefreshCw,
  Building,
} from 'lucide-react';
import { DeviceRecord } from '@/app/api/v1/warehouse/lifecycle/route';

export default function AdminRefurbishmentPage() {
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [activeZone, setActiveZone] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Modals state
  const [selectedDevice, setSelectedDevice] = useState<DeviceRecord | null>(null);
  const [actionType, setActionType] = useState<'wipe' | 'repair' | 'qc' | 'publish' | null>(null);

  // Form inputs for modals
  const [partName, setPartName] = useState('OEM Grade-A OLED Display');
  const [partCost, setPartCost] = useState(1800);
  const [selectedGrade, setSelectedGrade] = useState<'A+' | 'A' | 'B' | 'C'>('A+');
  const [batteryHealthInput, setBatteryHealthInput] = useState(91);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/warehouse/lifecycle?zone=${activeZone}&q=${encodeURIComponent(searchQuery)}`);
      const json = await res.json();
      if (json.success) {
        setDevices(json.data.devices);
        setMetrics(json.data.metrics);
      }
    } catch {
      // Local fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [activeZone, searchQuery]);

  const handleExecuteAction = async () => {
    if (!selectedDevice || !actionType) return;
    setIsProcessing(true);

    try {
      let endpointAction = '';
      let payload: any = {};

      if (actionType === 'wipe') {
        endpointAction = 'PERFORM_DATA_WIPE';
      } else if (actionType === 'repair') {
        endpointAction = 'COMPLETE_REPAIR';
        payload = { partName, partCost };
      } else if (actionType === 'qc') {
        endpointAction = 'QC_AND_GRADE';
        payload = { grade: selectedGrade, batteryHealth: batteryHealthInput };
      } else if (actionType === 'publish') {
        endpointAction = 'PUBLISH_MARKETPLACE';
      }

      const res = await fetch('/api/v1/warehouse/lifecycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: endpointAction,
          deviceId: selectedDevice.deviceId,
          payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setToastMessage(`✓ ${selectedDevice.deviceId}: ${endpointAction} completed successfully!`);
        setTimeout(() => setToastMessage(''), 4000);
        setSelectedDevice(null);
        setActionType(null);
        fetchDevices();
      } else {
        alert(json.error || 'Action failed');
      }
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-12 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Boxes className="w-3.5 h-3.5 text-emerald-600" />
            <span>Phase 3: Refurbishment & Warehouse Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Refurbishment & Device Lifecycle Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track inward intake, NIST 800-88 sanitization, replacement parts, 32-point QC grading, and unit profitability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/buy"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>View Marketplace Store (/buy)</span>
          </Link>
        </div>
      </div>

      {/* Metrics Bar */}
      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Units in Hub</span>
            <div className="text-2xl font-black text-slate-900">{metrics.totalUnits} Devices</div>
            <span className="text-[11px] text-emerald-600 font-semibold">100% Tracked by IMEI</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inventory Inward Value</span>
            <div className="text-2xl font-black text-slate-900">₹{metrics.totalInventoryValue.toLocaleString('en-IN')}</div>
            <span className="text-[11px] text-slate-500">Includes buyback + logistics + parts</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expected Resale GMV</span>
            <div className="text-2xl font-black text-emerald-600">₹{metrics.expectedResaleValue.toLocaleString('en-IN')}</div>
            <span className="text-[11px] text-slate-500">Listed on /buy catalog</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Projected Gross Margin</span>
            <div className="text-2xl font-black text-teal-600">{metrics.avgMarginPercent}%</div>
            <span className="text-[11px] text-teal-700 font-bold">+₹{metrics.projectedGrossProfit.toLocaleString('en-IN')} Profit</span>
          </div>
        </div>
      )}

      {/* Warehouse Zone Filter Pipeline */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
            {[
              { id: 'all', label: 'All Devices' },
              { id: 'RECEIVING', label: '1. Inward Intake' },
              { id: 'DATA_WIPE', label: '2. Data Wipe' },
              { id: 'REPAIR', label: '3. Repair & Parts' },
              { id: 'QC', label: '4. QC & Grading' },
              { id: 'READY_FOR_RESALE', label: '5. Ready to Resell' },
            ].map((zone) => (
              <button
                key={zone.id}
                type="button"
                onClick={() => setActiveZone(zone.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  activeZone === zone.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {zone.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Scan Barcode / Search IMEI..."
              className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Devices Table / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map((device) => {
            const margin = device.financials.grossMarginPercent;
            return (
              <div
                key={device.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 hover:shadow-md transition"
              >
                {/* Device Title & Status Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-black text-emerald-700">
                          {device.deviceId}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-slate-100 text-slate-700">
                          {device.zone.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 mt-0.5">{device.modelName}</h3>
                      <div className="text-[11px] text-slate-500">
                        {device.storage} • {device.color} • Battery {device.batteryHealth}%
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                    Grade {device.grade}
                  </span>
                </div>

                {/* Physical Location & Identifiers */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">IMEI / Barcode</span>
                    <span className="font-mono font-bold text-slate-800">{device.imei}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Physical Bin</span>
                    <span className="font-bold text-slate-800">{device.rackBin}</span>
                  </div>
                </div>

                {/* Unit P&L Profitability Breakdown */}
                <div className="p-3.5 bg-slate-900 text-white rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-400 text-[11px]">
                    <span>Buyback (₹{device.financials.buybackPrice}) + Logistics (₹{device.financials.logisticsCost}) + Parts (₹{device.financials.partsCost})</span>
                    <span>Total Cost: ₹{device.financials.totalCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Resale Price</span>
                      <span className="text-sm font-black text-white">₹{device.financials.sellingPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-emerald-400 uppercase font-bold block">Gross Profit</span>
                      <span className="text-sm font-black text-emerald-400">
                        +₹{device.financials.grossProfit.toLocaleString('en-IN')} ({margin}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-3 text-xs">
                  <span className={`inline-flex items-center gap-1 font-semibold ${device.dataWipe.wiped ? 'text-emerald-700' : 'text-slate-400'}`}>
                    <Lock className="w-3.5 h-3.5" /> {device.dataWipe.wiped ? 'NIST Wiped' : 'Pending Wipe'}
                  </span>
                  <span className={`inline-flex items-center gap-1 font-semibold ${device.qualityControl.passed ? 'text-emerald-700' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> {device.qualityControl.passed ? '32-Pt QC Passed' : 'Pending QC'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  {!device.dataWipe.wiped && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDevice(device);
                        setActionType('wipe');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Run NIST Data Wipe</span>
                    </button>
                  )}

                  {device.zone === 'REPAIR' && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDevice(device);
                        setActionType('repair');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Log Replacement Part</span>
                    </button>
                  )}

                  {!device.qualityControl.passed && device.dataWipe.wiped && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDevice(device);
                        setActionType('qc');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Execute 32-Pt QC & Grade</span>
                    </button>
                  )}

                  {device.status !== 'LISTED' && device.dataWipe.wiped && device.qualityControl.passed && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDevice(device);
                        setActionType('publish');
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Publish to Marketplace (/buy)</span>
                    </button>
                  )}

                  {device.status === 'LISTED' && (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                      ✓ Live on /buy Store
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Execution Modal */}
      {selectedDevice && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Confirm Action</span>
                <h3 className="text-base font-black text-slate-900">{selectedDevice.modelName}</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedDevice(null);
                  setActionType(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ACTION: DATA WIPE */}
            {actionType === 'wipe' && (
              <div className="space-y-3 text-xs text-slate-600">
                <p>
                  Execute <strong>NIST SP 800-88 Rev. 1 Cryptographic Purge</strong> on IMEI <strong>{selectedDevice.imei}</strong>.
                </p>
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 space-y-1">
                  <div className="font-bold">✓ 3-Pass Overwrite</div>
                  <div>Generates verifiable SHA-256 digital certificate immediately.</div>
                </div>
              </div>
            )}

            {/* ACTION: REPAIR */}
            {actionType === 'repair' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Replaced Component</label>
                  <select
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="OEM Grade-A OLED Display">OEM Grade-A OLED Display</option>
                    <option value="OEM High-Capacity Battery Pack">OEM High-Capacity Battery Pack</option>
                    <option value="Rear Camera Sensor Module">Rear Camera Sensor Module</option>
                    <option value="Type-C Charging Sub-board">Type-C Charging Sub-board</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Component Cost (₹)</label>
                  <input
                    type="number"
                    value={partCost}
                    onChange={(e) => setPartCost(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>
            )}

            {/* ACTION: QC & GRADE */}
            {actionType === 'qc' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign Cosmetic Grade</label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="A+">Superb (Grade A+) - Like New, 0 scratches</option>
                    <option value="A">Excellent (Grade A) - 1-2 tiny bezel micro-scuffs</option>
                    <option value="B">Good (Grade B) - Visible minor back scratches</option>
                    <option value="C">Fair (Grade C) - Functional with heavy cosmetic wear</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Verified Battery Health (%)</label>
                  <input
                    type="number"
                    value={batteryHealthInput}
                    min={70}
                    max={100}
                    onChange={(e) => setBatteryHealthInput(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>
            )}

            {/* ACTION: PUBLISH */}
            {actionType === 'publish' && (
              <div className="space-y-3 text-xs text-slate-600">
                <p>
                  Publish <strong>{selectedDevice.modelName}</strong> ({selectedDevice.storage}, Grade {selectedDevice.grade}) to the live Refurbished Store at <strong>₹{selectedDevice.financials.sellingPrice.toLocaleString('en-IN')}</strong>.
                </p>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-medium">
                  ✓ Automatically attaches 12-Month SELBAR Warranty and 15-Day Replacement guarantee.
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedDevice(null);
                  setActionType(null);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleExecuteAction}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50"
              >
                {isProcessing ? <span>Processing...</span> : <span>Confirm & Save</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
