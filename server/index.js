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
});
