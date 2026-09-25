'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers, PlusCircle, Search, Filter, CheckCircle2, ShieldCheck,
  Edit3, Trash2, ArrowUpRight, Tag, RefreshCw
} from 'lucide-react';

interface RefurbListing {
  id: string;
  sku: string;
  title: string;
  category: string;
  grade: 'Grade A+' | 'Grade A' | 'Grade B';
  stock: number;
  price: number;
  originalMrp: number;
  warranty: string;
  status: 'active' | 'out_of_stock' | 'draft';
}

const INITIAL_LISTINGS: RefurbListing[] = [
  {
    id: 'lst-1',
    sku: 'REF-IPH15PM-512',
    title: 'Apple iPhone 15 Pro Max (512GB, Natural Titanium)',
    category: 'Smartphones',
    grade: 'Grade A+',
    stock: 6,
    price: 98999,
    originalMrp: 179900,
    warranty: '12 Months SELBAR Shield',
    status: 'active',
  },
  {
    id: 'lst-2',
    sku: 'REF-MACM2-512',
    title: 'MacBook Air M2 (16GB RAM, 512GB SSD, Midnight)',
    category: 'Laptops',
    grade: 'Grade A+',
    stock: 4,
    price: 84999,
    originalMrp: 139900,
    warranty: '12 Months SELBAR Shield',
    status: 'active',
  },
  {
    id: 'lst-3',
    sku: 'REF-S24U-512',
    title: 'Samsung Galaxy S24 Ultra 5G (512GB, Titanium Violet)',
    category: 'Smartphones',
    grade: 'Grade A',
    stock: 2,
    price: 89999,
    originalMrp: 139999,
    warranty: '6 Months Certified Warranty',
    status: 'active',
  },
  {
    id: 'lst-4',
    sku: 'REF-ONE12-256',
    title: 'OnePlus 12 5G (16GB / 256GB, Silky Black)',
    category: 'Smartphones',
    grade: 'Grade A+',
    stock: 8,
    price: 52999,
    originalMrp: 64999,
    warranty: '6 Months Certified Warranty',
    status: 'active',
  },
  {
    id: 'lst-5',
    sku: 'REF-IPH13-128',
    title: 'Apple iPhone 13 (128GB, Midnight Blue)',
    category: 'Smartphones',
    grade: 'Grade B',
    stock: 0,
    price: 36999,
    originalMrp: 59900,
    warranty: '6 Months Warranty',
    status: 'out_of_stock',
  },
];

export default function SellerInventoryPage() {
  const [listings, setListings] = useState<RefurbListing[]>(INITIAL_LISTINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('1');
  const [newGrade, setNewGrade] = useState<'Grade A+' | 'Grade A' | 'Grade B'>('Grade A+');

  const filtered = listings.filter(l => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        l.title.toLowerCase().includes(q) ||
        l.sku.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    const newItem: RefurbListing = {
      id: `lst-${Date.now()}`,
      sku: `REF-${newTitle.substring(0, 6).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
      title: newTitle,
      category: 'Smartphones',
      grade: newGrade,
      stock: Number(newStock) || 1,
      price: Number(newPrice),
      originalMrp: Math.round(Number(newPrice) * 1.35),
      warranty: '12 Months SELBAR Shield',
      status: 'active',
    };

    setListings([newItem, ...listings]);
    setShowAddModal(false);
    setNewTitle('');
    setNewPrice('');
    setToast('New refurbished inventory listing published to SELBAR storefront!');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-12 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-300">
              Refurbished Catalog Management
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500">{listings.length} Active SKUs</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600" />
            Refurbished Device Catalog & Stock
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your certified refurbished listings, Grade A/B/C pricing tiers, and warranty flags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Add Refurb Product
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="text-xs font-bold text-slate-500">
          Showing {filtered.length} of {listings.length} listed SKUs
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search SKU, product title..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">SKU / Device Title</th>
                <th className="py-3.5 px-4">Refurb Grade</th>
                <th className="py-3.5 px-4 text-center">Stock Available</th>
                <th className="py-3.5 px-4 text-right">Selling Price / MRP</th>
                <th className="py-3.5 px-4">Warranty</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(listing => (
                <tr key={listing.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-xs">{listing.title}</div>
                    <div className="font-mono text-[10px] text-blue-600 font-bold mt-0.5">{listing.sku}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      listing.grade === 'Grade A+' ? 'bg-emerald-100 text-emerald-800' :
                      listing.grade === 'Grade A' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {listing.grade}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                    {listing.stock} units
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="font-black text-emerald-600 text-sm">
                      ₹{listing.price.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-400 line-through">
                      ₹{listing.originalMrp.toLocaleString('en-IN')}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {listing.warranty}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      listing.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {listing.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">List Refurbished Item</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddListing} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Apple iPhone 14 (128GB, Starlight)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    placeholder="42000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={e => setNewStock(e.target.value)}
                    min={1}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Condition Grade</label>
                <select
                  value={newGrade}
                  onChange={e => setNewGrade(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Grade A+">Grade A+ (Like New, Zero Scratches)</option>
                  <option value="Grade A">Grade A (Minor cosmetic micro-scratches)</option>
                  <option value="Grade B">Grade B (Visible usage wear, 100% functional)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
