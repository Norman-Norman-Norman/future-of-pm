import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import orderRouter, { resetOrders } from './order';
import approvalRuleRouter, { resetApprovalRules } from './approvalRule';
import { orders as seedOrders } from '../seedData';

let app: express.Express;

describe('Order API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/orders', orderRouter);
        app.use('/approval-rules', approvalRuleRouter);
        resetOrders();
        resetApprovalRules();
    });

    it('should create a new order', async () => {
        const newOrder = {
            orderId: 99,
            branchId: 1,
            orderDate: new Date().toISOString(),
            name: 'Test Order',
            description: 'Test order description',
            status: 'pending'
        };
        const response = await request(app).post('/orders').send(newOrder);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({ orderId: 99, name: 'Test Order' });
    });

    it('should get all orders', async () => {
        const response = await request(app).get('/orders');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedOrders.length);
    });

    it('should get an order by ID', async () => {
        const response = await request(app).get('/orders/1');
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(seedOrders[0]);
    });

    it('should update an order by ID', async () => {
        const updatedOrder = {
            ...seedOrders[0],
            name: 'Updated Order Name'
        };
        const response = await request(app).put('/orders/1').send(updatedOrder);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ name: 'Updated Order Name' });
    });

    it('should delete an order by ID', async () => {
        const response = await request(app).delete('/orders/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing order', async () => {
        const response = await request(app).get('/orders/999');
        expect(response.status).toBe(404);
    });

    // Approval workflow tests
    it('should set status to pending-approval when order amount exceeds threshold', async () => {
        const newOrder = {
            orderId: 100,
            branchId: 1,
            orderDate: new Date().toISOString(),
            name: 'Large Order',
            description: 'Order above threshold',
            status: 'submitted',
            totalAmount: 600
        };
        const response = await request(app).post('/orders').send(newOrder);
        expect(response.status).toBe(201);
        expect(response.body.status).toBe('pending-approval');
    });

    it('should set status to approved when order amount is below threshold', async () => {
        const newOrder = {
            orderId: 101,
            branchId: 1,
            orderDate: new Date().toISOString(),
            name: 'Small Order',
            description: 'Order below threshold',
            status: 'submitted',
            totalAmount: 400
        };
        const response = await request(app).post('/orders').send(newOrder);
        expect(response.status).toBe(201);
        expect(response.body.status).toBe('approved');
    });

    it('should return pending-approval orders', async () => {
        // Create a pending-approval order
        await request(app).post('/orders').send({
            orderId: 102,
            branchId: 1,
            orderDate: new Date().toISOString(),
            name: 'Pending Order',
            description: 'Needs approval',
            status: 'submitted',
            totalAmount: 750
        });

        const response = await request(app).get('/orders/pending-approval');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body.every((o: { status: string }) => o.status === 'pending-approval')).toBe(true);
    });

    it('should approve an order with admin role', async () => {
        // Create a pending-approval order
        await request(app).post('/orders').send({
            orderId: 103,
            branchId: 1,
            orderDate: new Date().toISOString(),
            name: 'Pending Approval Order',
            description: 'Needs approval',
            status: 'submitted',
            totalAmount: 600
        });

        const response = await request(app)
            .put('/orders/103/approve')
            .send({ approvedBy: 'Sarah Mitchell', role: 'admin' });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('approved');
        expect(response.body.approvedBy).toBe('Sarah Mitchell');
    });

    it('should reject an order with manager role', async () => {
        // Create a pending-approval order
        await request(app).post('/orders').send({
            orderId: 104,
            branchId: 1,
            orderDate: new Date().toISOString(),
            name: 'Rejected Order',
            description: 'Will be rejected',
            status: 'submitted',
            totalAmount: 800
        });

        const response = await request(app)
            .put('/orders/104/reject')
            .send({
                rejectedBy: 'Priya Sharma',
                rejectionReason: 'Over budget for this quarter',
                role: 'manager'
            });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('rejected');
        expect(response.body.rejectedBy).toBe('Priya Sharma');
        expect(response.body.rejectionReason).toBe('Over budget for this quarter');
    });

    it('should return 403 when non-admin user tries to approve', async () => {
        const response = await request(app)
            .put('/orders/1/approve')
            .send({ approvedBy: 'Regular User', role: 'user' });

        expect(response.status).toBe(403);
    });

    it('should return 403 when non-admin user tries to reject', async () => {
        const response = await request(app)
            .put('/orders/1/reject')
            .send({ rejectedBy: 'Regular User', rejectionReason: 'Not needed', role: 'user' });

        expect(response.status).toBe(403);
    });

    it('should return 404 when approving non-existing order', async () => {
        const response = await request(app)
            .put('/orders/999/approve')
            .send({ approvedBy: 'Admin', role: 'admin' });

        expect(response.status).toBe(404);
    });
});
