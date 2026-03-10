/**
 * @swagger
 * components:
 *   schemas:
 *     ProductReview:
 *       type: object
 *       required:
 *         - reviewId
 *         - productId
 *         - displayName
 *         - rating
 *         - title
 *         - body
 *         - createdAt
 *         - helpful
 *       properties:
 *         reviewId:
 *           type: integer
 *           description: The unique identifier for the review
 *         productId:
 *           type: integer
 *           description: The ID of the product being reviewed
 *         userId:
 *           type: integer
 *           description: Optional ID of the user who submitted the review
 *         displayName:
 *           type: string
 *           description: Display name of the reviewer
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Star rating from 1 to 5
 *         title:
 *           type: string
 *           description: Short title of the review
 *         body:
 *           type: string
 *           description: Full text body of the review
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: ISO timestamp when the review was created
 *         helpful:
 *           type: integer
 *           description: Number of helpful votes
 */
export interface ProductReview {
    reviewId: number;
    productId: number;
    userId?: number;
    displayName: string;
    rating: number;
    title: string;
    body: string;
    createdAt: string;
    helpful: number;
}
