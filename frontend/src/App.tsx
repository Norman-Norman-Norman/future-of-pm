import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './components/Navigation';
import Welcome from './components/Welcome';
import About from './components/About';
import Footer from './components/Footer';
import Products from './components/entity/product/Products';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import AdminProducts from './components/admin/AdminProducts';
import Cart from './components/entity/cart/Cart';
import Checkout from './components/entity/cart/Checkout';
import { useTheme } from './context/ThemeContext';
import { frontendLogger } from './logger';

// Route change logger
function RouteLogger() {
  const location = useLocation();
  useEffect(() => {
    frontendLogger.navigation(location.pathname + location.search);
  }, [location]);
  return null;
}

// Wrapper component to apply theme classes
function ThemedApp() {
  const { darkMode } = useTheme();
  frontendLogger.debug('ThemedApp', `Rendering ThemedApp (darkMode=${darkMode})`);
  
  return (
    <Router>
      <RouteLogger />
      <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} transition-colors duration-300`}>
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/launch" element={<LandingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  frontendLogger.info('App', 'Root App component rendering');
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <ThemedApp />
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
