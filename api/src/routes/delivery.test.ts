import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import deliveryRouter, { resetDeliveries } from './delivery';
import { deliveries as seedDeliveries } from '../seedData';

let app: express.Express;

describe('Delivery API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/deliveries', deliveryRouter);
        resetDeliveries();
    });

    it('should create a new delivery', async () => {
        const newDelivery = {
            deliveryId: 3,
            supplierId: 1,
            deliveryDate: new Date().toISOString(),
            name: 'New Test Delivery',
            description: 'Test delivery description',
            status: 'pending'
        };
        const response = await request(app).post('/deliveries').send(newDelivery);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({ name: 'New Test Delivery', status: 'pending' });
    });

    it('should get all deliveries', async () => {
        const response = await request(app).get('/deliveries');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedDeliveries.length);
    });

    it('should get a delivery by ID', async () => {
        const response = await request(app).get('/deliveries/1');
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(seedDeliveries[0]);
    });

    it('should update a delivery by ID', async () => {
        const updatedDelivery = { ...seedDeliveries[0], status: 'delivered' };
        const response = await request(app).put('/deliveries/1').send(updatedDelivery);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ status: 'delivered' });
    });

    it('should delete a delivery by ID', async () => {
        const response = await request(app).delete('/deliveries/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing delivery', async () => {
        const response = await request(app).get('/deliveries/999');
        expect(response.status).toBe(404);
    });

    it('should return 400 when creating a delivery with missing required fields', async () => {
        const response = await request(app).post('/deliveries').send({ name: 'Missing Fields Delivery' });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Validation failed' });
        expect(Array.isArray(response.body.details)).toBe(true);
        expect(response.body.details.length).toBeGreaterThan(0);
    });

    it('should return 400 when creating a delivery with an invalid status', async () => {
        const response = await request(app).post('/deliveries').send({
            supplierId: 1,
            status: 'invalid-status'
        });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Validation failed' });
        expect(response.body.details.some((d: string) => d.toLowerCase().includes('status'))).toBe(true);
    });

    it('should return 400 when creating a delivery without supplierId', async () => {
        const response = await request(app).post('/deliveries').send({
            status: 'pending',
            name: 'No Supplier Delivery'
        });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Validation failed' });
        expect(response.body.details.some((d: string) => d.toLowerCase().includes('supplierid'))).toBe(true);
    });

    it('should return 400 when updating a delivery with an invalid status', async () => {
        const response = await request(app).put('/deliveries/1').send({
            ...seedDeliveries[0],
            status: 'unknown'
        });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Validation failed' });
    });
});
