import express from 'express';
import { policies } from '../data/mockData.js';

const router = express.Router();

// POST /api/quotes - Generate insurance quotes based on user input
router.post('/', (req, res) => {
    const { fullName, age, gender, smoker, occupation, coverageAmount, policyType, dependents, preExisting } = req.body;

    if (!fullName || !age || !policyType) {
        return res.status(400).json({ error: 'fullName, age, and policyType are required' });
    }

    const ageVal = Number(age);
    const coverageVal = Number(coverageAmount) || 1000000;

    // Filter matching policies
    let matchingPolicies = policies.filter(p => p.type === policyType);
    if (matchingPolicies.length === 0) {
        matchingPolicies = policies.filter(p => p.type === 'Health').slice(0, 3);
    }

    // Calculate personalized quotes
    const quotes = matchingPolicies.map(policy => {
        let basePremium = policy.premium;

        // Age factor
        if (ageVal < 25) basePremium *= 0.8;
        else if (ageVal < 35) basePremium *= 1.0;
        else if (ageVal < 45) basePremium *= 1.25;
        else if (ageVal < 55) basePremium *= 1.5;
        else basePremium *= 1.9;

        // Smoker surcharge
        if (smoker === 'yes') basePremium *= 1.3;

        // Coverage ratio adjustment
        const coverageRatio = coverageVal / policy.coverage;
        basePremium = Math.round(basePremium * coverageRatio);

        // Dependents adjustment
        if (Number(dependents) > 2) basePremium = Math.round(basePremium * 1.15);

        // Pre-existing conditions
        if (preExisting === 'yes') basePremium = Math.round(basePremium * 1.2);

        // Calculate savings vs base
        const savings = Math.round(basePremium * 0.12); // Mock 12% discount

        return {
            id: `Q-${Date.now()}-${policy.id}`,
            policyId: policy.id,
            policyName: policy.name,
            policyType: policy.type,
            coverage: coverageVal,
            annualPremium: basePremium,
            monthlyPremium: Math.round(basePremium / 12),
            totalPremium: basePremium * policy.duration,
            duration: policy.duration,
            rating: policy.rating,
            benefits: policy.benefits,
            description: policy.description,
            savings,
            discountedPremium: basePremium - savings,
            applicantName: fullName,
            generatedAt: new Date().toISOString()
        };
    });

    // Sort by premium (lowest first)
    quotes.sort((a, b) => a.annualPremium - b.annualPremium);

    res.json({
        quotes,
        summary: {
            applicant: fullName,
            age: ageVal,
            policyType,
            requestedCoverage: coverageVal,
            quotesGenerated: quotes.length
        }
    });
});

export default router;
