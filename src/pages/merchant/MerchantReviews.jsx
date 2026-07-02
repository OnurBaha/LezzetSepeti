import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantReviews, replyToReview } from '../../store/slices/reviewSlice';
import MerchantLayout from './MerchantLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StarRating from '../../components/common/StarRating';
import { MessageSquare, Send } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

const MerchantReviews = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items: reviews, status } = useSelector((s) => s.review);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    if (user?.restaurantId) dispatch(fetchRestaurantReviews(user.restaurantId));
  }, [user?.restaurantId, dispatch]);

  const avg = (key) => {
    if (!reviews.length) return 0;
    return (reviews.reduce((s, r) => s + r.ratings[key], 0) / reviews.length).toFixed(1);
  };

  const handleReply = (reviewId) => {
    const text = replyText[reviewId]?.trim();
    if (!text) return;
    dispatch(replyToReview({ reviewId, replyText: text }));
    setReplyText((prev) => ({ ...prev, [reviewId]: '' }));
  };

  return (
    <MerchantLayout>
      <h1 className="text-2xl font-bold text-textColor-light dark:text-textColor-dark mb-6">Müşteri Yorumları</h1>

      {/* Score Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: '🚀 Hız',    val: avg('speed') },
          { label: '💁 Servis', val: avg('service') },
          { label: '😋 Lezzet', val: avg('flavor') },
        ].map((s) => (
          <div key={s.label} className="card p-5 text-center">
            <p className="text-xs text-gray-400 mb-2">{s.label}</p>
            <p className="text-3xl font-bold text-primary mb-2">{s.val}</p>
            <StarRating rating={Number(s.val)} size="xs" showNumber={false} />
          </div>
        ))}
      </div>

      {status === 'loading' && <LoadingSpinner />}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="card p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center text-white font-bold text-sm">M</div>
                <div>
                  <p className="font-semibold text-sm text-textColor-light dark:text-textColor-dark">Müşteri</p>
                  <p className="text-xs text-gray-400">{formatDate(rev.createdAt)}</p>
                </div>
              </div>
              <StarRating rating={rev.averageRating} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{rev.comment}</p>
            <div className="flex gap-3 text-xs text-gray-400 mb-4">
              <span>Hız ⭐{rev.ratings.speed}</span>
              <span>Servis ⭐{rev.ratings.service}</span>
              <span>Lezzet ⭐{rev.ratings.flavor}</span>
            </div>

            {rev.merchantReply ? (
              <div className="pl-4 border-l-2 border-primary/30 bg-primary/5 rounded-r-xl py-2 pr-3">
                <p className="text-xs font-semibold text-primary mb-1">Yanıtınız:</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">{rev.merchantReply}</p>
              </div>
            ) : (
              <div className="flex gap-2 pt-3 border-t border-gray-50 dark:border-gray-800">
                <div className="relative flex-1">
                  <MessageSquare size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Bu yoruma yanıt yazın..."
                    className="input pl-9 text-sm py-2"
                    value={replyText[rev.id] || ''}
                    onChange={(e) => setReplyText((prev) => ({ ...prev, [rev.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handleReply(rev.id)}
                  />
                </div>
                <button onClick={() => handleReply(rev.id)} className="btn-primary px-3 py-2">
                  <Send size={15} />
                </button>
              </div>
            )}
          </div>
        ))}
        {reviews.length === 0 && status !== 'loading' && (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-gray-400">Henüz yorum yok</p>
          </div>
        )}
      </div>
    </MerchantLayout>
  );
};

export default MerchantReviews;
