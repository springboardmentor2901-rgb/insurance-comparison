import pool from "../config/db.js";

export const registerUser = async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO users (fullName, email, password, phone) VALUES (?, ?, ?, ?)",
      [fullName, email, password, phone]
    );

    res.status(201).json({ message: "User Registered", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM users");
  res.json(rows);
};