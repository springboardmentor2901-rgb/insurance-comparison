import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

import authRoutes from "./routes/auth.js";
import claimsRoutes from "./routes/claims.js";
import quotesRoutes from "./routes/quotes.js";
import policiesRoutes from "./routes/policies.js";
import recommendationsRoutes from "./routes/recommendations.js";
import calculatorRoutes from "./routes/calculator.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use("/api/auth", authRoutes);
app.use("/api/claims", claimsRoutes);
app.use("/api/quotes", quotesRoutes);
app.use("/api/policies", policiesRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/calculator", calculatorRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "Insurance SQL API Running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL Connected");
    connection.release();
  } catch (err) {
    console.error("MySQL Connection Failed:", err);
  }

  console.log(`Server running on port ${PORT}`);
});
