import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const { user, logout, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
    });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        updateProfile({ fullName: formData.fullName, phone: formData.phone });
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const joinDate = user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric'
    }) : 'N/A';

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>👤 My Profile</h1>
                    <p>Manage your account details and preferences</p>
                </div>

                <div className="profile-layout">
                    {/* Profile Card */}
                    <div className="glass-card profile-hero-card animate-scaleIn">
                        <div className="profile-avatar-large">
                            {user?.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="profile-name">{user?.fullName}</h2>
                        <p className="profile-email">{user?.email}</p>
                        <div className="profile-badge">
                            <span className="badge badge-teal">✓ Verified Member</span>
                        </div>
                        <div className="profile-joined">
                            📅 Member since {joinDate}
                        </div>
                    </div>

                    {/* Details Card */}
                    <div className="glass-card profile-details-card animate-scaleIn" style={{ animationDelay: '0.1s' }}>
                        <div className="profile-details-header">
                            <h3>📋 Account Details</h3>
                            {!editing && (
                                <button className="btn btn-sm btn-secondary" onClick={() => setEditing(true)}>
                                    ✏️ Edit
                                </button>
                            )}
                        </div>

                        {saved && (
                            <div className="login-alert success" style={{ marginBottom: '16px' }}>
                                ✅ Profile updated successfully!
                            </div>
                        )}

                        <div className="profile-fields">
                            <div className="profile-field">
                                <label>Full Name</label>
                                {editing ? (
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                ) : (
                                    <div className="profile-field-value">{user?.fullName}</div>
                                )}
                            </div>

                            <div className="profile-field">
                                <label>Email Address</label>
                                <div className="profile-field-value">
                                    {user?.email}
                                    <span className="profile-field-note">Cannot be changed</span>
                                </div>
                            </div>

                            <div className="profile-field">
                                <label>Phone Number</label>
                                {editing ? (
                                    <input
                                        type="tel"
                                        className="form-input"
                                        placeholder="+91 XXXXX XXXXX"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                ) : (
                                    <div className="profile-field-value">{user?.phone || 'Not provided'}</div>
                                )}
                            </div>

                            <div className="profile-field">
                                <label>User ID</label>
                                <div className="profile-field-value profile-field-mono">#{user?.id}</div>
                            </div>
                        </div>

                        {editing && (
                            <div className="profile-edit-actions">
                                <button className="btn btn-secondary" onClick={() => { setEditing(false); setFormData({ fullName: user?.fullName || '', phone: user?.phone || '' }); }}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleSave}>
                                    💾 Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="glass-card profile-actions-card animate-scaleIn" style={{ animationDelay: '0.2s' }}>
                        <h3>⚡ Quick Actions</h3>
                        <div className="profile-quick-actions">
                            <button className="profile-action-btn" onClick={() => navigate('/get-quote')}>
                                <span className="action-icon">📝</span>
                                <span>Get a Quote</span>
                            </button>
                            <button className="profile-action-btn" onClick={() => navigate('/compare')}>
                                <span className="action-icon">🔍</span>
                                <span>Compare Policies</span>
                            </button>
                            <button className="profile-action-btn" onClick={() => navigate('/file-claim')}>
                                <span className="action-icon">📋</span>
                                <span>File a Claim</span>
                            </button>
                            <button className="profile-action-btn" onClick={() => navigate('/track-claim')}>
                                <span className="action-icon">📦</span>
                                <span>Track Claims</span>
                            </button>
                        </div>
                    </div>

                    {/* Logout */}
                    <div className="glass-card profile-logout-card animate-scaleIn" style={{ animationDelay: '0.3s' }}>
                        <div className="profile-logout-content">
                            <div>
                                <h3>🚪 Sign Out</h3>
                                <p>Log out from your InsureCompare account</p>
                            </div>
                            <button className="btn btn-danger" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
