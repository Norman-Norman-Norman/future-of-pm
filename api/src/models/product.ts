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
 *           description: Current units in stock
 *         reorderPoint:
 *           type: integer
 *           description: Stock level threshold that triggers a low-stock alert
 *         reorderQuantity:
 *           type: integer
 *           description: Suggested quantity to reorder when stock is low
 *         discount:
 *           type: number
 *           format: float
 *           description: Discount percentage (if applicable) expressed as a decimal (e.g., 0.25 for 25%)
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
    stockLevel: number;
    reorderPoint: number;
    reorderQuantity: number;
    discount?: number;
}
