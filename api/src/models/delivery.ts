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
 *           format: date-time
 *           description: Scheduled delivery date
 *         name:
 *           type: string
 *           description: Name of the delivery
 *         description:
 *           type: string
 *           description: Description of the delivery
 *         status:
 *           type: string
 *           description: Current status of the delivery
 *           enum: [pending, in-transit, out-for-delivery, delivered, failed]
 *         trackingNumber:
 *           type: string
 *           description: Carrier tracking number
 *         estimatedDelivery:
 *           type: string
 *           format: date-time
 *           description: Expected delivery date
 *         actualDelivery:
 *           type: string
 *           format: date-time
 *           description: Actual delivery date
 *         carrier:
 *           type: string
 *           description: Shipping carrier name
 */
export interface Delivery {
    deliveryId: number;
    supplierId: number;
    deliveryDate: string;
    name: string;
    description: string;
    status: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
    carrier?: string;
}
