// Simple fraud detection utilities – replace with real algorithms or ML later

// Example heuristic rules for demo purposes
export function checkClaimFraud(claim, existingClaims) {
    if (!claim) return { flagged: false };
    const claims = Array.isArray(existingClaims) ? existingClaims : [];

    // rule 1: same policy number filed more than once in 24h
    if (claim.policyNumber) {
        const now = new Date();
        const recent = claims.filter(c =>
            c.policyNumber === claim.policyNumber &&
            !(claim.id && c.id === claim.id) && // exclude if it's the exact same claim (by ID)
            (new Date(c.filedDate)).getTime() > now.getTime() - 24 * 60 * 60 * 1000
        );

        if (recent.length > 0) {
            return { flagged: true, reason: 'Multiple claims on same policy within 24 hours' };
        }
    }

    // rule 2: extremely high amount compared to average (mock)
    if (claim.amount && Number(claim.amount) > 1000000) {
        return { flagged: true, reason: 'Claim amount exceeds threshold' };
    }

    // rule 3: suspicious keywords in description
    const desc = (claim.description || '').toLowerCase();
    if (desc.includes('fake') || desc.includes('staged')) {
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
                    console.log(`[FRAUD ALERT] ${result.reason} | Payload:`, req.body);
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

