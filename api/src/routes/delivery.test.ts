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

    it('should return 404 for non-existing delivery', async () => {
        const response = await request(app).get('/deliveries/999');
        expect(response.status).toBe(404);
    });

    it('should create a new delivery', async () => {
        const newDelivery = {
            deliveryId: 99,
            supplierId: 1,
            deliveryDate: new Date().toISOString(),
            name: 'Test Delivery',
            description: 'A test delivery',
            status: 'pending'
        };
        const response = await request(app).post('/deliveries').send(newDelivery);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newDelivery);
    });

    it('should update delivery status with a valid status', async () => {
        const response = await request(app)
            .put('/deliveries/1/status')
            .send({ status: 'delivered' });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('delivered');
    });

    it('should reject invalid status values', async () => {
        const response = await request(app)
            .put('/deliveries/1/status')
            .send({ status: 'invalid-status' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('should ignore notifyCommand field in status update', async () => {
        const response = await request(app)
            .put('/deliveries/1/status')
            .send({ status: 'delivered', notifyCommand: 'whoami' });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('delivered');
        expect(response.body).not.toHaveProperty('commandOutput');
    });

    it('should return 404 when updating status of non-existing delivery', async () => {
        const response = await request(app)
            .put('/deliveries/999/status')
            .send({ status: 'delivered' });
        expect(response.status).toBe(404);
    });

    it('should delete a delivery by ID', async () => {
        const response = await request(app).delete('/deliveries/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 when deleting non-existing delivery', async () => {
        const response = await request(app).delete('/deliveries/999');
        expect(response.status).toBe(404);
    });
});
