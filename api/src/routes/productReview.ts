/**
 * @swagger
 * tags:
 *   name: ProductReviews
 *   description: API endpoints for managing product reviews
 */

/**
 * @swagger
 * /api/products/{productId}/reviews:
 *   get:
 *     summary: Get all reviews for a product
 *     tags: [ProductReviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           enum: [recent, highest, helpful]
 *         description: Sort order (recent, highest, helpful)
 *     responses:
 *       200:
 *         description: List of reviews for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductReview'
 *   post:
 *     summary: Create a review for a product
 *     tags: [ProductReviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductReview'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductReview'
 *
 * /api/products/{productId}/reviews/{reviewId}:
 *   put:
 *     summary: Update a review
 *     tags: [ProductReviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductReview'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductReview'
 *       404:
 *         description: Review not found
 *   delete:
 *     summary: Delete a review
 *     tags: [ProductReviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
 *     responses:
 *       204:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 *
 * /api/products/{productId}/reviews/{reviewId}/helpful:
 *   post:
 *     summary: Mark a review as helpful
 *     tags: [ProductReviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review marked as helpful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductReview'
 *       404:
 *         description: Review not found
 */

import express, { Request } from 'express';
import { ProductReview } from '../models/productReview';
import { productReviews as seedReviews } from '../seedData';

type ProductParams = { productId: string };
type ReviewParams = { productId: string; reviewId: string };

const router = express.Router({ mergeParams: true });

let reviews: ProductReview[] = seedReviews.map(r => ({ ...r }));

export const resetReviews = () => {
  reviews = seedReviews.map(r => ({ ...r }));
};

// Get all reviews for a product
router.get('/', (req: Request<ProductParams>, res) => {
  const productId = parseInt(req.params.productId);
  let productReviews = reviews.filter(r => r.productId === productId);

  const sort = req.query.sort as string | undefined;
  if (sort === 'highest') {
    productReviews = productReviews.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'helpful') {
    productReviews = productReviews.sort((a, b) => b.helpful - a.helpful);
  } else {
    // Default: most recent
    productReviews = productReviews.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  res.json(productReviews);
});

// Create a review for a product
router.post('/', (req: Request<ProductParams>, res) => {
  const productId = parseInt(req.params.productId);
  const newReview: ProductReview = {
    ...req.body,
    productId,
    reviewId: req.body.reviewId ?? (reviews.length > 0 ? Math.max(...reviews.map(r => r.reviewId)) + 1 : 1),
    createdAt: req.body.createdAt ?? new Date().toISOString(),
    helpful: req.body.helpful ?? 0
  };
  reviews.push(newReview);
  res.status(201).json(newReview);
});

// Update a review by ID
router.put('/:reviewId', (req: Request<ReviewParams>, res) => {
  const productId = parseInt(req.params.productId);
  const reviewId = parseInt(req.params.reviewId);
  const index = reviews.findIndex(r => r.reviewId === reviewId && r.productId === productId);
  if (index !== -1) {
    reviews[index] = { ...req.body, productId, reviewId };
    res.json(reviews[index]);
  } else {
    res.status(404).send('Review not found');
  }
});

// Delete a review by ID
router.delete('/:reviewId', (req: Request<ReviewParams>, res) => {
  const productId = parseInt(req.params.productId);
  const reviewId = parseInt(req.params.reviewId);
  const index = reviews.findIndex(r => r.reviewId === reviewId && r.productId === productId);
  if (index !== -1) {
    reviews.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Review not found');
  }
});

// Mark a review as helpful
router.post('/:reviewId/helpful', (req: Request<ReviewParams>, res) => {
  const productId = parseInt(req.params.productId);
  const reviewId = parseInt(req.params.reviewId);
  const review = reviews.find(r => r.reviewId === reviewId && r.productId === productId);
  if (review) {
    review.helpful += 1;
    res.json(review);
  } else {
    res.status(404).send('Review not found');
  }
});

export default router;
