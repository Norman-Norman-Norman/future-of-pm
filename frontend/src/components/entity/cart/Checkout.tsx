import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useCart } from '../../../context/CartContext';
import { frontendLogger } from '../../../logger';

const DISCOUNT_RATE = 0.05;
const SHIPPING_COST = 10;

export default function Checkout() {
  const { darkMode } = useTheme();
  const { items, clearCart } = useCart();

  useEffect(() => {
    frontendLogger.componentMount('Checkout');
    return () => frontendLogger.componentUnmount('Checkout');
  }, []);

  useEffect(() => {
    frontendLogger.info('Checkout', `Checkout items: ${items.length}`, {
      items: items.map(i => ({ name: i.name, qty: i.quantity, price: i.price }))
    });
  }, [items]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * DISCOUNT_RATE;
  const shipping = items.length > 0 ? SHIPPING_COST : 0;
  const grandTotal = subtotal - discount + shipping;

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-3xl mx-auto text-center py-20">
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-light' : 'text-gray-800'}`}>No items to checkout</h2>
          <Link to="/products" className="inline-block bg-primary hover:bg-accent text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-3xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-light' : 'text-gray-800'}`}>Checkout</h1>

        <div className={`rounded-lg border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-primary/30 bg-white'} overflow-hidden mb-6`}>
          <div className={`px-6 py-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Order Review</h2>
          </div>
          <div className="px-6 py-4">
            {items.map(item => (
              <div key={item.productId} className={`flex justify-between items-center py-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b last:border-b-0`}>
                <div className="flex items-center gap-4">
                  <img src={`/${item.imgName}`} alt={item.name} className="w-12 h-12 object-contain" />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>{item.name}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-lg border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-primary/30 bg-white'} overflow-hidden mb-6`}>
          <div className="px-6 py-5 space-y-3">
            <div className="flex justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Subtotal</span>
              <span className={darkMode ? 'text-light' : 'text-gray-800'}>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Discount (5%)</span>
              <span className="text-red-400">-${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Shipping</span>
              <span className={darkMode ? 'text-light' : 'text-gray-800'}>${shipping.toFixed(2)}</span>
            </div>
            <div className={`flex justify-between pt-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
              <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Total</span>
              <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Link to="/cart" className={`flex-1 text-center py-3.5 rounded-full font-bold transition-colors border-2 border-primary text-primary hover:bg-primary hover:text-white`}>
            Back to Cart
          </Link>
          <button
            onClick={() => {
              frontendLogger.userAction('Place order', {
                itemCount: items.length,
                grandTotal,
                items: items.map(i => ({ name: i.name, qty: i.quantity }))
              });
              clearCart();
              alert('Order placed successfully!');
            }}
            className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-bold py-3.5 rounded-full transition-all duration-300 text-lg shadow-lg hover:shadow-primary/30"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
