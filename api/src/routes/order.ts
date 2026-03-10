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
 *     summary: Returns all orders, with optional filtering and sorting
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: branchId
 *         schema:
 *           type: integer
 *         description: Filter orders by branch ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [orderDate]
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction (default desc)
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
 *
 * /api/orders/{id}/details:
 *   get:
 *     summary: Get an order with all its line items (order details)
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
 *         description: Order with nested order details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Order'
 *                 - type: object
 *                   properties:
 *                     orderDetails:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/OrderDetail'
 *       404:
 *         description: Order not found
 */

import express from 'express';
import { Order } from '../models/order';
import { orders as seedOrders, orderDetails as seedOrderDetails } from '../seedData';

const router = express.Router();

let orders: Order[] = [...seedOrders];

export const resetOrders = () => {
  orders = [...seedOrders];
};

// Create a new order
router.post('/', (req, res) => {
  const newOrder: Order = req.body;
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// Get all orders (supports ?branchId=X&sortBy=orderDate&order=desc)
router.get('/', (req, res) => {
  let result = [...orders];

  const { branchId, sortBy, order } = req.query;

  if (branchId !== undefined) {
    const id = parseInt(branchId as string);
    result = result.filter(o => o.branchId === id);
  }

  if (sortBy === 'orderDate') {
    const direction = order === 'asc' ? 1 : -1;
    result.sort((a, b) =>
      direction * (new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime())
    );
  }

  res.json(result);
});

// Get an order with its line items (details)
router.get('/:id/details', (req, res) => {
  const order = orders.find(o => o.orderId === parseInt(req.params.id));
  if (!order) {
    res.status(404).send('Order not found');
    return;
  }
  const details = seedOrderDetails.filter(d => d.orderId === order.orderId);
  res.json({ ...order, orderDetails: details });
});

// Get an order by ID
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.orderId === parseInt(req.params.id));
  if (order) {
    res.json(order);
  } else {
    res.status(404).send('Order not found');
  }
});

// Update an order by ID
router.put('/:id', (req, res) => {
  const index = orders.findIndex(o => o.orderId === parseInt(req.params.id));
  if (index !== -1) {
    orders[index] = req.body;
    res.json(orders[index]);
  } else {
    res.status(404).send('Order not found');
  }
});

// Delete an order by ID
router.delete('/:id', (req, res) => {
  const index = orders.findIndex(o => o.orderId === parseInt(req.params.id));
  if (index !== -1) {
    orders.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Order not found');
  }
});

export default router;
