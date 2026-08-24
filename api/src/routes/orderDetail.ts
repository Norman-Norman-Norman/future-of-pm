/**
 * @swagger
 * tags:
 *   name: Order Details
 *   description: API endpoints for managing order details
 */

/**
 * @swagger
 * /api/order-details:
 *   get:
 *     summary: Returns all order details
 *     tags: [Order Details]
 *     responses:
 *       200:
 *         description: List of all order details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderDetail'
 *   post:
 *     summary: Create a new order detail
 *     tags: [Order Details]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderDetail'
 *     responses:
 *       201:
 *         description: Order detail created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderDetail'
 * 
 * /api/order-details/{id}:
 *   get:
 *     summary: Get an order detail by ID
 *     tags: [Order Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order detail ID
 *     responses:
 *       200:
 *         description: Order detail found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderDetail'
 *       404:
 *         description: Order detail not found
 *   put:
 *     summary: Update an order detail
 *     tags: [Order Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order detail ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderDetail'
 *     responses:
 *       200:
 *         description: Order detail updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderDetail'
 *       404:
 *         description: Order detail not found
 *   delete:
 *     summary: Delete an order detail
 *     tags: [Order Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order detail ID
 *     responses:
 *       204:
 *         description: Order detail deleted successfully
 *       404:
 *         description: Order detail not found
 */

import express from 'express';
import { OrderDetail } from '../models/orderDetail';
import { orderDetailStore, resetOrderDetails } from '../dataStore';
import { logger } from '../logger';

const TAG = 'OrderDetails';
const router = express.Router();

logger.seed('orderDetails', orderDetailStore.all().length);

export { resetOrderDetails };

// Create a new order detail
router.post('/', (req, res) => {
  logger.route(TAG, 'POST / - Creating new order detail', { body: req.body });
  const newOrderDetail: OrderDetail = req.body;
  orderDetailStore.add(newOrderDetail);
  logger.info(TAG, `Order detail created`, { orderDetailId: newOrderDetail.orderDetailId, totalOrderDetails: orderDetailStore.all().length });
  res.status(201).json(newOrderDetail);
});

// Get all order details
router.get('/', (req, res) => {
  const orderDetails = orderDetailStore.all();
  logger.route(TAG, `GET / - Returning all order details (${orderDetails.length} records)`);
  res.json(orderDetails);
});

// Get an order detail by ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  logger.route(TAG, `GET /${id} - Looking up order detail`);
  const orderDetail = orderDetailStore.findById(parseInt(id));
  if (orderDetail) {
    logger.debug(TAG, `Found order detail: id=${id}`);
    res.json(orderDetail);
  } else {
    logger.warn(TAG, `Order detail not found: id=${id}`);
    res.status(404).send('Order detail not found');
  }
});

// Update an order detail by ID
router.put('/:id', (req, res) => {
  const id = req.params.id;
  logger.route(TAG, `PUT /${id} - Updating order detail`, { body: req.body });
  const orderDetail = orderDetailStore.replace(parseInt(id), req.body);
  if (orderDetail) {
    logger.info(TAG, `Order detail updated: id=${id}`);
    res.json(orderDetail);
  } else {
    logger.warn(TAG, `Order detail not found for update: id=${id}`);
    res.status(404).send('Order detail not found');
  }
});

// Delete an order detail by ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  logger.route(TAG, `DELETE /${id} - Deleting order detail`);
  const deleted = orderDetailStore.remove(parseInt(id));
  if (deleted) {
    logger.info(TAG, `Order detail deleted: id=${id}`, { remainingOrderDetails: orderDetailStore.all().length });
    res.status(204).send();
  } else {
    logger.warn(TAG, `Order detail not found for deletion: id=${id}`);
    res.status(404).send('Order detail not found');
  }
});

export default router;
