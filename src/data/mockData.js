export const policies = [
    // ===== LIFE INSURANCE =====
    {
        id: 1,
        name: 'SecureLife Basic',
        type: 'Life',
        coverage: 500000,
        premium: 3200,
        duration: 10,
        rating: 4.2,
        benefits: [
            'Death benefit coverage',
            'Terminal illness benefit',
            'Free annual health check-up',
            'Tax benefits under Section 80C'
        ],
        description: 'Affordable life insurance for young professionals starting their financial journey.'
    },
    {
        id: 2,
        name: 'TermMax 50',
        type: 'Life',
        coverage: 5000000,
        premium: 6800,
        duration: 30,
        rating: 4.7,
        benefits: [
            'High sum assured at low premium',
            'Accidental death benefit rider',
            'Critical illness cover add-on',
            'Premium waiver on disability',
            'Flexible payout options'
        ],
        description: 'High coverage term plan designed for long-term family financial security.'
    },
    {
        id: 3,
        name: 'LifeShield Gold',
        type: 'Life',
        coverage: 2000000,
        premium: 5400,
        duration: 20,
        rating: 4.5,
        benefits: [
            'Guaranteed death benefit',
            'Maturity bonus payout',
            'Loan against policy',
            'Tax-free returns under 10(10D)',
            'Whole life coverage option'
        ],
        description: 'Balanced life plan with maturity benefits and loan facility for mid-career professionals.'
    },
    {
        id: 4,
        name: 'PureProtect Term',
        type: 'Life',
        coverage: 10000000,
        premium: 9500,
        duration: 25,
        rating: 4.8,
        benefits: [
            '₹1 Crore coverage at low cost',
            'Income replacement benefit',
            'Terminal illness lump sum',
            'Spouse coverage rider',
            'Premium return option available'
        ],
        description: 'Maximum protection term plan for high-income earners seeking ₹1Cr+ coverage.'
    },

    // ===== HEALTH INSURANCE =====
    {
        id: 5,
        name: 'HealthGuard Pro',
        type: 'Health',
        coverage: 1000000,
        premium: 8500,
        duration: 1,
        rating: 4.6,
        benefits: [
            'Cashless hospitalization at 5000+ hospitals',
            'Pre & post hospitalization cover',
            'Day care procedures covered',
            'No room rent capping',
            'Annual health check-up'
        ],
        description: 'Comprehensive health coverage with wide hospital network and zero copay.'
    },
    {
        id: 6,
        name: 'FamilyFirst Plus',
        type: 'Health',
        coverage: 2500000,
        premium: 18000,
        duration: 1,
        rating: 4.8,
        benefits: [
            'Family floater coverage (up to 6 members)',
            'Maternity & newborn cover',
            'AYUSH treatment covered',
            'Restoration of sum insured',
            'International emergency cover',
            'Mental health coverage'
        ],
        description: 'Premium family health plan with maternity benefits and global emergency coverage.'
    },
    {
        id: 7,
        name: 'MediCare Lite',
        type: 'Health',
        coverage: 300000,
        premium: 3800,
        duration: 1,
        rating: 4.0,
        benefits: [
            'Basic hospitalization cover',
            'Ambulance charges covered',
            'Pre-existing illness after 3 years',
            'Day care procedures'
        ],
        description: 'Budget-friendly health plan for individuals seeking essential hospitalization coverage.'
    },
    {
        id: 8,
        name: 'HealthMax Super',
        type: 'Health',
        coverage: 5000000,
        premium: 24000,
        duration: 1,
        rating: 4.9,
        benefits: [
            '₹50 Lakh coverage with no sub-limits',
            'Worldwide treatment coverage',
            'Organ donor expenses',
            'Air ambulance cover',
            'Unlimited restoration',
            'Second medical opinion',
            'Mental health & wellness cover'
        ],
        description: 'Ultra-premium health plan with global coverage, air ambulance, and unlimited restoration.'
    },

    // ===== AUTO INSURANCE =====
    {
        id: 9,
        name: 'AutoShield Premium',
        type: 'Auto',
        coverage: 750000,
        premium: 12000,
        duration: 1,
        rating: 4.4,
        benefits: [
            'Own damage cover',
            'Third-party liability',
            'Personal accident cover',
            'Roadside assistance 24/7',
            'Zero depreciation add-on'
        ],
        description: 'All-round vehicle protection with zero depreciation and roadside assistance.'
    },
    {
        id: 10,
        name: 'DriveSafe Basic',
        type: 'Auto',
        coverage: 300000,
        premium: 4500,
        duration: 1,
        rating: 3.9,
        benefits: [
            'Third-party liability cover',
            'Personal accident cover ₹15L',
            'Legal liability to paid driver',
            'Basic own damage (fire & theft)'
        ],
        description: 'Essential third-party motor insurance with basic own damage for budget-conscious drivers.'
    },
    {
        id: 11,
        name: 'AutoElite 360',
        type: 'Auto',
        coverage: 1500000,
        premium: 18500,
        duration: 1,
        rating: 4.7,
        benefits: [
            'Bumper-to-bumper coverage',
            'Engine & gearbox protection',
            'Consumables cover',
            'Key replacement',
            'Tyre damage cover',
            'Return to invoice',
            'NCB protection'
        ],
        description: 'Comprehensive luxury vehicle plan with engine protect, consumables, and return-to-invoice.'
    },
    {
        id: 12,
        name: 'TwoWheeler Guard',
        type: 'Auto',
        coverage: 150000,
        premium: 2200,
        duration: 1,
        rating: 4.2,
        benefits: [
            'Comprehensive own damage',
            'Third-party coverage',
            'Personal accident cover',
            'Theft protection',
            'Natural calamity cover'
        ],
        description: 'Complete two-wheeler protection plan at affordable premiums with theft and damage cover.'
    },

    // ===== PROPERTY INSURANCE =====
    {
        id: 13,
        name: 'HomeSafe 360',
        type: 'Property',
        coverage: 3000000,
        premium: 4500,
        duration: 5,
        rating: 4.3,
        benefits: [
            'Structure & content coverage',
            'Natural disaster protection',
            'Theft & burglary cover',
            'Temporary accommodation',
            'Third-party liability'
        ],
        description: 'Complete home protection covering structure, contents, and natural disasters.'
    },
    {
        id: 14,
        name: 'PropertyGuard Basic',
        type: 'Property',
        coverage: 1000000,
        premium: 1800,
        duration: 3,
        rating: 4.0,
        benefits: [
            'Fire & explosion cover',
            'Storm & flood damage',
            'Burglary protection',
            'Electrical breakdown cover'
        ],
        description: 'Basic property protection plan for apartment owners covering fire, flood, and theft.'
    },
    {
        id: 15,
        name: 'EstateShield Premium',
        type: 'Property',
        coverage: 10000000,
        premium: 12000,
        duration: 10,
        rating: 4.6,
        benefits: [
            'Full structure replacement cost',
            'Valuable items special cover',
            'Landscaping & outdoor structures',
            'Earthquake & landslide cover',
            'Loss of rent compensation',
            'Domestic worker liability'
        ],
        description: 'Premium estate protection plan with full replacement cost and valuable items coverage.'
    },

    // ===== TRAVEL INSURANCE =====
    {
        id: 16,
        name: 'TravelEase Global',
        type: 'Travel',
        coverage: 2000000,
        premium: 1500,
        duration: 1,
        rating: 4.5,
        benefits: [
            'Medical emergency abroad',
            'Trip cancellation cover',
            'Lost baggage compensation',
            'Flight delay allowance',
            'Adventure sports cover'
        ],
        description: 'Global travel insurance with medical, cancellation, and adventure sports coverage.'
    },
    {
        id: 17,
        name: 'DomesticTrip Lite',
        type: 'Travel',
        coverage: 500000,
        premium: 450,
        duration: 1,
        rating: 4.1,
        benefits: [
            'Domestic trip medical cover',
            'Trip cancellation refund',
            'Baggage delay compensation',
            'Hotel extension cover'
        ],
        description: 'Affordable domestic travel insurance for weekend getaways and short trips within India.'
    },
    {
        id: 18,
        name: 'FrequentFlyer Pro',
        type: 'Travel',
        coverage: 5000000,
        premium: 6500,
        duration: 1,
        rating: 4.7,
        benefits: [
            'Multi-trip annual coverage',
            'Business equipment protection',
            'Emergency evacuation & repatriation',
            'Passport loss assistance',
            'Hijack distress allowance',
            'Personal liability cover abroad'
        ],
        description: 'Annual multi-trip plan for frequent travelers with premium benefits and global assistance.'
    },

    // ===== CYBER INSURANCE =====
    {
        id: 19,
        name: 'CyberGuard Elite',
        type: 'Cyber',
        coverage: 1000000,
        premium: 2200,
        duration: 1,
        rating: 4.1,
        benefits: [
            'Identity theft protection',
            'Online fraud coverage',
            'Cyber extortion cover',
            'Data breach liability',
            'Social media liability'
        ],
        description: 'Digital protection against identity theft, online fraud, and cyber extortion.'
    },
    {
        id: 20,
        name: 'NetSafe Basic',
        type: 'Cyber',
        coverage: 250000,
        premium: 800,
        duration: 1,
        rating: 3.8,
        benefits: [
            'UPI & net banking fraud cover',
            'Phishing attack protection',
            'Credit card misuse cover',
            'Cyber counselling support'
        ],
        description: 'Entry-level cyber insurance for everyday online banking and digital transaction protection.'
    },
    {
        id: 21,
        name: 'DigitalFortress Max',
        type: 'Cyber',
        coverage: 5000000,
        premium: 7500,
        duration: 1,
        rating: 4.5,
        benefits: [
            'Comprehensive identity restoration',
            'Ransomware & malware coverage',
            'Business email compromise',
            'Reputational harm cover',
            'Legal defense costs',
            'IT forensic investigation'
        ],
        description: 'Enterprise-grade personal cyber plan with ransomware, reputation, and legal defense coverage.'
    }
];

