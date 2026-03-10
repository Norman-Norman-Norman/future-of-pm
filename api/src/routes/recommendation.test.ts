import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import recommendationRouter, { resetRecommendations } from './recommendation';
import { products as seedProducts, orderDetails as seedOrderDetails } from '../seedData';

let app: express.Express;

describe('Recommendation API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/recommendations', recommendationRouter);
        resetRecommendations();
    });

    describe('GET /popular', () => {
        it('should return products sorted by order frequency', async () => {
            const response = await request(app).get('/recommendations/popular');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should return at most 5 products by default', async () => {
            const response = await request(app).get('/recommendations/popular');
            expect(response.status).toBe(200);
            expect(response.body.length).toBeLessThanOrEqual(5);
        });

        it('should respect a custom limit query parameter', async () => {
            const response = await request(app).get('/recommendations/popular?limit=2');
            expect(response.status).toBe(200);
            expect(response.body.length).toBeLessThanOrEqual(2);
        });

        it('should return products with id, name, price, and imgName', async () => {
            const response = await request(app).get('/recommendations/popular');
            expect(response.status).toBe(200);
            if (response.body.length > 0) {
                const product = response.body[0];
                expect(product).toHaveProperty('productId');
                expect(product).toHaveProperty('name');
                expect(product).toHaveProperty('price');
                expect(product).toHaveProperty('imgName');
            }
        });

        it('should only include products that appear in order details', async () => {
            const response = await request(app).get('/recommendations/popular');
            expect(response.status).toBe(200);
            const orderedProductIds = new Set(seedOrderDetails.map(od => od.productId));
            for (const product of response.body) {
                expect(orderedProductIds.has(product.productId)).toBe(true);
            }
        });
    });

    describe('GET /for-you', () => {
        it('should return an array of products', async () => {
            const response = await request(app).get('/recommendations/for-you');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should return at most 5 products by default', async () => {
            const response = await request(app).get('/recommendations/for-you');
            expect(response.status).toBe(200);
            expect(response.body.length).toBeLessThanOrEqual(5);
        });
    });

    describe('GET /similar/:productId', () => {
        it('should return an array of product objects', async () => {
            const productId = seedProducts[0].productId;
            const response = await request(app).get(`/recommendations/similar/${productId}`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should not include the source product in results', async () => {
            const productId = seedProducts[0].productId;
            const response = await request(app).get(`/recommendations/similar/${productId}`);
            expect(response.status).toBe(200);
            const ids = response.body.map((p: { productId: number }) => p.productId);
            expect(ids).not.toContain(productId);
        });

        it('should return products with the same supplierId', async () => {
            const source = seedProducts[0];
            const response = await request(app).get(`/recommendations/similar/${source.productId}`);
            expect(response.status).toBe(200);
            for (const product of response.body) {
                expect(product.supplierId).toBe(source.supplierId);
            }
        });

        it('should return 404 for a non-existent product', async () => {
            const response = await request(app).get('/recommendations/similar/99999');
            expect(response.status).toBe(404);
        });

        it('should return at most 5 results by default', async () => {
            const productId = seedProducts[0].productId;
            const response = await request(app).get(`/recommendations/similar/${productId}`);
            expect(response.status).toBe(200);
            expect(response.body.length).toBeLessThanOrEqual(5);
        });
    });

    describe('GET /frequently-bought-together/:productId', () => {
        it('should return an array of product objects', async () => {
            const productId = 2;
            const response = await request(app).get(`/recommendations/frequently-bought-together/${productId}`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should not include the source product in results', async () => {
            const productId = 2;
            const response = await request(app).get(`/recommendations/frequently-bought-together/${productId}`);
            expect(response.status).toBe(200);
            const ids = response.body.map((p: { productId: number }) => p.productId);
            expect(ids).not.toContain(productId);
        });

        it('should return products from the same orders', async () => {
            // Products 2 and 3 are in order 1 together
            const response = await request(app).get('/recommendations/frequently-bought-together/2');
            expect(response.status).toBe(200);
            const ids = response.body.map((p: { productId: number }) => p.productId);
            expect(ids).toContain(3);
        });

        it('should return 404 for a non-existent product', async () => {
            const response = await request(app).get('/recommendations/frequently-bought-together/99999');
            expect(response.status).toBe(404);
        });

        it('should return at most 5 results by default', async () => {
            const productId = 1;
            const response = await request(app).get(`/recommendations/frequently-bought-together/${productId}`);
            expect(response.status).toBe(200);
            expect(response.body.length).toBeLessThanOrEqual(5);
        });

        it('should return an empty array for a product with no co-purchases', async () => {
            // Product 4 is the only item in order 2
            const response = await request(app).get('/recommendations/frequently-bought-together/4');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });
});
