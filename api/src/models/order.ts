/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - orderId
 *         - branchId
 *         - orderDate
 *       properties:
 *         orderId:
 *           type: integer
 *           description: The unique identifier for the order
 *         branchId:
 *           type: integer
 *           description: The ID of the branch that placed the order
 *         orderDate:
 *           type: string
 *           format: date-time
 *           description: The date and time when the order was placed
 *         status:
 *           type: string
 *           description: The current status of the order
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *         orderTotal:
 *           type: number
 *           format: float
 *           description: The total amount for the order
 *         shippingAddress:
 *           type: string
 *           description: The delivery address for the order
 *         trackingNumber:
 *           type: string
 *           description: The carrier tracking number (optional)
 */
export interface Order {
    orderId: number;
    branchId: number;
    orderDate: string;
    name: string;
    description: string;
    status: string;
    orderTotal: number;
    shippingAddress: string;
    trackingNumber?: string;
}