export const initialClaims = [
    {
        id: 'CLM-2024-001',
        policyName: 'HealthGuard Pro',
        policyNumber: 'POL-2024-HG-4521',
        type: 'Health',
        claimType: 'hospitalization',
        amount: 125000,
        filedDate: '2024-12-15',
        status: 'Approved',
        fullName: 'Rahul Sharma',
        email: 'rahul.sharma@email.com',
        description: 'Hospitalization for appendix surgery at Apollo Hospital.',
        timeline: [
            { step: 'Claim Filed', date: '2024-12-15', status: 'completed', description: 'Claim submitted with all required documents.' },
            { step: 'Documents Verified', date: '2024-12-17', status: 'completed', description: 'All documents and medical reports verified successfully.' },
            { step: 'Under Review', date: '2024-12-19', status: 'completed', description: 'Claim reviewed by the assessment team.' },
            { step: 'Approved', date: '2024-12-22', status: 'completed', description: 'Claim approved. Amount of ₹1,25,000 will be disbursed.' },
            { step: 'Amount Disbursed', date: '2024-12-24', status: 'completed', description: 'Amount credited to registered bank account.' }
        ]
    },
    {
        id: 'CLM-2024-002',
        policyName: 'AutoShield Premium',
        policyNumber: 'POL-2024-AS-7832',
        type: 'Auto',
        claimType: 'accident',
        amount: 45000,
        filedDate: '2025-01-05',
        status: 'Under Review',
        fullName: 'Priya Patel',
        email: 'priya.patel@email.com',
        description: 'Rear-end collision damage on Mumbai-Pune expressway.',
        timeline: [
            { step: 'Claim Filed', date: '2025-01-05', status: 'completed', description: 'Accident claim submitted with FIR and photos.' },
            { step: 'Documents Verified', date: '2025-01-07', status: 'completed', description: 'Police report and repair estimate verified.' },
            { step: 'Under Review', date: '2025-01-09', status: 'current', description: 'Surveyor inspection scheduled. Awaiting assessment report.' },
            { step: 'Approval Pending', date: '', status: 'pending', description: 'Waiting for review completion.' },
            { step: 'Settlement', date: '', status: 'pending', description: 'Amount to be disbursed upon approval.' }
        ]
    },
    {
        id: 'CLM-2025-003',
        policyName: 'FamilyFirst Plus',
        policyNumber: 'POL-2025-FF-1290',
        type: 'Health',
        claimType: 'hospitalization',
        amount: 280000,
        filedDate: '2025-01-20',
        status: 'Submitted',
        fullName: 'Ankit Verma',
        email: 'ankit.v@email.com',
        description: 'Emergency hospitalization for dengue treatment.',
        timeline: [
            { step: 'Claim Filed', date: '2025-01-20', status: 'completed', description: 'Hospitalization claim submitted with discharge summary.' },
            { step: 'Documents Verification', date: '', status: 'current', description: 'Documents are being reviewed by the verification team.' },
            { step: 'Under Review', date: '', status: 'pending', description: 'Assessment pending.' },
            { step: 'Decision', date: '', status: 'pending', description: 'Awaiting final decision.' },
            { step: 'Settlement', date: '', status: 'pending', description: 'Settlement processing.' }
        ]
    },
    {
        id: 'CLM-2025-004',
        policyName: 'HomeSafe 360',
        policyNumber: 'POL-2024-HS-5567',
        type: 'Property',
        claimType: 'property-damage',
        amount: 520000,
        filedDate: '2025-02-01',
        status: 'Approved',
        fullName: 'Sneha Joshi',
        email: 'sneha.j@email.com',
        description: 'Water damage from burst pipe flooding the kitchen and living room.',
        timeline: [
            { step: 'Claim Filed', date: '2025-02-01', status: 'completed', description: 'Property damage claim filed after water pipe burst.' },
            { step: 'Documents Verified', date: '2025-02-03', status: 'completed', description: 'Plumber report and photos verified.' },
            { step: 'Surveyor Visit', date: '2025-02-05', status: 'completed', description: 'On-site inspection completed by surveyor.' },
            { step: 'Approved', date: '2025-02-08', status: 'completed', description: 'Claim approved for ₹5,20,000.' },
            { step: 'Amount Disbursed', date: '2025-02-10', status: 'completed', description: 'Settlement amount transferred.' }
        ]
    }
];

