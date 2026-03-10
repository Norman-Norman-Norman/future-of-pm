/**
 * @swagger
 * components:
 *   schemas:
 *     Delivery:
 *       type: object
 *       required:
 *         - deliveryId
 *         - supplierId
 *         - deliveryDate
 *         - name
 *         - description
 *         - status
 *       properties:
 *         deliveryId:
 *           type: integer
 *           description: The unique identifier for the delivery
 *         supplierId:
 *           type: integer
 *           description: The ID of the supplier for this delivery
 *         deliveryDate:
 *           type: string
 *           description: The date of the delivery
 *         name:
 *           type: string
 *           description: The name of the delivery
 *         description:
 *           type: string
 *           description: Additional details about the delivery
 *         status:
 *           type: string
 *           description: Current status of the delivery
 *           enum: [pending, in-transit, delivered, failed]
 */
export interface Delivery {
    deliveryId: number;
    supplierId: number;
    deliveryDate: string;
    name: string;
    description: string;
    status: string;
}
