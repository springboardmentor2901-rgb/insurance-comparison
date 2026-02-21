import express from 'express';

const router = express.Router();

// In-memory user store
const users = [
    { id: 1, fullName: 'Demo User', email: 'demo@insurance.com', password: 'demo123', phone: '+91 98765 43210', role: 'user', createdAt: '2025-01-01' },
    { id: 2, fullName: 'Admin', email: 'admin@insurance.com', password: 'admin123', phone: '+91 99999 00000', role: 'admin', createdAt: '2024-06-01' }
];

let nextId = 3;

// Export users for admin route access
export { users };

// Auth middleware — extracts user from token
export function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    const userId = parseInt(token.split('_')[1]);
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
}

// Admin-only middleware
export function adminMiddleware(req, res, next) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

// POST /api/auth/register
router.post('/register', (req, res) => {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ error: 'fullName, email, and password are required' });
    }

    if (users.find(u => u.email === email)) {
        return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const user = {
        id: nextId++,
        fullName,
        email,
        phone: phone || '',
        password,
        role: 'user',
        createdAt: new Date().toISOString().split('T')[0]
    };
    users.push(user);

    const { password: _, ...safeUser } = user;
    res.status(201).json({ user: safeUser, token: `token_${user.id}_${Date.now()}` });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ error: 'No account found with this email. Please register first.', code: 'NOT_FOUND' });
    }
    if (user.password !== password) {
        return res.status(401).json({ error: 'Incorrect password. Please try again.', code: 'WRONG_PASSWORD' });
    }

    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser, token: `token_${user.id}_${Date.now()}` });
});

// GET /api/auth/me (verify token - mock)
router.get('/me', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const userId = parseInt(token.split('_')[1]);
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    const { password: _, ...safeUser } = user;
    res.json(safeUser);
});

export default router;
