import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

export default function Navigation() {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  return (
    <nav aria-label="Main navigation" className={`${darkMode ? 'bg-dark/95' : 'bg-white/95'} backdrop-blur-sm fixed w-full z-50 shadow-md transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/copilot.png" 
                alt="OctoCAT Supply home"
                className="h-8 w-auto"
              />
              <div className="ml-2">
                <span className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>OctoCAT Supply</span>
                <span className="block text-xs text-primary">Smart Cat Tech, Powered by AI</span>
              </div>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className={`${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary`}>Home</Link>
              <Link to="/products" className={`${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary`}>Products</Link>
              <Link to="/about" className={`${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary`}>About us</Link>
              {isAdmin && (
                <div className="relative">
                  <button 
                    onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                    aria-expanded={adminMenuOpen}
                    aria-haspopup="true"
                    aria-controls="admin-menu"
                    className={`${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary`}
                  >
                    Admin
                    <svg 
                      className={`ml-1 h-4 w-4 transform ${adminMenuOpen ? 'rotate-180' : ''} transition-transform`}
                      fill="none" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  {adminMenuOpen && (
                    <div
                      id="admin-menu"
                      role="menu"
                      className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${darkMode ? 'bg-dark' : 'bg-white'} ring-1 ring-black ring-opacity-5 transition-colors`}
                    >
                      <div className="py-1">
                        <Link
                          to="/admin/products"
                          role="menuitem"
                          className={`block px-4 py-2 text-sm ${darkMode ? 'text-light hover:bg-primary hover:text-white' : 'text-gray-700 hover:bg-primary hover:text-white'} transition-colors focus:outline-none focus:bg-primary focus:text-white`}
                          onClick={() => setAdminMenuOpen(false)}
                        >
                          Manage Products
                        </Link>
                        {/* Space for other entity management links */}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            {isLoggedIn ? (
              <>
                <span className={`${darkMode ? 'text-light' : 'text-gray-700'} text-sm transition-colors`}>
                  {isAdmin && <span className="text-primary">(Admin) </span>}
                  Welcome!
                </span>
                <button 
                  onClick={logout}
                  aria-label="Logout"
                  className={`${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary`}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}