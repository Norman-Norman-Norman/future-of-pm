import { useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';
import { useCart } from '../../../context/CartContext';

type ProductCategory = 'health' | 'entertainment' | 'smart-home' | 'feeding' | 'grooming' | 'accessories';

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
  category?: ProductCategory;
}

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'health', label: 'Health' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'smart-home', label: 'Smart Home' },
  { value: 'feeding', label: 'Feeding' },
  { value: 'grooming', label: 'Grooming' },
  { value: 'accessories', label: 'Accessories' },
];

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A–Z' },
  { value: 'name-desc', label: 'Name: Z–A' },
];

const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.products}`);
  return data;
};

export default function Products() {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPromo, setShowPromo] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortOption, setSortOption] = useState('');

  const { data: products, isLoading, error } = useQuery('products', fetchProducts);
  const { darkMode } = useTheme();
  const { addToCart } = useCart();

  const activeFilterCount = [
    selectedCategories.length > 0,
    minPrice !== '',
    maxPrice !== '',
    onSaleOnly,
    sortOption !== '',
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setOnSaleOnly(false);
    setSortOption('');
    setSearchTerm('');
  };

  const toggleCategory = (cat: ProductCategory) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const removeCategory = (cat: ProductCategory) => {
    setSelectedCategories(prev => prev.filter(c => c !== cat));
  };

  const filteredProducts = (() => {
    if (!products) return [];

    let result = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategories.length > 0) {
      result = result.filter(p => p.category && selectedCategories.includes(p.category));
    }

    if (minPrice !== '') {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) result = result.filter(p => p.price >= min);
    }

    if (maxPrice !== '') {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) result = result.filter(p => p.price <= max);
    }

    if (onSaleOnly) {
      result = result.filter(p => p.discount !== undefined && p.discount > 0);
    }

    if (sortOption === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    else if (sortOption === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    else if (sortOption === 'name-asc') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortOption === 'name-desc') result = [...result].sort((a, b) => b.name.localeCompare(a.name));

    return result;
  })();

  const handleQuantityChange = (productId: number, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + change)
    }));
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.productId] || 0;
    if (quantity > 0) {
      const effectivePrice = product.discount
        ? product.price * (1 - product.discount)
        : product.price;
      addToCart(
        { productId: product.productId, name: product.name, price: effectivePrice, imgName: product.imgName },
        quantity
      );
      setQuantities(prev => ({
        ...prev,
        [product.productId]: 0
      }));
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
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

  if (error) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 text-center">Failed to fetch products</div>
        </div>
      </div>
    );
  }

  const filterSidebar = (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-5 shadow space-y-6 transition-colors duration-300`}>
      <div>
        <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-primary w-4 h-4"
                checked={selectedCategories.includes(cat.value)}
                onChange={() => toggleCategory(cat.value)}
                aria-label={`Filter by ${cat.label}`}
              />
              <span className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className={`w-full px-2 py-1 text-sm rounded border ${darkMode ? 'bg-gray-700 text-light border-gray-600' : 'bg-white text-gray-800 border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none`}
            aria-label="Minimum price"
            min="0"
          />
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className={`w-full px-2 py-1 text-sm rounded border ${darkMode ? 'bg-gray-700 text-light border-gray-600' : 'bg-white text-gray-800 border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none`}
            aria-label="Maximum price"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="accent-primary w-4 h-4"
            checked={onSaleOnly}
            onChange={e => setOnSaleOnly(e.target.checked)}
            aria-label="Show on sale only"
          />
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>On Sale Only</span>
        </label>
      </div>

      <div>
        <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Sort By</h3>
        <select
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          className={`w-full px-2 py-1 text-sm rounded border ${darkMode ? 'bg-gray-700 text-light border-gray-600' : 'bg-white text-gray-800 border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none`}
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full text-sm text-primary hover:text-accent font-medium transition-colors"
          aria-label="Clear all filters"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>Products</h1>
            {/* Mobile filter toggle */}
            <button
              className={`lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${darkMode ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-200'} transition-colors`}
              onClick={() => setShowFilters(prev => !prev)}
              aria-label="Toggle filters"
              aria-expanded={showFilters}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters{hasActiveFilters ? ` (${activeFilterCount})` : ''}
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 ${darkMode ? 'bg-gray-800 text-light border-gray-700' : 'bg-white text-gray-800 border-gray-300'} rounded-lg border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors duration-300`}
              aria-label="Search products"
            />
            <svg
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 items-center">
              {selectedCategories.map(cat => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary text-white"
                >
                  {CATEGORIES.find(c => c.value === cat)?.label}
                  <button
                    onClick={() => removeCategory(cat)}
                    aria-label={`Remove ${cat} filter`}
                    className="hover:opacity-75 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
              {minPrice !== '' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary text-white">
                  Min: ${minPrice}
                  <button onClick={() => setMinPrice('')} aria-label="Remove min price filter" className="hover:opacity-75 ml-1">×</button>
                </span>
              )}
              {maxPrice !== '' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary text-white">
                  Max: ${maxPrice}
                  <button onClick={() => setMaxPrice('')} aria-label="Remove max price filter" className="hover:opacity-75 ml-1">×</button>
                </span>
              )}
              {onSaleOnly && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary text-white">
                  On Sale
                  <button onClick={() => setOnSaleOnly(false)} aria-label="Remove on sale filter" className="hover:opacity-75 ml-1">×</button>
                </span>
              )}
              {sortOption !== '' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary text-white">
                  {SORT_OPTIONS.find(o => o.value === sortOption)?.label}
                  <button onClick={() => setSortOption('')} aria-label="Remove sort filter" className="hover:opacity-75 ml-1">×</button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className={`text-xs underline ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-800'} transition-colors`}
              >
                Clear All
              </button>
            </div>
          )}

          {/* Result count */}
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Showing {filteredProducts.length} of {products?.length ?? 0} products
          </p>

          <div className="flex gap-6">
            {/* Desktop filter sidebar */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              {filterSidebar}
            </aside>

            {/* Mobile filter drawer */}
            {showFilters && (
              <div className="lg:hidden w-full">
                {filterSidebar}
              </div>
            )}

            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.productId} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(118,184,82,0.3)] flex flex-col`}>
                    <div
                      className={`relative h-56 ${darkMode ? 'bg-gradient-to-t from-gray-700 to-gray-800' : 'bg-gradient-to-t from-gray-100 to-white'} transition-colors duration-300 cursor-pointer`}
                      onClick={() => handleProductClick(product)}
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
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                      {product.category && (
                        <span className="text-xs font-medium uppercase tracking-wider mb-1 text-gray-400">
                          {CATEGORIES.find(c => c.value === product.category)?.label ?? product.category}
                        </span>
                      )}
                      <h3 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2 transition-colors duration-300`}>{product.name}</h3>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 flex-grow transition-colors duration-300`}>{product.description}</p>
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

                        <div className="flex items-center justify-between">
                          <div className={`flex items-center space-x-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-1 transition-colors duration-300`}>
                            <button
                              onClick={() => handleQuantityChange(product.productId, -1)}
                              className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors duration-300`}
                              aria-label={`Decrease quantity of ${product.name}`}
                              id={`decrease-qty-${product.productId}`}
                            >
                              <span aria-hidden="true">-</span>
                            </button>
                            <span
                              className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center transition-colors duration-300`}
                              aria-label={`Quantity of ${product.name}`}
                              id={`qty-${product.productId}`}
                            >
                              {quantities[product.productId] || 0}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(product.productId, 1)}
                              className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors duration-300`}
                              aria-label={`Increase quantity of ${product.name}`}
                              id={`increase-qty-${product.productId}`}
                            >
                              <span aria-hidden="true">+</span>
                            </button>
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              quantities[product.productId]
                                ? 'bg-primary hover:bg-accent text-white'
                                : `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'} cursor-not-allowed`
                            }`}
                            disabled={!quantities[product.productId]}
                            aria-label={`Add ${quantities[product.productId] || 0} ${product.name} to cart`}
                            id={`add-to-cart-${product.productId}`}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl transition-colors duration-300`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-300`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className={`${darkMode ? 'bg-gradient-to-t from-gray-700 to-gray-800' : 'bg-gradient-to-t from-gray-100 to-white'} rounded-lg mb-6 p-4`}>
              <img
                src={`/${selectedProduct.imgName}`}
                alt={selectedProduct.name}
                className="w-full h-auto object-contain max-h-[400px]"
              />
            </div>
            {selectedProduct.category && (
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                {CATEGORIES.find(c => c.value === selectedProduct.category)?.label ?? selectedProduct.category}
              </span>
            )}
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors duration-300`}>
              {selectedProduct.name}
            </h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg transition-colors duration-300`}>
              {selectedProduct.description}
            </p>
          </div>
        </div>
      )}

      {/* Promo Popup - Chef's Hat Sale */}
      {showPromo && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div
            className={`${darkMode ? 'bg-gray-800 border-primary' : 'bg-white border-primary'} border-2 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center transition-colors duration-300`}
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4">
              <span className="text-5xl">🎉</span>
            </div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2`}>
              EXCLUSIVE SALE!
            </h2>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-4 mb-4`}>
              <img
                src="/GHCP_ChefsHat.png"
                alt="GitHub Copilot Chef's Hat"
                className="w-32 h-32 object-contain mx-auto mb-3"
              />
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                GitHub Copilot Chef's Hat
              </h3>
            </div>
            <div className="mb-4">
              <span className="text-primary text-3xl font-extrabold">30% OFF</span>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 text-sm`}>
                For Microsoft Tech Connect Attendees Only
              </p>
            </div>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg px-4 py-3 mb-6 inline-block`}>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs uppercase tracking-wider mb-1`}>Promo Code</p>
              <span className={`text-primary text-2xl font-mono font-bold tracking-widest`}>TechConnect</span>
            </div>
            <div>
              <button
                onClick={() => setShowPromo(false)}
                className="w-full bg-primary hover:bg-accent text-white font-semibold py-3 px-6 rounded-lg transition-colors text-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}