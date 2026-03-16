import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';
import { useCart } from '../../../context/CartContext';
import StarRating from './StarRating';
import ReviewList from './ReviewList';
import RelatedProducts from './RelatedProducts';
import Breadcrumb from '../../Breadcrumb';

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
  images?: string[];
  averageRating?: number;
  reviewCount?: number;
  specifications?: Record<string, string>;
}

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

const fetchProduct = async (id: string): Promise<Product> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.products}/${id}`);
  return data;
};

const fetchReviews = async (id: string): Promise<Review[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.productReviews(Number(id))}`);
  return data;
};

const fetchRelated = async (id: string): Promise<Product[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.productRelated(Number(id))}`);
  return data;
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading: productLoading, error: productError } = useQuery(
    ['product', id],
    () => fetchProduct(id!),
    { enabled: !!id }
  );

  const { data: reviews = [] } = useQuery(
    ['product-reviews', id],
    () => fetchReviews(id!),
    { enabled: !!id }
  );

  const { data: related = [] } = useQuery(
    ['product-related', id],
    () => fetchRelated(id!),
    { enabled: !!id }
  );

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    if (!product) return;
    const effectivePrice = product.discount
      ? product.price * (1 - product.discount)
      : product.price;
    addToCart(
      { productId: product.productId, name: product.name, price: effectivePrice, imgName: product.imgName },
      quantity
    );
    setQuantity(1);
  };

  if (productLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4`}>
        <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary" role="status" aria-label="Loading product" />
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4`}>
        <div className="max-w-7xl mx-auto">
          <p className="text-red-500 text-center">Product not found.</p>
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/products')}
              className="text-primary hover:underline"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.imgName];
  const effectivePrice = product.discount
    ? product.price * (1 - product.discount)
    : product.price;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: product.name },
          ]}
        />

        {/* Main product section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Image gallery */}
          <div className="space-y-3">
            <div
              className={`${darkMode ? 'bg-gradient-to-t from-gray-700 to-gray-800' : 'bg-gradient-to-t from-gray-100 to-white'} rounded-xl overflow-hidden aspect-square flex items-center justify-center`}
            >
              <img
                src={`/${images[selectedImage]}`}
                alt={product.name}
                className="w-full h-full object-contain p-6"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1" role="list" aria-label="Product image thumbnails">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    role="listitem"
                    aria-label={`View image ${index + 1} of ${images.length}`}
                    aria-pressed={selectedImage === index}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-primary'
                        : darkMode ? 'border-gray-600' : 'border-gray-200'
                    }`}
                  >
                    <img src={`/${img}`} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-5">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>SKU: {product.sku}</p>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            {product.averageRating !== undefined && (
              <div className="flex items-center gap-2">
                <StarRating rating={product.averageRating} reviewCount={product.reviewCount} size="md" />
                <a
                  href="#reviews"
                  className="text-sm text-primary hover:underline"
                  aria-label={`Read ${product.reviewCount} reviews`}
                >
                  Read reviews
                </a>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-primary text-3xl font-extrabold">
                ${effectivePrice.toFixed(2)}
              </span>
              {product.discount && (
                <>
                  <span className="text-gray-400 line-through text-lg">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="bg-primary text-white text-sm font-semibold px-2 py-0.5 rounded">
                    {Math.round(product.discount * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              {product.description}
            </p>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-3`}>
                  Specifications
                </h2>
                <dl className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex px-4 py-2 gap-4">
                      <dt className={`text-sm font-medium w-32 flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {key}
                      </dt>
                      <dd className={`text-sm ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Add to cart */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 space-y-4`}>
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Quantity
                </label>
                <div className={`flex items-center space-x-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1`}>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary disabled:opacity-40 transition-colors`}
                    aria-label="Decrease quantity"
                  >
                    <span aria-hidden="true">−</span>
                  </button>
                  <span
                    id="quantity"
                    className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center font-semibold`}
                    aria-live="polite"
                    aria-label={`Quantity: ${quantity}`}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                    aria-label="Increase quantity"
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full bg-primary hover:bg-accent text-white font-semibold py-3 px-6 rounded-lg transition-colors text-lg"
                aria-label={`Add ${quantity} ${product.name} to cart`}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <section id="reviews" aria-labelledby="reviews-heading">
          <h2
            id="reviews-heading"
            className={`text-2xl font-bold mb-6 ${darkMode ? 'text-light' : 'text-gray-800'}`}
          >
            Customer Reviews
            {product.reviewCount !== undefined && (
              <span className={`ml-2 text-base font-normal ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            )}
          </h2>
          {product.averageRating !== undefined && (
            <div className="flex items-center gap-3 mb-6">
              <span className={`text-5xl font-extrabold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                {product.averageRating.toFixed(1)}
              </span>
              <div>
                <StarRating rating={product.averageRating} size="lg" />
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                  out of 5
                </p>
              </div>
            </div>
          )}
          <ReviewList reviews={reviews} />
        </section>

        {/* Related products */}
        {related.length > 0 && <RelatedProducts products={related} />}
      </div>
    </div>
  );
}
