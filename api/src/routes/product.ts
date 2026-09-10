/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API endpoints for managing products
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Returns all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 * 
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID with detail-page data
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductDetail'
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *
 * /api/products/{id}/reviews:
 *   get:
 *     summary: Get read-only product reviews
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product reviews in newest-first order
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductReview'
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found
 *
 * /api/products/{id}/related:
 *   get:
 *     summary: Get deterministic related products
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 8
 *         description: Maximum related products to return
 *     responses:
 *       200:
 *         description: Related products ranked by category, supplier, price proximity, and product ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid product ID or limit
 *       404:
 *         description: Product not found
 */

import express from 'express';
import { Product, ProductDetail, ProductReviewSummary } from '../models/product';
import { productReviewStore, productStore, resetProductReviews, resetProducts } from '../dataStore';
import { logger } from '../logger';
import { ProductBodySchema, validateBody } from '../validation';

const TAG = 'Products';
const router = express.Router();
const DEFAULT_RELATED_LIMIT = 4;
const MAX_RELATED_LIMIT = 8;

logger.seed('products', productStore.all().length);

export { resetProductReviews, resetProducts };

const parsePositiveInteger = (value: string) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
};

const getProductId = (id: string, res: express.Response) => {
  const productId = parsePositiveInteger(id);
  if (!productId) {
    logger.warn(TAG, `Invalid product ID: id=${id}`);
    res.status(400).send('Invalid product ID');
    return undefined;
  }
  return productId;
};

const getRelatedLimit = (limit: unknown, res: express.Response) => {
  if (limit === undefined) return DEFAULT_RELATED_LIMIT;
  if (Array.isArray(limit)) {
    res.status(400).send('Invalid related product limit');
    return undefined;
  }

  const parsedLimit = parsePositiveInteger(String(limit));
  if (!parsedLimit) {
    res.status(400).send('Invalid related product limit');
    return undefined;
  }

  return Math.min(parsedLimit, MAX_RELATED_LIMIT);
};

const buildReviewSummary = (productId: number): ProductReviewSummary => {
  const reviews = productReviewStore.findByProductId(productId);
  const ratingCounts = { one: 0, two: 0, three: 0, four: 0, five: 0 };

  reviews.forEach(review => {
    if (review.rating === 1) ratingCounts.one += 1;
    if (review.rating === 2) ratingCounts.two += 1;
    if (review.rating === 3) ratingCounts.three += 1;
    if (review.rating === 4) ratingCounts.four += 1;
    if (review.rating === 5) ratingCounts.five += 1;
  });

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0
    ? Math.round((totalRating / reviews.length) * 10) / 10
    : 0;

  return {
    averageRating,
    reviewCount: reviews.length,
    ratingCounts
  };
};

const toProductDetail = (product: Product): ProductDetail => ({
  ...product,
  images: product.images?.length
    ? product.images
    : [{ url: `/${product.imgName}`, alt: `${product.name} product image`, isPrimary: true }],
  specifications: product.specifications?.length
    ? product.specifications
    : [
        { label: 'SKU', value: product.sku },
        { label: 'Unit', value: product.unit },
        { label: 'Category', value: product.category ?? 'General' },
        { label: 'Stock status', value: `${product.stockLevel} available; reorder at ${product.reorderPoint}` }
      ],
  reviewSummary: buildReviewSummary(product.productId)
});

const relatedScore = (source: Product, candidate: Product) => {
  let score = 0;
  if (source.category && candidate.category === source.category) score += 2;
  if (candidate.supplierId === source.supplierId) score += 1;
  return score;
};

const getRelatedProducts = (source: Product, limit: number) =>
  productStore
    .all()
    .filter(product => product.productId !== source.productId)
    .map(product => ({
      product,
      score: relatedScore(source, product),
      priceDistance: Math.abs(product.price - source.price)
    }))
    .sort((a, b) =>
      b.score - a.score ||
      a.priceDistance - b.priceDistance ||
      a.product.productId - b.product.productId
    )
    .slice(0, limit)
    .map(({ product }) => product);

// Create a new product
router.post('/', validateBody(ProductBodySchema), (req, res) => {
  logger.route(TAG, 'POST / - Creating new product', { body: req.body });
  const newProduct: Product = req.body;
  productStore.add(newProduct);
  logger.info(TAG, `Product created: ${newProduct.name}`, { productId: newProduct.productId, sku: newProduct.sku, totalProducts: productStore.all().length });
  res.status(201).json(newProduct);
});

// Get all products
router.get('/', (req, res) => {
  const products = productStore.all();
  logger.route(TAG, `GET / - Returning all products (${products.length} records)`);
  res.json(products);
});

// Get a product by ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  logger.route(TAG, `GET /${id} - Looking up product`);
  const productId = getProductId(id, res);
  if (!productId) return;

  const product = productStore.findById(productId);
  if (product) {
    logger.debug(TAG, `Found product: ${product.name} (SKU: ${product.sku})`);
    res.json(toProductDetail(product));
  } else {
    logger.warn(TAG, `Product not found: id=${id}`);
    res.status(404).send('Product not found');
  }
});

router.get('/:id/reviews', (req, res) => {
  const id = req.params.id;
  logger.route(TAG, `GET /${id}/reviews - Looking up product reviews`);
  const productId = getProductId(id, res);
  if (!productId) return;

  const product = productStore.findById(productId);
  if (!product) {
    logger.warn(TAG, `Product not found for reviews: id=${id}`);
    res.status(404).send('Product not found');
    return;
  }

  const reviews = productReviewStore
    .findByProductId(productId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  res.json(reviews);
});

router.get('/:id/related', (req, res) => {
  const id = req.params.id;
  logger.route(TAG, `GET /${id}/related - Looking up related products`, { query: req.query });
  const productId = getProductId(id, res);
  if (!productId) return;

  const limit = getRelatedLimit(req.query.limit, res);
  if (!limit) return;

  const product = productStore.findById(productId);
  if (!product) {
    logger.warn(TAG, `Product not found for related products: id=${id}`);
    res.status(404).send('Product not found');
    return;
  }

  res.json(getRelatedProducts(product, limit));
});

// Update a product by ID
router.put('/:id', validateBody(ProductBodySchema), (req, res) => {
  const id = req.params.id;
  logger.route(TAG, `PUT /${id} - Updating product`, { body: req.body });
  const product = productStore.replace(parseInt(id), req.body);
  if (product) {
    logger.info(TAG, `Product updated: id=${id}`, { name: product.name });
    res.json(product);
  } else {
    logger.warn(TAG, `Product not found for update: id=${id}`);
    res.status(404).send('Product not found');
  }
});

// Delete a product by ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  logger.route(TAG, `DELETE /${id} - Deleting product`);
  const deleted = productStore.remove(parseInt(id));
  if (deleted) {
    logger.info(TAG, `Product deleted: ${deleted.name}`, { remainingProducts: productStore.all().length });
    res.status(204).send();
  } else {
    logger.warn(TAG, `Product not found for deletion: id=${id}`);
    res.status(404).send('Product not found');
  }
});

export default router;
