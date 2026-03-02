import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminClients() {
    const { token } = useAuth();
    const [clients, setClients] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('clients');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const headers = { Authorization: `Bearer ${token}` };
        const fetchJSON = (url) => fetch(url, { headers }).then(res => {
            if (!res.ok) {
                console.error(`Fetch failed for ${url}: ${res.status} ${res.statusText}`);
                return res.text().then(text => {
                    throw new Error(`API Error ${res.status}: ${text || 'Empty response'}`);
                });
            }
            return res.json();
        });

        Promise.all([
            fetchJSON('/api/admin/clients'),
            fetchJSON('/api/admin/agents')
        ]).then(([c, a]) => {
            setClients(c);
            setAgents(a);
            setLoading(false);
        }).catch(err => {
            console.error('AdminClients fetch error:', err);
            setLoading(false);
        });
    }, [token]);

    const fmt = (v) => '₹' + (v || 0).toLocaleString('en-IN');

    const filteredClients = clients.filter(c => !search || c.fullName?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()));
    const filteredAgents = agents.filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.region.toLowerCase().includes(search.toLowerCase()));

    if (loading) return <div className="admin-page-loading"><div className="spinner"></div><p>Loading...</p></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Clients & Agents</h1>
                <p>Manage customer profiles and agent performance</p>
            </div>

            <div className="admin-tabs">
                <button className={`admin-tab ${tab === 'clients' ? 'active' : ''}`} onClick={() => { setTab('clients'); setSearch(''); }}>👤 Clients ({clients.length})</button>
                <button className={`admin-tab ${tab === 'agents' ? 'active' : ''}`} onClick={() => { setTab('agents'); setSearch(''); }}>🏢 Agents ({agents.length})</button>
            </div>

            <div className="admin-toolbar">
                <input type="text" className="admin-search-input" placeholder={tab === 'clients' ? 'Search clients...' : 'Search agents by name or region...'} value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {tab === 'clients' && (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Claims</th>
                                <th>Claim Value</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map(c => (
                                <tr key={c.id}>
                                    <td className="td-mono">USR-{String(c.id).padStart(3, '0')}</td>
                                    <td><strong>{c.fullName}</strong></td>
                                    <td>{c.email}</td>
                                    <td>{c.phone || '—'}</td>
                                    <td>{c.totalClaims} <small style={{ color: 'var(--text-muted)' }}>({c.activeClaims} active)</small></td>
                                    <td>{fmt(c.totalClaimAmount)}</td>
                                    <td>{c.createdAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredClients.length === 0 && <div className="admin-empty-state"><p>No clients found.</p></div>}
                </div>
            )}

            {tab === 'agents' && (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Agent ID</th>
                                <th>Name</th>
                                <th>Region</th>
                                <th>Policies Sold</th>
                                <th>Revenue</th>
                                <th>Commission</th>
                                <th>Rating</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAgents.map(a => (
                                <tr key={a.id}>
                                    <td className="td-mono">{a.id}</td>
                                    <td><strong>{a.name}</strong><br /><small style={{ color: 'var(--text-muted)' }}>{a.email}</small></td>
                                    <td>{a.region}</td>
                                    <td>{a.policiesSold}</td>
                                    <td>{fmt(a.revenue)}</td>
                                    <td>{fmt(a.commission)}</td>
                                    <td>{'⭐'.repeat(Math.round(a.rating))} {a.rating}</td>
                                    <td><span className={`admin-badge ${a.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{a.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredAgents.length === 0 && <div className="admin-empty-state"><p>No agents found.</p></div>}
                </div>
            )}
        </div>
    );
}
