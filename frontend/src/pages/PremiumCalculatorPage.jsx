import { useState } from 'react';

const policyTypes = ['Life', 'Health', 'Auto', 'Property', 'Travel', 'Cyber'];

export default function PremiumCalculatorPage() {
    const [formData, setFormData] = useState({ age: '', coverage: '', duration: '', policyType: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

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
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error('Calculation failed:', err);
        }
        setLoading(false);
    };

    const formatCurrency = (val) => '₹' + val.toLocaleString('en-IN');

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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
