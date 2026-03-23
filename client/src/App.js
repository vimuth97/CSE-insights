import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import CompaniesPage from './pages/CompaniesPage';

// TODO: replace with a router (e.g. react-router-dom)
const path = window.location.pathname;

function App() {
  if (path === '/signup') return <SignUpPage />;
  if (path === '/home') return <HomePage />;
  if (path === '/companies') return <CompaniesPage />;
  return <LoginPage />;
}

export default App;
