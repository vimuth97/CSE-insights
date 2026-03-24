const express = require("express");
const router = express.Router();

// GET /api/market-summary
router.get("/", async (req, res) => {
  try {
    const response = await fetch(`${process.env.CSE_API_URL}dailyMarketSummery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch market summary." });
    }

    const data = await response.json();

    // Each element is a single-item array; flatten and find the latest by tradeDate
    const flat = data.map((arr) => arr[0]).filter(Boolean);
    const latest = flat.reduce((a, b) => (a.tradeDate > b.tradeDate ? a : b));

    res.json({
      tradeDate: latest.tradeDate,
      marketTurnover: latest.marketTurnover,
      marketTrades: latest.marketTrades,
      volumeOfTurnOverNumber: latest.volumeOfTurnOverNumber,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch market summary.", details: err.message });
  }
});

module.exports = router;
