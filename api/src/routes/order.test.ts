import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import orderRouter, { resetOrders } from './order';
import { orders as seedOrders, orderDetails as seedOrderDetails } from '../seedData';

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
            orderId: 99,
            branchId: 1,
            orderDate: new Date().toISOString(),
            name: "Test Order",
            description: "A test order",
            status: "pending",
            orderTotal: 250.00,
            shippingAddress: "123 Test Street"
        };
        const response = await request(app).post('/orders').send(newOrder);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(newOrder);
    });

    it('should get all orders', async () => {
        const response = await request(app).get('/orders');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedOrders.length);
    });

    it('should return orders sorted by date descending by default', async () => {
        const response = await request(app).get('/orders?sortBy=orderDate&order=desc');
        expect(response.status).toBe(200);
        const dates = response.body.map((o: any) => new Date(o.orderDate).getTime());
        for (let i = 1; i < dates.length; i++) {
            expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
        }
    });

    it('should return orders sorted by date ascending', async () => {
        const response = await request(app).get('/orders?sortBy=orderDate&order=asc');
        expect(response.status).toBe(200);
        const dates = response.body.map((o: any) => new Date(o.orderDate).getTime());
        for (let i = 1; i < dates.length; i++) {
            expect(dates[i - 1]).toBeLessThanOrEqual(dates[i]);
        }
    });

    it('should filter orders by branchId', async () => {
        const response = await request(app).get('/orders?branchId=1');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        response.body.forEach((order: any) => {
            expect(order.branchId).toBe(1);
        });
    });

    it('should return only branch 2 orders when filtering by branchId=2', async () => {
        const response = await request(app).get('/orders?branchId=2');
        expect(response.status).toBe(200);
        response.body.forEach((order: any) => {
            expect(order.branchId).toBe(2);
        });
    });

    it('should get an order by ID', async () => {
        const response = await request(app).get('/orders/1');
        expect(response.status).toBe(200);
        expect(response.body.orderId).toBe(1);
    });

    it('should return 404 for non-existing order', async () => {
        const response = await request(app).get('/orders/999');
        expect(response.status).toBe(404);
    });

    it('should update an order by ID', async () => {
        const updated = { ...seedOrders[0], name: 'Updated Order' };
        const response = await request(app).put('/orders/1').send(updated);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Updated Order');
    });

    it('should return 404 when updating non-existing order', async () => {
        const response = await request(app).put('/orders/999').send({ name: 'Ghost' });
        expect(response.status).toBe(404);
    });

    it('should delete an order by ID', async () => {
        const response = await request(app).delete('/orders/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 when deleting non-existing order', async () => {
        const response = await request(app).delete('/orders/999');
        expect(response.status).toBe(404);
    });

    it('should get order details for a valid order ID', async () => {
        const orderId = seedOrderDetails[0].orderId;
        const response = await request(app).get(`/orders/${orderId}/details`);
        expect(response.status).toBe(200);
        expect(response.body.orderId).toBe(orderId);
        expect(Array.isArray(response.body.orderDetails)).toBe(true);
        expect(response.body.orderDetails.length).toBeGreaterThan(0);
        response.body.orderDetails.forEach((detail: any) => {
            expect(detail.orderId).toBe(orderId);
        });
    });

    it('should return 404 for details of non-existing order', async () => {
        const response = await request(app).get('/orders/999/details');
        expect(response.status).toBe(404);
    });

    it('order model includes orderTotal, shippingAddress, and optional trackingNumber', async () => {
        const response = await request(app).get('/orders/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('orderTotal');
        expect(response.body).toHaveProperty('shippingAddress');
        expect(typeof response.body.orderTotal).toBe('number');
        expect(typeof response.body.shippingAddress).toBe('string');
    });
});
