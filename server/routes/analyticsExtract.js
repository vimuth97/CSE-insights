const express = require("express");
const router = express.Router();
const pdfParse = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");
const db = require("../db");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const CDN_BASE = "https://cdn.cse.lk/";

// GET /api/analytics/:symbol
router.get("/:symbol", async (req, res) => {
  const symbol = req.params.symbol;
  try {
    // Fetch analytics from DB and current price from CSE in parallel
    const [[rows], priceRes] = await Promise.all([
      db.execute("SELECT * FROM analytics WHERE company = ?", [symbol]),
      fetch(`${process.env.CSE_API_URL}companyInfoSummery`, {
        method: "POST",
        body: new URLSearchParams({ symbol }),
      }),
    ]);

    if (!rows.length) return res.status(404).json({ error: "No analytics data found." });
    const analytics = rows[0];

    let price = null;
    if (priceRes.ok) {
      const priceData = await priceRes.json();
      price = priceData.reqSymbolInfo?.lastTradedPrice ?? null;
    }

    res.json({ ...analytics, price });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analytics.", details: err.message });
  }
});
const PROMPT = (text) => `
You are a financial analyst. Extract the following metrics from this annual report.
If a metric is not directly stated, calculate it from available data.
If it cannot be determined at all, return null for that field.

Return ONLY a valid JSON object with exactly these keys (numeric values or null):
{
  "eps": <Earnings Per Share>,
  "book_value": <Book Value Per Share>,
  "roe": <Return on Equity as a percentage e.g. 12.5>,
  "net_profit": <Net Profit Margin as a percentage>,
  "operating_margin": <Operating Margin as a percentage>,
  "revenue_growth": <Annual Revenue Growth as a percentage>,
  "earning_growth": <Annual Earnings Growth as a percentage>,
  "de_ratio": <Debt to Equity Ratio>,
  "current_ratio": <Current Ratio>
}

Annual Report Text:
${text}
`;

// POST /api/analytics/extract
router.post("/extract", async (req, res) => {
  const { symbol } = req.body;
  if (!symbol) return res.status(400).json({ error: "symbol is required." });

  try {
    // 1. Fetch latest annual report from CSE financials endpoint
    const form = new URLSearchParams();
    form.append("symbol", symbol);
    const finRes = await fetch(`${process.env.CSE_API_URL}financials`, {
      method: "POST",
      body: form,
    });
    if (!finRes.ok) throw new Error(`CSE financials error: ${finRes.status}`);
    const finData = await finRes.json();

    const annualReports = (finData.infoAnnualData ?? []).sort(
      (a, b) => b.manualDate - a.manualDate,
    );
    if (!annualReports.length) throw new Error("No annual reports found.");

    const latestReport = annualReports[0];
    const pdfUrl = `${CDN_BASE}${latestReport.path}`;

    // 2. Fetch and parse PDF
    const pdfRes = await fetch(pdfUrl);
    if (!pdfRes.ok) throw new Error(`Failed to fetch PDF: ${pdfRes.status}`);
    const buffer = Buffer.from(await pdfRes.arrayBuffer());
    const { text } = await pdfParse(buffer);
    if (!text?.trim()) throw new Error("Could not extract text from PDF.");

    // 3. Send to Gemini for extraction
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: PROMPT(text),
    });

    // 4. Parse Gemini JSON response
    const raw = response.text.replace(/```json|```/g, "").trim();
    let metrics;
    try {
      metrics = JSON.parse(raw);
    } catch {
      throw new Error(`Gemini returned invalid JSON: ${raw.slice(0, 200)}`);
    }

    // 5. Save to analytics table
    await db.execute(
      `INSERT INTO analytics (company, eps, book_value, roe, net_profit, operating_margin, revenue_growth, earning_growth, de_ratio, current_ratio)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         eps = VALUES(eps),
         book_value = VALUES(book_value),
         roe = VALUES(roe),
         net_profit = VALUES(net_profit),
         operating_margin = VALUES(operating_margin),
         revenue_growth = VALUES(revenue_growth),
         earning_growth = VALUES(earning_growth),
         de_ratio = VALUES(de_ratio),
         current_ratio = VALUES(current_ratio)`,
      [
        symbol,
        metrics.eps ?? null,
        metrics.book_value ?? null,
        metrics.roe ?? null,
        metrics.net_profit ?? null,
        metrics.operating_margin ?? null,
        metrics.revenue_growth ?? null,
        metrics.earning_growth ?? null,
        metrics.de_ratio ?? null,
        metrics.current_ratio ?? null,
      ],
    );

    res.json({ success: true, symbol, metrics, report: latestReport.fileText });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to extract analytics.", details: err.message });
  }
});

module.exports = router;
