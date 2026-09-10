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
 *         - name
 *         - description
 *         - status
 *       properties:
 *         orderId:
 *           type: integer
 *           minimum: 1
 *           description: The unique identifier for the order
 *         branchId:
 *           type: integer
 *           minimum: 1
 *           description: The ID of the branch that placed the order
 *         orderDate:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: The date and time when the order was placed
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: The name of the order
 *         description:
 *           type: string
 *           minLength: 1
 *           maxLength: 2000
 *           description: Additional details about the order
 *         status:
 *           type: string
 *           description: The current status of the order
 *           enum: [pending, processing, shipped, delivered, cancelled]
 */
export interface Order {
    orderId: number;
    branchId: number;
    orderDate: string;
    name: string;
    description: string;
    status: string;
}
