import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function Navigation() {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileAdminOpen, setMobileAdminOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const closeMobileNav = useCallback(() => {
    setMobileNavOpen(false);
    setMobileAdminOpen(false);
  }, []);

  // Close mobile nav on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobileNav();
        hamburgerRef.current?.focus();
      }
    };
    if (mobileNavOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileNavOpen, closeMobileNav]);

  // Focus trap: keep focus inside mobile nav when open
  useEffect(() => {
    if (!mobileNavOpen) return;
    const nav = mobileNavRef.current;
    if (!nav) return;
    const focusableSelectors =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [contenteditable], [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(nav.querySelectorAll<HTMLElement>(focusableSelectors));
    if (focusable.length === 0) return;
    focusable[0].focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [mobileNavOpen]);

  const linkClass = `${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} px-3 py-2 rounded-md text-sm font-medium transition-colors`;
  const mobileLinkClass = `${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} block px-4 py-3 rounded-md text-base font-medium transition-colors min-h-[44px] flex items-center`;

  return (
    <>
      <nav
        className={`${darkMode ? 'bg-dark/95' : 'bg-white/95'} backdrop-blur-sm fixed w-full z-50 shadow-md transition-colors duration-300`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center" onClick={closeMobileNav}>
                <img
                  src="/copilot.png"
                  alt="Copilot icon"
                  className="h-8 w-auto"
                />
                <div className="ml-2">
                  <span className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>OctoCAT Supply</span>
                  <span className="block text-xs text-primary">Smart Cat Tech, Powered by AI</span>
                </div>
              </Link>
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className={linkClass}>Home</Link>
                <Link to="/products" className={linkClass}>Products</Link>
                <Link to="/about" className={linkClass}>About us</Link>
                {isAdmin && (
                  <div className="relative">
                    <button
                      onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                      aria-expanded={adminMenuOpen}
                      aria-controls="admin-dropdown"
                      className={`${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors`}
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
                      >
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    {adminMenuOpen && (
                      <div
                        id="admin-dropdown"
                        className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${darkMode ? 'bg-dark' : 'bg-white'} ring-1 ring-black ring-opacity-5 transition-colors`}
                      >
                        <div className="py-1">
                          <Link
                            to="/admin/products"
                            className={`block px-4 py-2 text-sm ${darkMode ? 'text-light hover:bg-primary hover:text-white' : 'text-gray-700 hover:bg-primary hover:text-white'} transition-colors`}
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

            {/* Right-side controls: always visible */}
            <div className="flex items-center space-x-2">
              {/* Cart icon — always visible */}
              <Link
                to="/cart"
                aria-label={`Cart, ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
                className={`relative p-2 rounded-full transition-colors ${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'}`}
                onClick={closeMobileNav}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center" aria-hidden="true">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full focus:outline-none transition-colors"
                aria-label="Toggle dark/light mode"
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* Auth — desktop */}
              <div className="hidden md:flex items-center space-x-2">
                {isLoggedIn ? (
                  <>
                    <span className={`${darkMode ? 'text-light' : 'text-gray-700'} text-sm transition-colors`}>
                      {isAdmin && <span className="text-primary">(Admin) </span>}
                      Welcome!
                    </span>
                    <button
                      onClick={logout}
                      className={`${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                )}
              </div>

              {/* Hamburger button — mobile only */}
              <button
                ref={hamburgerRef}
                className="md:hidden p-2 rounded-md focus:outline-none transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileNavOpen}
                aria-controls="mobile-nav"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                data-testid="hamburger-button"
              >
                {mobileNavOpen ? (
                  /* X icon */
                  <svg className={`h-6 w-6 ${darkMode ? 'text-light' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  /* Hamburger icon */
                  <svg className={`h-6 w-6 ${darkMode ? 'text-light' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile nav overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-hidden="true"
          onClick={closeMobileNav}
        />
      )}

      {/* Mobile nav slide-out panel */}
      <div
        id="mobile-nav"
        ref={mobileNavRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-72 z-50 transform transition-transform duration-300 ease-in-out md:hidden
          ${mobileNavOpen ? 'translate-x-0' : 'translate-x-full'}
          ${darkMode ? 'bg-dark' : 'bg-white'} shadow-xl overflow-y-auto`}
      >
        <div className="px-4 py-4 space-y-1">
          <Link to="/" className={mobileLinkClass} onClick={closeMobileNav}>Home</Link>
          <Link to="/products" className={mobileLinkClass} onClick={closeMobileNav}>Products</Link>
          <Link to="/about" className={mobileLinkClass} onClick={closeMobileNav}>About us</Link>

          {/* Admin accordion */}
          {isAdmin && (
            <div>
              <button
                onClick={() => setMobileAdminOpen(!mobileAdminOpen)}
                aria-expanded={mobileAdminOpen}
                aria-controls="mobile-admin-menu"
                className={`${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} w-full text-left px-4 py-3 rounded-md text-base font-medium flex items-center justify-between transition-colors min-h-[44px]`}
              >
                Admin
                <svg
                  className={`h-4 w-4 transform ${mobileAdminOpen ? 'rotate-180' : ''} transition-transform`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {mobileAdminOpen && (
                <div id="mobile-admin-menu" className="ml-4 space-y-1">
                  <Link
                    to="/admin/products"
                    className={`${darkMode ? 'text-light hover:text-primary' : 'text-gray-600 hover:text-primary'} block px-4 py-3 rounded-md text-sm font-medium transition-colors min-h-[44px] flex items-center`}
                    onClick={closeMobileNav}
                  >
                    Manage Products
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4 mt-4 space-y-1`}>
            {isLoggedIn ? (
              <>
                <span className={`block px-4 py-2 text-sm ${darkMode ? 'text-light' : 'text-gray-700'}`}>
                  {isAdmin && <span className="text-primary">(Admin) </span>}
                  Welcome!
                </span>
                <button
                  onClick={() => { logout(); closeMobileNav(); }}
                  className={`${darkMode ? 'text-light hover:text-primary' : 'text-gray-700 hover:text-primary'} w-full text-left px-4 py-3 rounded-md text-base font-medium transition-colors min-h-[44px]`}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block bg-primary hover:bg-accent text-white px-4 py-3 rounded-md text-base font-medium transition-colors min-h-[44px] flex items-center justify-center"
                onClick={closeMobileNav}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}