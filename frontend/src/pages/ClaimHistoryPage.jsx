import { useState } from 'react';
import { useClaims } from '../context/ClaimsContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ClaimHistoryPage() {
    const { claims, loading } = useClaims();
    const { user } = useAuth();
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchId, setSearchId] = useState('');

    const statuses = ['All', 'Approved', 'Rejected', 'Under Review', 'Submitted'];

    const filtered = claims.filter(c => {
        const matchStatus = statusFilter === 'All' || c.status === statusFilter;
        const matchSearch = !searchId || c.id.toLowerCase().includes(searchId.toLowerCase()) || c.policyName?.toLowerCase().includes(searchId.toLowerCase()) || c.policyNumber?.toLowerCase().includes(searchId.toLowerCase());
        return matchStatus && matchSearch;
    });

    const formatCurrency = (val) => val ? '₹' + val.toLocaleString('en-IN') : '—';
    const statusStyles = { 'Approved': 'badge-green', 'Under Review': 'badge-amber', 'Submitted': 'badge-blue', 'Rejected': 'badge-red' };
    const claimTypeLabels = { 'hospitalization': 'Hospitalization', 'accident': 'Accident', 'property-damage': 'Property Damage', 'theft': 'Theft/Burglary', 'death-benefit': 'Death Benefit', 'cyber-fraud': 'Cyber Fraud', 'travel-emergency': 'Travel Emergency', 'other': 'Other' };

    const summary = {
        total: claims.length,
        approved: claims.filter(c => c.status === 'Approved').length,
        rejected: claims.filter(c => c.status === 'Rejected').length,
        pending: claims.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length
    };

    if (loading) {
        return (
            <div className="page"><div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div><h2>Loading your claim history...</h2>
            </div></div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>📜 Claim Filing History</h1>
                    <p>Complete history of all your insurance claim filings and their outcomes.</p>
                </div>

                <div className="tracking-layout">
                    {/* Summary Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-blue)' }}>{summary.total}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Filings</div>
                        </div>
                        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#22c55e' }}>{summary.approved}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Approved</div>
                        </div>
                        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444' }}>{summary.rejected}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rejected</div>
                        </div>
                        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>{summary.pending}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending</div>
                        </div>
                    </div>

                    {/* Search & Filter */}
                    <div className="search-bar" style={{ marginBottom: '12px' }}>
                        <input type="text" className="form-input" placeholder="Search by Claim ID, Policy Name, or Policy Number..." value={searchId} onChange={(e) => setSearchId(e.target.value)} />
                        <select className="form-input" style={{ maxWidth: '180px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
                        </select>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                        Showing {filtered.length} of {claims.length} filings
                    </div>

                    {/* Claim List */}
                    {filtered.map((claim, idx) => (
                        <div key={claim.id} className="glass-card claim-track-card" style={{ animationDelay: `${idx * 0.08}s` }}>
                            <div className="claim-track-header">
                                <div>
                                    <h3>{claim.id}</h3>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{claim.policyName}</span>
                                </div>
                                <span className={`badge ${statusStyles[claim.status] || 'badge-blue'}`}>{claim.status}</span>
                            </div>
                            <div className="claim-meta">
                                {claim.policyNumber && <div className="claim-meta-item"><span className="label">Policy #</span><span className="value">{claim.policyNumber}</span></div>}
                                <div className="claim-meta-item"><span className="label">Type</span><span className="value">{claimTypeLabels[claim.claimType] || claim.type || '—'}</span></div>
                                <div className="claim-meta-item"><span className="label">Amount</span><span className="value">{formatCurrency(claim.amount)}</span></div>
                                <div className="claim-meta-item"><span className="label">Filed On</span><span className="value">{claim.filedDate}</span></div>
                                {claim.filesCount > 0 && <div className="claim-meta-item"><span className="label">Documents</span><span className="value">{claim.filesCount} file(s)</span></div>}
                            </div>
                            {claim.description && (
                                <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <strong style={{ color: 'var(--text-muted)' }}>Description: </strong>{claim.description}
                                </div>
                            )}
                            <div className="timeline">
                                {claim.timeline.map((item, index) => (
                                    <div key={index} className={`timeline-item ${item.status}`}>
                                        <div className="timeline-dot" /><h4>{item.step}</h4>
                                        {item.date && <div className="timeline-date">{item.date}</div>}
                                        <div className="timeline-desc">{item.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📭</div>
                            <h3 style={{ marginBottom: '8px' }}>No filings found</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                                {searchId || statusFilter !== 'All' ? 'Try adjusting your search or filter.' : 'You haven\'t filed any claims yet.'}
                            </p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Link to="/file-claim" className="btn btn-primary">📋 File a Claim</Link>
                                <Link to="/track-claim" className="btn btn-secondary">📊 Track Active Claims</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
