'use client';

import React from 'react';
import {
  ShieldCheck,
  Award,
  Download,
  Printer,
  X,
  CheckCircle2,
  Lock,
  QrCode,
  Building,
} from 'lucide-react';

export interface DataWipeRecord {
  certificateId: string;
  deviceId: string;
  customerName: string;
  customerPhone?: string;
  deviceModel: string;
  imei: string;
  serialNumber?: string;
  sanitizationStandard: string;
  algorithm: string;
  passesCompleted: number;
  wipedAt: string;
  sha256Hash: string;
  securityOfficer: string;
  hubLocation: string;
}

interface NistDataWipeCertificateModalProps {
  record: DataWipeRecord;
  isOpen: boolean;
  onClose: () => void;
}

export function NistDataWipeCertificateModal({
  record,
  isOpen,
  onClose,
}: NistDataWipeCertificateModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        {/* Modal Controls Toolbar (Hidden when printed) */}
        <div className="print:hidden bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Official NIST 800-88 Rev. 1 Certificate
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL CERTIFICATE DOCUMENT */}
        <div className="p-6 sm:p-10 text-slate-900 space-y-6 bg-white relative">
          {/* Watermark in background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <Award className="w-96 h-96 text-emerald-950" />
          </div>

          {/* Certificate Header */}
          <div className="text-center pb-6 border-b-2 border-emerald-900/10 space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-widest border border-emerald-200">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Certified Forensic Data Sanitization</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-2">
              CERTIFICATE OF DATA SANITIZATION
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Pursuant to NIST SP 800-88 Guidelines for Media Sanitization & DPDP Act 2023
            </p>
          </div>

          {/* Certificate Metadata Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Certificate ID</span>
              <span className="font-mono font-bold text-slate-900">{record.certificateId}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Device ID</span>
              <span className="font-mono font-bold text-emerald-700">{record.deviceId}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Sanitized Date</span>
              <span className="font-bold text-slate-900">{record.wipedAt}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Compliance</span>
              <span className="font-black text-emerald-800">100% VERIFIED</span>
            </div>
          </div>

          {/* Customer & Device Details Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Device & Customer Information
            </h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-slate-50/60">
                    <td className="py-2.5 px-4 font-bold text-slate-500 w-1/3">Original Customer</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{record.customerName}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-500">Device Model</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{record.deviceModel}</td>
                  </tr>
                  <tr className="bg-slate-50/60">
                    <td className="py-2.5 px-4 font-bold text-slate-500">IMEI Identifier</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{record.imei}</td>
                  </tr>
                  {record.serialNumber && (
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-slate-500">Serial Number</td>
                      <td className="py-2.5 px-4 font-mono font-semibold text-slate-900">{record.serialNumber}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Technical Sanitization Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Technical Sanitization Parameters
            </h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-slate-50/60">
                    <td className="py-2.5 px-4 font-bold text-slate-500 w-1/3">Standard Protocol</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{record.sanitizationStandard}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-500">Sanitization Algorithm</td>
                    <td className="py-2.5 px-4 text-slate-800">{record.algorithm} ({record.passesCompleted} Full Cycles)</td>
                  </tr>
                  <tr className="bg-slate-50/60">
                    <td className="py-2.5 px-4 font-bold text-slate-500">Verification Hash</td>
                    <td className="py-2.5 px-4 font-mono text-[10px] text-emerald-800 break-all">{record.sha256Hash}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-500">Processing Hub</td>
                    <td className="py-2.5 px-4 text-slate-800">{record.hubLocation}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Verification Affirmation & Officer Signature */}
          <div className="pt-4 border-t-2 border-emerald-900/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Residual Magnetic / Solid-State Traces</span>
              </div>
              <p className="text-[11px] text-slate-500 max-w-sm">
                This certifies that all flash blocks, secure enclaves, and user data partitions have been permanently destroyed and overwritten.
              </p>
            </div>

            <div className="text-center sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 w-full sm:w-auto">
              <div className="font-serif italic font-bold text-base text-slate-800">
                {record.securityOfficer}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Chief Security & Quality Officer
              </div>
              <div className="text-[9px] text-emerald-700 font-mono mt-0.5">
                SELBAR Secure Diagnostics Hub
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
