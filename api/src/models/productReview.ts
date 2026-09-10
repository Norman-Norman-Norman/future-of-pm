/**
 * @swagger
 * components:
 *   schemas:
 *     ProductReview:
 *       type: object
 *       required:
 *         - reviewId
 *         - productId
 *         - reviewerName
 *         - rating
 *         - title
 *         - comment
 *         - createdAt
 *         - verifiedBuyer
 *       properties:
 *         reviewId:
 *           type: integer
 *         productId:
 *           type: integer
 *         reviewerName:
 *           type: string
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         title:
 *           type: string
 *         comment:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         verifiedBuyer:
 *           type: boolean
 */
export interface ProductReview {
    reviewId: number;
    productId: number;
    reviewerName: string;
    rating: number;
    title: string;
    comment: string;
    createdAt: string;
    verifiedBuyer: boolean;
}
