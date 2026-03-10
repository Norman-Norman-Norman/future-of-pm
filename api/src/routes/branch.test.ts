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

    it('should get all branches with pagination metadata', async () => {
        const response = await request(app).get('/branches');
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(seedBranches.length);
        response.body.data.forEach((branch: any, index: number) => {
            expect(branch).toMatchObject(seedBranches[index]);
        });
        expect(response.body.pagination).toMatchObject({
            page: 1,
            limit: 20,
            total: seedBranches.length,
            totalPages: 1,
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

    it('should paginate branches with page and limit params', async () => {
        const response = await request(app).get('/branches?page=1&limit=1');
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.pagination.page).toBe(1);
        expect(response.body.pagination.limit).toBe(1);
        expect(response.body.pagination.total).toBe(seedBranches.length);
        expect(response.body.pagination.totalPages).toBe(seedBranches.length);
    });

    it('should return second page of branches', async () => {
        const response = await request(app).get('/branches?page=2&limit=1');
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.pagination.page).toBe(2);
        expect(response.body.data[0]).toMatchObject(seedBranches[1]);
    });

    it('should sort branches by name ascending', async () => {
        const response = await request(app).get('/branches?sortBy=name&sortOrder=asc');
        expect(response.status).toBe(200);
        const names = response.body.data.map((b: any) => b.name);
        expect(names).toEqual([...names].sort());
    });

    it('should sort branches by name descending', async () => {
        const response = await request(app).get('/branches?sortBy=name&sortOrder=desc');
        expect(response.status).toBe(200);
        const names = response.body.data.map((b: any) => b.name);
        expect(names).toEqual([...names].sort().reverse());
    });

    it('should filter branches by headquartersId', async () => {
        const response = await request(app).get('/branches?headquartersId=1');
        expect(response.status).toBe(200);
        response.body.data.forEach((b: any) => {
            expect(b.headquartersId).toBe(1);
        });
        expect(response.body.pagination.total).toBe(
            seedBranches.filter(b => b.headquartersId === 1).length
        );
    });

    it('should return empty data for a filter that matches nothing', async () => {
        const response = await request(app).get('/branches?headquartersId=999');
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual([]);
        expect(response.body.pagination.total).toBe(0);
    });

    it('should default to page 1 and limit 20 when params are absent', async () => {
        const response = await request(app).get('/branches');
        expect(response.status).toBe(200);
        expect(response.body.pagination.page).toBe(1);
        expect(response.body.pagination.limit).toBe(20);
    });
});
