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
 *         - scheduledDate
 *         - name
 *         - description
 *         - status
 *       properties:
 *         deliveryId:
 *           type: integer
 *           minimum: 1
 *           description: The unique identifier for the delivery
 *         supplierId:
 *           type: integer
 *           minimum: 1
 *           description: The ID of the supplier providing the delivery
 *         orderId:
 *           type: integer
 *           minimum: 1
 *           description: The ID of the order being delivered
 *         status:
 *           type: string
 *           description: Current status of the delivery
 *           enum: [pending, in-transit, delivered, failed]
 *         scheduledDate:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: Scheduled delivery date and time
 *         deliveryDate:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: Delivery date
 *         actualDeliveryDate:
 *           type: string
 *           maxLength: 200
 *           description: Actual delivery date and time
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           description: The name of the delivery
 *         description:
 *           type: string
 *           minLength: 1
 *           maxLength: 2000
 *           description: Additional details about the delivery
 *     DeliveryStatusUpdate:
 *       type: object
 *       required:
 *         - status
 *       additionalProperties: false
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, in-transit, delivered, failed]
 *           description: Updated delivery status
 */
export interface Delivery {
    deliveryId: number;
    supplierId: number;
    orderId?: number;
    deliveryDate: string;
    scheduledDate: string;
    actualDeliveryDate?: string;
    name: string;
    description: string;
    status: string;
}
