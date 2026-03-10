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
 *             type: object
 *             required: [supplierId, name, price, sku]
 *             properties:
 *               productId:
 *                 type: integer
 *               supplierId:
 *                 type: integer
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Must be greater than 0
 *               sku:
 *                 type: string
 *                 pattern: '^[a-zA-Z0-9-]+$'
 *                 description: Alphanumeric characters and hyphens only
 *               unit:
 *                 type: string
 *               imgName:
 *                 type: string
 *               discount:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
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
 *             type: object
 *             required: [supplierId, name, price, sku]
 *             properties:
 *               productId:
 *                 type: integer
 *               supplierId:
 *                 type: integer
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 minimum: 0.01
 *               sku:
 *                 type: string
 *                 pattern: '^[a-zA-Z0-9-]+$'
 *               unit:
 *                 type: string
 *               imgName:
 *                 type: string
 *               discount:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
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
import { products as seedProducts } from '../seedData';
import { validate } from '../validation/middleware';
import { ProductBodySchema } from '../validation/schemas';

const router = express.Router();

let products: Product[] = [...seedProducts];

export const resetProducts = () => {
  products = [...seedProducts];
};

// Create a new product
router.post('/', validate(ProductBodySchema), (req, res) => {
  const newProduct: Product = req.body;
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Get all products
router.get('/', (req, res) => {
  res.json(products);
});

// Get a product by ID
router.get('/:id', (req, res) => {
  const product = products.find(p => p.productId === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Product not found');
  }
});

// Update a product by ID
router.put('/:id', validate(ProductBodySchema), (req, res) => {
  const index = products.findIndex(p => p.productId === parseInt(req.params.id));
  if (index !== -1) {
    products[index] = req.body;
    res.json(products[index]);
  } else {
    res.status(404).send('Product not found');
  }
});

// Delete a product by ID
router.delete('/:id', (req, res) => {
  const index = products.findIndex(p => p.productId === parseInt(req.params.id));
  if (index !== -1) {
    products.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Product not found');
  }
});

export default router;
