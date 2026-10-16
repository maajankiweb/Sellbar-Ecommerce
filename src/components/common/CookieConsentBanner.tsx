'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Cookie, X } from 'lucide-react';

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user already submitted consent
    const consent = localStorage.getItem('sellbar_cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('sellbar_cookie_consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('sellbar_cookie_consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-slate-900 text-white p-5 rounded-3xl shadow-2xl border border-slate-700/80 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="space-y-2 text-xs">
          <div className="font-bold text-sm text-white">Your Privacy Choices</div>
          <p className="text-slate-300 leading-relaxed">
            Sellbar uses essential cookies to ensure safe checkout and secure authentication. We request your consent before running analytics cookies under the DPDP Act 2023.
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <button
              onClick={handleAccept}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-xs"
            >
              Accept All
            </button>
            <button
              onClick={handleDecline}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
            >
              Essential Only
            </button>
            <Link
              href="/legal/cookies"
              className="text-[11px] text-emerald-400 hover:underline ml-1"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieConsentBanner;
