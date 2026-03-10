import { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';

interface ProductReview {
  reviewId: number;
  productId: number;
  userId?: number;
  displayName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  helpful: number;
}

type SortOption = 'recent' | 'highest' | 'helpful';

interface Props {
  productId: number;
}

const StarDisplay = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) => {
  const sizeClass = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={`${sizeClass} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const StarSelector = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Select star rating">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          className="focus:outline-none"
        >
          <svg
            className={`w-7 h-7 transition-colors ${
              star <= (hovered || value) ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default function ProductReviews({ productId }: Props) {
  const { darkMode } = useTheme();
  const queryClient = useQueryClient();
  const [sort, setSort] = useState<SortOption>('recent');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ displayName: '', rating: 0, title: '', body: '' });
  const [formError, setFormError] = useState('');

  const queryKey = ['reviews', productId, sort];

  const { data: reviews, isLoading } = useQuery<ProductReview[]>(queryKey, async () => {
    const { data } = await axios.get(
      `${api.baseURL}${api.endpoints.productReviews(productId)}?sort=${sort}`
    );
    return data;
  });

  const submitMutation = useMutation(
    async (newReview: Omit<ProductReview, 'reviewId' | 'productId' | 'createdAt' | 'helpful'>) => {
      const { data } = await axios.post(
        `${api.baseURL}${api.endpoints.productReviews(productId)}`,
        newReview
      );
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reviews', productId]);
        setForm({ displayName: '', rating: 0, title: '', body: '' });
        setShowForm(false);
        setFormError('');
      }
    }
  );

  const helpfulMutation = useMutation(
    async (reviewId: number) => {
      const { data } = await axios.post(
        `${api.baseURL}${api.endpoints.productReviews(productId)}/${reviewId}/helpful`
      );
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reviews', productId]);
      }
    }
  );

  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.displayName.trim()) return setFormError('Please enter your name.');
    if (form.rating < 1) return setFormError('Please select a star rating.');
    if (!form.title.trim()) return setFormError('Please enter a title.');
    if (!form.body.trim()) return setFormError('Please enter a review.');
    setFormError('');
    submitMutation.mutate(form);
  };

  const inputClass = `w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${
    darkMode
      ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
      : 'bg-white text-gray-800 border-gray-300 placeholder-gray-400'
  }`;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Customer Reviews
        </h3>
        {reviews && reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarDisplay rating={Math.round(averageRating)} size="sm" />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {averageRating.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Sort controls */}
      {reviews && reviews.length > 1 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {(['recent', 'highest', 'helpful'] as SortOption[]).map(option => (
            <button
              key={option}
              onClick={() => setSort(option)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                sort === option
                  ? 'bg-primary text-white'
                  : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {option === 'recent' ? 'Most Recent' : option === 'highest' ? 'Highest Rated' : 'Most Helpful'}
            </button>
          ))}
        </div>
      )}

      {/* Review list */}
      {isLoading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-4 mb-6">
          {reviews.map(review => (
            <div
              key={review.reviewId}
              className={`p-4 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <StarDisplay rating={review.rating} />
                  <p className={`font-semibold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {review.title}
                  </p>
                </div>
                <span className={`text-xs whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {review.body}
              </p>
              <div className="flex items-center justify-between">
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  — {review.displayName}
                </span>
                <button
                  onClick={() => helpfulMutation.mutate(review.reviewId)}
                  disabled={helpfulMutation.isLoading}
                  className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                    darkMode
                      ? 'text-gray-400 hover:text-primary'
                      : 'text-gray-500 hover:text-primary'
                  }`}
                  aria-label={`Mark review by ${review.displayName} as helpful`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  Helpful ({review.helpful})
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No reviews yet. Be the first to review this product!
        </p>
      )}

      {/* Write a review */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-2 px-4 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
        >
          Write a Review
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className={`p-4 rounded-lg border ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Write a Review
          </h4>
          {formError && (
            <p className="text-red-500 text-sm mb-3">{formError}</p>
          )}
          <div className="space-y-3">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Your Name
              </label>
              <input
                type="text"
                value={form.displayName}
                onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                placeholder="Display name"
                className={inputClass}
                maxLength={60}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Rating
              </label>
              <StarSelector value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Summarize your experience"
                className={inputClass}
                maxLength={100}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Review
              </label>
              <textarea
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                placeholder="Tell others about your experience with this product"
                className={`${inputClass} resize-none`}
                rows={4}
                maxLength={1000}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={submitMutation.isLoading}
              className="flex-1 py-2 bg-primary hover:bg-accent text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {submitMutation.isLoading ? 'Submitting…' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setFormError(''); }}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors border ${
                darkMode
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-600'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
