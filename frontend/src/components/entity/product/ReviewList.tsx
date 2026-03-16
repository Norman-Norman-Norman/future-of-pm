import StarRating from './StarRating';
import { useTheme } from '../../../context/ThemeContext';

interface Review {
  reviewId: number;
  productId: number;
  rating: number;
  title: string;
  body: string;
  authorName: string;
  createdAt: string;
  helpful: number;
}

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  const { darkMode } = useTheme();

  if (reviews.length === 0) {
    return (
      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
        No reviews yet. Be the first to review this product!
      </p>
    );
  }

  return (
    <ul className="space-y-6" aria-label="Customer reviews">
      {reviews.map((review) => (
        <li
          key={review.reviewId}
          className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-5`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <StarRating rating={review.rating} size="sm" />
                <h4 className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  {review.title}
                </h4>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                By <span className="font-medium">{review.authorName}</span>
                {' · '}
                <time dateTime={review.createdAt}>
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </p>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{review.body}</p>
            </div>
          </div>
          {review.helpful > 0 && (
            <p className={`mt-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {review.helpful} {review.helpful === 1 ? 'person' : 'people'} found this helpful
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
