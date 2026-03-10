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
            price: 9.99,
            sku: "TEST-001",
            unit: "piece",
            imgName: "test.png",
            stockLevel: 50,
            reorderPoint: 10,
            reorderQuantity: 20
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
        expect(response.body.stockLevel).toBeDefined();
        expect(response.body.reorderPoint).toBeDefined();
        expect(response.body.reorderQuantity).toBeDefined();
    });

    it('should update a product by ID', async () => {
        const updatedProduct = {
            ...seedProducts.find(p => p.productId === 1),
            name: 'Updated SmartFeeder'
        };
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

    it('should return low-stock products', async () => {
        const response = await request(app).get('/products/low-stock');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach((product: any) => {
            expect(product.stockLevel).toBeLessThanOrEqual(product.reorderPoint);
        });
        // Seed data has products 7, 8, 9, 10 at or below reorder point
        expect(response.body.length).toBeGreaterThanOrEqual(4);
    });

    it('should adjust stock level up', async () => {
        const response = await request(app).put('/products/1/stock').send({ adjustment: 10 });
        expect(response.status).toBe(200);
        const original = seedProducts.find(p => p.productId === 1)!;
        expect(response.body.stockLevel).toBe(original.stockLevel + 10);
    });

    it('should adjust stock level down', async () => {
        const response = await request(app).put('/products/1/stock').send({ adjustment: -5 });
        expect(response.status).toBe(200);
        const original = seedProducts.find(p => p.productId === 1)!;
        expect(response.body.stockLevel).toBe(original.stockLevel - 5);
    });

    it('should return 400 when stock adjustment would make level negative', async () => {
        const response = await request(app).put('/products/1/stock').send({ adjustment: -9999 });
        expect(response.status).toBe(400);
    });

    it('should return 400 for invalid adjustment value', async () => {
        const response = await request(app).put('/products/1/stock').send({ adjustment: 'invalid' });
        expect(response.status).toBe(400);
    });

    it('should return 404 for stock adjustment on non-existing product', async () => {
        const response = await request(app).put('/products/999/stock').send({ adjustment: 5 });
        expect(response.status).toBe(404);
    });
});
