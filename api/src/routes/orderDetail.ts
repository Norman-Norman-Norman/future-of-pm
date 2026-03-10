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
 *     summary: Returns a paginated list of order details
 *     tags: [Order Details]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: integer
 *         description: Filter by order ID
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *         description: Filter by product ID
 *     responses:
 *       200:
 *         description: Paginated list of order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderDetail'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationMeta'
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
import { orderDetails as seedOrderDetails } from '../seedData';
import { parsePaginationParams, applyPaginationSortFilter } from '../utils/pagination';

const router = express.Router();

let orderDetails: OrderDetail[] = [...seedOrderDetails];

// Add reset function for testing
export const resetOrderDetails = () => {
  orderDetails = [...seedOrderDetails];
};

// Create a new order detail
router.post('/', (req, res) => {
  const newOrderDetail: OrderDetail = req.body;
  orderDetails.push(newOrderDetail);
  res.status(201).json(newOrderDetail);
});

// Get all order details
router.get('/', (req, res) => {
  const params = parsePaginationParams(req.query as Record<string, string>);
  const filters = {
    orderId: req.query.orderId,
    productId: req.query.productId,
  };
  const result = applyPaginationSortFilter(orderDetails, params, filters as Record<string, unknown>, []);
  res.json(result);
});

// Get an order detail by ID
router.get('/:id', (req, res) => {
  const orderDetail = orderDetails.find(od => od.orderDetailId === parseInt(req.params.id));
  if (orderDetail) {
    res.json(orderDetail);
  } else {
    res.status(404).send('Order detail not found');
  }
});

// Update an order detail by ID
router.put('/:id', (req, res) => {
  const index = orderDetails.findIndex(od => od.orderDetailId === parseInt(req.params.id));
  if (index !== -1) {
    orderDetails[index] = req.body;
    res.json(orderDetails[index]);
  } else {
    res.status(404).send('Order detail not found');
  }
});

// Delete an order detail by ID
router.delete('/:id', (req, res) => {
  const index = orderDetails.findIndex(od => od.orderDetailId === parseInt(req.params.id));
  if (index !== -1) {
    orderDetails.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Order detail not found');
  }
});

export default router;
