import pool from "../config/db.js";

// CREATE QUOTE
export const generateQuote = async (req, res) => {
  const { fullName, age, policyType } = req.body;

  if (!fullName || !age || !policyType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let annualPremium = 10000;

  if (age > 40) annualPremium += 5000;
  if (policyType === "Health") annualPremium += 2000;

  const [result] = await pool.query(
    "INSERT INTO quotes (fullName, age, policyType, annualPremium) VALUES (?, ?, ?, ?)",
    [fullName, age, policyType, annualPremium]
  );

  res.status(201).json({
    id: result.insertId,
    fullName,
    annualPremium,
  });
};

// GET ALL QUOTES
export const getQuotes = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM quotes");
  res.json(rows);
};