'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  FolderTree,
  Package,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';
import { Modal } from '@/components/admin/ui/Modal';
import { useAdmin } from '@/context/AdminContext';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  subcategories: string[];
  status: 'active' | 'hidden';
  icon: string;
}

export default function AdminCategoriesPage() {
  const { addToast } = useAdmin();
  const [categories, setCategories] = useState<CategoryItem[]>([
    {
      id: 'cat-1',
      name: 'Smartphones',
      slug: 'smartphones',
      productCount: 48,
      subcategories: ['Flagship Phones', 'Budget Phones', 'Foldables', 'Refurbished iPhones'],
      status: 'active',
      icon: '📱',
    },
    {
      id: 'cat-2',
      name: 'Audio & Wearables',
      slug: 'audio-wearables',
      productCount: 32,
      subcategories: ['Over-Ear Headphones', 'TWS Earbuds', 'Smartwatches', 'Fitness Trackers'],
      status: 'active',
      icon: '🎧',
    },
    {
      id: 'cat-3',
      name: 'Laptops & Computers',
      slug: 'laptops-computers',
      productCount: 26,
      subcategories: ['MacBooks', 'Gaming Laptops', 'Ultrabooks', 'Custom Workstations'],
      status: 'active',
      icon: '💻',
    },
    {
      id: 'cat-4',
      name: 'Footwear & Apparel',
      slug: 'footwear-apparel',
      productCount: 64,
      subcategories: ['Running Shoes', 'Sneakers', 'Streetwear Hoodies', 'Graphic Tees'],
      status: 'active',
      icon: '👟',
    },
    {
      id: 'cat-5',
      name: 'Accessories',
      slug: 'accessories',
      productCount: 88,
      subcategories: ['Power Banks', 'Fast Chargers', 'Ergonomic Mice', 'Protective Cases'],
      status: 'active',
      icon: '🔌',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('📦');
  const [catSubs, setCatSubs] = useState('');

  const handleCreate = () => {
    if (!catName.trim()) return;
    const newCat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: catName,
      slug: catName.toLowerCase().replace(/\s+/g, '-'),
      productCount: 0,
      subcategories: catSubs.split(',').map(s => s.trim()).filter(Boolean),
      status: 'active',
      icon: catIcon || '📦',
    };
    setCategories(prev => [...prev, newCat]);
    setIsModalOpen(false);
    setCatName('');
    setCatSubs('');
    addToast({
      title: 'Category Created',
      message: `Category "${newCat.name}" is now live.`,
      type: 'success',
    });
  };

  const handleDelete = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    addToast({ title: 'Category Removed', message: 'Category removed successfully.', type: 'info' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Category Management
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Organize catalog taxonomy, store navigation hierarchies, and filter attributes
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Add New Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/90 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-xl border border-slate-200 dark:border-slate-700">
                    {cat.icon}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {cat.name}
                    </h3>
                    <div className="text-[11px] font-mono text-slate-400">
                      slug: /{cat.slug}
                    </div>
                  </div>
                </div>
                <Badge variant={cat.status === 'active' ? 'success' : 'neutral'} size="sm">
                  {cat.status}
                </Badge>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Subcategories ({cat.subcategories.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.subcategories.map((sub, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-slate-50 px-2 py-0.5 text-xs text-slate-600 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {cat.productCount} Active Products
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="rounded p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                  title="Delete category"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Catalog Category"
        description="Create a new top-level product category with nested subcategories"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Save Category
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Icon Emoji
              </label>
              <input
                type="text"
                value={catIcon}
                onChange={e => setCatIcon(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white p-2 text-center text-lg dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                value={catName}
                onChange={e => setCatName(e.target.value)}
                placeholder="e.g. Gaming & Consoles"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subcategories (comma separated)
            </label>
            <textarea
              rows={3}
              value={catSubs}
              onChange={e => setCatSubs(e.target.value)}
              placeholder="e.g. PlayStation 5, Xbox Series X, Nintendo Switch, Gaming Controllers"
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
