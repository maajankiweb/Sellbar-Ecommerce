'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  QrCode, Printer, CheckCircle2, Box, ShieldCheck, Tag,
  Barcode, Layers, ArrowLeft, RefreshCw, FileText, Check
} from 'lucide-react';

interface PackagedItem {
  id: string;
  orderNumber: string;
  barcode: string;
  device: string;
  grade: 'Grade A+' | 'Grade A' | 'Grade B';
  storageBin: string;
  antiStaticSealed: boolean;
  tamperTapeId: string;
  packedTime: string;
}

const INITIAL_PACKAGED: PackagedItem[] = [
  {
    id: 'pkg-1',
    orderNumber: 'ORD-QC-9921',
    barcode: 'SEL-88291-A-PL',
    device: 'Apple iPhone 14 (128GB, Blue)',
    grade: 'Grade A+',
    storageBin: 'BIN-APL-01 (Aisle 2)',
    antiStaticSealed: true,
    tamperTapeId: 'SEAL-#994018',
    packedTime: '10m ago',
  },
  {
    id: 'pkg-2',
    orderNumber: 'ORD-QC-9924',
    barcode: 'SEL-88294-B-SM',
    device: 'Samsung Galaxy S23 (256GB, Phantom Black)',
    grade: 'Grade A',
    storageBin: 'BIN-SAM-03 (Aisle 3)',
    antiStaticSealed: true,
    tamperTapeId: 'SEAL-#994019',
    packedTime: '25m ago',
  },
  {
    id: 'pkg-3',
    orderNumber: 'ORD-QC-9915',
    barcode: 'SEL-88288-A-MC',
    device: 'MacBook Air M2 16GB / 512GB (Midnight)',
    grade: 'Grade A+',
    storageBin: 'BIN-MAC-02 (Aisle 1)',
    antiStaticSealed: true,
    tamperTapeId: 'SEAL-#994020',
    packedTime: '1h ago',
  },
];

export default function PackagingPage() {
  const [items, setItems] = useState<PackagedItem[]>(INITIAL_PACKAGED);
  const [currentLabel, setCurrentLabel] = useState({
    device: 'Apple iPhone 15 Pro Max (512GB)',
    imei: '358941098234120',
    barcode: 'SEL-88291-A-PL',
    grade: 'Grade A+ (Certified Like-New)',
    qcTech: 'Karan Mehra (#STF-104)',
    bin: 'BIN-APL-01',
    warranty: '12 Months Comprehensive SELBAR Shield',
  });
  const [isPrinting, setIsPrinting] = useState(false);
  const [toast, setToast] = useState('');

  const handlePrintThermal = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      setToast('Label dispatched to Zebra ZD421 Thermal Barcode Printer!');
      setTimeout(() => setToast(''), 3000);
    }, 800);
  };

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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-300">
              Packaging & Intake Barcoding
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Station: Thermal Bay #3</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <QrCode className="w-6 h-6 text-blue-600" />
            Packaging, Barcodes & Bin Routing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Print thermal QR/Barcodes, apply anti-static bubble seal, and route passed inventory into designated warehouse bins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintThermal}
            disabled={isPrinting}
            className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm shadow-blue-600/20 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            {isPrinting ? 'Sending to Printer...' : 'Print Thermal Barcode (Zebra)'}
          </button>
        </div>
      </div>

      {/* Label Preview & Live Spec Sheet in White */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Label Mock */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
            Live Zebra Thermal Label Preview (4x6")
          </h2>

          <div className="bg-white text-slate-950 p-6 rounded-3xl shadow-md font-mono space-y-4 border-2 border-dashed border-slate-300">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <div className="font-black text-lg tracking-tight">SELBAR REFURBISHED</div>
              <div className="text-[10px] font-bold border border-slate-900 px-1.5 py-0.5">QC VERIFIED</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-500 uppercase font-sans font-bold">Item Model & Configuration:</div>
              <div className="text-sm font-black font-sans leading-tight mt-0.5">{currentLabel.device}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-b border-slate-200 py-2">
              <div>
                <span className="text-slate-500">IMEI:</span>
                <div className="font-bold">{currentLabel.imei}</div>
              </div>
              <div>
                <span className="text-slate-500">BIN:</span>
                <div className="font-black text-blue-600">{currentLabel.bin}</div>
              </div>
            </div>

            <div className="text-center py-2 space-y-1">
              <div className="h-12 bg-slate-950 flex items-center justify-center text-white text-[10px] tracking-widest font-black">
                ||||| | |||||| ||| |||| |||||| |||||
              </div>
              <div className="text-[10px] tracking-widest font-black text-slate-800">{currentLabel.barcode}</div>
            </div>

            <div className="border-t border-slate-200 pt-2 text-[10px] font-sans flex items-center justify-between">
              <span>Grade: <strong>{currentLabel.grade}</strong></span>
              <span>Tech: <strong>{currentLabel.qcTech}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Packaging Checklist & Station Actions in White */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Box className="w-4 h-4 text-blue-600" />
              Standard Packaging Protocol Checklist
            </h3>

            <div className="space-y-2.5 text-xs">
              {[
                'Device wiped with 99.8% isopropyl alcohol and microfiber lint-free cloth',
                'Screen covered with peel-off static-protective film',
                'Enclosed in MIL-STD 3010B certified anti-static bubble sleeve',
                'SELBAR Tamper-evident holographic serial seal applied',
                'Placed in standardized eco-friendly Kraft recyclable box',
              ].map((step, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-slate-700 font-medium">{step}</span>
                  <Check className="w-4 h-4 text-emerald-600 ml-auto shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Recently Packaged Items Table in White */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600" />
              Recently Packaged & Routed to Bins
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              {items.map(item => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{item.device}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Barcode: {item.barcode} • Tamper Seal: {item.tamperTapeId}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                      {item.storageBin}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.packedTime}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
