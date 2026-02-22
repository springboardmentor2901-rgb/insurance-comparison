import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSupport() {
    const { token } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetch('/api/admin/support', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, [token]);

    if (loading) return <div className="admin-page-loading"><div className="spinner"></div><p>Loading support...</p></div>;
    if (!data) return <div className="admin-page-error">Failed to load support data.</div>;

    const { tickets, summary } = data;
    const statuses = ['All', 'Open', 'In Progress', 'Resolved'];
    const filtered = statusFilter === 'All' ? tickets : tickets.filter(t => t.status === statusFilter);
    const priorityColors = { High: 'badge-red', Medium: 'badge-amber', Low: 'badge-green' };
    const statusColors = { Open: 'badge-blue', 'In Progress': 'badge-amber', Resolved: 'badge-green' };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Support Desk</h1>
                <p>Manage customer inquiries, complaints, and service requests</p>
            </div>

            <div className="admin-kpi-grid small">
                <div className="admin-kpi-card kpi-blue mini"><span className="kpi-value">{summary.total}</span><span className="kpi-label">Total Tickets</span></div>
                <div className="admin-kpi-card kpi-amber mini"><span className="kpi-value">{summary.open}</span><span className="kpi-label">Open</span></div>
                <div className="admin-kpi-card kpi-purple mini"><span className="kpi-value">{summary.inProgress}</span><span className="kpi-label">In Progress</span></div>
                <div className="admin-kpi-card kpi-green mini"><span className="kpi-value">{summary.resolved}</span><span className="kpi-label">Resolved</span></div>
            </div>

            <div className="admin-toolbar">
                <select className="admin-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Tickets' : s}</option>)}
                </select>
                <span className="admin-result-count">{filtered.length} tickets</span>
            </div>

            <div className="admin-tickets-grid">
                {filtered.map(ticket => (
                    <div key={ticket.id} className="admin-ticket-card">
                        <div className="ticket-header">
                            <span className="td-mono ticket-id">{ticket.id}</span>
                            <div className="ticket-badges">
                                <span className={`admin-badge ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                                <span className={`admin-badge ${statusColors[ticket.status]}`}>{ticket.status}</span>
                            </div>
                        </div>
                        <h4 className="ticket-subject">{ticket.subject}</h4>
                        <p className="ticket-desc">{ticket.description}</p>
                        <div className="ticket-meta">
                            <span>👤 {ticket.clientName}</span>
                            <span>📂 {ticket.category}</span>
                            <span>🕐 {ticket.createdAt}</span>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && <div className="admin-empty-state"><p>No tickets match the selected filter.</p></div>}
        </div>
    );
}
