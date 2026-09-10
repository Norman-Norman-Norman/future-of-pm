import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchProductDetail, fetchProductReviews, fetchRelatedProducts } from '../../../api/products';
import { useCart } from '../../../context/CartContext';
import { useTheme } from '../../../context/ThemeContext';
import { frontendLogger } from '../../../logger';
import { Product, ProductDetail as ProductDetailType, ProductImage, ProductReview } from '../../../types/product';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const imageUrl = (image: ProductImage) => image.url.startsWith('/') ? image.url : `/${image.url}`;

const effectivePrice = (product: Product) => product.discount
  ? product.price * (1 - product.discount)
  : product.price;

const isStatus = (error: unknown, status: number) =>
  typeof error === 'object' &&
  error !== null &&
  'response' in error &&
  (error as { response?: { status?: number } }).response?.status === status;

function LoadingState({ darkMode }: { darkMode: boolean }) {
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto flex justify-center items-center h-64" role="status" aria-live="polite">
        <span className="sr-only">Loading product details</span>
        <div className="animate-spin h-24 w-24 border-4 border-gray-200 border-t-primary" aria-hidden="true"></div>
      </div>
    </div>
  );
}

function MessageState({ darkMode, title, message }: { darkMode: boolean; title: string; message: string }) {
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
      <div className="max-w-3xl mx-auto text-center">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>{title}</h1>
        <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{message}</p>
        <Link
          to="/products"
          className="inline-flex mt-6 min-h-11 items-center rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-accent focus:outline-none focus-visible:ring-4 focus-visible:ring-primary"
        >
          Back to products
        </Link>
      </div>
    </div>
  );
}

function RatingSummary({ product }: { product: ProductDetailType }) {
  const { averageRating, reviewCount } = product.reviewSummary;
  const roundedStars = Math.round(averageRating);
  const visualStars = Array.from({ length: 5 }, (_, index) => index < roundedStars ? '★' : '☆').join('');
  const reviewText = reviewCount === 1 ? '1 review' : `${reviewCount} reviews`;

  return (
    <section aria-labelledby="rating-heading" className="space-y-2">
      <h2 id="rating-heading" className="text-lg font-semibold">Buyer rating</h2>
      <p className="text-primary text-2xl" aria-hidden="true">{visualStars}</p>
      <p>{averageRating.toFixed(1)} out of 5 stars from {reviewText}</p>
    </section>
  );
}

