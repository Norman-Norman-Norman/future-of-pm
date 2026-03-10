import axios from 'axios';
import { useQuery } from 'react-query';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';
import { useCart } from '../../../context/CartContext';

interface FrequentProduct {
  productId: number;
  name: string;
  price: number;
  imgName: string;
  discount?: number;
  totalOrdered: number;
}

const fetchFrequentProducts = async (branchId: number): Promise<FrequentProduct[]> => {
  const { data } = await axios.get(
    `${api.baseURL}${api.endpoints.frequentProducts}?branchId=${branchId}`
  );
  return data;
};

interface FrequentItemsProps {
  branchId: number;
}

export default function FrequentItems({ branchId }: FrequentItemsProps) {
  const { darkMode } = useTheme();
  const { addToCart } = useCart();

  const { data: products, isLoading, error } = useQuery(
    ['frequentProducts', branchId],
    () => fetchFrequentProducts(branchId)
  );

  const handleAddToCart = (product: FrequentProduct) => {
    const effectivePrice = product.discount
      ? product.price * (1 - product.discount)
      : product.price;
    addToCart(
      { productId: product.productId, name: product.name, price: effectivePrice, imgName: product.imgName },
      1
    );
  };

  return (
    <div className={`rounded-lg border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-primary/30 bg-white'} overflow-hidden`}>
      <div className={`px-5 py-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
          Frequently Ordered
        </h2>
        <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your top products</p>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {!!error && (
        <p className="text-red-500 text-sm text-center py-6">Failed to load frequent items</p>
      )}

      {!isLoading && !error && products?.length === 0 && (
        <p className={`text-sm text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No order history yet
        </p>
      )}

      {!isLoading && !error && products && products.length > 0 && (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {products.map((product) => {
            const effectivePrice = product.discount
              ? product.price * (1 - product.discount)
              : product.price;
            return (
              <li key={product.productId} className={`flex items-center gap-3 px-4 py-3 ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                <div className={`w-10 h-10 flex-shrink-0 rounded-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <img
                    src={`/${product.imgName}`}
                    alt={product.name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${darkMode ? 'text-light' : 'text-gray-800'}`}>{product.name}</p>
                  <p className="text-xs text-primary font-semibold">${effectivePrice.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-shrink-0 bg-primary hover:bg-accent text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  aria-label={`Add ${product.name} to cart`}
                >
                  + Cart
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
