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
 *
 * /api/orders/{id}/status:
 *   put:
 *     summary: Transition order status
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
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 description: The target status to transition to
 *               reason:
 *                 type: string
 *                 description: Reason for the transition (required for rejected/cancelled)
 *               changedBy:
 *                 type: string
 *                 description: Who is performing the transition
 *     responses:
 *       200:
 *         description: Status transitioned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid status transition or missing required fields
 *       404:
 *         description: Order not found
 *
 * /api/orders/{id}/history:
 *   get:
 *     summary: Get status change history for an order
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
 *         description: Status history retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StatusHistoryEntry'
 *       404:
 *         description: Order not found
 */

import express from 'express';
import { Order, StatusHistoryEntry } from '../models/order';
import { orders as seedOrders } from '../seedData';

const router = express.Router();

let orders: Order[] = [...seedOrders];

export const resetOrders = () => { orders = [...seedOrders]; };

// Valid state machine transitions: from → allowed next statuses
const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ['submitted'],
  submitted: ['approved', 'rejected'],
  approved: ['processing'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  rejected: [],
  delivered: [],
  cancelled: [],
};

// Statuses that require a reason
const REASON_REQUIRED: Set<string> = new Set(['rejected', 'cancelled']);

// Create a new order
router.post('/', (req, res) => {
  const newOrder: Order = {
    ...req.body,
    statusHistory: req.body.statusHistory ?? [
      { from: null, to: req.body.status ?? 'draft', timestamp: new Date().toISOString() }
    ],
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// Get all orders
router.get('/', (req, res) => {
  res.json(orders);
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

// Transition order status
router.put('/:id/status', (req, res): void => {
  const index = orders.findIndex(o => o.orderId === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).send('Order not found');
    return;
  }

  const order = orders[index];
  const { status: newStatus, reason, changedBy } = req.body;

  if (!newStatus) {
    res.status(400).json({ error: 'Missing required field: status' });
    return;
  }

  const allowedTransitions = VALID_TRANSITIONS[order.status] ?? [];
  if (!allowedTransitions.includes(newStatus)) {
    res.status(400).json({
      error: `Invalid status transition from "${order.status}" to "${newStatus}"`,
    });
    return;
  }

  if (REASON_REQUIRED.has(newStatus) && !reason) {
    res.status(400).json({
      error: `A reason is required when transitioning to "${newStatus}"`,
    });
    return;
  }

  const historyEntry: StatusHistoryEntry = {
    from: order.status,
    to: newStatus,
    timestamp: new Date().toISOString(),
    ...(reason ? { reason } : {}),
    ...(changedBy ? { changedBy } : {}),
  };

  orders[index] = {
    ...order,
    status: newStatus,
    statusHistory: [...order.statusHistory, historyEntry],
  };

  res.json(orders[index]);
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

// Get status history for an order
router.get('/:id/history', (req, res): void => {
  const order = orders.find(o => o.orderId === parseInt(req.params.id));
  if (!order) {
    res.status(404).send('Order not found');
    return;
  }
  res.json(order.statusHistory);
});

export default router;
