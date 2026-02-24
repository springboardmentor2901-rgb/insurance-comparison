import { useState, useMemo } from 'react';
import { useClaims } from '../context/ClaimsContext';
import { Link } from 'react-router-dom';

export default function ClaimTrackingPage() {
    const { claims } = useClaims();
    const [searchId, setSearchId] = useState('');
    const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'table'
    const [selectedClaims, setSelectedClaims] = useState([]);
    const [sortField, setSortField] = useState('filedDate');
    const [sortOrder, setSortOrder] = useState('desc');
    
    // Filters
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

    const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };
    
    // Apply search + filters
    const filteredAndSorted = useMemo(() => {
        let result = [...claims];
        
        // Text search
        if (searchId.trim()) {
            const s = searchId.toLowerCase();
            result = result.filter(c =>
                c.id.toLowerCase().includes(s) ||
                c.policyName?.toLowerCase().includes(s) ||
                c.policyNumber?.toLowerCase().includes(s) ||
                c.fullName?.toLowerCase().includes(s)
            );
        }
        
        // Status filter
        if (filters.status) {
            result = result.filter(c => c.status === filters.status);
        }
        
        // Claim type filter
        if (filters.claimType) {
            result = result.filter(c => c.claimType === filters.claimType);
        }
        
        // Date range filter
        if (filters.startDate) {
            result = result.filter(c => new Date(c.filedDate) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
            result = result.filter(c => new Date(c.filedDate) <= new Date(filters.endDate));
        }
        
        // Amount range filter
        if (filters.minAmount || filters.maxAmount) {
            result = result.filter(c => {
                const amount = c.amount || 0;
                return amount >= filters.minAmount && amount <= filters.maxAmount;
            });
        }
        
        // Sorting
        result.sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];
            
            if (sortField === 'filedDate' || sortField === 'amount') {
                aVal = sortField === 'filedDate' ? new Date(a.filedDate) : (a.amount || 0);
                bVal = sortField === 'filedDate' ? new Date(b.filedDate) : (b.amount || 0);
                return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
            }
            
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
                return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
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

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const resetFilters = () => {
        setFilters({ status: '', claimType: '', startDate: '', endDate: '', minAmount: 0, maxAmount: 1000000 });
        setSearchId('');
        setSortField('filedDate');
        setSortOrder('desc');
        setSelectedClaims([]);
    };

    const formatCurrency = (val) => val ? '₹' + val.toLocaleString('en-IN') : '—';

    const statusStyles = { 'Approved': 'badge-green', 'Under Review': 'badge-amber', 'Submitted': 'badge-blue', 'Rejected': 'badge-red' };
    const claimTypeLabels = { 'hospitalization': 'Hospitalization', 'accident': 'Accident', 'property-damage': 'Property Damage', 'theft': 'Theft/Burglary', 'death-benefit': 'Death Benefit', 'cyber-fraud': 'Cyber Fraud', 'travel-emergency': 'Travel Emergency', 'other': 'Other' };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>📊 Claim Tracker & Analytics</h1>
                    <p>Track, filter, sort, and compare your insurance claims with detailed insights.</p>
                </div>

                <div className="tracking-layout">
                    {/* Search Bar */}
                    <div className="search-bar" style={{ marginBottom: '24px' }}>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Search by Claim ID, Policy Number, or Name..." 
                            value={searchId} 
                            onChange={(e) => setSearchId(e.target.value)} 
                            onKeyDown={handleKeyDown} 
                        />
                        <button className="btn btn-primary" onClick={handleSearch}>Search</button>
                    </div>

                    {/* View Mode Toggle */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <button 
                            className={`btn btn-sm ${viewMode === 'timeline' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setViewMode('timeline')}
                        >
                            📋 Timeline View
                        </button>
                        <button 
                            className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setViewMode('table')}
                        >
                            📊 Table View
                        </button>
                        {selectedClaims.length > 0 && (
                            <span className="badge badge-teal" style={{ marginLeft: 'auto' }}>
                                {selectedClaims.length} selected
                            </span>
                        )}
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <span className="badge badge-blue">{filteredAndSorted.length} Results</span>
                        <span className="badge badge-green">{filteredAndSorted.filter(c => c.status === 'Approved').length} Approved</span>
                        <span className="badge badge-amber">{filteredAndSorted.filter(c => c.status === 'Under Review').length} Under Review</span>
                        <span className="badge badge-teal">{filteredAndSorted.filter(c => c.status === 'Submitted').length} Submitted</span>
                        {filteredAndSorted.length > 0 && (
                            <span className="badge badge-purple" style={{ marginLeft: 'auto' }}>
                                Total: {formatCurrency(filteredAndSorted.reduce((sum, c) => sum + (c.amount || 0), 0))}
                            </span>
                        )}
                    </div>

                    {/* Filters Panel */}
                    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>⚙️ Advanced Filters</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.85rem' }}>Status</label>
                                <select 
                                    className="form-input" 
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="Submitted">Submitted</option>
                                    <option value="Under Review">Under Review</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label style={{ fontSize: '0.85rem' }}>Claim Type</label>
                                <select 
                                    className="form-input"
                                    value={filters.claimType}
                                    onChange={(e) => setFilters({ ...filters, claimType: e.target.value })}
                                >
                                    <option value="">All Types</option>
                                    <option value="hospitalization">Hospitalization</option>
                                    <option value="accident">Accident</option>
                                    <option value="property-damage">Property Damage</option>
                                    <option value="theft">Theft/Burglary</option>
                                    <option value="death-benefit">Death Benefit</option>
                                    <option value="cyber-fraud">Cyber Fraud</option>
                                    <option value="travel-emergency">Travel Emergency</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label style={{ fontSize: '0.85rem' }}>From Date</label>
                                <input 
                                    type="date" 
                                    className="form-input"
                                    value={filters.startDate}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ fontSize: '0.85rem' }}>To Date</label>
                                <input 
                                    type="date" 
                                    className="form-input"
                                    value={filters.endDate}
                                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ fontSize: '0.85rem' }}>Min Amount (₹)</label>
                                <input 
                                    type="number" 
                                    className="form-input"
                                    min="0"
                                    value={filters.minAmount}
                                    onChange={(e) => setFilters({ ...filters, minAmount: Number(e.target.value) })}
                                    placeholder="0"
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ fontSize: '0.85rem' }}>Max Amount (₹)</label>
                                <input 
                                    type="number" 
                                    className="form-input"
                                    min="0"
                                    value={filters.maxAmount}
                                    onChange={(e) => setFilters({ ...filters, maxAmount: Number(e.target.value) })}
                                    placeholder="∞"
                                />
                            </div>
                        </div>
                        <button className="btn btn-secondary btn-sm" onClick={resetFilters} style={{ marginTop: '8px' }}>
                            🔄 Reset Filters
                        </button>
                    </div>

                    {/* Table View */}
                    {viewMode === 'table' && (
                        <div className="glass-card" style={{ padding: 0, marginBottom: '24px', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(45, 212, 191, 0.08)', borderBottom: '1px solid var(--border-color)' }}>
                                            <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 600, color: 'var(--accent-teal)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedClaims.length === filteredAndSorted.length && filteredAndSorted.length > 0}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setSelectedClaims(filteredAndSorted.map(c => c.id));
                                                        else setSelectedClaims([]);
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </th>
                                            <th 
                                                style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 600, color: 'var(--accent-teal)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer' }}
                                                onClick={() => handleSort('id')}
                                            >
                                                Claim ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 600, color: 'var(--accent-teal)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                Applicant
                                            </th>
                                            <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 600, color: 'var(--accent-teal)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                Policy #
                                            </th>
                                            <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 600, color: 'var(--accent-teal)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                Type
                                            </th>
                                            <th 
                                                style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 600, color: 'var(--accent-teal)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer' }}
                                                onClick={() => handleSort('amount')}
                                            >
                                                Amount {sortField === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th 
                                                style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 600, color: 'var(--accent-teal)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer' }}
                                                onClick={() => handleSort('filedDate')}
                                            >
                                                Filed Date {sortField === 'filedDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 600, color: 'var(--accent-teal)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAndSorted.map((claim) => (
                                            <tr 
                                                key={claim.id} 
                                                style={{ 
                                                    borderBottom: '1px solid var(--border-color)',
                                                    background: selectedClaims.includes(claim.id) ? 'rgba(45, 212, 191, 0.08)' : 'transparent',
                                                    transition: 'background 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = selectedClaims.includes(claim.id) ? 'rgba(45, 212, 191, 0.12)' : 'rgba(255,255,255,0.02)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = selectedClaims.includes(claim.id) ? 'rgba(45, 212, 191, 0.08)' : 'transparent'}
                                            >
                                                <td style={{ padding: '14px 20px' }}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedClaims.includes(claim.id)}
                                                        onChange={() => toggleClaimSelection(claim.id)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                </td>
                                                <td style={{ padding: '14px 20px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-teal)' }}>{claim.id}</td>
                                                <td style={{ padding: '14px 20px', fontSize: '0.85rem' }}>{claim.fullName || '—'}</td>
                                                <td style={{ padding: '14px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{claim.policyNumber || '—'}</td>
                                                <td style={{ padding: '14px 20px', fontSize: '0.85rem' }}>
                                                    <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)' }}>
                                                        {claimTypeLabels[claim.claimType] || claim.type || '—'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '14px 20px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-teal)' }}>{formatCurrency(claim.amount)}</td>
                                                <td style={{ padding: '14px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{claim.filedDate}</td>
                                                <td style={{ padding: '14px 20px' }}>
                                                    <span className={`badge ${statusStyles[claim.status] || 'badge-blue'}`}>
                                                        {claim.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Timeline View */}
                    {viewMode === 'timeline' && (
                        <>
                            {filteredAndSorted.map((claim, idx) => (
                                <div 
                                    key={claim.id} 
                                    className="glass-card claim-track-card" 
                                    style={{ 
                                        animationDelay: `${idx * 0.1}s`,
                                        border: selectedClaims.includes(claim.id) ? '2px solid var(--accent-teal)' : undefined,
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => toggleClaimSelection(claim.id)}
                                >
                                    <div className="claim-track-header">
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={selectedClaims.includes(claim.id)}
                                                onChange={() => toggleClaimSelection(claim.id)}
                                                onClick={(e) => e.stopPropagation()}
                                                style={{ cursor: 'pointer', marginTop: '4px' }}
                                            />
                                            <div>
                                                <h3>{claim.id}</h3>
                                                {claim.fullName && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Filed by {claim.fullName}</span>}
                                            </div>
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
                        </>
                    )}

                    {/* Empty State */}
                    {filteredAndSorted.length === 0 && (
                        <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
                            <h3 style={{ marginBottom: '8px' }}>No claims found</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Try adjusting your filters or search criteria.</p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button className="btn btn-secondary" onClick={resetFilters}>Clear Filters</button>
                                <Link to="/file-claim" className="btn btn-primary">📋 File a New Claim</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
