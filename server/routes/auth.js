const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");

const router = express.Router();

// Validation functions (matching frontend validations)
const validateFirstName = (name) => {
  if (!name) return "First name is required.";
  if (name.trim().length < 2)
    return "First name must be at least 2 characters.";
  return "";
};

const validateLastName = (name) => {
  if (!name) return "Last name is required.";
  if (name.trim().length < 2) return "Last name must be at least 2 characters.";
  return "";
};

const validateEmail = (email) => {
  if (!email) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Enter a valid email address.";
  return "";
};

const validatePassword = (password) => {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/.test(password))
    return "Password must include uppercase, lowercase, number, and a special character.";
  return "";
};

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  // Validate all fields
  const firstNameError = validateFirstName(firstName);
  const lastNameError = validateLastName(lastName);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const confirmPasswordError = !confirmPassword
    ? "Please confirm your password."
    : confirmPassword !== password
      ? "Passwords do not match."
      : "";

  if (
    firstNameError ||
    lastNameError ||
    emailError ||
    passwordError ||
    confirmPasswordError
  ) {
    return res.status(400).json({
      error: "Validation failed.",
      details: {
        firstName: firstNameError,
        lastName: lastNameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      },
    });
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

  // Validate fields
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  if (emailError || passwordError) {
    return res.status(400).json({
      error: "Validation failed.",
      details: {
        email: emailError,
        password: passwordError,
      },
    });
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
