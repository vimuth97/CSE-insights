const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "CSE Insights API" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
