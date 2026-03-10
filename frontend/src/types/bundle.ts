export interface BundleProduct {
  productId: number;
  quantity: number;
}

export interface ProductBundle {
  bundleId: number;
  name: string;
  description: string;
  products: BundleProduct[];
  discountPercentage: number;
  imageUrl?: string;
}
