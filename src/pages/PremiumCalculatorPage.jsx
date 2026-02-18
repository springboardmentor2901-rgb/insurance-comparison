import { useState } from 'react';
import { calculatePremium } from '../data/mockData';

const policyTypeOptions = ['Life', 'Health', 'Auto', 'Property', 'Travel', 'Cyber'];

export default function PremiumCalculatorPage() {
    const [form, setForm] = useState({
        age: '',
        coverage: '',
        duration: '',
        policyType: ''
    });
    const [errors, setErrors] = useState({});
    const [result, setResult] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!form.age || form.age < 18 || form.age > 80) newErrors.age = 'Age must be between 18 and 80';
        if (!form.coverage || form.coverage < 100000) newErrors.coverage = 'Min coverage is ₹1,00,000';
        if (!form.duration || form.duration < 1 || form.duration > 40) newErrors.duration = 'Duration must be 1-40 years';
        if (!form.policyType) newErrors.policyType = 'Please select a policy type';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const res = calculatePremium(
            Number(form.age),
            Number(form.coverage),
            Number(form.duration),
            form.policyType
        );
        setResult(res);
        setShowResult(true);
    };

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const formatCurrency = (val) => '₹' + val.toLocaleString('en-IN');

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>🧮 Premium Calculator</h1>
                    <p>Calculate your estimated insurance premium instantly based on your profile and requirements.</p>
                </div>

                <div className="calculator-layout">
                    {/* Form */}
                    <form className="glass-card calculator-form" onSubmit={handleSubmit}>
                        <h2>📋 Your Details</h2>

                        <div className="form-group">
                            <label>Age</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Enter your age (18-80)"
                                value={form.age}
                                onChange={(e) => handleChange('age', e.target.value)}
                            />
                            {errors.age && <div className="form-error">{errors.age}</div>}
                        </div>

                        <div className="form-group">
                            <label>Coverage Amount (₹)</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="e.g. 1000000"
                                value={form.coverage}
                                onChange={(e) => handleChange('coverage', e.target.value)}
                            />
                            {errors.coverage && <div className="form-error">{errors.coverage}</div>}
                        </div>

                        <div className="form-group">
                            <label>Policy Duration (years)</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="e.g. 10"
                                value={form.duration}
                                onChange={(e) => handleChange('duration', e.target.value)}
                            />
                            {errors.duration && <div className="form-error">{errors.duration}</div>}
                        </div>

                        <div className="form-group">
                            <label>Policy Type</label>
                            <select
                                className="form-input"
                                value={form.policyType}
                                onChange={(e) => handleChange('policyType', e.target.value)}
                            >
                                <option value="">Select policy type</option>
                                {policyTypeOptions.map(t => (
                                    <option key={t} value={t}>{t} Insurance</option>
                                ))}
                            </select>
                            {errors.policyType && <div className="form-error">{errors.policyType}</div>}
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                            Calculate Premium →
                        </button>
                    </form>

                    {/* Result Card */}
                    <div className={`glass-card result-card ${showResult ? 'has-result' : ''}`}>
                        {showResult && result ? (
                            <div className="animate-fadeIn">
                                <div style={{ fontSize: '2rem', marginBottom: '4px' }}>💰</div>
                                <div className="result-label">Your Estimated Annual Premium</div>
                                <div className="result-amount">{formatCurrency(result.annualPremium)}</div>
                                <div className="result-label">per year</div>

                                <div className="result-breakdown">
                                    <div className="result-breakdown-item">
                                        <span className="label">Monthly Premium</span>
                                        <span className="value" style={{ color: 'var(--accent-teal)' }}>
                                            {formatCurrency(result.monthlyPremium)}
                                        </span>
                                    </div>
                                    <div className="result-breakdown-item">
                                        <span className="label">Annual Premium</span>
                                        <span className="value" style={{ color: 'var(--accent-blue)' }}>
                                            {formatCurrency(result.annualPremium)}
                                        </span>
                                    </div>
                                    <div className="result-breakdown-item">
                                        <span className="label">Total ({result.duration} yrs)</span>
                                        <span className="value" style={{ color: 'var(--accent-purple)' }}>
                                            {formatCurrency(result.totalPremium)}
                                        </span>
                                    </div>
                                    <div className="result-breakdown-item" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '8px' }}>
                                        <span className="label">Policy Type</span>
                                        <span className="value">{form.policyType}</span>
                                    </div>
                                    <div className="result-breakdown-item">
                                        <span className="label">Coverage</span>
                                        <span className="value">{formatCurrency(Number(form.coverage))}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="result-placeholder">
                                <div className="icon">📊</div>
                                <p>Fill in your details and click<br /><strong>"Calculate Premium"</strong><br />to see your estimated cost.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
