import express from 'express';
import { checkClaimFraud } from '../utils/fraudDetection.js';
import { claims } from '../data/mockData.js';

const router = express.Router();

// POST /api/fraud/claims - analyze a claim payload
router.post('/claims', (req, res) => {
    const result = checkClaimFraud(req.body, claims);
    res.json(result);
});

export default router;
