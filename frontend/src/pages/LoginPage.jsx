import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Show success message if redirected from registration
    useEffect(() => {
        if (location.state?.registered) {
            setSuccessMsg('Account created successfully! Please sign in.');
        }
    }, [location.state]);

    const updateField = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) setErrors({ ...errors, [field]: '' });
        if (apiError) setApiError('');
    };

    const validate = () => {
        const errs = {};
        if (!formData.email.trim()) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email';
        if (!formData.password) errs.password = 'Password is required';
        else if (formData.password.length < 5) errs.password = 'Min 5 characters';
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
            const user = await login(formData.email, formData.password);
            if (user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            if (err.code === 'NOT_FOUND') {
                setApiError('No account found with this email. Please check your credentials or register below.');
            } else {
                setApiError(err.message || 'Something went wrong. Please try again.');
            }
        }
        setLoading(false);
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
                        <h2 className="login-title">Welcome Back</h2>
                        <p className="login-subtitle">Sign in to access your insurance dashboard</p>

                        {successMsg && <div className="login-success">{successMsg}</div>}
                        {apiError && <div className="login-alert">{apiError}</div>}

                        <div className="form-group animate-field" style={{ animationDelay: '0.1s' }}>
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon">📧</span>
                                <input type="email" className="form-input login-input" placeholder="you@example.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
                            </div>
                            {errors.email && <div className="form-error">{errors.email}</div>}
                        </div>

                        <div className="form-group animate-field" style={{ animationDelay: '0.15s' }}>
                            <label>Password</label>
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
                        </div>

                        <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                            {loading ? <span className="spinner"></span> : '🚀 Sign In'}
                        </button>

                        <div className="demo-hint">
                            <strong>User:</strong> demo@insurance.com / demo123<br />
                            <strong>Admin:</strong> admin@insurance.com / admin123
                        </div>

                        <div className="login-switch">
                            Don't have an account?{' '}
                            <Link to="/register" className="switch-btn">Register</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
