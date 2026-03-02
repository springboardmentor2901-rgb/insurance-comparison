import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-text">
                    © 2025 InsureCompare. All rights reserved. Built for smart insurance decisions.
                </div>
                <div className="footer-links">
                    <Link to="/compare">Compare Policies</Link>
                    <Link to="/calculator">Premium Calculator</Link>
                    <Link to="/file-claim">File a Claim</Link>
                    <Link to="/track-claim">Track Claims</Link>
                </div>
            </div>
        </footer>
    );
}
