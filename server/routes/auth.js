const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [existing] = await conn.query(
      "SELECT email FROM login WHERE email = ?",
      [email],
    );
    if (existing.length > 0) {
      await conn.rollback();
      return res.status(409).json({ error: "Email already registered." });
    }

    const [userResult] = await conn.query(
      "INSERT INTO users (firstName, lastName, email) VALUES (?, ?, ?)",
      [firstName, lastName, email],
    );

    const hashedPassword = await bcrypt.hash(password, 10);
    await conn.query("INSERT INTO login (email, password_hash) VALUES (?, ?)", [
      email,
      hashedPassword,
    ]);

    await conn.commit();
    res.status(201).json({ userId: userResult.insertId, email });
  } catch (err) {
    await conn.rollback();
    res
      .status(500)
      .json({ error: "Registration failed.", details: err.message });
  } finally {
    conn.release();
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const [rows] = await pool.query(
      "SELECT password_hash FROM login WHERE email = ?",
      [email],
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Login failed.", details: err.message });
  }
});

module.exports = router;
