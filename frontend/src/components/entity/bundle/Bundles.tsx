import { useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';
import { useCart } from '../../../context/CartContext';
import type { ProductBundle } from '../../../types/bundle';

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

const fetchBundles = async (): Promise<ProductBundle[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.bundles}`);
  return data;
};

const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.products}`);
  return data;
};

function calculateBundleTotal(bundle: ProductBundle, products: Product[]): number {
  return bundle.products.reduce((total, bp) => {
    const product = products.find(p => p.productId === bp.productId);
    if (!product) return total;
    return total + product.price * bp.quantity;
  }, 0);
}

export default function Bundles() {
  const [selectedBundle, setSelectedBundle] = useState<ProductBundle | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { darkMode } = useTheme();
  const { addToCart } = useCart();

  const { data: bundles, isLoading: bundlesLoading, error: bundlesError } = useQuery('bundles', fetchBundles);
  const { data: products, isLoading: productsLoading } = useQuery('products', fetchProducts);

  const isLoading = bundlesLoading || productsLoading;

  const handleAddBundleToCart = (bundle: ProductBundle) => {
    if (!products) return;
    bundle.products.forEach(bp => {
      const product = products.find(p => p.productId === bp.productId);
      if (!product) return;
      const discountedPrice = product.price * (1 - bundle.discountPercentage / 100);
      addToCart(
        { productId: product.productId, name: product.name, price: discountedPrice, imgName: product.imgName },
        bp.quantity
      );
    });
  };

  const handleBundleClick = (bundle: ProductBundle) => {
    setSelectedBundle(bundle);
    setShowModal(true);
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

  if (bundlesError) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 text-center">Failed to fetch bundles</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>Product Bundles</h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
              Save more by purchasing complementary products together
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles?.map(bundle => {
              const totalPrice = products ? calculateBundleTotal(bundle, products) : 0;
              const discountedPrice = totalPrice * (1 - bundle.discountPercentage / 100);
              const savings = totalPrice - discountedPrice;

              return (
                <div
                  key={bundle.bundleId}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(118,184,82,0.3)] flex flex-col`}
                >
                  <div
                    className={`relative h-48 ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-green-50 to-white'} flex items-center justify-center cursor-pointer transition-colors duration-300`}
                    onClick={() => handleBundleClick(bundle)}
                  >
                    {bundle.imageUrl ? (
                      <img
                        src={bundle.imageUrl}
                        alt={bundle.name}
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2 justify-center items-center p-4">
                        {bundle.products.slice(0, 3).map(bp => {
                          const product = products?.find(p => p.productId === bp.productId);
                          return product ? (
                            <img
                              key={bp.productId}
                              src={`/${product.imgName}`}
                              alt={product.name}
                              className="h-16 w-16 object-contain"
                            />
                          ) : null;
                        })}
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-primary text-white text-sm font-bold px-2 py-1 rounded-full">
                      {bundle.discountPercentage}% OFF
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <h3
                      className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2 cursor-pointer hover:text-primary transition-colors duration-300`}
                      onClick={() => handleBundleClick(bundle)}
                    >
                      {bundle.name}
                    </h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3 flex-grow transition-colors duration-300`}>
                      {bundle.description}
                    </p>

                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3 mb-4 transition-colors duration-300`}>
                      <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider mb-2`}>
                        Includes {bundle.products.length} products
                      </p>
                      <ul className="space-y-1">
                        {bundle.products.map(bp => {
                          const product = products?.find(p => p.productId === bp.productId);
                          return product ? (
                            <li key={bp.productId} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex justify-between`}>
                              <span>× {bp.quantity} {product.name}</span>
                              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>${product.price.toFixed(2)}</span>
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </div>

                    <div className="space-y-2 mt-auto">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className={`text-sm line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'} mr-2`}>
                            ${totalPrice.toFixed(2)}
                          </span>
                          <span className="text-primary text-xl font-bold">
                            ${discountedPrice.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-green-500 text-sm font-semibold">
                          Save ${savings.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddBundleToCart(bundle)}
                        className="w-full px-4 py-2 bg-primary hover:bg-accent text-white rounded-lg transition-colors duration-300 font-medium"
                      >
                        Add Bundle to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bundle Detail Modal */}
      {showModal && selectedBundle && products && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl transition-colors duration-300`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                {selectedBundle.name}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-300 ml-4`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="inline-flex items-center bg-primary text-white text-lg font-bold px-4 py-1 rounded-full mb-4">
              {selectedBundle.discountPercentage}% OFF — Bundle Savings
            </div>

            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6 transition-colors duration-300`}>
              {selectedBundle.description}
            </p>

            <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-3 transition-colors duration-300`}>
              Included Products
            </h3>
            <div className="space-y-4 mb-6">
              {selectedBundle.products.map(bp => {
                const product = products.find(p => p.productId === bp.productId);
                if (!product) return null;
                const discountedPrice = product.price * (1 - selectedBundle.discountPercentage / 100);
                return (
                  <div
                    key={bp.productId}
                    className={`flex items-center gap-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-300`}
                  >
                    <img
                      src={`/${product.imgName}`}
                      alt={product.name}
                      className="h-16 w-16 object-contain flex-shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <p className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'} truncate`}>{product.name}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Qty: {bp.quantity}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>${product.price.toFixed(2)}</p>
                      <p className="text-primary font-bold">${discountedPrice.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {(() => {
              const total = calculateBundleTotal(selectedBundle, products);
              const discounted = total * (1 - selectedBundle.discountPercentage / 100);
              const savings = total - discounted;
              return (
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-lg p-4 mb-6 transition-colors duration-300`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Original Total</span>
                    <span className={`line-through ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-green-500 font-medium">Bundle Savings ({selectedBundle.discountPercentage}%)</span>
                    <span className="text-green-500 font-bold">-${savings.toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between items-center pt-2 border-t ${darkMode ? 'border-gray-600' : 'border-green-200'}`}>
                    <span className={`font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Bundle Price</span>
                    <span className="text-primary text-xl font-bold">${discounted.toFixed(2)}</span>
                  </div>
                </div>
              );
            })()}

            <button
              onClick={() => {
                handleAddBundleToCart(selectedBundle);
                setShowModal(false);
              }}
              className="w-full px-6 py-3 bg-primary hover:bg-accent text-white rounded-lg transition-colors duration-300 font-semibold text-lg"
            >
              Add Bundle to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
