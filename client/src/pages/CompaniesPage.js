import companiesData from "../dummy_data/companies.json";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/companies.css";

const fmtPrice = (n) =>
  n != null
    ? Number(n).toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "—";
const fmtMarketCap = (n) =>
  n != null ? `LKR ${(n / 1_000_000_000).toFixed(2)}B` : "—";
const fmtPct = (n) => (n != null ? `${Number(n).toFixed(4)}%` : "—");
const fmtQty = (n) => (n != null ? Number(n).toLocaleString("en-LK") : "—");

const COMPANIES = companiesData.reqByMarketcap;

export default function CompaniesPage() {
  return (
    <>
      <Header />
      {/* WCAG 2, 1.3.1: <main> landmark */}
      <main className="companies-page" aria-label="Companies">
        <div className="companies-content">
          <section aria-label="Company Directory">
            <h1 className="companies-heading">Company Directory</h1>
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
                    <th scope="col">Company</th>
                    <th scope="col">Symbol</th>
                    <th scope="col">Price (LKR)</th>
                    <th scope="col">Market Cap</th>
                    <th scope="col">Mkt Cap %</th>
                    <th scope="col">Issued Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPANIES.map((c) => (
                    <tr key={c.id}>
                      <td className="company-name">{c.name}</td>
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
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
