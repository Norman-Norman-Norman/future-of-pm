/**
 * @swagger
 * tags:
 *   name: Recommendations
 *   description: API endpoints for product recommendations
 */

/**
 * @swagger
 * /api/recommendations/popular:
 *   get:
 *     summary: Returns the most popular products by order frequency
 *     tags: [Recommendations]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Maximum number of results to return
 *     responses:
 *       200:
 *         description: List of popular products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *
 * /api/recommendations/for-you:
 *   get:
 *     summary: Returns personalized product recommendations based on order history
 *     tags: [Recommendations]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Maximum number of results to return
 *     responses:
 *       200:
 *         description: List of recommended products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *
 * /api/recommendations/similar/{productId}:
 *   get:
 *     summary: Returns products similar to the given product by category/attributes
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Maximum number of results to return
 *     responses:
 *       200:
 *         description: List of similar products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *
 * /api/recommendations/frequently-bought-together/{productId}:
 *   get:
 *     summary: Returns products commonly ordered together with the given product
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Maximum number of results to return
 *     responses:
 *       200:
 *         description: List of frequently bought together products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */

import express from 'express';
import { Product } from '../models/product';
import { OrderDetail } from '../models/orderDetail';
import { products as seedProducts, orderDetails as seedOrderDetails } from '../seedData';

const router = express.Router();

const DEFAULT_LIMIT = 5;

let products: Product[] = [...seedProducts];
let orderDetails: OrderDetail[] = [...seedOrderDetails];

export const resetRecommendations = () => {
    products = [...seedProducts];
    orderDetails = [...seedOrderDetails];
};

// Build co-occurrence matrix from order details
const buildCoOccurrenceMatrix = (): Record<number, Record<number, number>> => {
    const orderMap: Record<number, number[]> = {};
    for (const detail of orderDetails) {
        if (!orderMap[detail.orderId]) {
            orderMap[detail.orderId] = [];
        }
        orderMap[detail.orderId].push(detail.productId);
    }

    const matrix: Record<number, Record<number, number>> = {};
    for (const productIds of Object.values(orderMap)) {
        for (const pid1 of productIds) {
            for (const pid2 of productIds) {
                if (pid1 !== pid2) {
                    if (!matrix[pid1]) matrix[pid1] = {};
                    matrix[pid1][pid2] = (matrix[pid1][pid2] || 0) + 1;
                }
            }
        }
    }
    return matrix;
};

// Count order frequency per product
const buildOrderFrequency = (): Record<number, number> => {
    const freq: Record<number, number> = {};
    for (const detail of orderDetails) {
        freq[detail.productId] = (freq[detail.productId] || 0) + 1;
    }
    return freq;
};

// GET /popular — top products by order frequency
router.get('/popular', (req, res) => {
    const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;
    const freq = buildOrderFrequency();

    const sorted = [...products]
        .filter(p => freq[p.productId] !== undefined)
        .sort((a, b) => (freq[b.productId] || 0) - (freq[a.productId] || 0))
        .slice(0, limit);

    res.json(sorted);
});

// GET /for-you — personalized recommendations (MVP: same as popular)
router.get('/for-you', (req, res) => {
    const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;
    const freq = buildOrderFrequency();

    const sorted = [...products]
        .filter(p => freq[p.productId] !== undefined)
        .sort((a, b) => (freq[b.productId] || 0) - (freq[a.productId] || 0))
        .slice(0, limit);

    res.json(sorted);
});

// GET /similar/:productId — products similar by supplier (category proxy)
router.get('/similar/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);
    const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;

    const source = products.find(p => p.productId === productId);
    if (!source) {
        res.status(404).send('Product not found');
    } else {
        const similar = products
            .filter(p => p.productId !== productId && p.supplierId === source.supplierId)
            .slice(0, limit);
        res.json(similar);
    }
});

// GET /frequently-bought-together/:productId — co-occurrence based recommendations
router.get('/frequently-bought-together/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);
    const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;

    const source = products.find(p => p.productId === productId);
    if (!source) {
        res.status(404).send('Product not found');
    } else {
        const matrix = buildCoOccurrenceMatrix();
        const coOccurrences = matrix[productId] || {};

        const result = Object.entries(coOccurrences)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([pid]) => products.find(p => p.productId === parseInt(pid)))
            .filter((p): p is Product => p !== undefined);

        res.json(result);
    }
});

export default router;
