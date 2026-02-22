import pool from "../config/db.js";

export const createPolicy = async (req, res) => {
  const { name, type, coverage, premium, duration } = req.body;

  const [result] = await pool.query(
    "INSERT INTO policies (name, type, coverage, premium, duration) VALUES (?, ?, ?, ?, ?)",
    [name, type, coverage, premium, duration]
  );

  res.status(201).json({ id: result.insertId });
};

export const getPolicies = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM policies");
  res.json(rows);
};

export const deletePolicy = async (req, res) => {
  await pool.query("DELETE FROM policies WHERE id = ?", [req.params.id]);
  res.json({ message: "Policy deleted" });
};