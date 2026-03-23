import "../styles/header.css";

// WCAG 2, 1.3.1: <header> landmark with nav for screen reader navigation
export default function Header() {
  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        <a href="/home" className="header-brand" aria-label="CSE Insights home">
          {/* WCAG 2, 1.1.1: decorative icon hidden from assistive tech */}
          <span className="header-logo" aria-hidden="true">📈</span>
          <div>
            <span className="header-title">CSE Insights</span>
            <span className="header-subtitle">Colombo Stock Exchange</span>
          </div>
        </a>
        {/* WCAG 2, 1.3.1: nav landmark with aria-label */}
        <nav className="header-nav" aria-label="Main navigation">
          <a href="/home" className="nav-link">Home</a>
          <a href="/markets" className="nav-link">Markets</a>
          <a href="/news" className="nav-link">News</a>
        </nav>
      </div>
    </header>
  );
}
