import { useState } from 'react';
import { getRecommendations } from '../data/mockData';
import { Link } from 'react-router-dom';

export default function RecommendationsPage() {
    const [profile, setProfile] = useState({
        age: '',
        income: '',
        riskLevel: ''
    });
    const [recommendations, setRecommendations] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!profile.age || !profile.income || !profile.riskLevel) return;
        const results = getRecommendations({
            age: Number(profile.age),
            income: profile.income,
            riskLevel: profile.riskLevel
        });
        setRecommendations(results);
        setSubmitted(true);
    };

    const formatCurrency = (val) => '₹' + val.toLocaleString('en-IN');

    const typeIcons = {
        Life: '🛡️',
        Health: '💊',
        Auto: '🚗',
        Property: '🏠',
        Travel: '✈️',
        Cyber: '🔒'
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>💡 Personalized Recommendations</h1>
                    <p>Tell us about yourself and we'll recommend the best insurance policies for your needs.</p>
                </div>

                <div className="recommendations-layout">
                    {/* Profile Form */}
                    <form className="glass-card profile-form-card" onSubmit={handleSubmit}>
                        <h2 style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: 700 }}>
                            👤 Your Profile
                        </h2>
                        <div className="profile-form-grid">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Age</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Enter your age"
                                    value={profile.age}
                                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Income Level</label>
                                <select
                                    className="form-input"
                                    value={profile.income}
                                    onChange={(e) => setProfile({ ...profile, income: e.target.value })}
                                    required
                                >
                                    <option value="">Select income level</option>
                                    <option value="low">Below ₹5 Lakhs/yr</option>
                                    <option value="medium">₹5-15 Lakhs/yr</option>
                                    <option value="high">Above ₹15 Lakhs/yr</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Risk Tolerance</label>
                                <select
                                    className="form-input"
                                    value={profile.riskLevel}
                                    onChange={(e) => setProfile({ ...profile, riskLevel: e.target.value })}
                                    required
                                >
                                    <option value="">Select risk level</option>
                                    <option value="low">Low - I prefer safety</option>
                                    <option value="medium">Medium - Balanced approach</option>
                                    <option value="high">High - I'm open to risks</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '24px' }}>
                            🔍 Get Recommendations
                        </button>
                    </form>

                    {/* Recommendations */}
                    {submitted && recommendations.length > 0 && (
                        <>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px', textAlign: 'center' }}>
                                🎯 Recommended Policies for You
                            </h2>
                            <div className="recommendations-grid">
                                {recommendations.map((rec, index) => (
                                    <div key={rec.id} className="glass-card recommendation-card" style={{ animationDelay: `${index * 0.1}s` }}>
                                        <div className={`match-score ${rec.matchScore >= 90 ? 'high' : 'medium'}`}>
                                            🎯 {rec.matchScore}% Match
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                            <span style={{ fontSize: '2rem' }}>{typeIcons[rec.type] || '📋'}</span>
                                            <div>
                                                <h3>{rec.name}</h3>
                                                <span className="badge badge-teal">{rec.type}</span>
                                            </div>
                                        </div>
                                        <p className="explanation">{rec.reason}</p>
                                        <div className="policy-details" style={{ marginBottom: '16px' }}>
                                            <div className="policy-detail-item">
                                                <span className="label">Coverage</span>
                                                <span className="value">{formatCurrency(rec.coverage)}</span>
                                            </div>
                                            <div className="policy-detail-item">
                                                <span className="label">Premium</span>
                                                <span className="value">{formatCurrency(rec.premium)}/yr</span>
                                            </div>
                                            <div className="policy-detail-item">
                                                <span className="label">Duration</span>
                                                <span className="value">{rec.duration} {rec.duration === 1 ? 'year' : 'years'}</span>
                                            </div>
                                            <div className="policy-detail-item">
                                                <span className="label">Rating</span>
                                                <span className="value">⭐ {rec.rating}</span>
                                            </div>
                                        </div>
                                        <ul className="policy-benefits" style={{ marginBottom: '16px' }}>
                                            {rec.benefits.slice(0, 3).map((b, i) => (
                                                <li key={i}>{b}</li>
                                            ))}
                                        </ul>
                                        <Link to="/compare" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                                            Compare This Policy
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {submitted && recommendations.length === 0 && (
                        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', marginTop: '20px' }}>
                            <p style={{ color: 'var(--text-secondary)' }}>No recommendations found. Try different profile settings.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
