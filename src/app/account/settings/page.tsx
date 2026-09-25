'use client';

import React, { useState } from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { PageHeader, SectionCard, SectionHeader, Toast, ConfirmModal } from '@/components/account/ui';
import { useAuth } from '@/context/AuthContext';
import {
  Settings, User, Shield, Bell, Eye, Trash2, Download, LogOut,
  ChevronRight, Moon, Sun, Globe, HelpCircle, FileText, Lock
} from 'lucide-react';

function SettingRow({ icon, label, description, action, danger }: {
  icon: React.ReactNode; label: string; description?: string;
  action: React.ReactNode; danger?: boolean;
}) {
  return (
    <div className={`flex items-start gap-4 py-4 border-b border-slate-100 last:border-0 ${danger ? 'hover:bg-rose-50/30' : 'hover:bg-slate-50/50'} transition -mx-5 px-5 rounded-xl`}>
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${danger ? 'bg-rose-50' : 'bg-slate-50'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${danger ? 'text-rose-700' : 'text-slate-900'}`}>{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function AccountSettingsContent() {
  const { logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [language, setLanguage] = useState('en');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [logoutAllConfirm, setLogoutAllConfirm] = useState(false);
  const [toast, setToast] = useState('');

  const handleExportData = () => {
    setToast('Data export request submitted. You\'ll receive a download link in 24 hours via email.');
  };

  const handleDeleteAccount = () => {
    setDeleteConfirm(false);
    setToast('Account deletion request submitted. You\'ll receive a confirmation email shortly.');
  };

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-3xl mx-auto w-full">
      <PageHeader title="Account Settings" description="Manage your account preferences and data" />

      <div className="space-y-5">
        {/* Appearance */}
        <SectionCard>
          <SectionHeader title="Appearance" />
          <div className="p-5">
            <SettingRow
              icon={<Sun className="h-5 w-5 text-amber-500" />}
              label="Theme"
              description="Choose your preferred color scheme"
              action={
                <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
                  {(['light', 'dark', 'system'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => { setTheme(t); setToast(`Theme set to ${t}`); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${theme === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              }
            />
            <SettingRow
              icon={<Globe className="h-5 w-5 text-blue-500" />}
              label="Language & Region"
              description="Set your preferred language"
              action={
                <select
                  value={language}
                  onChange={e => { setLanguage(e.target.value); setToast('Language preference updated!'); }}
                  className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="bn">বাংলা</option>
                </select>
              }
            />
          </div>
        </SectionCard>

        {/* Privacy */}
        <SectionCard>
          <SectionHeader title="Privacy" />
          <div className="p-5">
            <SettingRow
              icon={<Eye className="h-5 w-5 text-slate-600" />}
              label="Profile Visibility"
              description="Control who can see your profile and reviews"
              action={
                <select className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                  <option>Public</option>
                  <option>Private</option>
                  <option>Friends Only</option>
                </select>
              }
            />
            <SettingRow
              icon={<Eye className="h-5 w-5 text-slate-600" />}
              label="Wishlist Visibility"
              description="Allow friends to view your wishlist"
              action={
                <select className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                  <option>Private</option>
                  <option>Public</option>
                </select>
              }
            />
          </div>
        </SectionCard>

        {/* Quick Links */}
        <SectionCard>
          <SectionHeader title="Account" />
          <div className="p-5">
            {[
              { icon: <Shield className="h-5 w-5 text-slate-600" />, label: 'Security Settings', description: 'Change password and 2FA', href: '/account/security' },
              { icon: <Bell className="h-5 w-5 text-slate-600" />, label: 'Notification Preferences', description: 'Manage email, SMS and push alerts', href: '/account/preferences' },
              { icon: <Lock className="h-5 w-5 text-slate-600" />, label: 'Login Activity', description: 'View and manage active sessions', href: '/account/login-activity' },
            ].map(item => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-start gap-4 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition -mx-5 px-5 rounded-xl"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">{item.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 mt-3" />
              </a>
            ))}
          </div>
        </SectionCard>

        {/* Data */}
        <SectionCard>
          <SectionHeader title="Your Data" />
          <div className="p-5">
            <SettingRow
              icon={<Download className="h-5 w-5 text-blue-600" />}
              label="Export Account Data"
              description="Download a copy of all your account data, orders, and activity in JSON format."
              action={
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition"
                >
                  Request Export
                </button>
              }
            />
          </div>
        </SectionCard>

        {/* Danger Zone */}
        <SectionCard>
          <SectionHeader title="Danger Zone" />
          <div className="p-5">
            <SettingRow
              icon={<LogOut className="h-5 w-5 text-rose-500" />}
              label="Sign Out All Devices"
              description="Immediately end all active sessions across all devices."
              action={
                <button
                  onClick={() => setLogoutAllConfirm(true)}
                  className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition"
                >
                  Sign Out All
                </button>
              }
              danger
            />
            <SettingRow
              icon={<Trash2 className="h-5 w-5 text-rose-600" />}
              label="Delete Account"
              description="Permanently delete your account and all associated data. This action cannot be undone."
              action={
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition"
                >
                  Delete Account
                </button>
              }
              danger
            />
          </div>
        </SectionCard>

        {/* Legal */}
        <SectionCard>
          <SectionHeader title="Legal" />
          <div className="p-5">
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Cookie Policy', href: '/cookies' },
              { label: 'Refund Policy', href: '/refund-policy' },
            ].map(item => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 hover:text-blue-600 transition"
              >
                <span className="text-sm text-slate-700">{item.label}</span>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </a>
            ))}
          </div>
        </SectionCard>

        {/* App Version */}
        <div className="text-center py-4">
          <p className="text-xs text-slate-400">SELBAR Customer App · v2.1.0</p>
          <p className="text-xs text-slate-300 mt-0.5">© 2026 SELBAR. All rights reserved.</p>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteConfirm}
        title="Delete Your Account?"
        description="All your data including orders, wishlist, wallet, and rewards will be permanently deleted. This cannot be undone."
        confirmLabel="Yes, Delete My Account"
        variant="danger"
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteConfirm(false)}
      />

      <ConfirmModal
        isOpen={logoutAllConfirm}
        title="Sign Out All Devices?"
        description="This will immediately end all active sessions. You'll need to sign in again on all your devices."
        confirmLabel="Sign Out All"
        variant="warning"
        onConfirm={() => { logout(true); setLogoutAllConfirm(false); }}
        onCancel={() => setLogoutAllConfirm(false)}
      />

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default function AccountSettingsPage() {
  return (
    <AccountLayout>
      <AccountHeader />
      <AccountSettingsContent />
    </AccountLayout>
  );
}
