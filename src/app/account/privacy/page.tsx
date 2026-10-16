'use client';

import React, { useState } from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { PageHeader, SectionCard, SectionHeader, Toast } from '@/components/account/ui';
import {
  ShieldCheck, Download, Trash2, Clock, CheckCircle2,
  AlertTriangle, FileText, Lock, ArrowRight, ShieldAlert
} from 'lucide-react';

export default function AccountPrivacyPage() {
  const [dataRequestSubmitted, setDataRequestSubmitted] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [toast, setToast] = useState('');

  const consents = [
    { title: 'Terms of Service & Seller Agreement', grantedAt: '12 Mar 2023, 10:15 AM', version: 'v2.4', active: true },
    { title: 'Privacy Policy & DPDP Data Protection', grantedAt: '12 Mar 2023, 10:15 AM', version: 'v1.8', active: true },
    { title: 'Doorstep Device Diagnostic & Valuation Consent', grantedAt: '16 Oct 2026, 08:30 AM', version: 'v3.1', active: true },
    { title: 'Promotional SMS & WhatsApp Communications', grantedAt: '15 Oct 2026, 11:20 AM', version: 'v1.0', active: false },
  ];

  const handleRequestData = () => {
    setDataRequestSubmitted(true);
    setToast('Data export requested. Your complete archive (JSON + PDF) will be prepared within 24 hours.');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmationText !== 'DELETE') return;
    setShowDeleteModal(false);
    setToast('Account deletion request registered with 30-day grace period. You will be logged out.');
  };

  return (
    <AccountLayout>
      <AccountHeader />
      <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-4xl mx-auto w-full">
        <PageHeader
          title="Privacy & Data Management"
          description="Manage your privacy consents, request a full copy of your personal data, or initiate account closure."
        />

        {/* DPDP Compliance Notice */}
        <div className="mb-6 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Digital Personal Data Protection (DPDP) Standard</h2>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Sellbar processes your data solely for fulfilling doorstep smartphone buybacks, certified data sanitization, and refurbished device warranties. We never sell your personal information to third parties.
            </p>
          </div>
        </div>

        {/* 1. Consent History */}
        <SectionCard className="mb-6">
          <SectionHeader title="Your Active Consents" />
          <div className="divide-y divide-slate-100">
            {consents.map((c, i) => (
              <div key={i} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-slate-900">{c.title}</p>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {c.version}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Consent recorded: {c.grantedAt}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold self-start sm:self-center ${
                  c.active ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {c.active ? <CheckCircle2 className="h-3 w-3 text-emerald-600" /> : null}
                  {c.active ? 'Active & Accepted' : 'Opted Out'}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* 2. Download My Data */}
        <SectionCard className="mb-6">
          <SectionHeader title="Download Your Personal Data (Data Portability)" />
          <div className="p-5">
            <p className="text-xs text-slate-600 leading-relaxed">
              Request an archival bundle containing your complete Sellbar history: customer profile, saved addresses, sell quotes and valuation breakdowns, buy orders, device diagnostic receipts, and invoice records.
            </p>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-slate-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Format: Encrypted ZIP Archive (JSON + PDF)</p>
                  <p className="text-[11px] text-slate-500">Delivered directly to your registered email (rahul.sharma@gmail.com)</p>
                </div>
              </div>

              {dataRequestSubmitted ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                  <Clock className="h-4 w-4 text-amber-600" />
                  Generating Archive (Ready in &lt; 24h)
                </span>
              ) : (
                <button
                  onClick={handleRequestData}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  Request Data Archive
                </button>
              )}
            </div>
          </div>
        </SectionCard>

        {/* 3. Delete Account */}
        <SectionCard className="border-rose-200">
          <SectionHeader title="Delete My Account & Personal Data" />
          <div className="p-5">
            <p className="text-xs text-slate-600 leading-relaxed">
              Initiates permanent removal of your account, saved addresses, and active session tokens. A 30-day grace period is applied. Account deletion is restricted if you have active pickups or pending payments in progress.
            </p>

            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3 text-xs text-rose-900">
                <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Statutory Retention Notice</p>
                  <p className="mt-0.5 text-rose-800">
                    Per Indian GST law and the Companies Act, completed transaction invoices and device IMEI anti-theft provenance records are retained securely for the statutory 8-year period.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 rounded-xl bg-white border border-rose-300 text-rose-700 text-xs font-bold hover:bg-rose-100 transition shrink-0 cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </SectionCard>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Confirm Account Deletion</h3>
                  <p className="text-xs text-slate-500">30-day cooling-off grace period</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Type <strong className="text-slate-900 font-mono">DELETE</strong> in the box below to confirm. You will receive an email confirmation and can cancel the request within 30 days.
              </p>

              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Type DELETE"
                  value={deleteConfirmationText}
                  onChange={e => setDeleteConfirmationText(e.target.value)}
                  className="w-full text-center text-sm font-mono tracking-widest p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteConfirmationText !== 'DELETE'}
                  onClick={handleDeleteAccount}
                  className="px-5 py-2 rounded-xl bg-rose-600 disabled:opacity-40 text-white text-xs font-bold hover:bg-rose-700 shadow-sm"
                >
                  Confirm Deletion
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && <Toast message={toast} onClose={() => setToast('')} />}
      </div>
    </AccountLayout>
  );
}
