import express from 'express';
import cors from 'cors';
import policiesRouter from './routes/policies.js';
import claimsRouter from './routes/claims.js';
import recommendationsRouter from './routes/recommendations.js';
import calculatorRouter from './routes/calculator.js';
import authRouter from './routes/auth.js';
import quotesRouter from './routes/quotes.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/policies', policiesRouter);
app.use('/api/claims', claimsRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/calculator', calculatorRouter);
app.use('/api/quotes', quotesRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Insurance API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Insurance Backend API running at http://localhost:${PORT}`);
    console.log(`   Endpoints:`);
    console.log(`   POST /api/auth/register`);
    console.log(`   POST /api/auth/login`);
    console.log(`   GET  /api/auth/me`);
    console.log(`   GET  /api/policies`);
    console.log(`   GET  /api/claims`);
    console.log(`   POST /api/claims`);
    console.log(`   POST /api/recommendations`);
    console.log(`   POST /api/calculator`);
    console.log(`   POST /api/quotes`);
    console.log(`   GET  /api/health\n`);
});
