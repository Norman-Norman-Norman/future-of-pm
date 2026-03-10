import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import loyaltyRouter, { resetLoyaltyAccounts } from './loyalty';
import { loyaltyAccounts as seedLoyaltyAccounts } from '../seedData';

let app: express.Express;

describe('Loyalty API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/loyalty', loyaltyRouter);
        resetLoyaltyAccounts();
    });

    it('should create a new loyalty account', async () => {
        const newAccount = {
            accountId: 3,
            branchId: 3,
            totalPoints: 0,
            lifetimePoints: 0,
            tier: 'bronze',
            history: []
        };
        const response = await request(app).post('/loyalty').send(newAccount);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newAccount);
    });

    it('should get all loyalty accounts', async () => {
        const response = await request(app).get('/loyalty');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedLoyaltyAccounts.length);
    });

    it('should get a loyalty account by ID', async () => {
        const response = await request(app).get('/loyalty/1');
        expect(response.status).toBe(200);
        expect(response.body.accountId).toBe(1);
        expect(response.body.branchId).toBe(seedLoyaltyAccounts[0].branchId);
    });

    it('should get a loyalty account by branch ID', async () => {
        const response = await request(app).get('/loyalty/branch/1');
        expect(response.status).toBe(200);
        expect(response.body.branchId).toBe(1);
    });

    it('should update a loyalty account by ID', async () => {
        const updated = {
            ...seedLoyaltyAccounts[0],
            totalPoints: 999
        };
        const response = await request(app).put('/loyalty/1').send(updated);
        expect(response.status).toBe(200);
        expect(response.body.totalPoints).toBe(999);
    });

    it('should delete a loyalty account by ID', async () => {
        const response = await request(app).delete('/loyalty/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing loyalty account', async () => {
        const response = await request(app).get('/loyalty/999');
        expect(response.status).toBe(404);
    });

    it('should return 404 for non-existing branch loyalty account', async () => {
        const response = await request(app).get('/loyalty/branch/999');
        expect(response.status).toBe(404);
    });

    it('should earn points based on order total and tier multiplier', async () => {
        const response = await request(app)
            .post('/loyalty/1/earn')
            .send({ orderTotal: 100, orderId: 5 });
        expect(response.status).toBe(200);
        // Bronze tier: 1x multiplier → 100 points
        expect(response.body.totalPoints).toBe(550);
        expect(response.body.lifetimePoints).toBe(550);
        expect(response.body.history).toHaveLength(2);
        expect(response.body.history[1].type).toBe('earn');
        expect(response.body.history[1].points).toBe(100);
    });

    it('should upgrade tier when lifetime points cross threshold', async () => {
        // Account 1 has 450 lifetime points (bronze). Earn 600 more → 1050 → silver
        const response = await request(app)
            .post('/loyalty/1/earn')
            .send({ orderTotal: 600 });
        expect(response.status).toBe(200);
        expect(response.body.tier).toBe('silver');
    });

    it('should redeem points successfully', async () => {
        const response = await request(app)
            .post('/loyalty/1/redeem')
            .send({ points: 100 });
        expect(response.status).toBe(200);
        expect(response.body.totalPoints).toBe(350);
        expect(response.body.history).toHaveLength(2);
        expect(response.body.history[1].type).toBe('redeem');
        expect(response.body.history[1].points).toBe(100);
    });

    it('should return 400 when redeeming more points than available', async () => {
        const response = await request(app)
            .post('/loyalty/1/redeem')
            .send({ points: 10000 });
        expect(response.status).toBe(400);
    });

    it('should return 404 when earning points for non-existing account', async () => {
        const response = await request(app)
            .post('/loyalty/999/earn')
            .send({ orderTotal: 100 });
        expect(response.status).toBe(404);
    });

    it('should return 404 when redeeming points for non-existing account', async () => {
        const response = await request(app)
            .post('/loyalty/999/redeem')
            .send({ points: 50 });
        expect(response.status).toBe(404);
    });
});
