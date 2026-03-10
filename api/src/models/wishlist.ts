/**
 * @swagger
 * components:
 *   schemas:
 *     WishlistItem:
 *       type: object
 *       required:
 *         - wishlistItemId
 *         - productId
 *       properties:
 *         wishlistItemId:
 *           type: integer
 *           description: The unique identifier for the wishlist item
 *         productId:
 *           type: integer
 *           description: The ID of the product saved to the wishlist
 *         addedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the item was added to the wishlist
 */
export interface WishlistItem {
    wishlistItemId: number;
    productId: number;
    addedAt: string;
}
