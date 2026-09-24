'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Camera, X, Sparkles, Volume2, ScanLine, ArrowRight } from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'voice' | 'scanner';
}

export function VoiceSearchModal({ isOpen, onClose, mode }: VoiceSearchModalProps) {
  const router = useRouter();
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [scannerImei, setScannerImei] = useState('');
  const [scannerStep, setScannerStep] = useState<'scanning' | 'detected'>('scanning');

  useEffect(() => {
    if (!isOpen) {
      setTranscript('');
      setIsListening(false);
      setScannerImei('');
      setScannerStep('scanning');
      return;
    }

    if (mode === 'voice') {
      setIsListening(true);
      // Try Web Speech API if supported
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.lang = 'en-IN';

          recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const text = event.results[current][0].transcript;
            setTranscript(text);
          };

          recognition.onerror = () => {
            setIsListening(false);
          };

          recognition.onend = () => {
            setIsListening(false);
          };

          recognition.start();

          return () => {
            try {
              recognition.stop();
            } catch {}
          };
        } catch {}
      } else {
        // Fallback simulation for unsupported browsers
        const simulatedPhrases = ['iPhone 15 Pro Max', 'Sell Samsung Galaxy S23', 'MacBook Air M2'];
        const chosen = simulatedPhrases[Math.floor(Math.random() * simulatedPhrases.length)];
        let index = 0;
        const interval = setInterval(() => {
          if (index <= chosen.length) {
            setTranscript(chosen.slice(0, index));
            index++;
          } else {
            clearInterval(interval);
            setIsListening(false);
          }
        }, 80);
        return () => clearInterval(interval);
      }
    } else if (mode === 'scanner') {
      // Simulated camera barcode/IMEI scanner
      const timer = setTimeout(() => {
        setScannerImei('356892110482914');
        setScannerStep('detected');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleVoiceSearchSubmit = (query: string) => {
    if (!query.trim()) return;
    onClose();
    router.push(`/sell?search=${encodeURIComponent(query.trim())}`);
  };

  const handleImeiValuation = () => {
    onClose();
    router.push(`/sell?imei=${scannerImei}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 overflow-hidden">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {mode === 'voice' ? (
          /* Voice Search View */
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                SELBAR Voice Assist
              </span>
              <h3 className="text-xl font-black text-slate-900">
                {isListening ? 'Listening to you...' : 'Search Completed'}
              </h3>
              <p className="text-xs text-slate-500">
                Say your gadget model (e.g. "Sell iPhone 14", "Buy Refurbished MacBook")
              </p>
            </div>

            {/* Pulsing Mic Visualizer */}
            <div className="relative py-4 flex items-center justify-center">
              {isListening && (
                <>
                  <div className="absolute w-24 h-24 rounded-full bg-emerald-500/20 animate-ping" />
                  <div className="absolute w-20 h-20 rounded-full bg-emerald-500/30 animate-pulse" />
                </>
              )}
              <div className="relative z-10 w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                <Mic className="w-7 h-7" />
              </div>
            </div>

            {/* Transcript Display Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-sm font-bold text-slate-900 min-h-[50px] flex items-center justify-center">
              {transcript || <span className="text-slate-400 font-normal">Speak now...</span>}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleVoiceSearchSubmit(transcript || 'iPhone 15')}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                <span>Search Device</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Barcode / IMEI Scanner View */
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <ScanLine className="w-3.5 h-3.5 text-blue-600" />
                IMEI / Barcode Scanner
              </span>
              <h3 className="text-xl font-black text-slate-900">
                {scannerStep === 'scanning' ? 'Align Barcode on Box' : 'Device Verified!'}
              </h3>
              <p className="text-xs text-slate-500">
                Point camera at device retail box barcode or dial *#06# on your dialer
              </p>
            </div>

            {/* Simulated Camera Viewfinder */}
            <div className="relative h-48 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-blue-400/80">
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-rose-500 shadow-lg shadow-rose-500/80 animate-pulse" />
              <div className="text-center space-y-2 z-10">
                <Camera className="w-8 h-8 text-white/60 mx-auto" />
                <span className="text-[10px] text-white/70 font-mono">
                  {scannerStep === 'scanning' ? 'Optical Sensor Active • Scanning...' : 'IMEI Match Found'}
                </span>
              </div>
            </div>

            {scannerStep === 'detected' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-left space-y-1">
                <div className="text-[10px] font-bold text-emerald-800 uppercase">Detected Hardware IMEI</div>
                <div className="text-xs font-mono font-black text-slate-900">{scannerImei}</div>
                <div className="text-[10px] text-slate-500">Apple iPhone 14 Pro 128GB • Space Black</div>
              </div>
            )}

            <button
              type="button"
              disabled={scannerStep !== 'detected'}
              onClick={handleImeiValuation}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2"
            >
              <span>Instant Valuation with this IMEI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VoiceSearchModal;
