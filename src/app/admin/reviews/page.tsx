'use client';

import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Trash2,
  Check,
  ShieldCheck
} from 'lucide-react';
import { DataTable, Column } from '@/components/admin/ui/DataTable';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import { Modal } from '@/components/admin/ui/Modal';
import { adminService } from '@/services/adminService';
import { ReviewItem } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';

export default function AdminReviewsPage() {
  const { addToast } = useAdmin();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyingReview, setReplyingReview] = useState<ReviewItem | null>(null);
  const [replyText, setReplyText] = useState('');

  const fetchReviews = async () => {
    setIsLoading(true);
    const data = await adminService.getReviews();
    setReviews(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    await adminService.moderateReview(id, status);
    addToast({
      title: 'Review Moderated',
      message: `Marked review as ${status}.`,
      type: status === 'approved' ? 'success' : 'info',
    });
    fetchReviews();
  };

  const handleSendReply = () => {
    if (!replyingReview || !replyText.trim()) return;
    setReviews(prev =>
      prev.map(r => (r.id === replyingReview.id ? { ...r, reply: replyText } : r))
    );
    addToast({ title: 'Reply Published', message: 'Merchant reply published on product page.', type: 'success' });
    setReplyingReview(null);
    setReplyText('');
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const columns: Column<ReviewItem>[] = [
    {
      key: 'productName',
      header: 'Product',
      sortable: true,
      render: r => (
        <div className="flex items-center gap-2.5 min-w-[200px]">
          <img
            src={r.productImage}
            alt={r.productName}
            className="h-9 w-9 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
          />
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">
            {r.productName}
          </span>
        </div>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: r => (
        <div className="flex items-center gap-2">
          <img
            src={r.customerAvatar}
            alt={r.customerName}
            className="h-7 w-7 rounded-full object-cover shrink-0"
          />
          <div>
            <div className="font-medium text-slate-900 dark:text-white text-xs">
              {r.customerName}
            </div>
            {r.verifiedPurchase && (
              <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-medium">
                <ShieldCheck className="h-3 w-3" /> Verified Buyer
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      render: r => (
        <div>
          {renderStars(r.rating)}
          <span className="text-[11px] text-slate-400">{r.createdAt}</span>
        </div>
      ),
    },
    {
      key: 'reviewBody',
      header: 'Review Content',
      render: r => (
        <div className="max-w-md text-xs">
          <div className="font-bold text-slate-800 dark:text-slate-200">
            {r.reviewTitle}
          </div>
          <p className="text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">
            {r.reviewBody}
          </p>
          {r.reply && (
            <div className="mt-1.5 rounded bg-blue-50/70 p-2 text-[11px] text-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
              <strong>Merchant Reply:</strong> {r.reply}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: r => (
        <Badge
          variant={
            r.status === 'approved'
              ? 'success'
              : r.status === 'pending'
              ? 'warning'
              : 'danger'
          }
          size="sm"
        >
          {r.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Moderation',
      className: 'text-right',
      render: r => (
        <div className="flex items-center justify-end gap-1">
          {r.status !== 'approved' && (
            <button
              onClick={() => handleModerate(r.id, 'approved')}
              className="rounded p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
              title="Approve Review"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          {r.status !== 'rejected' && (
            <button
              onClick={() => handleModerate(r.id, 'rejected')}
              className="rounded p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
              title="Reject Review"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => {
              setReplyingReview(r);
              setReplyText(r.reply || '');
            }}
            className="rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
            title="Public Reply"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Product Review Moderation
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Moderate customer feedback, verify purchases, and publish official merchant responses
        </p>
      </div>

      <DataTable
        columns={columns}
        data={reviews}
        keyField="id"
        searchPlaceholder="Search reviews by product name or buyer..."
        exportFilename="selbar_product_reviews"
      />

      {/* Reply Modal */}
      <Modal
        isOpen={Boolean(replyingReview)}
        onClose={() => setReplyingReview(null)}
        title="Public Merchant Response"
        description={`Replying to ${replyingReview?.customerName}'s review on ${replyingReview?.productName}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setReplyingReview(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSendReply}>
              Publish Response
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
            &quot;{replyingReview?.reviewBody}&quot;
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Store Response
            </label>
            <textarea
              rows={4}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Thank you for your feedback! We are thrilled you enjoy the performance..."
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
