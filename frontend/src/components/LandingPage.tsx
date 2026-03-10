import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark text-white' : 'bg-gray-100 text-gray-800'} flex flex-col items-center justify-center transition-colors duration-300`}>
      <h1 className="text-4xl font-bold mb-4">Welcome to OctoCAT Supply</h1>
      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8 text-lg`}>
        Your premier source for smart cat technology.
      </p>
      <button
        onClick={() => navigate('/products')}
        className="bg-primary hover:bg-accent text-white px-8 py-3 rounded-md font-medium transition-colors"
      >
        Shop Now
      </button>
    </div>
  );
}
