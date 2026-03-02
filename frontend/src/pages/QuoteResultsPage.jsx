import { useLocation, Link, useNavigate } from 'react-router-dom';

export default function QuoteResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { quotes, summary, formData } = location.state || {};

    if (!quotes || !summary) {
        return (
            <div className="page">
                <div className="container" style={{ textAlign: 'center', padding: '120px 20px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📝</div>
                    <h2 style={{ marginBottom: '12px' }}>No Quotes Generated Yet</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>Fill out the quote form to get personalized insurance quotes.</p>
                    <Link to="/get-quote" className="btn btn-primary">Get a Quote →</Link>
                </div>
            </div>
        );
    }

    const formatCurrency = (val) => '₹' + Number(val).toLocaleString('en-IN');

    const typeIcons = { Life: '❤️', Health: '🏥', Auto: '🚗', Property: '🏠', Travel: '✈️', Cyber: '🔒' };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>⚡ Your Insurance Quotes</h1>
                    <p>{summary.quotesGenerated} quotes generated for {summary.applicant} · {summary.policyType} Insurance · {formatCurrency(summary.requestedCoverage)} coverage</p>
                </div>

                {/* Summary Banner */}
                <div className="glass-card quote-summary-banner animate-scaleIn">
                    <div className="qsb-item"><span className="qsb-label">Applicant</span><span className="qsb-value">{summary.applicant}</span></div>
                    <div className="qsb-item"><span className="qsb-label">Age</span><span className="qsb-value">{summary.age}</span></div>
                    <div className="qsb-item"><span className="qsb-label">Type</span><span className="qsb-value">{typeIcons[summary.policyType]} {summary.policyType}</span></div>
                    <div className="qsb-item"><span className="qsb-label">Coverage</span><span className="qsb-value">{formatCurrency(summary.requestedCoverage)}</span></div>
                </div>

                {/* Quote Cards */}
                <div className="quotes-grid">
                    {quotes.map((quote, idx) => (
                        <div key={quote.id} className={`glass-card quote-result-card ${idx === 0 ? 'best-pick' : ''}`} style={{ animationDelay: `${idx * 0.12}s` }}>
                            {idx === 0 && <div className="best-badge">⭐ Best Value</div>}
                            <div className="qr-header">
                                <h3>{quote.policyName}</h3>
                                <span className="badge badge-teal">{quote.policyType}</span>
                            </div>
                            <p className="qr-desc">{quote.description}</p>

                            <div className="qr-pricing">
                                <div className="qr-main-price">
                                    <span className="qr-amount">{formatCurrency(quote.discountedPremium)}</span>
                                    <span className="qr-period">/year</span>
                                </div>
                                {quote.savings > 0 && (
                                    <div className="qr-savings">
                                        <span className="qr-original">{formatCurrency(quote.annualPremium)}</span>
                                        <span className="qr-save">Save {formatCurrency(quote.savings)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="qr-details">
                                <div className="qr-detail"><span>Monthly</span><strong>{formatCurrency(quote.monthlyPremium)}</strong></div>
                                <div className="qr-detail"><span>Duration</span><strong>{quote.duration} {quote.duration === 1 ? 'yr' : 'yrs'}</strong></div>
                                <div className="qr-detail"><span>Rating</span><strong>⭐ {quote.rating}</strong></div>
                                <div className="qr-detail"><span>Coverage</span><strong>{formatCurrency(quote.coverage)}</strong></div>
                            </div>

                            <div className="qr-benefits">
                                <h4>Key Benefits</h4>
                                <ul>
                                    {quote.benefits.slice(0, 4).map((b, i) => <li key={i}>✅ {b}</li>)}
                                    {quote.benefits.length > 4 && <li className="more">+{quote.benefits.length - 4} more</li>}
                                </ul>
                            </div>

                            <div className="qr-actions">
                                <Link to="/compare" className="btn btn-secondary btn-sm">Compare</Link>
                                <Link to="/file-claim" className="btn btn-primary btn-sm">Buy Now</Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Bar */}
                <div className="quote-action-bar">
                    <button className="btn btn-secondary" onClick={() => navigate('/get-quote')}>← Modify Quote</button>
                    <Link to="/compare" className="btn btn-outline">🔍 Compare All Policies</Link>
                    <Link to="/calculator" className="btn btn-primary">🧮 Premium Calculator</Link>
                </div>
            </div>
        </div>
    );
}
