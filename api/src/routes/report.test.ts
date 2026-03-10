import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import reportRouter from './report';
import { orders, products, deliveries, suppliers, orderDetails } from '../seedData';

let app: express.Express;

describe('Report API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/reports', reportRouter);
    });

    describe('GET /reports/orders-by-status', () => {
        it('should return orders grouped by status', async () => {
            const response = await request(app).get('/reports/orders-by-status');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            response.body.forEach((item: any) => {
                expect(item).toHaveProperty('status');
                expect(item).toHaveProperty('count');
                expect(item).toHaveProperty('totalValue');
                expect(typeof item.count).toBe('number');
                expect(typeof item.totalValue).toBe('number');
            });
        });

        it('should include all order statuses from seed data', async () => {
            const response = await request(app).get('/reports/orders-by-status');
            const statuses = response.body.map((item: any) => item.status);
            const expectedStatuses = [...new Set(orders.map((o) => o.status))];
            expectedStatuses.forEach((status) => {
                expect(statuses).toContain(status);
            });
        });

        it('should have correct total order count matching seed data', async () => {
            const response = await request(app).get('/reports/orders-by-status');
            const totalCount = response.body.reduce((sum: number, item: any) => sum + item.count, 0);
            expect(totalCount).toBe(orders.length);
        });

        it('should compute totalValue from order details', async () => {
            const response = await request(app).get('/reports/orders-by-status');
            const totalValue = response.body.reduce((sum: number, item: any) => sum + item.totalValue, 0);
            const expectedTotal = orderDetails.reduce(
                (sum, d) => sum + d.quantity * d.unitPrice,
                0
            );
            expect(totalValue).toBeCloseTo(expectedTotal, 1);
        });
    });

    describe('GET /reports/inventory-levels', () => {
        it('should return inventory levels for all products', async () => {
            const response = await request(app).get('/reports/inventory-levels');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(products.length);
        });

        it('should include required fields', async () => {
            const response = await request(app).get('/reports/inventory-levels');
            response.body.forEach((item: any) => {
                expect(item).toHaveProperty('productId');
                expect(item).toHaveProperty('name');
                expect(item).toHaveProperty('sku');
                expect(item).toHaveProperty('price');
                expect(item).toHaveProperty('unit');
                expect(item).toHaveProperty('supplierName');
            });
        });

        it('should resolve supplier names correctly', async () => {
            const response = await request(app).get('/reports/inventory-levels');
            const first = response.body[0];
            const product = products[0];
            const supplier = suppliers.find((s) => s.supplierId === product.supplierId);
            expect(first.supplierName).toBe(supplier?.name);
        });
    });

    describe('GET /reports/delivery-performance', () => {
        it('should return delivery performance data', async () => {
            const response = await request(app).get('/reports/delivery-performance');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(deliveries.length);
        });

        it('should include required fields', async () => {
            const response = await request(app).get('/reports/delivery-performance');
            response.body.forEach((item: any) => {
                expect(item).toHaveProperty('deliveryId');
                expect(item).toHaveProperty('name');
                expect(item).toHaveProperty('status');
                expect(item).toHaveProperty('deliveryDate');
                expect(item).toHaveProperty('supplierName');
            });
        });

        it('should resolve supplier names', async () => {
            const response = await request(app).get('/reports/delivery-performance');
            response.body.forEach((item: any) => {
                expect(item.supplierName).not.toBe('Unknown');
            });
        });
    });

    describe('GET /reports/product-sales', () => {
        it('should return product sales data', async () => {
            const response = await request(app).get('/reports/product-sales');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should include required fields', async () => {
            const response = await request(app).get('/reports/product-sales');
            response.body.forEach((item: any) => {
                expect(item).toHaveProperty('productId');
                expect(item).toHaveProperty('productName');
                expect(item).toHaveProperty('totalQuantity');
                expect(item).toHaveProperty('totalRevenue');
            });
        });

        it('should be sorted by totalQuantity descending', async () => {
            const response = await request(app).get('/reports/product-sales');
            for (let i = 1; i < response.body.length; i++) {
                expect(response.body[i - 1].totalQuantity).toBeGreaterThanOrEqual(
                    response.body[i].totalQuantity
                );
            }
        });

        it('should have correct total quantity matching seed data', async () => {
            const response = await request(app).get('/reports/product-sales');
            const totalQty = response.body.reduce((sum: number, item: any) => sum + item.totalQuantity, 0);
            const expectedQty = orderDetails.reduce((sum, d) => sum + d.quantity, 0);
            expect(totalQty).toBe(expectedQty);
        });
    });

    describe('GET /reports/supplier-activity', () => {
        it('should return supplier activity for all suppliers', async () => {
            const response = await request(app).get('/reports/supplier-activity');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(suppliers.length);
        });

        it('should include required fields', async () => {
            const response = await request(app).get('/reports/supplier-activity');
            response.body.forEach((item: any) => {
                expect(item).toHaveProperty('supplierId');
                expect(item).toHaveProperty('supplierName');
                expect(item).toHaveProperty('deliveryCount');
                expect(item).toHaveProperty('productCount');
            });
        });

        it('should have correct total delivery count matching seed data', async () => {
            const response = await request(app).get('/reports/supplier-activity');
            const totalDeliveries = response.body.reduce(
                (sum: number, item: any) => sum + item.deliveryCount,
                0
            );
            expect(totalDeliveries).toBe(deliveries.length);
        });

        it('should have correct total product count matching seed data', async () => {
            const response = await request(app).get('/reports/supplier-activity');
            const totalProducts = response.body.reduce(
                (sum: number, item: any) => sum + item.productCount,
                0
            );
            expect(totalProducts).toBe(products.length);
        });
    });
});
