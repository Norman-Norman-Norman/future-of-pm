import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import orderRouter, { resetOrders } from './order';
import { orders as seedOrders } from '../seedData';

let app: express.Express;

describe('Order API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/orders', orderRouter);
        resetOrders();
    });

    it('should create a new order', async () => {
        const newOrder = {
            orderId: 3,
            branchId: 1,
            orderDate: new Date().toISOString(),
            name: 'Test Order',
            description: 'A test order',
            status: 'draft',
        };
        const response = await request(app).post('/orders').send(newOrder);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({ orderId: 3, status: 'draft' });
        expect(Array.isArray(response.body.statusHistory)).toBe(true);
    });

    it('should get all orders', async () => {
        const response = await request(app).get('/orders');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedOrders.length);
    });

    it('should get an order by ID', async () => {
        const response = await request(app).get('/orders/1');
        expect(response.status).toBe(200);
        expect(response.body.orderId).toBe(1);
    });

    it('should return 404 for a non-existing order', async () => {
        const response = await request(app).get('/orders/999');
        expect(response.status).toBe(404);
    });

    it('should update an order by ID', async () => {
        const updated = { ...seedOrders[0], name: 'Updated Order' };
        const response = await request(app).put('/orders/1').send(updated);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Updated Order');
    });

    it('should delete an order by ID', async () => {
        const response = await request(app).delete('/orders/1');
        expect(response.status).toBe(204);
    });

    // --- Status transition tests ---

    it('should transition a draft order to submitted', async () => {
        const response = await request(app)
            .put('/orders/1/status')
            .send({ status: 'submitted', changedBy: 'user1' });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('submitted');
        expect(response.body.statusHistory.length).toBeGreaterThan(1);
        const lastEntry = response.body.statusHistory[response.body.statusHistory.length - 1];
        expect(lastEntry.from).toBe('draft');
        expect(lastEntry.to).toBe('submitted');
    });

    it('should transition a submitted order to approved', async () => {
        // First: draft → submitted
        await request(app).put('/orders/1/status').send({ status: 'submitted' });
        // Then: submitted → approved
        const response = await request(app)
            .put('/orders/1/status')
            .send({ status: 'approved', changedBy: 'admin' });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('approved');
    });

    it('should reject an invalid transition from draft to delivered', async () => {
        const response = await request(app)
            .put('/orders/1/status')
            .send({ status: 'delivered' });
        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(/Invalid status transition/);
    });

    it('should reject a transition to rejected without a reason', async () => {
        await request(app).put('/orders/1/status').send({ status: 'submitted' });
        const response = await request(app)
            .put('/orders/1/status')
            .send({ status: 'rejected' });
        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(/reason is required/);
    });

    it('should allow rejecting a submitted order with a reason', async () => {
        await request(app).put('/orders/1/status').send({ status: 'submitted' });
        const response = await request(app)
            .put('/orders/1/status')
            .send({ status: 'rejected', reason: 'Budget exceeded', changedBy: 'manager' });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('rejected');
        const lastEntry = response.body.statusHistory[response.body.statusHistory.length - 1];
        expect(lastEntry.reason).toBe('Budget exceeded');
    });

    it('should reject a transition to cancelled without a reason', async () => {
        // orders/2 is already in "processing" state in seed data
        const response = await request(app)
            .put('/orders/2/status')
            .send({ status: 'cancelled' });
        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(/reason is required/);
    });

    it('should allow cancelling a processing order with a reason', async () => {
        const response = await request(app)
            .put('/orders/2/status')
            .send({ status: 'cancelled', reason: 'Supplier unavailable', changedBy: 'admin' });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('cancelled');
    });

    it('should return 400 when transitioning without a target status', async () => {
        const response = await request(app).put('/orders/1/status').send({});
        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(/Missing required field/);
    });

    it('should return 404 when transitioning a non-existing order', async () => {
        const response = await request(app)
            .put('/orders/999/status')
            .send({ status: 'submitted' });
        expect(response.status).toBe(404);
    });

    // --- History tests ---

    it('should return status history for an order', async () => {
        const response = await request(app).get('/orders/1/history');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should record a new history entry after a status transition', async () => {
        const initialHistory = (await request(app).get('/orders/1/history')).body;
        await request(app).put('/orders/1/status').send({ status: 'submitted' });
        const updatedHistory = (await request(app).get('/orders/1/history')).body;
        expect(updatedHistory.length).toBe(initialHistory.length + 1);
    });

    it('should return 404 history for a non-existing order', async () => {
        const response = await request(app).get('/orders/999/history');
        expect(response.status).toBe(404);
    });
});