export const policyTypes = ['All', 'Life', 'Health', 'Auto', 'Property', 'Travel', 'Cyber'];

export function getRecommendations(profile) {
    const { age, income, riskLevel } = profile;

    let recommended = [];

    if (age < 30) {
        recommended.push({
            ...policies.find(p => p.id === 2),
            matchScore: 95,
            reason: 'High coverage term plan ideal for young earners to secure family finances early.'
        });
        recommended.push({
            ...policies.find(p => p.id === 5),
            matchScore: 88,
            reason: 'Comprehensive health coverage is essential at every age. Lock in low premiums now.'
        });
        if (riskLevel === 'high') {
            recommended.push({
                ...policies.find(p => p.id === 16),
                matchScore: 82,
                reason: 'Adventure travel coverage for your active lifestyle and frequent trips.'
            });
        } else {
            recommended.push({
                ...policies.find(p => p.id === 19),
                matchScore: 78,
                reason: 'Protect your digital identity and online transactions with cyber insurance.'
            });
        }
    } else if (age < 45) {
        recommended.push({
            ...policies.find(p => p.id === 6),
            matchScore: 96,
            reason: 'Family floater plan covers your entire family including maternity benefits.'
        });
        recommended.push({
            ...policies.find(p => p.id === 4),
            matchScore: 90,
            reason: 'Lock in a ₹1 Crore term plan now for maximum coverage at affordable premiums.'
        });
        recommended.push({
            ...policies.find(p => p.id === 13),
            matchScore: 85,
            reason: 'Protect your home investment against natural disasters and theft.'
        });
    } else {
        recommended.push({
            ...policies.find(p => p.id === 8),
            matchScore: 94,
            reason: 'Ultra-premium health coverage with unlimited restoration and global treatment.'
        });
        recommended.push({
            ...policies.find(p => p.id === 3),
            matchScore: 87,
            reason: 'Life coverage with maturity benefits to complement your retirement planning.'
        });
        recommended.push({
            ...policies.find(p => p.id === 15),
            matchScore: 80,
            reason: 'Premium estate protection with full replacement cost and valuable items cover.'
        });
    }

    if (income === 'high') {
        recommended = recommended.map(r => ({
            ...r,
            matchScore: Math.min(r.matchScore + 3, 99)
        }));
    }

    return recommended;
}

export function calculatePremium(age, coverage, duration, policyType) {
    const baseRates = {
        Life: 0.005,
        Health: 0.012,
        Auto: 0.018,
        Property: 0.003,
        Travel: 0.008,
        Cyber: 0.004
    };
    const base = baseRates[policyType] || 0.008;

    let ageFactor = 1;
    if (age < 25) ageFactor = 0.8;
    else if (age < 35) ageFactor = 1.0;
    else if (age < 45) ageFactor = 1.3;
    else if (age < 55) ageFactor = 1.6;
    else ageFactor = 2.0;

    let durationFactor = 1;
    if (duration <= 1) durationFactor = 1.2;
    else if (duration <= 5) durationFactor = 1.0;
    else if (duration <= 15) durationFactor = 0.9;
    else durationFactor = 0.85;

    const annualPremium = Math.round(coverage * base * ageFactor * durationFactor);
    const monthlyPremium = Math.round(annualPremium / 12);
    const totalPremium = annualPremium * duration;

    return { annualPremium, monthlyPremium, totalPremium, duration };
}
