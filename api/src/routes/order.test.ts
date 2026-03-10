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
            name: "Test Order",
            description: "Test order description",
            status: "pending"
        };
        const response = await request(app).post('/orders').send(newOrder);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newOrder);
    });

    it('should get all orders', async () => {
        const response = await request(app).get('/orders');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedOrders.length);
    });

    it('should filter orders by branchId', async () => {
        const response = await request(app).get('/orders?branchId=1');
        expect(response.status).toBe(200);
        const expected = seedOrders.filter(o => o.branchId === 1);
        expect(response.body.length).toBe(expected.length);
        response.body.forEach((o: any) => {
            expect(o.branchId).toBe(1);
        });
    });

    it('should return empty array when no orders match branchId', async () => {
        const response = await request(app).get('/orders?branchId=999');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should sort orders by date descending', async () => {
        const response = await request(app).get('/orders?sortBy=date&order=desc');
        expect(response.status).toBe(200);
        const dates = (response.body as any[]).map((o: any) => new Date(o.orderDate).getTime());
        for (let i = 1; i < dates.length; i++) {
            expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
        }
    });

    it('should sort orders by date ascending', async () => {
        const response = await request(app).get('/orders?sortBy=date&order=asc');
        expect(response.status).toBe(200);
        const dates = (response.body as any[]).map((o: any) => new Date(o.orderDate).getTime());
        for (let i = 1; i < dates.length; i++) {
            expect(dates[i - 1]).toBeLessThanOrEqual(dates[i]);
        }
    });

    it('should get an order by ID', async () => {
        const response = await request(app).get('/orders/1');
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(seedOrders[0]);
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

    it('should return 404 for non-existing order', async () => {
        const response = await request(app).get('/orders/999');
        expect(response.status).toBe(404);
    });
});
