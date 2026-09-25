'use client';

import React, { useState, useEffect } from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { PageHeader, SectionCard, SectionHeader, Toast, RatingStars } from '@/components/account/ui';
import { accountService, mockProfile } from '@/lib/account/mockData';
import { useAuth } from '@/context/AuthContext';
import {
  User, Mail, Phone, Calendar, Edit3, Camera, CheckCircle,
  Award, ShoppingBag, Wallet, Shield
} from 'lucide-react';

const GENDERS = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'];
const GENDER_LABELS: Record<string, string> = {
  MALE: 'Male', FEMALE: 'Female', OTHER: 'Other', PREFER_NOT_TO_SAY: 'Prefer Not to Say',
};

function ProfileContent() {
  const { user, updateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: mockProfile.name,
    email: mockProfile.email,
    phone: mockProfile.phone,
    dateOfBirth: mockProfile.dateOfBirth || '',
    gender: mockProfile.gender || '',
    payoutUpi: user?.payoutUpi || '',
  });
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  const completionScore = () => {
    let score = 0;
    if (form.name && form.name.length > 2) score += 20;
    if (form.email && form.email.includes('@')) score += 20;
    if (form.phone && form.phone.length > 9) score += 20;
    if (form.dateOfBirth) score += 20;
    if (form.gender) score += 20;
    return score;
  };
  const pct = completionScore();

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    updateProfile({ name: form.name, email: form.email, payoutUpi: form.payoutUpi });
    setSaving(false);
    setEditMode(false);
    setToast('Profile updated successfully!');
  };

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-4xl mx-auto w-full">
      <PageHeader title="My Profile" description="Manage your personal information and preferences" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Stats + Avatar */}
        <div className="space-y-5">
          {/* Avatar Card */}
          <SectionCard>
            <div className="p-6 flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative mb-4">
                <img
                  src={mockProfile.avatar}
                  alt={mockProfile.name}
                  className="h-24 w-24 rounded-full object-cover border-4 border-blue-100 shadow-md"
                />
                <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h2 className="font-black text-slate-900 text-lg">{form.name}</h2>
              <p className="text-sm text-slate-500">{form.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {mockProfile.tier} Member
                </span>
              </div>

              {/* Profile Completion */}
              <div className="w-full mt-5 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-600">Profile Completion</span>
                  <span className={`text-xs font-black ${pct === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>{pct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {pct < 100 && (
                  <p className="text-[10px] text-slate-400 mt-2">Complete your profile to unlock all features.</p>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Account Stats */}
          <SectionCard>
            <SectionHeader title="Account Summary" />
            <div className="p-4 space-y-3">
              {[
                { icon: <ShoppingBag className="h-4 w-4 text-blue-600" />, label: 'Total Orders', value: mockProfile.totalOrders, bg: 'bg-blue-50' },
                { icon: <Wallet className="h-4 w-4 text-emerald-600" />, label: 'Total Spent', value: `₹${mockProfile.totalSpent.toLocaleString('en-IN')}`, bg: 'bg-emerald-50' },
                { icon: <Award className="h-4 w-4 text-amber-500" />, label: 'Reward Points', value: mockProfile.points.toLocaleString('en-IN'), bg: 'bg-amber-50' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className="font-bold text-sm text-slate-900">{item.value}</p>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  Member since {new Date(mockProfile.memberSince).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right: Edit Form */}
        <div className="lg:col-span-2">
          <SectionCard>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-sm text-slate-900">Personal Information</h2>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Profile
                </button>
              )}
            </div>

            <div className="p-5 space-y-5">
              {editMode ? (
                <div className="space-y-4">
                  {/* Edit Fields */}
                  {[
                    { key: 'name', label: 'Full Name', type: 'text', icon: <User className="h-4 w-4 text-slate-400" />, placeholder: 'Enter your full name' },
                    { key: 'email', label: 'Email Address', type: 'email', icon: <Mail className="h-4 w-4 text-slate-400" />, placeholder: 'Enter email address' },
                    { key: 'phone', label: 'Phone Number', type: 'tel', icon: <Phone className="h-4 w-4 text-slate-400" />, placeholder: '+91 XXXXX XXXXX' },
                    { key: 'dateOfBirth', label: 'Date of Birth', type: 'date', icon: <Calendar className="h-4 w-4 text-slate-400" />, placeholder: '' },
                    { key: 'payoutUpi', label: 'UPI ID (for refunds)', type: 'text', icon: <Wallet className="h-4 w-4 text-slate-400" />, placeholder: 'yourname@upi' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">{f.label}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">{f.icon}</span>
                        <input
                          type={f.type}
                          value={(form as any)[f.key]}
                          onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Gender */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Gender</label>
                    <div className="flex flex-wrap gap-2">
                      {GENDERS.map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, gender: g }))}
                          className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition ${form.gender === g ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-600 hover:border-blue-300'}`}
                        >
                          {GENDER_LABELS[g]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { label: 'Full Name', value: form.name, icon: <User className="h-4 w-4 text-slate-400" /> },
                    { label: 'Email Address', value: form.email, icon: <Mail className="h-4 w-4 text-slate-400" />, verified: true },
                    { label: 'Phone Number', value: form.phone, icon: <Phone className="h-4 w-4 text-slate-400" />, verified: true },
                    { label: 'Date of Birth', value: form.dateOfBirth ? new Date(form.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—', icon: <Calendar className="h-4 w-4 text-slate-400" /> },
                    { label: 'Gender', value: form.gender ? GENDER_LABELS[form.gender] : '—', icon: <User className="h-4 w-4 text-slate-400" /> },
                    { label: 'UPI ID', value: form.payoutUpi || '—', icon: <Wallet className="h-4 w-4 text-slate-400" /> },
                  ].map(f => (
                    <div key={f.label} className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0">
                      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                        {f.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-400 mb-0.5">{f.label}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900 truncate">{f.value}</p>
                          {f.verified && (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
                              <CheckCircle className="h-3 w-3" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AccountLayout>
      <AccountHeader />
      <ProfileContent />
    </AccountLayout>
  );
}
