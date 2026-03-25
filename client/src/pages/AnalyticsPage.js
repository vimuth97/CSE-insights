import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/analytics.css";

export default function AnalyticsPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  return (
    <>
      <Header />
      {/* WCAG 2, 1.3.1: <main> landmark */}
      <main className="analytics-page">
        <h1>Analytics</h1>
        {id && <p>Company ID: {id}</p>}
      </main>
      <Footer />
    </>
  );
}
