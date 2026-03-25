const express = require("express");
const router = express.Router();

// GET /api/companies
router.get("/", async (req, res) => {
  try {
    const response = await fetch(`${process.env.CSE_API_URL}list_by_market_cap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`CSE API error: ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch companies.", details: err.message });
  }
});

module.exports = router;
