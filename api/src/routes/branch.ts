/**
 * @swagger
 * tags:
 *   name: Branches
 *   description: API endpoints for managing branches
 */

/**
 * @swagger
 * /api/branches:
 *   get:
 *     summary: Returns all branches
 *     tags: [Branches]
 *     responses:
 *       200:
 *         description: List of all branches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Branch'
 *   post:
 *     summary: Create a new branch
 *     tags: [Branches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Branch'
 *     responses:
 *       201:
 *         description: Branch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 * 
 * /api/branches/{id}:
 *   get:
 *     summary: Get a branch by ID
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: Branch found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       404:
 *         description: Branch not found
 *   put:
 *     summary: Update a branch
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Branch ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Branch'
 *     responses:
 *       200:
 *         description: Branch updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       404:
 *         description: Branch not found
 *   delete:
 *     summary: Delete a branch
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Branch ID
 *     responses:
 *       204:
 *         description: Branch deleted successfully
 *       404:
 *         description: Branch not found
 */

import express from 'express';
import { Branch } from '../models/branch';
import { branches as seedBranches } from '../seedData';
import { logger } from '../logger';

const TAG = 'Branches';
const router = express.Router();

let branches: Branch[] = [...seedBranches];
logger.seed('branches', branches.length);

// Add reset function for testing
export const resetBranches = () => {
  logger.debug(TAG, 'Resetting branches to seed data');
  branches = [...seedBranches];
};

// Create a new branch
router.post('/', (req, res) => {
  logger.route(TAG, 'POST / - Creating new branch', { body: req.body });
  const newBranch: Branch = req.body;
  branches.push(newBranch);
  logger.info(TAG, `Branch created: ${newBranch.name}`, { branchId: newBranch.branchId, totalBranches: branches.length });
  res.status(201).json(newBranch);
});

// Get all branches
router.get('/', (req, res) => {
  logger.route(TAG, `GET / - Returning all branches (${branches.length} records)`);
  res.json(branches);
});

// Get a branch by ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  logger.route(TAG, `GET /${id} - Looking up branch`);
  const branch = branches.find(b => b.branchId === parseInt(id));
  if (branch) {
    logger.debug(TAG, `Found branch: ${branch.name}`);
    res.json(branch);
  } else {
    logger.warn(TAG, `Branch not found: id=${id}`);
    res.status(404).send('Branch not found');
  }
});

// Update a branch by ID
router.put('/:id', (req, res) => {
  const id = req.params.id;
  logger.route(TAG, `PUT /${id} - Updating branch`, { body: req.body });
  const index = branches.findIndex(b => b.branchId === parseInt(id));
  if (index !== -1) {
    branches[index] = req.body;
    logger.info(TAG, `Branch updated: id=${id}`, { updated: branches[index] });
    res.json(branches[index]);
  } else {
    logger.warn(TAG, `Branch not found for update: id=${id}`);
    res.status(404).send('Branch not found');
  }
});

// Delete a branch by ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  logger.route(TAG, `DELETE /${id} - Deleting branch`);
  const index = branches.findIndex(b => b.branchId === parseInt(id));
  if (index !== -1) {
    const deleted = branches.splice(index, 1);
    logger.info(TAG, `Branch deleted: ${deleted[0].name}`, { remainingBranches: branches.length });
    res.status(204).send();
  } else {
    logger.warn(TAG, `Branch not found for deletion: id=${id}`);
    res.status(404).send('Branch not found');
  }
});

export default router;
