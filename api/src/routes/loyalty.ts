/**
 * @swagger
 * tags:
 *   name: Loyalty
 *   description: API endpoints for managing Paw Points loyalty accounts
 */

/**
 * @swagger
 * /api/loyalty:
 *   get:
 *     summary: Returns all loyalty accounts
 *     tags: [Loyalty]
 *     responses:
 *       200:
 *         description: List of all loyalty accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LoyaltyAccount'
 *   post:
 *     summary: Create a new loyalty account
 *     tags: [Loyalty]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoyaltyAccount'
 *     responses:
 *       201:
 *         description: Loyalty account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoyaltyAccount'
 *
 * /api/loyalty/branch/{branchId}:
 *   get:
 *     summary: Get a loyalty account by branch ID
 *     tags: [Loyalty]
 *     parameters:
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: Loyalty account found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoyaltyAccount'
 *       404:
 *         description: Loyalty account not found for this branch
 *
 * /api/loyalty/{id}:
 *   get:
 *     summary: Get a loyalty account by ID
 *     tags: [Loyalty]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID
 *     responses:
 *       200:
 *         description: Loyalty account found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoyaltyAccount'
 *       404:
 *         description: Loyalty account not found
 *   put:
 *     summary: Update a loyalty account
 *     tags: [Loyalty]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoyaltyAccount'
 *     responses:
 *       200:
 *         description: Loyalty account updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoyaltyAccount'
 *       404:
 *         description: Loyalty account not found
 *   delete:
 *     summary: Delete a loyalty account
 *     tags: [Loyalty]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID
 *     responses:
 *       204:
 *         description: Loyalty account deleted successfully
 *       404:
 *         description: Loyalty account not found
 *
 * /api/loyalty/{id}/earn:
 *   post:
 *     summary: Earn points from an order
 *     tags: [Loyalty]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderTotal
 *             properties:
 *               orderTotal:
 *                 type: number
 *                 description: Order total in dollars
 *               orderId:
 *                 type: integer
 *                 description: Associated order ID (optional)
 *     responses:
 *       200:
 *         description: Points earned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoyaltyAccount'
 *       404:
 *         description: Loyalty account not found
 *
 * /api/loyalty/{id}/redeem:
 *   post:
 *     summary: Redeem points for a discount
 *     tags: [Loyalty]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - points
 *             properties:
 *               points:
 *                 type: number
 *                 description: Number of points to redeem
 *               description:
 *                 type: string
 *                 description: Description of redemption
 *     responses:
 *       200:
 *         description: Points redeemed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoyaltyAccount'
 *       400:
 *         description: Insufficient points
 *       404:
 *         description: Loyalty account not found
 */

import express from 'express';
import { LoyaltyAccount, LoyaltyTransaction } from '../models/loyalty';
import { loyaltyAccounts as seedLoyaltyAccounts } from '../seedData';

const router = express.Router();

let loyaltyAccounts: LoyaltyAccount[] = seedLoyaltyAccounts.map(account => ({
    ...account,
    history: [...account.history]
}));

export const resetLoyaltyAccounts = () => {
    loyaltyAccounts = seedLoyaltyAccounts.map(account => ({
        ...account,
        history: [...account.history]
    }));
};

const getTier = (lifetimePoints: number): LoyaltyAccount['tier'] => {
    if (lifetimePoints >= 10000) return 'platinum';
    if (lifetimePoints >= 5000) return 'gold';
    if (lifetimePoints >= 1000) return 'silver';
    return 'bronze';
};

const getTierMultiplier = (tier: LoyaltyAccount['tier']): number => {
    switch (tier) {
        case 'platinum': return 3;
        case 'gold': return 2;
        case 'silver': return 1.5;
        default: return 1;
    }
};

const nextTransactionId = (history: LoyaltyTransaction[]): number =>
    history.length === 0 ? 1 : Math.max(...history.map(t => t.transactionId)) + 1;

// Create a new loyalty account
router.post('/', (req, res) => {
    const newAccount: LoyaltyAccount = req.body;
    loyaltyAccounts.push(newAccount);
    res.status(201).json(newAccount);
});

// Get all loyalty accounts
router.get('/', (req, res) => {
    res.json(loyaltyAccounts);
});

// Get loyalty account by branch ID (must come before /:id)
router.get('/branch/:branchId', (req, res) => {
    const account = loyaltyAccounts.find(
        a => a.branchId === parseInt(req.params.branchId)
    );
    if (account) {
        res.json(account);
    } else {
        res.status(404).send('Loyalty account not found for this branch');
    }
});

// Get loyalty account by ID
router.get('/:id', (req, res) => {
    const account = loyaltyAccounts.find(
        a => a.accountId === parseInt(req.params.id)
    );
    if (account) {
        res.json(account);
    } else {
        res.status(404).send('Loyalty account not found');
    }
});

// Update a loyalty account by ID
router.put('/:id', (req, res) => {
    const index = loyaltyAccounts.findIndex(
        a => a.accountId === parseInt(req.params.id)
    );
    if (index !== -1) {
        loyaltyAccounts[index] = req.body;
        res.json(loyaltyAccounts[index]);
    } else {
        res.status(404).send('Loyalty account not found');
    }
});

// Delete a loyalty account by ID
router.delete('/:id', (req, res) => {
    const index = loyaltyAccounts.findIndex(
        a => a.accountId === parseInt(req.params.id)
    );
    if (index !== -1) {
        loyaltyAccounts.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Loyalty account not found');
    }
});

// Earn points from an order
router.post('/:id/earn', (req, res) => {
    const index = loyaltyAccounts.findIndex(
        a => a.accountId === parseInt(req.params.id)
    );
    if (index === -1) {
        res.status(404).send('Loyalty account not found');
    } else {
        const { orderTotal, orderId } = req.body;
        const account = loyaltyAccounts[index];
        const multiplier = getTierMultiplier(account.tier);
        const earnedPoints = Math.floor(orderTotal * multiplier);

        const transaction: LoyaltyTransaction = {
            transactionId: nextTransactionId(account.history),
            type: 'earn',
            points: earnedPoints,
            orderId,
            description: orderId
                ? `Points earned from order #${orderId}`
                : `Points earned from $${orderTotal.toFixed(2)} purchase`,
            createdAt: new Date().toISOString()
        };

        account.totalPoints += earnedPoints;
        account.lifetimePoints += earnedPoints;
        account.tier = getTier(account.lifetimePoints);
        account.history.push(transaction);

        res.json(account);
    }
});

// Redeem points for a discount
router.post('/:id/redeem', (req, res) => {
    const index = loyaltyAccounts.findIndex(
        a => a.accountId === parseInt(req.params.id)
    );
    if (index === -1) {
        res.status(404).send('Loyalty account not found');
    } else {
        const { points, description } = req.body;
        const account = loyaltyAccounts[index];

        if (points > account.totalPoints) {
            res.status(400).send('Insufficient points');
        } else {
            const discountAmount = (points / 100).toFixed(2);
            const transaction: LoyaltyTransaction = {
                transactionId: nextTransactionId(account.history),
                type: 'redeem',
                points,
                description: description || `Points redeemed for $${discountAmount} discount`,
                createdAt: new Date().toISOString()
            };

            account.totalPoints -= points;
            account.history.push(transaction);

            res.json(account);
        }
    }
});

export default router;
