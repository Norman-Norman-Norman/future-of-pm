import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import branchRouter from './branch';
import deliveryRouter from './delivery';
import headquartersRouter from './headquarters';
import orderRouter from './order';
import orderDetailRouter from './orderDetail';
import orderDetailDeliveryRouter from './orderDetailDelivery';
import productRouter from './product';
import supplierRouter from './supplier';
import { branches, deliveries, orders, products } from '../seedData';

const mount = (path: string, router: express.Router) => {
    const app = express();
    app.use(express.json());
    app.use(path, router);
    return app;
};

const expectValidationFailure = (body: unknown) => {
    expect(body).toEqual({
        error: 'Validation failed',
        details: expect.arrayContaining([
            expect.objectContaining({
                path: expect.any(String),
                message: expect.any(String)
            })
        ])
    });
};

describe('API request body validation', () => {
    it.each([
        ['/branches', branchRouter],
        ['/deliveries', deliveryRouter],
        ['/headquarters', headquartersRouter],
        ['/orders', orderRouter],
        ['/order-details', orderDetailRouter],
        ['/order-detail-deliveries', orderDetailDeliveryRouter],
        ['/products', productRouter],
        ['/suppliers', supplierRouter]
    ])('rejects invalid POST bodies for %s', async (path, router) => {
        const response = await request(mount(path, router)).post(path).send({});

        expect(response.status).toBe(400);
        expectValidationFailure(response.body);
    });

    it('trims validated branch string fields before storing', async () => {
        const app = mount('/branches', branchRouter);
        const response = await request(app).post('/branches').send({
            ...branches[0],
            branchId: 99,
            name: '  Trimmed Branch  '
        });

        expect(response.status).toBe(201);
        expect(response.body.name).toBe('Trimmed Branch');
    });

    it('rejects invalid branch email addresses', async () => {
        const response = await request(mount('/branches', branchRouter))
            .post('/branches')
            .send({ ...branches[0], email: 'not-an-email' });

        expect(response.status).toBe(400);
        expectValidationFailure(response.body);
    });

    it('rejects invalid product price and SKU values', async () => {
        const response = await request(mount('/products', productRouter))
            .post('/products')
            .send({ ...products[0], price: -1, sku: 'bad sku!' });

        expect(response.status).toBe(400);
        expect(response.body.details).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ path: 'price' }),
                expect.objectContaining({ path: 'sku' })
            ])
        );
    });

    it('rejects unsupported order statuses', async () => {
        const response = await request(mount('/orders', orderRouter))
            .put('/orders/1')
            .send({ ...orders[0], status: 'lost' });

        expect(response.status).toBe(400);
        expectValidationFailure(response.body);
    });

    it('rejects unsupported delivery statuses and extra status-command fields', async () => {
        const app = mount('/deliveries', deliveryRouter);
        const invalidStatus = await request(app)
            .put('/deliveries/1')
            .send({ ...deliveries[0], status: 'lost' });
        const commandField = await request(app)
            .put('/deliveries/1/status')
            .send({ status: 'delivered', notifyCommand: 'echo exploited' });

        expect(invalidStatus.status).toBe(400);
        expectValidationFailure(invalidStatus.body);
        expect(commandField.status).toBe(400);
        expectValidationFailure(commandField.body);
    });
});
