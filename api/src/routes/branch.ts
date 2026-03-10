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
 *             type: object
 *             required: [headquartersId, name, email]
 *             properties:
 *               branchId:
 *                 type: integer
 *               headquartersId:
 *                 type: integer
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               contactPerson:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Branch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
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
 *             type: object
 *             required: [headquartersId, name, email]
 *             properties:
 *               branchId:
 *                 type: integer
 *               headquartersId:
 *                 type: integer
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               contactPerson:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Branch updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
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
import { validate } from '../validation/middleware';
import { BranchBodySchema } from '../validation/schemas';

const router = express.Router();

let branches: Branch[] = [...seedBranches];

// Add reset function for testing
export const resetBranches = () => {
  branches = [...seedBranches];
};

// Create a new branch
router.post('/', validate(BranchBodySchema), (req, res) => {
  const newBranch: Branch = req.body;
  branches.push(newBranch);
  res.status(201).json(newBranch);
});

// Get all branches
router.get('/', (req, res) => {
  res.json(branches);
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
router.put('/:id', validate(BranchBodySchema), (req, res) => {
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
