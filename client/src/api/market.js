const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function fetchMarketStatus() {
  const res = await fetch(`${BASE_URL}/api/marketStatus`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch market status.");
  return data;
}

export async function fetchMainIndices() {
  const res = await fetch(`${BASE_URL}/api/main-indices`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch main indices.");
  return data;
}

export async function fetchIndices() {
  const res = await fetch(`${BASE_URL}/api/indices`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch indices.");
  return Array.isArray(data[0]) ? data[0] : data;
}

export async function fetchMarketSummary() {
  const res = await fetch(`${BASE_URL}/api/market-summary`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch market summary.");
  return data;
}

export async function fetchTopGainers() {
  const res = await fetch(`${BASE_URL}/api/market-movers/top-gainers`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch top gainers.");
  return data;
}

export async function fetchTopLosers() {
  const res = await fetch(`${BASE_URL}/api/market-movers/top-losers`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch top losers.");
  return data;
}

export async function fetchMostActive() {
  const res = await fetch(`${BASE_URL}/api/market-movers/most-active`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch most active.");
  return data;
}

export async function fetchCompanies() {
  const res = await fetch(`${BASE_URL}/api/companies`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch companies.");
  return Array.isArray(data?.reqByMarketcap) ? data.reqByMarketcap : data;
}

export async function fetchCompany(symbol) {
  const res = await fetch(`${BASE_URL}/api/companies/${encodeURIComponent(symbol)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch company.");
  return data;
}

export async function fetchChartData(chartId) {
  const res = await fetch(`${BASE_URL}/api/main-indices/chart/${chartId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch chart data.");
  return data;
}

export async function fetchFinancials(symbol) {
  const res = await fetch(`${BASE_URL}/api/financials/${encodeURIComponent(symbol)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch financials.");
  return data;
}

export async function fetchAnalytics(symbol) {
  const res = await fetch(`${BASE_URL}/api/analytics/${encodeURIComponent(symbol)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch analytics.");
  return data;
}

export async function fetchSummarise(pdfUrl) {
  const res = await fetch(`${BASE_URL}/api/summarise`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pdfUrl }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to summarise report.");
  return data.summary;
}
