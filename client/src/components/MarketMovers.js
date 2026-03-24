import { useState, useEffect, useCallback } from "react";
import "../styles/marketmovers.css";
import companiesData from "../dummy_data/companies.json";

const ALL = companiesData.reqByMarketcap;

const TOP_GAINERS = [...ALL]
  .filter((c) => c.percentageChange != null && c.percentageChange > 0)
  .sort((a, b) => b.percentageChange - a.percentageChange)
  .slice(0, 5);

const TOP_LOSERS = [...ALL]
  .filter((c) => c.percentageChange != null && c.percentageChange < 0)
  .sort((a, b) => a.percentageChange - b.percentageChange)
  .slice(0, 5);

const MOST_ACTIVE = [...ALL]
  .filter((c) => c.sharevolume != null)
  .sort((a, b) => b.sharevolume - a.sharevolume)
  .slice(0, 5);

const MOVERS_SLIDES = [
  {
    key: "gainers",
    label: "Top Gainers",
    icon: "▲",
    accent: "#4ade80",
    badgeClass: "movers-badge--gain",
    items: TOP_GAINERS,
    metricLabel: "Change",
    metricVal: (c) => Math.abs(c.percentageChange),
    metricMax: Math.max(
      ...TOP_GAINERS.map((c) => Math.abs(c.percentageChange)),
    ),
    fmt: (c) => `+${c.percentageChange.toFixed(2)}%`,
  },
  {
    key: "losers",
    label: "Top Losers",
    icon: "▼",
    accent: "#f87171",
    badgeClass: "movers-badge--loss",
    items: TOP_LOSERS,
    metricLabel: "Change",
    metricVal: (c) => Math.abs(c.percentageChange),
    metricMax: Math.max(...TOP_LOSERS.map((c) => Math.abs(c.percentageChange))),
    fmt: (c) => `${c.percentageChange.toFixed(2)}%`,
  },
  {
    key: "active",
    label: "Most Active",
    icon: "⚡",
    accent: "#c9a84c",
    badgeClass: "movers-badge--active",
    items: MOST_ACTIVE,
    metricLabel: "Share Volume",
    metricVal: (c) => c.sharevolume,
    metricMax: Math.max(...MOST_ACTIVE.map((c) => c.sharevolume)),
    fmt: (c) => `${Number(c.sharevolume).toLocaleString("en-LK")}`,
  },
];

export default function MarketMovers() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setSlide((s) => (s + 1) % MOVERS_SLIDES.length),
    [],
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [paused, next]);

  const active = MOVERS_SLIDES[slide];

  return (
    <section
      className="movers-hero"
      aria-label="Market movers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="movers-hero-inner">
        {/* Tab strip */}
        <div
          className="movers-tabs"
          role="tablist"
          aria-label="Market mover categories"
        >
          {MOVERS_SLIDES.map((s, i) => (
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
          {/* Progress bar */}
          <div className="movers-progress" aria-hidden="true">
            <div
              className={`movers-progress-bar ${paused ? "movers-progress-bar--paused" : ""}`}
              style={{ "--accent": active.accent }}
              key={slide}
            />
          </div>
        </div>

        {/* Slide content */}
        <div className="movers-slide" role="tabpanel" aria-label={active.label}>
          <div className="movers-slide-header">
            <span
              className="movers-slide-icon"
              style={{ color: active.accent }}
              aria-hidden="true"
            >
              {active.icon}
            </span>
            <h2 className="movers-slide-title" style={{ color: active.accent }}>
              {active.label}
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
              <span className="msr-metric">{active.metricLabel}</span>
              <span className="msr-price">Price (LKR)</span>
            </li>
            {active.items.map((c, i) => {
              const pct = (active.metricVal(c) / active.metricMax) * 100;
              return (
                <li key={c.id} className="movers-slide-row">
                  <span className="msr-rank" style={{ color: active.accent }}>
                    {i + 1}
                  </span>
                  <a href={`/company?id=${c.id}`} className="msr-name">
                    {c.name}
                  </a>
                  <span className="msr-symbol">{c.symbol}</span>
                  <span className="msr-metric">
                    <span className={`movers-badge ${active.badgeClass}`}>
                      {active.fmt(c)}
                    </span>
                    <span className="msr-bar-track" aria-hidden="true">
                      <span
                        className="msr-bar-fill"
                        style={{ width: `${pct}%`, background: active.accent }}
                      />
                    </span>
                  </span>
                  <span className="msr-price">
                    {Number(c.price).toLocaleString("en-LK", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Dot indicators */}
        <div className="movers-dots" role="presentation">
          {MOVERS_SLIDES.map((s, i) => (
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
