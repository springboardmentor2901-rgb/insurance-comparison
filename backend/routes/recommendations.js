import express from 'express';
import { getRecommendations } from '../data/mockData.js';

const router = express.Router();

// POST /api/recommendations - Get personalized recommendations
router.post('/', (req, res) => {
    const { age, income, riskLevel } = req.body;

    if (!age || !income || !riskLevel) {
        return res.status(400).json({ error: 'Missing required fields: age, income, riskLevel' });
    }

    const recommendations = getRecommendations({
        age: Number(age),
        income,
        riskLevel
    });

    res.json(recommendations);
});

export default router;
