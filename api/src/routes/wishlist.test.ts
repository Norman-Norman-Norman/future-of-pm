import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import wishlistRouter, { resetWishlist } from './wishlist';

let app: express.Express;

describe('Wishlist API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/wishlist', wishlistRouter);
        resetWishlist();
    });

    it('should return an empty wishlist initially', async () => {
        const response = await request(app).get('/wishlist');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should add a product to the wishlist', async () => {
        const response = await request(app).post('/wishlist').send({ productId: 1 });
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({ productId: 1 });
        expect(response.body.wishlistItemId).toBeDefined();
        expect(response.body.addedAt).toBeDefined();
    });

    it('should get all wishlist items', async () => {
        await request(app).post('/wishlist').send({ productId: 1 });
        await request(app).post('/wishlist').send({ productId: 2 });
        const response = await request(app).get('/wishlist');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    it('should return 409 when adding a duplicate product', async () => {
        await request(app).post('/wishlist').send({ productId: 1 });
        const response = await request(app).post('/wishlist').send({ productId: 1 });
        expect(response.status).toBe(409);
    });

    it('should remove a product from the wishlist', async () => {
        await request(app).post('/wishlist').send({ productId: 1 });
        const response = await request(app).delete('/wishlist/1');
        expect(response.status).toBe(204);
        const listResponse = await request(app).get('/wishlist');
        expect(listResponse.body.length).toBe(0);
    });

    it('should return 404 when removing a non-existing product', async () => {
        const response = await request(app).delete('/wishlist/999');
        expect(response.status).toBe(404);
    });
});
