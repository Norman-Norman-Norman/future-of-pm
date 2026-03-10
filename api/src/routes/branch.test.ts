import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import branchRouter, { resetBranches } from './branch';
import { branches as seedBranches } from '../seedData';
import { JWT_SECRET } from '../middleware/auth';

let app: express.Express;
const authToken = jwt.sign({ userId: 1, email: 'user@octocat.com', role: 'user' }, JWT_SECRET);

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
        const response = await request(app)
            .post('/branches')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newBranch);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newBranch);
    });

    it('should return 401 when creating a branch without auth', async () => {
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
        expect(response.status).toBe(401);
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
        const response = await request(app)
            .put('/branches/1')
            .set('Authorization', `Bearer ${authToken}`)
            .send(updatedBranch);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedBranch);
    });

    it('should delete a branch by ID', async () => {
        const response = await request(app)
            .delete('/branches/1')
            .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing branch', async () => {
        const response = await request(app).get('/branches/999');
        expect(response.status).toBe(404);
    });
});
