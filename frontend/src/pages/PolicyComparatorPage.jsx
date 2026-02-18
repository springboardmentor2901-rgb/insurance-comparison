import { useState, useMemo, useEffect } from 'react';

export default function PolicyComparatorPage() {
    const [policies, setPolicies] = useState([]);
    const [policyTypes, setPolicyTypes] = useState(['All']);
    const [selectedPolicies, setSelectedPolicies] = useState([]);
    const [viewMode, setViewMode] = useState('select');
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: 'All',
        maxPremium: 25000,
        minCoverage: 0,
        maxDuration: 30,
    });

    useEffect(() => {
        fetch('/api/policies')
            .then(res => res.json())
            .then(data => {
                setPolicies(data.policies);
                setPolicyTypes(data.types);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch policies:', err);
                setLoading(false);
            });
    }, []);

    const filteredPolicies = useMemo(() => {
        return policies.filter(policy => {
            if (filters.type !== 'All' && policy.type !== filters.type) return false;
            if (policy.premium > filters.maxPremium) return false;
            if (policy.coverage < filters.minCoverage) return false;
            if (policy.duration > filters.maxDuration) return false;
            return true;
        });
    }, [filters, policies]);

    const togglePolicy = (id) => {
        setSelectedPolicies(prev => {
            if (prev.includes(id)) return prev.filter(p => p !== id);
            if (prev.length >= 4) return prev;
            return [...prev, id];
        });
    };

    const selectedPolicyData = policies.filter(p => selectedPolicies.includes(p.id));
    const formatCurrency = (val) => '₹' + val.toLocaleString('en-IN');

    const getBestValue = (field) => {
        if (selectedPolicyData.length < 2) return null;
        if (field === 'premium') {
            const min = Math.min(...selectedPolicyData.map(p => p[field]));
            return selectedPolicyData.find(p => p[field] === min)?.id;
        }
        const max = Math.max(...selectedPolicyData.map(p => p[field]));
        return selectedPolicyData.find(p => p[field] === max)?.id;
    };

    const typeColors = {
        Life: 'badge-teal', Health: 'badge-blue', Auto: 'badge-purple',
        Property: 'badge-amber', Travel: 'badge-green', Cyber: 'badge-red',
    };

    if (loading) {
        return (
            <div className="page">
                <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
                    <h2>Loading policies...</h2>
                </div>
            </div>
        );
    }

    // ===== COMPARISON VIEW =====
    if (viewMode === 'compare' && selectedPolicyData.length >= 2) {
        return (
            <div className="page">
                <div className="container">
                    <div className="page-header">
                        <h1>📊 Side-by-Side Comparison</h1>
                        <p>Comparing {selectedPolicyData.length} selected policies. Highlights show the best value in each category.</p>
                    </div>

                    <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="btn btn-secondary" onClick={() => setViewMode('select')}>← Back to Selection</button>
                        <button className="btn btn-outline btn-sm" onClick={() => { setSelectedPolicies([]); setViewMode('select'); }}>Clear All & Start Over</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${selectedPolicyData.length}, 1fr)`, gap: '16px', marginBottom: '32px' }}>
                        {selectedPolicyData.map(p => (
                            <div key={p.id} className="glass-card" style={{ padding: '20px', textAlign: 'center', borderColor: 'var(--border-active)' }}>
                                <span className={`badge ${typeColors[p.type]}`} style={{ marginBottom: '8px' }}>{p.type}</span>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>{p.name}</h3>
                                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-teal)' }}>{formatCurrency(p.premium)}<span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)' }}>/yr</span></div>
                                <button className="btn btn-secondary btn-sm" style={{ marginTop: '12px', fontSize: '0.75rem' }}
                                    onClick={() => { const remaining = selectedPolicies.filter(id => id !== p.id); setSelectedPolicies(remaining); if (remaining.length < 2) setViewMode('select'); }}>
                                    ✕ Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="comparison-table-wrapper glass-card" style={{ padding: 0 }}>
                        <table className="comparison-table">
                            <thead>
                                <tr>
                                    <th style={{ minWidth: '160px' }}>Feature</th>
                                    {selectedPolicyData.map(p => <th key={p.id}>{p.name}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Type</strong></td>
                                    {selectedPolicyData.map(p => <td key={p.id}><span className={`badge ${typeColors[p.type]}`}>{p.type}</span></td>)}
                                </tr>
                                <tr>
                                    <td><strong>Coverage Amount</strong></td>
                                    {selectedPolicyData.map(p => <td key={p.id} className={getBestValue('coverage') === p.id ? 'best' : ''}>{formatCurrency(p.coverage)}{getBestValue('coverage') === p.id && ' ✓'}</td>)}
                                </tr>
                                <tr>
                                    <td><strong>Annual Premium</strong></td>
                                    {selectedPolicyData.map(p => <td key={p.id} className={getBestValue('premium') === p.id ? 'best' : ''}>{formatCurrency(p.premium)}{getBestValue('premium') === p.id && ' ✓'}</td>)}
                                </tr>
                                <tr>
                                    <td><strong>Monthly Premium</strong></td>
                                    {selectedPolicyData.map(p => <td key={p.id}>{formatCurrency(Math.round(p.premium / 12))}</td>)}
                                </tr>
                                <tr>
                                    <td><strong>Duration</strong></td>
                                    {selectedPolicyData.map(p => <td key={p.id} className={getBestValue('duration') === p.id ? 'best' : ''}>{p.duration} {p.duration === 1 ? 'year' : 'years'}{getBestValue('duration') === p.id && ' ✓'}</td>)}
                                </tr>
                                <tr>
                                    <td><strong>Rating</strong></td>
                                    {selectedPolicyData.map(p => <td key={p.id} className={getBestValue('rating') === p.id ? 'best' : ''}>⭐ {p.rating}{getBestValue('rating') === p.id && ' ✓'}</td>)}
                                </tr>
                                <tr>
                                    <td><strong>Cost per ₹1L Coverage</strong></td>
                                    {selectedPolicyData.map(p => {
                                        const costPer1L = Math.round((p.premium / p.coverage) * 100000);
                                        const allCosts = selectedPolicyData.map(sp => Math.round((sp.premium / sp.coverage) * 100000));
                                        const isBest = costPer1L === Math.min(...allCosts);
                                        return <td key={p.id} className={isBest ? 'best' : ''}>{formatCurrency(costPer1L)}/yr{isBest && ' ✓'}</td>;
                                    })}
                                </tr>
                                <tr>
                                    <td><strong>Total Cost</strong></td>
                                    {selectedPolicyData.map(p => {
                                        const total = p.premium * p.duration;
                                        const allTotals = selectedPolicyData.map(sp => sp.premium * sp.duration);
                                        const isBest = total === Math.min(...allTotals);
                                        return <td key={p.id} className={isBest ? 'best' : ''}>{formatCurrency(total)}{isBest && ' ✓'}</td>;
                                    })}
                                </tr>
                                <tr>
                                    <td><strong>Description</strong></td>
                                    {selectedPolicyData.map(p => <td key={p.id} style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>{p.description}</td>)}
                                </tr>
                                <tr>
                                    <td><strong>Key Benefits</strong></td>
                                    {selectedPolicyData.map(p => (
                                        <td key={p.id}>
                                            <ul style={{ paddingLeft: '16px', listStyle: 'disc' }}>
                                                {p.benefits.map((b, i) => <li key={i} style={{ fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>{b}</li>)}
                                            </ul>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '32px' }}>
                        <button className="btn btn-primary btn-lg" onClick={() => setViewMode('select')}>← Back to Policy Selection</button>
                    </div>
                </div>
            </div>
        );
    }

    // ===== SELECTION VIEW =====
    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>🔍 Policy Comparator</h1>
                    <p>Select 2 to 4 policies to compare side-by-side. Use filters to narrow your search.</p>
                </div>

                <div className="comparator-layout">
                    <aside className="glass-card filter-sidebar">
                        <h3>⚙️ Filters</h3>
                        <div className="filter-group">
                            <label>Policy Type</label>
                            <select className="form-input" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
                                {policyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Max Premium (₹/year)</label>
                            <input type="range" min="400" max="25000" step="200" value={filters.maxPremium} onChange={(e) => setFilters({ ...filters, maxPremium: Number(e.target.value) })} />
                            <div className="range-display"><span>₹400</span><span><strong>{formatCurrency(filters.maxPremium)}</strong></span></div>
                        </div>
                        <div className="filter-group">
                            <label>Min Coverage (₹)</label>
                            <input type="range" min="0" max="10000000" step="100000" value={filters.minCoverage} onChange={(e) => setFilters({ ...filters, minCoverage: Number(e.target.value) })} />
                            <div className="range-display"><span>₹0</span><span><strong>{formatCurrency(filters.minCoverage)}</strong></span></div>
                        </div>
                        <div className="filter-group">
                            <label>Max Duration (years)</label>
                            <input type="range" min="1" max="30" step="1" value={filters.maxDuration} onChange={(e) => setFilters({ ...filters, maxDuration: Number(e.target.value) })} />
                            <div className="range-display"><span>1 yr</span><span><strong>{filters.maxDuration} yrs</strong></span></div>
                        </div>
                        <button className="btn btn-secondary" style={{ width: '100%', marginTop: '8px' }} onClick={() => setFilters({ type: 'All', maxPremium: 25000, minCoverage: 0, maxDuration: 30 })}>Reset Filters</button>
                    </aside>

                    <div>
                        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <span className="badge badge-teal" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>{selectedPolicies.length}/4 Selected</span>
                            {selectedPolicies.length >= 2 && <button className="btn btn-primary btn-sm" onClick={() => setViewMode('compare')}>Compare Now →</button>}
                            {selectedPolicies.length > 0 && <button className="btn btn-secondary btn-sm" onClick={() => setSelectedPolicies([])}>Clear Selection</button>}
                            {selectedPolicies.length >= 1 && selectedPolicies.length < 2 && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Select at least 2 policies to compare</span>}
                        </div>

                        <div className="policy-grid">
                            {filteredPolicies.map(policy => (
                                <div key={policy.id} className={`glass-card policy-card ${selectedPolicies.includes(policy.id) ? 'selected' : ''}`}
                                    onClick={() => togglePolicy(policy.id)} style={{ opacity: selectedPolicies.length >= 4 && !selectedPolicies.includes(policy.id) ? 0.5 : 1 }}>
                                    <div className="policy-card-header">
                                        <div>
                                            <h3>{policy.name}</h3>
                                            <span className={`badge ${typeColors[policy.type]} policy-type`} style={{ marginTop: '6px', display: 'inline-block' }}>{policy.type}</span>
                                        </div>
                                        <div className="policy-select-check">{selectedPolicies.includes(policy.id) ? '✓' : ''}</div>
                                    </div>
                                    <div className="policy-details">
                                        <div className="policy-detail-item"><span className="label">Coverage</span><span className="value">{formatCurrency(policy.coverage)}</span></div>
                                        <div className="policy-detail-item"><span className="label">Premium</span><span className="value">{formatCurrency(policy.premium)}/yr</span></div>
                                        <div className="policy-detail-item"><span className="label">Duration</span><span className="value">{policy.duration} {policy.duration === 1 ? 'year' : 'years'}</span></div>
                                        <div className="policy-detail-item"><span className="label">Rating</span><span className="value">⭐ {policy.rating}</span></div>
                                    </div>
                                    <ul className="policy-benefits">
                                        {policy.benefits.slice(0, 3).map((b, i) => <li key={i}>{b}</li>)}
                                        {policy.benefits.length > 3 && <li style={{ color: 'var(--accent-teal)', fontWeight: 500 }}>+{policy.benefits.length - 3} more benefits</li>}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {filteredPolicies.length === 0 && (
                            <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
                                <h3 style={{ marginBottom: '8px' }}>No policies match your filters</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filter criteria to see more results.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
