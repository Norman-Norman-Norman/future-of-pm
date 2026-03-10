import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark text-light' : 'bg-gray-100 text-gray-800'} pt-20 px-4 flex items-center justify-center transition-colors duration-300`}>
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-primary">OctoCAT</span> Supply
        </h1>
        <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Smart Cat Tech, Powered by AI
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products"
            className="bg-primary hover:bg-accent text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Browse Products
          </Link>
          <Link
            to="/deliveries"
            className={`px-8 py-3 rounded-lg font-semibold border-2 border-primary transition-colors ${darkMode ? 'text-light hover:bg-primary hover:text-white' : 'text-primary hover:bg-primary hover:text-white'}`}
          >
            Track Deliveries
          </Link>
        </div>
      </div>
    </div>
  );
}
