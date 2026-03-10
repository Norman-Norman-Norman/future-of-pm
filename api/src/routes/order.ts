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
 * /api/orders/pending-approval:
 *   get:
 *     summary: Get all orders awaiting approval
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of orders with pending-approval status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
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
 * /api/orders/{id}/approve:
 *   put:
 *     summary: Approve a pending-approval order
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
 *               - approvedBy
 *               - role
 *             properties:
 *               approvedBy:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, manager]
 *     responses:
 *       200:
 *         description: Order approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       403:
 *         description: Insufficient permissions to approve orders
 *       404:
 *         description: Order not found
 *
 * /api/orders/{id}/reject:
 *   put:
 *     summary: Reject a pending-approval order
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
 *               - rejectedBy
 *               - rejectionReason
 *               - role
 *             properties:
 *               rejectedBy:
 *                 type: string
 *               rejectionReason:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, manager]
 *     responses:
 *       200:
 *         description: Order rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       403:
 *         description: Insufficient permissions to reject orders
 *       404:
 *         description: Order not found
 */

import express from 'express';
import { Order } from '../models/order';
import { orders as seedOrders } from '../seedData';
import { getApprovalRules } from './approvalRule';

const router = express.Router();

let orders: Order[] = [...seedOrders];

export const resetOrders = () => {
  orders = [...seedOrders];
};

const APPROVER_ROLES = ['admin', 'manager'];

// Get all orders awaiting approval (must be before /:id route)
router.get('/pending-approval', (req, res) => {
  const pendingOrders = orders.filter(o => o.status === 'pending-approval');
  res.json(pendingOrders);
});

// Create a new order
router.post('/', (req, res) => {
  const newOrder: Order = req.body;

  // Check approval rules based on totalAmount
  if (newOrder.totalAmount !== undefined) {
    const totalAmount = newOrder.totalAmount;
    const rules = getApprovalRules();
    const matchingRule = rules.find(rule => {
      const aboveMin = totalAmount >= rule.minAmount;
      const belowMax = rule.maxAmount === undefined || totalAmount <= rule.maxAmount;
      const branchMatch = rule.branchId === undefined || rule.branchId === newOrder.branchId;
      return aboveMin && belowMax && branchMatch;
    });

    if (matchingRule) {
      newOrder.status = 'pending-approval';
    } else {
      newOrder.status = 'approved';
    }
  }

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

// Approve an order
router.put('/:id/approve', (req, res) => {
  const { approvedBy, role } = req.body;

  if (!APPROVER_ROLES.includes(role)) {
    res.status(403).json({ error: 'Insufficient permissions to approve orders' });
    return;
  }

  const index = orders.findIndex(o => o.orderId === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).send('Order not found');
    return;
  }

  orders[index] = {
    ...orders[index],
    status: 'approved',
    approvedBy,
  };
  res.json(orders[index]);
});

// Reject an order
router.put('/:id/reject', (req, res) => {
  const { rejectedBy, rejectionReason, role } = req.body;

  if (!APPROVER_ROLES.includes(role)) {
    res.status(403).json({ error: 'Insufficient permissions to reject orders' });
    return;
  }

  const index = orders.findIndex(o => o.orderId === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).send('Order not found');
    return;
  }

  orders[index] = {
    ...orders[index],
    status: 'rejected',
    rejectedBy,
    rejectionReason,
  };
  res.json(orders[index]);
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
