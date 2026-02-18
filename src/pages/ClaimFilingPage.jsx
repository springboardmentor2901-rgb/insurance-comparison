import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClaims } from '../context/ClaimsContext';

const steps = ['Personal Info', 'Claim Details', 'Upload & Submit'];

export default function ClaimFilingPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [claimId, setClaimId] = useState('');
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { addClaim } = useClaims();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        policyNumber: '',
        claimType: '',
        incidentDate: '',
        description: '',
        files: []
    });

    const [errors, setErrors] = useState({});

    const updateField = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) setErrors({ ...errors, [field]: '' });
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files).map(f => ({
            name: f.name,
            size: (f.size / 1024).toFixed(1) + ' KB'
        }));
        setFormData({ ...formData, files: [...formData.files, ...newFiles] });
    };

    const removeFile = (index) => {
        setFormData({
            ...formData,
            files: formData.files.filter((_, i) => i !== index)
        });
    };

    const validateStep = (step) => {
        const newErrors = {};
        if (step === 0) {
            if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
            if (!formData.email.trim()) newErrors.email = 'Email is required';
            if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
            if (!formData.policyNumber.trim()) newErrors.policyNumber = 'Policy number is required';
        }
        if (step === 1) {
            if (!formData.claimType) newErrors.claimType = 'Claim type is required';
            if (!formData.incidentDate) newErrors.incidentDate = 'Incident date is required';
            if (!formData.description.trim()) newErrors.description = 'Description is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (!validateStep(currentStep)) return;
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = () => {
        const newClaimId = addClaim(formData);
        setClaimId(newClaimId);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="page">
                <div className="container">
                    <div className="claim-filing-layout">
                        <div className="glass-card success-card">
                            <div className="success-icon">🎉</div>
                            <h2>Claim Filed Successfully!</h2>
                            <p style={{ marginBottom: '8px' }}>
                                Your claim has been submitted and is now being processed. You will receive updates via email at <strong>{formData.email}</strong>.
                            </p>
                            <p style={{ color: 'var(--accent-teal)', fontWeight: 600, fontSize: '1.2rem', marginBottom: '8px' }}>
                                Claim ID: {claimId}
                            </p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '28px' }}>
                                Save this ID to track your claim status anytime.
                            </p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Link to="/track-claim" className="btn btn-primary">
                                    📊 Track Your Claim →
                                </Link>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setSubmitted(false);
                                        setCurrentStep(0);
                                        setClaimId('');
                                        setErrors({});
                                        setFormData({
                                            fullName: '', email: '', phone: '', policyNumber: '',
                                            claimType: '', incidentDate: '', description: '', files: []
                                        });
                                    }}
                                >
                                    📋 File Another Claim
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>📋 File a Claim</h1>
                    <p>Submit your insurance claim with our guided step-by-step process.</p>
                </div>

                <div className="claim-filing-layout">
                    {/* Stepper */}
                    <div className="stepper">
                        {steps.map((step, index) => (
                            <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                                <div className={`step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}>
                                    <div className="step-number">
                                        {index < currentStep ? '✓' : index + 1}
                                    </div>
                                    <span className="step-label">{step}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`step-connector ${index < currentStep ? 'filled' : ''}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Step 1: Personal Info */}
                    {currentStep === 0 && (
                        <div className="glass-card step-form-card">
                            <h2>👤 Personal Information</h2>
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={(e) => updateField('fullName', e.target.value)}
                                />
                                {errors.fullName && <div className="form-error">{errors.fullName}</div>}
                            </div>
                            <div className="form-group">
                                <label>Email Address *</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="email@example.com"
                                    value={formData.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                />
                                {errors.email && <div className="form-error">{errors.email}</div>}
                            </div>
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    placeholder="+91 XXXXX XXXXX"
                                    value={formData.phone}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                />
                                {errors.phone && <div className="form-error">{errors.phone}</div>}
                            </div>
                            <div className="form-group">
                                <label>Policy Number *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. POL-2024-HG-4521"
                                    value={formData.policyNumber}
                                    onChange={(e) => updateField('policyNumber', e.target.value)}
                                />
                                {errors.policyNumber && <div className="form-error">{errors.policyNumber}</div>}
                            </div>
                            <div className="form-actions">
                                <div></div>
                                <button className="btn btn-primary" onClick={nextStep}>
                                    Next: Claim Details →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Claim Details */}
                    {currentStep === 1 && (
                        <div className="glass-card step-form-card">
                            <h2>📝 Claim Details</h2>
                            <div className="form-group">
                                <label>Claim Type *</label>
                                <select
                                    className="form-input"
                                    value={formData.claimType}
                                    onChange={(e) => updateField('claimType', e.target.value)}
                                >
                                    <option value="">Select claim type</option>
                                    <option value="hospitalization">Hospitalization</option>
                                    <option value="accident">Accident</option>
                                    <option value="property-damage">Property Damage</option>
                                    <option value="theft">Theft/Burglary</option>
                                    <option value="death-benefit">Death Benefit</option>
                                    <option value="cyber-fraud">Cyber Fraud</option>
                                    <option value="travel-emergency">Travel Emergency</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.claimType && <div className="form-error">{errors.claimType}</div>}
                            </div>
                            <div className="form-group">
                                <label>Date of Incident *</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={formData.incidentDate}
                                    onChange={(e) => updateField('incidentDate', e.target.value)}
                                />
                                {errors.incidentDate && <div className="form-error">{errors.incidentDate}</div>}
                            </div>
                            <div className="form-group">
                                <label>Description of Incident *</label>
                                <textarea
                                    className="form-input"
                                    rows="5"
                                    placeholder="Describe what happened in detail..."
                                    value={formData.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    style={{ resize: 'vertical' }}
                                />
                                {errors.description && <div className="form-error">{errors.description}</div>}
                            </div>
                            <div className="form-actions">
                                <button className="btn btn-secondary" onClick={prevStep}>
                                    ← Back
                                </button>
                                <button className="btn btn-primary" onClick={nextStep}>
                                    Next: Upload Documents →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Upload & Submit */}
                    {currentStep === 2 && (
                        <div className="glass-card step-form-card">
                            <h2>📎 Upload Documents & Submit</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
                                Upload relevant documents such as medical reports, bills, FIR, or photographs.
                            </p>

                            <div
                                className="file-upload-zone"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="icon">📁</div>
                                <p>Click to upload or drag & drop files here</p>
                                <p className="hint">Supports: PDF, JPG, PNG, DOC (Max 10MB each)</p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                multiple
                                style={{ display: 'none' }}
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            />

                            {formData.files.length > 0 && (
                                <div className="uploaded-files">
                                    {formData.files.map((file, index) => (
                                        <div key={index} className="uploaded-file">
                                            <span>📄 {file.name} ({file.size})</span>
                                            <button className="remove-btn" onClick={() => removeFile(index)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Summary */}
                            <div style={{ marginTop: '24px', padding: '20px', background: 'rgba(45, 212, 191, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(45, 212, 191, 0.15)' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px', color: 'var(--accent-teal)' }}>
                                    📋 Claim Summary
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Name:</span>
                                    <span>{formData.fullName || '—'}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                                    <span>{formData.email || '—'}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                                    <span>{formData.phone || '—'}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>Policy:</span>
                                    <span>{formData.policyNumber || '—'}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>Claim Type:</span>
                                    <span style={{ textTransform: 'capitalize' }}>{formData.claimType?.replace('-', ' ') || '—'}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>Incident Date:</span>
                                    <span>{formData.incidentDate || '—'}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>Documents:</span>
                                    <span>{formData.files.length} file(s)</span>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button className="btn btn-secondary" onClick={prevStep}>
                                    ← Back
                                </button>
                                <button className="btn btn-primary" onClick={handleSubmit}>
                                    ✅ Submit Claim
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
