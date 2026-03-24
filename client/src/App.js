import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import GeminiPage from './pages/GeminiPage';
import CompanyPage from './pages/CompanyPage';
import AnalyticsPage from './pages/AnalyticsPage';

// TODO: replace with a router (e.g. react-router-dom)
const path = window.location.pathname;

function App() {
  if (path === '/signup') return <SignUpPage />;
  if (path === '/home') return <HomePage />;
  if (path === '/listings') return <ListingsPage />;
  if (path === '/gemini') return <GeminiPage />;
  if (path === '/company') return <CompanyPage />;
  if (path === '/analytics') return <AnalyticsPage />;
  return <LoginPage />;
}

export default App;
