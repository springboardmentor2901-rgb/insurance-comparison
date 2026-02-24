import { useState, useMemo } from 'react';
import { useClaims } from '../context/ClaimsContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ClaimTrackingPage() {
    const { claims, loading } = useClaims();
    const { user } = useAuth();

    const [searchId, setSearchId] = useState('');
    const [viewMode, setViewMode] = useState('timeline');
    const [selectedClaims, setSelectedClaims] = useState([]);
    const [sortField, setSortField] = useState('filedDate');
    const [sortOrder, setSortOrder] = useState('desc');

    const [filters, setFilters] = useState({
        status: '',
        claimType: '',
        startDate: '',
        endDate: '',
        minAmount: 0,
        maxAmount: 1000000,
    });

    const handleSearch = () => {
        if (!searchId.trim()) return;
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const filteredAndSorted = useMemo(() => {
        let result = [...claims];

        if (searchId.trim()) {
            const s = searchId.toLowerCase();
            result = result.filter(c =>
                c.id.toLowerCase().includes(s) ||
                c.policyName?.toLowerCase().includes(s) ||
                c.policyNumber?.toLowerCase().includes(s) ||
                c.fullName?.toLowerCase().includes(s)
            );
        }

        if (filters.status) {
            result = result.filter(c => c.status === filters.status);
        }

        if (filters.claimType) {
            result = result.filter(c => c.claimType === filters.claimType);
        }

        if (filters.startDate) {
            result = result.filter(c => new Date(c.filedDate) >= new Date(filters.startDate));
        }

        if (filters.endDate) {
            result = result.filter(c => new Date(c.filedDate) <= new Date(filters.endDate));
        }

        result = result.filter(c => {
            const amount = c.amount || 0;
            return amount >= filters.minAmount && amount <= filters.maxAmount;
        });

        result.sort((a, b) => {
            let aVal = sortField === 'filedDate' ? new Date(a.filedDate) : a[sortField];
            let bVal = sortField === 'filedDate' ? new Date(b.filedDate) : b[sortField];

            if (typeof aVal === 'string') {
                return sortOrder === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }

            return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        });

        return result;
    }, [claims, searchId, filters, sortField, sortOrder]);

    const toggleClaimSelection = (id) => {
        setSelectedClaims(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const resetFilters = () => {
        setFilters({
            status: '',
            claimType: '',
            startDate: '',
            endDate: '',
            minAmount: 0,
            maxAmount: 1000000
        });
        setSearchId('');
        setSortField('filedDate');
        setSortOrder('desc');
        setSelectedClaims([]);
    };

    const formatCurrency = (val) =>
        val ? `₹${val.toLocaleString('en-IN')}` : '—';

    if (loading) {
        return (
            <div className="page">
                <div className="container" style={{ textAlign: 'center', padding: '80px' }}>
                    <h2>Loading your claims…</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>📊 Claim Tracker & Analytics</h1>
                    <p>Track, filter, sort, and compare your insurance claims.</p>
                </div>

                <div className="search-bar">
                    <input
                        className="form-input"
                        placeholder="Search by Claim ID, Policy Number, or Name"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button className="btn btn-primary" onClick={handleSearch}>
                        Search
                    </button>
                </div>

                {filteredAndSorted.length === 0 ? (
                    <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                        <h3>No claims found</h3>
                        <p>Adjust your filters or search terms.</p>
                        <button className="btn btn-secondary" onClick={resetFilters}>
                            Reset Filters
                        </button>
                        <Link to="/file-claim" className="btn btn-primary">
                            File New Claim
                        </Link>
                    </div>
                ) : (
                    filteredAndSorted.map(claim => (
                        <div
                            key={claim.id}
                            className="glass-card"
                            onClick={() => toggleClaimSelection(claim.id)}
                        >
                            <h3>{claim.id}</h3>
                            <p>{claim.policyName}</p>
                            <p>{formatCurrency(claim.amount)}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}