import "../styles/home.css";
import IndexChart from "../components/IndexChart";
import Carousel from "../components/Carousel";

// Mock data — replace with API calls
const MARKET_DATA = {
  status: "Open",
  date: "2025-07-14",
  shareVolume: 42_318_500,
  trades: 8_742,
  turnover: 1_284_650_000,
};

const INDICES = [
  {
    id: "aspi",
    name: "ASPI",
    fullName: "All Share Price Index",
    value: 13_842.56,
    change: 124.32,
    changePercent: 0.91,
  },
  {
    id: "sl20",
    name: "S&P SL20",
    fullName: "S&P Sri Lanka 20 Index",
    value: 4_218.74,
    change: -38.15,
    changePercent: -0.9,
  },
];

const fmt = (n) => n.toLocaleString("en-LK");
const fmtCurrency = (n) => `LKR ${(n / 1_000_000).toFixed(2)}M`;

// Mock historical data — replace with API calls
const ASPI_HISTORY = [
  { date: "Jul 1", value: 13_540.2 },
  { date: "Jul 2", value: 13_612.45 },
  { date: "Jul 3", value: 13_580.1 },
  { date: "Jul 4", value: 13_650.8 },
  { date: "Jul 7", value: 13_720.35 },
  { date: "Jul 8", value: 13_695.6 },
  { date: "Jul 9", value: 13_760.9 },
  { date: "Jul 10", value: 13_800.15 },
  { date: "Jul 11", value: 13_718.4 },
  { date: "Jul 14", value: 13_842.56 },
];

const SL20_HISTORY = [
  { date: "Jul 1", value: 4_310.5 },
  { date: "Jul 2", value: 4_285.3 },
  { date: "Jul 3", value: 4_300.75 },
  { date: "Jul 4", value: 4_260.2 },
  { date: "Jul 7", value: 4_240.9 },
  { date: "Jul 8", value: 4_275.6 },
  { date: "Jul 9", value: 4_290.1 },
  { date: "Jul 10", value: 4_310.45 },
  { date: "Jul 11", value: 4_256.89 },
  { date: "Jul 14", value: 4_218.74 },
];

