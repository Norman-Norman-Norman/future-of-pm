import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import productRouter, { resetProductReviews, resetProducts } from './product';

let app: express.Express;

describe('Product API', () => {
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/products', productRouter);
    resetProducts();
    resetProductReviews();
  });

  it('returns product detail with normalized images, specifications, and review summary', async () => {
    const response = await request(app).get('/products/1');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      productId: 1,
      name: 'SmartFeeder One',
      category: 'Feeding',
      images: [{ url: '/feeder.png', alt: 'SmartFeeder One product image', isPrimary: true }],
      reviewSummary: {
        averageRating: 4.5,
        reviewCount: 2,
        ratingCounts: { one: 0, two: 0, three: 0, four: 1, five: 1 }
      }
    });
    expect(response.body.specifications).toEqual([
      { label: 'Capacity', value: '6 meal compartments' },
      { label: 'Connectivity', value: 'Wi-Fi app scheduling with offline fallback' },
      { label: 'Power', value: 'USB-C with 24-hour battery backup' }
    ]);
  });

  it('returns an empty review summary for products without reviews', async () => {
    const response = await request(app).get('/products/12');

    expect(response.status).toBe(200);
    expect(response.body.reviewSummary).toEqual({
      averageRating: 0,
      reviewCount: 0,
      ratingCounts: { one: 0, two: 0, three: 0, four: 0, five: 0 }
    });
  });

  it('returns read-only reviews for the requested product in newest-first order', async () => {
    const response = await request(app).get('/products/1/reviews');

    expect(response.status).toBe(200);
    expect(response.body.map((review: { reviewId: number }) => review.reviewId)).toEqual([1, 2]);
    expect(response.body.every((review: { productId: number }) => review.productId === 1)).toBe(true);
  });

  it('returns deterministic related products without the source product', async () => {
    const response = await request(app).get('/products/1/related');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(4);
    expect(response.body.map((product: { productId: number }) => product.productId)).toEqual([10, 7, 2, 6]);
    expect(response.body.some((product: { productId: number }) => product.productId === 1)).toBe(false);
  });

  it('validates product IDs and related product limits', async () => {
    const invalidDetail = await request(app).get('/products/not-a-number');
    const invalidLimit = await request(app).get('/products/1/related?limit=0');
    const cappedLimit = await request(app).get('/products/1/related?limit=99');

    expect(invalidDetail.status).toBe(400);
    expect(invalidLimit.status).toBe(400);
    expect(cappedLimit.status).toBe(200);
    expect(cappedLimit.body).toHaveLength(8);
  });

  it('returns 404 for missing product detail, reviews, and related products', async () => {
    const detail = await request(app).get('/products/999');
    const reviews = await request(app).get('/products/999/reviews');
    const related = await request(app).get('/products/999/related');

    expect(detail.status).toBe(404);
    expect(reviews.status).toBe(404);
    expect(related.status).toBe(404);
  });
});
