import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AnalyticsPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  return (
    <>
      <Header />
      {/* WCAG 2, 1.3.1: <main> landmark */}
      <main style={{ minHeight: "80vh", padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Analytics</h1>
        {id && <p>Company ID: {id}</p>}
      </main>
      <Footer />
    </>
  );
}
