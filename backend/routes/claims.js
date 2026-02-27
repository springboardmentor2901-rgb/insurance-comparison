import express from 'express';
import { claims, addClaim } from '../data/mockData.js';

const router = express.Router();

/* =========================
   GET CLAIMS
========================= */
router.get('/', (req, res) => {
    const { search, userId } = req.query;
    let result = [...claims];

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

/* =========================
   GET SINGLE CLAIM
========================= */
router.get('/:id', (req, res) => {
    const claim = claims.find(c => c.id === req.params.id);
    if (!claim) return res.status(404).json({ error: 'Claim not found' });
    res.json(claim);
});

/* =========================
   POST CLAIM WITH FRAUD RULES
========================= */
router.post('/', (req, res) => {
    const {
        fullName,
        email,
        phone,
        policyNumber,
        claimType,
        incidentDate,
        description,
        filesCount,
        userId
    } = req.body;

    if (!fullName || !email || !policyNumber || !claimType) {
        return res.status(400).json({
            error: 'Missing required fields: fullName, email, policyNumber, claimType'
        });
    }

    /* =========================
       FRAUD RULE ENGINE
    ========================= */

    let fraudScore = 0;
    let fraudReasons = [];

    // 🔴 Rule 1: Too many claims by same user
    if (userId) {
        const userClaims = claims.filter(c => c.userId === userId);
        if (userClaims.length >= 3) {
            fraudScore += 30;
            fraudReasons.push("Too many claims by same user");
        }
    }

    // 🔴 Rule 2: Same policy multiple claims
    const policyClaims = claims.filter(c => c.policyNumber === policyNumber);
    if (policyClaims.length >= 2) {
        fraudScore += 25;
        fraudReasons.push("Multiple claims on same policy");
    }

    // 🔴 Rule 3: High risk claim type
    const suspiciousTypes = ["accident", "total loss", "emergency"];
    if (suspiciousTypes.includes(claimType.toLowerCase())) {
        fraudScore += 20;
        fraudReasons.push("High risk claim type");
    }

    // 🔴 Rule 4: Incident reported same day
    if (incidentDate) {
        const today = new Date().toISOString().split('T')[0];
        if (incidentDate === today) {
            fraudScore += 25;
            fraudReasons.push("Incident reported same day");
        }
    }

    // Determine Risk Level
    let riskLevel = "Low";
    if (fraudScore > 60) riskLevel = "High";
    else if (fraudScore > 30) riskLevel = "Medium";

    const isFraud = fraudScore > 60;

    /* =========================
       CREATE CLAIM
    ========================= */

    const newClaim = addClaim({
        fullName,
        email,
        phone,
        policyNumber,
        claimType,
        incidentDate,
        description,
        filesCount: filesCount || 0,
        userId: userId || null,
        fraudScore,
        riskLevel,
        isFraud,
        fraudReasons
    });

    res.status(201).json(newClaim);
});

export default router;