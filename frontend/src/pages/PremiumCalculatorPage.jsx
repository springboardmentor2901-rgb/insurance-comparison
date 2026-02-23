import { useState } from 'react';
import { Link } from 'react-router-dom';

const policyTypes = ['Life', 'Health', 'Auto', 'Property', 'Travel', 'Cyber'];

export default function PremiumCalculatorPage() {
    const [formData, setFormData] = useState({ age: '', coverage: '', duration: '', policyType: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [recommendations, setRecommendations] = useState([]);
    const [recommendationsLoading, setRecommendationsLoading] = useState(false);
    const [showRecommendations, setShowRecommendations] = useState(false);

    const updateField = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) setErrors({ ...errors, [field]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.age || formData.age < 18 || formData.age > 80) newErrors.age = 'Age must be between 18 and 80';
        if (!formData.coverage || formData.coverage < 100000) newErrors.coverage = 'Min coverage is ₹1,00,000';
        if (!formData.duration || formData.duration < 1 || formData.duration > 30) newErrors.duration = 'Duration: 1-30 years';
        if (!formData.policyType) newErrors.policyType = 'Select a policy type';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCalculate = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await fetch('/api/calculator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`API Error ${res.status}: ${text || 'Empty response'}`);
            }
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error('Calculation failed:', err);
            setErrors({ submit: err.message || 'Failed to calculate premium' });
        }
        setLoading(false);
    };

    const formatCurrency = (val) => '₹' + val.toLocaleString('en-IN');

    const typeColors = {
        Life: 'badge-teal', Health: 'badge-blue', Auto: 'badge-purple',
        Property: 'badge-amber', Travel: 'badge-green', Cyber: 'badge-red',
    };

    const handleGetRecommendations = async () => {
        setRecommendationsLoading(true);
        try {
            const res = await fetch('/api/recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    age: formData.age,
                    income: 'medium',
                    riskLevel: 'medium'
                })
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`API Error ${res.status}: ${text || 'Empty response'}`);
            }
            const data = await res.json();
            setRecommendations(data);
            setShowRecommendations(true);
        } catch (err) {
            console.error('Failed to get recommendations:', err);
            setErrors({ recommendations: err.message || 'Failed to get recommendations' });
        }
        setRecommendationsLoading(false);
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>🧮 Premium Calculator</h1>
                    <p>Estimate your insurance premium based on your age, coverage needs, and policy type.</p>
                </div>

                <div className="calculator-layout">
                    <div className="glass-card calculator-form">
                        <h2>Enter Your Details</h2>
                        <div className="form-group">
                            <label>Age (years) *</label>
                            <input type="number" className="form-input" placeholder="e.g. 28" min="18" max="80" value={formData.age} onChange={(e) => updateField('age', e.target.value)} />
                            {errors.age && <div className="form-error">{errors.age}</div>}
                        </div>
                        <div className="form-group">
                            <label>Coverage Amount (₹) *</label>
                            <input type="number" className="form-input" placeholder="e.g. 1000000" min="100000" value={formData.coverage} onChange={(e) => updateField('coverage', e.target.value)} />
                            {errors.coverage && <div className="form-error">{errors.coverage}</div>}
                        </div>
                        <div className="form-group">
                            <label>Duration (years) *</label>
                            <input type="number" className="form-input" placeholder="e.g. 10" min="1" max="30" value={formData.duration} onChange={(e) => updateField('duration', e.target.value)} />
                            {errors.duration && <div className="form-error">{errors.duration}</div>}
                        </div>
                        <div className="form-group">
                            <label>Policy Type *</label>
                            <select className="form-input" value={formData.policyType} onChange={(e) => updateField('policyType', e.target.value)}>
                                <option value="">Select type</option>
                                {policyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            {errors.policyType && <div className="form-error">{errors.policyType}</div>}
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCalculate} disabled={loading}>
                            {loading ? '⏳ Calculating...' : '🧮 Calculate Premium'}
                        </button>
                    </div>

                    {result && (
                        <div className="glass-card calculator-result">
                            <h2>📊 Your Estimated Premium</h2>
                            <div className="result-grid">
                                <div className="result-item">
                                    <span className="result-label">Annual Premium</span>
                                    <span className="result-value highlight">{formatCurrency(result.annualPremium)}</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Monthly Premium</span>
                                    <span className="result-value">{formatCurrency(result.monthlyPremium)}</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Total Premium ({result.duration} yrs)</span>
                                    <span className="result-value">{formatCurrency(result.totalPremium)}</span>
                                </div>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '16px' }}>
                                * This is an estimate. Actual premiums may vary based on health assessment and other factors.
                            </p>
                            <button 
                                className="btn btn-secondary" 
                                style={{ width: '100%', marginTop: '20px' }} 
                                onClick={handleGetRecommendations}
                                disabled={recommendationsLoading}
                            >
                                {recommendationsLoading ? '⏳ Getting Recommendations...' : '💡 Recommend Policies for You'}
                            </button>
                        </div>
                    )}
                </div>

                {showRecommendations && recommendations.length > 0 && (
                    <div style={{ marginTop: '40px' }}>
                        <div className="page-header">
                            <h2>📋 Recommended Policies for You</h2>
                            <p>Based on your profile, here are the best policies matched for your needs.</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '20px' }}>
                            {recommendations.map((rec, idx) => (
                                <div key={rec.id} className="glass-card" style={{ animationDelay: `${idx * 0.15}s`, padding: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>{rec.name}</h3>
                                            <span className={`badge ${typeColors[rec.type]}`}>{rec.type}</span>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: 'var(--bg-primary)' }}>
                                                {rec.matchScore}%
                                            </div>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>Match</span>
                                        </div>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>{rec.reason}</p>
                                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '16px', fontSize: '0.9rem' }}>
                                        <div style={{ marginBottom: '8px' }}><span style={{ fontWeight: 600 }}>Coverage:</span> {formatCurrency(rec.coverage)}</div>
                                        <div style={{ marginBottom: '8px' }}><span style={{ fontWeight: 600 }}>Premium:</span> {formatCurrency(rec.premium)}/year</div>
                                        <div style={{ marginBottom: '8px' }}><span style={{ fontWeight: 600 }}>Duration:</span> {rec.duration} {rec.duration === 1 ? 'year' : 'years'}</div>
                                        <div><span style={{ fontWeight: 600 }}>Rating:</span> ⭐ {rec.rating}</div>
                                    </div>
                                    <Link to={`/policies/${rec.id}`} className="btn btn-primary" style={{ width: '100%' }}>
                                        View Details
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {errors.recommendations && (
                    <div className="glass-card" style={{ marginTop: '20px', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                        <p style={{ color: '#fca5a5' }}>{errors.recommendations}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
