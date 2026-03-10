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
 *     summary: Returns a paginated list of branches
 *     tags: [Branches]
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
 *       - in: query
 *         name: headquartersId
 *         schema:
 *           type: integer
 *         description: Filter by headquarters ID
 *     responses:
 *       200:
 *         description: Paginated list of branches
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Branch'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationMeta'
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
import { parsePaginationParams, applyPaginationSortFilter } from '../utils/pagination';

const router = express.Router();

let branches: Branch[] = [...seedBranches];

// Add reset function for testing
export const resetBranches = () => {
  branches = [...seedBranches];
};

// Create a new branch
router.post('/', (req, res) => {
  const newBranch: Branch = req.body;
  branches.push(newBranch);
  res.status(201).json(newBranch);
});

// Get all branches
router.get('/', (req, res) => {
  const params = parsePaginationParams(req.query as Record<string, string>);
  const filters = {
    headquartersId: req.query.headquartersId,
  };
  const result = applyPaginationSortFilter(branches, params, filters as Record<string, unknown>, ['name']);
  res.json(result);
});

// Get a branch by ID
router.get('/:id', (req, res) => {
  const branch = branches.find(b => b.branchId === parseInt(req.params.id));
  if (branch) {
    res.json(branch);
  } else {
    res.status(404).send('Branch not found');
  }
});

// Update a branch by ID
router.put('/:id', (req, res) => {
  const index = branches.findIndex(b => b.branchId === parseInt(req.params.id));
  if (index !== -1) {
    branches[index] = req.body;
    res.json(branches[index]);
  } else {
    res.status(404).send('Branch not found');
  }
});

// Delete a branch by ID
router.delete('/:id', (req, res) => {
  const index = branches.findIndex(b => b.branchId === parseInt(req.params.id));
  if (index !== -1) {
    branches.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Branch not found');
  }
});

export default router;
