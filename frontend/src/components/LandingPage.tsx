import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { darkMode } = useTheme();
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark text-light' : 'bg-gray-100 text-gray-800'} pt-20 flex flex-col items-center justify-center`}>
      <h1 className="text-4xl font-bold mb-4">Welcome to OctoCAT Supply</h1>
      <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Smart Cat Tech, Powered by AI</p>
      <Link to="/products" className="bg-primary hover:bg-accent text-white font-semibold py-3 px-8 rounded-lg transition-colors">
        Shop Now
      </Link>
    </div>
  );
}
