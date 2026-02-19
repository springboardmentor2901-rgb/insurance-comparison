import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();

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

                    {isAuthenticated ? (
                        <div className="navbar-user">
                            <div className="user-avatar">{user?.fullName?.charAt(0).toUpperCase()}</div>
                            <button className="btn btn-sm btn-secondary nav-logout" onClick={logout}>Logout</button>
                        </div>
                    ) : (
                        <NavLink to="/login" className="btn btn-primary btn-sm nav-login-btn" onClick={() => setIsOpen(false)}>Sign In</NavLink>
                    )}
                </div>
            </div>
        </nav>
    );
}
