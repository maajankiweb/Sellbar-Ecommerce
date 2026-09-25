'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield, LogOut, ChevronLeft, ChevronRight, Menu, X,
  Lock, KeyRound, Sparkles, CheckCircle2, AlertCircle, ArrowLeft
} from 'lucide-react';
import {
  ROLE_CREDENTIALS,
  isRoleAuthenticated,
  verifyRoleCredentials,
  logoutRoleSession,
  RoleCredential
} from '@/lib/auth/roleAuth';

export interface PortalNavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  badge?: string | number;
  badgeVariant?: 'primary' | 'warning' | 'danger' | 'success';
}

interface RolePortalLayoutProps {
  roleKey: 'manager' | 'staff' | 'delivery' | 'seller';
  children: React.ReactNode;
  navItems: PortalNavItem[];
  accentColor: string; // e.g. 'amber', 'cyan', 'emerald', 'blue'
}

export default function RolePortalLayout({
  roleKey,
  children,
  navItems,
  accentColor,
}: RolePortalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const cred = ROLE_CREDENTIALS[roleKey];

  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Login gate state
  const [identifier, setIdentifier] = useState(cred?.defaultEmail || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Ensure light mode is active on document
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    const hasAuth = isRoleAuthenticated(roleKey);
    setAuthenticated(hasAuth);
  }, [roleKey]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    await new Promise((r) => setTimeout(r, 400));
    const result = verifyRoleCredentials(roleKey, identifier, password);
    setIsLoggingIn(false);

    if (!result.success) {
      setLoginError(result.error || 'Authentication failed');
      return;
    }

    setAuthenticated(true);
  };

  const handleLogout = () => {
    logoutRoleSession(roleKey);
    setAuthenticated(false);
    setPassword('');
  };

  const handleFillDemo = () => {
    setIdentifier(cred.defaultEmail);
    setPassword(cred.demoPassword);
    setLoginError('');
  };

  // Modern clean light theme styles
  const themeClasses = {
    amber: {
      activeBg: 'bg-amber-50 text-amber-900 border-amber-300 font-bold',
      badgeBg: 'bg-amber-100 text-amber-800 border border-amber-300',
      btn: 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20',
      border: 'border-amber-300',
      ring: 'focus:ring-amber-500',
      iconColor: 'text-amber-600',
    },
    cyan: {
      activeBg: 'bg-cyan-50 text-cyan-950 border-cyan-300 font-bold',
      badgeBg: 'bg-cyan-100 text-cyan-800 border border-cyan-300',
      btn: 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/20',
      border: 'border-cyan-300',
      ring: 'focus:ring-cyan-500',
      iconColor: 'text-cyan-600',
    },
    emerald: {
      activeBg: 'bg-emerald-50 text-emerald-950 border-emerald-300 font-bold',
      badgeBg: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
      border: 'border-emerald-300',
      ring: 'focus:ring-emerald-500',
      iconColor: 'text-emerald-600',
    },
    blue: {
      activeBg: 'bg-blue-50 text-blue-950 border-blue-300 font-bold',
      badgeBg: 'bg-blue-100 text-blue-800 border border-blue-300',
      btn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20',
      border: 'border-blue-300',
      ring: 'focus:ring-blue-500',
      iconColor: 'text-blue-600',
    },
  }[accentColor] || {
    activeBg: 'bg-blue-50 text-blue-950 border-blue-300 font-bold',
    badgeBg: 'bg-blue-100 text-blue-800 border border-blue-300',
    btn: 'bg-blue-600 hover:bg-blue-700 text-white',
    border: 'border-blue-300',
    ring: 'focus:ring-blue-500',
    iconColor: 'text-blue-600',
  };

  // Loading state
  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-xs font-mono">
        Verifying {cred?.title} credentials...
      </div>
    );
  }

  // If NOT authenticated, show the Role Login Barrier in Clean White
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/admin"
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin
            </Link>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${themeClasses.badgeBg}`}>
              ROLE ISOLATED
            </span>
          </div>

          <div className="flex items-center gap-3.5 mb-6">
            <img
              src={cred.avatar}
              alt={cred.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-sm shrink-0"
            />
            <div>
              <h1 className="text-xl font-black text-slate-900">{cred.title} Portal</h1>
              <p className="text-xs text-slate-500 mt-0.5">{cred.designation}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-5 text-xs text-slate-700 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Account Authentication Required:</strong> Enter the credentials for <strong>{cred.title}</strong> to open this workspace.
            </div>
          </div>

          {loginError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email / Username</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={cred.defaultEmail}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-blue-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                Fill Demo Credentials ({cred.defaultEmail} / {cred.demoPassword})
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-full py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${themeClasses.btn}`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              {isLoggingIn ? 'Authenticating...' : `Log In to ${cred.title}`}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Full Authenticated Dashboard Shell in Crisp White Design
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      {/* Super Admin Top Inspection Bar in White */}
      <div className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-800">
            {cred.title} Active Session
          </span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-500 text-[11px] hidden sm:inline">
            Logged in as: <strong className="text-slate-900">{cred.name}</strong> ({cred.defaultEmail})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold transition flex items-center gap-1"
          >
            <Shield className="w-3 h-3 text-blue-600" />
            Switch to Super Admin (/admin)
          </Link>

          <button
            onClick={handleLogout}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3 h-3" /> Logout Role
          </button>
        </div>
      </div>

      {/* Sidebar Navigation in White */}
      <aside
        className={`fixed top-9 bottom-0 left-0 z-40 bg-white border-r border-slate-200 transition-all duration-200 flex flex-col shadow-xs ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 shrink-0">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-xs">
                S
              </div>
              <div className="leading-tight">
                <div className="text-xs font-black tracking-tight text-slate-900">SELBAR</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">{cred.title}</div>
              </div>
            </div>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition border ${
                  isActive
                    ? `${themeClasses.activeBg} border`
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
                }`}
                title={sidebarCollapsed ? item.title : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${isActive ? themeClasses.iconColor : 'text-slate-400'}`}
                    strokeWidth={2}
                  />
                  {!sidebarCollapsed && <span className="truncate">{item.title}</span>}
                </div>
                {!sidebarCollapsed && item.badge !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-200">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Profile User Footer in Sidebar */}
        <div className="p-3 border-t border-slate-100 shrink-0">
          <Link
            href={cred.profileUrl}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition"
          >
            <img
              src={cred.avatar}
              alt={cred.name}
              className="w-8 h-8 rounded-xl object-cover border border-slate-200"
            />
            {!sidebarCollapsed && (
              <div className="text-left overflow-hidden">
                <div className="text-xs font-bold text-slate-900 truncate">{cred.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{cred.defaultEmail}</div>
              </div>
            )}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 pt-9 ${
          sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        }`}
      >
        {/* Mobile Header Bar */}
        <div className="lg:hidden h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-slate-900">{cred.title}</span>
          <Link
            href="/admin"
            className="text-[11px] font-bold text-blue-600 hover:underline"
          >
            Admin
          </Link>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
