'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Store,
  ShieldCheck,
  Save,
  Mail,
  Phone,
  Building,
  RotateCcw,
  CheckCircle2,
  Clock,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { useAdmin } from '@/context/AdminContext';

export default function AdminSettingsPage() {
  const { addToast } = useAdmin();
  const [activeTab, setActiveTab] = useState<'policy' | 'general' | 'categories' | 'compliance'>('policy');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Settings State
  const [warrantyMonths, setWarrantyMonths] = useState(6);
  const [replacementDays, setReplacementDays] = useState(15);
  const [quoteValidityHours, setQuoteValidityHours] = useState(72);
  const [supportEmail, setSupportEmail] = useState('support@sellbar.in');
  const [supportPhone, setSupportPhone] = useState('');
  const [legalEntityName, setLegalEntityName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [gstin, setGstin] = useState('');
  const [enabledCategories, setEnabledCategories] = useState<string[]>(['phone']);
  const [payoutApprovalLimit, setPayoutApprovalLimit] = useState(10000);
  const [codEnabled, setCodEnabled] = useState(false);
  const [gstScheme, setGstScheme] = useState<'STANDARD_GST' | 'MARGIN_SCHEME'>('STANDARD_GST');

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/v1/admin/settings');
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setWarrantyMonths(d.warrantyMonthsDefault ?? 6);
          setReplacementDays(d.replacementWindowDays ?? 15);
          setQuoteValidityHours(d.quoteValidityHours ?? 72);
          setSupportEmail(d.supportEmail || 'support@sellbar.in');
          setSupportPhone(d.supportPhone || '');
          setLegalEntityName(d.legalEntityName || '');
          setTradeName(d.tradeName || '');
          setGstin(d.gstin || '');
          setEnabledCategories(d.enabledCategories || ['phone']);
          setPayoutApprovalLimit(d.payoutApprovalLimit ?? 10000);
          setCodEnabled(Boolean(d.codEnabled));
          setGstScheme(d.gstScheme || 'STANDARD_GST');
        }
      } catch (err) {
        addToast({
          title: 'Load Warning',
          message: 'Could not load existing settings from database; showing defaults.',
          type: 'warning',
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, [addToast]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/v1/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          warrantyMonthsDefault: Number(warrantyMonths),
          replacementWindowDays: Number(replacementDays),
          quoteValidityHours: Number(quoteValidityHours),
          payoutApprovalLimit: Number(payoutApprovalLimit),
          supportEmail,
          supportPhone,
          legalEntityName: legalEntityName.trim() || undefined,
          tradeName: tradeName.trim() || undefined,
          gstin: gstin.trim() || undefined,
          enabledCategories,
          codEnabled,
          gstScheme,
        }),
      });

      const json = await res.json();
      if (json.success) {
        addToast({
          title: 'Settings Saved',
          message: 'Sellbar policy and operational parameters updated successfully.',
          type: 'success',
        });
      } else {
        addToast({
          title: 'Save Failed',
          message: json.message || 'Validation error saving settings.',
          type: 'error',
        });
      }
    } catch (err) {
      addToast({
        title: 'Error',
        message: 'Network error saving settings.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCategory = (cat: string) => {
    if (enabledCategories.includes(cat)) {
      if (enabledCategories.length === 1) {
        addToast({ title: 'Validation', message: 'At least one category must remain active.', type: 'warning' });
        return;
      }
      setEnabledCategories(enabledCategories.filter((c) => c !== cat));
    } else {
      setEnabledCategories([...enabledCategories, cat]);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Sellbar Platform & Policy Settings
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Single source of truth for warranty periods, replacement windows, categories, and legal details.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="flex items-center gap-2 self-start sm:self-auto bg-slate-900 hover:bg-slate-800 text-white"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('policy')}
          className={`pb-2.5 transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'policy'
              ? 'border-emerald-600 text-emerald-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Warranty & Quotes Policy</span>
        </button>
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-2.5 transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'general'
              ? 'border-emerald-600 text-emerald-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Support & Contacts</span>
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-2.5 transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'categories'
              ? 'border-emerald-600 text-emerald-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Enabled Categories</span>
        </button>
        <button
          onClick={() => setActiveTab('compliance')}
          className={`pb-2.5 transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'compliance'
              ? 'border-emerald-600 text-emerald-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Legal Entity & GST</span>
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading settings...</div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'policy' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Customer Policies (Single Source of Truth)</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Default Warranty Period (Months)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={warrantyMonths}
                    onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                  <p className="text-[11px] text-slate-400">Default applied: 6 months for certified phones.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Replacement Window (Days)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={replacementDays}
                    onChange={(e) => setReplacementDays(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                  <p className="text-[11px] text-slate-400">Default applied: 15 days return/replacement.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Quote Price Lock Validity (Hours)
                  </label>
                  <input
                    type="number"
                    min={12}
                    max={168}
                    value={quoteValidityHours}
                    onChange={(e) => setQuoteValidityHours(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                  <p className="text-[11px] text-slate-400">Online quote guaranteed duration: 72 hours.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Seller Payout Approval Threshold (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={payoutApprovalLimit}
                    onChange={(e) => setPayoutApprovalLimit(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                  <p className="text-[11px] text-slate-400">CD-05: Payouts above this amount require admin approval (default: ₹10,000).</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Customer Support Contacts</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Support Email Address
                  </label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                  <p className="text-[11px] text-slate-400">Displayed in footer and transactional emails.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Support Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210 (leave empty if none)"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                  <p className="text-[11px] text-slate-400">If empty, only support email will be shown.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Launch Categories</h3>
                <p className="text-xs text-slate-500 mt-1">
                  PRD §5.1 Scope: Only enabled categories appear in navigation and catalog rails. Disabled categories show &quot;Coming Soon&quot;.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { id: 'phone', label: 'Mobile Phones' },
                  { id: 'laptop', label: 'Laptops' },
                  { id: 'tablet', label: 'Tablets' },
                  { id: 'smartwatch', label: 'Smartwatches' },
                ].map((cat) => {
                  const isEnabled = enabledCategories.includes(cat.id);
                  return (
                    <div
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        isEnabled
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500'
                      }`}
                    >
                      <span className="text-xs">{cat.label}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${isEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'}`}>
                        {isEnabled ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Corporate Identity & Tax Configuration</h3>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  Note: Placeholder corporate names are strictly hidden from public pages until confirmed by client.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Registered Legal Entity Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter official registered company name"
                    value={legalEntityName}
                    onChange={(e) => setLegalEntityName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                  <p className="text-[11px] text-slate-400">Appears on invoices and legal terms once supplied.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Trade / Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sellbar"
                    value={tradeName}
                    onChange={(e) => setTradeName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                  <p className="text-[11px] text-slate-400">Operating brand name shown to consumers.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Company GSTIN
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10AAAAA0000A1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                  <p className="text-[11px] text-slate-400">Required for official tax invoices.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    GST Tax Treatment
                  </label>
                  <select
                    value={gstScheme}
                    onChange={(e) => setGstScheme(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="STANDARD_GST">Standard GST (18% on Transaction)</option>
                    <option value="MARGIN_SCHEME">Margin Scheme (Rule 32(5) on Gross Profit Margin)</option>
                  </select>
                  <p className="text-[11px] text-slate-400">Confirm with client&apos;s Chartered Accountant.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Cash on Delivery (COD) for Purchases
                  </label>
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="cod"
                      checked={codEnabled}
                      onChange={(e) => setCodEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="cod" className="text-xs text-slate-700 dark:text-slate-300">
                      Enable COD (Currently disabled to prevent pilot RTO losses)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
