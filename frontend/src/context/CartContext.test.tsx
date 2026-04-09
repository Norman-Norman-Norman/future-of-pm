import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { CartProvider, useCart, CartItem } from './CartContext';

const CART_STORAGE_KEY = 'octocat-cart';

const sampleItem: Omit<CartItem, 'quantity'> = {
  productId: 1,
  name: 'Test Product',
  price: 9.99,
  imgName: 'test.jpg',
};

const sampleItem2: Omit<CartItem, 'quantity'> = {
  productId: 2,
  name: 'Second Product',
  price: 19.99,
  imgName: 'test2.jpg',
};

// Helper to get cart values from context
function CartConsumer({ onRender }: { onRender: (cart: ReturnType<typeof useCart>) => void }) {
  const cart = useCart();
  onRender(cart);
  return null;
}

function renderWithCart(onRender: (cart: ReturnType<typeof useCart>) => void) {
  return render(
    <CartProvider>
      <CartConsumer onRender={onRender} />
    </CartProvider>
  );
}

describe('CartContext — localStorage persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('hydrates cart from localStorage on mount (simulates page refresh)', () => {
    const stored: CartItem[] = [{ ...sampleItem, quantity: 3 }];
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stored));

    let cart: ReturnType<typeof useCart> | undefined;
    renderWithCart(c => { cart = c; });

    expect(cart!.items).toEqual(stored);
    expect(cart!.totalItems).toBe(3);
  });

  it('persists cart to localStorage when item is added', () => {
    let cart: ReturnType<typeof useCart> | undefined;
    renderWithCart(c => { cart = c; });

    act(() => { cart!.addToCart(sampleItem, 2); });

    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)!);
    expect(stored).toEqual([{ ...sampleItem, quantity: 2 }]);
  });

  it('persists multiple items to localStorage', () => {
    let cart: ReturnType<typeof useCart> | undefined;
    renderWithCart(c => { cart = c; });

    act(() => {
      cart!.addToCart(sampleItem, 1);
      cart!.addToCart(sampleItem2, 4);
    });

    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)!);
    expect(stored).toHaveLength(2);
    expect(stored).toEqual(expect.arrayContaining([
      { ...sampleItem, quantity: 1 },
      { ...sampleItem2, quantity: 4 },
    ]));
  });

  it('updates localStorage when quantity changes', () => {
    let cart: ReturnType<typeof useCart> | undefined;
    renderWithCart(c => { cart = c; });

    act(() => { cart!.addToCart(sampleItem, 2); });
    act(() => { cart!.updateQuantity(sampleItem.productId, 5); });

    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)!);
    expect(stored[0].quantity).toBe(5);
  });

  it('updates localStorage when item is removed', () => {
    let cart: ReturnType<typeof useCart> | undefined;
    renderWithCart(c => { cart = c; });

    act(() => {
      cart!.addToCart(sampleItem, 1);
      cart!.addToCart(sampleItem2, 2);
    });
    act(() => { cart!.removeFromCart(sampleItem.productId); });

    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)!);
    expect(stored).toHaveLength(1);
    expect(stored[0].productId).toBe(sampleItem2.productId);
  });

  it('clears localStorage when cart is cleared', () => {
    let cart: ReturnType<typeof useCart> | undefined;
    renderWithCart(c => { cart = c; });

    act(() => { cart!.addToCart(sampleItem, 1); });
    act(() => { cart!.clearCart(); });

    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)!);
    expect(stored).toEqual([]);
  });

  it('cart badge count (totalItems) is correct after hydration from localStorage', () => {
    const stored: CartItem[] = [
      { ...sampleItem, quantity: 3 },
      { ...sampleItem2, quantity: 2 },
    ];
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stored));

    let cart: ReturnType<typeof useCart> | undefined;
    renderWithCart(c => { cart = c; });

    expect(cart!.totalItems).toBe(5);
  });

  it('handles corrupt localStorage data gracefully (starts with empty cart)', () => {
    localStorage.setItem(CART_STORAGE_KEY, 'not-valid-json{{{');

    let cart: ReturnType<typeof useCart> | undefined;
    renderWithCart(c => { cart = c; });

    expect(cart!.items).toEqual([]);
    expect(cart!.totalItems).toBe(0);
  });

  it('accumulates quantity when same item is added again (idempotent across refreshes)', () => {
    let cart: ReturnType<typeof useCart> | undefined;
    renderWithCart(c => { cart = c; });

    act(() => { cart!.addToCart(sampleItem, 2); });
    act(() => { cart!.addToCart(sampleItem, 3); });

    expect(cart!.items[0].quantity).toBe(5);
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)!);
    expect(stored[0].quantity).toBe(5);
  });

  it('removes item when updateQuantity is called with 0', () => {
    let cart: ReturnType<typeof useCart> | undefined;
    renderWithCart(c => { cart = c; });

    act(() => { cart!.addToCart(sampleItem, 2); });
    act(() => { cart!.updateQuantity(sampleItem.productId, 0); });

    expect(cart!.items).toEqual([]);
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)!);
    expect(stored).toEqual([]);
  });
});
