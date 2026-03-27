require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const pdfParse = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");
const db = require("../db");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const CDN_BASE = "https://cdn.cse.lk/";

const PROMPT = (text) => `
You are a financial analyst. Extract the following metrics from this annual report.
If a metric is not directly stated, calculate it from available data.
If it cannot be determined at all, return null for that field.

IMPORTANT: For all monetary/share values (eps, book_value), return the FULL absolute value - do NOT abbreviate in millions or thousands.
For percentage values (roe, net_profit, operating_margin, revenue_growth, earning_growth), return as a percentage e.g. 12.5 means 12.5%.
For ratios (de_ratio, current_ratio), return the ratio as-is e.g. 1.78.

Return ONLY a valid JSON object with exactly these keys (numeric values or null):
{
  "eps": <Earnings Per Share - full value in LKR>,
  "book_value": <Book Value Per Share - full value in LKR>,
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

async function run() {
  const symbol = "ABAN.N0000";
  console.log(`Testing extraction for ${symbol}...`);

  try {
    // 1. Fetch latest annual report
    const form = new URLSearchParams();
    form.append("symbol", symbol);
    const finRes = await fetch(`${process.env.CSE_API_URL}financials`, { method: "POST", body: form });
    if (!finRes.ok) throw new Error(`CSE financials error: ${finRes.status}`);
    const finData = await finRes.json();

    const annualReports = (finData.infoAnnualData ?? []).sort((a, b) => b.manualDate - a.manualDate);
    if (!annualReports.length) throw new Error("No annual reports found.");

    console.log(`Latest report: ${annualReports[0].fileText}`);
    console.log(`PDF URL: ${CDN_BASE}${annualReports[0].path}`);

    // 2. Fetch and parse PDF
    const pdfUrl = `${CDN_BASE}${annualReports[0].path}`;
    const pdfRes = await fetch(pdfUrl);
    if (!pdfRes.ok) throw new Error(`Failed to fetch PDF: ${pdfRes.status}`);
    const buffer = Buffer.from(await pdfRes.arrayBuffer());
    const { text } = await pdfParse(buffer);
    console.log(`Extracted ${text.length} characters from PDF.`);

    // 3. Send to Gemini
    console.log("Sending to Gemini...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: PROMPT(text),
    });

    const raw = response.text.replace(/```json|```/g, "").trim();
    console.log("Gemini raw response:", raw);

    // 4. Parse JSON
    const metrics = JSON.parse(raw);
    console.log("Parsed metrics:", metrics);

    // 5. Save to DB
    await db.execute(
      "INSERT INTO analytics (company, eps, book_value, roe, net_profit, operating_margin, revenue_growth, earning_growth, de_ratio, current_ratio) " +
      "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) " +
      "ON DUPLICATE KEY UPDATE " +
      "eps = VALUES(eps), book_value = VALUES(book_value), roe = VALUES(roe), " +
      "net_profit = VALUES(net_profit), operating_margin = VALUES(operating_margin), " +
      "revenue_growth = VALUES(revenue_growth), earning_growth = VALUES(earning_growth), " +
      "de_ratio = VALUES(de_ratio), current_ratio = VALUES(current_ratio)",
      [
        symbol,
        metrics.eps ?? null, metrics.book_value ?? null, metrics.roe ?? null,
        metrics.net_profit ?? null, metrics.operating_margin ?? null,
        metrics.revenue_growth ?? null, metrics.earning_growth ?? null,
        metrics.de_ratio ?? null, metrics.current_ratio ?? null,
      ]
    );

    console.log("✓ Saved to DB successfully.");
  } catch (err) {
    console.error("✗ Error:", err.message);
  }

  process.exit(0);
}

run();
