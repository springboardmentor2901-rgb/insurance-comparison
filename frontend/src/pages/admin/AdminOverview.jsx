import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// Pure CSS Donut Chart Component
function DonutChart({ data, size = 180 }) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let cumulative = 0;
    const segments = data.map(d => {
        const start = (cumulative / total) * 360;
        cumulative += d.value;
        const end = (cumulative / total) * 360;
        return { ...d, start, end };
    });

    const gradientStr = segments
        .map(s => `${s.color} ${s.start}deg ${s.end}deg`)
        .join(', ');

    return (
        <div className="donut-chart-wrapper">
            <div
                className="donut-chart"
                style={{
                    width: size,
                    height: size,
                    background: `conic-gradient(${gradientStr})`,
                }}
            >
                <div className="donut-hole">
                    <span className="donut-total">{total}</span>
                    <span className="donut-label">Total</span>
                </div>
            </div>
            <div className="donut-legend">
                {data.map((d, i) => (
                    <div key={i} className="legend-item">
                        <span className="legend-dot" style={{ background: d.color }}></span>
                        <span className="legend-text">{d.label}</span>
                        <span className="legend-value">{d.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Animated Bar Chart Component
function BarChart({ data, maxVal, color, formatLabel }) {
    return (
        <div className="bar-chart">
            {data.map((d, i) => (
                <div key={i} className="bar-column">
                    <div className="bar-value">{formatLabel ? formatLabel(d.value) : d.value}</div>
                    <div className="bar-track">
                        <div
                            className="bar-fill"
                            style={{
                                height: `${(d.value / maxVal) * 100}%`,
                                background: typeof color === 'function' ? color(i) : color,
                                animationDelay: `${i * 0.1}s`
                            }}
                        ></div>
                    </div>
                    <div className="bar-label">{d.label}</div>
                </div>
            ))}
        </div>
    );
}

// Mini sparkline-style bar for comparing two values
function DualBarChart({ data, maxVal }) {
    return (
        <div className="dual-bar-chart">
            {data.map((d, i) => (
                <div key={i} className="dual-bar-group">
                    <div className="dual-bar-label">{d.month}</div>
                    <div className="dual-bars">
                        <div className="dual-bar-track">
                            <div className="dual-bar-fill premium" style={{ width: `${(d.premium / maxVal) * 100}%`, animationDelay: `${i * 0.08}s` }}></div>
                        </div>
                        <div className="dual-bar-track">
                            <div className="dual-bar-fill claims" style={{ width: `${(d.claims / maxVal) * 100}%`, animationDelay: `${i * 0.08 + 0.04}s` }}></div>
                        </div>
                    </div>
                </div>
            ))}
            <div className="dual-bar-legend">
                <span><span className="legend-dot" style={{ background: '#6366f1' }}></span> Premium</span>
                <span><span className="legend-dot" style={{ background: '#f59e0b' }}></span> Claims</span>
            </div>
        </div>
    );
}

export default function AdminOverview() {
    const { token } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, [token]);

    if (loading) return <div className="admin-page-loading"><div className="spinner"></div><p>Loading dashboard...</p></div>;
    if (!data) return <div className="admin-page-error">Failed to load dashboard data.</div>;

    const { kpis, premiumCollection, monthlyTrend, policiesByType, recentActivity, revenueByType, claimsByStatus } = data;
    const fmt = (v) => '₹' + (v || 0).toLocaleString('en-IN');
    const fmtK = (v) => v >= 100000 ? '₹' + (v / 100000).toFixed(1) + 'L' : '₹' + (v / 1000).toFixed(0) + 'K';

    const policyChartData = [
        { label: 'Active', value: kpis.activePolicies, color: '#22c55e' },
        { label: 'Expired', value: kpis.expiredPolicies, color: '#ef4444' },
    ];

    const claimsChartData = [
        { label: 'Submitted', value: kpis.submittedClaims || claimsByStatus?.Submitted || 0, color: '#3b82f6' },
        { label: 'Under Review', value: kpis.underReviewClaims || claimsByStatus?.['Under Review'] || 0, color: '#f59e0b' },
        { label: 'Approved', value: kpis.approvedClaims, color: '#22c55e' },
        { label: 'Rejected', value: kpis.rejectedClaims, color: '#ef4444' },
    ];

    const revenueData = Object.entries(revenueByType).map(([type, amount]) => ({
        label: type, value: amount
    }));
    const maxRevenue = Math.max(...revenueData.map(d => d.value), 1);

    const trendMax = Math.max(...monthlyTrend.map(d => Math.max(d.premium, d.claims)), 1);

    const typeColors = ['#6366f1', '#06b6d4', '#f59e0b', '#22c55e', '#ec4899', '#8b5cf6'];

    return (
        <div className="admin-page admin-overview-v2">
            <div className="admin-page-header">
                <h1>📊 Dashboard Overview</h1>
                <p>Real-time insights into your insurance operations</p>
            </div>

            {/* === ROW 1: KPI Cards === */}
            <div className="overview-kpi-row">
                <div className="ov-kpi-card ov-kpi-policies">
                    <div className="ov-kpi-icon">📄</div>
                    <div className="ov-kpi-info">
                        <span className="ov-kpi-val">{kpis.totalPolicies}</span>
                        <span className="ov-kpi-name">Total Policies</span>
                        <div className="ov-kpi-tags">
                            <span className="ov-tag ov-tag-green">{kpis.activePolicies} Active</span>
                            <span className="ov-tag ov-tag-red">{kpis.expiredPolicies} Expired</span>
                        </div>
                    </div>
                </div>
                <div className="ov-kpi-card ov-kpi-customers">
                    <div className="ov-kpi-icon">👥</div>
                    <div className="ov-kpi-info">
                        <span className="ov-kpi-val">{kpis.totalUsers}</span>
                        <span className="ov-kpi-name">Total Customers</span>
                        <div className="ov-kpi-tags">
                            <span className="ov-tag ov-tag-purple">{kpis.totalAgents} Agents</span>
                            <span className="ov-tag ov-tag-teal">{kpis.activeAgents} Active</span>
                        </div>
                    </div>
                </div>
                <div className="ov-kpi-card ov-kpi-revenue">
                    <div className="ov-kpi-icon">💰</div>
                    <div className="ov-kpi-info">
                        <span className="ov-kpi-val">{fmt(kpis.totalRevenue)}</span>
                        <span className="ov-kpi-name">Total Revenue</span>
                        <div className="ov-kpi-tags">
                            <span className="ov-tag ov-tag-green">{fmt(kpis.paidRevenue)} Collected</span>
                        </div>
                    </div>
                </div>
                <div className="ov-kpi-card ov-kpi-claims">
                    <div className="ov-kpi-icon">📋</div>
                    <div className="ov-kpi-info">
                        <span className="ov-kpi-val">{kpis.totalClaims}</span>
                        <span className="ov-kpi-name">Total Claims</span>
                        <div className="ov-kpi-tags">
                            <span className="ov-tag ov-tag-amber">{kpis.activeClaims} Active</span>
                            <span className="ov-tag ov-tag-blue">{fmt(kpis.totalClaimAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* === ROW 2: Premium Collection === */}
            <div className="ov-premium-row">
                <div className="ov-premium-card">
                    <div className="ov-premium-header">
                        <span className="ov-premium-period">Daily</span>
                        <span className="ov-premium-icon">📅</span>
                    </div>
                    <div className="ov-premium-val">{fmt(premiumCollection.daily)}</div>
                    <div className="ov-premium-label">Premium Collected</div>
                </div>
                <div className="ov-premium-card">
                    <div className="ov-premium-header">
                        <span className="ov-premium-period">Monthly</span>
                        <span className="ov-premium-icon">📆</span>
                    </div>
                    <div className="ov-premium-val">{fmt(premiumCollection.monthly)}</div>
                    <div className="ov-premium-label">Premium Collected</div>
                </div>
                <div className="ov-premium-card ov-premium-ytd">
                    <div className="ov-premium-header">
                        <span className="ov-premium-period">Year-to-Date</span>
                        <span className="ov-premium-icon">📊</span>
                    </div>
                    <div className="ov-premium-val">{fmt(premiumCollection.ytd)}</div>
                    <div className="ov-premium-label">Premium Collected</div>
                </div>
            </div>

            {/* === ROW 3: Pie Charts Row (Policies + Claims) === */}
            <div className="ov-charts-row">
                <div className="ov-chart-card">
                    <h3>Policy Status Distribution</h3>
                    <DonutChart data={policyChartData} size={170} />
                </div>
                <div className="ov-chart-card">
                    <h3>Claims Status Breakdown</h3>
                    <DonutChart data={claimsChartData} size={170} />
                </div>
            </div>

            {/* === ROW 4: Revenue Bar Chart + Premium vs Claims Trend === */}
            <div className="ov-charts-row">
                <div className="ov-chart-card">
                    <h3>Revenue by Policy Type</h3>
                    <BarChart
                        data={revenueData}
                        maxVal={maxRevenue}
                        color={(i) => typeColors[i % typeColors.length]}
                        formatLabel={fmtK}
                    />
                </div>
                <div className="ov-chart-card">
                    <h3>Premium vs Claims (6 Months)</h3>
                    <DualBarChart data={monthlyTrend} maxVal={trendMax} />
                </div>
            </div>

            {/* === ROW 5: Loss Ratio + Metrics === */}
            <div className="ov-metrics-row">
                <div className="ov-metric-card">
                    <h3>Loss Ratio</h3>
                    <div className="ov-gauge-wrapper">
                        <svg viewBox="0 0 120 70" className="ov-gauge">
                            <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round" />
                            <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none"
                                stroke={kpis.lossRatio > 70 ? '#ef4444' : kpis.lossRatio > 50 ? '#f59e0b' : '#22c55e'}
                                strokeWidth="10" strokeLinecap="round"
                                strokeDasharray={`${(kpis.lossRatio / 100) * 157} 157`}
                                className="gauge-fill"
                            />
                        </svg>
                        <div className="ov-gauge-value">{kpis.lossRatio}%</div>
                    </div>
                    <p className="ov-metric-desc">Claims settled vs total revenue</p>
                </div>
                <div className="ov-metric-card">
                    <h3>Quote-to-Bind</h3>
                    <div className="ov-gauge-wrapper">
                        <svg viewBox="0 0 120 70" className="ov-gauge">
                            <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round" />
                            <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none"
                                stroke="#6366f1"
                                strokeWidth="10" strokeLinecap="round"
                                strokeDasharray={`${(kpis.quoteToBindRatio / 100) * 157} 157`}
                                className="gauge-fill"
                            />
                        </svg>
                        <div className="ov-gauge-value">{kpis.quoteToBindRatio}%</div>
                    </div>
                    <p className="ov-metric-desc">Quotes converting to policies</p>
                </div>
                <div className="ov-metric-card">
                    <h3>Avg Settlement</h3>
                    <div className="ov-big-number">
                        <span className="ov-big-val">{kpis.avgSettlementDays}</span>
                        <span className="ov-big-unit">days</span>
                    </div>
                    <p className="ov-metric-desc">Average claim processing time</p>
                </div>
            </div>

            {/* === ROW 6: Recent Activity Feed === */}
            <div className="ov-activity-card">
                <h3>🔔 Recent Activities & Alerts</h3>
                <div className="ov-activity-list">
                    {recentActivity.map((a, i) => (
                        <div key={i} className="ov-activity-item" style={{ animationDelay: `${i * 0.06}s` }}>
                            <span className="ov-activity-icon">{a.icon}</span>
                            <div className="ov-activity-content">
                                <p>{a.message}</p>
                                <span className="ov-activity-time">{a.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
