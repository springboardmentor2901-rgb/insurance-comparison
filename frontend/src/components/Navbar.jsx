import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const profileRef = useRef(null);

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
                <NavLink to="/" className="navbar-logo">
                    <div className="logo-icon">🛡️</div>
                    <span>InsureVault</span>
                </NavLink>

                <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? '✕' : '☰'}
                </button>

                <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
                    <NavLink to="/get-quote" onClick={() => setMenuOpen(false)}>Get Quote</NavLink>
                    <NavLink to="/compare" onClick={() => setMenuOpen(false)}>Compare</NavLink>
                    <NavLink to="/calculator" onClick={() => setMenuOpen(false)}>Calculator</NavLink>
                    <NavLink to="/recommendations" onClick={() => setMenuOpen(false)}>For You</NavLink>
                    <NavLink to="/file-claim" onClick={() => setMenuOpen(false)}>File Claim</NavLink>
                    <NavLink to="/track-claim" onClick={() => setMenuOpen(false)}>Track</NavLink>

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

