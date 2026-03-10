import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import approvalRuleRouter, { resetApprovalRules } from './approvalRule';
import { approvalRules as seedApprovalRules } from '../seedData';

let app: express.Express;

describe('ApprovalRule API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/approval-rules', approvalRuleRouter);
        resetApprovalRules();
    });

    it('should create a new approval rule', async () => {
        const newRule = {
            ruleId: 10,
            minAmount: 250,
            requiredRole: 'manager'
        };
        const response = await request(app).post('/approval-rules').send(newRule);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newRule);
    });

    it('should get all approval rules', async () => {
        const response = await request(app).get('/approval-rules');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedApprovalRules.length);
    });

    it('should get an approval rule by ID', async () => {
        const response = await request(app).get('/approval-rules/1');
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(seedApprovalRules[0]);
    });

    it('should update an approval rule by ID', async () => {
        const updatedRule = {
            ...seedApprovalRules[0],
            minAmount: 750
        };
        const response = await request(app).put('/approval-rules/1').send(updatedRule);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedRule);
    });

    it('should delete an approval rule by ID', async () => {
        const response = await request(app).delete('/approval-rules/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing approval rule', async () => {
        const response = await request(app).get('/approval-rules/999');
        expect(response.status).toBe(404);
    });
});
