'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  X,
  Send,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'bot' | 'user'; text: string }[]>([
    { sender: 'bot', text: 'Hi there! 👋 How can we help you with selling, buying, or repairing your gadget today?' }
  ]);

  // Suppress storefront footer on admin, seller, or account dashboard routes
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/seller') ||
    pathname.startsWith('/account')
  ) {
    return null;
  }

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatHistory((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatMessage('');

    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Thanks for reaching out! Our doorstep technician / support specialist will connect with you in under 2 minutes. You can also call us at 1800-SELBAR-HELP.'
        }
      ]);
    }, 800);
  };

  return (
    <footer className="bg-[#F8FAFC] border-t border-slate-200 text-slate-700 pt-16 pb-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-10">
          {/* Column 1: Brand & Socials */}
          <div className="col-span-2 md:col-span-1 space-y-6">
            {/* Logo (Exact Navbar Logo) */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-teal-500 to-emerald-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-600/20">
                S
              </div>
              <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-950 flex items-center leading-tight">
                <span className="text-blue-600">SEL</span><span className="text-emerald-600">BAR</span>
              </span>
            </Link>

            {/* Social Follow */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-600 block">
                Follow us on
              </span>
              <div className="flex items-center gap-2.5">
                {/* Twitter / X */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter / X"
                  className="w-8 h-8 rounded-full bg-[#475569] hover:bg-[#14B8A6] text-white flex items-center justify-center transition-colors shadow-xs"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-[#475569] hover:bg-[#14B8A6] text-white flex items-center justify-center transition-colors shadow-xs"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-[#475569] hover:bg-[#14B8A6] text-white flex items-center justify-center transition-colors shadow-xs"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-[#475569] hover:bg-[#14B8A6] text-white flex items-center justify-center transition-colors shadow-xs"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4 tracking-tight">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li><Link href="/sell" className="hover:text-[#14B8A6] transition-colors">Sell Phone</Link></li>
              <li><Link href="/sell?category=tv" className="hover:text-[#14B8A6] transition-colors">Sell Television</Link></li>
              <li><Link href="/sell?category=smartwatch" className="hover:text-[#14B8A6] transition-colors">Sell Smart Watch</Link></li>
              <li><Link href="/sell?category=smart-speakers" className="hover:text-[#14B8A6] transition-colors">Sell Smart Speakers</Link></li>
              <li><Link href="/sell?category=camera" className="hover:text-[#14B8A6] transition-colors">Sell DSLR Camera</Link></li>
              <li><Link href="/sell?category=earbuds" className="hover:text-[#14B8A6] transition-colors">Sell Earbuds</Link></li>
              <li><Link href="/repair" className="hover:text-[#14B8A6] transition-colors">Repair Phone</Link></li>
              <li><Link href="/buy" className="hover:text-[#14B8A6] transition-colors">Buy Gadgets</Link></li>
              <li><Link href="/recycle" className="hover:text-[#14B8A6] transition-colors">Recycle Phone</Link></li>
              <li><Link href="/buy?category=new-phone" className="hover:text-[#14B8A6] transition-colors">Find New Phone</Link></li>
              <li><Link href="/partner" className="hover:text-[#14B8A6] transition-colors">Partner With Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4 tracking-tight">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li><Link href="/how-it-works" className="hover:text-[#14B8A6] transition-colors">About Us</Link></li>
              <li><Link href="/partner" className="hover:text-[#14B8A6] transition-colors">Careers</Link></li>
              <li><Link href="/faq" className="hover:text-[#14B8A6] transition-colors">Articles</Link></li>
              <li><Link href="/how-it-works" className="hover:text-[#14B8A6] transition-colors">Press Releases</Link></li>
              <li><Link href="/partner" className="hover:text-[#14B8A6] transition-colors">Become SELBAR Partner</Link></li>
              <li><Link href="/partner" className="hover:text-[#14B8A6] transition-colors">Become Supersale Partner</Link></li>
              <li><Link href="/how-it-works" className="hover:text-[#14B8A6] transition-colors">Corporate Information</Link></li>
            </ul>
          </div>

          {/* Column 4: Sell Device */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4 tracking-tight">
              Sell Device
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li><Link href="/sell" className="hover:text-[#14B8A6] transition-colors">Mobile Phone</Link></li>
              <li><Link href="/sell?category=laptop" className="hover:text-[#14B8A6] transition-colors">Laptop</Link></li>
              <li><Link href="/sell?category=tablet" className="hover:text-[#14B8A6] transition-colors">Tablet</Link></li>
              <li><Link href="/sell?category=desktop" className="hover:text-[#14B8A6] transition-colors">iMac</Link></li>
              <li><Link href="/sell?category=gaming" className="hover:text-[#14B8A6] transition-colors">Gaming Consoles</Link></li>
            </ul>
          </div>

          {/* Column 5: Help & Support */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4 tracking-tight">
              Help & Support
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li><Link href="/faq" className="hover:text-[#14B8A6] transition-colors">FAQ</Link></li>
              <li><Link href="/stores" className="hover:text-[#14B8A6] transition-colors">Contact Us</Link></li>
              <li><Link href="/warranty" className="hover:text-[#14B8A6] transition-colors">Warranty Policy</Link></li>
              <li><Link href="/warranty" className="hover:text-[#14B8A6] transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Column 6: More Info & Chat with Us Widget */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-4 tracking-tight">
                More Info
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                <li><Link href="/faq" className="hover:text-[#14B8A6] transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/data-wipe" className="hover:text-[#14B8A6] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/faq" className="hover:text-[#14B8A6] transition-colors">Terms of Use</Link></li>
                <li><Link href="/recycle" className="hover:text-[#14B8A6] transition-colors">E-Waste Policy</Link></li>
                <li><Link href="/data-wipe" className="hover:text-[#14B8A6] transition-colors">Cookie Policy</Link></li>
                <li><Link href="/warranty" className="hover:text-[#14B8A6] transition-colors">What is Refurbished</Link></li>
              </ul>
            </div>

            {/* Chat with Us Widget Card (Exactly as in screenshot) */}
            <div
              onClick={() => setIsChatOpen(true)}
              className="bg-[#2DD4BF] hover:bg-[#14B8A6] text-white p-3.5 rounded-2xl shadow-md cursor-pointer transition-all flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-[#14B8A6] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold leading-tight">Chat with Us</div>
                <div className="text-[11px] text-white/90">Got questions? Just ask.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © 2026 SELBAR. All rights reserved. Built By{' '}
            <a
              href="https://maajankiwebtech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-800 hover:text-[#00a599] transition underline decoration-slate-300 underline-offset-2"
            >
              Maajanki Web Tech
            </a>
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/warranty" className="hover:text-[#14B8A6]">Warranty Policy</Link>
            <span>•</span>
            <Link href="/data-wipe" className="hover:text-[#14B8A6]">DPDP Act 2023</Link>
            <span>•</span>
            <Link href="/faq" className="hover:text-[#14B8A6]">Help & FAQs</Link>
          </div>
        </div>
      </div>

      {/* Interactive Chat Dialog */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#14B8A6] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold">SELBAR Live Support</h4>
                <span className="text-[10px] text-white/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  Online • Typically replies instantly
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              className="p-1 text-white/80 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="p-4 h-64 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-[#14B8A6] text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything about sell, buy, repair..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#14B8A6]"
            />
            <button
              type="submit"
              className="p-2 bg-[#14B8A6] hover:bg-teal-700 text-white rounded-xl transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </footer>
  );
}
