import { useId } from 'react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ rating, reviewCount, size = 'md' }: StarRatingProps) {
  const uid = useId();
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const halfFilled = !filled && rating >= star - 0.5;
        const gradientId = `half-${uid}-${star}`;
        return (
          <svg
            key={star}
            className={`${sizeClass} ${filled || halfFilled ? 'text-yellow-400' : 'text-gray-300'}`}
            fill={filled ? 'currentColor' : halfFilled ? `url(#${gradientId})` : 'none'}
            stroke="currentColor"
            strokeWidth={filled || halfFilled ? '0' : '1.5'}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {halfFilled && (
              <defs>
                <linearGradient id={gradientId}>
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        );
      })}
      {reviewCount !== undefined && (
        <span className="text-sm text-gray-500 ml-1" aria-label={`${reviewCount} reviews`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
