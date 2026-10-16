'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

export function WhatsAppFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('919876543210');

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/v1/settings');
        if (res.ok) {
          const data = await res.json();
          if (data?.settings?.supportPhone) {
            const clean = data.settings.supportPhone.replace(/[^0-9]/g, '');
            if (clean) setWhatsappNumber(clean);
          }
        }
      } catch {
        // Fallback silently
      }
    }
    loadSettings();
  }, []);

  const defaultText = 'Hi Sellbar, I want to inquire about selling or buying a smartphone!';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = message.trim() || defaultText;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  if (!whatsappNumber) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 select-none">
      {/* Popover Mini Chat Card */}
      {isOpen && (
        <div className="mb-3 w-76 sm:w-84 bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-sm backdrop-blur-xs">
                💬
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">Sellbar WhatsApp Desk</h4>
                <span className="text-[10px] text-emerald-100 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Online • Fast Doorstep Support
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-3.5 bg-slate-50 text-xs space-y-2.5">
            <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 text-slate-700">
              <p className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Namaste! Welcome to Sellbar.
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Connect directly with our support specialists for phone valuations, order tracking, or warranty inquiries.
              </p>
            </div>

            <form onSubmit={handleSend} className="space-y-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message or device model..."
                rows={2}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 placeholder-slate-400 resize-none"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
              >
                <span>Chat on WhatsApp</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide">
          Need Help? Chat
        </span>
      </button>
    </div>
  );
}

export default WhatsAppFloatingButton;
