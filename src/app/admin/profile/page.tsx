'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import {
  Shield, User, Mail, Phone, Key, ShieldCheck, Laptop, Smartphone,
  Clock, CheckCircle2, AlertTriangle, RefreshCw, Copy, Check,
  ExternalLink, Lock, Eye, EyeOff, Save, Bell, LogOut, ArrowLeft,
  Calendar, Award, Briefcase, ChevronRight
} from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  target: string;
  ip: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info';
}

const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: '1', action: 'Approved High-Value Buyback', target: 'Order #ORD-9842 (₹84,500)', ip: '103.21.244.12', timestamp: '12 mins ago', status: 'success' },
  { id: '2', action: 'Modified Inventory Threshold', target: 'SKU: IPH15-PRO-256', ip: '103.21.244.12', timestamp: '1 hour ago', status: 'info' },
  { id: '3', action: 'Role Permission Update', target: 'Manager: Anita Roy', ip: '103.21.244.12', timestamp: '3 hours ago', status: 'warning' },
  { id: '4', action: 'Regenerated Storefront API Key', target: 'Production API v2', ip: '103.21.244.12', timestamp: 'Yesterday, 18:45', status: 'info' },
  { id: '5', action: 'Security Login from New IP', target: 'Chrome MacOS (Mumbai)', ip: '103.21.244.12', timestamp: '2 days ago', status: 'success' },
];

const PERMISSION_SCOPES = [
  { name: 'Order Management', level: 'Full Access (Create, Read, Update, Delete, Refund)', badge: 'Admin' },
  { name: 'Product Catalog & Pricing', level: 'Full Access (Price adjustments, SKU generation)', badge: 'Admin' },
  { name: 'Customer & KYC Records', level: 'Restricted PII Decryption & KYC Approval', badge: 'Super Admin' },
  { name: 'Financial Settlements', level: 'Approval limit up to ₹10,00,000 per transaction', badge: 'Super Admin' },
  { name: 'Staff & Role Assignment', level: 'Can assign Manager, Staff, and Delivery roles', badge: 'Super Admin' },
  { name: 'System Logs & Security Audit', level: 'Full Read & Export permission', badge: 'Admin' },
];

