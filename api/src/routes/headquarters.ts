/**
 * @swagger
 * tags:
 *   name: Headquarters
 *   description: API endpoints for managing headquarters locations
 */

/**
 * @swagger
 * /api/headquarters:
 *   get:
 *     summary: Returns all headquarters
 *     tags: [Headquarters]
 *     responses:
 *       200:
 *         description: List of all headquarters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Headquarters'
 *   post:
 *     summary: Create a new headquarters
 *     tags: [Headquarters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Headquarters'
 *     responses:
 *       201:
 *         description: Headquarters created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Headquarters'
 * 
 * /api/headquarters/{id}:
 *   get:
 *     summary: Get a headquarters by ID
 *     tags: [Headquarters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Headquarters ID
 *     responses:
 *       200:
 *         description: Headquarters found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Headquarters'
 *       404:
 *         description: Headquarters not found
 *   put:
 *     summary: Update a headquarters
 *     tags: [Headquarters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Headquarters ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Headquarters'
 *     responses:
 *       200:
 *         description: Headquarters updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Headquarters'
 *       404:
 *         description: Headquarters not found
 *   delete:
 *     summary: Delete a headquarters
 *     tags: [Headquarters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Headquarters ID
 *     responses:
 *       204:
 *         description: Headquarters deleted successfully
 *       404:
 *         description: Headquarters not found
 */

import express from 'express';
import { Headquarters } from '../models/headquarters';
import { headquarters as seedHeadquarters } from '../seedData';
import { logger } from '../logger';

const TAG = 'Headquarters';
const router = express.Router();

let headquartersList: Headquarters[] = [...seedHeadquarters];
logger.seed('headquarters', headquartersList.length);

// Create a new headquarters
router.post('/', (req, res) => {
  logger.route(TAG, 'POST / - Creating new headquarters', { body: req.body });
  const newHeadquarters: Headquarters = req.body;
  headquartersList.push(newHeadquarters);
  logger.info(TAG, `Headquarters created: ${newHeadquarters.name}`, { headquartersId: newHeadquarters.headquartersId, total: headquartersList.length });
  res.status(201).json(newHeadquarters);
});

// Get all headquarters
router.get('/', (req, res) => {
  logger.route(TAG, `GET / - Returning all headquarters (${headquartersList.length} records)`);
  res.json(headquartersList);
});

// Get a headquarters by ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  logger.route(TAG, `GET /${id} - Looking up headquarters`);
  const headquarters = headquartersList.find(h => h.headquartersId === parseInt(id));
  if (headquarters) {
    logger.debug(TAG, `Found headquarters: ${headquarters.name}`);
    res.json(headquarters);
  } else {
    logger.warn(TAG, `Headquarters not found: id=${id}`);
    res.status(404).send('Headquarters not found');
  }
});

// Update a headquarters by ID
router.put('/:id', (req, res) => {
  const id = req.params.id;
  logger.route(TAG, `PUT /${id} - Updating headquarters`, { body: req.body });
  const index = headquartersList.findIndex(h => h.headquartersId === parseInt(id));
  if (index !== -1) {
    headquartersList[index] = req.body;
    logger.info(TAG, `Headquarters updated: id=${id}`);
    res.json(headquartersList[index]);
  } else {
    logger.warn(TAG, `Headquarters not found for update: id=${id}`);
    res.status(404).send('Headquarters not found');
  }
});

// Delete a headquarters by ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  logger.route(TAG, `DELETE /${id} - Deleting headquarters`);
  const index = headquartersList.findIndex(h => h.headquartersId === parseInt(id));
  if (index !== -1) {
    const deleted = headquartersList.splice(index, 1);
    logger.info(TAG, `Headquarters deleted: ${deleted[0].name}`, { remaining: headquartersList.length });
    res.status(204).send();
  } else {
    logger.warn(TAG, `Headquarters not found for deletion: id=${id}`);
    res.status(404).send('Headquarters not found');
  }
});

export default router;
