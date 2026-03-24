const express = require("express");
const router = express.Router();

// GET /api/market-status
router.get("/", async (req, res) => {
  try {
    const response = await fetch(`${process.env.CSE_API_URL}marketStatus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch market status." });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch market status.", details: err.message });
  }
});

module.exports = router;
