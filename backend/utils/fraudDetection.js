// Simple fraud detection utilities – replace with real algorithms or ML later

// Example heuristic rules for demo purposes
export function checkClaimFraud(claim, existingClaims) {
    if (!claim) return { flagged: false };
    const claims = Array.isArray(existingClaims) ? existingClaims : [];

    // Normalize input for accurate comparison
    const targetPolicy = (claim.policyNumber || '').trim().toUpperCase();
    if (!targetPolicy) return { flagged: false };

    // rule 1: same policy number filed more than once in 24h
    const now = new Date();
    const twentyFourHoursAgo = now.getTime() - (24 * 60 * 60 * 1000);

    const recent = claims.filter(c => {
        const existingPolicy = (c.policyNumber || '').trim().toUpperCase();
        if (existingPolicy !== targetPolicy) return false;

        // Exclude the exact same claim if we're updating
        if (claim.id && c.id === claim.id) return false;

        const filedTime = new Date(c.filedDate).getTime();
        return filedTime > twentyFourHoursAgo;
    });

    if (recent.length > 0) {
        return {
            flagged: true,
            reason: `Multiple claims on policy ${targetPolicy} within 24 hours`,
            details: `Found ${recent.length} recent claim(s) for this policy.`
        };
    }

    // rule 2: extremely high amount compared to average (mock)
    if (claim.amount && Number(claim.amount) > 1000000) {
        return { flagged: true, reason: 'Claim amount exceeds recovery threshold' };
    }

    // rule 3: suspicious keywords in description
    const desc = (claim.description || '').toLowerCase();
    const suspiciousKeywords = ['fake', 'staged', 'scam', 'fraud', 'test fraud'];
    if (suspiciousKeywords.some(kw => desc.includes(kw))) {
        return { flagged: true, reason: 'Description contains suspicious keywords' };
    }

    return { flagged: false };
}

// generic middleware factory
export function fraudDetectionMiddleware({ claimsStore } = {}) {
    return (req, res, next) => {
        // only inspect POST requests for simplicity
        if (req.method === 'POST') {
            const path = req.originalUrl || req.path || '';
            if (path.includes('/api/claims')) {
                const result = checkClaimFraud(req.body, claimsStore);
                if (result.flagged) {
                    console.log(`[FRAUD ALERT] ${result.reason} | Policy: ${req.body.policyNumber} | User ID: ${req.body.userId}`);
                    return res.status(403).json({
                        error: 'Fraud suspected',
                        details: result.reason,
                        flagged: true
                    });
                }
            }
        }
        next();
    };
}


