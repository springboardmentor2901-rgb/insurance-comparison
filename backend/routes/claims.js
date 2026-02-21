import express from 'express';
import { claims, addClaim } from '../data/mockData.js';

const router = express.Router();

// GET /api/claims - Get claims (with optional userId filter and search)
router.get('/', (req, res) => {
    const { search, userId } = req.query;
    let result = [...claims];

    // Filter by userId if provided (for user-specific claim tracking)
    if (userId) {
        result = result.filter(c => c.userId === parseInt(userId));
    }

    if (search) {
        const s = search.toLowerCase();
        result = result.filter(c =>
            c.id.toLowerCase().includes(s) ||
            (c.policyName && c.policyName.toLowerCase().includes(s)) ||
            (c.policyNumber && c.policyNumber.toLowerCase().includes(s)) ||
            (c.fullName && c.fullName.toLowerCase().includes(s))
        );
    }

    res.json(result);
});

// GET /api/claims/:id - Get single claim
router.get('/:id', (req, res) => {
    const claim = claims.find(c => c.id === req.params.id);
    if (!claim) return res.status(404).json({ error: 'Claim not found' });
    res.json(claim);
});

// POST /api/claims - Create a new claim
router.post('/', (req, res) => {
    const { fullName, email, phone, policyNumber, claimType, incidentDate, description, filesCount, userId } = req.body;

    if (!fullName || !email || !policyNumber || !claimType) {
        return res.status(400).json({ error: 'Missing required fields: fullName, email, policyNumber, claimType' });
    }

    const newClaim = addClaim({
        fullName, email, phone, policyNumber,
        claimType, incidentDate, description,
        filesCount: filesCount || 0,
        userId: userId || null
    });

    res.status(201).json(newClaim);
});

export default router;
