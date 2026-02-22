import pool from "../config/db.js";

// CREATE CLAIM
export const createClaim = async (req, res) => {
  const { fullName, email, policyNumber, claimType, description } = req.body;

  if (!fullName || !email || !policyNumber || !claimType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const [result] = await pool.query(
    "INSERT INTO claims (fullName, email, policyNumber, claimType, description) VALUES (?, ?, ?, ?, ?)",
    [fullName, email, policyNumber, claimType, description]
  );

  res.status(201).json({ message: "Claim created", id: result.insertId });
};

// GET ALL CLAIMS
export const getClaims = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM claims");
  res.json(rows);
};

// GET CLAIM BY ID
export const getClaimById = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM claims WHERE id = ?", [
    req.params.id,
  ]);

  if (rows.length === 0)
    return res.status(404).json({ error: "Claim not found" });

  res.json(rows[0]);
};

// DELETE CLAIM
export const deleteClaim = async (req, res) => {
  await pool.query("DELETE FROM claims WHERE id = ?", [req.params.id]);
  res.json({ message: "Claim deleted" });
};