import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PolicyDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCheckout, setShowCheckout] = useState(false);
    const [buyer, setBuyer] = useState({ fullName: '', email: '', phone: '' });
    const [processing, setProcessing] = useState(false);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`/api/policies/${id}`)
            .then(res => {
                if (!res.ok) throw new Error(`API Error ${res.status}`);
                return res.json();
            })
            .then(data => {
                setPolicy(data.policy || data);
            })
            .catch(err => {
                console.error('Failed to load policy:', err);
                setError('Failed to load policy details');
            })
            .finally(() => setLoading(false));
    }, [id]);

    const formatCurrency = (val) => '₹' + (val || 0).toLocaleString('en-IN');

    if (loading) return (
        <div className="page">
            <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
                <h3 style={{ marginTop: '12px' }}>Loading policy...</h3>
            </div>
        </div>
    );

    if (error) return (
        <div className="page">
            <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
                <h3>{error}</h3>
                <button className="btn btn-primary" onClick={() => navigate(-1)}>← Back</button>
            </div>
        </div>
    );

    if (!policy) return (
        <div className="page">
            <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
                <h3>Policy not found</h3>
                <button className="btn btn-primary" onClick={() => navigate('/compare')}>Back to Policies</button>
            </div>
        </div>
    );

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>{policy.name}</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>{policy.type} • Rating: ⭐ {policy.rating}</p>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div style={{ minWidth: '320px', flex: '1 1 320px' }}>
                            <h3>Coverage</h3>
                            <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrency(policy.coverage)}</p>

                            <h3 style={{ marginTop: '16px' }}>Premium</h3>
                            <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrency(policy.premium)}/yr</p>

                            <h3 style={{ marginTop: '16px' }}>Duration</h3>
                            <p>{policy.duration} {policy.duration === 1 ? 'year' : 'years'}</p>

                            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                                <button className="btn btn-primary" onClick={() => setShowCheckout(true)}>Buy Now</button>
                                <button className="btn btn-secondary" style={{ marginLeft: '12px' }} onClick={() => navigate('/compare')}>← Back</button>
                            </div>
                        </div>

                        <div style={{ flex: '2 1 480px' }}>
                            <h3>Description</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>{policy.description}</p>

                            <h3 style={{ marginTop: '16px' }}>Key Benefits</h3>
                            <ul>
                                {policy.benefits && policy.benefits.map((b, i) => <li key={i} style={{ color: 'var(--text-secondary)' }}>{b}</li>)}
                            </ul>

                            <h3 style={{ marginTop: '16px' }}>Details</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div><strong>Type</strong><div style={{ color: 'var(--text-secondary)' }}>{policy.type}</div></div>
                                <div><strong>Rating</strong><div style={{ color: 'var(--text-secondary)' }}>⭐ {policy.rating}</div></div>
                                <div><strong>Status</strong><div style={{ color: 'var(--text-secondary)' }}>{policy.status || 'Active'}</div></div>
                                <div><strong>Policy ID</strong><div style={{ color: 'var(--text-secondary)' }}>{policy.id}</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showCheckout && (
                <div className="modal-overlay">
                    <div className="checkout-modal glass-card">
                        <h3>Complete Purchase</h3>
                        {!purchaseSuccess ? (
                            <>
                                <p style={{ color: 'var(--text-secondary)' }}>You're buying <strong>{policy.name}</strong> for <strong>{formatCurrency(policy.premium)}/yr</strong>.</p>
                                <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
                                    <input className="form-input" placeholder="Full name" value={buyer.fullName} onChange={(e) => setBuyer({ ...buyer, fullName: e.target.value })} />
                                    <input className="form-input" placeholder="Email" value={buyer.email} onChange={(e) => setBuyer({ ...buyer, email: e.target.value })} />
                                    <input className="form-input" placeholder="Phone" value={buyer.phone} onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })} />
                                </div>

                                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                    <button className="btn btn-primary" disabled={processing} onClick={async () => {
                                        // basic validation
                                        if (!buyer.fullName || !buyer.email) { alert('Please enter name and email'); return; }
                                        setProcessing(true);
                                        try {
                                            const res = await fetch('/api/purchase', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ policyId: policy.id, buyer })
                                            });
                                            if (!res.ok) {
                                                const txt = await res.text();
                                                throw new Error(txt || `Status ${res.status}`);
                                            }
                                            const data = await res.json();
                                            setPurchaseSuccess(true);
                                            setOrderId(data.orderId || data.id || Math.random().toString(36).slice(2,9));
                                        } catch (err) {
                                            console.error('Purchase failed', err);
                                            alert('Purchase failed. Please try again later.');
                                        }
                                        setProcessing(false);
                                    }}>{processing ? 'Processing...' : `Pay ${formatCurrency(policy.premium)}`}</button>

                                    <button className="btn btn-secondary" onClick={() => setShowCheckout(false)} disabled={processing}>Cancel</button>
                                </div>
                            </>
                        ) : (
                            <div>
                                <h4 style={{ color: 'var(--accent-teal)' }}>Purchase Successful</h4>
                                <p>Order ID: <strong>{orderId}</strong></p>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                    <button className="btn btn-primary" onClick={() => { setShowCheckout(false); navigate('/'); }}>Go to Home</button>
                                    <button className="btn btn-secondary" onClick={() => { setShowCheckout(false); navigate('/compare'); }}>View Policies</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
