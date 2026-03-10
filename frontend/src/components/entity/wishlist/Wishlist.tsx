import axios from 'axios';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { api } from '../../../api/config';
import { useWishlist } from '../../../context/WishlistContext';
import { useCart } from '../../../context/CartContext';
import { useTheme } from '../../../context/ThemeContext';
import FavoriteButton from '../../FavoriteButton';

interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  imgName: string;
  sku: string;
  unit: string;
  supplierId: number;
  discount?: number;
}

const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.products}`);
  return data;
};

export default function Wishlist() {
  const { wishlist } = useWishlist();
  const { addToCart } = useCart();
  const { darkMode } = useTheme();
  const { data: products, isLoading, error } = useQuery('products', fetchProducts);

  const wishlistProducts = products?.filter(p => wishlist.includes(p.productId)) ?? [];

  const handleAddToCart = (product: Product) => {
    const effectivePrice = product.discount
      ? product.price * (1 - product.discount)
      : product.price;
    addToCart(
      { productId: product.productId, name: product.name, price: effectivePrice, imgName: product.imgName },
      1
    );
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 text-center">Failed to fetch products</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
            My Wishlist
          </h1>

          {wishlistProducts.length === 0 ? (
            <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <p className="text-xl mb-4">Your wishlist is empty</p>
              <Link
                to="/products"
                className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistProducts.map(product => (
                <div
                  key={product.productId}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(118,184,82,0.3)] flex flex-col`}
                >
                  <div
                    className={`relative h-56 ${darkMode ? 'bg-gradient-to-t from-gray-700 to-gray-800' : 'bg-gradient-to-t from-gray-100 to-white'} transition-colors duration-300`}
                  >
                    <img
                      src={`/${product.imgName}`}
                      alt={product.name}
                      className="w-full h-full object-contain p-2"
                    />
                    {product.discount && (
                      <div className="absolute top-8 left-0 bg-primary text-white px-3 py-1 -rotate-90 transform -translate-x-5 shadow-md">
                        {Math.round(product.discount * 100)}% OFF
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <FavoriteButton productId={product.productId} productName={product.name} />
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2 transition-colors duration-300`}>
                      {product.name}
                    </h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 flex-grow transition-colors duration-300`}>
                      {product.description}
                    </p>
                    <div className="space-y-4 mt-auto">
                      <div className="flex justify-between items-center">
                        {product.discount ? (
                          <div>
                            <span className="text-gray-500 line-through text-sm mr-2">${product.price.toFixed(2)}</span>
                            <span className="text-primary text-xl font-bold">${(product.price * (1 - product.discount)).toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="text-primary text-xl font-bold">${product.price.toFixed(2)}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg transition-colors"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
