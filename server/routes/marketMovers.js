const express = require("express");
const router = express.Router();

const csePost = async (endpoint) => {
  const res = await fetch(`${process.env.CSE_API_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`CSE API error: ${res.status}`);
  return res.json();
};

// GET /api/market-movers/top-gainers
router.get("/top-gainers", async (req, res) => {
  try {
    const data = await csePost("topGainers");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch top gainers.", details: err.message });
  }
});

// GET /api/market-movers/top-losers
router.get("/top-losers", async (req, res) => {
  try {
    const data = await csePost("topLooses");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch top losers.", details: err.message });
  }
});

// GET /api/market-movers/most-active
router.get("/most-active", async (req, res) => {
  try {
    const data = await csePost("mostActiveTrades");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch most active trades.", details: err.message });
  }
});

module.exports = router;
