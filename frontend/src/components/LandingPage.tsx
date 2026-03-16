import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 flex items-center justify-center`}>
      <div className="text-center max-w-2xl mx-auto">
        <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
          Welcome to OctoCAT Supply
        </h1>
        <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Your one-stop B2B supply chain solution for smart cat technology products.
        </p>
        <Link
          to="/products"
          className="bg-primary hover:bg-accent text-white font-semibold py-3 px-8 rounded-lg transition-colors text-lg"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
