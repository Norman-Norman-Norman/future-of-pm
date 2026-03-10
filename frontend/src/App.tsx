import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { ToastProvider } from './context/ToastContext';
import AdminProducts from './components/admin/AdminProducts';
import Cart from './components/entity/cart/Cart';
import Checkout from './components/entity/cart/Checkout';
import ErrorBoundary from './components/ErrorBoundary';
import OfflineBanner from './components/OfflineBanner';
import ToastContainer from './components/ToastContainer';
import NotFound from './components/NotFound';
import { useTheme } from './context/ThemeContext';

// Wrapper component to apply theme classes
function ThemedApp() {
  const { darkMode } = useTheme();
  
  return (
    <Router>
      <OfflineBanner />
      <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} transition-colors duration-300`}>
        <Navigation />
        <main className="flex-grow">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/launch" element={<LandingPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
      <ToastContainer />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <ToastProvider>
            <ThemedApp />
          </ToastProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
