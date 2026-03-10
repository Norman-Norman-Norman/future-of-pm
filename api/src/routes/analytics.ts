/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: API endpoints for analytics data
 */

/**
 * @swagger
 * /api/analytics/frequent-products:
 *   get:
 *     summary: Get most-ordered products for a branch
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: branchId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Branch ID to filter by
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Maximum number of products to return
 *     responses:
 *       200:
 *         description: List of most-ordered products with order counts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   imgName:
 *                     type: string
 *                   totalOrdered:
 *                     type: integer
 */

import express from 'express';
import { getOrders } from './order';
import { getOrderDetails } from './orderDetail';
import { products as seedProducts } from '../seedData';

const router = express.Router();

// GET /api/analytics/frequent-products?branchId=X&limit=5
router.get('/frequent-products', (req, res) => {
  const { branchId, limit } = req.query;
  const topN = limit ? parseInt(limit as string, 10) : 5;

  const orders = getOrders();
  const orderDetails = getOrderDetails();

  // Filter orders by branchId if provided
  const branchOrders = branchId !== undefined
    ? orders.filter(o => o.branchId === parseInt(branchId as string, 10))
    : orders;

  const branchOrderIds = new Set(branchOrders.map(o => o.orderId));

  // Aggregate total quantity ordered per product
  const totals: Record<number, number> = {};
  for (const detail of orderDetails) {
    if (branchOrderIds.has(detail.orderId)) {
      totals[detail.productId] = (totals[detail.productId] ?? 0) + detail.quantity;
    }
  }

  // Join with product data and sort by totalOrdered desc
  const results = Object.entries(totals)
    .map(([productIdStr, totalOrdered]) => {
      const productId = parseInt(productIdStr, 10);
      const product = seedProducts.find(p => p.productId === productId);
      if (!product) return null;
      return {
        productId: product.productId,
        name: product.name,
        price: product.price,
        imgName: product.imgName,
        discount: product.discount,
        totalOrdered
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.totalOrdered - a.totalOrdered)
    .slice(0, topN);

  res.json(results);
});

export default router;
