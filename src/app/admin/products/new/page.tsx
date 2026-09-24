'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Search,
  Eye,
  CheckCircle2,
  Layers,
  Tag,
  DollarSign,
  Boxes,
  Truck,
  Globe,
  Package
} from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { adminService } from '@/services/adminService';
import { useAdmin } from '@/context/AdminContext';
import { AdminProduct, ProductVariant } from '@/types/admin';

export default function AddProductPage() {
  const router = useRouter();
  const { addToast } = useAdmin();

  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'inventory' | 'images' | 'variants' | 'shipping' | 'seo'>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Basic Info Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [brand, setBrand] = useState('Apple');
  const [category, setCategory] = useState('Smartphones');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'scheduled'>('published');

  // Pricing Form State
  const [price, setPrice] = useState<number>(0);
  const [compareAtPrice, setCompareAtPrice] = useState<number>(0);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(18);
  const [taxClass, setTaxClass] = useState('Standard GST (18%)');

  // Inventory State
  const [stock, setStock] = useState<number>(20);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [trackInventory, setTrackInventory] = useState(true);
  const [allowBackorders, setAllowBackorders] = useState(false);

  // Images State
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Variants State
  const [variants, setVariants] = useState<ProductVariant[]>([
    { id: 'var-1', title: 'Default Variant', sku: sku, attributes: { type: 'standard' }, price: 0, stock: 20 },
  ]);
  const [variantOptionName, setVariantOptionName] = useState('Color');
  const [variantOptionVal, setVariantOptionVal] = useState('');

  // Shipping State
  const [weightKg, setWeightKg] = useState(0.5);
  const [lengthCm, setLengthCm] = useState(20);
  const [widthCm, setWidthCm] = useState(15);
  const [heightCm, setHeightCm] = useState(5);
  const [shippingClass, setShippingClass] = useState('Standard Fragile');

  // SEO State
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Auto-slug generator
  const handleNameChange = (val: string) => {
    setName(val);
    if (!seoTitle) setSeoTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
    );
  };

  const handleAddImage = () => {
    if (!newImageUrl) return;
    setImages(prev => [...prev, newImageUrl]);
    setNewImageUrl('');
    addToast({ title: 'Image Added', message: 'Thumbnail added to gallery', type: 'info' });
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    if (!variantOptionVal) return;
    const newVar: ProductVariant = {
      id: `var-${Date.now()}`,
      title: `${variantOptionName}: ${variantOptionVal}`,
      sku: `${sku}-${variantOptionVal.slice(0, 3).toUpperCase()}`,
      attributes: { [variantOptionName.toLowerCase()]: variantOptionVal },
      price: price || 999,
      stock: 10,
    };
    setVariants(prev => [...prev, newVar]);
    setVariantOptionVal('');
    addToast({ title: 'Variant Added', message: `Added ${newVar.title}`, type: 'success' });
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(prev => prev.filter(v => v.id !== id));
  };

  const handleSave = async (publishStatus: 'published' | 'draft') => {
    if (!name.trim()) {
      addToast({ title: 'Validation Error', message: 'Product name is required', type: 'error' });
      setActiveTab('basic');
      return;
    }

    setIsSubmitting(true);
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    await adminService.saveProduct({
      name,
      slug,
      sku,
      brand,
      category,
      subcategory,
      description,
      price: Number(price),
      compareAtPrice: Number(compareAtPrice),
      costPrice: Number(costPrice),
      taxRate: Number(taxRate),
      taxClass,
      stock: Number(stock),
      lowStockThreshold: Number(lowStockThreshold),
      trackInventory,
      allowBackorders,
      images,
      variants,
      weightKg: Number(weightKg),
      dimensionsCm: { length: Number(lengthCm), width: Number(widthCm), height: Number(heightCm) },
      shippingClass,
      tags,
      status: publishStatus,
      seoTitle: seoTitle || name,
      seoDescription: seoDescription || description.slice(0, 150),
    });

    setIsSubmitting(false);
    addToast({
      title: publishStatus === 'published' ? 'Product Published' : 'Draft Saved',
      message: `${name} has been saved to the store catalog.`,
      type: 'success',
    });
    router.push('/admin/products');
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Package },
    { id: 'pricing', label: 'Pricing & Taxes', icon: DollarSign },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'images', label: 'Media Gallery', icon: ImageIcon },
    { id: 'variants', label: 'Variants', icon: Layers },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'seo', label: 'SEO & Preview', icon: Globe },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create New Product
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure catalog details, pricing rules, inventory, and search visibility
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => handleSave('draft')}
            isLoading={isSubmitting}
          >
            Save Draft
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => handleSave('published')}
            isLoading={isSubmitting}
            leftIcon={<CheckCircle2 className="h-4 w-4" />}
          >
            Publish Product
          </Button>
        </div>
      </div>

      {/* Tab Navigation Pill Bar */}
      <div className="flex overflow-x-auto gap-1 rounded-xl bg-slate-100 p-1.5 dark:bg-slate-800/80">
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                isActive
                  ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-blue-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content Sections */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
        {/* 1. Basic Information */}
        {activeTab === 'basic' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Basic Product Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="e.g. Apple iPhone 16 Pro Max (256GB, Desert Titanium)"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  SKU (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={e => setSku(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-mono text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                  placeholder="e.g. Apple, Sony, Nike"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="Smartphones">Smartphones</option>
                  <option value="Audio & Wearables">Audio & Wearables</option>
                  <option value="Laptops & Computers">Laptops & Computers</option>
                  <option value="Footwear & Apparel">Footwear & Apparel</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Subcategory
                </label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={e => setSubcategory(e.target.value)}
                  placeholder="e.g. Flagship Phones, Wireless Earbuds"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description & Specifications
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Enter full device specifications, features, warranty terms, and box contents..."
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Product Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="e.g. 5g, flagship, wireless, titanium, festive"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. Pricing & Taxes */}
        {activeTab === 'pricing' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Pricing & GST Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Sale Price (₹ INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={price || ''}
                    onChange={e => setPrice(Number(e.target.value))}
                    placeholder="24999"
                    className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-8 pr-3 text-sm font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  MRP / Compare at Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={compareAtPrice || ''}
                    onChange={e => setCompareAtPrice(Number(e.target.value))}
                    placeholder="29999"
                    className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Cost per Item (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={costPrice || ''}
                    onChange={e => setCostPrice(Number(e.target.value))}
                    placeholder="18500"
                    className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tax Class
                </label>
                <select
                  value={taxClass}
                  onChange={e => setTaxClass(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="Standard GST (18%)">Standard GST (18% - Electronics)</option>
                  <option value="Apparel GST (12%)">Apparel GST (12%)</option>
                  <option value="Luxury GST (28%)">Luxury GST (28%)</option>
                  <option value="Zero Tax (0%)">Exempt / Zero Tax</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  GST Rate (%)
                </label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={e => setTaxRate(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Profit Margin Preview Box */}
            {price > 0 && costPrice > 0 && (
              <div className="rounded-lg bg-emerald-50/60 p-4 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/60 text-xs">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                  Estimated Gross Profit:
                </span>{' '}
                <strong className="text-emerald-900 dark:text-emerald-200">
                  ₹{(price - costPrice).toLocaleString('en-IN')}
                </strong>{' '}
                ({(((price - costPrice) / price) * 100).toFixed(1)}% margin)
              </div>
            )}
          </div>
        )}

        {/* 3. Inventory */}
        {activeTab === 'inventory' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Stock & Inventory Rules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Quantity Available
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={e => setStock(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  value={lowStockThreshold}
                  onChange={e => setLowStockThreshold(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="sm:col-span-2 space-y-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={trackInventory}
                    onChange={e => setTrackInventory(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Track quantity automatically on order placement
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowBackorders}
                    onChange={e => setAllowBackorders(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Allow customers to purchase when item is out of stock (Backorders)
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 4. Media Gallery */}
        {activeTab === 'images' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Product Images & Gallery
            </h3>

            {/* Quick URL Input */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                placeholder="Paste public image URL (https://...)"
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <Button variant="secondary" size="md" onClick={handleAddImage}>
                Add Image
              </Button>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100 dark:border-slate-800 dark:bg-slate-800 aspect-square"
                >
                  <img
                    src={img}
                    alt={`Product preview ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      className="rounded-full bg-rose-600 p-2 text-white hover:bg-rose-700 cursor-pointer shadow-md"
                      title="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {idx === 0 && (
                    <span className="absolute bottom-2 left-2 rounded bg-slate-900/80 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Variants */}
        {activeTab === 'variants' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Product Variants & Attributes
            </h3>

            {/* Add Variant Bar */}
            <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
              <select
                value={variantOptionName}
                onChange={e => setVariantOptionName(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold dark:border-slate-600 dark:bg-slate-700"
              >
                <option value="Color">Color</option>
                <option value="Storage">Storage</option>
                <option value="Size">Size</option>
                <option value="RAM">RAM</option>
              </select>

              <input
                type="text"
                value={variantOptionVal}
                onChange={e => setVariantOptionVal(e.target.value)}
                placeholder="Option value (e.g. Desert Titanium, 512GB, XL)"
                className="flex-1 min-w-[200px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />

              <Button
                variant="primary"
                size="md"
                onClick={handleAddVariant}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Variant
              </Button>
            </div>

            {/* Variants Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                  <tr>
                    <th className="px-3 py-2.5 font-semibold">Variant Title</th>
                    <th className="px-3 py-2.5 font-semibold">SKU</th>
                    <th className="px-3 py-2.5 font-semibold">Price (₹)</th>
                    <th className="px-3 py-2.5 font-semibold">Stock</th>
                    <th className="px-3 py-2.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {variants.map(v => (
                    <tr key={v.id}>
                      <td className="px-3 py-2.5 font-semibold text-slate-900 dark:text-white">
                        {v.title}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-slate-500">
                        {v.sku}
                      </td>
                      <td className="px-3 py-2.5">
                        <input
                          type="number"
                          value={v.price}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setVariants(prev =>
                              prev.map(item => (item.id === v.id ? { ...item, price: val } : item))
                            );
                          }}
                          className="w-24 rounded border border-slate-300 px-2 py-1 dark:border-slate-700 dark:bg-slate-800"
                        />
                      </td>
                      <td className="px-3 py-2.5">
                        <input
                          type="number"
                          value={v.stock}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setVariants(prev =>
                              prev.map(item => (item.id === v.id ? { ...item, stock: val } : item))
                            );
                          }}
                          className="w-20 rounded border border-slate-300 px-2 py-1 dark:border-slate-700 dark:bg-slate-800"
                        />
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          onClick={() => handleRemoveVariant(v.id)}
                          className="text-rose-500 hover:text-rose-700 cursor-pointer p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. Shipping */}
        {activeTab === 'shipping' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Parcel Dimensions & Shipping Class
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={weightKg}
                  onChange={e => setWeightKg(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Length (cm)
                </label>
                <input
                  type="number"
                  value={lengthCm}
                  onChange={e => setLengthCm(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Width (cm)
                </label>
                <input
                  type="number"
                  value={widthCm}
                  onChange={e => setWidthCm(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={e => setHeightCm(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Shipping Profile Class
                </label>
                <select
                  value={shippingClass}
                  onChange={e => setShippingClass(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="Express Insured Electronics">Express Insured Electronics (BlueDart / Delhivery Air)</option>
                  <option value="Standard Fragile">Standard Fragile (Bubble-pack insured)</option>
                  <option value="Standard Apparel">Standard Apparel</option>
                  <option value="Heavy Freight">Heavy Freight (Laptops/Desktops above 5kg)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 7. SEO & Search Preview */}
        {activeTab === 'seo' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Search Engine Optimization (SERP)
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={e => setSeoTitle(e.target.value)}
                placeholder="Buy Apple iPhone 16 Pro Online India | SELBAR"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                URL Slug
              </label>
              <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800">
                <span>https://selbar.com/buy/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="flex-1 bg-transparent font-mono text-slate-800 focus:outline-none dark:text-slate-100 pl-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={e => setSeoDescription(e.target.value)}
                placeholder="High-converting search summary shown on Google search results (120-160 characters)"
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Google SERP Preview Box */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60 mt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Live Google Search Preview
              </span>
              <div className="text-xs text-emerald-700 dark:text-emerald-400">
                https://selbar.com &gt; buy &gt; {slug || 'product-slug'}
              </div>
              <div className="text-base font-medium text-blue-600 hover:underline dark:text-blue-400 cursor-pointer mt-0.5">
                {seoTitle || name || 'Product Name Preview'} | SELBAR
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                {seoDescription || description || 'Product description will appear here as indexed by web crawlers.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
