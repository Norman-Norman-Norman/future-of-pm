import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import headquartersRouter, { resetHeadquarters } from './headquarters';
import { headquarters as seedHeadquarters } from '../seedData';

let app: express.Express;

describe('Headquarters API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/headquarters', headquartersRouter);
        resetHeadquarters();
    });

    it('should create a new headquarters', async () => {
        const newHeadquarters = {
            ...seedHeadquarters[0],
            headquartersId: 99,
            name: 'New Headquarters'
        };

        const response = await request(app).post('/headquarters').send(newHeadquarters);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(newHeadquarters);
    });

    it('should get all headquarters', async () => {
        const response = await request(app).get('/headquarters');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(seedHeadquarters.length);
        expect(response.body).toEqual(seedHeadquarters);
    });

    it('should get headquarters by ID', async () => {
        const response = await request(app).get('/headquarters/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedHeadquarters[0]);
    });

    it('should update headquarters by ID', async () => {
        const updatedHeadquarters = {
            ...seedHeadquarters[0],
            name: 'Updated Headquarters'
        };

        const response = await request(app).put('/headquarters/1').send(updatedHeadquarters);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedHeadquarters);
    });

    it('should delete headquarters by ID', async () => {
        const response = await request(app).delete('/headquarters/1');

        expect(response.status).toBe(204);

        const deleted = await request(app).get('/headquarters/1');
        expect(deleted.status).toBe(404);
    });

    it('should return 404 for non-existing headquarters', async () => {
        const response = await request(app).get('/headquarters/999');

        expect(response.status).toBe(404);
    });
});
