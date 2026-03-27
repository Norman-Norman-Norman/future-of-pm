import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
<<<<<<< HEAD
=======
import { frontendLogger } from '../logger';
>>>>>>> cb700de (feat(frontend): add shopping cart, checkout, landing page, and frontend logging)

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  imgName: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CART_STORAGE_KEY = 'octocat-cart';

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
<<<<<<< HEAD
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* ignore corrupt data */ }
=======
      if (Array.isArray(parsed)) {
        frontendLogger.info('Cart', `Loaded ${parsed.length} items from localStorage`);
        return parsed;
      }
    }
  } catch { /* ignore corrupt data */ }
  frontendLogger.debug('Cart', 'No saved cart found, starting empty');
>>>>>>> cb700de (feat(frontend): add shopping cart, checkout, landing page, and frontend logging)
  return [];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
<<<<<<< HEAD
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) {
=======
    frontendLogger.debug('Cart', `Cart persisted to localStorage (${items.length} items, ${items.reduce((s, i) => s + i.quantity, 0)} total qty)`);
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number) => {
    frontendLogger.userAction('Add to cart', { productId: item.productId, name: item.name, quantity, price: item.price });
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) {
        frontendLogger.stateChange('Cart', `Updated qty for ${item.name}: ${existing.quantity} -> ${existing.quantity + quantity}`);
>>>>>>> cb700de (feat(frontend): add shopping cart, checkout, landing page, and frontend logging)
        return prev.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
<<<<<<< HEAD
=======
      frontendLogger.stateChange('Cart', `New item added: ${item.name} (qty: ${quantity})`);
>>>>>>> cb700de (feat(frontend): add shopping cart, checkout, landing page, and frontend logging)
      return [...prev, { ...item, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
<<<<<<< HEAD
=======
    frontendLogger.userAction('Remove from cart', { productId });
>>>>>>> cb700de (feat(frontend): add shopping cart, checkout, landing page, and frontend logging)
    setItems(prev => prev.filter(i => i.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
<<<<<<< HEAD
=======
    frontendLogger.userAction('Update cart quantity', { productId, newQuantity: quantity });
>>>>>>> cb700de (feat(frontend): add shopping cart, checkout, landing page, and frontend logging)
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(i => (i.productId === productId ? { ...i, quantity } : i))
    );
  };

<<<<<<< HEAD
  const clearCart = () => setItems([]);
=======
  const clearCart = () => {
    frontendLogger.userAction('Clear cart', { itemCount: items.length });
    setItems([]);
  };
>>>>>>> cb700de (feat(frontend): add shopping cart, checkout, landing page, and frontend logging)

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
