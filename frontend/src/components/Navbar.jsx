import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { to: '/', label: 'Home' },
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
                </div>
            </div>
        </nav>
    );
}
