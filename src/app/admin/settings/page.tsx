'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Settings,
  Store,
  CreditCard,
  Truck,
  Bell,
  ShieldCheck,
  Save,
  Globe,
  Mail,
  Phone,
  Building,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { useAdmin } from '@/context/AdminContext';

export default function AdminSettingsPage() {
  const { addToast } = useAdmin();
  const [activeTab, setActiveTab] = useState<'general' | 'store' | 'tax' | 'notifications' | 'integrations' | 'security'>('general');
  const [isSaving, setIsSaving] = useState(false);

  // General state
  const [storeName, setStoreName] = useState('SELBAR E-Commerce Technologies');
  const [supportEmail, setSupportEmail] = useState('support@selbar.com');
  const [supportPhone, setSupportPhone] = useState('+91 98200 11223');
  const [currency, setCurrency] = useState('INR (₹)');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST +5:30)');
  const [gstin, setGstin] = useState('27AAACS1429B1Z8');

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);

  // Security
  const [twoFactorEnforced, setTwoFactorEnforced] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('24');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast({
        title: 'Settings Saved',
        message: 'Store configuration and operational variables updated.',
        type: 'success',
      });
    }, 400);
  };

  const navItems = [
    { id: 'general', label: 'General Info', icon: Store, href: '/admin/settings/general' },
    { id: 'store', label: 'Store & Checkout', icon: Settings, href: '/admin/settings' },
    { id: 'tax', label: 'Tax & GST Rules', icon: Building, href: '/admin/settings' },
    { id: 'notifications', label: 'Notifications', icon: Bell, href: '/admin/settings/notifications' },
    { id: 'integrations', label: 'Integrations & APIs', icon: Globe, href: '/admin/settings/payments' },
    { id: 'security', label: 'Security & 2FA', icon: ShieldCheck, href: '/admin/settings/security' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Store & Enterprise Settings
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Configure currency standards, GSTIN invoices, communication gateways, and security policies
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          isLoading={isSaving}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save All Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer transition-colors text-left ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="md:col-span-3 rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Storefront Identification
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Legal Entity Name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Customer Support Email
                  </label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={e => setSupportEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Official Support Helpline
                  </label>
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={e => setSupportPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Store Currency
                  </label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="INR (₹)">Indian Rupee (INR ₹)</option>
                    <option value="USD ($)">US Dollar (USD $)</option>
                    <option value="EUR (€)">Euro (EUR €)</option>
                    <option value="GBP (£)">British Pound (GBP £)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    System Timezone
                  </label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={e => setTimezone(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tax & GST Tab */}
          {activeTab === 'tax' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                India Goods & Services Tax (GST)
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Merchant GSTIN Number
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={e => setGstin(e.target.value.toUpperCase())}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-mono font-bold dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 space-y-2 text-xs">
                <span className="font-bold text-slate-900 dark:text-white">
                  Automated GST Invoicing
                </span>
                <p className="text-slate-500 leading-relaxed">
                  B2B Tax Invoices with verified HSN/SAC codes are automatically compiled and delivered to buyers with compliant digital signatures.
                </p>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Communication Channels
              </h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      Transactional Email Alerts
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Send order confirmations, invoices and tracking links
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={e => setEmailAlerts(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      SMS Notifications (DLT Approved)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Dispatched OTPs and out-for-delivery driver arrival alerts
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={e => setSmsAlerts(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      WhatsApp Business API Notifications
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Rich message cards with live tracking links via Meta Cloud API
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={whatsappAlerts}
                    onChange={e => setWhatsappAlerts(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Security & Authentication Policies
              </h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      Enforce Two-Factor Authentication (2FA)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Mandate TOTP authenticator app tokens for all admin roles
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactorEnforced}
                    onChange={e => setTwoFactorEnforced(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Terminal Inactive Session Timeout (Hours)
                  </label>
                  <select
                    value={sessionTimeout}
                    onChange={e => setSessionTimeout(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="1">1 Hour</option>
                    <option value="8">8 Hours (Working Shift)</option>
                    <option value="24">24 Hours</option>
                    <option value="168">7 Days</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Store / Integrations placeholder fallback */}
          {(activeTab === 'store' || activeTab === 'integrations') && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {activeTab === 'store' ? 'Store & Checkout Policies' : 'API Keys & Webhooks'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connected to production endpoints. Webhooks signed using HMAC-SHA256 secrets.
              </p>
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Google Analytics 4 & Meta Pixel active and streaming telemetry.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
