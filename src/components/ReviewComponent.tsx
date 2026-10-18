import React, { useState, useEffect } from 'react';
import { ProductReview } from '../types/furniture';
import { storageService } from '../services/storageService';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  LogIn,
  MessageSquare,
  ShieldCheck,
  Send,
  Sparkles,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReviewComponentProps {
  productId: string;
  productName: string;
  currentUser: any;
  onRequireLogin: () => void;
}

export const ReviewComponent: React.FC<ReviewComponentProps> = ({
  productId,
  productName,
  currentUser,
  onRequireLogin,
}) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [woodPurchased, setWoodPurchased] = useState('Sheesham Wood (Indian Rosewood)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filter
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    storageService.getReviews(productId).then((data) => {
      if (isMounted) {
        setReviews(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [productId]);

  // Aggregate stats
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  const filteredReviews = reviews.filter((r) => {
    if (filterRating === 'all') return true;
    return r.rating === filterRating;
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireLogin();
      return;
    }
    if (!comment.trim()) return;

    setIsSubmitting(true);

    const newReview: ProductReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId,
      userId: currentUser.uid,
      userName: currentUser.displayName || 'Verified Customer',
      userPhoto: currentUser.photoURL || undefined,
      rating,
      title: title.trim() || undefined,
      comment: comment.trim(),
      woodTypePurchased: woodPurchased,
      verifiedBuyer: true,
      createdAt: 'Just now',
      helpfulCount: 0,
    };

    const updated = await storageService.addReview(newReview);
    setReviews(updated);
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setTitle('');
    setComment('');

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });

    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  const handleMarkHelpful = (reviewId: string) => {
    const updated = storageService.markReviewHelpful(productId, reviewId);
    setReviews(updated);
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5:
        return '5 Stars - Exceptional Heirloom Craftsmanship';
      case 4:
        return '4 Stars - Great Solid Timber Quality';
      case 3:
        return '3 Stars - Average / Met Expectations';
      case 2:
        return '2 Stars - Below Expectations';
      case 1:
        return '1 Star - Poor Experience';
      default:
        return '';
    }
  };

  return (
    <div className="pt-8 border-t border-stone-200 space-y-6">
      {/* Header and Rating Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-[#b98144]">
              Customer Experiences
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              100% Genuine Handcrafted Pieces
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#301a11]">
            Ratings & Artisan Reviews
          </h3>
          <p className="text-xs text-stone-500">
            Real customer feedback for {productName} from homes across India.
          </p>
        </div>

        {/* Big Rating Summary */}
        <div className="flex items-center gap-3 bg-[#faf7f2] p-3 rounded-2xl border border-[#cb9f6a]/60">
          <div className="text-center">
            <span className="text-3xl font-serif font-black text-[#7e4b2c] leading-none block">
              {avgRating}
            </span>
            <div className="flex items-center justify-center gap-0.5 text-amber-500 my-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-500' : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-stone-500 block font-medium">
              Based on {totalReviews} reviews
            </span>
          </div>

          {/* Rating Distribution Bars */}
          <div className="hidden sm:flex flex-col gap-1 w-36 border-l border-stone-200/80 pl-3">
            {distribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-1.5 text-[10px] text-stone-600">
                <span className="w-3 font-mono">{d.stars}★</span>
                <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${d.percentage}%` }}
                  />
                </div>
                <span className="w-4 text-right font-mono text-[9px] text-stone-400">
                  {d.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write a Review Section */}
      <div className="bg-[#fcfaf7] p-5 rounded-2xl border border-[#dec099]/80 shadow-xs">
        {currentUser ? (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2.5">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-8 h-8 rounded-full object-cover border border-stone-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#7e4b2c] text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                  </div>
                )}
                <div>
                  <span className="text-xs font-bold text-stone-900 block">
                    Reviewing as: {currentUser.displayName || 'Valued Customer'}
                  </span>
                  <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified Authenticated Buyer
                  </span>
                </div>
              </div>

              {/* Star Rating Selector */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-stone-500 mr-2 hidden sm:inline">Your Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 cursor-pointer"
                    title={`Rate ${star} Stars`}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] font-semibold text-[#b98144] -mt-1">
              {getRatingLabel(hoverRating || rating)}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Review Headline / Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Stunning Sheesham wood grain and sturdy bed frame!"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Wood Species / Finish Ordered
                </label>
                <select
                  value={woodPurchased}
                  onChange={(e) => setWoodPurchased(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c] bg-white"
                >
                  <option value="Sheesham Wood (Indian Rosewood)">Sheesham Wood (Indian Rosewood)</option>
                  <option value="CP Teak Wood (Sagwan)">CP Teak Wood (Sagwan)</option>
                  <option value="Mango Wood">Mango Wood</option>
                  <option value="Rosewood (Shisham Special)">Rosewood Special</option>
                  <option value="Custom Modified Finish">Custom Modified Finish</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Your Detailed Feedback & Craftsmanship Review *
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on the timber weight, grain texture, joinery, delivery, and in-room assembly..."
                className="w-full p-3 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c] bg-white"
              />
            </div>

            {submitSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Thank you! Your verified review has been posted to Satkkabir Furniture Udhyog.</span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                className="px-6 py-2.5 rounded-xl bg-[#7e4b2c] hover:bg-[#683d28] disabled:opacity-50 text-white font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Posting Review...' : 'Post Verified Review'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Logged-Out Prompt */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f5ede1] border border-[#cb9f6a] flex items-center justify-center text-[#7e4b2c] shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#301a11]">
                  Have you experienced this furniture piece?
                </h4>
                <p className="text-xs text-stone-500">
                  Sign in with your Google account to post your rating, timber inspection notes, and feedback.
                </p>
              </div>
            </div>

            <button
              onClick={onRequireLogin}
              className="px-5 py-2.5 rounded-xl bg-[#7e4b2c] hover:bg-[#683d28] text-white text-xs font-bold transition flex items-center gap-2 shadow-xs shrink-0 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In with Google to Review</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wide">
            Verified Customer Reviews ({filteredReviews.length})
          </span>

          {/* Star Filter Pill Bar */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] text-stone-400 hidden sm:inline">Filter:</span>
            <button
              onClick={() => setFilterRating('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                filterRating === 'all'
                  ? 'bg-[#7e4b2c] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All ({reviews.length})
            </button>
            <button
              onClick={() => setFilterRating(5)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                filterRating === 5
                  ? 'bg-[#7e4b2c] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              5★ ({reviews.filter((r) => r.rating === 5).length})
            </button>
            <button
              onClick={() => setFilterRating(4)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                filterRating === 4
                  ? 'bg-[#7e4b2c] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              4★ ({reviews.filter((r) => r.rating === 4).length})
            </button>
          </div>
        </div>

        {/* Reviews Cards List */}
        {isLoading ? (
          <div className="text-center py-8 text-xs text-stone-400">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-8 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-xs text-stone-500">
            No reviews yet for this filter. Be the first to share your experience!
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-2.5 transition hover:border-[#cb9f6a]"
              >
                {/* Author row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {rev.userPhoto ? (
                      <img
                        src={rev.userPhoto}
                        alt={rev.userName}
                        className="w-9 h-9 rounded-full object-cover border border-stone-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#f5ede1] text-[#7e4b2c] border border-[#cb9f6a] flex items-center justify-center font-bold text-xs">
                        {rev.userName[0]}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">{rev.userName}</span>
                        {rev.verifiedBuyer && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400">{rev.createdAt}</span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-amber-400 text-amber-500' : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Title & Wood Specs Tag */}
                <div className="flex flex-wrap items-center gap-2">
                  {rev.title && (
                    <h5 className="font-serif font-bold text-xs sm:text-sm text-stone-900">
                      {rev.title}
                    </h5>
                  )}
                  {rev.woodTypePurchased && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#f5ede1] text-[#7e4b2c] font-medium border border-[#dec099]/60">
                      Wood: {rev.woodTypePurchased.split('(')[0]}
                    </span>
                  )}
                </div>

                {/* Comment */}
                <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>

                {/* Footer action: Helpful Button */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Satkkabir 10-Year Warranty Protected</span>
                  </span>

                  <button
                    onClick={() => handleMarkHelpful(rev.id)}
                    className="flex items-center gap-1 text-stone-500 hover:text-[#7e4b2c] transition p-1 rounded hover:bg-stone-50 cursor-pointer"
                    title="Mark review as helpful"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful ({rev.helpfulCount || 0})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
