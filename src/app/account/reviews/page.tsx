'use client';

import React, { useState, useEffect } from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import AccountHeader from '@/components/account/AccountHeader';
import { PageHeader, SectionCard, SectionHeader, Toast, EmptyState, RatingStars } from '@/components/account/ui';
import { accountService } from '@/lib/account/mockData';
import { Review, PendingReview } from '@/types/account';
import { Star, Edit3, Trash2, CheckCircle, ThumbsUp, Plus, Camera } from 'lucide-react';

function ReviewCard({ review, onEdit }: { review: Review; onEdit: (r: Review) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-sm transition">
      <div className="flex gap-4 p-5">
        <img
          src={review.productImage}
          alt={review.productName}
          className="h-16 w-16 rounded-xl object-cover bg-slate-100 border border-slate-100 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-400 truncate">{review.productName}</p>
          <div className="flex items-center gap-2 mt-1 mb-2">
            <RatingStars rating={review.rating} />
            {review.isVerified && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
                <CheckCircle className="h-3 w-3" />
                Verified Purchase
              </span>
            )}
          </div>
          <p className="font-semibold text-sm text-slate-900">{review.title}</p>
          <p className="text-sm text-slate-600 mt-1 line-clamp-3 leading-relaxed">{review.content}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition">
                <ThumbsUp className="h-3.5 w-3.5" />
                Helpful ({review.helpfulCount})
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(review)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center gap-1"
              >
                <Edit3 className="h-3 w-3" />
                Edit
              </button>
              <button className="px-2.5 py-1 rounded-lg border border-rose-200 text-xs font-semibold text-rose-500 hover:bg-rose-50 transition flex items-center gap-1">
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WriteReviewModal({ product, onClose, onSubmit }: {
  product: PendingReview;
  onClose: () => void;
  onSubmit: (review: { rating: number; title: string; content: string }) => void;
}) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    onSubmit({ rating, title, content });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 mb-5">
          <img src={product.productImage} alt={product.productName} className="h-14 w-14 rounded-xl object-cover border border-slate-100" />
          <div>
            <p className="font-semibold text-sm text-slate-900 line-clamp-2">{product.productName}</p>
            <p className="text-xs text-slate-400 mt-0.5">Order #{product.orderId}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Your Rating *</label>
            <div className="flex items-center gap-2">
              <RatingStars rating={rating} size="lg" interactive onChange={setRating} />
              {rating > 0 && (
                <span className="text-sm font-semibold text-slate-700">
                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                </span>
              )}
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Review Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Summarize your experience..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          {/* Review Content */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Detailed Review *</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Share what you liked, disliked, and who you'd recommend this to..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          {/* Photo Upload */}
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 text-sm hover:border-blue-400 hover:text-blue-600 transition w-full justify-center"
          >
            <Camera className="h-4 w-4" />
            Add Photos (Optional)
          </button>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!rating || !content}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ReviewsContent() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pending, setPending] = useState<PendingReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPending, setSelectedPending] = useState<PendingReview | null>(null);
  const [editReview, setEditReview] = useState<Review | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    Promise.all([accountService.getReviews(), accountService.getPendingReviews()]).then(([r, p]) => {
      setReviews(r);
      setPending(p);
      setLoading(false);
    });
  }, []);

  const handleSubmitReview = (data: { rating: number; title: string; content: string }) => {
    if (selectedPending) {
      const newReview: Review = {
        id: `rev_${Date.now()}`,
        productId: selectedPending.productId,
        productName: selectedPending.productName,
        productImage: selectedPending.productImage,
        orderId: selectedPending.orderId,
        rating: data.rating,
        title: data.title,
        content: data.content,
        createdAt: new Date().toISOString(),
        isVerified: true,
        helpfulCount: 0,
      };
      setReviews(prev => [newReview, ...prev]);
      setPending(prev => prev.filter(p => p.productId !== selectedPending.productId));
      setSelectedPending(null);
      setToast('Review submitted! Thank you for your feedback.');
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 max-w-3xl mx-auto w-full">
      <PageHeader title="My Reviews" description="Rate and review products you've purchased" />

      {/* Pending Reviews */}
      {pending.length > 0 && (
        <SectionCard className="mb-6">
          <SectionHeader title={`⭐ Rate These Products (${pending.length})`} />
          <div className="divide-y divide-slate-100">
            {pending.map(p => (
              <div key={p.productId} className="flex items-center gap-4 px-5 py-4">
                <img src={p.productImage} alt={p.productName} className="h-14 w-14 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 line-clamp-1">{p.productName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Order #{p.orderId}</p>
                </div>
                <button
                  onClick={() => setSelectedPending(p)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition flex items-center gap-1.5 shrink-0"
                >
                  <Star className="h-3.5 w-3.5" />
                  Rate
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Submitted Reviews */}
      <div>
        <h2 className="font-bold text-slate-900 mb-4">My Reviews ({reviews.length})</h2>
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            icon={<Star className="h-8 w-8" />}
            title="No reviews yet"
            description="Rate products you've purchased to help other buyers make better decisions."
          />
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} onEdit={setEditReview} />
            ))}
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      {selectedPending && (
        <WriteReviewModal
          product={selectedPending}
          onClose={() => setSelectedPending(null)}
          onSubmit={handleSubmitReview}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <AccountLayout>
      <AccountHeader />
      <ReviewsContent />
    </AccountLayout>
  );
}
