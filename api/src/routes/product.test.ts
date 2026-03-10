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
            productId: 100,
            supplierId: 1,
            name: 'Test Product',
            description: 'A test product',
            price: 19.99,
            sku: 'TEST-001',
            unit: 'piece',
            imgName: 'test.png'
        };
        const response = await request(app).post('/products').send(newProduct);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({ name: 'Test Product', price: 19.99 });
    });

    it('should get all products', async () => {
        const response = await request(app).get('/products');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedProducts.length);
    });

    it('should get a product by ID', async () => {
        const response = await request(app).get('/products/1');
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(seedProducts.find(p => p.productId === 1)!);
    });

    it('should update a product by ID', async () => {
        const product = seedProducts.find(p => p.productId === 1)!;
        const updatedProduct = { ...product, name: 'Updated Product' };
        const response = await request(app).put('/products/1').send(updatedProduct);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ name: 'Updated Product' });
    });

    it('should delete a product by ID', async () => {
        const response = await request(app).delete('/products/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing product', async () => {
        const response = await request(app).get('/products/999');
        expect(response.status).toBe(404);
    });

    it('should return 400 when creating a product with missing required fields', async () => {
        const response = await request(app).post('/products').send({ name: 'Missing Fields' });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Validation failed' });
        expect(Array.isArray(response.body.details)).toBe(true);
        expect(response.body.details.length).toBeGreaterThan(0);
    });

    it('should return 400 when creating a product with a negative price', async () => {
        const response = await request(app).post('/products').send({
            supplierId: 1,
            name: 'Bad Price Product',
            price: -5,
            sku: 'BAD-001'
        });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Validation failed' });
        expect(response.body.details.some((d: string) => d.toLowerCase().includes('price'))).toBe(true);
    });

    it('should return 400 when creating a product with a zero price', async () => {
        const response = await request(app).post('/products').send({
            supplierId: 1,
            name: 'Zero Price Product',
            price: 0,
            sku: 'ZERO-001'
        });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Validation failed' });
    });

    it('should return 400 when creating a product with an invalid SKU', async () => {
        const response = await request(app).post('/products').send({
            supplierId: 1,
            name: 'Bad SKU Product',
            price: 10.99,
            sku: 'INVALID SKU!'
        });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Validation failed' });
        expect(response.body.details.some((d: string) => d.toLowerCase().includes('sku'))).toBe(true);
    });

    it('should return 400 when creating a product with an empty name', async () => {
        const response = await request(app).post('/products').send({
            supplierId: 1,
            name: '',
            price: 10.99,
            sku: 'EMPTY-NAME-001'
        });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Validation failed' });
    });

    it('should return 400 when updating a product with invalid data', async () => {
        const product = seedProducts.find(p => p.productId === 1)!;
        const response = await request(app).put('/products/1').send({ ...product, price: -1 });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Validation failed' });
    });
});
