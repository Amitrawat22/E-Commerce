import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice';
import { Star, MessageSquare, MapPin, Send, Check } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ProductReviews({ productId, onReviewAdded }) {
  const user = useSelector(selectUser);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = () => {
    if (!productId) return;
    setLoading(true);
    axios.get(`/api/public/products/${productId}/reviews`)
      .then(res => setReviews(res.data))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please log in to submit a review'); return; }
    if (!title.trim() || !comment.trim()) { toast.error('Please fill out review title and comment'); return; }

    setSubmitting(true);
    try {
      await axios.post(`/api/products/${productId}/reviews`, {
        rating,
        title,
        comment,
        userLocation: location.trim() || 'Verified Buyer',
      });

      toast.success('Review submitted! AI is re-analyzing product insights...');
      setTitle('');
      setComment('');
      setLocation('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      fetchReviews();

      // Trigger AI Reality Check refresh
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div style={{ marginTop: 36, paddingTop: 32, borderTop: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MessageSquare size={20} className="text-primary" /> Customer Reviews & Ratings
          </h2>
          {reviews.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <div style={{ display: 'flex', color: '#f59e0b' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={16} fill={star <= Math.round(avgRating) ? '#f59e0b' : 'none'} />
                ))}
              </div>
              <span style={{ fontWeight: 700, fontSize: 16 }}>{avgRating} out of 5</span>
              <span className="text-sm text-muted">({reviews.length} customer reviews)</span>
            </div>
          ) : (
            <div className="text-sm text-muted" style={{ marginTop: 4 }}>No customer reviews yet. Be the first to review!</div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: user ? '1fr 380px' : '1fr', gap: 32, alignItems: 'start' }}>
        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {loading ? (
            <div className="loading-spinner"><div className="spinner"></div></div>
          ) : reviews.length === 0 ? (
            <div className="empty-state" style={{ padding: 32, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
              <div className="empty-state-title">No reviews for this product yet</div>
              <div className="empty-state-text">Submit your feedback below and Google Gemini AI will synthesize your review live!</div>
            </div>
          ) : (
            reviews.map(rev => (
              <div key={rev.reviewId} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ display: 'flex', color: '#f59e0b', marginBottom: 4 }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} size={14} fill={star <= rev.rating ? '#f59e0b' : 'none'} />
                      ))}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{rev.title}</div>
                  </div>
                  <span className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} /> {rev.userLocation}
                  </span>
                </div>
                <p className="text-sm text-secondary" style={{ lineHeight: 1.5, marginBottom: 8 }}>{rev.comment}</p>
                <div className="text-xs text-muted" style={{ display: 'flex', gap: 8 }}>
                  <span>By <strong>{rev.username}</strong></span>
                  <span>•</span>
                  <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Submit Review Form */}
        {user && (
          <div className="card" style={{ background: 'var(--color-surface)', position: 'sticky', top: 88 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Write a Customer Review</h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Star Selector */}
              <div className="form-group">
                <label className="form-label">Rating</label>
                <div style={{ display: 'flex', gap: 6, cursor: 'pointer' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      style={{ background: 'none', color: star <= rating ? '#f59e0b' : 'var(--color-text-muted)' }}
                    >
                      <Star size={24} fill={star <= rating ? '#f59e0b' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Review Headline</label>
                <input
                  className="form-input"
                  placeholder="e.g. Amazing build quality, great in humid weather"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Location / Region</label>
                <input
                  className="form-input"
                  placeholder="e.g. Mumbai (Humid), Delhi (Winter), Seattle"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Review</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Share your experience with fit, climate durability, and performance..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : submitted ? <><Check size={16} /> Submitted!</> : <><Send size={16} /> Submit Review</>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
