'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Smartphone,
  ShieldCheck,
  Award,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  Wrench,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  FileText,
} from 'lucide-react';
import {
  NistDataWipeCertificateModal,
  DataWipeRecord,
} from '@/components/account/NistDataWipeCertificateModal';
import {
  WarrantyClaimModal,
  WarrantyDevice,
} from '@/components/account/WarrantyClaimModal';

// Sample Purchased Devices with Active Warranties
const MOCK_WARRANTY_DEVICES: WarrantyDevice[] = [
  {
    id: 'dev-buy-1',
    orderNumber: 'ORD-98214',
    deviceModel: 'Apple iPhone 14 (128GB, Midnight)',
    imei: '358941098234120',
    purchasedDate: '12 Jan 2026',
    warrantyValidUntil: '12 Jan 2027',
    warrantyDurationMonths: 12,
    grade: 'Superb (Grade A+)',
  },
  {
    id: 'dev-buy-2',
    orderNumber: 'ORD-76102',
    deviceModel: 'Samsung Galaxy S23 5G (256GB, Phantom Black)',
    imei: '352841028374192',
    purchasedDate: '18 Nov 2025',
    warrantyValidUntil: '18 Nov 2026',
    warrantyDurationMonths: 12,
    grade: 'Good (Grade A)',
  },
];

// Sample Sold Devices with NIST 800-88 Certificates
const MOCK_WIPED_DEVICES: DataWipeRecord[] = [
  {
    certificateId: 'NIST-2026-88491',
    deviceId: 'DEV-2026-009182',
    customerName: 'Rahul Verma',
    customerPhone: '+91 98200 45678',
    deviceModel: 'Apple iPhone 12 (128GB, Blue)',
    imei: '354891028374619',
    serialNumber: 'F2LX9102K1',
    sanitizationStandard: 'NIST SP 800-88 Rev. 1 (Cryptographic Purge)',
    algorithm: 'Cryptographic Block Overwrite (3-Pass Zero/Random Fill)',
    passesCompleted: 3,
    wipedAt: '24 Sep 2026, 04:30 PM',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    securityOfficer: 'Dr. Arindam Sen, CISSP',
    hubLocation: 'SELBAR Secure Diagnostics Hub, West Champaran (Patna Central)',
  },
];

export default function MyDevicesPage() {
  const [activeTab, setActiveTab] = useState<'warranty' | 'wiped'>('warranty');
  const [selectedWipeRecord, setSelectedWipeRecord] = useState<DataWipeRecord | null>(null);
  const [selectedWarrantyDevice, setSelectedWarrantyDevice] = useState<WarrantyDevice | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-12 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <Link
            href="/account"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Account
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            My Devices & Cryptographic Certificates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your active warranties, 1-click replacement claims, and NIST 800-88 data sanitization records.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('warranty')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'warranty'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Active Warranties ({MOCK_WARRANTY_DEVICES.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wiped')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'wiped'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-teal-600" />
            <span>Data-Wipe Certificates ({MOCK_WIPED_DEVICES.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ACTIVE WARRANTIES & 1-CLICK CLAIMS */}
      {activeTab === 'warranty' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_WARRANTY_DEVICES.map((dev) => (
              <div
                key={dev.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase block">
                        Order #{dev.orderNumber}
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-slate-900">{dev.deviceModel}</h3>
                      <span className="text-[11px] text-slate-500 font-medium">{dev.grade}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">IMEI:</span>
                    <span className="font-mono font-bold text-slate-800">{dev.imei}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Purchased:</span>
                    <span className="font-semibold text-slate-800">{dev.purchasedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Warranty Coverage:</span>
                    <span className="font-bold text-emerald-700">Valid until {dev.warrantyValidUntil}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <Link
                    href="/warranty"
                    className="text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    View Coverage Terms &rarr;
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSelectedWarrantyDevice(dev)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Raise 1-Click Claim</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: NIST 800-88 DATA-WIPE CERTIFICATES */}
      {activeTab === 'wiped' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_WIPED_DEVICES.map((record) => (
              <div
                key={record.certificateId}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-teal-700 font-bold uppercase block">
                        Cert #{record.certificateId}
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-slate-900">{record.deviceModel}</h3>
                      <span className="text-[11px] text-slate-500 font-medium">Device: {record.deviceId}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-teal-100 text-teal-800">
                    Purged
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">IMEI:</span>
                    <span className="font-mono font-bold text-slate-800">{record.imei}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Standard:</span>
                    <span className="font-semibold text-slate-800">NIST SP 800-88 Rev. 1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sanitized Date:</span>
                    <span className="font-bold text-slate-800">{record.wipedAt}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                    SHA: {record.sha256Hash.substring(0, 16)}...
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedWipeRecord(record)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View & Print Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NIST Data-Wipe Certificate Modal */}
      {selectedWipeRecord && (
        <NistDataWipeCertificateModal
          record={selectedWipeRecord}
          isOpen={!!selectedWipeRecord}
          onClose={() => setSelectedWipeRecord(null)}
        />
      )}

      {/* 1-Click Warranty Claim Modal */}
      {selectedWarrantyDevice && (
        <WarrantyClaimModal
          device={selectedWarrantyDevice}
          isOpen={!!selectedWarrantyDevice}
          onClose={() => setSelectedWarrantyDevice(null)}
          onClaimSubmitted={(res) => {
            setToastMessage(`Warranty Claim #${res.claimId} submitted successfully!`);
            setTimeout(() => setToastMessage(''), 4000);
          }}
        />
      )}
    </div>
  );
}
