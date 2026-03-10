/**
 * @swagger
 * tags:
 *   name: ApprovalRules
 *   description: API endpoints for managing order approval rules
 */

/**
 * @swagger
 * /api/approval-rules:
 *   get:
 *     summary: Returns all approval rules
 *     tags: [ApprovalRules]
 *     responses:
 *       200:
 *         description: List of all approval rules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ApprovalRule'
 *   post:
 *     summary: Create a new approval rule
 *     tags: [ApprovalRules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApprovalRule'
 *     responses:
 *       201:
 *         description: Approval rule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApprovalRule'
 *
 * /api/approval-rules/{id}:
 *   get:
 *     summary: Get an approval rule by ID
 *     tags: [ApprovalRules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Approval rule ID
 *     responses:
 *       200:
 *         description: Approval rule found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApprovalRule'
 *       404:
 *         description: Approval rule not found
 *   put:
 *     summary: Update an approval rule
 *     tags: [ApprovalRules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Approval rule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApprovalRule'
 *     responses:
 *       200:
 *         description: Approval rule updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApprovalRule'
 *       404:
 *         description: Approval rule not found
 *   delete:
 *     summary: Delete an approval rule
 *     tags: [ApprovalRules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Approval rule ID
 *     responses:
 *       204:
 *         description: Approval rule deleted successfully
 *       404:
 *         description: Approval rule not found
 */

import express from 'express';
import { ApprovalRule } from '../models/approvalRule';
import { approvalRules as seedApprovalRules } from '../seedData';

const router = express.Router();

let approvalRules: ApprovalRule[] = [...seedApprovalRules];

export const resetApprovalRules = () => {
  approvalRules = [...seedApprovalRules];
};

export const getApprovalRules = () => approvalRules;

// Create a new approval rule
router.post('/', (req, res) => {
  const newRule: ApprovalRule = req.body;
  approvalRules.push(newRule);
  res.status(201).json(newRule);
});

// Get all approval rules
router.get('/', (req, res) => {
  res.json(approvalRules);
});

// Get an approval rule by ID
router.get('/:id', (req, res) => {
  const rule = approvalRules.find(r => r.ruleId === parseInt(req.params.id));
  if (rule) {
    res.json(rule);
  } else {
    res.status(404).send('Approval rule not found');
  }
});

// Update an approval rule by ID
router.put('/:id', (req, res) => {
  const index = approvalRules.findIndex(r => r.ruleId === parseInt(req.params.id));
  if (index !== -1) {
    approvalRules[index] = req.body;
    res.json(approvalRules[index]);
  } else {
    res.status(404).send('Approval rule not found');
  }
});

// Delete an approval rule by ID
router.delete('/:id', (req, res) => {
  const index = approvalRules.findIndex(r => r.ruleId === parseInt(req.params.id));
  if (index !== -1) {
    approvalRules.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Approval rule not found');
  }
});

export default router;
