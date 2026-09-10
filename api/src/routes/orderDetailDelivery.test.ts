import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import orderDetailDeliveryRouter, { resetOrderDetailDeliveries } from './orderDetailDelivery';
import { orderDetailDeliveries as seedOrderDetailDeliveries } from '../seedData';

let app: express.Express;

describe('OrderDetailDelivery API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/order-detail-deliveries', orderDetailDeliveryRouter);
        resetOrderDetailDeliveries();
    });

    it('should get an order detail delivery by orderDetailDeliveryId', async () => {
        const response = await request(app).get('/order-detail-deliveries/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedOrderDetailDeliveries[0]);
    });

    it('should not resolve route IDs using deliveryId', async () => {
        const response = await request(app).get('/order-detail-deliveries/2');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedOrderDetailDeliveries[1]);
    });

    it('should update an order detail delivery by orderDetailDeliveryId', async () => {
        const updatedOrderDetailDelivery = {
            ...seedOrderDetailDeliveries[0],
            quantity: seedOrderDetailDeliveries[0].quantity + 1
        };

        const response = await request(app)
            .put('/order-detail-deliveries/1')
            .send(updatedOrderDetailDelivery);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedOrderDetailDelivery);
    });

    it('should delete an order detail delivery by orderDetailDeliveryId', async () => {
        const response = await request(app).delete('/order-detail-deliveries/1');

        expect(response.status).toBe(204);

        const deleted = await request(app).get('/order-detail-deliveries/1');
        expect(deleted.status).toBe(404);
    });
});
