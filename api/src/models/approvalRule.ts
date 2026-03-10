/**
 * @swagger
 * components:
 *   schemas:
 *     ApprovalRule:
 *       type: object
 *       required:
 *         - ruleId
 *         - minAmount
 *         - requiredRole
 *       properties:
 *         ruleId:
 *           type: integer
 *           description: The unique identifier for the approval rule
 *         minAmount:
 *           type: number
 *           format: float
 *           description: The minimum order amount that triggers this rule
 *         maxAmount:
 *           type: number
 *           format: float
 *           description: The maximum order amount for this rule (optional)
 *         requiredRole:
 *           type: string
 *           description: The role required to approve orders matching this rule
 *         branchId:
 *           type: integer
 *           description: Optional branch ID if the rule is branch-specific
 */
export interface ApprovalRule {
    ruleId: number;
    minAmount: number;
    maxAmount?: number;
    requiredRole: string;
    branchId?: number;
}
