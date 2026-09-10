import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import supplierRouter, { resetSuppliers } from './supplier';
import { suppliers as seedSuppliers } from '../seedData';

let app: express.Express;

describe('Supplier API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/suppliers', supplierRouter);
        resetSuppliers();
    });

    it('should create a new supplier', async () => {
        const newSupplier = {
            ...seedSuppliers[0],
            supplierId: 99,
            name: 'New Supplier',
            email: 'new-supplier@example.com'
        };

        const response = await request(app).post('/suppliers').send(newSupplier);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(newSupplier);
    });

    it('should get all suppliers', async () => {
        const response = await request(app).get('/suppliers');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(seedSuppliers.length);
        expect(response.body).toEqual(seedSuppliers);
    });

    it('should get a supplier by ID', async () => {
        const response = await request(app).get('/suppliers/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedSuppliers[0]);
    });

    it('should update a supplier by ID', async () => {
        const updatedSupplier = {
            ...seedSuppliers[0],
            name: 'Updated Supplier'
        };

        const response = await request(app).put('/suppliers/1').send(updatedSupplier);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedSupplier);
    });

    it('should delete a supplier by ID', async () => {
        const response = await request(app).delete('/suppliers/1');

        expect(response.status).toBe(204);

        const deleted = await request(app).get('/suppliers/1');
        expect(deleted.status).toBe(404);
    });

    it('should return 404 for non-existing supplier', async () => {
        const response = await request(app).get('/suppliers/999');

        expect(response.status).toBe(404);
    });
});
