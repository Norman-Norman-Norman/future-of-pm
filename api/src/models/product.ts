/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - productId
 *         - supplierId
 *         - name
 *         - description
 *         - price
 *         - sku
 *         - unit
 *         - imgName
 *         - stockLevel
 *         - reorderPoint
 *       properties:
 *         productId:
 *           type: integer
 *           minimum: 1
 *           description: The unique identifier for the product
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: The name of the product
 *         description:
 *           type: string
 *           minLength: 1
 *           maxLength: 2000
 *           description: Detailed description of the product
 *         price:
 *           type: number
 *           format: float
 *           minimum: 0
 *           exclusiveMinimum: true
 *           description: The current price of the product
 *         supplierId:
 *           type: integer
 *           minimum: 1
 *           description: The ID of the supplier providing this product
 *         sku:
 *           type: string
 *           pattern: '^[A-Za-z0-9-]+$'
 *           maxLength: 100
 *           description: Stock keeping unit using letters, numbers, and hyphens
 *         unit:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: Product unit of measure
 *         imgName:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: Product image file name
 *         stockLevel:
 *           type: integer
 *           minimum: 0
 *           description: Current stock level of the product
 *         reorderPoint:
 *           type: integer
 *           minimum: 0
 *           description: Stock threshold at or below which replenishment is recommended
 *         discount:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 1
 *           description: Discount percentage (if applicable) expressed as a decimal (e.g., 0.25 for 25%)
 *         category:
 *           type: string
 *           maxLength: 200
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
 *           minLength: 1
 *           maxLength: 200
 *         alt:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
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
 *           minLength: 1
 *           maxLength: 200
 *         value:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
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
