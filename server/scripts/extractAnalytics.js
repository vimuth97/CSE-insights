require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const pdfParse = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");
const db = require("../db");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const CDN_BASE = process.env.CSE_CDN_BASE;

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

async function extractForSymbol(symbol) {
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

  const pdfUrl = `${CDN_BASE}${annualReports[0].path}`;

  const pdfRes = await fetch(pdfUrl);
  if (!pdfRes.ok) throw new Error(`Failed to fetch PDF: ${pdfRes.status}`);
  const buffer = Buffer.from(await pdfRes.arrayBuffer());
  const { text } = await pdfParse(buffer);
  if (!text?.trim()) throw new Error("Could not extract text from PDF.");

  // Truncate to reduce token usage - key financials are usually in first 100k chars
  const truncated = text.slice(0, 400000);

  async function callGemini() {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: PROMPT(truncated),
    });
    return response.text.replace(/```json|```/g, "").trim();
  }

  let raw;
  try {
    raw = await callGemini();
  } catch (err) {
    // Parse retry delay from error message
    const match =
      JSON.stringify(err).match(
        /retryDelay&quot;:&quot;(\d+)s|retry in ([\d.]+)s/i,
      ) || JSON.stringify(err).match(/(\d+\.?\d*)s/);
    const waitMs = match
      ? Math.ceil(parseFloat(match[1] || match[2])) * 1000 + 2000
      : 65000;
    console.log(
      `[Analytics Extract] Rate limited, waiting ${waitMs / 1000}s...`,
    );
    await new Promise((r) => setTimeout(r, waitMs));
    raw = await callGemini();
  }
  let metrics;
  try {
    metrics = JSON.parse(raw);
  } catch {
    throw new Error(`Invalid JSON from Gemini: ${raw.slice(0, 200)}`);
  }

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

  return metrics;
}

async function run() {
  const [rows] = await db.execute("SELECT company FROM analytics");
  const symbols = rows.map((r) => r.company);

  // Only process companies that don't have data yet (eps is null)
  const [doneRows] = await db.execute(
    "SELECT company FROM analytics WHERE eps IS NOT NULL",
  );
  const done = new Set(doneRows.map((r) => r.company));
  const pending = symbols.filter((s) => !done.has(s));

  console.log(
    `[Analytics Extract] ${done.size} already done, ${pending.length} remaining...`,
  );

  for (const symbol of pending) {
    try {
      const metrics = await extractForSymbol(symbol);
      console.log(`[Analytics Extract] ✓ ${symbol}`, metrics);
    } catch (err) {
      console.error(`[Analytics Extract] ✗ ${symbol}: ${err.message}`);
    }
    // 10s delay between each to respect Gemini rate limits
    await new Promise((r) => setTimeout(r, 10000));
    // Extra 60s pause every 10 companies
    if (pending.indexOf(symbol) % 10 === 9) {
      console.log("[Analytics Extract] Pausing 60s to avoid rate limits...");
      await new Promise((r) => setTimeout(r, 60000));
    }
  }

  console.log("[Analytics Extract] Done.");
}

module.exports = { run };

if (require.main === module) {
  run()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
