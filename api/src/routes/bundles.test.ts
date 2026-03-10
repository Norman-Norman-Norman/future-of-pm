import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import bundleRouter, { resetBundles } from './bundles';
import { productBundles as seedBundles } from '../seedData';

let app: express.Express;

describe('Bundle API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/bundles', bundleRouter);
        resetBundles();
    });

    it('should create a new bundle', async () => {
        const newBundle = {
            bundleId: 3,
            name: "Grooming Essentials Kit",
            description: "Keep your cat looking their best",
            products: [
                { productId: 6, quantity: 1 },
                { productId: 7, quantity: 1 }
            ],
            discountPercentage: 12
        };
        const response = await request(app).post('/bundles').send(newBundle);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newBundle);
    });

    it('should get all bundles', async () => {
        const response = await request(app).get('/bundles');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedBundles.length);
        response.body.forEach((bundle: any, index: number) => {
            expect(bundle).toMatchObject(seedBundles[index]);
        });
    });

    it('should get a bundle by ID', async () => {
        const response = await request(app).get('/bundles/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedBundles[0]);
    });

    it('should update a bundle by ID', async () => {
        const updatedBundle = {
            ...seedBundles[0],
            name: 'Updated Smart Home Kit',
            discountPercentage: 20
        };
        const response = await request(app).put('/bundles/1').send(updatedBundle);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedBundle);
    });

    it('should delete a bundle by ID', async () => {
        const response = await request(app).delete('/bundles/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing bundle', async () => {
        const response = await request(app).get('/bundles/999');
        expect(response.status).toBe(404);
    });
});
