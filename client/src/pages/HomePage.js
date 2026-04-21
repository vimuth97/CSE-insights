import React, { useState, useEffect } from "react";
import "../styles/home.css";
import IndexChart from "../components/IndexChart";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MarketMovers from "../components/MarketMovers";
import {
  fetchMarketStatus,
  fetchMainIndices,
  fetchMarketSummary,
  fetchChartData,
} from "../api/market";

const fmt = (n) => n.toLocaleString("en-LK");
const fmtCurrency = (n) => `LKR ${(n / 1_000_000).toFixed(2)}M`;

const toChartPoints = (data) => (Array.isArray(data) ? data : []);

export default function HomePage() {
  const [marketData, setMarketData] = useState(null);
  const [indices, setIndices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [aspiChart, setAspiChart] = useState([]);
  const [sl20Chart, setSl20Chart] = useState([]);

  useEffect(() => {
    fetchMarketStatus()
      .then(setMarketData)
      .catch(() => {});
    fetchMainIndices()
      .then(setIndices)
      .catch(() => {});
    fetchMarketSummary()
      .then(setSummary)
      .catch(() => {});
    fetchChartData(1)
      .then((d) => setAspiChart(toChartPoints(d)))
      .catch(() => {});
    fetchChartData(40)
      .then((d) => setSl20Chart(toChartPoints(d)))
      .catch(() => {});
  }, []);

  const timestamp = new Date();
  const isOpen = marketData?.marketStatus === "Market Opened";
  const statusLabel = isOpen ? "Open" : "Closed";

  return (
    <>
      <Header />
      <main className="home-page" aria-label="CSE market dashboard">
        {/* ── Market Movers Carousel ── */}
        <MarketMovers />
        <div className="home-content">
          <section className="status-section" aria-label="Market status">
            <h2 className="section-heading">Market Status</h2>
            <div className="status-card">
              <span
                className={`market-badge ${isOpen ? "badge-open" : "badge-closed"}`}
                aria-label={`Market is currently ${statusLabel}`}
              >
                <span className="badge-dot" aria-hidden="true" />
                Market {statusLabel}
              </span>
              <p
                className="home-date"
                aria-label={`Market data for ${timestamp.toLocaleDateString("en-LK", { dateStyle: "long" })}`}
              >
                {timestamp.toLocaleDateString("en-LK", { dateStyle: "long" })}{" "}
                {timestamp.toLocaleTimeString("en-LK", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>
          </section>

          {/* ── Daily Stats ── */}
          <section
            className="stats-section"
            aria-label="Daily market statistics"
          >
            <div className="section-heading-row">
              <h2 className="section-heading">Daily Market Summary</h2>
              {summary?.tradeDate && (
                <p className="summary-date">
                  {"("}
                  {new Date(summary.tradeDate).toLocaleDateString("en-LK", {
                    dateStyle: "long",
                  })}
                  {")"}
                </p>
              )}
            </div>
            <div className="stats-grid">
              <article className="stat-card" aria-label="Share volume">
                <span className="stat-icon" aria-hidden="true">
                  📊
                </span>
                <p className="stat-label">Share Volume</p>
                <strong className="stat-value">
                  {summary?.volumeOfTurnOverNumber != null
                    ? fmt(summary.volumeOfTurnOverNumber)
                    : "—"}
                </strong>
                <p className="stat-unit">Shares</p>
              </article>

              <article className="stat-card" aria-label="Number of trades">
                <span className="stat-icon" aria-hidden="true">
                  🔄
                </span>
                <p className="stat-label">No. of Trades</p>
                <strong className="stat-value">
                  {summary?.marketTrades != null
                    ? fmt(summary.marketTrades)
                    : "—"}
                </strong>
                <p className="stat-unit">Transactions</p>
              </article>

              <article className="stat-card" aria-label="Turnover for the day">
                <span className="stat-icon" aria-hidden="true">
                  💰
                </span>
                <p className="stat-label">Turnover</p>
                <strong className="stat-value">
                  {summary?.marketTurnover != null
                    ? fmtCurrency(summary.marketTurnover)
                    : "—"}
                </strong>
                <p className="stat-unit">For the Day</p>
              </article>
            </div>
          </section>

          {/* ── Indices ── */}
          <section className="indices-section" aria-label="Market indices">
            <h2 className="section-heading">Market Indices</h2>
            <div className="indices-grid">
              {indices.map((index) => {
                const isPositive = index.change >= 0;
                return (
                  <article
                    key={index.id}
                    className="index-card"
                    aria-label={`${index.indexName}: ${index.indexValue}, ${isPositive ? "up" : "down"} ${Math.abs(index.percentage).toFixed(2)}%`}
                  >
                    <div className="index-header">
                      <div>
                        <p className="index-name">{index.symbol}</p>
                        <p className="index-full-name">{index.indexName}</p>
                      </div>
                      <span
                        className={`index-change ${isPositive ? "change-up" : "change-down"}`}
                        aria-hidden="true"
                      >
                        {isPositive ? "▲" : "▼"}{" "}
                        {Math.abs(index.percentage).toFixed(2)}%
                      </span>
                    </div>
                    <p className="index-value">
                      {Number(index.indexValue).toLocaleString("en-LK", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p
                      className={`index-points ${isPositive ? "change-up" : "change-down"}`}
                    >
                      {isPositive ? "+" : ""}
                      {Number(index.change).toFixed(2)} pts
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          {/* ── Index Charts ── */}
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
                <IndexChart
                  data={aspiChart}
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
                <IndexChart
                  data={sl20Chart}
                  dataKey="value"
                  name="S&P SL20"
                  color="#c9a84c"
                />
              </article>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
