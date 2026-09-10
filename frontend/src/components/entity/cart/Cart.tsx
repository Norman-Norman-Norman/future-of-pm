import { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useCart } from '../../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { frontendLogger } from '../../../logger';

const DISCOUNT_RATE = 0.05;
const COUPON_DISCOUNT_RATE = 0.10;
const SHIPPING_COST = 10;

export default function Cart() {
  const { darkMode } = useTheme();
  const { items, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    frontendLogger.componentMount('Cart');
    frontendLogger.info('Cart', `Cart page loaded with ${items.length} unique items`);
    return () => frontendLogger.componentUnmount('Cart');
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * DISCOUNT_RATE;
  const couponDiscount = couponApplied ? subtotal * COUPON_DISCOUNT_RATE : 0;
  const shipping = items.length > 0 ? SHIPPING_COST : 0;
  const grandTotal = subtotal - discount - couponDiscount + shipping;

  const handleApplyCoupon = () => {
    frontendLogger.userAction('Apply coupon', { code: couponCode });
    if (couponCode.trim().toLowerCase() === 'techconnect') {
      setCouponApplied(true);
      setCouponError('');
      frontendLogger.info('Cart', 'Coupon applied successfully', { code: couponCode, discountRate: COUPON_DISCOUNT_RATE });
    } else {
      setCouponError('Invalid coupon code');
      setCouponApplied(false);
      frontendLogger.warn('Cart', 'Invalid coupon code attempted', { code: couponCode });
    }
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto text-center py-20">
          <svg className={`w-24 h-24 mx-auto mb-6 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-light' : 'text-gray-800'}`}>Your cart is empty</h2>
          <Link to="/products" className="inline-block bg-primary hover:bg-accent text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Cart Table */}
          <div className="lg:w-3/4">
            <div className={`rounded-lg border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-primary/30 bg-white'} overflow-hidden`}>
              <table className="w-full">
                <thead>
                  <tr className={`${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-600'} text-sm uppercase tracking-wider`}>
                    <th className="py-4 px-4 text-center font-semibold w-16">S. No.</th>
                    <th className="py-4 px-4 text-center font-semibold w-36">Product Image</th>
                    <th className="py-4 px-4 text-center font-semibold">Product Name</th>
                    <th className="py-4 px-4 text-center font-semibold">Unit Price</th>
                    <th className="py-4 px-4 text-center font-semibold w-28">Quantity</th>
                    <th className="py-4 px-4 text-center font-semibold">Total</th>
                    <th className="py-4 px-4 text-center font-semibold w-20">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr
                      key={item.productId}
                      className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t transition-colors`}
                    >
                      <td className={`py-6 px-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-lg`}>
                        {index + 1}
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex justify-center">
                          <div className={`w-24 h-24 rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} flex items-center justify-center`}>
                            <img
                              src={`/${item.imgName}`}
                              alt={item.name}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                        </div>
                      </td>
                      <td className={`py-6 px-4 text-center font-medium text-lg ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                        {item.name}
                      </td>
                      <td className={`py-6 px-4 text-center text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex justify-center">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              if (!isNaN(val) && val > 0) updateQuantity(item.productId, val);
                            }}
                            className={`w-16 text-center text-lg py-2 rounded-md border ${
                              darkMode
                                ? 'bg-gray-800 border-gray-600 text-light'
                                : 'bg-white border-gray-300 text-gray-800'
                            } focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none`}
                            aria-label={`Quantity of ${item.name}`}
                          />
                        </div>
                      </td>
                      <td className={`py-6 px-4 text-center text-lg font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-6 px-4 text-center">
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-primary hover:text-red-500 transition-colors p-2"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Bottom bar: Coupon + Update Cart */}
              <div className={`flex flex-col sm:flex-row items-center justify-between px-6 py-4 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'} border-t gap-4`}>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={`px-4 py-2.5 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-600 text-light placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                    } focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none w-48`}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-primary hover:bg-accent text-white font-semibold py-2.5 px-6 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Apply Coupon
                  </button>
                  {couponApplied && <span className="text-primary text-sm font-medium">Applied!</span>}
                  {couponError && <span className="text-red-500 text-sm">{couponError}</span>}
                </div>
                <button className="bg-primary hover:bg-accent text-white font-semibold py-2.5 px-8 rounded-lg transition-colors whitespace-nowrap">
                  Update Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/4">
            <div className={`rounded-lg border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-primary/30 bg-white'} overflow-hidden`}>
              <div className={`px-6 py-5 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h2 className={`text-2xl font-bold text-center ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  Order Summary
                </h2>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Subtotal</span>
                  <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>${subtotal.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t pt-4`}>
                  <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Discount (5%)</span>
                  <span className="text-red-400 font-semibold">-${discount.toFixed(2)}</span>
                </div>
                {couponApplied && (
                  <div className={`flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t pt-4`}>
                    <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Coupon (10%)</span>
                    <span className="text-red-400 font-semibold">-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className={`flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t pt-4`}>
                  <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Shipping</span>
                  <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>${shipping.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t pt-4`}>
                  <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Grand Total</span>
                  <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="px-6 pb-6">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-bold py-3.5 rounded-full transition-all duration-300 text-lg shadow-lg hover:shadow-primary/30"
                >
                  Proceed To Checkout
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