export default function HomePage() {
  const isOpen = MARKET_DATA.status === "Open";

  return (
    // WCAG 2, 1.3.1: <main> landmark for screen reader navigation
    <main className="home-page" aria-label="CSE market dashboard">
      {/* ── Header ── */}
      <header className="home-header">
        {/* WCAG 2, 1.1.1: decorative icon hidden from assistive tech */}
        <span className="home-logo" aria-hidden="true">
          📈
        </span>
        <div>
          {/* SEO: h1 with primary keyword */}
          <h1 className="home-title">CSE Insights</h1>
          <p className="home-subtitle">Colombo Stock Exchange</p>
        </div>
      </header>
      <Carousel />
      {/* ── Carousel: news and announcements ── */}
      <div className="home-content">
        {/* ── Market Status ── */}
        {/* WCAG 2, 1.3.1: section with descriptive aria-label as region landmark */}
        <section className="status-section" aria-label="Market status">
          <h2 className="section-heading">Market Status</h2>
          {/* WCAG 2, 1.3.1: aria-label conveys market status beyond color */}
          <div className="status-card">
            <span
              className={`market-badge ${isOpen ? "badge-open" : "badge-closed"}`}
              aria-label={`Market is currently ${MARKET_DATA.status}`}
            >
              {/* WCAG 2, 1.4.1: status uses text + color, not color alone */}
              <span className="badge-dot" aria-hidden="true" />
              Market {MARKET_DATA.status}
            </span>
            {/* SEO: date context for crawlers */}
            <p
              className="home-date"
              aria-label={`Market data for ${MARKET_DATA.date}`}
            >
              {new Date(MARKET_DATA.date).toLocaleDateString("en-LK", {
                dateStyle: "long",
              })}
            </p>
          </div>
        </section>

        {/* ── Daily Stats ── */}
        {/* WCAG 2, 1.3.1: section with descriptive aria-label as region landmark */}
        <section className="stats-section" aria-label="Daily market statistics">
          <h2 className="section-heading">Today's Market</h2>
          <div className="stats-grid">
            <article className="stat-card" aria-label="Share volume">
              {/* WCAG 2, 1.1.1: decorative icons hidden */}
              <span className="stat-icon" aria-hidden="true">
                📊
              </span>
              <p className="stat-label">Share Volume</p>
              {/* WCAG 2, 1.3.1: <strong> conveys importance semantically */}
              <strong className="stat-value">
                {fmt(MARKET_DATA.shareVolume)}
              </strong>
              <p className="stat-unit">Shares</p>
            </article>

            <article className="stat-card" aria-label="Number of trades">
              <span className="stat-icon" aria-hidden="true">
                🔄
              </span>
              <p className="stat-label">No. of Trades</p>
              <strong className="stat-value">{fmt(MARKET_DATA.trades)}</strong>
              <p className="stat-unit">Transactions</p>
            </article>

            <article className="stat-card" aria-label="Turnover for the day">
              <span className="stat-icon" aria-hidden="true">
                💰
              </span>
              <p className="stat-label">Turnover</p>
              <strong className="stat-value">
                {fmtCurrency(MARKET_DATA.turnover)}
              </strong>
              <p className="stat-unit">For the Day</p>
            </article>
          </div>
        </section>

        {/* ── Indices ── */}
        {/* WCAG 2, 1.3.1: section with descriptive aria-label as region landmark */}
        <section className="indices-section" aria-label="Market indices">
          <h2 className="section-heading">Market Indices</h2>
          <div className="indices-grid">
            {INDICES.map((index) => {
              const isPositive = index.change >= 0;
              return (
                <article
                  key={index.id}
                  className="index-card"
                  // WCAG 2, 1.3.1: full context for screen readers including direction
                  aria-label={`${index.fullName}: ${index.value}, ${isPositive ? "up" : "down"} ${Math.abs(index.changePercent)}%`}
                >
                  <div className="index-header">
                    <div>
                      <p className="index-name">{index.name}</p>
                      <p className="index-full-name">{index.fullName}</p>
                    </div>
                    {/* WCAG 2, 1.4.1: change uses arrow symbol + color, not color alone */}
                    <span
                      className={`index-change ${isPositive ? "change-up" : "change-down"}`}
                      aria-hidden="true"
                    >
                      {isPositive ? "▲" : "▼"} {Math.abs(index.changePercent)}%
                    </span>
                  </div>
                  <p className="index-value">
                    {index.value.toLocaleString("en-LK", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p
                    className={`index-points ${isPositive ? "change-up" : "change-down"}`}
                  >
                    {isPositive ? "+" : ""}
                    {index.change.toFixed(2)} pts
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── Index Charts ── */}
        {/* WCAG 2, 1.3.1: section with descriptive aria-label as region landmark */}
        <section
          className="charts-section"
          aria-label="Index performance charts"
        >
          <h2 className="section-heading">Index Performance</h2>
          <div className="charts-grid">
            <article className="chart-card">
              <div className="chart-card-header">
                <p className="chart-card-name">ASPI</p>
                <p className="chart-card-fullname">All Share Price Index</p>
              </div>
              {/* WCAG 2, 1.1.1: aria-label on chart wrapper provides text alternative */}
              <IndexChart
                data={ASPI_HISTORY}
                dataKey="value"
                name="ASPI"
                color="#003087"
              />
            </article>

            <article className="chart-card">
              <div className="chart-card-header">
                <p className="chart-card-name">S&amp;P SL20</p>
                <p className="chart-card-fullname">
                  S&amp;P Sri Lanka 20 Index
                </p>
              </div>
              {/* WCAG 2, 1.1.1: aria-label on chart wrapper provides text alternative */}
              <IndexChart
                data={SL20_HISTORY}
                dataKey="value"
                name="S&P SL20"
                color="#c9a84c"
              />
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
