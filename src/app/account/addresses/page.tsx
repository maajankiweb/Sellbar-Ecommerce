'use client';

import React, { useState, useEffect } from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { PageHeader, SectionCard, SectionHeader, Toast, ConfirmModal, EmptyState } from '@/components/account/ui';
import { accountService, mockProfile } from '@/lib/account/mockData';
import { Address } from '@/types/account';
import { MapPin, Plus, Edit3, Trash2, Home, Briefcase, Star, CheckCircle } from 'lucide-react';

function AddressForm({ address, onSave, onCancel }: {
  address?: Address;
  onSave: (a: Omit<Address, 'id'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    label: address?.label || 'Home',
    name: address?.name || mockProfile.name,
    phone: address?.phone || '',
    line1: address?.line1 || '',
    line2: address?.line2 || '',
    landmark: address?.landmark || '',
    city: address?.city || '',
    state: address?.state || '',
    pincode: address?.pincode || '',
    country: address?.country || 'India',
    isDefault: address?.isDefault || false,
  });

  const update = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const labelOptions = ['Home', 'Office', 'Other'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Label */}
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Address Label</label>
        <div className="flex gap-2">
          {labelOptions.map(l => (
            <button
              key={l}
              type="button"
              onClick={() => update('label', l)}
              className={`px-4 py-2 rounded-xl border text-xs font-semibold transition ${form.label === l ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key: 'name', label: 'Full Name', placeholder: 'Enter full name', required: true },
          { key: 'phone', label: 'Phone Number', placeholder: '+91 98765 43210', required: true },
        ].map(f => (
          <div key={f.key}>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">{f.label}</label>
            <input
              required={f.required}
              value={(form as any)[f.key]}
              onChange={e => update(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Address Line 1 *</label>
        <input
          required
          value={form.line1}
          onChange={e => update('line1', e.target.value)}
          placeholder="House / Flat / Block no., Building name, Street"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Address Line 2</label>
        <input
          value={form.line2}
          onChange={e => update('line2', e.target.value)}
          placeholder="Area, Colony, Sector, Village (optional)"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Landmark</label>
        <input
          value={form.landmark}
          onChange={e => update('landmark', e.target.value)}
          placeholder="Near landmark (optional)"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { key: 'city', label: 'City', placeholder: 'Patna', required: true },
          { key: 'state', label: 'State', placeholder: 'Bihar', required: true },
          { key: 'pincode', label: 'Pincode', placeholder: '800001', required: true },
        ].map(f => (
          <div key={f.key}>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">{f.label}</label>
            <input
              required={f.required}
              value={(form as any)[f.key]}
              onChange={e => update(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50"
            />
          </div>
        ))}
      </div>

      {/* Default checkbox */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div
          onClick={() => update('isDefault', !form.isDefault)}
          className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition ${form.isDefault ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}
        >
          {form.isDefault && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <span className="text-sm font-medium text-slate-700">Set as default address</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
          Cancel
        </button>
        <button type="submit" className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition">
          Save Address
        </button>
      </div>
    </form>
  );
}

function AddressCard({ address, onEdit, onDelete, onSetDefault }: {
  address: Address;
  onEdit: (a: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}) {
  const LabelIcon = address.label === 'Office' ? Briefcase : Home;

  return (
    <div className={`relative bg-white rounded-2xl border overflow-hidden transition hover:shadow-md ${address.isDefault ? 'border-blue-200 shadow-sm shadow-blue-100' : 'border-slate-100'}`}>
      {/* Default Badge */}
      {address.isDefault && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-bl-xl rounded-tr-xl flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          DEFAULT
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${address.isDefault ? 'bg-blue-100' : 'bg-slate-100'}`}>
            <LabelIcon className={`h-4 w-4 ${address.isDefault ? 'text-blue-600' : 'text-slate-500'}`} />
          </div>
          <span className={`text-sm font-bold ${address.isDefault ? 'text-blue-700' : 'text-slate-900'}`}>
            {address.label || 'Address'}
          </span>
        </div>

        {/* Address */}
        <div className="space-y-1 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">{address.name}</p>
          <p>{address.line1}</p>
          {address.line2 && <p>{address.line2}</p>}
          {address.landmark && <p className="text-slate-400">Near {address.landmark}</p>}
          <p>{address.city}, {address.state} - {address.pincode}</p>
          <p className="text-slate-500">{address.phone}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => onEdit(address)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(address.id)}
            className="px-3.5 py-1.5 rounded-lg border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition flex items-center gap-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
          {!address.isDefault && (
            <button
              onClick={() => onSetDefault(address.id)}
              className="px-3.5 py-1.5 rounded-lg border border-blue-200 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition flex items-center gap-1"
            >
              <Star className="h-3.5 w-3.5" />
              Set Default
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AddressesContent() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    accountService.getAddresses().then(data => {
      setAddresses(data);
      setLoading(false);
    });
  }, []);

  const handleSave = (data: Omit<Address, 'id'>) => {
    if (editingAddress) {
      setAddresses(prev => prev.map(a => a.id === editingAddress.id ? { ...a, ...data } : a));
      setToast('Address updated successfully!');
    } else {
      const newAddr: Address = { ...data, id: `addr_${Date.now()}` };
      setAddresses(prev => [...prev, newAddr]);
      setToast('Address added successfully!');
    }
    setShowForm(false);
    setEditingAddress(undefined);
  };

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    setDeleteId(null);
    setToast('Address deleted.');
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    setToast('Default address updated!');
  };

  const handleEdit = (addr: Address) => {
    setEditingAddress(addr);
    setShowForm(true);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-4xl mx-auto w-full">
      <PageHeader
        title="Manage Addresses"
        description="Add and manage your delivery addresses"
        action={
          !showForm ? (
            <button
              onClick={() => { setEditingAddress(undefined); setShowForm(true); }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Address
            </button>
          ) : undefined
        }
      />

      {/* Add/Edit Form */}
      {showForm && (
        <SectionCard className="mb-6">
          <SectionHeader title={editingAddress ? 'Edit Address' : 'Add New Address'} />
          <div className="p-5">
            <AddressForm
              address={editingAddress}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditingAddress(undefined); }}
            />
          </div>
        </SectionCard>
      )}

      {/* Address List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map(i => <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse" />)}
        </div>
      ) : addresses.length === 0 ? (
        <EmptyState
          icon={<MapPin className="h-8 w-8" />}
          title="No addresses saved"
          description="Add a delivery address to make checkout faster."
          cta={{ label: 'Add Address', href: '#' }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map(addr => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={handleEdit}
              onDelete={id => setDeleteId(id)}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Address"
        description="Are you sure you want to delete this address? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default function AddressesPage() {
  return (
    <AccountLayout>
      <AccountHeader />
      <AddressesContent />
    </AccountLayout>
  );
}