export default function AdminProfilePage() {
  const { currentRole, addToast } = useAdmin();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'permissions' | 'audit'>('profile');
  
  // Profile state
  const [adminName, setAdminName] = useState('Arjun Nambiar');
  const [adminEmail, setAdminEmail] = useState('arjun.nambiar@selbar.com');
  const [adminPhone, setAdminPhone] = useState('+91 98201 54321');
  const [designation, setDesignation] = useState('Principal System Administrator');
  const [department, setDepartment] = useState('Executive Operations');
  const [isSaving, setIsSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Security state
  const [twoFactorActive, setTwoFactorActive] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast({
        title: 'Profile Saved',
        message: 'Admin credentials and contact information updated successfully.',
        type: 'success'
      });
    }, 700);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard?.writeText('sk_live_selbar_enterprise_998342_prod');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    addToast({
      title: 'API Key Copied',
      message: 'Bearer token copied to clipboard safely.',
      type: 'info'
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Admin Profile</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                /admin/profile
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enterprise credentials, access scopes, 2FA security, and system audit logs
            </p>
          </div>
        </div>

        {/* Quick Role Pill */}
        <div className="flex items-center gap-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Shield className="w-4 h-4" />
          </div>
          <div className="pr-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Authority</div>
            <div className="text-xs font-black text-slate-900 dark:text-white">{currentRole}</div>
          </div>
        </div>
      </div>

      {/* Profile Header Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                alt="Admin Avatar"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white/20 shadow-2xl"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Online" />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-2xl font-black tracking-tight">{adminName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  {currentRole}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ACTIVE
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">{designation} • {department}</p>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-3 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {adminEmail}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {adminPhone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Staff ID: #ADM-8802
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('security')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-bold transition flex items-center gap-2 backdrop-blur-md"
            >
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              Security Settings
            </button>
            <Link
              href="/admin"
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              Go to Dashboard
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { key: 'profile', label: 'Admin Details', icon: User },
          { key: 'security', label: 'Security & 2FA', icon: ShieldCheck },
          { key: 'permissions', label: 'Role & Permissions', icon: Shield },
          { key: 'audit', label: 'Audit Trail', icon: Clock },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile Details */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Personal & Work Information
              </h3>
              
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={adminName}
                      onChange={e => setAdminName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Official Email
                    </label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={adminPhone}
                      onChange={e => setAdminPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={designation}
                      onChange={e => setDesignation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Department / Division
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Developer / Enterprise API Access */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-600" />
                    Admin API Access Token
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Use this key for CLI deployments, automated webhook handlers, and backend integrations.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  LIVE PROD
                </span>
              </div>

              <div className="flex items-center gap-2 mt-4 p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <code className="text-xs font-mono text-slate-800 dark:text-slate-200 flex-1 truncate px-2">
                  sk_live_selbar_enterprise_998342_prod
                </code>
                <button
                  onClick={handleCopyApiKey}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 border border-slate-200 dark:border-slate-600 flex items-center gap-1.5 shadow-xs transition"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Quick Overview</h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Security Clearance</span>
                  <span className="font-bold text-slate-900 dark:text-white">Tier 1 (Root Admin)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Role Status</span>
                  <span className="font-bold text-emerald-600">Active / Verified</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Account Created</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">14 Jan 2024</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Last Sign-in</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">Today, 11:42 AM</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800/60 dark:to-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-3xl p-5">
              <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Enterprise Security Notice
              </h4>
              <p className="text-[11px] text-blue-800/80 dark:text-slate-300 leading-relaxed">
                Super Admin sessions expire after 8 hours of inactivity. Critical actions (refunds above ₹50,000, database exports, staff role promotions) require hardware 2FA re-verification.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Security & 2FA */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Two-Factor Authentication (2FA)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Hardware key / Authenticator app verification required upon sign-in.
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  twoFactorActive
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-700'
                }`}>
                  {twoFactorActive ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>

              <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Google / Microsoft Authenticator</div>
                    <div className="text-[11px] text-slate-500">Configured on iPhone 15 Pro • Added Jan 2024</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setTwoFactorActive(!twoFactorActive);
                    addToast({
                      title: '2FA Updated',
                      message: twoFactorActive ? '2FA disabled (not recommended)' : '2FA activated successfully',
                      type: twoFactorActive ? 'warning' : 'success'
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition"
                >
                  {twoFactorActive ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Laptop className="w-4 h-4 text-blue-600" />
                Active Admin Sessions
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-600 flex items-center justify-center">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        MacBook Pro 16" (Sonoma)
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                          THIS DEVICE
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">Mumbai, India • Chrome 124 • IP: 103.21.244.12</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600">Active Now</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">iPhone 15 Pro (iOS 17.4)</div>
                      <div className="text-[11px] text-slate-500">Mumbai, India • Safari Mobile • 2 hours ago</div>
                    </div>
                  </div>
                  <button
                    onClick={() => addToast({ title: 'Session Revoked', message: 'Device logged out safely', type: 'info' })}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Password Management</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Last changed 42 days ago. SELBAR enterprise policy mandates a password refresh every 90 days.
              </p>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Key className="w-3.5 h-3.5 text-blue-600" />
                Change Master Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Permissions Matrix */}
      {activeTab === 'permissions' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                Assigned Role Permissions & Clearance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Active permissions for your identity: <span className="font-bold text-slate-800 dark:text-slate-200">{currentRole}</span>
              </p>
            </div>
            <Link
              href="/admin/roles"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Manage Role Definitions <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {PERMISSION_SCOPES.map((p, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {p.name}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{p.level}</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {p.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Administrative Activity & Audit Trail
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Immutable system audit logs recorded under your staff ID: #ADM-8802
              </p>
            </div>
            <Link
              href="/admin/activity-logs"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Full Activity Explorer <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {MOCK_AUDIT_LOGS.map(log => (
              <div key={log.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{log.action}</div>
                    <div className="text-[11px] text-slate-500">Target: {log.target} • Origin IP: {log.ip}</div>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Update Master Password</h3>
            <p className="text-xs text-slate-500">Enter your current credentials to authorize this change.</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Current Password</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={currentPass}
                  onChange={e => setCurrentPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
                  placeholder="••••••••••••"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">New Strong Password</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
                  placeholder="Min 12 chars, symbol, number"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                {showPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showPass ? 'Hide characters' : 'Show characters'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    addToast({ title: 'Password Changed', message: 'Master security password updated', type: 'success' });
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/20"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
