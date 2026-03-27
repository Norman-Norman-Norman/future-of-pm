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
 *     summary: Returns all suppliers
 *     tags: [Suppliers]
 *     responses:
 *       200:
 *         description: List of all suppliers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supplier'
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
import { logger } from '../logger';

const TAG = 'Suppliers';
const router = express.Router();

let suppliers: Supplier[] = [...seedSuppliers];
logger.seed('suppliers', suppliers.length);

// Create a new supplier
router.post('/', (req, res) => {
    logger.route(TAG, 'POST / - Creating new supplier', { body: req.body });
    const newSupplier = req.body as Supplier;
    suppliers.push(newSupplier);
    logger.info(TAG, `Supplier created: ${newSupplier.name}`, { supplierId: newSupplier.supplierId, totalSuppliers: suppliers.length });
    res.status(201).json(newSupplier);
});

// Get all suppliers
router.get('/', (req, res) => {
    logger.route(TAG, `GET / - Returning all suppliers (${suppliers.length} records)`);
    res.json(suppliers);
});

// Get a supplier by ID
router.get('/:id', (req, res) => {
    const id = req.params.id;
    logger.route(TAG, `GET /${id} - Looking up supplier`);
    const supplier = suppliers.find(s => s.supplierId === parseInt(id));
    if (supplier) {
        logger.debug(TAG, `Found supplier: ${supplier.name}`);
        res.json(supplier);
    } else {
        logger.warn(TAG, `Supplier not found: id=${id}`);
        res.status(404).send('Supplier not found');
    }
});

// Update a supplier by ID
router.put('/:id', (req, res) => {
    const id = req.params.id;
    logger.route(TAG, `PUT /${id} - Updating supplier`, { body: req.body });
    const index = suppliers.findIndex(s => s.supplierId === parseInt(id));
    if (index !== -1) {
        suppliers[index] = req.body;
        logger.info(TAG, `Supplier updated: id=${id}`, { name: suppliers[index].name });
        res.json(suppliers[index]);
    } else {
        logger.warn(TAG, `Supplier not found for update: id=${id}`);
        res.status(404).send('Supplier not found');
    }
});

// Delete a supplier by ID
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    logger.route(TAG, `DELETE /${id} - Deleting supplier`);
    const index = suppliers.findIndex(s => s.supplierId === parseInt(id));
    if (index !== -1) {
        const deleted = suppliers.splice(index, 1);
        logger.info(TAG, `Supplier deleted: ${deleted[0].name}`, { remainingSuppliers: suppliers.length });
        res.status(204).send();
    } else {
        logger.warn(TAG, `Supplier not found for deletion: id=${id}`);
        res.status(404).send('Supplier not found');
    }
});

export default router;