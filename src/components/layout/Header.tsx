'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  ShoppingBag,
  User as UserIcon,
  MapPin,
  ChevronDown,
  X,
  Smartphone,
  CheckCircle2,
  HelpCircle,
  LogOut,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Home
} from 'lucide-react';
import { AUTHORIZED_LOCATIONS } from '@/lib/constants/locations';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalCount, setIsCartOpen } = useCart();
  const { user, isLoggedIn, logout, setIsAuthModalOpen } = useAuth();

  // Sticky & Visual Navigation States
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Bettiah, West Champaran (845438)');
  const [userPincode, setUserPincode] = useState('845438');
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search & Typeahead States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Load saved location/pincode from localStorage or cookie
  useEffect(() => {
    try {
      const savedCity = localStorage.getItem('sellbar_user_city');
      const savedPin = localStorage.getItem('sellbar_user_pincode');
      if (savedCity) setSelectedCity(savedCity);
      if (savedPin) setUserPincode(savedPin);
    } catch {
      // Ignore in restricted environments
    }
  }, []);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside listener for search & user dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search typeahead over active catalog
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/v1/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
          setShowSearchResults(true);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectLocation = (loc: typeof AUTHORIZED_LOCATIONS[0]) => {
    const cityStr = `${loc.name}, Bihar (${loc.pincode})`;
    setSelectedCity(cityStr);
    setUserPincode(loc.pincode);
    try {
      localStorage.setItem('sellbar_user_city', cityStr);
      localStorage.setItem('sellbar_user_pincode', loc.pincode);
      document.cookie = `sellbar_pincode=${loc.pincode}; path=/; max-age=2592000; SameSite=Lax`;
    } catch {}
    setShowLocationModal(false);
  };

  const handleCustomPincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = pincodeInput.trim();
    if (!/^\d{6}$/.test(pin)) {
      setPincodeError('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    const matched = AUTHORIZED_LOCATIONS.find((l) => l.pincode === pin);
    const cityStr = matched ? `${matched.name}, Bihar (${pin})` : `Pincode ${pin}`;
    setSelectedCity(cityStr);
    setUserPincode(pin);
    try {
      localStorage.setItem('sellbar_user_city', cityStr);
      localStorage.setItem('sellbar_user_pincode', pin);
      document.cookie = `sellbar_pincode=${pin}; path=/; max-age=2592000; SameSite=Lax`;
    } catch {}
    setPincodeError('');
    setPincodeInput('');
    setShowLocationModal(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      setShowMobileSearch(false);
      router.push(`/buy?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Hide bottom nav on checkout or payment flow
  const hideBottomNav =
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/order/sell') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/seller');

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-white/95 backdrop-blur-md border-b ${
          isScrolled ? 'border-slate-200 shadow-sm' : 'border-slate-200/70 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Brand Logo + Pincode Chip */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-linear-to-tr from-blue-600 via-teal-500 to-emerald-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform duration-200">
                S
              </div>
              <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-950 flex items-center leading-tight">
                <span className="text-blue-600">SELL</span>
                <span className="text-emerald-600">BAR</span>
              </span>
            </Link>

            {/* Pincode Location Chip */}
            <button
              type="button"
              onClick={() => setShowLocationModal(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/80 hover:bg-slate-100/70 text-slate-700 text-xs font-semibold transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="max-w-28.75 truncate">{selectedCity.split(',')[0]} ({userPincode})</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Center: Search Bar with Typeahead (Desktop) */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-md relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowSearchResults(true);
                }}
                placeholder="Search phone model (e.g. iPhone 13, Galaxy S23)..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-slate-200/80 focus:border-emerald-500 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Typeahead Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in-0 duration-150">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1">
                  Matching Models
                </div>
                {searchResults.slice(0, 5).map((item) => (
                  <Link
                    key={item.id || item.slug}
                    href={item.href || `/buy/${item.slug}`}
                    onClick={() => setShowSearchResults(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 text-xs transition"
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-semibold text-slate-800">{item.name || item.title}</span>
                    </div>
                    {item.price && (
                      <span className="font-bold text-emerald-700">₹{item.price.toLocaleString('en-IN')}</span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right: Navigation Links & Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 text-xs font-bold text-slate-800">
              <Link
                href="/sell"
                className={`transition-colors py-1 hover:text-emerald-600 ${
                  pathname.startsWith('/sell') ? 'text-emerald-600' : ''
                }`}
              >
                Sell Phone
              </Link>
              <Link
                href="/buy"
                className={`transition-colors py-1 hover:text-emerald-600 ${
                  pathname.startsWith('/buy') ? 'text-emerald-600' : ''
                }`}
              >
                Buy Phone
              </Link>
              <Link
                href="/how-it-works"
                className={`transition-colors py-1 hover:text-emerald-600 ${
                  pathname === '/how-it-works' ? 'text-emerald-600' : ''
                }`}
              >
                How it works
              </Link>
              <Link
                href="/faq"
                className={`transition-colors py-1 hover:text-emerald-600 ${
                  pathname === '/faq' ? 'text-emerald-600' : ''
                }`}
              >
                Help
              </Link>
            </nav>

            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              aria-label="Open Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Login / User Profile (Desktop & Mobile) */}
            <div ref={userDropdownRef} className="relative">
              {isLoggedIn ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">
                      {(user?.name?.[0] || user?.phone?.[0] || 'U').toUpperCase()}
                    </div>
                    <span className="max-w-20 truncate hidden sm:inline">{user?.name || user?.phone}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-xs space-y-1 animate-in fade-in-0 duration-150">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <div className="font-bold text-slate-900 truncate">{user?.name || 'Sellbar User'}</div>
                        <div className="text-[10px] text-slate-400 truncate">{user?.phone || user?.email}</div>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold"
                      >
                        <ShoppingBag className="w-4 h-4 text-emerald-600" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        href="/user/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold"
                      >
                        <UserIcon className="w-4 h-4 text-blue-600" />
                        <span>Profile & Settings</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-bold transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Full-Screen/Expandable Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden px-4 pb-3 pt-1 border-t border-slate-100 animate-in fade-in-0 duration-150">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phone model..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <button
                type="button"
                onClick={() => setShowMobileSearch(false)}
                className="absolute right-2.5 p-1 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Spacer to guarantee content is never hidden behind fixed header */}
      <div className="h-16 sm:h-18 shrink-0" aria-hidden="true" />

      {/* Pincode / Location Selection Sheet/Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-slate-900">Select Pickup & Delivery City</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="p-1 rounded-xl hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Free doorstep inspection & 24h pickup are currently available across these verified hubs:
            </p>

            {/* Quick Hub Badges */}
            <div className="grid grid-cols-2 gap-2">
              {AUTHORIZED_LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelectLocation(loc)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    userPincode === loc.pincode
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{loc.name}</div>
                  <div className="text-[10px] text-slate-400">PIN: {loc.pincode}</div>
                </button>
              ))}
            </div>

            {/* Custom Pincode Form */}
            <form onSubmit={handleCustomPincodeSubmit} className="pt-2 border-t border-slate-100">
              <label htmlFor="pincode-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                Or enter your 6-digit Pincode:
              </label>
              <div className="flex gap-2">
                <input
                  id="pincode-input"
                  type="text"
                  maxLength={6}
                  value={pincodeInput}
                  onChange={(e) => {
                    setPincodeInput(e.target.value.replace(/\D/g, ''));
                    setPincodeError('');
                  }}
                  placeholder="e.g. 845438"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                >
                  Apply
                </button>
              </div>
              {pincodeError && <p className="text-[11px] text-rose-600 mt-1">{pincodeError}</p>}
            </form>
          </div>
        </div>
      )}

      {/* MOBILE STICKY BOTTOM NAVIGATION BAR (5 Tabs as mandated by §3.1) */}
      {!hideBottomNav && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 pt-1.5 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-lg">
          <div className="grid grid-cols-5 gap-1 text-center">
            {/* 1. Home */}
            <Link
              href="/"
              className={`min-h-11 flex flex-col items-center justify-center py-1 rounded-xl transition ${
                pathname === '/' ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">Home</span>
            </Link>

            {/* 2. Sell */}
            <Link
              href="/sell"
              className={`min-h-11 flex flex-col items-center justify-center py-1 rounded-xl transition ${
                pathname.startsWith('/sell') ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">Sell</span>
            </Link>

            {/* 3. Buy */}
            <Link
              href="/buy"
              className={`min-h-11 flex flex-col items-center justify-center py-1 rounded-xl transition ${
                pathname.startsWith('/buy') ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">Buy</span>
            </Link>

            {/* 4. Orders */}
            <Link
              href={isLoggedIn ? '/account' : '#'}
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  setIsAuthModalOpen(true);
                }
              }}
              className={`min-h-11 flex flex-col items-center justify-center py-1 rounded-xl transition ${
                pathname.startsWith('/account') ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">Orders</span>
            </Link>

            {/* 5. Account */}
            <Link
              href={isLoggedIn ? '/user/profile' : '#'}
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  setIsAuthModalOpen(true);
                }
              }}
              className={`min-h-11 flex flex-col items-center justify-center py-1 rounded-xl transition ${
                pathname.startsWith('/user') ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">Account</span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
