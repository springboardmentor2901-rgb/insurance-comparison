import express from 'express';
import { calculatePremium } from '../data/mockData.js';

const router = express.Router();

// POST /api/calculator - Calculate premium
router.post('/', (req, res) => {
    const { age, coverage, duration, policyType } = req.body;

    if (!age || !coverage || !duration || !policyType) {
        return res.status(400).json({ error: 'Missing required fields: age, coverage, duration, policyType' });
    }

    const result = calculatePremium(
        Number(age),
        Number(coverage),
        Number(duration),
        policyType
    );

    res.json(result);
});

export default router;
