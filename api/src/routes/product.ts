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
 *     summary: Get a product by ID
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
 *               $ref: '#/components/schemas/Product'
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
 */

import express from 'express';
import { Product } from '../models/product';
import { productStore, resetProducts } from '../dataStore';
import { logger } from '../logger';

const TAG = 'Products';
const router = express.Router();

logger.seed('products', productStore.all().length);

export { resetProducts };

// Create a new product
router.post('/', (req, res) => {
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
  const product = productStore.findById(parseInt(id));
  if (product) {
    logger.debug(TAG, `Found product: ${product.name} (SKU: ${product.sku})`);
    res.json(product);
  } else {
    logger.warn(TAG, `Product not found: id=${id}`);
    res.status(404).send('Product not found');
  }
});

// Update a product by ID
router.put('/:id', (req, res) => {
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
