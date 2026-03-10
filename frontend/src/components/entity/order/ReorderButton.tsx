import { useState, useEffect, useRef } from 'react';
import { useCart } from '../../../context/CartContext';

interface OrderItem {
  productId: number;
  name: string;
  price: number;
  imgName: string;
  quantity: number;
}

interface ReorderButtonProps {
  items: OrderItem[];
}

export default function ReorderButton({ items }: ReorderButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  const handleReorder = () => {
    for (const item of items) {
      addToCart(
        { productId: item.productId, name: item.name, price: item.price, imgName: item.imgName },
        item.quantity
      );
    }
    setAdded(true);
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleReorder}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
        added
          ? 'bg-green-500 text-white'
          : 'bg-primary hover:bg-accent text-white'
      }`}
    >
      {added ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Added to Cart
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reorder
        </>
      )}
    </button>
  );
}
