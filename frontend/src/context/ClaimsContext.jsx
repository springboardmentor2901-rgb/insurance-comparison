import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ClaimsContext = createContext();

export function ClaimsProvider({ children }) {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Fetch claims from backend on mount — filtered by userId for regular users
    useEffect(() => {
        if (!user) {
            setClaims([]);
            setLoading(false);
            return;
        }

        const url = user.role === 'admin' ? '/api/claims' : `/api/claims?userId=${user.id}`;
        fetch(url)
            .then(res => {
                const contentType = res.headers.get('content-type');
                if (!res.ok || !contentType || !contentType.includes('application/json')) {
                    throw new Error('Failed to fetch claims: Invalid response from server');
                }
                return res.json();
            })
            .then(data => {
                setClaims(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch claims:', err);
                setLoading(false);
            });
    }, [user]);

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
                    filesCount: claimData.files?.length || 0,
                    userId: user?.id || null
                })
            });

            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Failed to create claim: Invalid response from server');
            }

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
            const url = user?.role === 'admin' ? '/api/claims' : `/api/claims?userId=${user?.id}`;
            const res = await fetch(url);

            const contentType = res.headers.get('content-type');
            if (!res.ok || !contentType || !contentType.includes('application/json')) {
                throw new Error('Failed to refresh claims: Invalid response from server');
            }

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
