import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge">
                        ✨ Smart Insurance Platform
                    </div>
                    <h1>
                        Compare, Calculate &amp;<br />
                        <span className="gradient-text">Manage Your Insurance</span>
                    </h1>
                    <p>
                        Your all-in-one platform to compare insurance policies, calculate premiums,
                        get personalized recommendations, and manage claims — all in one place.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/compare" className="btn btn-primary btn-lg">
                            🔍 Compare Policies
                        </Link>
                        <Link to="/calculator" className="btn btn-outline btn-lg">
                            🧮 Premium Calculator
                        </Link>
                        <Link to="/file-claim" className="btn btn-secondary btn-lg">
                            📋 File a Claim
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item animate-fadeIn">
                            <h3>50+</h3>
                            <p>Insurance Policies</p>
                        </div>
                        <div className="stat-item animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                            <h3>10K+</h3>
                            <p>Claims Processed</p>
                        </div>
                        <div className="stat-item animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                            <h3>98%</h3>
                            <p>Customer Satisfaction</p>
                        </div>
                        <div className="stat-item animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                            <h3>₹500Cr+</h3>
                            <p>Claims Settled</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="page-header">
                        <h1>Why Choose InsureCompare?</h1>
                        <p>Everything you need to make informed insurance decisions, all in one powerful platform.</p>
                    </div>
                    <div className="features-grid">
                        <div className="glass-card feature-card">
                            <div className="feature-icon teal">🛡️</div>
                            <h3>Policy Comparison</h3>
                            <p>Compare up to 3 policies side-by-side with detailed coverage analysis, premium breakdowns, and benefit highlights.</p>
                        </div>
                        <div className="glass-card feature-card">
                            <div className="feature-icon blue">🧮</div>
                            <h3>Premium Calculator</h3>
                            <p>Calculate your insurance premium instantly with our smart calculator. Get monthly and yearly breakdowns.</p>
                        </div>
                        <div className="glass-card feature-card">
                            <div className="feature-icon purple">💡</div>
                            <h3>Smart Recommendations</h3>
                            <p>Get personalized policy recommendations based on your age, income, and risk profile with match scores.</p>
                        </div>
                        <div className="glass-card feature-card">
                            <div className="feature-icon amber">📊</div>
                            <h3>Claims Management</h3>
                            <p>File claims with a guided step-by-step process and track your claim status in real-time with timeline view.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section style={{ padding: '80px 24px', textAlign: 'center' }}>
                <div className="container">
                    <div className="glass-card" style={{ padding: '48px', maxWidth: '700px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '12px' }}>
                            Ready to find your perfect policy?
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '1.05rem' }}>
                            Start comparing policies and make an informed decision today.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/compare" className="btn btn-primary">Get Started →</Link>
                            <Link to="/recommendations" className="btn btn-secondary">Get Recommendations</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
