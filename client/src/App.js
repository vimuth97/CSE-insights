import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';

// TODO: replace with a router (e.g. react-router-dom)
const path = window.location.pathname;

function App() {
  if (path === '/signup') return <SignUpPage />;
  if (path === '/home') return <HomePage />;
  return <LoginPage />;
}

export default App;
