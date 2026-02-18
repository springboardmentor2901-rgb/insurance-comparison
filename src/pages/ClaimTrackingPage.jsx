import { useState } from 'react';
import { useClaims } from '../context/ClaimsContext';
import { Link } from 'react-router-dom';

export default function ClaimTrackingPage() {
    const { claims } = useClaims();
    const [searchId, setSearchId] = useState('');
    const [filteredClaims, setFilteredClaims] = useState(null); // null = show all

    const handleSearch = () => {
        if (!searchId.trim()) {
            setFilteredClaims(null);
            return;
        }
        const results = claims.filter(c =>
            c.id.toLowerCase().includes(searchId.toLowerCase()) ||
            c.policyName?.toLowerCase().includes(searchId.toLowerCase()) ||
            c.policyNumber?.toLowerCase().includes(searchId.toLowerCase()) ||
            c.fullName?.toLowerCase().includes(searchId.toLowerCase())
        );
        setFilteredClaims(results);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const displayClaims = filteredClaims !== null ? filteredClaims : claims;

    const formatCurrency = (val) => val ? '₹' + val.toLocaleString('en-IN') : '—';

    const statusStyles = {
        'Approved': 'badge-green',
        'Under Review': 'badge-amber',
        'Submitted': 'badge-blue',
        'Rejected': 'badge-red',
    };

    const claimTypeLabels = {
        'hospitalization': 'Hospitalization',
        'accident': 'Accident',
        'property-damage': 'Property Damage',
        'theft': 'Theft/Burglary',
        'death-benefit': 'Death Benefit',
        'cyber-fraud': 'Cyber Fraud',
        'travel-emergency': 'Travel Emergency',
        'other': 'Other'
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>📊 Claim Tracker</h1>
                    <p>Track the status of your insurance claims in real-time with detailed timeline updates.</p>
                </div>

                <div className="tracking-layout">
                    {/* Search Bar */}
                    <div className="search-bar">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search by Claim ID, Policy Number, or Name..."
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button className="btn btn-primary" onClick={handleSearch}>
                            Search
                        </button>
                        {filteredClaims !== null && (
                            <button className="btn btn-secondary" onClick={() => { setSearchId(''); setFilteredClaims(null); }}>
                                All
                            </button>
                        )}
                    </div>

                    {/* Summary Badge */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <span className="badge badge-blue">
                            {claims.length} Total Claims
                        </span>
                        <span className="badge badge-green">
                            {claims.filter(c => c.status === 'Approved').length} Approved
                        </span>
                        <span className="badge badge-amber">
                            {claims.filter(c => c.status === 'Under Review').length} Under Review
                        </span>
                        <span className="badge badge-teal">
                            {claims.filter(c => c.status === 'Submitted').length} Submitted
                        </span>
                    </div>

                    {/* Claim Cards */}
                    {displayClaims.map((claim, idx) => (
                        <div
                            key={claim.id}
                            className="glass-card claim-track-card"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            <div className="claim-track-header">
                                <div>
                                    <h3>{claim.id}</h3>
                                    {claim.fullName && (
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            Filed by {claim.fullName}
                                        </span>
                                    )}
                                </div>
                                <span className={`badge ${statusStyles[claim.status] || 'badge-blue'}`}>
                                    {claim.status}
                                </span>
                            </div>

                            <div className="claim-meta">
                                {claim.policyNumber && (
                                    <div className="claim-meta-item">
                                        <span className="label">Policy #</span>
                                        <span className="value">{claim.policyNumber}</span>
                                    </div>
                                )}
                                <div className="claim-meta-item">
                                    <span className="label">Type</span>
                                    <span className="value">{claimTypeLabels[claim.claimType] || claim.type || '—'}</span>
                                </div>
                                <div className="claim-meta-item">
                                    <span className="label">Amount</span>
                                    <span className="value">{formatCurrency(claim.amount)}</span>
                                </div>
                                <div className="claim-meta-item">
                                    <span className="label">Filed On</span>
                                    <span className="value">{claim.filedDate}</span>
                                </div>
                                {claim.filesCount > 0 && (
                                    <div className="claim-meta-item">
                                        <span className="label">Documents</span>
                                        <span className="value">{claim.filesCount} file(s)</span>
                                    </div>
                                )}
                            </div>

                            {claim.description && (
                                <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <strong style={{ color: 'var(--text-muted)' }}>Description: </strong>
                                    {claim.description}
                                </div>
                            )}

                            {/* Timeline */}
                            <div className="timeline">
                                {claim.timeline.map((item, index) => (
                                    <div key={index} className={`timeline-item ${item.status}`}>
                                        <div className="timeline-dot" />
                                        <h4>{item.step}</h4>
                                        {item.date && <div className="timeline-date">{item.date}</div>}
                                        <div className="timeline-desc">{item.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {displayClaims.length === 0 && (
                        <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
                            <h3 style={{ marginBottom: '8px' }}>No claims found</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                                {filteredClaims !== null
                                    ? 'Try searching with a different Claim ID, Policy Number, or Name.'
                                    : 'No claims have been filed yet.'}
                            </p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {filteredClaims !== null && (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => { setSearchId(''); setFilteredClaims(null); }}
                                    >
                                        Show All Claims
                                    </button>
                                )}
                                <Link to="/file-claim" className="btn btn-primary">
                                    📋 File a New Claim
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
