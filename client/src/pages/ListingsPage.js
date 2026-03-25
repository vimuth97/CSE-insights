import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/listings.css";
import { fetchIndices, fetchCompanies } from "../api/market";

const fmtPrice = (n) =>
  n != null
    ? Number(n).toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "—";
const fmtMarketCap = (n) =>
  n != null ? `LKR ${(n / 1_000_000_000).toFixed(2)}B` : "—";
const fmtPct = (n) => (n != null ? `${Number(n).toFixed(2)}%` : "—");
const fmtQty = (n) => (n != null ? Number(n).toLocaleString("en-LK") : "—");
const fmtValue = (n) =>
  n != null ? `LKR ${(n / 1_000_000).toFixed(2)}M` : "—";
const fmtPctChange = (n) =>
  n != null ? `${n >= 0 ? "+" : ""}${Number(n).toFixed(4)}%` : "—";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// null-safe comparator: nulls always sort last regardless of direction
function cmp(a, b, key, dir) {
  const av = a[key],
    bv = b[key];
  if (av == null && bv == null) return 0;
  if (av == null) return 1;
  if (bv == null) return -1;
  const result = typeof av === "string" ? av.localeCompare(bv) : av - bv;
  return dir === "asc" ? result : -result;
}

export default function ListingsPage() {
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [companiesError, setCompaniesError] = useState("");

  const [idxPageSize, setIdxPageSize] = useState(10);
  const [idxPage, setIdxPage] = useState(1);
  const [idxSortKey, setIdxSortKey] = useState(null);
  const [idxSortDir, setIdxSortDir] = useState("asc");
  const [indices, setIndices] = useState([]);
  const [indicesLoading, setIndicesLoading] = useState(true);
  const [indicesError, setIndicesError] = useState("");

  useEffect(() => {
    fetchCompanies()
      .then((data) => setCompanies(data))
      .catch((err) => setCompaniesError(err.message))
      .finally(() => setCompaniesLoading(false));
    fetchIndices()
      .then((data) => setIndices(data))
      .catch((err) => setIndicesError(err.message))
      .finally(() => setIndicesLoading(false));
  }, []);

  function handleIdxSort(key) {
    if (idxSortKey === key) {
      setIdxSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setIdxSortKey(key);
      setIdxSortDir("asc");
    }
    setIdxPage(1);
  }

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  const sorted = sortKey
    ? [...companies].sort((a, b) => cmp(a, b, sortKey, sortDir))
    : companies;

  const totalEntries = sorted.length;
  const totalPages = Math.ceil(totalEntries / pageSize);
  const start = (page - 1) * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  function handlePageSize(e) {
    setPageSize(Number(e.target.value));
    setPage(1);
  }

  const idxSorted = idxSortKey
    ? [...indices].sort((a, b) => cmp(a, b, idxSortKey, idxSortDir))
    : indices;
  const idxTotal = idxSorted.length;
  const idxTotalPages = Math.ceil(idxTotal / idxPageSize);
  const idxStart = (idxPage - 1) * idxPageSize;
  const idxRows = idxSorted.slice(idxStart, idxStart + idxPageSize);

  function handleIdxPageSize(e) {
    setIdxPageSize(Number(e.target.value));
    setIdxPage(1);
  }

  // renders a sortable <th>; icon shows active sort direction
  function SortTh({ label, field }) {
    const active = sortKey === field;
    const icon = active ? (sortDir === "asc" ? " ▲" : " ▼") : " ⇅";
    return (
      <th
        scope="col"
        onClick={() => handleSort(field)}
        aria-sort={
          active ? (sortDir === "asc" ? "ascending" : "descending") : "none"
        }
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        {label}
        <span className="sort-icon" aria-hidden="true">
          {icon}
        </span>
      </th>
    );
  }

  function IdxSortTh({ label, field }) {
    const active = idxSortKey === field;
    const icon = active ? (idxSortDir === "asc" ? " ▲" : " ▼") : " ⇅";
    return (
      <th
        scope="col"
        onClick={() => handleIdxSort(field)}
        aria-sort={
          active ? (idxSortDir === "asc" ? "ascending" : "descending") : "none"
        }
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        {label}
        <span className="sort-icon" aria-hidden="true">
          {icon}
        </span>
      </th>
    );
  }

  return (
    <>
      <Header />
      {/* WCAG 2, 1.3.1: <main> landmark */}
      <main className="listings-page" aria-label="Listings">
        <div className="listings-content">
          <section aria-label="Company Directory">
            <h1 className="listings-heading">Company Directory</h1>
            {companiesLoading && <p className="loading-msg">Loading companies…</p>}
            {companiesError && <p className="error-msg">{companiesError}</p>}
            {!companiesLoading && !companiesError && <>
            <div className="table-controls">
              {/* WCAG 2, 1.3.1: label associated with select */}
              <label className="entries-label" htmlFor="page-size">
                Show
                <select
                  id="page-size"
                  className="entries-select"
                  value={pageSize}
                  onChange={handlePageSize}
                >
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                entries
              </label>
              <span className="entries-info" aria-live="polite">
                Showing {totalEntries === 0 ? 0 : start + 1}–
                {Math.min(start + pageSize, totalEntries)} of {totalEntries}{" "}
                entries
              </span>
            </div>
            {/* WCAG 2, 1.3.1: scrollable region with label for screen readers */}
            <div
              className="table-wrapper"
              role="region"
              aria-label="Company Directory table"
              tabIndex="0"
            >
              <table className="market-table">
                <thead>
                  <tr>
                    <SortTh label="Company" field="name" />
                    {/* WCAG 2, 4.1.2: non-sortable column has no aria-sort */}
                    <th scope="col">Symbol</th>
                    <SortTh label="Price (LKR)" field="price" />
                    <SortTh label="Market Cap" field="marketCap" />
                    <SortTh label="Mkt Cap %" field="marketCapPercentage" />
                    <SortTh label="Issued Qty" field="issuedQTY" />
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((c, i) => (
                    <tr
                      key={c.id}
                      className={i % 2 === 0 ? "row-odd" : "row-even"}
                    >
                      <td className="company-name">
                        <a
                          href={`/company?id=${c.id}`}
                          className="company-link"
                        >
                          {c.name}
                        </a>
                      </td>
                      <td className="company-symbol">{c.symbol}</td>
                      <td className="num">{fmtPrice(c.price)}</td>
                      <td className="num">{fmtMarketCap(c.marketCap)}</td>
                      <td className="num">{fmtPct(c.marketCapPercentage)}</td>
                      <td className="num">{fmtQty(c.issuedQTY)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* WCAG 2, 4.1.2: pagination nav with aria-label */}
            <nav
              className="pagination"
              aria-label="Company Directory pagination"
            >
              <button
                className="page-btn"
                onClick={() => setPage(1)}
                disabled={page === 1}
                aria-label="First page"
              >
                «
              </button>
              <button
                className="page-btn"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                aria-label="Previous page"
              >
                ‹
              </button>
              <span className="page-indicator" aria-current="true">
                Page {page} of {totalPages}
              </span>
              <button
                className="page-btn"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                ›
              </button>
              <button
                className="page-btn"
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                aria-label="Last page"
              >
                »
              </button>
            </nav>
            </>
            }
          </section>
          <section
            aria-label="GICS Industry Group Indices"
            className="indices-section"
          >
            <h1 className="listings-heading">GICS Industry Group Indices</h1>
            <div className="table-controls">
              {/* WCAG 2, 1.3.1: label associated with select */}
              <label className="entries-label" htmlFor="idx-page-size">
                Show
                <select
                  id="idx-page-size"
                  className="entries-select"
                  value={idxPageSize}
                  onChange={handleIdxPageSize}
                >
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                entries
              </label>
              <span className="entries-info" aria-live="polite">
                Showing {idxTotal === 0 ? 0 : idxStart + 1}–
                {Math.min(idxStart + idxPageSize, idxTotal)} of {idxTotal}{" "}
                entries
              </span>
            </div>
            {indicesLoading && <p className="loading-msg">Loading indices…</p>}
            {indicesError && <p className="error-msg">{indicesError}</p>}
            {/* WCAG 2, 1.3.1: scrollable region with label for screen readers */}
            {!indicesLoading && !indicesError && (
              <div
                className="table-wrapper"
                role="region"
                aria-label="GICS Industry Group Indices table"
                tabIndex="0"
              >
                <table className="market-table">
                  <thead>
                    <tr>
                      <th scope="col">Index Name</th>
                      <th scope="col">Index Code</th>
                      <th scope="col">GICS Code</th>
                      <th scope="col">Current Value</th>
                      <IdxSortTh label="Change %" field="percentage" />
                      <IdxSortTh
                        label="Total Volume"
                        field="sectorVolumeToday"
                      />
                      <IdxSortTh
                        label="Total Value"
                        field="sectorTurnoverToday"
                      />
                    </tr>
                  </thead>
                  <tbody>
                    {idxRows.map((idx, i) => (
                      <tr
                        key={idx.id}
                        className={i % 2 === 0 ? "row-odd" : "row-even"}
                      >
                        <td className="index-name">{idx.indexName}</td>
                        <td className="company-symbol">{idx.indexCodeSp}</td>
                        <td className="num">{idx.indexCode ?? "—"}</td>
                        <td className="num">{fmtPrice(idx.indexValue)}</td>
                        <td
                          className={`num ${
                            idx.percentage > 0
                              ? "change-up"
                              : idx.percentage < 0
                                ? "change-down"
                                : ""
                          }`}
                        >
                          {fmtPctChange(idx.percentage)}
                        </td>
                        <td className="num">{fmtQty(idx.sectorVolumeToday)}</td>
                        <td className="num">
                          {fmtValue(idx.sectorTurnoverToday)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* WCAG 2, 4.1.2: pagination nav with aria-label */}
            <nav className="pagination" aria-label="GICS Indices pagination">
              <button
                className="page-btn"
                onClick={() => setIdxPage(1)}
                disabled={idxPage === 1}
                aria-label="First page"
              >
                «
              </button>
              <button
                className="page-btn"
                onClick={() => setIdxPage((p) => p - 1)}
                disabled={idxPage === 1}
                aria-label="Previous page"
              >
                ‹
              </button>
              <span className="page-indicator" aria-current="true">
                Page {idxPage} of {idxTotalPages}
              </span>
              <button
                className="page-btn"
                onClick={() => setIdxPage((p) => p + 1)}
                disabled={idxPage === idxTotalPages}
                aria-label="Next page"
              >
                ›
              </button>
              <button
                className="page-btn"
                onClick={() => setIdxPage(idxTotalPages)}
                disabled={idxPage === idxTotalPages}
                aria-label="Last page"
              >
                »
              </button>
            </nav>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
