import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

// TODO: replace with a router (e.g. react-router-dom)
const path = window.location.pathname;

function App() {
  if (path === '/signup') return <SignUpPage />;
  return <LoginPage />;
}

export default App;
