/**
 * @swagger
 * components:
 *   schemas:
 *     OrderDetail:
 *       type: object
 *       required:
 *         - orderDetailId
 *         - orderId
 *         - productId
 *         - quantity
 *         - unitPrice
 *         - notes
 *       properties:
 *         orderDetailId:
 *           type: integer
 *           minimum: 1
 *           description: The unique identifier for the order detail
 *         orderId:
 *           type: integer
 *           minimum: 1
 *           description: The ID of the parent order
 *         productId:
 *           type: integer
 *           minimum: 1
 *           description: The ID of the product ordered
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: The quantity of products ordered
 *         unitPrice:
 *           type: number
 *           format: float
 *           minimum: 0
 *           exclusiveMinimum: true
 *           description: The price per unit
 *         notes:
 *           type: string
 *           minLength: 1
 *           maxLength: 2000
 *           description: Additional notes for the order detail
 */
export interface OrderDetail {
    orderDetailId: number;
    orderId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    notes: string;
}
