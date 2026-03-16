/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - reviewId
 *         - productId
 *         - rating
 *         - title
 *         - body
 *         - authorName
 *         - createdAt
 *       properties:
 *         reviewId:
 *           type: integer
 *           description: The unique identifier for the review
 *         productId:
 *           type: integer
 *           description: The ID of the product being reviewed
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Star rating from 1 to 5
 *         title:
 *           type: string
 *           description: Short review title
 *         body:
 *           type: string
 *           description: Full review text
 *         authorName:
 *           type: string
 *           description: Display name of the reviewer
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: ISO timestamp when the review was submitted
 *         helpful:
 *           type: integer
 *           description: Number of helpful votes for this review
 */
export interface Review {
    reviewId: number;
    productId: number;
    rating: number;
    title: string;
    body: string;
    authorName: string;
    createdAt: string;
    helpful: number;
}
