import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import productRouter, { resetProducts } from './product';
import { products as seedProducts, reviews as seedReviews } from '../seedData';

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
            price: 9.99,
            sku: "TEST-001",
            unit: "piece",
            imgName: "test.png"
        };
        const response = await request(app).post('/products').send(newProduct);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(newProduct);
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
        expect(response.body.name).toBe('SmartFeeder One');
    });

    it('should return product with images, averageRating, reviewCount, and specifications', async () => {
        const response = await request(app).get('/products/1');
        expect(response.status).toBe(200);
        expect(response.body.images).toBeDefined();
        expect(Array.isArray(response.body.images)).toBe(true);
        expect(response.body.averageRating).toBeDefined();
        expect(response.body.reviewCount).toBeDefined();
        expect(response.body.specifications).toBeDefined();
    });

    it('should update a product by ID', async () => {
        const seedProduct = seedProducts.find(p => p.productId === 1)!;
        const updatedProduct = { ...seedProduct, name: 'Updated SmartFeeder' };
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

    it('should get reviews for a product', async () => {
        const response = await request(app).get('/products/1/reviews');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        const productReviews = seedReviews.filter(r => r.productId === 1);
        expect(response.body.length).toBe(productReviews.length);
        response.body.forEach((review: any) => {
            expect(review.productId).toBe(1);
            expect(review).toHaveProperty('rating');
            expect(review).toHaveProperty('title');
            expect(review).toHaveProperty('body');
            expect(review).toHaveProperty('authorName');
        });
    });

    it('should return reviews sorted by date descending', async () => {
        const response = await request(app).get('/products/1/reviews');
        expect(response.status).toBe(200);
        const dates = response.body.map((r: any) => new Date(r.createdAt).getTime());
        for (let i = 0; i < dates.length - 1; i++) {
            expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
        }
    });

    it('should return 404 for reviews of non-existing product', async () => {
        const response = await request(app).get('/products/999/reviews');
        expect(response.status).toBe(404);
    });

    it('should get related products for a product', async () => {
        const response = await request(app).get('/products/1/related');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeLessThanOrEqual(4);
        response.body.forEach((p: any) => {
            expect(p.productId).not.toBe(1);
        });
    });

    it('should return at most 4 related products', async () => {
        const response = await request(app).get('/products/1/related');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeLessThanOrEqual(4);
    });

    it('should return 404 for related products of non-existing product', async () => {
        const response = await request(app).get('/products/999/related');
        expect(response.status).toBe(404);
    });
});
