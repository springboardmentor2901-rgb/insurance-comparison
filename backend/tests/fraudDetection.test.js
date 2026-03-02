import { checkClaimFraud, fraudDetectionMiddleware } from '../utils/fraudDetection.js';

describe('fraud detection utilities', () => {
    const existing = [
        { policyNumber: 'POL-001', filedDate: new Date().toISOString() }
    ];

    test('flags when same policy has recent claim', () => {
        const payload = { policyNumber: 'POL-001', description: 'normal' };
        const result = checkClaimFraud(payload, existing);
        expect(result.flagged).toBe(true);
        expect(result.reason).toMatch(/same policy/);
    });

    test('does not flag harmless claim', () => {
        const payload = { policyNumber: 'POL-002', description: 'everything ok' };
        const result = checkClaimFraud(payload, existing);
        expect(result.flagged).toBe(false);
    });

    test('middleware blocks suspicious POST', () => {
        const claimsStore = existing;
        const mw = fraudDetectionMiddleware({ claimsStore });

        const req = { method: 'POST', path: '/api/claims', body: { policyNumber: 'POL-001' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        mw(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Fraud suspected' }));
        expect(next).not.toHaveBeenCalled();
    });

    test('high amount is flagged', () => {
        const result = checkClaimFraud({ policyNumber: 'POL-003', amount: 2000000 }, existing);
        expect(result.flagged).toBe(true);
        expect(result.reason).toMatch(/exceeds threshold/);
    });

    test('suspicious keyword in description is flagged', () => {
        const result = checkClaimFraud({ policyNumber: 'POL-004', description: 'This is fake claim' }, existing);
        expect(result.flagged).toBe(true);
        expect(result.reason).toMatch(/suspicious keywords/);
    });
});
