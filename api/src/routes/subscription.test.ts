import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import subscriptionRouter, { resetSubscriptions } from './subscription';
import { subscriptions as seedSubscriptions } from '../seedData';

let app: express.Express;

describe('Subscription API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/subscriptions', subscriptionRouter);
        resetSubscriptions();
    });

    it('should create a new subscription', async () => {
        const newSubscription = {
            subscriptionId: 3,
            branchId: 1,
            items: [{ productId: 3, quantity: 2 }],
            frequency: 'weekly',
            nextDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            discountPercentage: 5,
            createdAt: new Date().toISOString()
        };
        const response = await request(app).post('/subscriptions').send(newSubscription);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newSubscription);
    });

    it('should get all subscriptions', async () => {
        const response = await request(app).get('/subscriptions');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedSubscriptions.length);
        response.body.forEach((sub: any, index: number) => {
            expect(sub).toMatchObject(seedSubscriptions[index]);
        });
    });

    it('should get a subscription by ID', async () => {
        const response = await request(app).get('/subscriptions/1');
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(seedSubscriptions[0]);
    });

    it('should update a subscription by ID', async () => {
        const updatedSubscription = {
            ...seedSubscriptions[0],
            status: 'paused'
        };
        const response = await request(app).put('/subscriptions/1').send(updatedSubscription);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(updatedSubscription);
    });

    it('should delete a subscription by ID', async () => {
        const response = await request(app).delete('/subscriptions/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing subscription', async () => {
        const response = await request(app).get('/subscriptions/999');
        expect(response.status).toBe(404);
    });

    it('should return 404 when updating non-existing subscription', async () => {
        const response = await request(app).put('/subscriptions/999').send({});
        expect(response.status).toBe(404);
    });

    it('should return 404 when deleting non-existing subscription', async () => {
        const response = await request(app).delete('/subscriptions/999');
        expect(response.status).toBe(404);
    });
});
