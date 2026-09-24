'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';
import { Modal } from '@/components/admin/ui/Modal';
import { useAdmin } from '@/context/AdminContext';

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  link: string;
  image: string;
  status: 'active' | 'scheduled';
}

export default function AdminContentPage() {
  const { addToast } = useAdmin();
  const [banners, setBanners] = useState<BannerItem[]>([
    {
      id: 'b-1',
      title: 'Diwali Festive Electronics Carnival',
      subtitle: 'Up to 40% OFF on certified refurbished iPhones & MacBooks',
      link: '/buy/smartphones',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&auto=format&fit=crop&q=80',
      status: 'active',
    },
    {
      id: 'b-2',
      title: 'Sell Your Used Phone for Instant Cash',
      subtitle: 'Free doorstep pickup & instant bank transfer within 2 hours',
      link: '/sell',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop&q=80',
      status: 'active',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newImage, setNewImage] = useState('');

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const b: BannerItem = {
      id: `b-${Date.now()}`,
      title: newTitle,
      subtitle: newSubtitle,
      link: newLink || '/buy',
      image: newImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
      status: 'active',
    };
    setBanners(prev => [...prev, b]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewSubtitle('');
    addToast({ title: 'Banner Added', message: 'Homepage banner published.', type: 'success' });
  };

  const handleDelete = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    addToast({ title: 'Banner Deleted', message: 'Hero banner removed.', type: 'info' });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Content & Storefront CMS
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Customize homepage hero carousels, marketing banners, and promotional landing modules
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Hero Banner
        </Button>
      </div>

      <div className="space-y-4">
        {banners.map(b => (
          <div
            key={b.id}
            className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col md:flex-row"
          >
            <div className="md:w-72 h-44 shrink-0 bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
              <img
                src={b.image}
                alt={b.title}
                className="h-full w-full object-cover"
              />
              <span className="absolute top-2 left-2">
                <Badge variant="success" size="sm" dot>
                  {b.status}
                </Badge>
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {b.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {b.subtitle}
                </p>
                <div className="mt-3 text-xs font-mono text-blue-600 dark:text-blue-400">
                  Target Route: {b.link}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(b.id)}
                  className="text-rose-600"
                >
                  Delete Banner
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Banner Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Homepage Hero Banner"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Publish Banner
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Banner Headline *
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. Mega Smartphone Carnival"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={newSubtitle}
              onChange={e => setNewSubtitle(e.target.value)}
              placeholder="e.g. Extra ₹3,000 off on exchange"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={newImage}
              onChange={e => setNewImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Destination URL
            </label>
            <input
              type="text"
              value={newLink}
              onChange={e => setNewLink(e.target.value)}
              placeholder="/buy/smartphones"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
