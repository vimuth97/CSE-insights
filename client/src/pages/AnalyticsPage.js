import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/analytics.css";
import "../styles/company.css";
import { fetchCompany, fetchFinancials, fetchSummarise } from "../api/market";

const LOGO_BASE = "https://cdn.cse.lk/cmt/";
const CDN_BASE = "https://cdn.cse.lk/";

const byUploadedDesc = (a, b) => b.manualDate - a.manualDate;

const fmtDate = (ts) =>
  new Date(ts).toLocaleDateString("en-LK", { dateStyle: "medium" });

function formatSummary(text) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        <br />
      </span>
    );
  });
}

function ReportItem({ r }) {
  const [summary, setSummary] = useState("");
  const [summarising, setSummarising] = useState(false);
  const [sumError, setSumError] = useState("");

  async function handleSummarise() {
    setSummarising(true);
    setSumError("");
    setSummary("");
    try {
      const text = await fetchSummarise(`${CDN_BASE}${r.path}`);
      setSummary(text);
    } catch (err) {
      setSumError(err.message);
    } finally {
      setSummarising(false);
    }
  }

  return (
    <li key={r.id} className="report-item">
      <div className="report-item-row">
        <a href={`${CDN_BASE}${r.path}`} target="_blank" rel="noreferrer" className="report-link">
          <span className="report-icon" aria-hidden="true">📄</span>
          <span className="report-text">{r.fileText}</span>
        </a>
        <span className="report-date">{fmtDate(r.manualDate)}</span>
        <button
          className="summarise-btn"
          onClick={handleSummarise}
          disabled={summarising}
        >
          {summarising ? "Summarising…" : "Summarise"}
        </button>
      </div>
      {sumError && <p className="gemini-error">{sumError}</p>}
      {summary && (
        <div className="report-summary">
          <p className="report-summary-text">{formatSummary(summary)}</p>
        </div>
      )}
    </li>
  );
}

function ReportList({ reports, loading, error }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => { setPage(1); }, [reports]);

  if (loading) return <p className="loading-msg">Loading…</p>;
  if (error) return <p className="error-msg">{error}</p>;
  if (!reports.length) return <p className="report-empty">No reports available.</p>;

  const totalPages = Math.ceil(reports.length / pageSize);
  const pageRows = reports.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <div className="table-controls">
        <label className="entries-label">
          Show
          <select
            className="entries-select"
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
          >
            {[5, 10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          entries
        </label>
        <span className="entries-info">
          Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, reports.length)} of {reports.length}
        </span>
      </div>
      <ul className="report-list">
        {pageRows.map((r) => (
          <ReportItem key={r.id} r={r} />
        ))}
      </ul>
      {totalPages > 1 && (
        <nav className="pagination" aria-label="Report pagination">
          <button className="page-btn" onClick={() => setPage(1)} disabled={page === 1} aria-label="First page">«</button>
          <button className="page-btn" onClick={() => setPage((p) => p - 1)} disabled={page === 1} aria-label="Previous page">‹</button>
          <span className="page-indicator" aria-current="true">Page {page} of {totalPages}</span>
          <button className="page-btn" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages} aria-label="Next page">›</button>
          <button className="page-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages} aria-label="Last page">»</button>
        </nav>
      )}
    </>
  );
}

export default function AnalyticsPage() {
  const params = new URLSearchParams(window.location.search);
  const symbol = params.get("symbol");

  const [company, setCompany] = useState(null);
  const [annualReports, setAnnualReports] = useState([]);
  const [quarterlyReports, setQuarterlyReports] = useState([]);
  const [finLoading, setFinLoading] = useState(true);
  const [finError, setFinError] = useState("");

  useEffect(() => {
    if (!symbol) return;
    fetchCompany(symbol)
      .then((data) => setCompany(data))
      .catch(() => {});
    fetchFinancials(symbol)
      .then((data) => {
        const annual = [...(data.infoAnnualData ?? [])].sort(byUploadedDesc);
        const quarterly = [...(data.infoQuarterlyData ?? [])].sort(byUploadedDesc);
        setAnnualReports(annual);
        setQuarterlyReports(quarterly);
      })
      .catch((err) => setFinError(err.message))
      .finally(() => setFinLoading(false));
  }, [symbol]);

  return (
    <>
      <Header />
      <main className="analytics-page">
        <div className="analytics-content">
          {company && (
            <div className="company-header">
              {company.logo ? (
                <img
                  className="company-logo"
                  src={`${LOGO_BASE}${company.logo}`}
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
          )}

          <section className="page-section" aria-label="Annual Reports">
            <h2 className="page-section-heading">Annual Reports</h2>
            <ReportList
              reports={annualReports}
              loading={finLoading}
              error={finError}
            />
          </section>

          <section
            className="page-section"
            aria-label="Quarterly Financial Statements"
          >
            <h2 className="page-section-heading">
              Quarterly Financial Statements
            </h2>
            <ReportList
              reports={quarterlyReports}
              loading={finLoading}
              error={finError}
            />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
