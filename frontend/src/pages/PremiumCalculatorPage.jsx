import { useState } from 'react';
import { Link } from 'react-router-dom';

const POLICY_TYPES = ['Life', 'Health', 'Auto', 'Property', 'Travel', 'Cyber'];
const TYPE_COLORS = {
    Life: 'badge-teal', Health: 'badge-blue', Auto: 'badge-purple',
    Property: 'badge-amber', Travel: 'badge-green', Cyber: 'badge-red',
};

export default function PremiumCalculatorPage() {
    const [formData, setFormData] = useState({ age: '', coverage: '', duration: '', policyType: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [recommendations, setRecommendations] = useState([]);
    const [showRecommendations, setShowRecommendations] = useState(false);

    const updateField = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) setErrors({ ...errors, [field]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.age || formData.age < 18 || formData.age > 80) newErrors.age = 'Age: 18-80';
        if (!formData.coverage || formData.coverage < 100000) newErrors.coverage = 'Min ₹1,00,000';
        if (!formData.duration || formData.duration < 1 || formData.duration > 30) newErrors.duration = '1-30 years';
        if (!formData.policyType) newErrors.policyType = 'Select type';
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
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Calculation failed');
            setResult(data);
        } catch (err) {
            setErrors({ submit: err.message });
        }
        setLoading(false);
    };

    const handleRecommendations = async () => {
        try {
            const res = await fetch('/api/recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ age: formData.age, income: 'medium', riskLevel: 'medium' })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed');
            setRecommendations(data);
            setShowRecommendations(true);
        } catch (err) {
            setErrors({ recommendations: err.message });
        }
    };

    const fmt = (val) => '₹' + val.toLocaleString('en-IN');

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>🧮 Premium Calculator</h1>
                    <p>Quick estimate based on your profile and needs.</p>
                </div>

                <div className="calculator-layout">
                    {/* Form */}
                    <div className="glass-card calculator-form">
                        <h2>Your Details</h2>
                        <div className="form-group">
                            <label>Age (years) *</label>
                            <input type="number" className="form-input" placeholder="18-80" min="18" max="80" value={formData.age} onChange={(e) => updateField('age', e.target.value)} />
                            {errors.age && <div className="form-error">{errors.age}</div>}
                        </div>
                        <div className="form-group">
                            <label>Coverage (₹) *</label>
                            <input type="number" className="form-input" placeholder="Min 1,00,000" min="100000" value={formData.coverage} onChange={(e) => updateField('coverage', e.target.value)} />
                            {errors.coverage && <div className="form-error">{errors.coverage}</div>}
                        </div>
                        <div className="form-group">
                            <label>Duration (years) *</label>
                            <input type="number" className="form-input" placeholder="1-30" min="1" max="30" value={formData.duration} onChange={(e) => updateField('duration', e.target.value)} />
                            {errors.duration && <div className="form-error">{errors.duration}</div>}
                        </div>
                        <div className="form-group">
                            <label>Policy Type *</label>
                            <select className="form-input" value={formData.policyType} onChange={(e) => updateField('policyType', e.target.value)}>
                                <option value="">Select</option>
                                {POLICY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            {errors.policyType && <div className="form-error">{errors.policyType}</div>}
                        </div>
                        <button className="btn btn-primary w-full" onClick={handleCalculate} disabled={loading}>
                            {loading ? '⏳ Calculating...' : '🧮 Calculate'}
                        </button>
                        {errors.submit && <div className="form-error" style={{marginTop: '12px'}}>{errors.submit}</div>}
                    </div>

                    {/* Right Column - Results & Recommendations Side by Side */}
                    {result && (
                        <div className="calc-right-row">
                            {/* Premium Box */}
                            <div className="glass-card calc-results">
                                <h2>📊 Estimated Premium</h2>
                                <div className="result-grid">
                                    <div className="result-item">
                                        <span className="result-label">Annual</span>
                                        <span className="result-value highlight">{fmt(result.annualPremium)}</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">Monthly</span>
                                        <span className="result-value">{fmt(result.monthlyPremium)}</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">Total ({result.duration}y)</span>
                                        <span className="result-value">{fmt(result.totalPremium)}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-muted">*Estimate based on provided info</p>
                                <button className="btn btn-secondary w-full mt-4" onClick={handleRecommendations}>
                                    💡 Get Recommendations
                                </button>
                            </div>

                            {/* Recommendations Sidebar */}
                            {showRecommendations && recommendations.length > 0 && (
                                <div className="rec-sidebar-section">
                                    <h3 className="rec-section-title">📋 Recommended</h3>
                                    <div className="rec-sidebar-grid">
                                        {recommendations.map((rec) => (
                                            <div key={rec.id} className="glass-card rec-card-compact">
                                                <div className="rec-header-compact">
                                                    <h4>{rec.name}</h4>
                                                    <div className="match-badge-sm">{rec.matchScore}%</div>
                                                </div>
                                                <span className={`badge ${TYPE_COLORS[rec.type]}`}>{rec.type}</span>
                                                <p className="rec-reason-sm">{rec.reason}</p>
                                                <div className="rec-details-sm">
                                                    <div>{fmt(rec.coverage)}</div>
                                                    <div>{fmt(rec.premium)}/yr</div>
                                                </div>
                                                <Link to={`/policies/${rec.id}`} className="btn btn-primary btn-sm w-full">
                                                    View
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {errors.recommendations && (
                    <div className="glass-card error-box mt-5">
                        <p>{errors.recommendations}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
