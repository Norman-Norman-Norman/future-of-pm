import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import StarRating from './StarRating';

interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  imgName: string;
  discount?: number;
  averageRating?: number;
  reviewCount?: number;
}

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const { darkMode } = useTheme();

  if (products.length === 0) return null;

  return (
    <section aria-labelledby="related-heading">
      <h2
        id="related-heading"
        className={`text-2xl font-bold mb-6 ${darkMode ? 'text-light' : 'text-gray-800'}`}
      >
        You May Also Like
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => {
          const effectivePrice = product.discount
            ? product.price * (1 - product.discount)
            : product.price;

          return (
            <Link
              key={product.productId}
              to={`/products/${product.productId}`}
              className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} rounded-lg overflow-hidden shadow hover:shadow-md transition-all duration-200 flex flex-col`}
              aria-label={`View ${product.name}`}
            >
              <div
                className={`h-36 ${darkMode ? 'bg-gradient-to-t from-gray-700 to-gray-800' : 'bg-gradient-to-t from-gray-100 to-white'}`}
              >
                <img
                  src={`/${product.imgName}`}
                  alt={product.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <h3
                  className={`text-sm font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-1 line-clamp-2`}
                >
                  {product.name}
                </h3>
                {product.averageRating !== undefined && (
                  <div className="mb-1">
                    <StarRating rating={product.averageRating} reviewCount={product.reviewCount} size="sm" />
                  </div>
                )}
                <div className="mt-auto">
                  {product.discount ? (
                    <div>
                      <span className="text-gray-400 line-through text-xs mr-1">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-primary font-bold text-sm">
                        ${effectivePrice.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-primary font-bold text-sm">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
