const express = require("express");
const router = express.Router();

let symbolMap = {};

const loadSymbolMap = async () => {
  try {
    const res = await fetch(process.env.CSE_SYMBOL_LIST_URL);
    const text = await res.text();
    symbolMap = {};
    for (const line of text.trim().split("\n").slice(1)) {
      const comma = line.lastIndexOf(",");
      if (comma === -1) continue;
      const name = line.slice(0, comma).trim();
      const symbol = line.slice(comma + 1).trim();
      symbolMap[symbol] = name;
    }
  } catch (err) {
    console.error("Failed to load symbol map:", err.message);
  }
};

loadSymbolMap();

const csePost = async (endpoint) => {
  const res = await fetch(`${process.env.CSE_API_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`CSE API error: ${res.status}`);
  return res.json();
};

const withName = (item) => ({ ...item, companyName: symbolMap[item.symbol] || null });

// GET /api/market-movers/top-gainers
router.get("/top-gainers", async (req, res) => {
  try {
    const data = await csePost("topGainers");
    res.json(data.map(withName));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch top gainers.", details: err.message });
  }
});

// GET /api/market-movers/top-losers
router.get("/top-losers", async (req, res) => {
  try {
    const data = await csePost("topLooses");
    res.json(data.map(withName));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch top losers.", details: err.message });
  }
});

// GET /api/market-movers/most-active
router.get("/most-active", async (req, res) => {
  try {
    const data = await csePost("mostActiveTrades");
    res.json(data.map(withName));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch most active trades.", details: err.message });
  }
});

module.exports = router;
