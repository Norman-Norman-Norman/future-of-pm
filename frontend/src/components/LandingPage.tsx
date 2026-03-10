import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { darkMode } = useTheme();
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark text-light' : 'bg-gray-100 text-gray-800'} pt-20 flex items-center justify-center`}>
      <h1 className="text-3xl font-bold">Welcome to OctoCAT Supply</h1>
    </div>
  );
}
