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
            name: 'New Test Order',
            description: 'Test order description',
            status: 'pending'
        };
        const response = await request(app).post('/orders').send(newOrder);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({ name: 'New Test Order', status: 'pending' });
    });

    it('should get all orders', async () => {
        const response = await request(app).get('/orders');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedOrders.length);
    });

    it('should get an order by ID', async () => {
        const response = await request(app).get('/orders/1');
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(seedOrders[0]);
    });

    it('should update an order by ID', async () => {
        const updatedOrder = { ...seedOrders[0], status: 'shipped' };
        const response = await request(app).put('/orders/1').send(updatedOrder);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ status: 'shipped' });
    });

    it('should delete an order by ID', async () => {
        const response = await request(app).delete('/orders/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing order', async () => {
        const response = await request(app).get('/orders/999');
        expect(response.status).toBe(404);
    });

    it('should return 400 when creating an order with missing required fields', async () => {
        const response = await request(app).post('/orders').send({ name: 'Missing Fields Order' });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Validation failed' });
        expect(Array.isArray(response.body.details)).toBe(true);
        expect(response.body.details.length).toBeGreaterThan(0);
    });

    it('should return 400 when creating an order with an invalid status', async () => {
        const response = await request(app).post('/orders').send({
            branchId: 1,
            status: 'invalid-status'
        });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Validation failed' });
        expect(response.body.details.some((d: string) => d.toLowerCase().includes('status'))).toBe(true);
    });

    it('should return 400 when creating an order without branchId', async () => {
        const response = await request(app).post('/orders').send({
            status: 'pending',
            name: 'No Branch Order'
        });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Validation failed' });
        expect(response.body.details.some((d: string) => d.toLowerCase().includes('branchid'))).toBe(true);
    });

    it('should return 400 when updating an order with an invalid status', async () => {
        const response = await request(app).put('/orders/1').send({
            ...seedOrders[0],
            status: 'unknown'
        });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Validation failed' });
    });
});
