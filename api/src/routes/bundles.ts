/**
 * @swagger
 * tags:
 *   name: Bundles
 *   description: API endpoints for managing product bundles
 */

/**
 * @swagger
 * /api/bundles:
 *   get:
 *     summary: Returns all product bundles
 *     tags: [Bundles]
 *     responses:
 *       200:
 *         description: List of all product bundles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductBundle'
 *   post:
 *     summary: Create a new product bundle
 *     tags: [Bundles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductBundle'
 *     responses:
 *       201:
 *         description: Product bundle created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductBundle'
 *
 * /api/bundles/{id}:
 *   get:
 *     summary: Get a product bundle by ID
 *     tags: [Bundles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Bundle ID
 *     responses:
 *       200:
 *         description: Product bundle found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductBundle'
 *       404:
 *         description: Product bundle not found
 *   put:
 *     summary: Update a product bundle
 *     tags: [Bundles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Bundle ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductBundle'
 *     responses:
 *       200:
 *         description: Product bundle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductBundle'
 *       404:
 *         description: Product bundle not found
 *   delete:
 *     summary: Delete a product bundle
 *     tags: [Bundles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Bundle ID
 *     responses:
 *       204:
 *         description: Product bundle deleted successfully
 *       404:
 *         description: Product bundle not found
 */

import express from 'express';
import { ProductBundle } from '../models/productBundle';
import { productBundles as seedBundles } from '../seedData';

const router = express.Router();

let bundles: ProductBundle[] = [...seedBundles];

// Add reset function for testing
export const resetBundles = () => {
  bundles = [...seedBundles];
};

// Create a new bundle
router.post('/', (req, res) => {
  const newBundle: ProductBundle = req.body;
  bundles.push(newBundle);
  res.status(201).json(newBundle);
});

// Get all bundles
router.get('/', (req, res) => {
  res.json(bundles);
});

// Get a bundle by ID
router.get('/:id', (req, res) => {
  const bundle = bundles.find(b => b.bundleId === parseInt(req.params.id));
  if (bundle) {
    res.json(bundle);
  } else {
    res.status(404).send('Bundle not found');
  }
});

// Update a bundle by ID
router.put('/:id', (req, res) => {
  const index = bundles.findIndex(b => b.bundleId === parseInt(req.params.id));
  if (index !== -1) {
    bundles[index] = req.body;
    res.json(bundles[index]);
  } else {
    res.status(404).send('Bundle not found');
  }
});

// Delete a bundle by ID
router.delete('/:id', (req, res) => {
  const index = bundles.findIndex(b => b.bundleId === parseInt(req.params.id));
  if (index !== -1) {
    bundles.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Bundle not found');
  }
});

export default router;
