/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API endpoints for managing orders
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Returns all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 * 
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *   put:
 *     summary: Update an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       204:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */

import express from 'express';
import { Order } from '../models/order';
import { orders as seedOrders } from '../seedData';
import { logger } from '../logger';

const TAG = 'Orders';
const router = express.Router();

let orders: Order[] = [...seedOrders];
logger.seed('orders', orders.length);

// Create a new order
router.post('/', (req, res) => {
  logger.route(TAG, 'POST / - Creating new order', { body: req.body });
  const newOrder: Order = req.body;
  orders.push(newOrder);
  logger.info(TAG, `Order created`, { orderId: newOrder.orderId, totalOrders: orders.length });
  res.status(201).json(newOrder);
});

// Get all orders
router.get('/', (req, res) => {
  logger.route(TAG, `GET / - Returning all orders (${orders.length} records)`);
  res.json(orders);
});

// Get an order by ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  logger.route(TAG, `GET /${id} - Looking up order`);
  const order = orders.find(o => o.orderId === parseInt(id));
  if (order) {
    logger.debug(TAG, `Found order: id=${id}`);
    res.json(order);
  } else {
    logger.warn(TAG, `Order not found: id=${id}`);
    res.status(404).send('Order not found');
  }
});

// Update an order by ID
router.put('/:id', (req, res) => {
  const id = req.params.id;
  logger.route(TAG, `PUT /${id} - Updating order`, { body: req.body });
  const index = orders.findIndex(o => o.orderId === parseInt(id));
  if (index !== -1) {
    orders[index] = req.body;
    logger.info(TAG, `Order updated: id=${id}`);
    res.json(orders[index]);
  } else {
    logger.warn(TAG, `Order not found for update: id=${id}`);
    res.status(404).send('Order not found');
  }
});

// Delete an order by ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  logger.route(TAG, `DELETE /${id} - Deleting order`);
  const index = orders.findIndex(o => o.orderId === parseInt(id));
  if (index !== -1) {
    orders.splice(index, 1);
    logger.info(TAG, `Order deleted: id=${id}`, { remainingOrders: orders.length });
    res.status(204).send();
  } else {
    logger.warn(TAG, `Order not found for deletion: id=${id}`);
    res.status(404).send('Order not found');
  }
});

export default router;
