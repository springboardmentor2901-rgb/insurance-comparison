import express from 'express';
import { policies, policyTypes } from '../data/mockData.js';

const router = express.Router();

// GET /api/policies - Get all policies (with optional filters)
router.get('/', (req, res) => {
    let result = [...policies];
    const { type, maxPremium, minCoverage, maxDuration } = req.query;

    if (type && type !== 'All') {
        result = result.filter(p => p.type === type);
    }
    if (maxPremium) {
        result = result.filter(p => p.premium <= Number(maxPremium));
    }
    if (minCoverage) {
        result = result.filter(p => p.coverage >= Number(minCoverage));
    }
    if (maxDuration) {
        result = result.filter(p => p.duration <= Number(maxDuration));
    }

    res.json({ policies: result, types: policyTypes });
});

// GET /api/policies/:id - Get single policy
router.get('/:id', (req, res) => {
    const policy = policies.find(p => p.id === Number(req.params.id));
    if (!policy) return res.status(404).json({ error: 'Policy not found' });
    res.json(policy);
});

export default router;
