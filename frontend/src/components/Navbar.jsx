import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const profileRef = useRef(null);

    // Check if we're on an admin page
    const isAdminPage = location.pathname.startsWith('/admin');

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

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
        : '—';

    return (
        <nav className="navbar">
            <div className="container">
                <NavLink to={isAdmin ? '/admin' : '/'} className="navbar-logo">
                    <div className="logo-icon">🛡️</div>
                    <span>InsureCompare</span>
                </NavLink>

                <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? '✕' : '☰'}
                </button>

                <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    {/* Show user links ONLY for non-admin users */}
                    {!isAdmin && (
                        <>
                            <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
                            <NavLink to="/get-quote" onClick={() => setMenuOpen(false)}>Get Quote</NavLink>
                            <NavLink to="/compare" onClick={() => setMenuOpen(false)}>Compare</NavLink>
                            <NavLink to="/calculator" onClick={() => setMenuOpen(false)}>Calculator</NavLink>
                            <NavLink to="/recommendations" onClick={() => setMenuOpen(false)}>For You</NavLink>
                            <NavLink to="/file-claim" onClick={() => setMenuOpen(false)}>File Claim</NavLink>
                            <NavLink to="/track-claim" onClick={() => setMenuOpen(false)}>Track</NavLink>
                            <NavLink to="/claim-history" onClick={() => setMenuOpen(false)}>History</NavLink>
                        </>
                    )}

                    {/* Show admin module links for admin users */}
                    {isAdmin && (
                        <>
                            <NavLink to="/admin" end onClick={() => setMenuOpen(false)}>Overview</NavLink>
                            <NavLink to="/admin/policies" onClick={() => setMenuOpen(false)}>Policies</NavLink>
                            <NavLink to="/admin/claims" onClick={() => setMenuOpen(false)}>Claims</NavLink>
                            <NavLink to="/admin/clients" onClick={() => setMenuOpen(false)}>Clients & Agents</NavLink>
                            <NavLink to="/admin/billing" onClick={() => setMenuOpen(false)}>Billing</NavLink>
                            <NavLink to="/admin/compliance" onClick={() => setMenuOpen(false)}>Compliance</NavLink>
                            <NavLink to="/admin/support" onClick={() => setMenuOpen(false)}>Support</NavLink>
                        </>
                    )}

                    {isAuthenticated ? (
                        <div className="navbar-user" ref={profileRef}>
                            <div
                                className="user-avatar"
                                onClick={() => setProfileOpen(!profileOpen)}
                                title="View Profile"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && setProfileOpen(!profileOpen)}
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
                                        {isAdmin && <span className="profile-role-badge">Admin</span>}
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
                    ) : (
                        <NavLink to="/login" className="btn btn-primary btn-sm nav-login-btn" onClick={() => setMenuOpen(false)}>Sign In</NavLink>
                    )}
                </div>
            </div>
        </nav>
    );
}
