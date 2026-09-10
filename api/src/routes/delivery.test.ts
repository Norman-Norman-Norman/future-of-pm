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
            ...seedDeliveries[0],
            deliveryId: 99,
            name: 'New delivery',
            status: 'pending'
        };

        const response = await request(app).post('/deliveries').send(newDelivery);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(newDelivery);
    });

    it('should get all deliveries', async () => {
        const response = await request(app).get('/deliveries');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(seedDeliveries.length);
        expect(response.body).toEqual(seedDeliveries);
    });

    it('should get a delivery by ID', async () => {
        const response = await request(app).get('/deliveries/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedDeliveries[0]);
    });

    it('should update a delivery by ID', async () => {
        const updatedDelivery = {
            ...seedDeliveries[0],
            name: 'Updated delivery'
        };

        const response = await request(app).put('/deliveries/1').send(updatedDelivery);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedDelivery);
    });

    it('should update delivery status', async () => {
        const response = await request(app)
            .put('/deliveries/1/status')
            .send({ status: 'in-transit' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            ...seedDeliveries[0],
            status: 'in-transit'
        });
    });

    it('should return 404 for a missing delivery status update', async () => {
        const response = await request(app)
            .put('/deliveries/999/status')
            .send({ status: 'delivered' });

        expect(response.status).toBe(404);
    });

    it('should reject notifyCommand instead of executing request input', async () => {
        const response = await request(app)
            .put('/deliveries/1/status')
            .send({ status: 'delivered', notifyCommand: 'echo exploited' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Validation failed');
        expect(response.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ path: '', message: expect.stringContaining('Unrecognized key') })
            ])
        );

        const delivery = await request(app).get('/deliveries/1');
        expect(delivery.body.status).toBe(seedDeliveries[0].status);
    });

    it('should delete a delivery by ID', async () => {
        const response = await request(app).delete('/deliveries/1');

        expect(response.status).toBe(204);

        const deleted = await request(app).get('/deliveries/1');
        expect(deleted.status).toBe(404);
    });

    it('should return 404 for non-existing delivery', async () => {
        const response = await request(app).get('/deliveries/999');

        expect(response.status).toBe(404);
    });
});
