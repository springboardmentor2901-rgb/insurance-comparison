import { useState, useRef, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
    { path: 'compliance', label: 'Compliance', icon: '🛡️' }
];

const topNavItems = [
    { path: 'support', label: '🎧 Support' },
    { path: 'billing', label: '💰 Billing' }
];

export default function AdminDashboard() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const profileRef = useRef(null);

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
        : '—';

    const handleLogout = () => {
        setProfileOpen(false);
        logout();
        navigate('/login');
    };

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        const handleEsc = (e) => {
            if (e.key === 'Escape') setProfileOpen(false);
        };
        if (profileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEsc);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [profileOpen]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Top Navigation Bar */}
            <nav style={{ 
                background: 'var(--bg-secondary)', 
                borderBottom: '1px solid var(--border-color)',
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '16px',
                flexShrink: 0
            }}>
                {topNavItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={`/admin/${item.path}`}
                        className={({ isActive }) => `
                            btn ${isActive ? 'btn-primary' : 'btn-outline'} btn-sm
                        `}
                    >
                        {item.label}
                    </NavLink>
                ))}

                {/* Profile Dropdown */}
                <div ref={profileRef} style={{ position: 'relative' }}>
                    <div
                        className="user-avatar"
                        onClick={() => setProfileOpen(!profileOpen)}
                        title="View Profile"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setProfileOpen(!profileOpen)}
                        style={{ cursor: 'pointer' }}
                    >
                        {user?.fullName?.charAt(0).toUpperCase()}
                    </div>

                    {profileOpen && (
                        <div className="profile-dropdown">
                            <div className="profile-dropdown-header">
                                <div className="profile-avatar-lg">
                                    {user?.fullName?.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="profile-name">{user?.fullName}</h3>
                                <p className="profile-email">{user?.email}</p>
                                <span className="profile-role-badge">Admin</span>
                            </div>

                            <div className="profile-dropdown-body">
                                <div className="profile-detail-row">
                                    <span className="profile-detail-icon">📧</span>
                                    <div>
                                        <span className="profile-detail-label">Email</span>
                                        <span className="profile-detail-value">{user?.email}</span>
                                    </div>
                                </div>
                                <div className="profile-detail-row">
                                    <span className="profile-detail-icon">📱</span>
                                    <div>
                                        <span className="profile-detail-label">Phone</span>
                                        <span className="profile-detail-value">{user?.phone || 'Not provided'}</span>
                                    </div>
                                </div>
                                <div className="profile-detail-row">
                                    <span className="profile-detail-icon">📅</span>
                                    <div>
                                        <span className="profile-detail-label">Member Since</span>
                                        <span className="profile-detail-value">{memberSince}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-dropdown-footer">
                                <button className="btn btn-secondary profile-logout-btn" onClick={handleLogout}>
                                    🚪 Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Left Sidebar */}
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

                {/* Main Content */}
                <div className="admin-content" style={{ flex: 1, overflow: 'auto' }}>
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
        </div>
    );
}
