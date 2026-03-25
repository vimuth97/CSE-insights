const express = require("express");
const router = express.Router();

const csePost = (endpoint, body = null) => {
  const init = { method: "POST" };
  if (body) {
    const form = new URLSearchParams();
    for (const [k, v] of Object.entries(body)) form.append(k, v);
    init.body = form;
  }
  return fetch(`${process.env.CSE_API_URL}${endpoint}`, init).then((r) => {
    if (!r.ok) throw new Error(`CSE API error: ${r.status}`);
    return r.json();
  });
};

// GET /api/companies/:symbol
router.get("/:symbol", async (req, res) => {
  const symbol = req.params.symbol;
  if (!symbol)
    return res.status(400).json({ error: "Invalid symbol." });
  try {
    const [summary, profile] = await Promise.all([
      csePost("companyInfoSummery", { symbol }),
      csePost("companyProfile", { symbol }),
    ]);

    const si = summary.reqSymbolInfo;
    const beta = summary.reqSymbolBetaInfo;
    const com = profile.reqComSumInfo?.[0] ?? {};

    res.json({
      logo: summary.reqLogo?.path ?? null,
      symbolInfo: {
        allHiPrice: si.allHiPrice,
        allLowPrice: si.allLowPrice,
        tdyTurnover: si.tdyTurnover,
        wtdTurnover: si.wtdTurnover,
        mtdTurnover: si.mtdTurnover,
        ytdTurnover: si.ytdTurnover,
      },
      betaInfo: {
        triASIBetaValue: beta.triASIBetaValue,
        betaValueSPSL: beta.betaValueSPSL,
        triASIBetaPeriod: beta.triASIBetaPeriod,
        quarter: beta.quarter,
      },
      companyInfo: {
        finYearEnd: com.finYearEnd,
        established: com.established,
        sector: com.sector,
        boardType: com.boardType,
        auditors: com.auditors,
        registeredOffice: com.registeredOffice,
        tel1: com.tel1,
        fax: com.fax,
        email1: com.email1,
        web: com.web,
      },
      businessSummary:
        profile.infoCompanyBusinessSummary?.map((s) => s.body).join(" ") ?? "",
      directors:
        profile.infoCompanyDirector?.map(
          ({ directorId, firstName, lastName }) => ({
            directorId,
            firstName,
            lastName,
          }),
        ) ?? [],
      topPosts:
        profile.topPosts?.map(
          ({ directorId, firstName, lastName, designationOther }) => ({
            directorId,
            firstName,
            lastName,
            designationOther,
          }),
        ) ?? [],
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch company details.",
      details: err.message,
    });
  }
});

// GET /api/companies
router.get("/", async (req, res) => {
  try {
    const data = await csePost("list_by_market_cap");
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch companies.", details: err.message });
  }
});

module.exports = router;
