/**
 * @swagger
 * components:
 *   schemas:
 *     OrderDetailDelivery:
 *       type: object
 *       required:
 *         - orderDetailDeliveryId
 *         - orderDetailId
 *         - deliveryId
 *         - quantity
 *         - notes
 *       properties:
 *         orderDetailDeliveryId:
 *           type: integer
 *           minimum: 1
 *           description: The unique identifier for the order detail delivery
 *         orderDetailId:
 *           type: integer
 *           minimum: 1
 *           description: The ID of the related order detail
 *         deliveryId:
 *           type: integer
 *           minimum: 1
 *           description: The ID of the related delivery
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: The quantity of items in this delivery
 *         notes:
 *           type: string
 *           minLength: 1
 *           maxLength: 2000
 *           description: Additional notes about this delivery
 */
export interface OrderDetailDelivery {
    orderDetailDeliveryId: number;
    orderDetailId: number;
    deliveryId: number;
    quantity: number;
    notes: string;
}
