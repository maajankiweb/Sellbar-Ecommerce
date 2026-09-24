'use client';

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Copy,
  Trash2,
  Eye,
  Check,
  File,
  Grid,
  List
} from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { Modal } from '@/components/admin/ui/Modal';
import { useAdmin } from '@/context/AdminContext';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document';
  dimensions: string;
  size: string;
  uploadedAt: string;
}

export default function AdminMediaPage() {
  const { addToast } = useAdmin();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

  const [files, setFiles] = useState<MediaFile[]>([
    { id: 'm-1', name: 'iphone-15-pro-titanium.jpg', url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80', type: 'image', dimensions: '1600 × 1200 px', size: '342 KB', uploadedAt: 'Sep 24, 2026' },
    { id: 'm-2', name: 'sony-wh1000xm5-black.jpg', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', type: 'image', dimensions: '1920 × 1080 px', size: '512 KB', uploadedAt: 'Sep 22, 2026' },
    { id: 'm-3', name: 'macbook-air-m3-starlight.jpg', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80', type: 'image', dimensions: '2400 × 1600 px', size: '820 KB', uploadedAt: 'Sep 20, 2026' },
    { id: 'm-4', name: 'nike-air-max-pulse-roam.jpg', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', type: 'image', dimensions: '1200 × 1200 px', size: '280 KB', uploadedAt: 'Sep 18, 2026' },
    { id: 'm-5', name: 'selbar-heavyweight-hoodie.jpg', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80', type: 'image', dimensions: '1400 × 1400 px', size: '410 KB', uploadedAt: 'Sep 15, 2026' },
    { id: 'm-6', name: 'selbar-brand-guidelines-2026.pdf', url: 'https://selbar.com/assets/guidelines.pdf', type: 'document', dimensions: 'A4 Document', size: '2.4 MB', uploadedAt: 'Sep 10, 2026' },
  ]);

  const filteredFiles = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    addToast({ title: 'URL Copied', message: 'Asset link copied to clipboard', type: 'info' });
  };

  const handleDelete = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setSelectedFile(null);
    addToast({ title: 'File Deleted', message: 'Media asset permanently removed', type: 'success' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Digital Asset & Media Manager
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            High-resolution product photography, marketing artwork, and downloadable PDF warranty documents
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Upload className="h-4 w-4" />}
          onClick={() =>
            addToast({
              title: 'Upload Ready',
              message: 'Drag & drop high-res PNG, JPG or WebP images.',
              type: 'info',
            })
          }
        >
          Upload Assets
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search media files by name..."
            className="w-full rounded-lg border border-slate-300 bg-white py-1.5 pl-9 pr-3 text-xs dark:border-slate-700 dark:bg-slate-800"
          />
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800 text-xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded p-1.5 cursor-pointer ${
              viewMode === 'grid' ? 'bg-white shadow-xs text-blue-600 dark:bg-slate-700 dark:text-blue-400' : 'text-slate-500'
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`rounded p-1.5 cursor-pointer ${
              viewMode === 'list' ? 'bg-white shadow-xs text-blue-600 dark:bg-slate-700 dark:text-blue-400' : 'text-slate-500'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredFiles.map(file => (
            <div
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className="group relative cursor-pointer rounded-xl border border-slate-200/80 bg-white p-2 shadow-xs hover:border-blue-500 transition-all dark:border-slate-800 dark:bg-slate-900/90"
            >
              <div className="aspect-square rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                {file.type === 'image' ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <File className="h-10 w-10 text-slate-400" />
                )}
              </div>
              <div className="mt-2">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {file.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {file.size}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List Mode */
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-900">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredFiles.map(file => (
              <div
                key={file.id}
                onClick={() => setSelectedFile(file)}
                className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                    {file.type === 'image' ? (
                      <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
                    ) : (
                      <File className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      {file.name}
                    </span>
                    <span className="text-[11px] text-slate-400">{file.dimensions}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-500">
                  <span>{file.size}</span>
                  <span className="hidden sm:inline">{file.uploadedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Asset Preview Modal */}
      <Modal
        isOpen={Boolean(selectedFile)}
        onClose={() => setSelectedFile(null)}
        title="Asset Metadata Details"
        footer={
          <>
            <Button
              variant="danger"
              size="sm"
              onClick={() => selectedFile && handleDelete(selectedFile.id)}
            >
              Delete Asset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectedFile && handleCopyUrl(selectedFile.url)}
              leftIcon={<Copy className="h-3.5 w-3.5" />}
            >
              Copy Asset URL
            </Button>
          </>
        }
      >
        {selectedFile && (
          <div className="space-y-4">
            <div className="max-h-60 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center p-2">
              {selectedFile.type === 'image' ? (
                <img
                  src={selectedFile.url}
                  alt={selectedFile.name}
                  className="max-h-56 object-contain"
                />
              ) : (
                <File className="h-20 w-20 text-slate-400" />
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">File Name</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[240px]">
                  {selectedFile.name}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Dimensions</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {selectedFile.dimensions}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">File Size</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {selectedFile.size}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Uploaded On</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {selectedFile.uploadedAt}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
