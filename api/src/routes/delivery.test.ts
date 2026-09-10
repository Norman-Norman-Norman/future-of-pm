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

    it('should reject notifyCommand instead of executing request input', async () => {
        const response = await request(app)
            .put('/deliveries/1/status')
            .send({ status: 'delivered', notifyCommand: 'echo exploited' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'notifyCommand is not supported' });

        const delivery = await request(app).get('/deliveries/1');
        expect(delivery.body.status).toBe(seedDeliveries[0].status);
    });
});
