import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { isAuthenticated, login, isLoading, error: authError } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      await login({ email, password });
    } catch (err) {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* Theme Toggle */}
      <div className="flex justify-end p-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1..." clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0..." />
            </svg>
          )}
        </button>
      </div>

      {/* Centered Login Card */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold">ShiftTracker</h1>
            <p className="mt-2 text-lg font-medium">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email address"
              />
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              {isLoading ? (
                <span className="h-5 w-5 animate-spin border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Sign up
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-4">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} ShiftTracker, All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
