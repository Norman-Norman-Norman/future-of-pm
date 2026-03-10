import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { darkMode } = useTheme();
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
      <div className="max-w-3xl mx-auto text-center py-20">
        <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
          Welcome to OctoCAT Supply
        </h1>
        <Link to="/products" className="inline-block bg-primary hover:bg-accent text-white font-semibold py-3 px-8 rounded-lg transition-colors">
          Get Started
        </Link>
      </div>
    </div>
  );
}
