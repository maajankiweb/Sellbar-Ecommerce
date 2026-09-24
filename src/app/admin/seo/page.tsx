'use client';

import React, { useState } from 'react';
import {
  Globe,
  FileCode,
  Link2,
  CheckCircle2,
  Save,
  Search,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { useAdmin } from '@/context/AdminContext';

export default function AdminSEOPage() {
  const { addToast } = useAdmin();

  const [siteTitle, setSiteTitle] = useState('SELBAR | India\'s Premier Re-Commerce & Electronics Hub');
  const [siteDesc, setSiteDesc] = useState('Buy new & certified refurbished smartphones, laptops, audio wearables and sneakers with 1-year warranty and express delivery across India.');
  const [robotsTxt, setRobotsTxt] = useState(
`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /account/
Disallow: /checkout/

Sitemap: https://selbar.com/sitemap.xml`
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast({
        title: 'SEO Settings Updated',
        message: 'Robots.txt and global OpenGraph tags regenerated.',
        type: 'success',
      });
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            SEO & Metadata Configuration
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Control search engine crawler indexing, OpenGraph preview cards, sitemaps, and redirects
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          isLoading={isSaving}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save SEO Config
        </Button>
      </div>

      <div className="space-y-6">
        {/* Global Metadata */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Storefront Meta Tags
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Default Site Title
            </label>
            <input
              type="text"
              value={siteTitle}
              onChange={e => setSiteTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Default Meta Description
            </label>
            <textarea
              rows={3}
              value={siteDesc}
              onChange={e => setSiteDesc(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Robots.txt Editor */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Robots.txt Directives
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              /public/robots.txt
            </span>
          </div>
          <textarea
            rows={8}
            value={robotsTxt}
            onChange={e => setRobotsTxt(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-slate-950 p-3 font-mono text-xs text-emerald-400 dark:border-slate-700"
          />
        </div>

        {/* Live Sitemap Status */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Dynamic XML Sitemap
              </h4>
              <p className="text-xs text-slate-400">
                142 product URLs and 18 category routes auto-indexed
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/sitemap.xml', '_blank')}
          >
            Inspect XML
          </Button>
        </div>
      </div>
    </div>
  );
}
