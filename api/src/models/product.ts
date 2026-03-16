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
 *         discount:
 *           type: number
 *           format: float
 *           description: Discount percentage (if applicable) expressed as a decimal (e.g., 0.25 for 25%)
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs for the product gallery
 *         averageRating:
 *           type: number
 *           format: float
 *           description: Average customer rating (1-5)
 *         reviewCount:
 *           type: integer
 *           description: Total number of customer reviews
 *         specifications:
 *           type: object
 *           additionalProperties:
 *             type: string
 *           description: Key-value product specifications
 */
export interface Product {
    productId: number;
    supplierId: number;
    name: string;
    description: string;
    price: number;
    sku: string;
    unit: string;
    imgName: string;
    discount?: number;
    images?: string[];
    averageRating?: number;
    reviewCount?: number;
    specifications?: Record<string, string>;
}
