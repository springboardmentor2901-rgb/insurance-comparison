import { createContext, useContext, useState, useEffect } from 'react';

const ClaimsContext = createContext();

export function ClaimsProvider({ children }) {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch claims from backend on mount
    useEffect(() => {
        fetch('/api/claims')
            .then(res => res.json())
            .then(data => {
                setClaims(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch claims:', err);
                setLoading(false);
            });
    }, []);

    const addClaim = async (claimData) => {
        try {
            const res = await fetch('/api/claims', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: claimData.fullName,
                    email: claimData.email,
                    phone: claimData.phone,
                    policyNumber: claimData.policyNumber,
                    claimType: claimData.claimType,
                    incidentDate: claimData.incidentDate,
                    description: claimData.description,
                    filesCount: claimData.files?.length || 0
                })
            });
            const newClaim = await res.json();
            setClaims(prev => [newClaim, ...prev]);
            return newClaim.id;
        } catch (err) {
            console.error('Failed to create claim:', err);
            return null;
        }
    };

    const refreshClaims = async () => {
        try {
            const res = await fetch('/api/claims');
            const data = await res.json();
            setClaims(data);
        } catch (err) {
            console.error('Failed to refresh claims:', err);
        }
    };

    return (
        <ClaimsContext.Provider value={{ claims, addClaim, refreshClaims, loading }}>
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
