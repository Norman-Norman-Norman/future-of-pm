/**
 * @openapi
 * components:
 *   schemas:
 *     SubscriptionItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *           description: The product ID
 *         quantity:
 *           type: integer
 *           description: Quantity to order each cycle
 *     Subscription:
 *       type: object
 *       required:
 *         - subscriptionId
 *         - branchId
 *         - items
 *         - frequency
 *         - nextDeliveryDate
 *         - status
 *         - discountPercentage
 *         - createdAt
 *       properties:
 *         subscriptionId:
 *           type: integer
 *           description: Unique identifier for the subscription
 *         branchId:
 *           type: integer
 *           description: Branch that owns this subscription
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SubscriptionItem'
 *           description: Products and quantities in this subscription
 *         frequency:
 *           type: string
 *           enum: [weekly, biweekly, monthly, quarterly]
 *           description: How often the subscription order is placed
 *         nextDeliveryDate:
 *           type: string
 *           format: date-time
 *           description: Date of the next scheduled delivery
 *         status:
 *           type: string
 *           enum: [active, paused, cancelled]
 *           description: Current status of the subscription
 *         discountPercentage:
 *           type: number
 *           description: Discount percentage applied to subscribed items (e.g. 5 for 5%)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the subscription was created
 */

export interface SubscriptionItem {
    productId: number;
    quantity: number;
}

export interface Subscription {
    subscriptionId: number;
    branchId: number;
    items: SubscriptionItem[];
    frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
    nextDeliveryDate: string;
    status: 'active' | 'paused' | 'cancelled';
    discountPercentage: number;
    createdAt: string;
}
