import "../styles/header.css";

const path = window.location.pathname;

// WCAG 2, 1.3.1: <header> landmark with nav for screen reader navigation
export default function Header() {
  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        <a href="/home" className="header-brand" aria-label="CSE Insights home">
          {/* WCAG 2, 1.1.1: decorative icon hidden from assistive tech */}
          <span className="header-logo" aria-hidden="true">
            📈
          </span>
          <div>
            <span className="header-title">CSE Insights</span>
            <span className="header-subtitle">
              Colombo Stock Exchange Analytics
            </span>
          </div>
        </a>
        {/* WCAG 2, 1.3.1: nav landmark with aria-label */}
        {/* WCAG 2, 4.1.2: aria-current="page" identifies active link for screen readers */}
        <nav className="header-nav" aria-label="Main navigation">
          {[
            ["/home", "Home"],
            ["/listings", "Listings"],
            ["/analytics", "Analytics"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className={`nav-link${path === href ? " nav-link-active" : ""}`}
              aria-current={path === href ? "page" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
