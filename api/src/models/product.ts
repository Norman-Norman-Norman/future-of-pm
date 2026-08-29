/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - productId
 *         - name
 *         - price
 *       properties:
 *         productId:
 *           type: integer
 *           description: The unique identifier for the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         description:
 *           type: string
 *           description: Detailed description of the product
 *         price:
 *           type: number
 *           format: float
 *           description: The current price of the product
 *         supplierId:
 *           type: integer
 *           description: The ID of the supplier providing this product
 *         stockLevel:
 *           type: integer
 *           description: Current stock level of the product
 *         reorderPoint:
 *           type: integer
 *           description: Stock threshold at or below which replenishment is recommended
 *         discount:
 *           type: number
 *           format: float
 *           description: Discount percentage (if applicable) expressed as a decimal (e.g., 0.25 for 25%)
 *         category:
 *           type: string
 *           description: Merchandising category for product discovery and related-product grouping
 *         images:
 *           type: array
 *           description: Accessible product image gallery entries
 *           items:
 *             $ref: '#/components/schemas/ProductImage'
 *         specifications:
 *           type: array
 *           description: Optional buyer-facing product specifications
 *           items:
 *             $ref: '#/components/schemas/ProductSpecification'
 *     ProductImage:
 *       type: object
 *       required:
 *         - url
 *         - alt
 *       properties:
 *         url:
 *           type: string
 *         alt:
 *           type: string
 *         isPrimary:
 *           type: boolean
 *     ProductSpecification:
 *       type: object
 *       required:
 *         - label
 *         - value
 *       properties:
 *         label:
 *           type: string
 *         value:
 *           type: string
 *     ProductReviewSummary:
 *       type: object
 *       required:
 *         - averageRating
 *         - reviewCount
 *         - ratingCounts
 *       properties:
 *         averageRating:
 *           type: number
 *           format: float
 *         reviewCount:
 *           type: integer
 *         ratingCounts:
 *           type: object
 *           properties:
 *             one:
 *               type: integer
 *             two:
 *               type: integer
 *             three:
 *               type: integer
 *             four:
 *               type: integer
 *             five:
 *               type: integer
 *     ProductDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/Product'
 *         - type: object
 *           required:
 *             - images
 *             - specifications
 *             - reviewSummary
 *           properties:
 *             reviewSummary:
 *               $ref: '#/components/schemas/ProductReviewSummary'
 */
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
    supplierId: number;
    name: string;
    description: string;
    price: number;
    sku: string;
    unit: string;
    imgName: string;
    stockLevel: number;
    reorderPoint: number;
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
