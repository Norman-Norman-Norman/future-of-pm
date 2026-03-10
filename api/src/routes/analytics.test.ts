import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import analyticsRouter from './analytics';
import { resetOrders } from './order';
import { resetOrderDetails } from './orderDetail';

let app: express.Express;

describe('Analytics API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/analytics', analyticsRouter);
        resetOrders();
        resetOrderDetails();
    });

    it('should return frequent products for a branch', async () => {
        const response = await request(app).get('/analytics/frequent-products?branchId=1');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        // Branch 1 (order 1) has products 2 and 3
        const productIds = response.body.map((p: any) => p.productId);
        expect(productIds).toContain(2);
        expect(productIds).toContain(3);
    });

    it('should return frequent products for another branch', async () => {
        const response = await request(app).get('/analytics/frequent-products?branchId=2');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        // Branch 2 (order 2) has product 4
        const productIds = response.body.map((p: any) => p.productId);
        expect(productIds).toContain(4);
    });

    it('should return empty array for branch with no orders', async () => {
        const response = await request(app).get('/analytics/frequent-products?branchId=999');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should return all branches frequent products when branchId is omitted', async () => {
        const response = await request(app).get('/analytics/frequent-products');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should respect the limit parameter', async () => {
        const response = await request(app).get('/analytics/frequent-products?limit=1');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeLessThanOrEqual(1);
    });

    it('each result should have required fields', async () => {
        const response = await request(app).get('/analytics/frequent-products?branchId=1');
        expect(response.status).toBe(200);
        for (const item of response.body) {
            expect(item).toHaveProperty('productId');
            expect(item).toHaveProperty('name');
            expect(item).toHaveProperty('price');
            expect(item).toHaveProperty('imgName');
            expect(item).toHaveProperty('totalOrdered');
        }
    });

    it('should sort results by totalOrdered descending', async () => {
        const response = await request(app).get('/analytics/frequent-products');
        expect(response.status).toBe(200);
        const totals = response.body.map((p: any) => p.totalOrdered);
        for (let i = 1; i < totals.length; i++) {
            expect(totals[i - 1]).toBeGreaterThanOrEqual(totals[i]);
        }
    });
});
