import { useState, useEffect, useCallback } from "react";
import "../styles/marketmovers.css";
import {
  fetchTopGainers,
  fetchTopLosers,
  fetchMostActive,
} from "../api/market";

const SLIDE_CONFIG = [
  {
    key: "gainers",
    label: "Top Gainers",
    icon: "▲",
    accent: "#4ade80",
    badgeClass: "movers-badge--gain",
    metricLabel: "Change",
    metricVal: (c) => Math.abs(c.changePercentage),
    fmt: (c) => `+${c.changePercentage.toFixed(2)}%`,
    finalLabel: "Price (LKR)",
    finalmt: (c) =>
      Number(c.price).toLocaleString("en-LK", { minimumFractionDigits: 2 }),
  },
  {
    key: "losers",
    label: "Top Losers",
    icon: "▼",
    accent: "#f87171",
    badgeClass: "movers-badge--loss",
    metricLabel: "Change",
    metricVal: (c) => Math.abs(c.changePercentage),
    fmt: (c) => `${c.changePercentage.toFixed(2)}%`,
    finalLabel: "Price (LKR)",
    finalmt: (c) =>
      Number(c.price).toLocaleString("en-LK", { minimumFractionDigits: 2 }),
  },
  {
    key: "active",
    label: "Most Active",
    icon: "⚡",
    accent: "#c9a84c",
    badgeClass: "movers-badge--active",
    metricLabel: "Trade Volume",
    metricVal: (c) => c.tradeVolume,
    fmt: (c) => Number(c.tradeVolume).toLocaleString("en-LK"),
    finalLabel: "Share Volume",
    finalmt: (c) => Number(c.shareVolume),
  },
];

export default function MarketMovers() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [data, setData] = useState({ gainers: [], losers: [], active: [] });

  useEffect(() => {
    fetchTopGainers()
      .then((d) => setData((prev) => ({ ...prev, gainers: d })))
      .catch(() => {});
    fetchTopLosers()
      .then((d) => setData((prev) => ({ ...prev, losers: d })))
      .catch(() => {});
    fetchMostActive()
      .then((d) => setData((prev) => ({ ...prev, active: d })))
      .catch(() => {});
  }, []);

  const next = useCallback(
    () => setSlide((s) => (s + 1) % SLIDE_CONFIG.length),
    [],
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [paused, next]);

  const config = SLIDE_CONFIG[slide];
  const items = data[config.key].slice(0, 5);
  const metricMax = items.length ? Math.max(...items.map(config.metricVal)) : 1;

  return (
    <section
      className="movers-hero"
      aria-label="Market movers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="movers-hero-inner">
        <div
          className="movers-tabs"
          role="tablist"
          aria-label="Market mover categories"
        >
          {SLIDE_CONFIG.map((s, i) => (
            <button
              key={s.key}
              role="tab"
              aria-selected={i === slide}
              className={`movers-tab ${i === slide ? "movers-tab--active" : ""}`}
              style={{ "--accent": s.accent }}
              onClick={() => {
                setSlide(i);
                setPaused(true);
              }}
            >
              <span aria-hidden="true">{s.icon}</span> {s.label}
            </button>
          ))}
          <div className="movers-progress" aria-hidden="true">
            <div
              className={`movers-progress-bar ${paused ? "movers-progress-bar--paused" : ""}`}
              style={{ "--accent": config.accent }}
              key={slide}
            />
          </div>
        </div>

        <div className="movers-slide" role="tabpanel" aria-label={config.label}>
          <div className="movers-slide-header">
            <span
              className="movers-slide-icon"
              style={{ color: config.accent }}
              aria-hidden="true"
            >
              {config.icon}
            </span>
            <h2 className="movers-slide-title" style={{ color: config.accent }}>
              {config.label}
            </h2>
          </div>
          <ul className="movers-slide-list">
            <li
              className="movers-slide-row movers-slide-row--head"
              aria-hidden="true"
            >
              <span className="msr-rank">#</span>
              <span className="msr-name">Company</span>
              <span className="msr-symbol">Symbol</span>
              <span className="msr-metric">{config.metricLabel}</span>
              <span className="msr-price">{config.finalLabel}</span>
            </li>
            {items.map((c, i) => {
              const pct = (config.metricVal(c) / metricMax) * 100;
              return (
                <li key={c.id} className="movers-slide-row">
                  <span className="msr-rank" style={{ color: config.accent }}>
                    {i + 1}
                  </span>
                  <a href={`/company?id=${c.securityId}`} className="msr-name">
                    {c.symbol}
                  </a>
                  <span className="msr-symbol">{c.symbol}</span>
                  <span className="msr-metric">
                    <span className={`movers-badge ${config.badgeClass}`}>
                      {config.fmt(c)}
                    </span>
                    <span className="msr-bar-track" aria-hidden="true">
                      <span
                        className="msr-bar-fill"
                        style={{ width: `${pct}%`, background: config.accent }}
                      />
                    </span>
                  </span>
                  <span className="msr-price">{config.finalmt(c)}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="movers-dots" role="presentation">
          {SLIDE_CONFIG.map((s, i) => (
            <button
              key={s.key}
              className={`movers-dot ${i === slide ? "movers-dot--active" : ""}`}
              style={{ "--accent": s.accent }}
              onClick={() => {
                setSlide(i);
                setPaused(true);
              }}
              aria-label={`Go to ${s.label}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
