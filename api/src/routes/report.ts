/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Supply chain report endpoints
 */

/**
 * @swagger
 * /api/reports/orders-by-status:
 *   get:
 *     summary: Orders grouped by status with count and total value
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Orders by status summary
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                   count:
 *                     type: integer
 *                   totalValue:
 *                     type: number
 *
 * /api/reports/inventory-levels:
 *   get:
 *     summary: All products with inventory information
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Inventory levels report
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
 *                   sku:
 *                     type: string
 *                   price:
 *                     type: number
 *                   unit:
 *                     type: string
 *                   supplierName:
 *                     type: string
 *
 * /api/reports/delivery-performance:
 *   get:
 *     summary: Delivery performance grouped by status
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Delivery performance report
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                   count:
 *                     type: integer
 *                   supplierName:
 *                     type: string
 *
 * /api/reports/product-sales:
 *   get:
 *     summary: Top products by quantity ordered
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Product sales report
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: integer
 *                   productName:
 *                     type: string
 *                   totalQuantity:
 *                     type: integer
 *                   totalRevenue:
 *                     type: number
 *
 * /api/reports/supplier-activity:
 *   get:
 *     summary: Orders and deliveries per supplier
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Supplier activity report
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   supplierId:
 *                     type: integer
 *                   supplierName:
 *                     type: string
 *                   deliveryCount:
 *                     type: integer
 *                   productCount:
 *                     type: integer
 */

import express from 'express';
import {
  orders,
  orderDetails,
  products,
  deliveries,
  suppliers,
} from '../seedData';

const router = express.Router();

// Orders by Status Summary
router.get('/orders-by-status', (_req, res) => {
  const statusMap: Record<string, { count: number; totalValue: number }> = {};

  for (const order of orders) {
    const status = order.status;
    if (!statusMap[status]) {
      statusMap[status] = { count: 0, totalValue: 0 };
    }
    statusMap[status].count += 1;
  }

  // Add order detail values to each order's status bucket
  for (const detail of orderDetails) {
    const order = orders.find((o) => o.orderId === detail.orderId);
    if (order && statusMap[order.status]) {
      statusMap[order.status].totalValue += detail.quantity * detail.unitPrice;
    }
  }

  const result = Object.entries(statusMap).map(([status, data]) => ({
    status,
    count: data.count,
    totalValue: Math.round(data.totalValue * 100) / 100,
  }));

  res.json(result);
});

// Inventory Levels
router.get('/inventory-levels', (_req, res) => {
  const result = products.map((product) => {
    const supplier = suppliers.find((s) => s.supplierId === product.supplierId);
    return {
      productId: product.productId,
      name: product.name,
      sku: product.sku,
      price: product.price,
      unit: product.unit,
      supplierId: product.supplierId,
      supplierName: supplier ? supplier.name : 'Unknown',
    };
  });

  res.json(result);
});

// Delivery Performance
router.get('/delivery-performance', (_req, res) => {
  const result = deliveries.map((delivery) => {
    const supplier = suppliers.find((s) => s.supplierId === delivery.supplierId);
    return {
      deliveryId: delivery.deliveryId,
      name: delivery.name,
      status: delivery.status,
      deliveryDate: delivery.deliveryDate,
      supplierId: delivery.supplierId,
      supplierName: supplier ? supplier.name : 'Unknown',
    };
  });

  res.json(result);
});

// Product Sales
router.get('/product-sales', (_req, res) => {
  const salesMap: Record<number, { productName: string; totalQuantity: number; totalRevenue: number }> = {};

  for (const detail of orderDetails) {
    if (!salesMap[detail.productId]) {
      const product = products.find((p) => p.productId === detail.productId);
      salesMap[detail.productId] = {
        productName: product ? product.name : `Product #${detail.productId}`,
        totalQuantity: 0,
        totalRevenue: 0,
      };
    }
    salesMap[detail.productId].totalQuantity += detail.quantity;
    salesMap[detail.productId].totalRevenue += detail.quantity * detail.unitPrice;
  }

  const result = Object.entries(salesMap)
    .map(([productId, data]) => ({
      productId: parseInt(productId),
      productName: data.productName,
      totalQuantity: data.totalQuantity,
      totalRevenue: Math.round(data.totalRevenue * 100) / 100,
    }))
    .sort((a, b) => b.totalQuantity - a.totalQuantity);

  res.json(result);
});

// Supplier Activity
router.get('/supplier-activity', (_req, res) => {
  const result = suppliers.map((supplier) => {
    const supplierDeliveries = deliveries.filter(
      (d) => d.supplierId === supplier.supplierId
    );
    const supplierProducts = products.filter(
      (p) => p.supplierId === supplier.supplierId
    );

    return {
      supplierId: supplier.supplierId,
      supplierName: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      deliveryCount: supplierDeliveries.length,
      productCount: supplierProducts.length,
    };
  });

  res.json(result);
});

export default router;
