/**
 * @swagger
 * components:
 *   schemas:
 *     StatusHistoryEntry:
 *       type: object
 *       required:
 *         - to
 *         - timestamp
 *       properties:
 *         from:
 *           type: string
 *           nullable: true
 *           description: The previous status (null for initial status)
 *         to:
 *           type: string
 *           description: The new status
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: When the transition occurred
 *         reason:
 *           type: string
 *           description: Reason for the transition (required for rejected/cancelled)
 *         changedBy:
 *           type: string
 *           description: Who performed the transition
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
 *         name:
 *           type: string
 *           description: The name of the order
 *         description:
 *           type: string
 *           description: A description of the order
 *         status:
 *           type: string
 *           description: The current status of the order
 *           enum: [draft, submitted, approved, rejected, processing, shipped, delivered, cancelled]
 *         statusHistory:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/StatusHistoryEntry'
 *           description: History of all status transitions
 */
export interface StatusHistoryEntry {
    from: string | null;
    to: string;
    timestamp: string;
    reason?: string;
    changedBy?: string;
}

export interface Order {
    orderId: number;
    branchId: number;
    orderDate: string;
    name: string;
    description: string;
    status: string;
    statusHistory: StatusHistoryEntry[];
}
