const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db");

const authRoutes = require("./routes/auth");
const indicesRoutes = require("./routes/indices");
const marketStatusRoutes = require("./routes/marketStatus");
const mainIndicesRoutes = require("./routes/mainIndices");
const marketSummaryRoutes = require("./routes/marketSummary");
const marketMoversRoutes = require("./routes/marketMovers");
const companiesRoutes = require("./routes/companies");
const financialsRoutes = require("./routes/financials");
const summariseRoutes = require("./routes/summarise");
const analyticsExtractRoutes = require("./routes/analyticsExtract");

const cron = require("node-cron");
const { run: runAnalyticsExtract } = require("./scripts/extractAnalytics");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/indices", indicesRoutes);
app.use("/api/marketStatus", marketStatusRoutes);
app.use("/api/main-indices", mainIndicesRoutes);
app.use("/api/market-summary", marketSummaryRoutes);
app.use("/api/market-movers", marketMoversRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/financials", financialsRoutes);
app.use("/api/summarise", summariseRoutes);
app.use("/api/analytics", analyticsExtractRoutes);

app.get("/", (req, res) => {
  res.json({ message: "CSE Insights API" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Run analytics extraction at 11:59 PM on the last day of every month
  cron.schedule("59 23 * * *", () => {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }));
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (tomorrow.getDate() !== 1) return; // not last day of month
    console.log("[Cron] Running monthly analytics extraction...");
    runAnalyticsExtract().catch((err) =>
      console.error("[Cron] Analytics extraction failed:", err.message)
    );
  }, { timezone: "Asia/Colombo" });

  console.log("[Cron] Analytics extraction scheduled for last day of each month at 23:59 Colombo time.");
});
