import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminClaims() {
    const { token } = useAuth();
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [policyFilter, setPolicyFilter] = useState('All');

    useEffect(() => {
        fetch('/api/claims', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => { setClaims(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [token]);

    const fmt = (v) => v ? '₹' + v.toLocaleString('en-IN') : '—';
    const statuses = ['All', 'Submitted', 'Under Review', 'Approved', 'Rejected'];
    const claimTypeLabels = { 'hospitalization': 'Hospitalization', 'accident': 'Accident', 'property-damage': 'Property Damage', 'cyber-fraud': 'Cyber Fraud', 'other': 'Other' };

    // Unique policy names for filter dropdown
    const policyNames = useMemo(() => {
        const names = [...new Set(claims.map(c => c.policyName).filter(Boolean))].sort();
        return ['All', ...names];
    }, [claims]);

    const filtered = claims.filter(c => {
        const matchStatus = statusFilter === 'All' || c.status === statusFilter;
        const matchSearch = !search || c.id.toLowerCase().includes(search.toLowerCase()) || c.fullName?.toLowerCase().includes(search.toLowerCase()) || c.policyNumber?.toLowerCase().includes(search.toLowerCase());
        const matchPolicy = policyFilter === 'All' || c.policyName === policyFilter;
        return matchStatus && matchSearch && matchPolicy;
    });

    const summary = {
        total: claims.length,
        submitted: claims.filter(c => c.status === 'Submitted').length,
        underReview: claims.filter(c => c.status === 'Under Review').length,
        approved: claims.filter(c => c.status === 'Approved').length,
        rejected: claims.filter(c => c.status === 'Rejected').length,
        totalAmount: claims.reduce((s, c) => s + (c.amount || 0), 0)
    };

    const handleStatusChange = (claimId, newStatus) => {
        setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: newStatus } : c));
    };

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('All');
        setPolicyFilter('All');
    };

    const hasActiveFilters = search || statusFilter !== 'All' || policyFilter !== 'All';

    if (loading) return <div className="admin-page-loading"><div className="spinner"></div><p>Loading claims...</p></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Claims Processing</h1>
                <p>Review, approve, and manage all insurance claims</p>
            </div>

            <div className="admin-kpi-grid small">
                <div className="admin-kpi-card kpi-blue mini"><span className="kpi-value">{summary.total}</span><span className="kpi-label">Total</span></div>
                <div className="admin-kpi-card kpi-teal mini"><span className="kpi-value">{summary.submitted}</span><span className="kpi-label">Submitted</span></div>
                <div className="admin-kpi-card kpi-amber mini"><span className="kpi-value">{summary.underReview}</span><span className="kpi-label">Under Review</span></div>
                <div className="admin-kpi-card kpi-green mini"><span className="kpi-value">{summary.approved}</span><span className="kpi-label">Approved</span></div>
                <div className="admin-kpi-card kpi-red mini"><span className="kpi-value">{summary.rejected}</span><span className="kpi-label">Rejected</span></div>
            </div>

            <div className="admin-toolbar">
                <input type="text" className="admin-search-input" placeholder="Search by Claim ID, Name, or Policy #..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className="admin-filter-select" value={policyFilter} onChange={e => setPolicyFilter(e.target.value)}>
                    {policyNames.map(n => <option key={n} value={n}>{n === 'All' ? '📄 All Policies' : n}</option>)}
                </select>
                <select className="admin-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    {statuses.map(s => <option key={s} value={s}>{s === 'All' ? '🔘 All Statuses' : s}</option>)}
                </select>
                <span className="admin-result-count">{filtered.length} of {claims.length} claims</span>
                {hasActiveFilters && <button className="btn btn-secondary btn-sm" onClick={clearFilters}>✕ Clear</button>}
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Claim ID</th>
                            <th>Claimant</th>
                            <th>Policy</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Filed Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(c => (
                            <tr key={c.id}>
                                <td className="td-mono">{c.id}</td>
                                <td><strong>{c.fullName}</strong><br /><small style={{ color: 'var(--text-muted)' }}>{c.email}</small></td>
                                <td>{c.policyName}<br /><small className="td-mono">{c.policyNumber}</small></td>
                                <td>{claimTypeLabels[c.claimType] || c.type}</td>
                                <td>{fmt(c.amount)}</td>
                                <td>{c.filedDate}</td>
                                <td><span className={`admin-badge ${c.status === 'Approved' ? 'badge-green' : c.status === 'Rejected' ? 'badge-red' : c.status === 'Under Review' ? 'badge-amber' : 'badge-blue'}`}>{c.status}</span></td>
                                <td>
                                    <div className="admin-actions">
                                        {(c.status === 'Submitted' || c.status === 'Under Review') && (
                                            <>
                                                <button className="admin-action-btn approve" onClick={() => handleStatusChange(c.id, 'Approved')} title="Approve">✓</button>
                                                <button className="admin-action-btn reject" onClick={() => handleStatusChange(c.id, 'Rejected')} title="Reject">✕</button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filtered.length === 0 && (
                <div className="admin-empty-state">
                    <p>🔍 No claims match your filters.</p>
                    {hasActiveFilters && <button className="btn btn-secondary btn-sm" onClick={clearFilters} style={{ marginTop: '12px' }}>Clear all filters</button>}
                </div>
            )}
        </div>
    );
}
