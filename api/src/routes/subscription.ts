/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: API endpoints for managing autoship subscriptions
 */

/**
 * @swagger
 * /api/subscriptions:
 *   get:
 *     summary: Returns all subscriptions
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: List of all subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscription'
 *   post:
 *     summary: Create a new subscription
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscription'
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *
 * /api/subscriptions/{id}:
 *   get:
 *     summary: Get a subscription by ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subscription ID
 *     responses:
 *       200:
 *         description: Subscription found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Subscription not found
 *   put:
 *     summary: Update a subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subscription ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscription'
 *     responses:
 *       200:
 *         description: Subscription updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Subscription not found
 *   delete:
 *     summary: Delete a subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subscription ID
 *     responses:
 *       204:
 *         description: Subscription deleted successfully
 *       404:
 *         description: Subscription not found
 */

import express from 'express';
import { Subscription } from '../models/subscription';
import { subscriptions as seedSubscriptions } from '../seedData';

const router = express.Router();

let subscriptions: Subscription[] = [...seedSubscriptions];

export const resetSubscriptions = () => {
  subscriptions = [...seedSubscriptions];
};

// Create a new subscription
router.post('/', (req, res) => {
  const newSubscription: Subscription = req.body;
  subscriptions.push(newSubscription);
  res.status(201).json(newSubscription);
});

// Get all subscriptions
router.get('/', (req, res) => {
  res.json(subscriptions);
});

// Get a subscription by ID
router.get('/:id', (req, res) => {
  const subscription = subscriptions.find(s => s.subscriptionId === parseInt(req.params.id));
  if (subscription) {
    res.json(subscription);
  } else {
    res.status(404).send('Subscription not found');
  }
});

// Update a subscription by ID
router.put('/:id', (req, res) => {
  const index = subscriptions.findIndex(s => s.subscriptionId === parseInt(req.params.id));
  if (index !== -1) {
    subscriptions[index] = req.body;
    res.json(subscriptions[index]);
  } else {
    res.status(404).send('Subscription not found');
  }
});

// Delete a subscription by ID
router.delete('/:id', (req, res) => {
  const index = subscriptions.findIndex(s => s.subscriptionId === parseInt(req.params.id));
  if (index !== -1) {
    subscriptions.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Subscription not found');
  }
});

export default router;