function ProductGallery({ product, images, darkMode }: { product: ProductDetailType; images: ProductImage[]; darkMode: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [product.productId]);

  const activeImage = images[activeIndex] ?? images[0];

  return (
    <section aria-labelledby="gallery-heading" className="space-y-4">
      <h2 id="gallery-heading" className="sr-only">Product image gallery</h2>
      <div className={`${darkMode ? 'bg-gradient-to-t from-gray-700 to-gray-800' : 'bg-gradient-to-t from-gray-100 to-white'} rounded-2xl p-4 sm:p-8`}>
        <img
          src={imageUrl(activeImage)}
          alt={activeImage.alt}
          className="mx-auto h-72 w-full object-contain sm:h-96"
        />
      </div>
      <div className="flex flex-wrap gap-3" role="list" aria-label={`${product.name} images`}>
        {images.map((image, index) => (
          <button
            key={`${image.url}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`min-h-11 rounded-xl border-2 p-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary ${
              activeIndex === index ? 'border-primary' : darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
            aria-pressed={activeIndex === index}
            aria-label={`Show ${image.alt}`}
          >
            <img src={imageUrl(image)} alt="" className="h-16 w-16 object-contain" aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}

function ReviewList({ darkMode, error, isLoading, reviews }: {
  darkMode: boolean;
  error: unknown;
  isLoading: boolean;
  reviews?: ProductReview[];
}) {
  if (isLoading) {
    return <p role="status" aria-live="polite">Loading buyer reviews...</p>;
  }

  if (error) {
    return <p className="text-red-500" role="alert">Reviews are unavailable right now.</p>;
  }

  if (!reviews?.length) {
    return <p>No reviews yet. This product is ready for its first buyer review.</p>;
  }

  return (
    <ul className="space-y-4">
      {reviews.map(review => (
        <li key={review.reviewId} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-semibold">{review.title}</h3>
            <p className="text-sm text-primary">{review.rating} out of 5 stars</p>
          </div>
          <p className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {review.reviewerName} · {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            {review.verifiedBuyer ? ' · Verified buyer' : ''}
          </p>
          <p className="mt-3">{review.comment}</p>
        </li>
      ))}
    </ul>
  );
}

function RelatedProducts({ darkMode, error, isLoading, products }: {
  darkMode: boolean;
  error: unknown;
  isLoading: boolean;
  products?: Product[];
}) {
  if (isLoading) {
    return <p role="status" aria-live="polite">Loading related products...</p>;
  }

  if (error) {
    return <p className="text-red-500" role="alert">Related products are unavailable right now.</p>;
  }

  if (!products?.length) {
    return <p>No related products are available for this item yet.</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map(product => (
        <li key={product.productId}>
          <Link
            to={`/products/${product.productId}`}
            className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-white'} block h-full rounded-xl p-4 shadow transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-primary`}
            aria-label={`View details for related product ${product.name}`}
          >
            <img src={`/${product.imgName}`} alt="" className="mx-auto h-28 w-full object-contain" aria-hidden="true" />
            <h3 className="mt-3 font-semibold">{product.name}</h3>
            <p className="mt-1 text-sm text-primary">{currency.format(effectivePrice(product))}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState('');
  const { darkMode } = useTheme();
  const { addToCart } = useCart();

  const productQuery = useQuery(['product', id], () => fetchProductDetail(id ?? ''), {
    enabled: Boolean(id),
    retry: false
  });
  const reviewsQuery = useQuery(['product-reviews', id], () => fetchProductReviews(id ?? ''), {
    enabled: Boolean(id) && productQuery.isSuccess,
    retry: false
  });
  const relatedQuery = useQuery(['related-products', id], () => fetchRelatedProducts(id ?? ''), {
    enabled: Boolean(id) && productQuery.isSuccess,
    retry: false
  });

  useEffect(() => {
    frontendLogger.componentMount('ProductDetail');
    return () => frontendLogger.componentUnmount('ProductDetail');
  }, []);

  useEffect(() => {
    setQuantity(1);
    setCartMessage('');
    headingRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [id]);

  if (productQuery.isLoading) {
    return <LoadingState darkMode={darkMode} />;
  }

  if (isStatus(productQuery.error, 404)) {
    return <MessageState darkMode={darkMode} title="Product not found" message="The product you requested is not in the catalog." />;
  }

  if (productQuery.error || !productQuery.data) {
    return <MessageState darkMode={darkMode} title="Product details unavailable" message="We could not load this product. Please try again from the catalog." />;
  }

  const product = productQuery.data;
  const images = product.images.length > 0
    ? product.images
    : [{ url: `/${product.imgName}`, alt: `${product.name} product image`, isPrimary: true }];
  const productPrice = effectivePrice(product);

  const handleAddToCart = () => {
    if (quantity < 1) return;

    addToCart(
      { productId: product.productId, name: product.name, price: productPrice, imgName: product.imgName },
      quantity
    );
    frontendLogger.userAction('Add to cart from ProductDetail page', {
      productId: product.productId,
      name: product.name,
      quantity,
      effectivePrice: productPrice
    });
    setCartMessage(`Added ${quantity} ${product.name} to cart.`);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark text-light' : 'bg-gray-100 text-gray-800'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto space-y-8">
        <nav aria-label="Breadcrumb" className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to="/" className="hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to="/products" className="hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">Products</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ProductGallery product={product} images={images} darkMode={darkMode} />

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg sm:p-8 space-y-6`}>
            <div>
              {product.category && (
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">{product.category}</p>
              )}
              <h1
                ref={headingRef}
                tabIndex={-1}
                className={`mt-2 text-3xl font-bold focus:outline-none sm:text-4xl ${darkMode ? 'text-light' : 'text-gray-900'}`}
              >
                {product.name}
              </h1>
              <p className={`mt-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{product.description}</p>
            </div>

            <RatingSummary product={product} />

            <section aria-labelledby="price-heading" className="space-y-2">
              <h2 id="price-heading" className="sr-only">Price</h2>
              {product.discount ? (
                <p>
                  <span className="text-gray-500 line-through mr-3">{currency.format(product.price)}</span>
                  <span className="text-3xl font-bold text-primary">{currency.format(productPrice)}</span>
                  <span className="ml-3 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-white">
                    {Math.round(product.discount * 100)}% off
                  </span>
                </p>
              ) : (
                <p className="text-3xl font-bold text-primary">{currency.format(product.price)}</p>
              )}
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Sold per {product.unit}. SKU {product.sku}.</p>
            </section>

            <section aria-labelledby="cart-heading" className="space-y-4">
              <h2 id="cart-heading" className="text-lg font-semibold">Add to cart</h2>
              <div className="flex flex-wrap items-center gap-4">
                <div className={`flex items-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} p-1`}>
                  <button
                    type="button"
                    onClick={() => setQuantity(current => Math.max(1, current - 1))}
                    className="min-h-11 min-w-11 rounded-md px-3 text-lg font-bold hover:text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary"
                    aria-label={`Decrease quantity of ${product.name}`}
                  >
                    <span aria-hidden="true">-</span>
                  </button>
                  <output className="min-w-12 text-center font-semibold" aria-label={`Selected quantity for ${product.name}`}>{quantity}</output>
                  <button
                    type="button"
                    onClick={() => setQuantity(current => current + 1)}
                    className="min-h-11 min-w-11 rounded-md px-3 text-lg font-bold hover:text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary"
                    aria-label={`Increase quantity of ${product.name}`}
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="min-h-11 rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-accent focus:outline-none focus-visible:ring-4 focus-visible:ring-primary"
                  aria-label={`Add ${quantity} ${product.name} to cart`}
                >
                  Add to Cart
                </button>
              </div>
              <p className="sr-only" role="status" aria-live="polite">{cartMessage}</p>
            </section>
          </div>
        </div>

        <section aria-labelledby="specifications-heading" className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
          <h2 id="specifications-heading" className="text-2xl font-bold">Specifications</h2>
          {product.specifications.length ? (
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {product.specifications.map(specification => (
                <div key={specification.label} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
                  <dt className="font-semibold">{specification.label}</dt>
                  <dd className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{specification.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-4">No specifications are available for this product yet.</p>
          )}
        </section>

        <section aria-labelledby="reviews-heading" className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
          <h2 id="reviews-heading" className="text-2xl font-bold">Buyer reviews</h2>
          <div className="mt-4">
            <ReviewList darkMode={darkMode} error={reviewsQuery.error} isLoading={reviewsQuery.isLoading} reviews={reviewsQuery.data} />
          </div>
        </section>

        <section aria-labelledby="related-heading" className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
          <h2 id="related-heading" className="text-2xl font-bold">Frequently bought together</h2>
          <div className="mt-4">
            <RelatedProducts darkMode={darkMode} error={relatedQuery.error} isLoading={relatedQuery.isLoading} products={relatedQuery.data} />
          </div>
        </section>
      </div>
    </div>
  );
}
