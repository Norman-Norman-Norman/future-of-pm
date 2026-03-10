/**
 * @swagger
 * components:
 *   schemas:
 *     LoyaltyTransaction:
 *       type: object
 *       required:
 *         - transactionId
 *         - type
 *         - points
 *         - description
 *         - createdAt
 *       properties:
 *         transactionId:
 *           type: integer
 *           description: Unique identifier for the transaction
 *         type:
 *           type: string
 *           enum: [earn, redeem, expire, bonus]
 *           description: Type of loyalty transaction
 *         points:
 *           type: number
 *           description: Points amount for this transaction
 *         orderId:
 *           type: integer
 *           description: Associated order ID (optional)
 *         description:
 *           type: string
 *           description: Human-readable description of the transaction
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of the transaction
 *     LoyaltyAccount:
 *       type: object
 *       required:
 *         - accountId
 *         - branchId
 *         - totalPoints
 *         - lifetimePoints
 *         - tier
 *         - history
 *       properties:
 *         accountId:
 *           type: integer
 *           description: Unique identifier for the loyalty account
 *         branchId:
 *           type: integer
 *           description: Branch this loyalty account belongs to
 *         totalPoints:
 *           type: number
 *           description: Current redeemable points balance
 *         lifetimePoints:
 *           type: number
 *           description: Total points ever earned (used for tier calculation)
 *         tier:
 *           type: string
 *           enum: [bronze, silver, gold, platinum]
 *           description: Current tier based on lifetime points
 *         history:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LoyaltyTransaction'
 *           description: Transaction history
 */
export interface LoyaltyTransaction {
    transactionId: number;
    type: 'earn' | 'redeem' | 'expire' | 'bonus';
    points: number;
    orderId?: number;
    description: string;
    createdAt: string;
}

export interface LoyaltyAccount {
    accountId: number;
    branchId: number;
    totalPoints: number;
    lifetimePoints: number;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    history: LoyaltyTransaction[];
}
