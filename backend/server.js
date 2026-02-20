import sequelize from "./config/database.js";
import express from 'express';
import cors from 'cors';
import policiesRouter from './routes/policies.js';
import claimsRouter from './routes/claims.js';
import recommendationsRouter from './routes/recommendations.js';
import calculatorRouter from './routes/calculator.js';
import "./models/provider.js";
import "./models/policy.js";
import "./models/User.js";
import "./models/UserRequest.js";


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
app.use('/api/policies', policiesRouter);
app.use('/api/claims', claimsRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/calculator', calculatorRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Insurance API is running' });
});

// Start server
sequelize.sync()
  .then(() => {
    console.log("✅ Database connected & tables created");

    app.listen(PORT, () => {
      console.log(`\n🚀 Insurance Backend API running at http://localhost:${PORT}`);
      console.log(`   Endpoints:`);
      console.log(`   GET  /api/policies`);
      console.log(`   GET  /api/policies/:id`);
      console.log(`   GET  /api/claims`);
      console.log(`   GET  /api/claims/:id`);
      console.log(`   POST /api/claims`);
      console.log(`   POST /api/recommendations`);
      console.log(`   POST /api/calculator`);
      console.log(`   GET  /api/health\n`);
    });

  })
  .catch(err => {
    console.error("❌ Database connection failed:");
    console.error(err);
  });
