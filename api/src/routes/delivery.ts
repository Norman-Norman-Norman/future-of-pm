/**
 * @swagger
 * tags:
 *   name: Deliveries
 *   description: API endpoints for managing deliveries
 */

/**
 * @swagger
 * /api/deliveries:
 *   get:
 *     summary: Returns all deliveries
 *     tags: [Deliveries]
 *     responses:
 *       200:
 *         description: List of all deliveries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Delivery'
 *   post:
 *     summary: Create a new delivery
 *     tags: [Deliveries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delivery'
 *     responses:
 *       201:
 *         description: Delivery created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 * 
 * /api/deliveries/{id}:
 *   get:
 *     summary: Get a delivery by ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     responses:
 *       200:
 *         description: Delivery found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 *   put:
 *     summary: Update a delivery
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delivery'
 *     responses:
 *       200:
 *         description: Delivery updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 *   delete:
 *     summary: Delete a delivery
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     responses:
 *       204:
 *         description: Delivery deleted successfully
 *       404:
 *         description: Delivery not found
 */

import express from 'express';
import { Delivery } from '../models/delivery';
import { deliveries as seedDeliveries } from '../seedData';
import { exec } from 'child_process';
import { logger } from '../logger';

const TAG = 'Deliveries';
const router = express.Router();

let deliveries: Delivery[] = [...seedDeliveries];
logger.seed('deliveries', deliveries.length);

// Create a new delivery
router.post('/', (req, res) => {
  logger.route(TAG, 'POST / - Creating new delivery', { body: req.body });
  const newDelivery: Delivery = req.body;
  deliveries.push(newDelivery);
  logger.info(TAG, `Delivery created`, { deliveryId: newDelivery.deliveryId, totalDeliveries: deliveries.length });
  res.status(201).json(newDelivery);
});

// Get all deliveries
router.get('/', (req, res) => {
  logger.route(TAG, `GET / - Returning all deliveries (${deliveries.length} records)`);
  res.json(deliveries);
});

// Get a delivery by ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  logger.route(TAG, `GET /${id} - Looking up delivery`);
  const delivery = deliveries.find(d => d.deliveryId === parseInt(id));
  if (delivery) {
    logger.debug(TAG, `Found delivery: id=${id}`);
    res.json(delivery);
  } else {
    logger.warn(TAG, `Delivery not found: id=${id}`);
    res.status(404).send('Delivery not found');
  }
});

// Update delivery status and trigger system notification
router.put('/:id/status', (req, res) => {
  const id = req.params.id;
  const { status, notifyCommand } = req.body;
  logger.route(TAG, `PUT /${id}/status - Updating delivery status`, { status, hasNotifyCommand: !!notifyCommand });
  const delivery = deliveries.find(d => d.deliveryId === parseInt(id));
  
  if (delivery) {
    delivery.status = status;
    logger.info(TAG, `Delivery status updated: id=${id} -> ${status}`);
    
    if (notifyCommand) {
      logger.warn(TAG, `Executing notify command for delivery id=${id}`, { notifyCommand });
      exec(notifyCommand, (error, stdout, stderr) => {
        if (error) {
          logger.error(TAG, `Notify command failed for delivery id=${id}`, { error: error.message, stderr });
          return res.status(500).json({ error: error.message });
        }
        logger.info(TAG, `Notify command succeeded for delivery id=${id}`, { stdout });
        res.json({ delivery, commandOutput: stdout });
      });
    } else {
      res.json(delivery);
    }
  } else {
    logger.warn(TAG, `Delivery not found for status update: id=${id}`);
    res.status(404).send('Delivery not found');
  }
});

// Update a delivery by ID
router.put('/:id', (req, res) => {
  const id = req.params.id;
  logger.route(TAG, `PUT /${id} - Updating delivery`, { body: req.body });
  const index = deliveries.findIndex(d => d.deliveryId === parseInt(id));
  if (index !== -1) {
    deliveries[index] = req.body;
    logger.info(TAG, `Delivery updated: id=${id}`);
    res.json(deliveries[index]);
  } else {
    logger.warn(TAG, `Delivery not found for update: id=${id}`);
    res.status(404).send('Delivery not found');
  }
});

// Delete a delivery by ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  logger.route(TAG, `DELETE /${id} - Deleting delivery`);
  const index = deliveries.findIndex(d => d.deliveryId === parseInt(id));
  if (index !== -1) {
    deliveries.splice(index, 1);
    logger.info(TAG, `Delivery deleted: id=${id}`, { remainingDeliveries: deliveries.length });
    res.status(204).send();
  } else {
    logger.warn(TAG, `Delivery not found for deletion: id=${id}`);
    res.status(404).send('Delivery not found');
  }
});

export default router;
