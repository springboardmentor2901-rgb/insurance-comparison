import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const profileRef = useRef(null);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setProfileOpen(false);
        logout();
        navigate('/login');
    };

    const links = [
        { to: '/', label: 'Home' },
        { to: '/get-quote', label: 'Get Quote' },
        { to: '/compare', label: 'Compare' },
        { to: '/calculator', label: 'Calculator' },
        { to: '/recommendations', label: 'Recommend' },
        { to: '/file-claim', label: 'File Claim' },
        { to: '/track-claim', label: 'Track Claim' },
    ];

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon">🛡️</div>
                    <span>InsureCompare</span>
                </Link>

                <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? '✕' : '☰'}
                </button>

                <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
                    {links.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/'}
                            className={({ isActive }) => isActive ? 'active' : ''}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </NavLink>
                    ))}

                    {/* Profile Button */}
                    {isAuthenticated && (
                        <div className="profile-dropdown-wrapper" ref={profileRef}>
                            <button
                                className="profile-trigger"
                                onClick={() => setProfileOpen(!profileOpen)}
                                aria-label="Open profile menu"
                            >
                                <div className="user-avatar">
                                    {user?.fullName?.charAt(0).toUpperCase()}
                                </div>
                            </button>

                            {profileOpen && (
                                <div className="profile-dropdown">
                                    <div className="profile-dropdown-header">
                                        <div className="user-avatar-lg">
                                            {user?.fullName?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="profile-dropdown-info">
                                            <span className="profile-dropdown-name">{user?.fullName}</span>
                                            <span className="profile-dropdown-email">{user?.email}</span>
                                        </div>
                                    </div>
                                    <div className="profile-dropdown-divider"></div>
                                    <Link
                                        to="/profile"
                                        className="profile-dropdown-item"
                                        onClick={() => { setProfileOpen(false); setIsOpen(false); }}
                                    >
                                        <span>👤</span> My Profile
                                    </Link>
                                    <Link
                                        to="/get-quote"
                                        className="profile-dropdown-item"
                                        onClick={() => { setProfileOpen(false); setIsOpen(false); }}
                                    >
                                        <span>📝</span> Get a Quote
                                    </Link>
                                    <div className="profile-dropdown-divider"></div>
                                    <button className="profile-dropdown-item logout" onClick={handleLogout}>
                                        <span>🚪</span> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
