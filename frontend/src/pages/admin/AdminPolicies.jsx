import { useState, useEffect, useMemo } from 'react';

export default function AdminPolicies() {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [nameFilter, setNameFilter] = useState('All');

    useEffect(() => {
        fetch('/api/policies')
            .then(res => res.json())
            .then(data => { setPolicies(data.policies || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const fmt = (v) => '₹' + (v || 0).toLocaleString('en-IN');
    const types = ['All', 'Life', 'Health', 'Auto', 'Property', 'Travel', 'Cyber'];
    const statuses = ['All', 'Active', 'Expired'];

    // Unique policy names for the dropdown
    const policyNames = useMemo(() => {
        const names = [...new Set(policies.map(p => p.name))].sort();
        return ['All', ...names];
    }, [policies]);

    const filtered = policies.filter(p => {
        const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.type.toLowerCase().includes(search.toLowerCase()) || `POL-${String(p.id).padStart(3, '0')}`.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === 'All' || p.type === typeFilter;
        const matchStatus = statusFilter === 'All' || p.status === statusFilter;
        const matchName = nameFilter === 'All' || p.name === nameFilter;
        return matchSearch && matchType && matchStatus && matchName;
    });

    const clearFilters = () => {
        setSearch('');
        setTypeFilter('All');
        setStatusFilter('All');
        setNameFilter('All');
    };

    const hasActiveFilters = search || typeFilter !== 'All' || statusFilter !== 'All' || nameFilter !== 'All';

    if (loading) return <div className="admin-page-loading"><div className="spinner"></div><p>Loading policies...</p></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Policy Management</h1>
                <p>Manage all insurance policies — view, search, and filter by name, type, or status</p>
            </div>

            <div className="admin-toolbar">
                <input type="text" className="admin-search-input" placeholder="Search by policy name, type, or ID..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className="admin-filter-select" value={nameFilter} onChange={e => setNameFilter(e.target.value)}>
                    {policyNames.map(n => <option key={n} value={n}>{n === 'All' ? '📄 All Policies' : n}</option>)}
                </select>
                <select className="admin-filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                    {types.map(t => <option key={t} value={t}>{t === 'All' ? '🏷️ All Types' : t}</option>)}
                </select>
                <select className="admin-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    {statuses.map(s => <option key={s} value={s}>{s === 'All' ? '🔘 All Statuses' : s}</option>)}
                </select>
                <span className="admin-result-count">{filtered.length} of {policies.length} policies</span>
                {hasActiveFilters && <button className="btn btn-secondary btn-sm" onClick={clearFilters}>✕ Clear</button>}
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Policy Name</th>
                            <th>Type</th>
                            <th>Coverage</th>
                            <th>Premium</th>
                            <th>Duration</th>
                            <th>Rating</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(p => (
                            <tr key={p.id}>
                                <td className="td-mono">POL-{String(p.id).padStart(3, '0')}</td>
                                <td><strong>{p.name}</strong></td>
                                <td><span className={`admin-badge badge-${p.type.toLowerCase()}`}>{p.type}</span></td>
                                <td>{fmt(p.coverage)}</td>
                                <td>{fmt(p.premium)}/yr</td>
                                <td>{p.duration} {p.duration === 1 ? 'year' : 'years'}</td>
                                <td><span className="rating-stars">{'⭐'.repeat(Math.round(p.rating))}</span> {p.rating}</td>
                                <td><span className={`admin-badge ${p.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{p.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filtered.length === 0 && (
                <div className="admin-empty-state">
                    <p>🔍 No policies match your filters.</p>
                    {hasActiveFilters && <button className="btn btn-secondary btn-sm" onClick={clearFilters} style={{ marginTop: '12px' }}>Clear all filters</button>}
                </div>
            )}
        </div>
    );
}
