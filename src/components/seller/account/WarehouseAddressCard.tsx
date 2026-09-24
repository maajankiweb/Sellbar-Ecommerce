'use client';

import React from 'react';
import { MapPin, Phone, Building2, CheckCircle2, Edit2, Trash2, Star } from 'lucide-react';

export interface WarehouseAddress {
  id: string;
  hubName: string;
  contactPerson: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface WarehouseAddressCardProps {
  address: WarehouseAddress;
  onSetDefault?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function WarehouseAddressCard({
  address,
  onSetDefault,
  onEdit,
  onDelete
}: WarehouseAddressCardProps) {
  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        address.isDefault
          ? 'bg-blue-50/20 border-blue-400 shadow-xs'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Top Badges */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-700" />
          <h4 className="text-sm font-bold text-slate-900">{address.hubName}</h4>
        </div>

        {address.isDefault ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Default Pickup Hub</span>
          </span>
        ) : (
          onSetDefault && (
            <button
              type="button"
              onClick={() => onSetDefault(address.id)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Star className="w-3 h-3" />
              <span>Set as Default</span>
            </button>
          )
        )}
      </div>

      {/* Address Details */}
      <div className="space-y-1 text-xs text-slate-600">
        <p className="font-semibold text-slate-800">{address.contactPerson}</p>
        <p className="flex items-center gap-1 text-slate-500">
          <Phone className="w-3 h-3" />
          <span>+91 {address.phone}</span>
        </p>
        <p className="pt-1 text-slate-700 leading-relaxed">
          {address.addressLine}, {address.city}, {address.state} -{' '}
          <strong className="text-slate-900 font-mono font-bold">{address.pincode}</strong>
        </p>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-3 pt-3 mt-3 border-t border-slate-100 text-xs">
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(address.id)}
            className="text-slate-600 hover:text-blue-600 font-medium flex items-center gap-1 cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        )}

        {onDelete && !address.isDefault && (
          <button
            type="button"
            onClick={() => onDelete(address.id)}
            className="text-slate-500 hover:text-red-600 font-medium flex items-center gap-1 cursor-pointer ml-auto"
          >
            <Trash2 className="w-3 h-3" />
            <span>Remove</span>
          </button>
        )}
      </div>
    </div>
  );
}
