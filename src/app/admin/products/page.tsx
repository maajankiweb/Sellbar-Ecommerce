'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Eye,
  SlidersHorizontal,
  Upload,
  Download,
  AlertCircle
} from 'lucide-react';
import { DataTable, Column } from '@/components/admin/ui/DataTable';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog';
import { adminService } from '@/services/adminService';
import { AdminProduct, ProductStatus } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';

export default function AdminProductsPage() {
  const router = useRouter();
  const { addToast } = useAdmin();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteCandidate, setDeleteCandidate] = useState<AdminProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    const res = await adminService.getProducts({
      category: categoryFilter,
      status: statusFilter,
      limit: 100,
    });
    setProducts(res.items);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, statusFilter]);

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    await adminService.deleteProduct(deleteCandidate.id);
    addToast({
      title: 'Product Deleted',
      message: `${deleteCandidate.name} was removed from the catalog.`,
      type: 'success',
    });
    setIsDeleting(false);
    setDeleteCandidate(null);
    fetchProducts();
  };

  const handleDuplicate = async (prod: AdminProduct) => {
    const duplicated = await adminService.saveProduct({
      ...prod,
      id: undefined,
      name: `${prod.name} (Copy)`,
      sku: `${prod.sku}-COPY`,
      status: 'draft',
    });
    addToast({
      title: 'Product Duplicated',
      message: `Created duplicate draft: ${duplicated.name}`,
      type: 'success',
    });
    fetchProducts();
  };

  const handleBulkDelete = async (ids: string[]) => {
    const count = await adminService.bulkDeleteProducts(ids);
    addToast({
      title: 'Bulk Deletion Complete',
      message: `Successfully removed ${count} products.`,
      type: 'success',
    });
    fetchProducts();
  };

  const columns: Column<AdminProduct>[] = [
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      render: p => (
        <div className="flex items-center gap-3 min-w-[240px]">
          <img
            src={p.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
            alt={p.name}
            className="h-10 w-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
          />
          <div className="min-w-0">
            <Link
              href={`/admin/products/${p.id}`}
              className="font-semibold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 truncate block"
            >
              {p.name}
            </Link>
            <div className="text-[11px] text-slate-400 font-mono">
              SKU: {p.sku} • {p.brand}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: p => (
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {p.category}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: p => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white">
            ₹{p.price.toLocaleString('en-IN')}
          </span>
          {p.compareAtPrice > p.price && (
            <span className="ml-1.5 text-xs text-slate-400 line-through">
              ₹{p.compareAtPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      render: p => (
        <div className="flex items-center gap-2">
          <span
            className={`font-semibold ${
              p.stock === 0
                ? 'text-rose-600'
                : p.stock <= p.lowStockThreshold
                ? 'text-amber-600'
                : 'text-slate-700 dark:text-slate-200'
            }`}
          >
            {p.stock} units
          </span>
          {p.stock <= p.lowStockThreshold && p.stock > 0 && (
            <Badge variant="warning" size="sm">
              Low
            </Badge>
          )}
          {p.stock === 0 && (
            <Badge variant="danger" size="sm">
              Out of stock
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: p => (
        <Badge
          variant={
            p.status === 'published'
              ? 'success'
              : p.status === 'draft'
              ? 'neutral'
              : p.status === 'out_of_stock'
              ? 'danger'
              : 'warning'
          }
          size="sm"
          dot={p.status === 'published'}
        >
          {p.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: p => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/products/${p.id}`}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 transition-colors"
            title="Edit Product"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleDuplicate(p)}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer transition-colors"
            title="Duplicate Product"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteCandidate(p)}
            className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
            title="Delete Product"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Products Catalog
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Manage your store inventory, SKU variations, pricing, and live listings
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            leftIcon={<Upload className="h-4 w-4" />}
            onClick={() =>
              addToast({
                title: 'Import Ready',
                message: 'Upload CSV or Shopify catalog export.',
                type: 'info',
              })
            }
          >
            Import CSV
          </Button>

          <Link href="/admin/products/new">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={products}
        keyField="id"
        searchPlaceholder="Search by product name, SKU or brand..."
        searchField={p => `${p.name} ${p.sku} ${p.brand}`}
        exportFilename="selbar_products_catalog"
        filterOptions={[
          {
            label: 'Category',
            currentValue: categoryFilter,
            onFilterChange: setCategoryFilter,
            options: [
              { label: 'All Categories', value: 'all' },
              { label: 'Smartphones', value: 'smartphones' },
              { label: 'Audio & Wearables', value: 'audio & wearables' },
              { label: 'Laptops & Computers', value: 'laptops & computers' },
              { label: 'Footwear & Apparel', value: 'footwear & apparel' },
              { label: 'Accessories', value: 'accessories' },
            ],
          },
          {
            label: 'Status',
            currentValue: statusFilter,
            onFilterChange: setStatusFilter,
            options: [
              { label: 'All Statuses', value: 'all' },
              { label: 'Published', value: 'published' },
              { label: 'Draft', value: 'draft' },
              { label: 'Low Stock', value: 'low_stock' },
              { label: 'Out of Stock', value: 'out_of_stock' },
            ],
          },
        ]}
        onBulkDelete={handleBulkDelete}
        emptyTitle="No products found"
        emptyDescription="We couldn't find any products matching your active filters."
        emptyActionText="Reset Filters"
        onEmptyAction={() => {
          setCategoryFilter('all');
          setStatusFilter('all');
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete "${deleteCandidate?.name}"?`}
        description="This will permanently delete this product, all variants, and associated inventory tracking. This action cannot be undone."
        confirmText="Delete Product"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
