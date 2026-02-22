import express from 'express';
import { policies, claims, agents, invoices, complianceData, supportTickets } from '../data/mockData.js';
import { users, authMiddleware, adminMiddleware } from './auth.js';

const router = express.Router();

// All admin routes require auth + admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /api/admin/dashboard — aggregated KPIs
router.get('/dashboard', (req, res) => {
    const totalPolicies = policies.length;
    const activePolicies = policies.filter(p => p.status === 'Active').length;
    const expiredPolicies = policies.filter(p => p.status === 'Expired').length;
    const totalClaims = claims.length;
    const activeClaims = claims.filter(c => c.status !== 'Approved' && c.status !== 'Rejected').length;
    const approvedClaims = claims.filter(c => c.status === 'Approved').length;
    const rejectedClaims = claims.filter(c => c.status === 'Rejected').length;
    const totalClaimAmount = claims.reduce((sum, c) => sum + (c.amount || 0), 0);
    const settledAmount = claims.filter(c => c.status === 'Approved').reduce((sum, c) => sum + (c.amount || 0), 0);
    const totalRevenue = invoices.reduce((sum, i) => sum + i.amount, 0);
    const paidRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
    const totalUsers = users.filter(u => u.role === 'user').length;
    const totalAgents = agents.length;
    const activeAgents = agents.filter(a => a.status === 'Active').length;
    const lossRatio = totalRevenue > 0 ? ((settledAmount / totalRevenue) * 100).toFixed(1) : 0;
    const quoteToBindRatio = 72.5; // mock
    const avgSettlementDays = 6.2; // mock

    // Recent activity
    const recentActivity = [
        { type: 'claim', icon: '📋', message: 'New claim CLM-2025-005 filed by Vikram Singh', time: '2 hours ago' },
        { type: 'policy', icon: '📄', message: 'Policy AutoElite 360 renewed by Amit Jain', time: '4 hours ago' },
        { type: 'payment', icon: '💰', message: 'Premium payment received from Sneha Joshi — ₹4,500', time: '6 hours ago' },
        { type: 'claim', icon: '✅', message: 'Claim CLM-2025-004 approved — ₹5,20,000', time: '1 day ago' },
        { type: 'agent', icon: '👤', message: 'Agent Deepak Verma onboarded — Pune region', time: '2 days ago' },
        { type: 'claim', icon: '❌', message: 'Claim CLM-2025-005 rejected — outside coverage', time: '3 days ago' },
        { type: 'policy', icon: '📄', message: 'New policy HealthMax Super sold to Kavita Reddy', time: '3 days ago' },
        { type: 'payment', icon: '💰', message: 'Commission payout processed for Agent Meera Nair', time: '4 days ago' }
    ];

    // Revenue by type
    const revenueByType = {};
    invoices.forEach(inv => {
        revenueByType[inv.type] = (revenueByType[inv.type] || 0) + inv.amount;
    });

    // Claims by status
    const claimsByStatus = {
        Submitted: claims.filter(c => c.status === 'Submitted').length,
        'Under Review': claims.filter(c => c.status === 'Under Review').length,
        Approved: approvedClaims,
        Rejected: rejectedClaims
    };

    // Premium collection
    const premiumCollection = {
        daily: 28500,
        monthly: 485000,
        ytd: paidRevenue
    };

    // Monthly premium trend (last 6 months)
    const monthlyTrend = [
        { month: 'Sep', premium: 320000, claims: 85000 },
        { month: 'Oct', premium: 410000, claims: 120000 },
        { month: 'Nov', premium: 375000, claims: 95000 },
        { month: 'Dec', premium: 520000, claims: 180000 },
        { month: 'Jan', premium: 485000, claims: 145000 },
        { month: 'Feb', premium: 460000, claims: 110000 }
    ];

    // Policies by type
    const policiesByType = {};
    policies.forEach(p => {
        policiesByType[p.type] = (policiesByType[p.type] || 0) + 1;
    });

    res.json({
        kpis: {
            totalPolicies, activePolicies, expiredPolicies,
            totalClaims, activeClaims, approvedClaims, rejectedClaims,
            submittedClaims: claims.filter(c => c.status === 'Submitted').length,
            underReviewClaims: claims.filter(c => c.status === 'Under Review').length,
            totalClaimAmount, settledAmount,
            totalRevenue, paidRevenue,
            totalUsers, totalAgents, activeAgents,
            lossRatio: parseFloat(lossRatio), quoteToBindRatio, avgSettlementDays
        },
        premiumCollection,
        monthlyTrend,
        policiesByType,
        recentActivity,
        revenueByType,
        claimsByStatus
    });
});

// GET /api/admin/clients
router.get('/clients', (req, res) => {
    const clients = users
        .filter(u => u.role === 'user')
        .map(u => {
            const { password, ...safeUser } = u;
            const userClaims = claims.filter(c => c.userId === u.id);
            return {
                ...safeUser,
                totalClaims: userClaims.length,
                activeClaims: userClaims.filter(c => c.status !== 'Approved' && c.status !== 'Rejected').length,
                totalClaimAmount: userClaims.reduce((sum, c) => sum + (c.amount || 0), 0)
            };
        });
    res.json(clients);
});

// GET /api/admin/agents
router.get('/agents', (req, res) => {
    res.json(agents);
});

// GET /api/admin/billing
router.get('/billing', (req, res) => {
    const totalRevenue = invoices.reduce((sum, i) => sum + i.amount, 0);
    const paidAmount = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
    const unpaidAmount = invoices.filter(i => i.status === 'Unpaid').reduce((sum, i) => sum + i.amount, 0);
    const overdueAmount = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0);
    const totalCommissions = agents.reduce((sum, a) => sum + a.commission, 0);

    res.json({
        invoices,
        summary: { totalRevenue, paidAmount, unpaidAmount, overdueAmount, totalCommissions },
        commissions: agents.map(a => ({ agentId: a.id, name: a.name, region: a.region, policiesSold: a.policiesSold, commission: a.commission }))
    });
});

// GET /api/admin/compliance
router.get('/compliance', (req, res) => {
    res.json(complianceData);
});

// GET /api/admin/support
router.get('/support', (req, res) => {
    const open = supportTickets.filter(t => t.status === 'Open').length;
    const inProgress = supportTickets.filter(t => t.status === 'In Progress').length;
    const resolved = supportTickets.filter(t => t.status === 'Resolved').length;
    res.json({
        tickets: supportTickets,
        summary: { total: supportTickets.length, open, inProgress, resolved }
    });
});

export default router;
