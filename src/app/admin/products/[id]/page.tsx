'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Trash2,
  CheckCircle2,
  Package,
  DollarSign,
  Boxes,
  Image as ImageIcon,
  Layers,
  Truck,
  Globe,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog';
import { adminService } from '@/services/adminService';
import { useAdmin } from '@/context/AdminContext';
import { AdminProduct } from '@/types/admin';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = String(params.id);
  const { addToast } = useAdmin();

  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [compareAtPrice, setCompareAtPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<any>('published');

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const prod = await adminService.getProductById(productId);
      if (prod) {
        setProduct(prod);
        setName(prod.name);
        setSku(prod.sku);
        setBrand(prod.brand);
        setCategory(prod.category);
        setPrice(prod.price);
        setCompareAtPrice(prod.compareAtPrice);
        setStock(prod.stock);
        setDescription(prod.description);
        setStatus(prod.status);
      }
      setIsLoading(false);
    }
    load();
  }, [productId]);

  const handleSave = async () => {
    if (!product) return;
    setIsSaving(true);
    await adminService.saveProduct({
      id: product.id,
      name,
      sku,
      brand,
      category,
      price: Number(price),
      compareAtPrice: Number(compareAtPrice),
      stock: Number(stock),
      description,
      status,
    });
    setIsSaving(false);
    addToast({
      title: 'Changes Saved',
      message: `${name} has been updated in the catalog.`,
      type: 'success',
    });
  };

  const handleDelete = async () => {
    if (!product) return;
    await adminService.deleteProduct(product.id);
    addToast({
      title: 'Product Deleted',
      message: `${product.name} was removed.`,
      type: 'success',
    });
    router.push('/admin/products');
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-12 text-center">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Product Not Found
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          The requested product ID could not be loaded.
        </p>
        <Link href="/admin/products">
          <Button variant="outline">Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Edit Product
              </h1>
              <Badge variant={status === 'published' ? 'success' : 'neutral'} size="sm">
                {status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              ID: {product.id} • SKU: {sku}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="danger"
            size="md"
            onClick={() => setIsDeleteDialogOpen(true)}
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Delete
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<CheckCircle2 className="h-4 w-4" />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Edit Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Form Fields */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              General Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Product Title
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Brand
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Description
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Pricing & Inventory
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Sale Price (₹)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  MRP Price (₹)
                </label>
                <input
                  type="number"
                  value={compareAtPrice}
                  onChange={e => setCompareAtPrice(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Current Stock
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={e => setStock(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Thumbnail */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Publishing Status
            </h4>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="published">Published (Active)</option>
              <option value="draft">Draft (Hidden)</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Primary Image
            </h4>
            <div className="aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title={`Delete "${product.name}"?`}
        description="This will permanently delete this product and remove it from store search results. This action cannot be undone."
        confirmText="Delete Product"
        variant="danger"
      />
    </div>
  );
}
