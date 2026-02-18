import { createContext, useContext, useState } from 'react';
import { initialClaims } from '../data/mockData';

const ClaimsContext = createContext();

export function ClaimsProvider({ children }) {
    const [claims, setClaims] = useState(initialClaims);

    const addClaim = (claimData) => {
        const claimId = `CLM-2025-${String(claims.length + 1).padStart(3, '0')}`;
        const today = new Date().toISOString().split('T')[0];

        const newClaim = {
            id: claimId,
            policyName: claimData.policyNumber || 'N/A',
            policyNumber: claimData.policyNumber,
            type: claimData.claimType || 'General',
            claimType: claimData.claimType,
            amount: null,
            filedDate: today,
            status: 'Submitted',
            fullName: claimData.fullName,
            email: claimData.email,
            phone: claimData.phone,
            description: claimData.description,
            filesCount: claimData.files?.length || 0,
            timeline: [
                {
                    step: 'Claim Filed',
                    date: today,
                    status: 'completed',
                    description: `Claim submitted by ${claimData.fullName}. ${claimData.files?.length || 0} document(s) uploaded.`
                },
                {
                    step: 'Documents Verification',
                    date: '',
                    status: 'current',
                    description: 'Your documents are being verified by our team. This usually takes 1-2 business days.'
                },
                {
                    step: 'Under Review',
                    date: '',
                    status: 'pending',
                    description: 'Claim will be assessed by our review team.'
                },
                {
                    step: 'Decision',
                    date: '',
                    status: 'pending',
                    description: 'Final decision on claim approval.'
                },
                {
                    step: 'Settlement',
                    date: '',
                    status: 'pending',
                    description: 'Amount will be disbursed upon approval.'
                }
            ]
        };

        setClaims(prev => [newClaim, ...prev]);
        return claimId;
    };

    return (
        <ClaimsContext.Provider value={{ claims, addClaim }}>
            {children}
        </ClaimsContext.Provider>
    );
}

export function useClaims() {
    const context = useContext(ClaimsContext);
    if (!context) {
        throw new Error('useClaims must be used within a ClaimsProvider');
    }
    return context;
}
