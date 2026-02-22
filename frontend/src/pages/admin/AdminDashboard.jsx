import { useState } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import AdminOverview from './AdminOverview';
import AdminPolicies from './AdminPolicies';
import AdminClaims from './AdminClaims';
import AdminClients from './AdminClients';
import AdminBilling from './AdminBilling';
import AdminCompliance from './AdminCompliance';
import AdminSupport from './AdminSupport';

const sidebarItems = [
    { path: '', label: 'Overview', icon: '📊', end: true },
    { path: 'policies', label: 'Policies', icon: '📄' },
    { path: 'claims', label: 'Claims', icon: '📋' },
    { path: 'clients', label: 'Clients & Agents', icon: '👥' },
    { path: 'billing', label: 'Billing', icon: '💰' },
    { path: 'compliance', label: 'Compliance', icon: '🛡️' },
    { path: 'support', label: 'Support', icon: '🎧' }
];

export default function AdminDashboard() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="admin-layout">
            <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="admin-sidebar-header">
                    <h2>{sidebarCollapsed ? '⚙️' : '⚙️ Admin Panel'}</h2>
                    <button
                        className="sidebar-toggle-btn"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        title={sidebarCollapsed ? 'Expand' : 'Collapse'}
                    >
                        {sidebarCollapsed ? '→' : '←'}
                    </button>
                </div>
                <nav className="admin-sidebar-nav">
                    {sidebarItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={`/admin/${item.path}`}
                            end={item.end}
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <span className="admin-nav-icon">{item.icon}</span>
                            {!sidebarCollapsed && <span className="admin-nav-label">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>
            </aside>
            <div className="admin-content">
                <Routes>
                    <Route index element={<AdminOverview />} />
                    <Route path="policies" element={<AdminPolicies />} />
                    <Route path="claims" element={<AdminClaims />} />
                    <Route path="clients" element={<AdminClients />} />
                    <Route path="billing" element={<AdminBilling />} />
                    <Route path="compliance" element={<AdminCompliance />} />
                    <Route path="support" element={<AdminSupport />} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
            </div>
        </div>
    );
}
