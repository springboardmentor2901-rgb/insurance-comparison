
import express from 'express';
import Policy from '../models/Policy.js';

const router = express.Router();

/**
 * POST /api/fraud-detection
 * Body: { policyIds: [1,2,3] }
 */
router.post('/', async (req, res) => {
  try {
    const { policyIds } = req.body;

    if (!policyIds || !Array.isArray(policyIds)) {
      return res.status(400).json({ message: 'policyIds array is required' });
    }

    const policies = await Policy.findAll({
      where: { id: policyIds },
    });

    const results = policies.map(policy => {
      const riskScore = policy.risk_score ?? 0;
      const claimCount = policy.claim_count ?? 0;

      const isFraud = riskScore >= 70 || claimCount >= 3;

      return {
        policyId: policy.id,
        risk_score: riskScore,
        claim_count: claimCount,
        classification: isFraud ? 'FRAUD' : 'NOT_FRAUD',
      };
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fraud detection failed' });
  }
});

export default router;