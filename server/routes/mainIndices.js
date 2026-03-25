const express = require("express");
const router = express.Router();

// GET /api/main-indices
router.get("/", async (req, res) => {
  try {
    const response = await fetch(`${process.env.CSE_API_URL}allSectors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ period: "1" }),
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch indices." });
    }

    const data = await response.json();
    const filtered = data.filter(
      (item) => item.symbol === "S&P SL20" || item.symbol === "ASI",
    );

    res.json(filtered);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch indices.", details: err.message });
  }
});

// GET /api/main-indices/chart/:chartId
router.get("/chart/:chartId", async (req, res) => {
  try {
    const form = new URLSearchParams();
    form.append("chartId", req.params.chartId);
    form.append("period", "1");
    const response = await fetch(`${process.env.CSE_API_URL}chartData`, {
      method: "POST",
      body: form,
    });
    if (!response.ok)
      return res
        .status(response.status)
        .json({ error: "Failed to fetch chart data." });
    const data = await response.json();
    const points = data.map((p) => ({
      date: new Date(p.d).toLocaleTimeString("en-LK", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Colombo",
      }),
      value: p.v,
    }));
    res.json(points);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch chart data.", details: err.message });
  }
});

module.exports = router;
