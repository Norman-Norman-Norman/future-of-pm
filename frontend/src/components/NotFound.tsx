import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function NotFound() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 ${
        darkMode ? 'bg-dark text-white' : 'bg-gray-100 text-gray-800'
      } transition-colors duration-300`}
    >
      <div className="text-primary mb-4">
        <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="text-6xl font-extrabold text-primary mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className={`mb-8 text-center max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary hover:bg-accent text-white rounded-lg font-medium transition-colors"
      >
        Go back home
      </Link>
    </div>
  );
}
