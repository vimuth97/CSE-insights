const express = require("express");
const router = express.Router();

// GET /api/financials/:symbol
router.get("/:symbol", async (req, res) => {
  try {
    const form = new URLSearchParams();
    form.append("symbol", req.params.symbol);
    const response = await fetch(`${process.env.CSE_API_URL}financials`, {
      method: "POST",
      body: form,
    });
    if (!response.ok) throw new Error(`CSE API error: ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch financials.", details: err.message });
  }
});

module.exports = router;
