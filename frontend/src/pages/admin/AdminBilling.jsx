import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminBilling() {
    const { token } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('invoices');
    const [invoiceFilter, setInvoiceFilter] = useState('All');

    useEffect(() => {
        fetch('/api/admin/billing', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, [token]);

    const fmt = (v) => '₹' + (v || 0).toLocaleString('en-IN');

    if (loading) return <div className="admin-page-loading"><div className="spinner"></div><p>Loading billing...</p></div>;
    if (!data) return <div className="admin-page-error">Failed to load billing data.</div>;

    const { invoices, summary, commissions } = data;
    const statuses = ['All', 'Paid', 'Unpaid', 'Overdue'];
    const filteredInvoices = invoiceFilter === 'All' ? invoices : invoices.filter(i => i.status === invoiceFilter);

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Billing & Finance</h1>
                <p>Invoicing, payments, and commission management</p>
            </div>

            <div className="admin-kpi-grid small">
                <div className="admin-kpi-card kpi-blue mini"><span className="kpi-value">{fmt(summary.totalRevenue)}</span><span className="kpi-label">Total Revenue</span></div>
                <div className="admin-kpi-card kpi-green mini"><span className="kpi-value">{fmt(summary.paidAmount)}</span><span className="kpi-label">Collected</span></div>
                <div className="admin-kpi-card kpi-amber mini"><span className="kpi-value">{fmt(summary.unpaidAmount)}</span><span className="kpi-label">Unpaid</span></div>
                <div className="admin-kpi-card kpi-red mini"><span className="kpi-value">{fmt(summary.overdueAmount)}</span><span className="kpi-label">Overdue</span></div>
                <div className="admin-kpi-card kpi-purple mini"><span className="kpi-value">{fmt(summary.totalCommissions)}</span><span className="kpi-label">Commissions</span></div>
            </div>

            <div className="admin-tabs">
                <button className={`admin-tab ${tab === 'invoices' ? 'active' : ''}`} onClick={() => setTab('invoices')}>📄 Invoices</button>
                <button className={`admin-tab ${tab === 'commissions' ? 'active' : ''}`} onClick={() => setTab('commissions')}>💵 Commissions</button>
            </div>

            {tab === 'invoices' && (
                <>
                    <div className="admin-toolbar">
                        <select className="admin-filter-select" value={invoiceFilter} onChange={e => setInvoiceFilter(e.target.value)}>
                            {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Invoices' : s}</option>)}
                        </select>
                        <span className="admin-result-count">{filteredInvoices.length} invoices</span>
                    </div>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Invoice ID</th>
                                    <th>Client</th>
                                    <th>Policy</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map(inv => (
                                    <tr key={inv.id}>
                                        <td className="td-mono">{inv.id}</td>
                                        <td><strong>{inv.clientName}</strong></td>
                                        <td>{inv.policyName}</td>
                                        <td><span className={`admin-badge badge-${inv.type.toLowerCase()}`}>{inv.type}</span></td>
                                        <td>{fmt(inv.amount)}</td>
                                        <td>{inv.date}</td>
                                        <td>{inv.dueDate}</td>
                                        <td><span className={`admin-badge ${inv.status === 'Paid' ? 'badge-green' : inv.status === 'Overdue' ? 'badge-red' : 'badge-amber'}`}>{inv.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {tab === 'commissions' && (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Agent ID</th>
                                <th>Name</th>
                                <th>Region</th>
                                <th>Policies Sold</th>
                                <th>Commission</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commissions.map(c => (
                                <tr key={c.agentId}>
                                    <td className="td-mono">{c.agentId}</td>
                                    <td><strong>{c.name}</strong></td>
                                    <td>{c.region}</td>
                                    <td>{c.policiesSold}</td>
                                    <td className="td-highlight">{fmt(c.commission)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
