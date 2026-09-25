'use client';

import React, { useState, useEffect } from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { PageHeader, SectionCard, SectionHeader, Toast, ToggleSwitch } from '@/components/account/ui';
import { accountService } from '@/lib/account/mockData';
import { CommunicationPreferences } from '@/types/account';
import { Bell, Mail, MessageSquare, Smartphone, Tag, Package, AlertCircle } from 'lucide-react';

function PreferencesContent() {
  const [prefs, setPrefs] = useState<CommunicationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  // Type-safe accessor for nested preference keys like 'orderUpdates.email'
  const getNestedPref = (obj: CommunicationPreferences, path: string): boolean => {
    const parts = path.split('.');
    let ref: unknown = obj;
    for (const part of parts) {
      if (ref === null || typeof ref !== 'object') return false;
      ref = (ref as Record<string, unknown>)[part];
    }
    return Boolean(ref);
  };

  useEffect(() => {
    accountService.getNotifications().then(() => {
      setPrefs({
        orderUpdates: { email: true, sms: true, push: true },
        promotions: { email: true, sms: false, whatsapp: true, push: false },
        personalizedRecommendations: true,
        priceDropAlerts: true,
        backInStockAlerts: true,
      });
      setLoading(false);
    });
  }, []);

  const updatePref = (path: string, value: boolean) => {
    setPrefs(p => {
      if (!p) return p;
      const parts = path.split('.');
      const copy = JSON.parse(JSON.stringify(p));
      let ref: any = copy;
      for (let i = 0; i < parts.length - 1; i++) ref = ref[parts[i]];
      ref[parts[parts.length - 1]] = value;
      return copy;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setToast('Preferences saved successfully!');
  };

  if (loading || !prefs) {
    return (
      <div className="flex-1 p-6 animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-48" />
        {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-200 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-3xl mx-auto w-full">
      <PageHeader title="Communication Preferences" description="Control how and when we contact you" />

      <div className="space-y-5">
        {/* Order Updates */}
        <SectionCard>
          <SectionHeader title="Order & Delivery Updates" />
          <div className="p-5 space-y-4">
            <p className="text-sm text-slate-500">Receive updates about your orders, shipping, and deliveries.</p>
            {[
              { key: 'orderUpdates.email', icon: <Mail className="h-4 w-4 text-blue-600" />, label: 'Email Notifications', desc: 'Order confirmation, shipping updates, delivery alerts' },
              { key: 'orderUpdates.sms', icon: <Smartphone className="h-4 w-4 text-emerald-600" />, label: 'SMS Notifications', desc: 'Quick alerts on your phone for important status changes' },
              { key: 'orderUpdates.push', icon: <Bell className="h-4 w-4 text-purple-600" />, label: 'Push Notifications', desc: 'Browser and app push notifications' },
            ].map(item => (
              <div key={item.key} className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <ToggleSwitch
                  checked={getNestedPref(prefs!, item.key)}
                  onChange={v => updatePref(item.key, v)}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Promotions */}
        <SectionCard>
          <SectionHeader title="Promotions & Offers" />
          <div className="p-5 space-y-4">
            <p className="text-sm text-slate-500">Get notified about exclusive deals, discounts, and offers.</p>
            {[
              { key: 'promotions.email', icon: <Mail className="h-4 w-4 text-blue-600" />, label: 'Email Marketing', desc: 'Weekly newsletter with deals, new arrivals, and offers' },
              { key: 'promotions.sms', icon: <Smartphone className="h-4 w-4 text-emerald-600" />, label: 'Promotional SMS', desc: 'Flash sales and time-limited offers via SMS' },
              { key: 'promotions.whatsapp', icon: <MessageSquare className="h-4 w-4 text-emerald-500" />, label: 'WhatsApp Updates', desc: 'Deals and order updates via WhatsApp' },
              { key: 'promotions.push', icon: <Bell className="h-4 w-4 text-purple-600" />, label: 'Promo Push Alerts', desc: 'Flash sale notifications on your device' },
            ].map(item => (
              <div key={item.key} className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <ToggleSwitch
                  checked={getNestedPref(prefs!, item.key)}
                  onChange={v => updatePref(item.key, v)}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Personalized */}
        <SectionCard>
          <SectionHeader title="Personalization & Alerts" />
          <div className="p-5 space-y-4">
            <p className="text-sm text-slate-500">Smart alerts based on your shopping behavior.</p>
            {[
              { key: 'personalizedRecommendations', icon: <Tag className="h-4 w-4 text-amber-500" />, label: 'Personalized Recommendations', desc: 'AI-powered product recommendations based on your history' },
              { key: 'priceDropAlerts', icon: <AlertCircle className="h-4 w-4 text-rose-500" />, label: 'Price Drop Alerts', desc: 'Notify me when wishlist items drop in price' },
              { key: 'backInStockAlerts', icon: <Package className="h-4 w-4 text-blue-500" />, label: 'Back in Stock Alerts', desc: 'Notify me when out-of-stock wishlist items are available' },
            ].map(item => (
              <div key={item.key} className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <ToggleSwitch
                  checked={(prefs as any)[item.key] as boolean}
                  onChange={v => updatePref(item.key, v)}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {saving && <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />}
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default function PreferencesPage() {
  return (
    <AccountLayout>
      <AccountHeader />
      <PreferencesContent />
    </AccountLayout>
  );
}
