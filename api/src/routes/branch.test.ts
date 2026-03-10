import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import branchRouter, { resetBranches } from './branch';
import { branches as seedBranches } from '../seedData';

let app: express.Express;

describe('Branch API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/branches', branchRouter);
        resetBranches();
    });

    it('should create a new branch', async () => {
        const newBranch = {
            branchId: 3,
            headquartersId: 1,
            name: "Eastside Branch",
            description: "Eastern district branch",
            address: "321 East St",
            contactPerson: "Emma Davis",
            email: "edavis@octo.com",
            phone: "555-0203"
        };
        const response = await request(app).post('/branches').send(newBranch);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newBranch);
    });

    it('should get all branches', async () => {
        const response = await request(app).get('/branches');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedBranches.length);
        response.body.forEach((branch: any, index: number) => {
            expect(branch).toMatchObject(seedBranches[index]);
        });
    });

    it('should get a branch by ID', async () => {
        const response = await request(app).get('/branches/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedBranches[0]);
    });

    it('should update a branch by ID', async () => {
        const updatedBranch = {
            ...seedBranches[0],
            name: 'Updated Downtown Branch'
        };
        const response = await request(app).put('/branches/1').send(updatedBranch);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedBranch);
    });

    it('should delete a branch by ID', async () => {
        const response = await request(app).delete('/branches/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing branch', async () => {
        const response = await request(app).get('/branches/999');
        expect(response.status).toBe(404);
    });

    it('should return 400 when creating a branch with missing required fields', async () => {
        const response = await request(app).post('/branches').send({ name: 'Missing Fields Branch' });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Validation failed' });
        expect(Array.isArray(response.body.details)).toBe(true);
        expect(response.body.details.length).toBeGreaterThan(0);
    });

    it('should return 400 when creating a branch with an invalid email', async () => {
        const response = await request(app).post('/branches').send({
            branchId: 4,
            headquartersId: 1,
            name: 'Invalid Email Branch',
            email: 'not-an-email',
            phone: '555-0204'
        });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Validation failed' });
        expect(response.body.details.some((d: string) => d.toLowerCase().includes('email'))).toBe(true);
    });

    it('should return 400 when creating a branch with an empty name', async () => {
        const response = await request(app).post('/branches').send({
            headquartersId: 1,
            name: '',
            email: 'test@example.com'
        });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Validation failed' });
    });

    it('should return 400 when updating a branch with invalid data', async () => {
        const response = await request(app).put('/branches/1').send({
            ...seedBranches[0],
            email: 'invalid-email'
        });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Validation failed' });
    });
});
