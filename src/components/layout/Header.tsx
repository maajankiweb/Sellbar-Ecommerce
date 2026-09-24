'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  User as UserIcon,
  MapPin,
  Menu,
  X,
  Sparkles,
  Search,
  ShieldCheck,
  ChevronDown,
  Smartphone,
  Laptop,
  Watch,
  Tablet,
  Tv,
  Gamepad2,
  Headphones,
  Wrench,
  Recycle,
  Building,
  TrendingDown,
  Handshake,
  Percent,
  CheckCircle2,
  Zap,
  Home,
  ArrowRight,
  LogOut,
  HelpCircle,
  Clock,
  Camera,
  Layers,
  ChevronRight,
  Mic,
} from 'lucide-react';
import { MODELS, REFURB_PRODUCTS } from '@/lib/db/data';
import { AUTHORIZED_LOCATIONS, AuthorizedLocation } from '@/lib/location/config';
import { VoiceSearchModal } from '@/components/common/VoiceSearchModal';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalCount } = useCart();
  const { user, isLoggedIn, setIsAuthModalOpen, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Bettiah, West Champaran');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [voiceModal, setVoiceModal] = useState<{ isOpen: boolean; mode: 'voice' | 'scanner' }>({
    isOpen: false,
    mode: 'voice'
  });

  // Sync with localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selbar_selected_city');
      if (saved) {
        setSelectedCity(saved);
      }
    }
  }, []);

  const handleSelectLocation = (location: AuthorizedLocation) => {
    setSelectedCity(location.displayName);
    setShowCityPicker(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selbar_selected_city', location.displayName);
      window.dispatchEvent(new CustomEvent('selbar_location_change', { detail: location }));
    }
  };

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const cityPickerRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Mega dropdown hover states
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [allSubMenu, setAllSubMenu] = useState<string | null>(null);
  const [gadgetsSubMenu, setGadgetsSubMenu] = useState<string | null>(null);
  const [findNewSubMenu, setFindNewSubMenu] = useState<string | null>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menuName: string) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMegaMenu(menuName);
    setAllSubMenu(null);
    setGadgetsSubMenu(null);
    setFindNewSubMenu(null);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
      setAllSubMenu(null);
      setGadgetsSubMenu(null);
      setFindNewSubMenu(null);
    }, 150);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (cityPickerRef.current && !cityPickerRef.current.contains(e.target as Node)) {
        setShowCityPicker(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? [
        ...MODELS.filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4),
        ...REFURB_PRODUCTS.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3),
      ]
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    router.push(`/sell?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs select-none">
        {/* TOP TIER: Brand Logo + Location + Search + Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo & Location Pill */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-teal-500 to-emerald-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform duration-200">
                S
              </div>
              <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-950 flex items-center leading-tight">
                <span className="text-blue-600">SEL</span>
                <span className="text-emerald-600">BAR</span>
              </span>
            </Link>

            {/* Modern City Location Selector Pill */}
            <div ref={cityPickerRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setShowCityPicker(!showCityPicker)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  showCityPicker
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-xs'
                    : 'border-slate-200/90 hover:border-slate-300 bg-slate-50/80 text-slate-700 hover:bg-slate-100/70'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="max-w-[115px] truncate">{selectedCity.split(',')[0]}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${showCityPicker ? 'rotate-180 text-emerald-600' : ''}`} />
              </button>

              {/* Modern City Picker Dropdown */}
              {showCityPicker && (
                <div className="absolute top-full left-0 mt-2.5 w-72 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-100 p-3 z-50 text-slate-800 text-xs animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ring-1 ring-slate-900/5">
                  <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Location Hub</span>
                      <span className="text-xs font-bold text-slate-900">Select City Hub</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">Active</span>
                  </div>
                  <div className="px-3 py-1.5 text-[11px] text-slate-500 bg-emerald-50/60 rounded-xl my-2">
                    Free express pickup & delivery available in:
                  </div>
                  <div className="space-y-1 max-h-56 overflow-y-auto">
                    {AUTHORIZED_LOCATIONS.map((loc) => {
                      const isSelected = selectedCity.includes(loc.name);
                      return (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => handleSelectLocation(loc)}
                          className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between ${
                            isSelected
                              ? 'font-bold text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 shadow-xs'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-xs flex items-center gap-1.5">
                              <span>{loc.name}</span>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                            </div>
                            <div className="text-[10px] text-slate-400">Pincode {loc.pincodes[0]} • Hub #{loc.id.slice(-2)}</div>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Central Search Bar */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl relative">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full relative flex items-center shadow-xs rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/90 focus-within:border-emerald-500 focus-within:bg-white focus-within:shadow-md focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all duration-200"
            >
              <div className="pl-3.5 text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search for iPhone 15, MacBook, Galaxy S24, PS5..."
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                className="w-full py-2.5 px-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none bg-transparent"
              />
              <div className="flex items-center gap-1 mr-1.5">
                <button
                  type="button"
                  onClick={() => setVoiceModal({ isOpen: true, mode: 'voice' })}
                  title="Voice Search"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setVoiceModal({ isOpen: true, mode: 'scanner' })}
                  title="Scan Box Barcode / IMEI"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                type="submit"
                className="mr-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition shrink-0"
              >
                Search
              </button>
            </form>

            {/* Modern Search Autocomplete Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-100 p-3 z-50 max-h-88 overflow-y-auto animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ring-1 ring-slate-900/5">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Direct Matches</span>
                  <span className="text-emerald-600 font-semibold">{searchResults.length} Found</span>
                </div>
                <div className="space-y-1 mt-1">
                  {searchResults.map((item: any) => {
                    const isModel = 'variants' in item;
                    const href = isModel ? `/sell/${item.slug}` : `/buy/${item.slug}`;
                    const title = item.name;
                    const price = isModel ? item.variants?.[0]?.basePrice || 15000 : item.price || item.grades?.[0]?.price || 30000;
                    const img = item.imageUrl || item.images?.[0];

                    return (
                      <Link
                        key={item.id || item.slug}
                        href={href}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center justify-between p-2.5 hover:bg-emerald-50/70 rounded-2xl transition group border border-transparent hover:border-emerald-200/50"
                      >
                        <div className="flex items-center gap-3">
                          {img ? (
                            <img src={img} alt={title} className="w-9 h-9 object-contain rounded-xl bg-slate-50 p-1 border border-slate-100 shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                              <Smartphone className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 line-clamp-1">
                              {title}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {isModel ? 'Sell device for instant cash' : 'Certified refurbished with 12M warranty'}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-black text-emerald-700 shrink-0 bg-emerald-50 px-2 py-1 rounded-lg">
                          {isModel ? `Up to ₹${price.toLocaleString('en-IN')}` : `₹${price.toLocaleString('en-IN')}`}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Login / User Account with Modern Profile Dropdown */}
            <div ref={userDropdownRef} className="relative">
              {isLoggedIn ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition shadow-xs"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">
                      {(user?.name?.[0] || user?.phone?.[0] || 'U').toUpperCase()}
                    </div>
                    <span className="max-w-[80px] truncate hidden sm:inline">{user?.name || user?.phone}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {/* Modern User Profile Dropdown */}
                  {showUserDropdown && (
                    <div className="absolute top-full right-0 mt-2.5 w-60 bg-white/98 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-100 p-3 z-50 text-xs animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 ring-1 ring-slate-900/5 space-y-1">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <div className="font-black text-slate-900 truncate">{user?.name || 'SELBAR Member'}</div>
                        <div className="text-[10px] text-slate-500 truncate">{user?.phone || user?.email}</div>
                      </div>

                      <Link
                        href="/account"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold"
                      >
                        <UserIcon className="w-4 h-4 text-emerald-600" />
                        <span>My Account & Orders</span>
                      </Link>

                      <Link
                        href="/seller"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold"
                      >
                        <Building className="w-4 h-4 text-blue-600" />
                        <span>Seller Central Portal</span>
                      </Link>

                      <Link
                        href="/faq"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold"
                      >
                        <HelpCircle className="w-4 h-4 text-slate-500" />
                        <span>Help & Support</span>
                      </Link>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-bold transition"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE FULL-WIDTH SEARCH BAR */}
        <div className="md:hidden px-4 pb-2.5 pt-0.5">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full relative flex items-center rounded-xl bg-slate-100 border border-slate-200 p-1"
          >
            <div className="pl-2.5 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search mobiles, laptops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-1.5 px-2 text-xs text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs shrink-0"
            >
              Search
            </button>
          </form>
        </div>

        {/* SECONDARY MODERN NAVIGATION MENU STRIP (Desktop Mega Nav - Cashify Exact Style) */}
        <nav className="hidden lg:flex items-center border-t border-slate-200/80 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between py-1">
            {/* 1. All Mega Menu (2-Panel Flyout - Screenshot 1) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('all')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`flex items-center gap-1 text-[13px] font-bold transition-colors py-2 cursor-pointer ${
                  activeMegaMenu === 'all'
                    ? 'text-[#00a599]'
                    : 'text-slate-900 hover:text-[#00a599]'
                }`}
              >
                <span>All</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMegaMenu === 'all' ? 'rotate-180 text-[#00a599]' : 'text-slate-700'
                  }`}
                />
              </button>

              {activeMegaMenu === 'all' && (
                <div className="absolute top-full left-0 mt-0.5 bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100 z-50 flex animate-in fade-in-0 zoom-in-95 duration-150">
                  {/* Left Column (Width ~ 195px) */}
                  <div className={`w-[195px] p-3 space-y-0.5 text-xs ${allSubMenu ? 'border-r border-slate-100' : ''}`}>
                    <div className="font-bold text-slate-900 px-3 pt-1 pb-1.5 text-[13px]">
                      Sell
                    </div>
                    {[
                      { id: 'phone', label: 'Phone', href: '/sell?category=phone' },
                      { id: 'laptop', label: 'Laptop', href: '/sell?category=laptop' },
                      { id: 'smartwatch', label: 'Smartwatch', href: '/sell?category=smartwatch' },
                      { id: 'tablet', label: 'Tablet', href: '/sell?category=tablet' },
                      { id: 'more', label: 'More', href: '/sell' },
                    ].map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onMouseEnter={() => setAllSubMenu(item.id)}
                        className={`px-3 py-1.5 rounded-lg flex items-center justify-between text-xs font-semibold transition-colors ${
                          allSubMenu === item.id
                            ? 'bg-[#eef7f6] text-[#00a599] font-bold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-[#00a599]'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronRight className={`w-3.5 h-3.5 ${allSubMenu === item.id ? 'text-[#00a599]' : 'text-slate-400'}`} />
                      </Link>
                    ))}

                    <div className="pt-2 border-t border-slate-100/80 space-y-0.5">
                      {[
                        { id: 'repair', label: 'Repair', href: '/repair' },
                        { id: 'sellGadgets', label: 'Sell Gadgets', href: '/sell' },
                        { id: 'buyGadgets', label: 'Buy Gadgets', href: '/buy' },
                        { id: 'recycle', label: 'Recycle', href: '/recycle' },
                        { id: 'findNewPhone', label: 'Find New Phone', href: '/buy?category=new-phone' },
                        { id: 'store', label: 'SELBAR Store', href: '/stores' },
                      ].map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          onMouseEnter={() => setAllSubMenu(item.id)}
                          className={`px-3 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                            allSubMenu === item.id
                              ? 'bg-[#eef7f6] text-[#00a599] font-bold'
                              : 'text-slate-900 font-bold hover:bg-slate-50 hover:text-[#00a599]'
                          }`}
                        >
                          <span>{item.label}</span>
                          <ChevronRight className={`w-3.5 h-3.5 ${allSubMenu === item.id ? 'text-[#00a599]' : 'text-slate-400'}`} />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Right Column (Width ~ 230px) - ONLY rendered when an item is hovered */}
                  {allSubMenu && (
                    <div className="w-[230px] p-4 text-xs animate-in fade-in-0 duration-100">
                      <div className="text-[11px] text-slate-400 font-medium mb-2">
                        More in {allSubMenu === 'phone' ? 'Sell Phone' : allSubMenu === 'laptop' ? 'Sell Laptop' : allSubMenu === 'smartwatch' ? 'Sell Smartwatch' : allSubMenu === 'tablet' ? 'Sell Tablet' : allSubMenu === 'more' ? 'More Devices' : allSubMenu === 'repair' ? 'Repair' : allSubMenu === 'sellGadgets' ? 'Sell Gadgets' : allSubMenu === 'buyGadgets' ? 'Buy Gadgets' : allSubMenu === 'recycle' ? 'Recycle' : allSubMenu === 'findNewPhone' ? 'New Phone' : 'SELBAR Store'}
                      </div>

                      {allSubMenu === 'laptop' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Top Brands</div>
                          {['Apple MacBook', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer'].map((b) => (
                            <Link key={b} href={`/sell?category=laptop&brand=${encodeURIComponent(b)}`} className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {b}
                            </Link>
                          ))}
                          <div className="font-bold text-[13px] text-slate-900 mt-4 mb-2">Popular Models</div>
                          {['MacBook Air M1', 'MacBook Air M2', 'ThinkPad T14', 'Dell Inspiron 15', 'HP Pavilion 14'].map((m) => (
                            <Link key={m} href="/sell?category=laptop" className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {m}
                            </Link>
                          ))}
                        </>
                      ) : allSubMenu === 'smartwatch' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Top Brands</div>
                          {['Apple Watch', 'Samsung Galaxy Watch', 'Noise', 'boAt', 'Fire-Boltt', 'Amazfit'].map((b) => (
                            <Link key={b} href="/sell?category=smartwatch" className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {b}
                            </Link>
                          ))}
                          <div className="font-bold text-[13px] text-slate-900 mt-4 mb-2">Popular Watches</div>
                          {['Apple Watch Series 8', 'Apple Watch SE', 'Galaxy Watch 4', 'Galaxy Watch 5'].map((w) => (
                            <Link key={w} href="/sell?category=smartwatch" className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {w}
                            </Link>
                          ))}
                        </>
                      ) : allSubMenu === 'tablet' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Top Brands</div>
                          {['Apple iPad', 'Samsung Galaxy Tab', 'Lenovo Tab', 'Xiaomi Pad', 'Realme Pad'].map((b) => (
                            <Link key={b} href="/sell?category=tablet" className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {b}
                            </Link>
                          ))}
                          <div className="font-bold text-[13px] text-slate-900 mt-4 mb-2">Popular Tablets</div>
                          {['iPad Air 5th Gen', 'iPad 9th Gen', 'iPad Pro 11', 'Galaxy Tab S8'].map((t) => (
                            <Link key={t} href="/sell?category=tablet" className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {t}
                            </Link>
                          ))}
                        </>
                      ) : allSubMenu === 'more' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">More Devices</div>
                          {['Smart Speakers', 'Gaming Consoles', 'Smart TV', 'DSLR Camera', 'Earbuds', 'Air Conditioners'].map((md) => (
                            <Link key={md} href="/sell" className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {md}
                            </Link>
                          ))}
                        </>
                      ) : allSubMenu === 'repair' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Popular Repairs</div>
                          {['Screen Glass Replacement', 'Battery Replacement', 'Charging Port Repair', 'Camera Glass Repair', 'Speaker / Ear-Piece Fix', 'Water Damage Diagnostic'].map((r) => (
                            <Link key={r} href="/repair" className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {r}
                            </Link>
                          ))}
                        </>
                      ) : allSubMenu === 'sellGadgets' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Sell Any Device</div>
                          {[
                            { name: 'Sell Phone', href: '/sell?category=phone' },
                            { name: 'Sell Laptop', href: '/sell?category=laptop' },
                            { name: 'Sell Smartwatch', href: '/sell?category=smartwatch' },
                            { name: 'Sell Tablet', href: '/sell?category=tablet' },
                            { name: 'Sell TV', href: '/sell?category=tv' },
                            { name: 'Sell Gaming Console', href: '/sell?category=gaming' },
                          ].map((g) => (
                            <Link key={g.name} href={g.href} className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {g.name}
                            </Link>
                          ))}
                        </>
                      ) : allSubMenu === 'buyGadgets' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Buy Refurbished</div>
                          {[
                            { name: 'Refurbished Phones', href: '/buy?category=old-phone' },
                            { name: 'Refurbished Laptops', href: '/buy?category=old-laptop' },
                            { name: 'Refurbished Smartwatches', href: '/buy?category=smartwatch' },
                            { name: 'Refurbished Tablets', href: '/buy?category=tablet' },
                          ].map((b) => (
                            <Link key={b.name} href={b.href} className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {b.name}
                            </Link>
                          ))}
                        </>
                      ) : allSubMenu === 'recycle' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Recycle Categories</div>
                          {['Dead & Scrap Phones', 'Old Broken Laptops', 'Unused Tablets', 'Defunct Smartwatches', 'Chargers & Cables', 'Green Reward Points'].map((rc) => (
                            <Link key={rc} href="/recycle" className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {rc}
                            </Link>
                          ))}
                        </>
                      ) : allSubMenu === 'findNewPhone' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Explore New Phones</div>
                          {['Phone Finder', 'Compare Phones', 'Latest 5G Phones', 'Upcoming Phones', 'Flagship Phones'].map((f) => (
                            <Link key={f} href="/buy?category=new-phone" className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {f}
                            </Link>
                          ))}
                        </>
                      ) : allSubMenu === 'store' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Store Locations</div>
                          {[
                            { name: 'Bettiah Flagship Store', desc: 'Supriya Cinema Road' },
                            { name: 'Bagaha Experience Store', desc: 'Sugar Mill Chowk' },
                            { name: 'Narkatiaganj Store', desc: 'Station Road' },
                            { name: 'Ramnagar Hub', desc: 'Main Market' },
                          ].map((st) => (
                            <Link key={st.name} href="/stores" className="py-1.5 block group">
                              <div className="font-semibold text-slate-800 group-hover:text-[#00a599]">{st.name}</div>
                              <div className="text-[10px] text-slate-400">{st.desc}</div>
                            </Link>
                          ))}
                        </>
                      ) : (
                        /* Default: Phone (Exact match Screenshot 1) */
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Top Brands</div>
                          {['Apple', 'Xiaomi', 'Samsung', 'Oneplus', 'Nokia', 'Poco', 'More Phone Brands'].map((b) => (
                            <Link key={b} href={b === 'More Phone Brands' ? '/sell' : `/sell?brand=${b}`} className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {b}
                            </Link>
                          ))}

                          <div className="font-bold text-[13px] text-slate-900 mt-4 mb-2">Top Selling Phones</div>
                          {['Apple iPhone 12', 'Apple iPhone 11', 'Samsung Galaxy Note 20', 'One Plus 9 Pro', 'Xiaomi Redmi Note 4', 'Apple iPhone 6'].map((p) => (
                            <Link key={p} href="/sell" className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {p}
                            </Link>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Sell Phone Mega Menu (Single Card - Screenshot 2) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('sellPhone')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/sell"
                className={`flex items-center gap-1 text-[13px] font-bold transition-colors py-2 cursor-pointer ${
                  activeMegaMenu === 'sellPhone'
                    ? 'text-[#00a599]'
                    : 'text-slate-900 hover:text-[#00a599]'
                }`}
              >
                <span>Sell Phone</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMegaMenu === 'sellPhone' ? 'rotate-180 text-[#00a599]' : 'text-slate-700'
                  }`}
                />
              </Link>

              {activeMegaMenu === 'sellPhone' && (
                <div className="absolute top-full left-0 mt-0.5 w-[220px] bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100 p-4 z-50 animate-in fade-in-0 zoom-in-95 duration-150 text-xs">
                  <div className="font-bold text-[13px] text-slate-900 mb-2">Top Brands</div>
                  {['Apple', 'Xiaomi', 'Samsung', 'Oneplus', 'Nokia', 'Poco', 'More Phone Brands'].map((b) => (
                    <Link
                      key={b}
                      href={b === 'More Phone Brands' ? '/sell' : `/sell?brand=${b}`}
                      className="py-1 text-slate-700 hover:text-[#00a599] block transition-colors"
                    >
                      {b}
                    </Link>
                  ))}

                  <div className="font-bold text-[13px] text-slate-900 mt-4 mb-2">Top Selling Phones</div>
                  {['Apple iPhone 12', 'Samsung Galaxy Note 20', 'Apple iPhone 11', 'One Plus 9 Pro', 'Xiaomi Redmi Note 4', 'Apple iPhone 6'].map((p) => (
                    <Link
                      key={p}
                      href="/sell"
                      className="py-1 text-slate-700 hover:text-[#00a599] block transition-colors"
                    >
                      {p}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Sell Gadgets Dropdown (2-Panel Flyout - Screenshot 3) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('sellGadgets')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/sell"
                className={`flex items-center gap-1 text-[13px] font-bold transition-colors py-2 cursor-pointer ${
                  activeMegaMenu === 'sellGadgets'
                    ? 'text-[#00a599]'
                    : 'text-slate-900 hover:text-[#00a599]'
                }`}
              >
                <span>Sell Gadgets</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMegaMenu === 'sellGadgets' ? 'rotate-180 text-[#00a599]' : 'text-slate-700'
                  }`}
                />
              </Link>

              {activeMegaMenu === 'sellGadgets' && (
                <div className="absolute top-full left-0 mt-0.5 bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100 z-50 flex animate-in fade-in-0 zoom-in-95 duration-150">
                  {/* Left Column (Exact match Screenshot 3) */}
                  <div className={`w-[195px] p-3 space-y-0.5 text-xs ${gadgetsSubMenu ? 'border-r border-slate-100' : ''}`}>
                    {[
                      { id: 'phone', label: 'Phone', href: '/sell?category=phone' },
                      { id: 'laptop', label: 'Laptop', href: '/sell?category=laptop' },
                      { id: 'speaker', label: 'Smart Speaker', href: '/sell?category=speakers' },
                      { id: 'tablet', label: 'Tablet', href: '/sell?category=tablet' },
                      { id: 'gaming', label: 'Gaming Consoles', href: '/sell?category=gaming' },
                      { id: 'imac', label: 'iMac', href: '/sell?category=desktop' },
                      { id: 'smartwatch', label: 'Smartwatch', href: '/sell?category=smartwatch' },
                      { id: 'tv', label: 'TV', href: '/sell?category=tv' },
                      { id: 'earbuds', label: 'Earbuds', href: '/sell?category=audio' },
                      { id: 'dslr', label: 'DSLR Camera', href: '/sell?category=cameras' },
                      { id: 'ac', label: 'AC', href: '/sell' },
                    ].map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onMouseEnter={() => (item.id === 'imac' ? setGadgetsSubMenu(null) : setGadgetsSubMenu(item.id))}
                        className={`px-3 py-1.5 rounded-lg flex items-center justify-between text-xs font-semibold transition-colors ${
                          gadgetsSubMenu === item.id
                            ? 'bg-[#eef7f6] text-[#00a599] font-bold'
                            : 'text-slate-800 hover:bg-slate-50 hover:text-[#00a599]'
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.id !== 'imac' && (
                          <ChevronRight className={`w-3.5 h-3.5 ${gadgetsSubMenu === item.id ? 'text-[#00a599]' : 'text-slate-400'}`} />
                        )}
                      </Link>
                    ))}
                  </div>

                  {/* Right Column - ONLY rendered when an item with submenu is hovered */}
                  {gadgetsSubMenu && (
                    <div className="w-[230px] p-4 text-xs animate-in fade-in-0 duration-100">
                      <div className="text-[11px] text-slate-400 font-medium mb-2">
                        More in {gadgetsSubMenu === 'phone' ? 'Phone' : gadgetsSubMenu.charAt(0).toUpperCase() + gadgetsSubMenu.slice(1)}
                      </div>

                      {gadgetsSubMenu === 'laptop' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Top Brands</div>
                          {['Apple MacBook', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer'].map((b) => (
                            <Link key={b} href={`/sell?category=laptop&brand=${encodeURIComponent(b)}`} className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {b}
                            </Link>
                          ))}
                          <div className="font-bold text-[13px] text-slate-900 mt-4 mb-2">Top Selling Laptops</div>
                          {['MacBook Air M1', 'MacBook Pro 14', 'ThinkPad T14', 'Dell XPS 13', 'HP Envy 13'].map((l) => (
                            <Link key={l} href="/sell?category=laptop" className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {l}
                            </Link>
                          ))}
                        </>
                      ) : gadgetsSubMenu === 'speaker' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Top Brands</div>
                          {['Amazon Echo', 'Google Nest', 'Apple HomePod', 'JBL', 'Bose', 'Sony'].map((b) => (
                            <Link key={b} href="/sell?category=speakers" className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {b}
                            </Link>
                          ))}
                        </>
                      ) : gadgetsSubMenu === 'tablet' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Top Brands</div>
                          {['Apple iPad', 'Samsung Galaxy Tab', 'Lenovo Tab', 'Xiaomi Pad', 'Realme Pad'].map((b) => (
                            <Link key={b} href="/sell?category=tablet" className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {b}
                            </Link>
                          ))}
                        </>
                      ) : gadgetsSubMenu === 'gaming' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Top Brands</div>
                          {['Sony PlayStation 5', 'PlayStation 4 Pro', 'Xbox Series X', 'Xbox Series S', 'Nintendo Switch'].map((b) => (
                            <Link key={b} href="/sell?category=gaming" className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {b}
                            </Link>
                          ))}
                        </>
                      ) : gadgetsSubMenu === 'smartwatch' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Top Brands</div>
                          {['Apple Watch', 'Samsung Galaxy Watch', 'Garmin', 'Fossil', 'Fitbit', 'Amazfit'].map((b) => (
                            <Link key={b} href="/sell?category=smartwatch" className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {b}
                            </Link>
                          ))}
                        </>
                      ) : gadgetsSubMenu === 'tv' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Top Brands</div>
                          {['Samsung', 'LG', 'Sony', 'Mi TV', 'OnePlus', 'Vu', 'TCL'].map((b) => (
                            <Link key={b} href="/sell?category=tv" className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {b}
                            </Link>
                          ))}
                        </>
                      ) : gadgetsSubMenu === 'earbuds' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Top Brands</div>
                          {['Apple AirPods', 'OnePlus Buds', 'boAt Airdopes', 'Noise Shots', 'JBL Wave', 'Sony WF Series'].map((b) => (
                            <Link key={b} href="/sell?category=audio" className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {b}
                            </Link>
                          ))}
                        </>
                      ) : gadgetsSubMenu === 'dslr' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Top Brands</div>
                          {['Canon', 'Nikon', 'Sony Alpha', 'Fujifilm', 'Panasonic'].map((b) => (
                            <Link key={b} href="/sell?category=cameras" className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {b}
                            </Link>
                          ))}
                        </>
                      ) : gadgetsSubMenu === 'ac' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Top Brands</div>
                          {['Voltas', 'LG', 'Daikin', 'Blue Star', 'Lloyd', 'Hitachi', 'Panasonic'].map((b) => (
                            <Link key={b} href="/sell" className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {b}
                            </Link>
                          ))}
                        </>
                      ) : (
                        /* Default: Phone (Exact match Screenshot 3) */
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Top Brands</div>
                          {['Apple', 'Xiaomi', 'Samsung', 'Oneplus', 'Nokia', 'Poco', 'More Phone Brands'].map((b) => (
                            <Link key={b} href={b === 'More Phone Brands' ? '/sell' : `/sell?brand=${b}`} className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {b}
                            </Link>
                          ))}

                          <div className="font-bold text-[13px] text-slate-900 mt-4 mb-2">Top Selling Phones</div>
                          {['Apple iPhone 11', 'Samsung Galaxy Note 20', 'One Plus 9 Pro', 'Xiaomi Redmi Note 4', 'Apple iPhone 6'].map((p) => (
                            <Link key={p} href="/sell" className="py-1 text-slate-700 hover:text-[#00a599] block">
                              {p}
                            </Link>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 4. Buy Refurbished Devices Mega Menu (Single Card - Screenshot 4) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('buyRefurb')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/buy"
                className={`flex items-center gap-1 text-[13px] font-bold transition-colors py-2 cursor-pointer ${
                  activeMegaMenu === 'buyRefurb'
                    ? 'text-[#00a599]'
                    : 'text-slate-900 hover:text-[#00a599]'
                }`}
              >
                <span>Buy Refurbished Devices</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMegaMenu === 'buyRefurb' ? 'rotate-180 text-[#00a599]' : 'text-slate-700'
                  }`}
                />
              </Link>

              {activeMegaMenu === 'buyRefurb' && (
                <div className="absolute top-full left-0 mt-0.5 w-[230px] bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100 p-4 z-50 animate-in fade-in-0 zoom-in-95 duration-150 text-xs">
                  {[
                    { label: 'Refurbished Phones', href: '/buy?category=old-phone' },
                    { label: 'Refurbished Laptops', href: '/buy?category=old-laptop' },
                    { label: 'Refurbished Smart Watches', href: '/buy?category=smartwatch' },
                    { label: 'Refurbished Tablets', href: '/buy?category=tablet' },
                    { label: 'Refurbished Gaming Consoles', href: '/buy?category=gaming' },
                    { label: 'Refurbished Cameras', href: '/buy?category=cameras' },
                    { label: 'Audio Devices', href: '/buy?category=audio' },
                    { label: 'Amazon Devices', href: '/buy' },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="py-1 text-slate-700 hover:text-[#00a599] block transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}

                  <div className="font-bold text-[13px] text-slate-900 mt-4 mb-2">Top Brands</div>
                  {['Apple', 'Xiaomi', 'Samsung', 'Oneplus', 'Google', 'Oppo', 'Vivo', 'All Brands'].map((b) => (
                    <Link
                      key={b}
                      href={b === 'All Brands' ? '/buy' : `/buy?brand=${b}`}
                      className="py-1 text-slate-700 hover:text-[#00a599] block transition-colors"
                    >
                      {b}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Find New Gadget Dropdown (2-Panel Flyout - Screenshot 5) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('findNew')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/buy?category=new-phone"
                className={`flex items-center gap-1 text-[13px] font-bold transition-colors py-2 cursor-pointer ${
                  activeMegaMenu === 'findNew'
                    ? 'text-[#00a599]'
                    : 'text-slate-900 hover:text-[#00a599]'
                }`}
              >
                <span>Find New Gadget</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMegaMenu === 'findNew' ? 'rotate-180 text-[#00a599]' : 'text-slate-700'
                  }`}
                />
              </Link>

              {activeMegaMenu === 'findNew' && (
                <div className="absolute top-full left-0 mt-0.5 bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100 z-50 flex animate-in fade-in-0 zoom-in-95 duration-150">
                  {/* Left Column (Exact match Screenshot 5) */}
                  <div className={`w-[195px] p-3 space-y-0.5 text-xs ${findNewSubMenu ? 'border-r border-slate-100' : ''}`}>
                    {[
                      { id: 'phone', label: 'Find New Phone', href: '/buy?category=new-phone' },
                      { id: 'laptop', label: 'Find New Laptop', href: '/buy?category=new-laptop' },
                      { id: 'smartwatch', label: 'Find New Smartwatch', href: '/buy?category=smartwatch' },
                      { id: 'tablet', label: 'Find New Tablet', href: '/buy?category=tablet' },
                    ].map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onMouseEnter={() => setFindNewSubMenu(item.id)}
                        className={`px-3 py-2 rounded-lg flex items-center justify-between text-xs font-bold transition-colors ${
                          findNewSubMenu === item.id
                            ? 'bg-[#eef7f6] text-[#00a599]'
                            : 'text-slate-900 hover:bg-slate-50 hover:text-[#00a599]'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronRight className={`w-3.5 h-3.5 ${findNewSubMenu === item.id ? 'text-[#00a599]' : 'text-slate-400'}`} />
                      </Link>
                    ))}

                    <div className="pt-2 border-t border-slate-100/80 space-y-0.5">
                      <div className="font-bold text-slate-900 px-3 pt-1 pb-1 text-[13px]">
                        Explore
                      </div>
                      {['Videos', 'News', 'Reviews', 'Articles', 'QnA', 'Tips and Tricks', 'Tech News'].map((e) => (
                        <Link
                          key={e}
                          href="/faq"
                          onMouseEnter={() => setFindNewSubMenu(null)}
                          className="px-3 py-1 text-slate-700 hover:text-[#00a599] hover:bg-slate-50 rounded-lg block transition-colors"
                        >
                          {e}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Right Column - ONLY rendered when an item is hovered */}
                  {findNewSubMenu && (
                    <div className="w-[230px] p-4 text-xs animate-in fade-in-0 duration-100">
                      <div className="text-[11px] text-slate-400 font-medium mb-2">
                        More in {findNewSubMenu === 'phone' ? 'Find New Phone' : findNewSubMenu === 'laptop' ? 'Find New Laptop' : findNewSubMenu === 'smartwatch' ? 'Find New Smartwatch' : 'Find New Tablet'}
                      </div>

                      {findNewSubMenu === 'laptop' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Top Brands</div>
                          {['Apple MacBook', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer'].map((b) => (
                            <Link key={b} href={`/buy?category=new-laptop&brand=${encodeURIComponent(b)}`} className="py-1 text-slate-700 hover:text-[#00a599] block transition-colors">
                              {b}
                            </Link>
                          ))}
                          <div className="font-bold text-[13px] text-slate-900 mt-4 mb-2">By Category</div>
                          {['Gaming Laptops', 'Thin & Light Laptops', 'Student Laptops', 'Business Laptops'].map((c) => (
                            <Link key={c} href="/buy?category=new-laptop" className="py-1 text-slate-700 hover:text-[#00a599] block transition-colors">
                              {c}
                            </Link>
                          ))}
                        </>
                      ) : findNewSubMenu === 'smartwatch' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Top Brands</div>
                          {['Apple Watch', 'Samsung Galaxy', 'Noise', 'boAt', 'Fire-Boltt', 'Amazfit'].map((b) => (
                            <Link key={b} href="/buy?category=smartwatch" className="py-1 text-slate-700 hover:text-[#00a599] block transition-colors">
                              {b}
                            </Link>
                          ))}
                          <div className="font-bold text-[13px] text-slate-900 mt-4 mb-2">By Feature</div>
                          {['Bluetooth Calling', 'AMOLED Display', 'Fitness Trackers', 'GPS Smartwatches'].map((f) => (
                            <Link key={f} href="/buy?category=smartwatch" className="py-1 text-slate-700 hover:text-[#00a599] block transition-colors">
                              {f}
                            </Link>
                          ))}
                        </>
                      ) : findNewSubMenu === 'tablet' ? (
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Top Brands</div>
                          {['Apple iPad', 'Samsung Galaxy Tab', 'Lenovo Tab', 'Xiaomi Pad', 'OnePlus Pad'].map((b) => (
                            <Link key={b} href="/buy?category=tablet" className="py-1 text-slate-700 hover:text-[#00a599] block transition-colors">
                              {b}
                            </Link>
                          ))}
                          <div className="font-bold text-[13px] text-slate-900 mt-4 mb-2">By Usage</div>
                          {['Calling Tablets', 'Entertainment Tablets', 'Drawing & Pen Tablets', 'Kids Edition'].map((u) => (
                            <Link key={u} href="/buy?category=tablet" className="py-1 text-slate-700 hover:text-[#00a599] block transition-colors">
                              {u}
                            </Link>
                          ))}
                        </>
                      ) : (
                        /* Default: Phone */
                        <>
                          <div className="font-bold text-[13px] text-slate-900 mt-1 mb-2">Smartphones</div>
                          {['Phone Finder', 'Compare Phones', 'Latest Phones', 'Upcoming 5G Phones', 'Best Camera Phones'].map((s) => (
                            <Link key={s} href="/buy?category=new-phone" className="py-1 text-slate-700 hover:text-[#00a599] block transition-colors">
                              {s}
                            </Link>
                          ))}

                          <div className="font-bold text-[13px] text-slate-900 mt-4 mb-2">Top Brands</div>
                          {['Apple', 'Samsung', 'Google', 'Xiaomi', 'Oneplus', 'Realme'].map((b) => (
                            <Link key={b} href={`/buy?category=new-phone&brand=${b}`} className="py-1 text-slate-700 hover:text-[#00a599] block transition-colors">
                              {b}
                            </Link>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 6. Buy Laptop Dropdown (Single Card) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('buyLaptop')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/buy?category=old-laptop"
                className={`flex items-center gap-1 text-[13px] font-bold transition-colors py-2 cursor-pointer ${
                  activeMegaMenu === 'buyLaptop'
                    ? 'text-[#00a599]'
                    : 'text-slate-900 hover:text-[#00a599]'
                }`}
              >
                <span>Buy Laptop</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMegaMenu === 'buyLaptop' ? 'rotate-180 text-[#00a599]' : 'text-slate-700'
                  }`}
                />
              </Link>

              {activeMegaMenu === 'buyLaptop' && (
                <div className="absolute top-full left-0 mt-0.5 w-[230px] bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100 p-4 z-50 animate-in fade-in-0 zoom-in-95 duration-150 text-xs">
                  <div className="font-bold text-[13px] text-slate-900 mb-2">Refurbished Laptops</div>
                  {[
                    { label: 'MacBook Air & Pro', href: '/buy?category=old-laptop&brand=Apple' },
                    { label: 'Lenovo ThinkPad', href: '/buy?category=old-laptop&brand=Lenovo' },
                    { label: 'Dell Latitude & XPS', href: '/buy?category=old-laptop&brand=Dell' },
                    { label: 'HP Pavilion & Envy', href: '/buy?category=old-laptop&brand=HP' },
                    { label: 'Asus Vivobook', href: '/buy?category=old-laptop&brand=Asus' },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="py-1 text-slate-700 hover:text-[#00a599] block transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}

                  <div className="font-bold text-[13px] text-slate-900 mt-4 mb-2">Top Laptop Brands</div>
                  {['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'All Laptops'].map((b) => (
                    <Link
                      key={b}
                      href={b === 'All Laptops' ? '/buy?category=old-laptop' : `/buy?category=old-laptop&brand=${b}`}
                      className="py-1 text-slate-700 hover:text-[#00a599] block transition-colors"
                    >
                      {b}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 7. SELBAR Store Dropdown (Single Card) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('store')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/stores"
                className={`flex items-center gap-1 text-[13px] font-bold transition-colors py-2 cursor-pointer ${
                  pathname === '/stores' || activeMegaMenu === 'store'
                    ? 'text-[#00a599]'
                    : 'text-slate-900 hover:text-[#00a599]'
                }`}
              >
                <span>SELBAR Store</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMegaMenu === 'store' ? 'rotate-180 text-[#00a599]' : 'text-slate-700'
                  }`}
                />
              </Link>

              {activeMegaMenu === 'store' && (
                <div className="absolute top-full left-0 mt-0.5 w-[250px] bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100 p-4 z-50 animate-in fade-in-0 zoom-in-95 duration-150 text-xs">
                  <div className="font-bold text-[13px] text-slate-900 mb-2">West Champaran Stores</div>
                  {[
                    { name: 'Bettiah Flagship Store', desc: 'Supriya Cinema Road', href: '/stores' },
                    { name: 'Bagaha Experience Store', desc: 'Sugar Mill Chowk', href: '/stores' },
                    { name: 'Narkatiaganj Store', desc: 'Station Road', href: '/stores' },
                    { name: 'Ramnagar Hub', desc: 'Main Market', href: '/stores' },
                  ].map((s) => (
                    <Link
                      key={s.name}
                      href={s.href}
                      className="py-1.5 block group hover:bg-slate-50 -mx-1 px-1 rounded transition"
                    >
                      <div className="font-semibold text-slate-800 group-hover:text-[#00a599]">{s.name}</div>
                      <div className="text-[10px] text-slate-400">{s.desc}</div>
                    </Link>
                  ))}

                  <div className="pt-2.5 mt-2 border-t border-slate-100">
                    <Link
                      href="/stores"
                      className="font-bold text-[#00a599] hover:underline flex items-center justify-between"
                    >
                      <span>Find All Stores</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 8. More Dropdown (Single Card) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('more')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className={`flex items-center gap-1 text-[13px] font-bold transition-colors py-2 cursor-pointer ${
                  activeMegaMenu === 'more'
                    ? 'text-[#00a599]'
                    : 'text-slate-900 hover:text-[#00a599]'
                }`}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMegaMenu === 'more' ? 'rotate-180 text-[#00a599]' : 'text-slate-700'
                  }`}
                />
              </button>

              {activeMegaMenu === 'more' && (
                <div className="absolute top-full right-0 mt-0.5 w-[230px] bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100 p-4 z-50 animate-in fade-in-0 zoom-in-95 duration-150 text-xs">
                  <div className="font-bold text-[13px] text-slate-900 mb-2">Services & Programs</div>
                  {[
                    { label: 'Mobile & Laptop Repair', href: '/repair' },
                    { label: 'E-Waste Recycling', href: '/recycle' },
                    { label: 'Price Drop Screener', href: '/screener' },
                    { label: 'Partner With Us (B2B)', href: '/partner' },
                    { label: 'Seller Central Dashboard', href: '/seller' },
                  ].map((m) => (
                    <Link
                      key={m.label}
                      href={m.href}
                      className="py-1 text-slate-700 hover:text-[#00a599] block transition-colors"
                    >
                      {m.label}
                    </Link>
                  ))}

                  <div className="font-bold text-[13px] text-slate-900 mt-4 mb-2">Help & Assurance</div>
                  {[
                    { label: 'How Buyback Works', href: '/how-it-works' },
                    { label: 'NIST Data Wipe Certificate', href: '/data-wipe' },
                    { label: 'Help & FAQs', href: '/faq' },
                  ].map((h) => (
                    <Link
                      key={h.label}
                      href={h.href}
                      className="py-1 text-slate-700 hover:text-[#00a599] block transition-colors"
                    >
                      {h.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* MOBILE SLIDE-OVER DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-sm bg-white h-full shadow-2xl p-5 overflow-y-auto space-y-5 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div className="space-y-5">
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-blue-600 via-teal-500 to-emerald-500 flex items-center justify-center text-white font-black text-base shadow-xs">
                    S
                  </div>
                  <span className="font-black text-lg tracking-tight text-slate-950">
                    <span className="text-blue-600">SEL</span><span className="text-emerald-600">BAR</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* City Selection on Mobile */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Your Pickup City:</span>
                  </span>
                  <span className="font-bold text-slate-900">{selectedCity.split(',')[0]}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {AUTHORIZED_LOCATIONS.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => handleSelectLocation(loc)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition ${
                        selectedCity.includes(loc.name)
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Sell / Buy Action CTAs */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/sell"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-950 text-xs font-bold flex flex-col items-center gap-1 shadow-2xs hover:scale-101 transition-transform"
                >
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <span>Sell Old Devices</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Instant Cash</span>
                </Link>

                <Link
                  href="/buy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 text-blue-950 text-xs font-bold flex flex-col items-center gap-1 shadow-2xs hover:scale-101 transition-transform"
                >
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                  <span>Buy Devices</span>
                  <span className="text-[10px] text-blue-700 font-semibold">Refurbished & New</span>
                </Link>
              </div>

              {/* Categories Grid */}
              <div className="space-y-2">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  Browse by Category
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/buy?category=new-phone"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/80 flex items-center gap-2 font-semibold text-slate-800"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>New Phones</span>
                  </Link>
                  <Link
                    href="/buy?category=old-phone"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/80 flex items-center gap-2 font-semibold text-slate-800"
                  >
                    <Smartphone className="w-4 h-4 text-amber-600" />
                    <span>Old Phones</span>
                  </Link>
                  <Link
                    href="/buy?category=new-laptop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/80 flex items-center gap-2 font-semibold text-slate-800"
                  >
                    <Laptop className="w-4 h-4 text-emerald-600" />
                    <span>New Laptops</span>
                  </Link>
                  <Link
                    href="/buy?category=old-laptop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/80 flex items-center gap-2 font-semibold text-slate-800"
                  >
                    <Laptop className="w-4 h-4 text-amber-600" />
                    <span>Old Laptops</span>
                  </Link>
                  <Link
                    href="/screener"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/80 flex items-center gap-2 font-semibold text-slate-800"
                  >
                    <TrendingDown className="w-4 h-4 text-blue-600" />
                    <span>Price Drop Screener</span>
                  </Link>
                  <Link
                    href="/stores"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/80 flex items-center gap-2 font-semibold text-slate-800"
                  >
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Nearby Stores</span>
                  </Link>
                </div>
              </div>

              {/* Utility Quick Links */}
              <div className="space-y-1 text-xs font-semibold text-slate-700 pt-2 border-t border-slate-100">
                <Link
                  href="/repair"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50"
                >
                  <Wrench className="w-4 h-4 text-emerald-600" />
                  <span>Certified Mobile Repair</span>
                </Link>
                <Link
                  href="/recycle"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50"
                >
                  <Recycle className="w-4 h-4 text-teal-600" />
                  <span>Responsible E-Waste Recycling</span>
                </Link>
                <Link
                  href="/partner"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50"
                >
                  <Handshake className="w-4 h-4 text-amber-500" />
                  <span>Partner With Us (Franchise & Retail)</span>
                </Link>
                <Link
                  href="/seller"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50"
                >
                  <Building className="w-4 h-4 text-indigo-600" />
                  <span>Seller Central Portal</span>
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50"
                >
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>Help & FAQs</span>
                </Link>
              </div>
            </div>

            {/* User Greeting & Logout/Login in Drawer */}
            <div className="pt-4 border-t border-slate-100">
              {isLoggedIn ? (
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-between"
                >
                  <span>My Account & Orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="min-h-[44px] w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-xs font-bold text-center shadow-md shadow-emerald-600/20 flex items-center justify-center"
                >
                  Login / Create Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE STICKY BOTTOM NAVIGATION BAR */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 pt-1.5 px-3 pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))] shadow-lg">
        <div className="grid grid-cols-5 gap-1 text-center">
          <Link
            href="/"
            className={`min-h-[44px] flex flex-col items-center justify-center py-1 rounded-xl transition ${
              pathname === '/' ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Home</span>
          </Link>

          <Link
            href="/sell"
            className={`min-h-[44px] flex flex-col items-center justify-center py-1 rounded-xl transition ${
              pathname.startsWith('/sell') ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Sell</span>
          </Link>

          <Link
            href="/buy"
            className={`min-h-[44px] flex flex-col items-center justify-center py-1 rounded-xl transition ${
              pathname.startsWith('/buy') ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Buy</span>
          </Link>

          <Link
            href="/repair"
            className={`min-h-[44px] flex flex-col items-center justify-center py-1 rounded-xl transition ${
              pathname === '/repair' ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Repair</span>
          </Link>

          <Link
            href="/cart"
            className={`min-h-[44px] flex flex-col items-center justify-center py-1 rounded-xl relative transition ${
              pathname === '/cart' ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-emerald-600 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">Cart</span>
          </Link>
        </div>
      </nav>

      <VoiceSearchModal
        isOpen={voiceModal.isOpen}
        mode={voiceModal.mode}
        onClose={() => setVoiceModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}
