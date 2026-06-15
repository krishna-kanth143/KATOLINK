import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AppNavbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">
          Shortify Pro
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
            aria-label="Toggle theme"
          >
            {isDark ? <FiSun /> : <FiMoon />}
          </button>

          {isAuthenticated ? (
            <>
              <nav className="hidden items-center gap-2 md:flex">
                <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
                <NavLink to="/my-urls" className="nav-link">My URLs</NavLink>
                <NavLink to="/analytics" className="nav-link">Analytics</NavLink>
                {user?.role === 'admin' && <NavLink to="/admin" className="nav-link">Admin</NavLink>}
              </nav>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <nav className="flex items-center gap-2">
              <Link to="/about" className="nav-link">About</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">Register</Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
