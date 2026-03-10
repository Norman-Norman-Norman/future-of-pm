/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: API endpoints for managing the wishlist
 */

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Returns all wishlist items
 *     tags: [Wishlist]
 *     responses:
 *       200:
 *         description: List of all wishlist items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WishlistItem'
 *   post:
 *     summary: Add a product to the wishlist
 *     tags: [Wishlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Wishlist item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WishlistItem'
 *       409:
 *         description: Product already in wishlist
 *
 * /api/wishlist/{productId}:
 *   delete:
 *     summary: Remove a product from the wishlist
 *     tags: [Wishlist]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID to remove from wishlist
 *     responses:
 *       204:
 *         description: Wishlist item removed successfully
 *       404:
 *         description: Product not found in wishlist
 */

import express from 'express';
import { WishlistItem } from '../models/wishlist';

const router = express.Router();

let wishlistItems: WishlistItem[] = [];
let nextId = 1;

export const resetWishlist = () => {
  wishlistItems = [];
  nextId = 1;
};

// Get all wishlist items
router.get('/', (req, res) => {
  res.json(wishlistItems);
});

// Add a product to the wishlist
router.post('/', (req, res) => {
  const { productId } = req.body;
  const existing = wishlistItems.find(item => item.productId === productId);
  if (existing) {
    res.status(409).send('Product already in wishlist');
    return;
  }
  const newItem: WishlistItem = {
    wishlistItemId: nextId++,
    productId,
    addedAt: new Date().toISOString(),
  };
  wishlistItems.push(newItem);
  res.status(201).json(newItem);
});

// Remove a product from the wishlist
router.delete('/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);
  const index = wishlistItems.findIndex(item => item.productId === productId);
  if (index !== -1) {
    wishlistItems.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Product not found in wishlist');
  }
});

export default router;
