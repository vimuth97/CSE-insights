import "../styles/header.css";

const path = window.location.pathname;

export default function Header() {
  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        <a href="/home" className="header-brand" aria-label="CSE Insights home">
          {/* decorative icon hidden from assistive tech */}
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
        {/* nav landmark with aria-label */}
        {/* aria-current="page" identifies active link for screen readers */}
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
