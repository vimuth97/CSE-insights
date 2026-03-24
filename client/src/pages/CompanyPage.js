import companiesData from "../dummy_data/companies.json";
import companyDetail from "../dummy_data/company.json";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/company.css";

const QUARTER_LABELS = {
  1: "Q1 (31st Mar)",
  2: "Q2 (30th Jun)",
  3: "Q3 (30th Sep)",
  4: "Q4 (31st Dec)",
};
const comSumInfo = companyDetail.companyProfile.reqComSumInfo[0];
const symbolInfo = companyDetail.reqSymbolInfo;
const betaInfo = companyDetail.reqSymbolBetaInfo;
const businessSummary = companyDetail.companyProfile.infoCompanyBusinessSummary
  .map((s) => s.body)
  .join(" ");
const finYearEnd =
  QUARTER_LABELS[comSumInfo.finYearEnd] ?? `Q${comSumInfo.finYearEnd}`;
const directors = companyDetail.companyProfile.infoCompanyDirector;
const topPosts = companyDetail.companyProfile.topPosts;

const LOGO_BASE = "https://cdn.cse.lk/cmt/";

const fmt = (n, decimals = 2) =>
  n != null
    ? Number(n).toLocaleString("en-LK", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : "—";
const fmtMarketCap = (n) =>
  n != null ? `LKR ${(n / 1_000_000_000).toFixed(2)}B` : "—";
const fmtQty = (n) => (n != null ? Number(n).toLocaleString("en-LK") : "—");

export default function CompanyPage() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const company = companiesData.reqByMarketcap.find((c) => c.id === id);

  if (!company) {
    return (
      <>
        <Header />
        <main className="company-page">
          <p className="company-not-found">Company not found.</p>
        </main>
        <Footer />
      </>
    );
  }

  const change = company.change ?? 0;
  const changeColor = change > 0 ? "#1a7a3c" : change < 0 ? "#b91c1c" : "#555";

  return (
    <>
      <Header />
      {/* WCAG 2, 1.3.1: <main> landmark */}
      <main className="company-page" aria-label={`${company.name} profile`}>
        <div className="company-content">
          <div className="company-header">
            {company.logoUrl ? (
              <img
                className="company-logo"
                src={`${LOGO_BASE}${company.logoUrl}`}
                alt={`${company.name} logo`}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="company-logo-placeholder" aria-hidden="true">
                {company.name.charAt(0)}
              </div>
            )}
            <div className="company-title-block">
              <h1 className="company-name-heading">{company.name}</h1>
              <span className="company-symbol-badge">{company.symbol}</span>
            </div>
          </div>

          {/* ── Financial Summary ── */}
          <section className="page-section" aria-label="Financial Summary">
            <h2 className="page-section-heading">Financial Summary</h2>

            {/* Key stats grid */}
            <div className="company-grid">
              <div className="company-card">
                <h2 className="card-heading">Price</h2>
                <p className="card-value price-value">
                  LKR {fmt(company.price)}
                </p>
                <p className="card-sub" style={{ color: changeColor }}>
                  {change >= 0 ? "+" : ""}
                  {fmt(company.change)} ({change >= 0 ? "+" : ""}
                  {fmt(company.percentageChange)}%)
                </p>
              </div>

              <div className="company-card">
                <h2 className="card-heading">Day Range</h2>
                <p className="card-value">
                  {company.low != null && company.high != null
                    ? `LKR ${fmt(company.low)} – LKR ${fmt(company.high)}`
                    : "—"}
                </p>
              </div>

              <div className="company-card">
                <h2 className="card-heading">All-Time High / Low</h2>
                <p className="card-value" style={{ color: "#1a7a3c" }}>
                  LKR {fmt(symbolInfo.allHiPrice)}
                </p>
                <p className="card-sub" style={{ color: "#b91c1c" }}>
                  LKR {fmt(symbolInfo.allLowPrice)}
                </p>
              </div>

              <div className="company-card">
                <h2 className="card-heading">Market Cap</h2>
                <p className="card-value">{fmtMarketCap(company.marketCap)}</p>
                <p className="card-sub">
                  {fmt(company.marketCapPercentage, 4)}% of market
                </p>
              </div>

              <div className="company-card">
                <h2 className="card-heading">Issued Quantity</h2>
                <p className="card-value">{fmtQty(company.issuedQTY)}</p>
              </div>

              <div className="company-card">
                <h2 className="card-heading">Financial Year Ending</h2>
                <p className="card-value">{finYearEnd}</p>
              </div>

              <div className="company-card">
                <h2 className="card-heading">Volume (Today)</h2>
                <p className="card-value">{fmtQty(company.sharevolume)}</p>
                <p className="card-sub">
                  {company.tradevolume != null
                    ? `${fmtQty(company.tradevolume)} trades`
                    : ""}
                </p>
              </div>
            </div>

            {/* Turnover section */}
            <div className="company-card company-section-card">
              <h2 className="section-heading">Turnover</h2>
              <div className="turnover-grid">
                <div className="turnover-item">
                  <span className="turnover-label">Today</span>
                  <span className="turnover-value">
                    LKR {fmt(symbolInfo.tdyTurnover)}
                  </span>
                </div>
                <div className="turnover-item">
                  <span className="turnover-label">Week to Date</span>
                  <span className="turnover-value">
                    LKR {fmt(symbolInfo.wtdTurnover)}
                  </span>
                </div>
                <div className="turnover-item">
                  <span className="turnover-label">Month to Date</span>
                  <span className="turnover-value">
                    LKR {fmt(symbolInfo.mtdTurnover)}
                  </span>
                </div>
                <div className="turnover-item">
                  <span className="turnover-label">Year to Date</span>
                  <span className="turnover-value">
                    LKR {fmt(symbolInfo.ytdTurnover)}
                  </span>
                </div>
              </div>
            </div>

            {/* Beta section */}
            <div className="company-card company-section-card">
              <h2 className="section-heading">
                Beta Values ({betaInfo.triASIBetaPeriod} Q{betaInfo.quarter})
              </h2>
              <div className="turnover-grid">
                <div className="turnover-item">
                  <span className="turnover-label">vs ASPI</span>
                  <span className="turnover-value">
                    {fmt(betaInfo.triASIBetaValue, 4)}
                  </span>
                </div>
                <div className="turnover-item">
                  <span className="turnover-label">vs S&amp;P SL20</span>
                  <span className="turnover-value">
                    {fmt(betaInfo.betaValueSPSL, 4)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Company Profile ── */}
          <section className="page-section" aria-label="Company Profile">
            <h2 className="page-section-heading">Company Profile</h2>

            {/* Business Summary */}
            <div className="company-card company-section-card">
              <h3 className="section-heading">Business Summary</h3>
              <p className="summary-text">
                {businessSummary || "No business summary available."}
              </p>
            </div>

            {/* Board of Directors */}
            <div className="company-card company-section-card">
              <h3 className="section-heading">Board of Directors</h3>
              <div className="directors-grid">
                {topPosts.map((p) => (
                  <div
                    key={p.directorId}
                    className="director-item director-item--top"
                  >
                    <span className="director-name">
                      {p.firstName} {p.lastName}
                    </span>
                    <span className="director-role">{p.designationOther}</span>
                  </div>
                ))}
                {directors.map((d) => (
                  <div key={d.directorId} className="director-item">
                    <span className="director-name">
                      {d.firstName} {d.lastName}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Company details row */}
            <div className="company-card company-section-card">
              <h3 className="section-heading">Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="turnover-label">Founded</span>
                  <span className="turnover-value">
                    {comSumInfo.established ?? "—"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="turnover-label">GICS Industry Group</span>
                  <span className="turnover-value">
                    {comSumInfo.sector ?? "—"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="turnover-label">Board</span>
                  <span className="turnover-value">
                    {comSumInfo.boardType ?? "—"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="turnover-label">Auditors</span>
                  <span className="turnover-value">
                    {comSumInfo.auditors ?? "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="company-card company-section-card">
              <h3 className="section-heading">Contact</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="turnover-label">Address</span>
                  <span className="turnover-value">
                    {comSumInfo.registeredOffice?.trim() ?? "—"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="turnover-label">Telephone</span>
                  <span className="turnover-value">
                    {comSumInfo.tel1 ?? "—"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="turnover-label">Fax</span>
                  <span className="turnover-value">
                    {comSumInfo.fax ?? "—"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="turnover-label">Email</span>
                  <span className="turnover-value">
                    {comSumInfo.email1 ? (
                      <a
                        href={`mailto:${comSumInfo.email1}`}
                        className="contact-link"
                      >
                        {comSumInfo.email1}
                      </a>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="turnover-label">Website</span>
                  <span className="turnover-value">
                    {comSumInfo.web ? (
                      <a
                        href={`https://${comSumInfo.web}`}
                        target="_blank"
                        rel="noreferrer"
                        className="contact-link"
                      >
                        {comSumInfo.web}
                      </a>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <button
            className="back-btn"
            onClick={() => window.history.back()}
            aria-label="Back to Listings"
          >
            ← Back to Listings
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
