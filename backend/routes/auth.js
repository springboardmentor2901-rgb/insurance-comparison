import express from 'express';

const router = express.Router();

// In-memory user store
const users = [
    { id: 1, fullName: 'Demo User', email: 'demo@insurance.com', password: 'demo123', phone: '+91 98765 43210', createdAt: '2025-01-01' }
];

let nextId = 2;

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

    // Extract user id from mock token
    const userId = parseInt(token.split('_')[1]);
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    const { password: _, ...safeUser } = user;
    res.json(safeUser);
});

export default router;
