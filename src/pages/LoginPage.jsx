import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [mode, setMode] = useState('login');
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const updateField = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) setErrors({ ...errors, [field]: '' });
        if (apiError) setApiError('');
    };

    const validate = () => {
        const errs = {};
        if (mode === 'register' && !formData.fullName.trim()) errs.fullName = 'Name is required';
        if (!formData.email.trim()) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email';
        if (!formData.password) errs.password = 'Password is required';
        else if (formData.password.length < 5) errs.password = 'Min 5 characters';
        if (mode === 'register' && formData.password && formData.password.length >= 5) {
            if (!/[A-Z]/.test(formData.password)) errs.password = 'Include at least 1 uppercase letter';
            else if (!/[0-9]/.test(formData.password)) errs.password = 'Include at least 1 number';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setApiError('');
        setSuccessMsg('');
        try {
            if (mode === 'login') {
                await login(formData.email, formData.password);
                navigate('/');
            } else {
                await register(formData.fullName, formData.email, formData.password, formData.phone);
                // After registration, switch to login mode so user logs in
                setSuccessMsg('🎉 Account created successfully! Please sign in with your credentials.');
                setMode('login');
                // Keep email, clear password
                setFormData({ ...formData, password: '', fullName: '', phone: '' });
            }
        } catch (err) {
            setApiError(err.message || 'Something went wrong. Please try again.');
        }
        setLoading(false);
    };

    const switchMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setErrors({});
        setApiError('');
        setSuccessMsg('');
    };

    return (
        <div className="login-page">
            <div className="login-bg">
                <div className="login-orb orb-1"></div>
                <div className="login-orb orb-2"></div>
                <div className="login-orb orb-3"></div>
            </div>

            <div className="login-container">
                <div className="login-branding">
                    <div className="branding-content">
                        <div className="branding-logo">🛡️</div>
                        <h1>InsureCompare</h1>
                        <p>Your trusted partner for insurance comparison, claims, and financial protection.</p>
                        <div className="branding-features">
                            <div className="branding-feature"><span className="bf-icon">🔍</span><span>Compare 21+ policies</span></div>
                            <div className="branding-feature"><span className="bf-icon">📊</span><span>Instant premium quotes</span></div>
                            <div className="branding-feature"><span className="bf-icon">📋</span><span>Easy claim filing & tracking</span></div>
                            <div className="branding-feature"><span className="bf-icon">🎯</span><span>Personalized recommendations</span></div>
                        </div>
                    </div>
                </div>

                <div className="login-form-panel">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <h2 className="login-title">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                        <p className="login-subtitle">
                            {mode === 'login' ? 'Sign in to access your insurance dashboard' : 'Join InsureCompare to protect what matters most'}
                        </p>

                        {apiError && <div className="login-alert error">{apiError}</div>}
                        {successMsg && <div className="login-alert success">{successMsg}</div>}

                        {mode === 'register' && (
                            <div className="form-group animate-field" style={{ animationDelay: '0.05s' }}>
                                <label>Full Name *</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">👤</span>
                                    <input type="text" className="form-input login-input" placeholder="Your full name" value={formData.fullName} onChange={(e) => updateField('fullName', e.target.value)} />
                                </div>
                                {errors.fullName && <div className="form-error">{errors.fullName}</div>}
                            </div>
                        )}

                        <div className="form-group animate-field" style={{ animationDelay: '0.1s' }}>
                            <label>Email Address *</label>
                            <div className="input-wrapper">
                                <span className="input-icon">📧</span>
                                <input type="email" className="form-input login-input" placeholder="you@example.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
                            </div>
                            {errors.email && <div className="form-error">{errors.email}</div>}
                        </div>

                        <div className="form-group animate-field" style={{ animationDelay: '0.15s' }}>
                            <label>Password *</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input login-input"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => updateField('password', e.target.value)}
                                    style={{ paddingRight: '48px' }}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {errors.password && <div className="form-error">{errors.password}</div>}
                            {mode === 'register' && (
                                <div className="password-rules">
                                    Must be 5+ chars with 1 uppercase letter and 1 number
                                </div>
                            )}
                        </div>

                        {mode === 'register' && (
                            <div className="form-group animate-field" style={{ animationDelay: '0.2s' }}>
                                <label>Phone <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                                <div className="input-wrapper">
                                    <span className="input-icon">📱</span>
                                    <input type="tel" className="form-input login-input" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                            {loading ? <span className="spinner"></span> : mode === 'login' ? '🚀 Sign In' : '✨ Create Account'}
                        </button>

                        <div className="login-switch">
                            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                            <button type="button" className="switch-btn" onClick={switchMode}>
                                {mode === 'login' ? 'Register' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
