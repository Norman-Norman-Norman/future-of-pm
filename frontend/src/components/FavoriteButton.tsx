import { useWishlist } from '../context/WishlistContext';

interface FavoriteButtonProps {
  productId: number;
  productName: string;
}

export default function FavoriteButton({ productId, productName }: FavoriteButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const favorited = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorited) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label={favorited ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
      className="p-1 rounded-full transition-colors focus:outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 transition-colors duration-200 ${favorited ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-400'}`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={favorited ? 0 : 2}
        fill={favorited ? 'currentColor' : 'none'}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
