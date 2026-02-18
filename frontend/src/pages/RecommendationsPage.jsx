import { useState } from 'react';

export default function RecommendationsPage() {
    const [profile, setProfile] = useState({ age: '', income: '', riskLevel: '' });
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const updateField = (field, value) => {
        setProfile({ ...profile, [field]: value });
        if (errors[field]) setErrors({ ...errors, [field]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!profile.age || profile.age < 18 || profile.age > 80) newErrors.age = 'Age must be 18-80';
        if (!profile.income) newErrors.income = 'Select income level';
        if (!profile.riskLevel) newErrors.riskLevel = 'Select risk tolerance';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await fetch('/api/recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            });
            const data = await res.json();
            setRecommendations(data);
            setSubmitted(true);
        } catch (err) {
            console.error('Failed to get recommendations:', err);
        }
        setLoading(false);
    };

    const formatCurrency = (val) => '₹' + val.toLocaleString('en-IN');

    const typeColors = {
        Life: 'badge-teal', Health: 'badge-blue', Auto: 'badge-purple',
        Property: 'badge-amber', Travel: 'badge-green', Cyber: 'badge-red',
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>🎯 Personalized Recommendations</h1>
                    <p>Tell us about yourself and we'll recommend the best insurance policies for you.</p>
                </div>

                <div className="recommendations-layout">
                    <div className="glass-card recommendations-form">
                        <h2>Your Profile</h2>
                        <div className="form-group">
                            <label>Age *</label>
                            <input type="number" className="form-input" placeholder="e.g. 30" min="18" max="80" value={profile.age} onChange={(e) => updateField('age', e.target.value)} />
                            {errors.age && <div className="form-error">{errors.age}</div>}
                        </div>
                        <div className="form-group">
                            <label>Annual Income Level *</label>
                            <select className="form-input" value={profile.income} onChange={(e) => updateField('income', e.target.value)}>
                                <option value="">Select income level</option>
                                <option value="low">Below ₹5,00,000</option>
                                <option value="medium">₹5,00,000 – ₹15,00,000</option>
                                <option value="high">Above ₹15,00,000</option>
                            </select>
                            {errors.income && <div className="form-error">{errors.income}</div>}
                        </div>
                        <div className="form-group">
                            <label>Risk Tolerance *</label>
                            <select className="form-input" value={profile.riskLevel} onChange={(e) => updateField('riskLevel', e.target.value)}>
                                <option value="">Select risk level</option>
                                <option value="low">Conservative (Low Risk)</option>
                                <option value="medium">Balanced (Medium Risk)</option>
                                <option value="high">Aggressive (High Risk)</option>
                            </select>
                            {errors.riskLevel && <div className="form-error">{errors.riskLevel}</div>}
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSubmit} disabled={loading}>
                            {loading ? '⏳ Analyzing...' : '🎯 Get Recommendations'}
                        </button>
                    </div>

                    {submitted && recommendations.length > 0 && (
                        <div className="recommendations-results">
                            <h2 style={{ marginBottom: '20px' }}>📋 Recommended for You</h2>
                            {recommendations.map((rec, idx) => (
                                <div key={rec.id} className="glass-card recommendation-card" style={{ animationDelay: `${idx * 0.15}s` }}>
                                    <div className="rec-header">
                                        <div>
                                            <h3>{rec.name}</h3>
                                            <span className={`badge ${typeColors[rec.type]}`}>{rec.type}</span>
                                        </div>
                                        <div className="match-score">
                                            <div className="score-circle">{rec.matchScore}%</div>
                                            <span>Match</span>
                                        </div>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px' }}>{rec.reason}</p>
                                    <div className="rec-details">
                                        <div><span className="label">Coverage:</span> {formatCurrency(rec.coverage)}</div>
                                        <div><span className="label">Premium:</span> {formatCurrency(rec.premium)}/yr</div>
                                        <div><span className="label">Duration:</span> {rec.duration} {rec.duration === 1 ? 'year' : 'years'}</div>
                                        <div><span className="label">Rating:</span> ⭐ {rec.rating}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
