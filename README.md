# CSE Insights

A full-stack web application for analysing companies listed on the **Colombo Stock Exchange (CSE)**. It provides live market data, financial reports, AI-powered report summaries, and a scoring system to help investors make informed decisions.

---

## Features

### Market Overview

- **Live market status** — open/closed indicator with timestamp
- **Main indices** — ASPI and S&P SL20 with live values, change and percentage
- **Index performance charts** — intraday charts for ASPI and S&P SL20 in Colombo time
- **Daily market summary** — total share volume, number of trades and turnover
- **Market movers** — top gainers, top losers and most active trades with company names

### Company Directory

- Full list of CSE-listed companies sorted by market capitalisation
- Sortable columns — price, market cap, market cap %, issued quantity
- Paginated table with configurable page size
- GICS Industry Group Indices table

### Company Profile

- Company logo, name and symbol
- Financial summary — price, day range, all-time high/low, market cap, issued quantity, volume
- Turnover breakdown — today, week-to-date, month-to-date, year-to-date
- Beta values vs ASPI and S&P SL20
- Company profile — business summary, board of directors, details and contact information

### Analytics

- **Financial metrics** — Valuation (P/E, P/BV, PEG), Profitability (ROE, Net Profit Margin, Operating Margin), Growth (Revenue & Earnings Growth), Financial Health (D/E Ratio, Current Ratio)
- **Investment score** — weighted scoring model (0–100) with ratings: Strong Buy, Buy, Hold, Avoid
- **Annual reports** — paginated list with AI-powered summaries
- **Quarterly financial statements** — paginated list with AI-powered summaries
- **Company search** — search by symbol or name when accessed directly

### AI Features (Gemini)

- Summarise any financial report PDF with one click
- Extract key financial metrics from annual reports automatically
- Summaries highlight key figures and investment insights in plain language

---

## Tech Stack

### Frontend

- **React** (Create React App)
- **React Router DOM** — client-side routing
- **Recharts** — index performance charts
- **CSS** — custom styles, no UI framework

### Backend

- **Node.js + Express**
- **MySQL** — stores user accounts and extracted financial analytics
- **node-cron** — scheduled monthly analytics extraction
- **pdf-parse** — PDF text extraction
- **@google/genai** — Gemini AI integration

### External APIs

- **CSE API** (`https://www.cse.lk/api/`) — live market data
- **CSE CDN** (`https://cdn.cse.lk/`) — company logos and report PDFs
- **Google Gemini** — AI report summarisation and metric extraction

---

## Getting Started

### Prerequisites

- Node.js v18+
- MySQL 8+
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/vimuth97/CSE-insights.git
cd CSE-insights
```

### 2. Set up the database

Install and run MySQL 8+, then run the following command to create the database

```bash
mysql -u <username> -p < database/create_database.sql
```

### 3. Configure environment variables

**`server/.env`**

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=cseinsights
CSE_API_URL=https://www.cse.lk/api/
CSE_CDN_BASE=https://cdn.cse.lk/
CSE_SYMBOL_LIST_URL=https://www.cse.lk/chat/company_symbol_list.csv
GEMINI_API_KEY=your_gemini_api_key (provided in the submitted word document)
```

**`client/.env`**

```env
REACT_APP_API_URL=backend_URL (default value: http://localhost:5000)
REACT_APP_CDN_BASE=https://cdn.cse.lk/
REACT_APP_LOGO_BASE=https://cdn.cse.lk/cmt/
REACT_APP_CSE_OVERALL_PE=9.5
```

### 4. Install dependencies and start

```bash
# Backend
cd server
npm install
npm start

# Frontend (new terminal)
cd client
npm install
npm start
```

The app will be available at `http://localhost:3000`.

---

## Investment Scoring Model

Each company is scored 0–100 based on:

| Category         | Weight | Metrics                                  |
| ---------------- | ------ | ---------------------------------------- |
| Valuation        | 25%    | P/E, P/BV, PEG                           |
| Profitability    | 30%    | ROE, Net Profit Margin, Operating Margin |
| Growth           | 25%    | Revenue Growth, Earnings Growth          |
| Financial Health | 20%    | Debt/Equity Ratio, Current Ratio         |

| Score    | Rating     |
| -------- | ---------- |
| 80 – 100 | Strong Buy |
| 60 – 79  | Buy        |
| 40 – 59  | Hold       |
| < 40     | Avoid      |

---

## License

This project is for educational purposes. Market data is sourced from the Colombo Stock Exchange public API.
