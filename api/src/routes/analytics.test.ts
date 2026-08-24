import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import analyticsRouter from './analytics';
import orderRouter from './order';
import { resetAnalyticsState } from '../dataStore';

let app: express.Express;

describe('Analytics API', () => {
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/analytics', analyticsRouter);
    app.use('/orders', orderRouter);
    resetAnalyticsState();
  });

  it('returns deterministic dashboard summary totals', async () => {
    const response = await request(app).get('/analytics/summary');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      totalOrders: 3,
      grossOrderValue: 3049.7,
      averageOrderValue: 1524.85,
      pendingDeliveries: 2,
      lowStockCount: 5
    });
    expect(response.body.generatedAt).toEqual(expect.any(String));
  });

  it('includes every known order status with zero counts', async () => {
    const response = await request(app).get('/analytics/orders-by-status');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { status: 'pending', count: 1 },
      { status: 'processing', count: 1 },
      { status: 'shipped', count: 0 },
      { status: 'delivered', count: 0 },
      { status: 'cancelled', count: 1 }
    ]);
  });

  it('reflects order mutations through shared state', async () => {
    await request(app).post('/orders').send({
      orderId: 4,
      branchId: 1,
      orderDate: new Date().toISOString(),
      name: 'New shipped order',
      description: 'Mutation test order',
      status: 'shipped'
    });

    const response = await request(app).get('/analytics/orders-by-status');

    expect(response.body.find((item: { status: string }) => item.status === 'shipped')).toEqual({
      status: 'shipped',
      count: 1
    });
  });

  it('classifies delivery performance without NaN rates', async () => {
    const response = await request(app).get('/analytics/delivery-performance');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      onTime: 1,
      late: 1,
      notYetDelivered: 2,
      onTimeRate: 50
    });
  });

  it('returns low stock products including equality at reorder point', async () => {
    const response = await request(app).get('/analytics/low-stock');

    expect(response.status).toBe(200);
    expect(response.body.map((product: { sku: string }) => product.sku)).toContain('CAT-LITTER-001');
    expect(response.body.every((product: { stockLevel: number; reorderPoint: number }) => product.stockLevel <= product.reorderPoint)).toBe(true);
  });

  it('sorts recent orders by date descending with limit validation', async () => {
    const response = await request(app).get('/analytics/recent-orders?limit=2');
    const invalid = await request(app).get('/analytics/recent-orders?limit=0');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].orderId).toBe(1);
    expect(invalid.status).toBe(400);
  });

  it('ranks top products by units sold, revenue, and stable product ID ties', async () => {
    const response = await request(app).get('/analytics/top-products?limit=3');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { productId: 4, unitsSold: 20, revenue: 1599.8, name: 'PawTrack Smart Collar' },
      { productId: 2, unitsSold: 5, revenue: 999.95, name: 'AutoClean Litter Dome' },
      { productId: 3, unitsSold: 5, revenue: 449.95, name: 'CatFlix Entertainment Portal' }
    ]);
  });
});
