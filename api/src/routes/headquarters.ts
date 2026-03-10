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
 *     summary: Returns a paginated list of headquarters
 *     tags: [Headquarters]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name]
 *         description: Field to sort by
 *       - $ref: '#/components/parameters/sortOrderParam'
 *     responses:
 *       200:
 *         description: Paginated list of headquarters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Headquarters'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationMeta'
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
import { parsePaginationParams, applyPaginationSortFilter } from '../utils/pagination';

const router = express.Router();

let headquartersList: Headquarters[] = [...seedHeadquarters];

// Add reset function for testing
export const resetHeadquarters = () => {
  headquartersList = [...seedHeadquarters];
};

// Create a new headquarters
router.post('/', (req, res) => {
  const newHeadquarters: Headquarters = req.body;
  headquartersList.push(newHeadquarters);
  res.status(201).json(newHeadquarters);
});

// Get all headquarters
router.get('/', (req, res) => {
  const params = parsePaginationParams(req.query as Record<string, string>);
  const result = applyPaginationSortFilter(headquartersList, params, {}, ['name']);
  res.json(result);
});

// Get a headquarters by ID
router.get('/:id', (req, res) => {
  const headquarters = headquartersList.find(h => h.headquartersId === parseInt(req.params.id));
  if (headquarters) {
    res.json(headquarters);
  } else {
    res.status(404).send('Headquarters not found');
  }
});

// Update a headquarters by ID
router.put('/:id', (req, res) => {
  const index = headquartersList.findIndex(h => h.headquartersId === parseInt(req.params.id));
  if (index !== -1) {
    headquartersList[index] = req.body;
    res.json(headquartersList[index]);
  } else {
    res.status(404).send('Headquarters not found');
  }
});

// Delete a headquarters by ID
router.delete('/:id', (req, res) => {
  const index = headquartersList.findIndex(h => h.headquartersId === parseInt(req.params.id));
  if (index !== -1) {
    headquartersList.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Headquarters not found');
  }
});

export default router;
