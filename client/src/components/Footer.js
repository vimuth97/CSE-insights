import "../styles/footer.css";

const YEAR = new Date().getFullYear();

// WCAG 2, 1.3.1: <footer> landmark for screen reader navigation
export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo" aria-hidden="true">
            📈
          </span>
          <span className="footer-title">CSE Insights</span>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <a href="/home" className="footer-link">
            Home
          </a>
          <a href="/markets" className="footer-link">
            Markets
          </a>
          <a href="/analytics" className="footer-link">
            Analytics
          </a>
        </nav>
        <p className="footer-copy">
          © {YEAR} Colombo Stock Exchange Analytics. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
