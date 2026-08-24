/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Aggregate API endpoints for dashboards and reporting
 */

import express from 'express';
import {
  getDeliveryPerformance,
  getLowStock,
  getOrdersByStatus,
  getRecentOrders,
  getSummary,
  getTopProducts,
  parseLimit
} from '../analytics';
import { logger } from '../logger';

const TAG = 'Analytics';
const router = express.Router();

/**
 * @swagger
 * /api/analytics/summary:
 *   get:
 *     summary: Returns dashboard KPI totals
 *     tags: [Analytics]
 */
router.get('/summary', (req, res) => {
  logger.route(TAG, 'GET /summary - Returning analytics summary');
  res.json(getSummary());
});

/**
 * @swagger
 * /api/analytics/orders-by-status:
 *   get:
 *     summary: Returns order counts for every known status
 *     tags: [Analytics]
 */
router.get('/orders-by-status', (req, res) => {
  logger.route(TAG, 'GET /orders-by-status - Returning order status counts');
  res.json(getOrdersByStatus());
});

/**
 * @swagger
 * /api/analytics/delivery-performance:
 *   get:
 *     summary: Returns on-time and late delivery counts
 *     tags: [Analytics]
 */
router.get('/delivery-performance', (req, res) => {
  logger.route(TAG, 'GET /delivery-performance - Returning delivery performance');
  res.json(getDeliveryPerformance());
});

/**
 * @swagger
 * /api/analytics/recent-orders:
 *   get:
 *     summary: Returns recent orders ordered by date descending
 *     tags: [Analytics]
 */
router.get('/recent-orders', (req, res) => {
  const limit = parseLimit(req.query.limit);
  if (!limit) {
    res.status(400).json({ error: 'limit must be an integer between 1 and 25' });
    return;
  }
  logger.route(TAG, `GET /recent-orders - Returning ${limit} recent orders`);
  res.json(getRecentOrders(limit));
});

/**
 * @swagger
 * /api/analytics/top-products:
 *   get:
 *     summary: Returns top products ranked by units sold and revenue
 *     tags: [Analytics]
 */
router.get('/top-products', (req, res) => {
  const limit = parseLimit(req.query.limit);
  if (!limit) {
    res.status(400).json({ error: 'limit must be an integer between 1 and 25' });
    return;
  }
  logger.route(TAG, `GET /top-products - Returning ${limit} top products`);
  res.json(getTopProducts(limit));
});

/**
 * @swagger
 * /api/analytics/low-stock:
 *   get:
 *     summary: Returns products at or below reorder point
 *     tags: [Analytics]
 */
router.get('/low-stock', (req, res) => {
  logger.route(TAG, 'GET /low-stock - Returning low stock products');
  res.json(getLowStock());
});

export default router;
