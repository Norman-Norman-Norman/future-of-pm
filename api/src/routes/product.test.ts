import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import productRouter, { resetProducts } from './product';
import { products as seedProducts } from '../seedData';

let app: express.Express;

describe('Product API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/products', productRouter);
        resetProducts();
    });

    it('should create a new product', async () => {
        const newProduct = {
            productId: 99,
            supplierId: 1,
            name: "Test Product",
            description: "A test product",
            price: 49.99,
            sku: "TEST-001",
            unit: "piece",
            imgName: "test.png",
            category: "accessories"
        };
        const response = await request(app).post('/products').send(newProduct);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newProduct);
    });

    it('should get all products', async () => {
        const response = await request(app).get('/products');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedProducts.length);
    });

    it('should get a product by ID', async () => {
        const response = await request(app).get('/products/1');
        expect(response.status).toBe(200);
        expect(response.body.productId).toBe(1);
    });

    it('should update a product by ID', async () => {
        const seed = seedProducts.find(p => p.productId === 1)!;
        const updatedProduct = { ...seed, name: 'Updated SmartFeeder' };
        const response = await request(app).put('/products/1').send(updatedProduct);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Updated SmartFeeder');
    });

    it('should delete a product by ID', async () => {
        const response = await request(app).delete('/products/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing product', async () => {
        const response = await request(app).get('/products/999');
        expect(response.status).toBe(404);
    });

    it('should filter products by category', async () => {
        const response = await request(app).get('/products?category=health');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        response.body.forEach((p: any) => {
            expect(p.category).toBe('health');
        });
    });

    it('should filter products by minPrice', async () => {
        const response = await request(app).get('/products?minPrice=100');
        expect(response.status).toBe(200);
        response.body.forEach((p: any) => {
            expect(p.price).toBeGreaterThanOrEqual(100);
        });
    });

    it('should filter products by maxPrice', async () => {
        const response = await request(app).get('/products?maxPrice=80');
        expect(response.status).toBe(200);
        response.body.forEach((p: any) => {
            expect(p.price).toBeLessThanOrEqual(80);
        });
    });

    it('should filter products with hasDiscount=true', async () => {
        const response = await request(app).get('/products?hasDiscount=true');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        response.body.forEach((p: any) => {
            expect(p.discount).toBeDefined();
            expect(p.discount).toBeGreaterThan(0);
        });
    });

    it('should sort products by price ascending', async () => {
        const response = await request(app).get('/products?sortBy=price&sortOrder=asc');
        expect(response.status).toBe(200);
        const prices: number[] = response.body.map((p: any) => p.price);
        for (let i = 1; i < prices.length; i++) {
            expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
        }
    });

    it('should sort products by price descending', async () => {
        const response = await request(app).get('/products?sortBy=price&sortOrder=desc');
        expect(response.status).toBe(200);
        const prices: number[] = response.body.map((p: any) => p.price);
        for (let i = 1; i < prices.length; i++) {
            expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
        }
    });

    it('should combine category and price filters', async () => {
        const response = await request(app).get('/products?category=health&maxPrice=100');
        expect(response.status).toBe(200);
        response.body.forEach((p: any) => {
            expect(p.category).toBe('health');
            expect(p.price).toBeLessThanOrEqual(100);
        });
    });
});
