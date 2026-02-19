import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const policyTypes = ['Life', 'Health', 'Auto', 'Home', 'Business', 'Travel', 'Cyber'];

export default function QuoteFormPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [declared, setDeclared] = useState(false);

    const [formData, setFormData] = useState({
        // Step 0: Personal Info
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        dob: '',
        gender: '',

        // Step 1: Insurance Type & Asset Details
        policyType: '',
        // Auto
        vehicleMake: '', vehicleModel: '', vehicleYear: '', vin: '',
        // Home
        propertyAddress: '', sqft: '', yearBuilt: '', roofAge: '', roofMaterial: '',
        // Business
        companyName: '', industryType: '', numEmployees: '',

        // Step 2: Risk Profile & History
        drivingRecord: 'clean',
        accidentsLast5: '0',
        priorClaims: 'no',
        priorClaimsCount: '0',
        tobaccoUse: 'no',

        // Step 3: Coverage Preferences
        coverageAmount: '',
        deductible: '5000',
        addOns: [],

        // Step 4: Existing Policy
        currentInsurer: '',
        policyExpiry: '',
    });
    const [errors, setErrors] = useState({});

    const updateField = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) setErrors({ ...errors, [field]: '' });
    };

    const toggleAddOn = (addon) => {
        const current = formData.addOns;
        if (current.includes(addon)) {
            updateField('addOns', current.filter(a => a !== addon));
        } else {
            updateField('addOns', [...current, addon]);
        }
    };

    const validateStep = () => {
        const errs = {};
        if (step === 0) {
            if (!formData.fullName.trim()) errs.fullName = 'Required';
            if (!formData.email.trim()) errs.email = 'Required';
            if (!formData.dob) errs.dob = 'Required';
            if (!formData.gender) errs.gender = 'Required';
        }
        if (step === 1) {
            if (!formData.policyType) errs.policyType = 'Select a type';
            if (formData.policyType === 'Auto') {
                if (!formData.vehicleMake.trim()) errs.vehicleMake = 'Required';
                if (!formData.vehicleModel.trim()) errs.vehicleModel = 'Required';
                if (!formData.vehicleYear) errs.vehicleYear = 'Required';
            }
            if (formData.policyType === 'Home') {
                if (!formData.propertyAddress.trim()) errs.propertyAddress = 'Required';
                if (!formData.sqft) errs.sqft = 'Required';
            }
            if (formData.policyType === 'Business') {
                if (!formData.companyName.trim()) errs.companyName = 'Required';
                if (!formData.industryType.trim()) errs.industryType = 'Required';
            }
        }
        if (step === 3) {
            if (!formData.coverageAmount || formData.coverageAmount < 100000) errs.coverageAmount = 'Min ₹1,00,000';
        }
        if (step === 4) {
            if (!declared) errs.declaration = 'You must confirm the declaration';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const nextStep = () => { if (!validateStep()) return; if (step < 5) setStep(step + 1); };
    const prevStep = () => { if (step > 0) setStep(step - 1); };

    const getAge = () => {
        if (!formData.dob) return 30;
        const birth = new Date(formData.dob);
        const diff = Date.now() - birth.getTime();
        return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    };

    const generateQuotes = () => {
        const age = getAge();
        const base = Number(formData.coverageAmount) || 500000;
        const type = formData.policyType;
        const tobacco = formData.tobaccoUse !== 'no' ? 1.3 : 1;
        const claims = formData.priorClaims === 'yes' ? 1.2 : 1;
        const driving = formData.drivingRecord === 'major' ? 1.4 : formData.drivingRecord === 'minor' ? 1.15 : 1;
        const deductMult = Number(formData.deductible) >= 10000 ? 0.85 : Number(formData.deductible) >= 5000 ? 0.92 : 1;
        const ageMult = age > 50 ? 1.4 : age > 40 ? 1.2 : age > 30 ? 1.05 : 1;

        const tiers = [
            { name: `${type} Essential`, tier: 'Basic', mult: 0.75, desc: `Affordable ${type.toLowerCase()} coverage with essential protections.` },
            { name: `${type} Shield Plus`, tier: 'Standard', mult: 1.0, desc: `Comprehensive ${type.toLowerCase()} plan with balanced coverage and value.` },
            { name: `${type} Premium Guard`, tier: 'Premium', mult: 1.35, desc: `Top-tier ${type.toLowerCase()} protection with maximum benefits and add-ons.` },
            { name: `${type} Elite 360`, tier: 'Elite', mult: 1.7, desc: `All-inclusive ${type.toLowerCase()} coverage with concierge-level service.` },
        ];

        const rateMap = { Life: 0.018, Health: 0.025, Auto: 0.035, Home: 0.012, Business: 0.03, Travel: 0.04, Cyber: 0.028 };
        const rate = rateMap[type] || 0.025;

        return tiers.map((t, i) => {
            const annual = Math.round(base * rate * t.mult * tobacco * claims * driving * deductMult * ageMult);
            const original = Math.round(annual * 1.15);
            const benefits = [
                `₹${(base * t.mult).toLocaleString('en-IN')} coverage`,
                `₹${Number(formData.deductible).toLocaleString('en-IN')} deductible`,
                t.tier === 'Basic' ? 'Standard claim processing' : 'Priority claim processing',
                t.tier === 'Premium' || t.tier === 'Elite' ? '24/7 dedicated support' : 'Business hours support',
                ...formData.addOns.slice(0, t.tier === 'Elite' ? 4 : t.tier === 'Premium' ? 3 : t.tier === 'Standard' ? 2 : 1),
            ];
            return {
                id: `Q-${Date.now()}-${i}`,
                name: t.name,
                tier: t.tier,
                description: t.desc,
                annualPremium: annual,
                monthlyPremium: Math.round(annual / 12),
                originalPrice: original,
                savings: original - annual,
                coverage: Math.round(base * t.mult),
                benefits,
                bestValue: i === 1,
            };
        });
    };

    const handleSubmit = () => {
        setLoading(true);
        setTimeout(() => {
            const quotes = generateQuotes();
            const summary = {
                applicant: formData.fullName,
                age: getAge(),
                type: formData.policyType,
                requestedCoverage: Number(formData.coverageAmount),
                quotesGenerated: quotes.length,
            };
            navigate('/quote-results', { state: { quotes, summary, formData } });
            setLoading(false);
        }, 800);
    };

    const formatCurrency = (val) => '₹' + Number(val).toLocaleString('en-IN');
    const stepLabels = ['Personal Info', 'Asset Details', 'Risk Profile', 'Coverage', 'Existing Policy', 'Review'];

    const typeIcons = { Life: '❤️', Health: '🏥', Auto: '🚗', Home: '🏠', Business: '🏢', Travel: '✈️', Cyber: '🔒' };
    const addOnOptions = {
        Auto: ['Roadside Assistance', 'Rental Car Coverage', 'Gap Insurance', 'Custom Parts Coverage'],
        Home: ['Flood Coverage', 'Earthquake Coverage', 'Sewer Backup', 'Home Office Coverage'],
        Life: ['Accidental Death Rider', 'Critical Illness Rider', 'Waiver of Premium', 'Term Conversion'],
        Health: ['Maternity Coverage', 'Dental & Vision', 'International Coverage', 'Alternative Medicine'],
        Business: ['Cyber Liability', 'Equipment Breakdown', 'Business Interruption', 'Professional Liability'],
        Travel: ['Cancel for Any Reason', 'Adventure Sports', 'Rental Car Protection', 'Flight Delay'],
        Cyber: ['Identity Theft Recovery', 'Privacy Breach Notifications', 'Cyber Extortion', 'Data Recovery'],
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>📝 Get Insurance Quote</h1>
                    <p>Complete this form for a personalized insurance quote. All information stays confidential.</p>
                </div>

                <div className="quote-form-layout">
                    {/* Progress Steps */}
                    <div className="quote-stepper-wide">
                        {stepLabels.map((label, i) => (
                            <div key={label} className={`quote-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                                <div className="quote-step-circle">{i < step ? '✓' : i + 1}</div>
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* ===== STEP 0: Personal Info ===== */}
                    {step === 0 && (
                        <div className="glass-card quote-card animate-scaleIn">
                            <h2>👤 Personal Information</h2>
                            <p className="card-hint">Basic details about yourself.</p>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input type="text" className="form-input" placeholder="Your full name" value={formData.fullName} onChange={(e) => updateField('fullName', e.target.value)} />
                                    {errors.fullName && <div className="form-error">{errors.fullName}</div>}
                                </div>
                                <div className="form-group">
                                    <label>Date of Birth *</label>
                                    <input type="date" className="form-input" value={formData.dob} onChange={(e) => updateField('dob', e.target.value)} />
                                    {errors.dob && <div className="form-error">{errors.dob}</div>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Gender *</label>
                                    <select className="form-input" value={formData.gender} onChange={(e) => updateField('gender', e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.gender && <div className="form-error">{errors.gender}</div>}
                                </div>
                                <div className="form-group">
                                    <label>Email Address *</label>
                                    <input type="email" className="form-input" placeholder="you@example.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
                                    {errors.email && <div className="form-error">{errors.email}</div>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" className="form-input" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
                            </div>

                            <div className="form-actions">
                                <div></div>
                                <button className="btn btn-primary" onClick={nextStep}>Next: Asset Details →</button>
                            </div>
                        </div>
                    )}

                    {/* ===== STEP 1: Insurance Type & Asset Details ===== */}
                    {step === 1 && (
                        <div className="glass-card quote-card animate-scaleIn">
                            <h2>🏷️ Insurance Type & Asset Details</h2>
                            <p className="card-hint">Select your insurance type and provide details about the asset you want covered.</p>

                            <div className="form-group">
                                <label>Insurance Type *</label>
                                <div className="type-selector">
                                    {policyTypes.map(type => (
                                        <button key={type} type="button"
                                            className={`type-chip ${formData.policyType === type ? 'selected' : ''}`}
                                            onClick={() => updateField('policyType', type)}>
                                            {typeIcons[type]} {type}
                                        </button>
                                    ))}
                                </div>
                                {errors.policyType && <div className="form-error">{errors.policyType}</div>}
                            </div>

                            {/* Auto fields */}
                            {formData.policyType === 'Auto' && (
                                <div className="asset-section animate-scaleIn">
                                    <h3 className="asset-section-title">🚗 Vehicle Details</h3>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Vehicle Make *</label>
                                            <input type="text" className="form-input" placeholder="e.g. Toyota" value={formData.vehicleMake} onChange={(e) => updateField('vehicleMake', e.target.value)} />
                                            {errors.vehicleMake && <div className="form-error">{errors.vehicleMake}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label>Vehicle Model *</label>
                                            <input type="text" className="form-input" placeholder="e.g. Camry" value={formData.vehicleModel} onChange={(e) => updateField('vehicleModel', e.target.value)} />
                                            {errors.vehicleModel && <div className="form-error">{errors.vehicleModel}</div>}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Year of Manufacture *</label>
                                            <input type="number" className="form-input" placeholder="e.g. 2022" min="1990" max="2026" value={formData.vehicleYear} onChange={(e) => updateField('vehicleYear', e.target.value)} />
                                            {errors.vehicleYear && <div className="form-error">{errors.vehicleYear}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label>VIN (Vehicle Identification Number)</label>
                                            <input type="text" className="form-input" placeholder="e.g. 1HGBH41JXMN109186" value={formData.vin} onChange={(e) => updateField('vin', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Home fields */}
                            {formData.policyType === 'Home' && (
                                <div className="asset-section animate-scaleIn">
                                    <h3 className="asset-section-title">🏠 Property Details</h3>
                                    <div className="form-group">
                                        <label>Property Address *</label>
                                        <input type="text" className="form-input" placeholder="Full property address" value={formData.propertyAddress} onChange={(e) => updateField('propertyAddress', e.target.value)} />
                                        {errors.propertyAddress && <div className="form-error">{errors.propertyAddress}</div>}
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Square Footage *</label>
                                            <input type="number" className="form-input" placeholder="e.g. 1500" value={formData.sqft} onChange={(e) => updateField('sqft', e.target.value)} />
                                            {errors.sqft && <div className="form-error">{errors.sqft}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label>Year Built</label>
                                            <input type="number" className="form-input" placeholder="e.g. 2005" min="1900" max="2026" value={formData.yearBuilt} onChange={(e) => updateField('yearBuilt', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Roof Age (years)</label>
                                            <input type="number" className="form-input" placeholder="e.g. 8" min="0" max="100" value={formData.roofAge} onChange={(e) => updateField('roofAge', e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label>Roof Material</label>
                                            <select className="form-input" value={formData.roofMaterial} onChange={(e) => updateField('roofMaterial', e.target.value)}>
                                                <option value="">Select material</option>
                                                <option value="asphalt">Asphalt Shingles</option>
                                                <option value="metal">Metal</option>
                                                <option value="tile">Tile</option>
                                                <option value="slate">Slate</option>
                                                <option value="concrete">Concrete</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Business fields */}
                            {formData.policyType === 'Business' && (
                                <div className="asset-section animate-scaleIn">
                                    <h3 className="asset-section-title">🏢 Business Details</h3>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Company Name *</label>
                                            <input type="text" className="form-input" placeholder="Your company name" value={formData.companyName} onChange={(e) => updateField('companyName', e.target.value)} />
                                            {errors.companyName && <div className="form-error">{errors.companyName}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label>Industry Type *</label>
                                            <input type="text" className="form-input" placeholder="e.g. Technology, Retail" value={formData.industryType} onChange={(e) => updateField('industryType', e.target.value)} />
                                            {errors.industryType && <div className="form-error">{errors.industryType}</div>}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Number of Employees</label>
                                        <select className="form-input" value={formData.numEmployees} onChange={(e) => updateField('numEmployees', e.target.value)}>
                                            <option value="">Select</option>
                                            <option value="1-10">1-10</option>
                                            <option value="11-50">11-50</option>
                                            <option value="51-200">51-200</option>
                                            <option value="201-500">201-500</option>
                                            <option value="500+">500+</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Message for types without specific asset fields */}
                            {['Life', 'Health', 'Travel', 'Cyber'].includes(formData.policyType) && (
                                <div className="asset-section animate-scaleIn" style={{ textAlign: 'center', padding: '28px' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{typeIcons[formData.policyType]}</div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                        <strong>{formData.policyType} Insurance</strong> selected. No additional asset details needed — we'll customize your quote based on your risk profile and coverage preferences.
                                    </p>
                                </div>
                            )}

                            <div className="form-actions">
                                <button className="btn btn-secondary" onClick={prevStep}>← Back</button>
                                <button className="btn btn-primary" onClick={nextStep}>Next: Risk Profile →</button>
                            </div>
                        </div>
                    )}

                    {/* ===== STEP 2: Risk Profile & History ===== */}
                    {step === 2 && (
                        <div className="glass-card quote-card animate-scaleIn">
                            <h2>📋 Risk Profile & History</h2>
                            <p className="card-hint">Help us assess your risk level for accurate pricing.</p>

                            {['Auto'].includes(formData.policyType) && (
                                <div className="risk-section">
                                    <h3 className="asset-section-title">🚗 Driving Record</h3>
                                    <div className="form-group">
                                        <label>Driving Record</label>
                                        <div className="toggle-group">
                                            <button type="button" className={`toggle-btn ${formData.drivingRecord === 'clean' ? 'active' : ''}`} onClick={() => updateField('drivingRecord', 'clean')}>✅ Clean</button>
                                            <button type="button" className={`toggle-btn ${formData.drivingRecord === 'minor' ? 'active' : ''}`} onClick={() => updateField('drivingRecord', 'minor')}>⚠️ Minor Incidents</button>
                                            <button type="button" className={`toggle-btn ${formData.drivingRecord === 'major' ? 'active' : ''}`} onClick={() => updateField('drivingRecord', 'major')}>🚨 Major Incidents</button>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Accidents/Tickets in Last 5 Years</label>
                                        <select className="form-input" value={formData.accidentsLast5} onChange={(e) => updateField('accidentsLast5', e.target.value)}>
                                            <option value="0">None</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3+">3 or more</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Prior Insurance Claims</label>
                                <div className="toggle-group">
                                    <button type="button" className={`toggle-btn ${formData.priorClaims === 'no' ? 'active' : ''}`} onClick={() => updateField('priorClaims', 'no')}>No Prior Claims</button>
                                    <button type="button" className={`toggle-btn ${formData.priorClaims === 'yes' ? 'active' : ''}`} onClick={() => updateField('priorClaims', 'yes')}>Yes, I Have Claims</button>
                                </div>
                            </div>

                            {formData.priorClaims === 'yes' && (
                                <div className="form-group animate-scaleIn">
                                    <label>Number of Prior Claims</label>
                                    <select className="form-input" value={formData.priorClaimsCount} onChange={(e) => updateField('priorClaimsCount', e.target.value)}>
                                        <option value="1">1 claim</option>
                                        <option value="2">2 claims</option>
                                        <option value="3+">3 or more</option>
                                    </select>
                                </div>
                            )}

                            {['Life', 'Health'].includes(formData.policyType) && (
                                <div className="risk-section">
                                    <h3 className="asset-section-title">🏥 Health & Lifestyle</h3>
                                    <div className="form-group">
                                        <label>Tobacco Use</label>
                                        <div className="toggle-group">
                                            <button type="button" className={`toggle-btn ${formData.tobaccoUse === 'no' ? 'active' : ''}`} onClick={() => updateField('tobaccoUse', 'no')}>🚭 Non-User</button>
                                            <button type="button" className={`toggle-btn ${formData.tobaccoUse === 'occasional' ? 'active' : ''}`} onClick={() => updateField('tobaccoUse', 'occasional')}>🔄 Occasional</button>
                                            <button type="button" className={`toggle-btn ${formData.tobaccoUse === 'regular' ? 'active' : ''}`} onClick={() => updateField('tobaccoUse', 'regular')}>🚬 Regular</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="form-actions">
                                <button className="btn btn-secondary" onClick={prevStep}>← Back</button>
                                <button className="btn btn-primary" onClick={nextStep}>Next: Coverage →</button>
                            </div>
                        </div>
                    )}

                    {/* ===== STEP 3: Coverage Preferences ===== */}
                    {step === 3 && (
                        <div className="glass-card quote-card animate-scaleIn">
                            <h2>🛡️ Coverage Preferences</h2>
                            <p className="card-hint">Choose your desired coverage limits and optional add-ons.</p>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Desired Coverage Amount (₹) *</label>
                                    <input type="number" className="form-input" placeholder="e.g. 1000000" min="100000" value={formData.coverageAmount} onChange={(e) => updateField('coverageAmount', e.target.value)} />
                                    {errors.coverageAmount && <div className="form-error">{errors.coverageAmount}</div>}
                                </div>
                                <div className="form-group">
                                    <label>Deductible Amount (₹)</label>
                                    <select className="form-input" value={formData.deductible} onChange={(e) => updateField('deductible', e.target.value)}>
                                        <option value="1000">₹1,000 (Lower out-of-pocket)</option>
                                        <option value="2500">₹2,500</option>
                                        <option value="5000">₹5,000 (Balanced)</option>
                                        <option value="10000">₹10,000</option>
                                        <option value="25000">₹25,000 (Lower premium)</option>
                                    </select>
                                </div>
                            </div>

                            {formData.policyType && addOnOptions[formData.policyType] && (
                                <div className="form-group">
                                    <label>Optional Add-Ons</label>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '12px' }}>Select any additional coverage options you'd like.</p>
                                    <div className="addon-grid">
                                        {addOnOptions[formData.policyType].map(addon => (
                                            <button key={addon} type="button"
                                                className={`addon-chip ${formData.addOns.includes(addon) ? 'selected' : ''}`}
                                                onClick={() => toggleAddOn(addon)}>
                                                <span className="addon-check">{formData.addOns.includes(addon) ? '✓' : '+'}</span>
                                                {addon}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="form-actions">
                                <button className="btn btn-secondary" onClick={prevStep}>← Back</button>
                                <button className="btn btn-primary" onClick={nextStep}>Next: Existing Policy →</button>
                            </div>
                        </div>
                    )}

                    {/* ===== STEP 4: Existing Policy & Declaration ===== */}
                    {step === 4 && (
                        <div className="glass-card quote-card animate-scaleIn">
                            <h2>📄 Existing Policy & Declaration</h2>
                            <p className="card-hint">Provide your current policy details (if any) and confirm your submission.</p>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Current Insurer</label>
                                    <input type="text" className="form-input" placeholder="e.g. LIC, HDFC Ergo, ICICI Lombard" value={formData.currentInsurer} onChange={(e) => updateField('currentInsurer', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Policy Expiration Date</label>
                                    <input type="date" className="form-input" value={formData.policyExpiry} onChange={(e) => updateField('policyExpiry', e.target.value)} />
                                </div>
                            </div>

                            <div className="declaration-box">
                                <label className="declaration-label">
                                    <input
                                        type="checkbox"
                                        checked={declared}
                                        onChange={(e) => { setDeclared(e.target.checked); if (errors.declaration) setErrors({ ...errors, declaration: '' }); }}
                                        className="declaration-checkbox"
                                    />
                                    <span className="declaration-checkmark"></span>
                                    <span>
                                        I declare that the information provided above is <strong>accurate and complete</strong> to the best of my knowledge. I understand that providing false or misleading information may result in the denial of a claim or cancellation of the policy.
                                    </span>
                                </label>
                                {errors.declaration && <div className="form-error" style={{ marginTop: '8px' }}>{errors.declaration}</div>}
                            </div>

                            <div className="form-actions">
                                <button className="btn btn-secondary" onClick={prevStep}>← Back</button>
                                <button className="btn btn-primary" onClick={nextStep}>Review Summary →</button>
                            </div>
                        </div>
                    )}

                    {/* ===== STEP 5: Review & Submit ===== */}
                    {step === 5 && (
                        <div className="glass-card quote-card animate-scaleIn">
                            <h2>📋 Review & Generate Quote</h2>
                            <p className="card-hint">Confirm all your details below, then generate your personalized quotes.</p>

                            <div className="review-grid-3col">
                                <div className="review-section">
                                    <h3>Personal Details</h3>
                                    <div className="review-row"><span>Name</span><strong>{formData.fullName}</strong></div>
                                    <div className="review-row"><span>DOB</span><strong>{formData.dob || '—'}</strong></div>
                                    <div className="review-row"><span>Gender</span><strong style={{ textTransform: 'capitalize' }}>{formData.gender || '—'}</strong></div>
                                    <div className="review-row"><span>Email</span><strong>{formData.email}</strong></div>
                                    <div className="review-row"><span>Phone</span><strong>{formData.phone || '—'}</strong></div>
                                </div>

                                <div className="review-section">
                                    <h3>Insurance Type</h3>
                                    <div className="review-row"><span>Type</span><strong>{typeIcons[formData.policyType]} {formData.policyType}</strong></div>
                                    {formData.policyType === 'Auto' && (<>
                                        <div className="review-row"><span>Vehicle</span><strong>{formData.vehicleMake} {formData.vehicleModel} ({formData.vehicleYear})</strong></div>
                                        {formData.vin && <div className="review-row"><span>VIN</span><strong>{formData.vin}</strong></div>}
                                    </>)}
                                    {formData.policyType === 'Home' && (<>
                                        <div className="review-row"><span>Address</span><strong>{formData.propertyAddress}</strong></div>
                                        <div className="review-row"><span>Sq Ft</span><strong>{formData.sqft}</strong></div>
                                        {formData.yearBuilt && <div className="review-row"><span>Built</span><strong>{formData.yearBuilt}</strong></div>}
                                    </>)}
                                    {formData.policyType === 'Business' && (<>
                                        <div className="review-row"><span>Company</span><strong>{formData.companyName}</strong></div>
                                        <div className="review-row"><span>Industry</span><strong>{formData.industryType}</strong></div>
                                        {formData.numEmployees && <div className="review-row"><span>Employees</span><strong>{formData.numEmployees}</strong></div>}
                                    </>)}
                                </div>

                                <div className="review-section">
                                    <h3>Risk & Coverage</h3>
                                    {formData.policyType === 'Auto' && <div className="review-row"><span>Driving</span><strong style={{ textTransform: 'capitalize' }}>{formData.drivingRecord}</strong></div>}
                                    <div className="review-row"><span>Prior Claims</span><strong>{formData.priorClaims === 'yes' ? `Yes (${formData.priorClaimsCount})` : 'No'}</strong></div>
                                    {['Life', 'Health'].includes(formData.policyType) && <div className="review-row"><span>Tobacco</span><strong style={{ textTransform: 'capitalize' }}>{formData.tobaccoUse}</strong></div>}
                                    <div className="review-row"><span>Coverage</span><strong>{formatCurrency(formData.coverageAmount)}</strong></div>
                                    <div className="review-row"><span>Deductible</span><strong>{formatCurrency(formData.deductible)}</strong></div>
                                    {formData.addOns.length > 0 && <div className="review-row"><span>Add-Ons</span><strong>{formData.addOns.length} selected</strong></div>}
                                    {formData.currentInsurer && <div className="review-row"><span>Insurer</span><strong>{formData.currentInsurer}</strong></div>}
                                </div>
                            </div>

                            {formData.addOns.length > 0 && (
                                <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {formData.addOns.map(a => <span key={a} className="badge badge-teal" style={{ fontSize: '0.72rem' }}>{a}</span>)}
                                </div>
                            )}

                            <div className="form-actions" style={{ marginTop: '28px' }}>
                                <button className="btn btn-secondary" onClick={prevStep}>← Back</button>
                                <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading}>
                                    {loading ? <span className="spinner"></span> : '⚡ Generate My Quotes'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
