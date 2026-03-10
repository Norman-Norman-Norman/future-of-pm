/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: API endpoints for managing suppliers
 */

/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: Returns a paginated list of suppliers
 *     tags: [Suppliers]
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
 *         description: Paginated list of suppliers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Supplier'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *   post:
 *     summary: Create a new supplier
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 * 
 * /api/suppliers/{id}:
 *   get:
 *     summary: Get a supplier by ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Supplier not found
 *   put:
 *     summary: Update a supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Supplier not found
 *   delete:
 *     summary: Delete a supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     responses:
 *       204:
 *         description: Supplier deleted successfully
 *       404:
 *         description: Supplier not found
 */

import express from 'express';
import { Supplier } from '../models/supplier';
import { suppliers as seedSuppliers } from '../seedData';
import { parsePaginationParams, applyPaginationSortFilter } from '../utils/pagination';

const router = express.Router();

let suppliers: Supplier[] = [...seedSuppliers];

// Add reset function for testing
export const resetSuppliers = () => {
    suppliers = [...seedSuppliers];
};

// Create a new supplier
router.post('/', (req, res) => {
    const newSupplier = req.body as Supplier;
    suppliers.push(newSupplier);
    res.status(201).json(newSupplier);
});

// Get all suppliers
router.get('/', (req, res) => {
    const params = parsePaginationParams(req.query as Record<string, string>);
    const result = applyPaginationSortFilter(suppliers, params, {}, ['name']);
    res.json(result);
});

// Get a supplier by ID
router.get('/:id', (req, res) => {
    const supplier = suppliers.find(s => s.supplierId === parseInt(req.params.id));
    if (supplier) {
        res.json(supplier);
    } else {
        res.status(404).send('Supplier not found');
    }
});

// Update a supplier by ID
router.put('/:id', (req, res) => {
    const index = suppliers.findIndex(s => s.supplierId === parseInt(req.params.id));
    if (index !== -1) {
        suppliers[index] = req.body;
        res.json(suppliers[index]);
    } else {
        res.status(404).send('Supplier not found');
    }
});

// Delete a supplier by ID
router.delete('/:id', (req, res) => {
    const index = suppliers.findIndex(s => s.supplierId === parseInt(req.params.id));
    if (index !== -1) {
        suppliers.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Supplier not found');
    }
});

export default router;