import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminCompliance() {
    const { token } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/compliance', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, [token]);

    if (loading) return <div className="admin-page-loading"><div className="spinner"></div><p>Loading compliance...</p></div>;
    if (!data) return <div className="admin-page-error">Failed to load compliance data.</div>;

    const { complianceRate, riskAssessments, auditLog } = data;
    const riskColors = { High: 'badge-red', Medium: 'badge-amber', Low: 'badge-green' };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1>Compliance & Risk</h1>
                <p>Risk assessment, regulatory compliance, and audit trails</p>
            </div>

            {/* Compliance Rate */}
            <div className="admin-compliance-rate">
                <div className="compliance-gauge">
                    <div className="gauge-circle">
                        <svg viewBox="0 0 120 120" className="gauge-svg">
                            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                            <circle cx="60" cy="60" r="52" fill="none" stroke={complianceRate >= 90 ? 'var(--success)' : complianceRate >= 70 ? 'var(--warning)' : 'var(--error)'}
                                strokeWidth="10" strokeLinecap="round"
                                strokeDasharray={`${(complianceRate / 100) * 326.7} 326.7`}
                                transform="rotate(-90 60 60)" />
                        </svg>
                        <div className="gauge-text">
                            <span className="gauge-value">{complianceRate}%</span>
                            <span className="gauge-label">Compliance</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Risk Assessments */}
            <h3 className="admin-section-title">Risk Assessments</h3>
            <div className="admin-risk-grid">
                {riskAssessments.map(ra => (
                    <div key={ra.id} className={`admin-risk-card risk-${ra.level.toLowerCase()}`}>
                        <div className="risk-header">
                            <span className="risk-type">{ra.policyType}</span>
                            <span className={`admin-badge ${riskColors[ra.level]}`}>{ra.level} Risk</span>
                        </div>
                        <p className="risk-desc">{ra.description}</p>
                        <span className="risk-reviewed">Last reviewed: {ra.lastReviewed}</span>
                    </div>
                ))}
            </div>

            {/* Audit Trail */}
            <h3 className="admin-section-title">Audit Trail</h3>
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Action</th>
                            <th>Module</th>
                            <th>User</th>
                            <th>Details</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditLog.map(log => (
                            <tr key={log.id}>
                                <td className="td-mono">{log.id}</td>
                                <td><strong>{log.action}</strong></td>
                                <td><span className="admin-badge badge-blue">{log.module}</span></td>
                                <td>{log.user}</td>
                                <td className="td-desc">{log.details}</td>
                                <td className="td-mono">{log.timestamp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
