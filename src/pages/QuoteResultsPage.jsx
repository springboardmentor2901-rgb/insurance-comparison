import { useLocation, Link, useNavigate } from 'react-router-dom';

export default function QuoteResultsPage() {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state?.quotes) {
        return (
            <div className="page">
                <div className="container" style={{ textAlign: 'center', padding: '120px 20px' }}>
                    <h2>No Quotes Found</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>Please fill out the quote form first.</p>
                    <Link to="/get-quote" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-block' }}>Get a Quote →</Link>
                </div>
            </div>
        );
    }

    const { quotes, summary } = state;
    const formatCurrency = (val) => '₹' + Number(val).toLocaleString('en-IN');

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>📊 Your Insurance Quotes</h1>
                    <p>We've generated {quotes.length} personalized quotes based on your profile.</p>
                </div>

                {/* Summary Banner */}
                <div className="glass-card quote-summary-banner animate-scaleIn">
                    <div className="qsb-item">
                        <span className="qsb-label">Applicant</span>
                        <span className="qsb-value">{summary.applicant}</span>
                    </div>
                    <div className="qsb-item">
                        <span className="qsb-label">Age</span>
                        <span className="qsb-value">{summary.age} years</span>
                    </div>
                    <div className="qsb-item">
                        <span className="qsb-label">Type</span>
                        <span className="qsb-value">{summary.type}</span>
                    </div>
                    <div className="qsb-item">
                        <span className="qsb-label">Coverage</span>
                        <span className="qsb-value">{formatCurrency(summary.requestedCoverage)}</span>
                    </div>
                </div>

                {/* Quote Cards */}
                <div className="quotes-grid">
                    {quotes.map((quote, i) => (
                        <div key={quote.id} className={`glass-card quote-result-card ${quote.bestValue ? 'best-pick' : ''}`} style={{ animationDelay: `${i * 0.12}s` }}>
                            {quote.bestValue && <div className="best-badge">⭐ Best Value</div>}

                            <div className="qr-header">
                                <div>
                                    <h3>{quote.name}</h3>
                                    <span className="badge badge-teal">{quote.tier}</span>
                                </div>
                            </div>

                            <p className="qr-desc">{quote.description}</p>

                            <div className="qr-pricing">
                                <div className="qr-main-price">
                                    <span className="qr-amount">{formatCurrency(quote.annualPremium)}</span>
                                    <span className="qr-period">/year</span>
                                </div>
                                <div className="qr-savings">
                                    <span className="qr-original">{formatCurrency(quote.originalPrice)}</span>
                                    <span className="qr-save">Save {formatCurrency(quote.savings)}</span>
                                </div>
                            </div>

                            <div className="qr-details">
                                <div className="qr-detail">
                                    <span>Monthly</span>
                                    <strong>{formatCurrency(quote.monthlyPremium)}</strong>
                                </div>
                                <div className="qr-detail">
                                    <span>Coverage</span>
                                    <strong>{formatCurrency(quote.coverage)}</strong>
                                </div>
                            </div>

                            <div className="qr-benefits">
                                <h4>Key Benefits</h4>
                                <ul>
                                    {quote.benefits.slice(0, 4).map((b, j) => (
                                        <li key={j}>✓ {b}</li>
                                    ))}
                                    {quote.benefits.length > 4 && (
                                        <li className="more">+{quote.benefits.length - 4} more benefits</li>
                                    )}
                                </ul>
                            </div>

                            <div className="qr-actions">
                                <Link to="/compare" className="btn btn-secondary">Compare</Link>
                                <button className="btn btn-primary">Buy Now</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="quote-action-bar">
                    <button className="btn btn-secondary" onClick={() => navigate('/get-quote')}>🔄 Modify Quote</button>
                    <Link to="/compare" className="btn btn-secondary">📊 Compare Policies</Link>
                    <Link to="/calculator" className="btn btn-secondary">🧮 Calculate Premium</Link>
                </div>
            </div>
        </div>
    );
}
