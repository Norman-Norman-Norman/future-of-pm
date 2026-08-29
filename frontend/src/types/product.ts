export interface ProductImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductReviewSummary {
  averageRating: number;
  reviewCount: number;
  ratingCounts: {
    one: number;
    two: number;
    three: number;
    four: number;
    five: number;
  };
}

export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  imgName: string;
  sku: string;
  unit: string;
  supplierId: number;
  stockLevel?: number;
  reorderPoint?: number;
  discount?: number;
  category?: string;
  images?: ProductImage[];
  specifications?: ProductSpecification[];
}

export interface ProductDetail extends Product {
  images: ProductImage[];
  specifications: ProductSpecification[];
  reviewSummary: ProductReviewSummary;
}

export interface ProductReview {
  reviewId: number;
  productId: number;
  reviewerName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  verifiedBuyer: boolean;
}
