const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db");

const authRoutes = require("./routes/auth");
const indicesRoutes = require("./routes/indices");
const marketStatusRoutes = require("./routes/marketStatus");
const mainIndicesRoutes = require("./routes/mainIndices");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/indices", indicesRoutes);
app.use("/api/marketStatus", marketStatusRoutes);
app.use("/api/main-indices", mainIndicesRoutes);

app.get("/", (req, res) => {
  res.json({ message: "CSE Insights API" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
