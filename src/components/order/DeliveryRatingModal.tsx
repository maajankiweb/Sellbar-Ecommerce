'use client';

import React, { useState } from 'react';
import {
  Star,
  X,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react';

interface DeliveryRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  courierName?: string;
  onSuccess?: (rating: number, feedback: string) => void;
}

const RATING_TAGS = [
  '⚡ On-Time Arrival',
  '📦 Tamper-Proof Box',
  '🤝 Polite & Professional',
  '🛡️ Clean & Masked',
  '📱 Swift Handover',
  '🔍 Open-Box Verified',
];

export default function DeliveryRatingModal({
  isOpen,
  onClose,
  orderId,
  courierName = 'Delivery Partner',
  onSuccess,
}: DeliveryRatingModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    '⚡ On-Time Arrival',
    '📦 Tamper-Proof Box',
  ]);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/v1/orders/buy/${orderId}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          tags: selectedTags,
          comment,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        if (onSuccess) onSuccess(rating, comment);
        setTimeout(() => {
          onClose();
        }, 1800);
      }
    } catch (err) {
      console.error('Failed to submit rating:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 1:
        return 'Needs Significant Improvement';
      case 2:
        return 'Fair Experience';
      case 3:
        return 'Good Delivery';
      case 4:
        return 'Very Good & Courteous';
      case 5:
        return 'Exceptional Doorstep Experience! ⭐';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-500/30">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black">How was your Delivery?</h3>
              <p className="text-xs text-slate-400">
                Order <strong className="text-slate-200">#{orderId}</strong> was delivered by {courierName}
              </p>
            </div>

            {/* Interactive Stars */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-9 h-9 transition-colors ${
                          active
                            ? 'text-amber-400 fill-amber-400 filter drop-shadow'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-amber-300 h-4">
                {getRatingLabel(hoverRating || rating)}
              </span>
            </div>

            {/* Compliment Tags */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                What went well?
              </label>
              <div className="flex flex-wrap gap-2">
                {RATING_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition ${
                        isSelected
                          ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-sm'
                          : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Comment */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Additional Comments (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share any special notes about the delivery or open-box experience..."
                rows={3}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
            >
              {submitting ? 'Submitting Feedback...' : 'Submit Delivery Rating'}
            </button>
          </div>
        ) : (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-white">Thank You for Your Feedback!</h4>
            <p className="text-xs text-slate-400">
              Your review helps us maintain 100% verified doorstep excellence.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
