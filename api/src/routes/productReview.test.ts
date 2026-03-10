import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import productRouter from './product';
import { resetReviews } from './productReview';
import { productReviews as seedReviews } from '../seedData';

let app: express.Express;

describe('ProductReview API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/products', productRouter);
        resetReviews();
    });

    it('should get all reviews for a product', async () => {
        const response = await request(app).get('/products/1/reviews');
        expect(response.status).toBe(200);
        const product1Reviews = seedReviews.filter(r => r.productId === 1);
        expect(response.body.length).toBe(product1Reviews.length);
        response.body.forEach((review: any) => {
            expect(review.productId).toBe(1);
        });
    });

    it('should return an empty array for a product with no reviews', async () => {
        const response = await request(app).get('/products/999/reviews');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should create a new review for a product', async () => {
        const newReview = {
            reviewId: 100,
            displayName: 'Test User',
            rating: 5,
            title: 'Great product',
            body: 'Really love this cat gadget!',
            createdAt: '2025-03-01T12:00:00.000Z',
            helpful: 0
        };
        const response = await request(app).post('/products/1/reviews').send(newReview);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({ ...newReview, productId: 1 });
    });

    it('should auto-assign reviewId and createdAt when not provided', async () => {
        const newReview = {
            displayName: 'Auto User',
            rating: 3,
            title: 'Decent',
            body: 'It works okay.'
        };
        const response = await request(app).post('/products/2/reviews').send(newReview);
        expect(response.status).toBe(201);
        expect(response.body.reviewId).toBeDefined();
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.helpful).toBe(0);
        expect(response.body.productId).toBe(2);
    });

    it('should update a review by ID', async () => {
        const updatedReview = {
            ...seedReviews[0],
            title: 'Updated Title',
            body: 'Updated review body.'
        };
        const response = await request(app)
            .put(`/products/${seedReviews[0].productId}/reviews/${seedReviews[0].reviewId}`)
            .send(updatedReview);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Updated Title');
        expect(response.body.body).toBe('Updated review body.');
    });

    it('should return 404 when updating a non-existent review', async () => {
        const response = await request(app)
            .put('/products/1/reviews/9999')
            .send({ title: 'nope', body: 'nope', rating: 1, displayName: 'ghost', helpful: 0, createdAt: '' });
        expect(response.status).toBe(404);
    });

    it('should delete a review by ID', async () => {
        const response = await request(app)
            .delete(`/products/${seedReviews[0].productId}/reviews/${seedReviews[0].reviewId}`);
        expect(response.status).toBe(204);

        const getResponse = await request(app).get(`/products/${seedReviews[0].productId}/reviews`);
        const deletedReview = getResponse.body.find((r: any) => r.reviewId === seedReviews[0].reviewId);
        expect(deletedReview).toBeUndefined();
    });

    it('should return 404 when deleting a non-existent review', async () => {
        const response = await request(app).delete('/products/1/reviews/9999');
        expect(response.status).toBe(404);
    });

    it('should mark a review as helpful', async () => {
        const review = seedReviews[0];
        const response = await request(app)
            .post(`/products/${review.productId}/reviews/${review.reviewId}/helpful`);
        expect(response.status).toBe(200);
        expect(response.body.helpful).toBe(review.helpful + 1);
    });

    it('should return 404 when marking a non-existent review as helpful', async () => {
        const response = await request(app).post('/products/1/reviews/9999/helpful');
        expect(response.status).toBe(404);
    });

    it('should sort reviews by most recent by default', async () => {
        const response = await request(app).get('/products/1/reviews');
        expect(response.status).toBe(200);
        for (let i = 1; i < response.body.length; i++) {
            const prev = new Date(response.body[i - 1].createdAt).getTime();
            const curr = new Date(response.body[i].createdAt).getTime();
            expect(prev).toBeGreaterThanOrEqual(curr);
        }
    });

    it('should sort reviews by highest rating', async () => {
        // Add a second review to product 1 with lower rating to test sort
        await request(app).post('/products/1/reviews').send({
            displayName: 'Sort Tester',
            rating: 2,
            title: 'Meh',
            body: 'Not great.'
        });
        const response = await request(app).get('/products/1/reviews?sort=highest');
        expect(response.status).toBe(200);
        for (let i = 1; i < response.body.length; i++) {
            expect(response.body[i - 1].rating).toBeGreaterThanOrEqual(response.body[i].rating);
        }
    });

    it('should sort reviews by most helpful', async () => {
        const response = await request(app).get('/products/1/reviews?sort=helpful');
        expect(response.status).toBe(200);
        for (let i = 1; i < response.body.length; i++) {
            expect(response.body[i - 1].helpful).toBeGreaterThanOrEqual(response.body[i].helpful);
        }
    });
});
