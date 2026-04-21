const express = require("express");
const router = express.Router();
const pdfParse = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// POST /api/summarise
router.post("/", async (req, res) => {
  const { pdfUrl } = req.body;
  if (!pdfUrl) return res.status(400).json({ error: "pdfUrl is required." });

  try {
    const pdfRes = await fetch(pdfUrl);
    if (!pdfRes.ok) throw new Error(`Failed to fetch PDF: ${pdfRes.status}`);
    const buffer = Buffer.from(await pdfRes.arrayBuffer());

    const { text } = await pdfParse(buffer);
    if (!text?.trim()) throw new Error("Could not extract text from PDF.");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a financial analyst. Summarise the following financial report concisely, highlighting key figures, performance, and notable points in a way that is understandable to a non-expert to get idea if it is worth investing in:\n\n${text.slice(0, 400000)}`,
    });

    res.json({ summary: response.text });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to summarise report.", details: err.message });
  }
});

module.exports = router;
