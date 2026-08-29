import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios, { AxiosResponse } from 'axios';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CartProvider } from '../../../context/CartContext';
import { ThemeProvider } from '../../../context/ThemeContext';
import ProductDetail from './ProductDetail';

vi.mock('axios', () => ({
  default: {
    get: vi.fn()
  }
}));

const productDetail = {
  productId: 1,
  supplierId: 3,
  name: 'SmartFeeder One',
  description: 'This AI-powered feeder learns your cat schedule.',
  price: 129.99,
  sku: 'CAT-FEED-001',
  unit: 'piece',
  imgName: 'feeder.png',
  stockLevel: 18,
  reorderPoint: 8,
  discount: 0.25,
  category: 'Feeding',
  images: [
    { url: '/feeder.png', alt: 'SmartFeeder One product image', isPrimary: true },
    { url: '/copilot.png', alt: 'SmartFeeder One AI badge' }
  ],
  specifications: [
    { label: 'Capacity', value: '6 meal compartments' },
    { label: 'Connectivity', value: 'Wi-Fi app scheduling with offline fallback' }
  ],
  reviewSummary: {
    averageRating: 4.5,
    reviewCount: 2,
    ratingCounts: { one: 0, two: 0, three: 0, four: 1, five: 1 }
  }
};

const reviews = [
  {
    reviewId: 1,
    productId: 1,
    reviewerName: 'Meowtown Branch',
    rating: 5,
    title: 'Reliable meal automation',
    comment: 'The schedule controls are easy for store associates to understand.',
    createdAt: '2026-03-08T10:00:00.000Z',
    verifiedBuyer: true
  }
];

const relatedProducts = [
  {
    productId: 10,
    supplierId: 3,
    name: 'SnackVault Puzzle Dispenser',
    description: 'Treat puzzle toy.',
    price: 49.99,
    sku: 'CAT-SNACK-001',
    unit: 'piece',
    imgName: 'snack-vault.png',
    category: 'Feeding'
  }
];

const mockedGet = vi.mocked(axios.get);

const axiosResponse = <T,>(data: T): Promise<AxiosResponse<T>> =>
  Promise.resolve({ data, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse<T>);

const renderProductDetail = (initialPath = '/products/1') => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, cacheTime: 0 } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CartProvider>
          <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/products" element={<h1>Products index</h1>} />
            </Routes>
          </MemoryRouter>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('ProductDetail', () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
    mockedGet.mockReset();
    mockedGet.mockImplementation((url) => {
      const requestUrl = new URL(String(url));
      const path = requestUrl.pathname + requestUrl.search;

      if (path === '/api/products/1') return axiosResponse(productDetail);
      if (path === '/api/products/1/reviews') return axiosResponse(reviews);
      if (path === '/api/products/1/related?limit=4') return axiosResponse(relatedProducts);
      if (path === '/api/products/404') return Promise.reject({ response: { status: 404 } });
      return Promise.reject(new Error(`Unexpected URL: ${path}`));
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders product detail content, accessible rating text, gallery controls, and related products', async () => {
    renderProductDetail();

    expect(await screen.findByRole('heading', { name: 'SmartFeeder One' })).toBeTruthy();
    expect(screen.getByText('4.5 out of 5 stars from 2 reviews')).toBeTruthy();
    expect(screen.getByText('6 meal compartments')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Show SmartFeeder One product image' }).getAttribute('aria-pressed')).toBe('true');
    expect(await screen.findByText('Reliable meal automation')).toBeTruthy();
    expect(await screen.findByText('SnackVault Puzzle Dispenser')).toBeTruthy();
  });

  it('adds the selected product quantity to the existing cart', async () => {
    const user = userEvent.setup();
    renderProductDetail();

    await screen.findByRole('heading', { name: 'SmartFeeder One' });
    await user.click(screen.getByRole('button', { name: 'Increase quantity of SmartFeeder One' }));
    await user.click(screen.getByRole('button', { name: 'Add 2 SmartFeeder One to cart' }));

    await waitFor(() => {
      expect(localStorage.getItem('octocat-cart')).toContain('"quantity":2');
      expect(localStorage.getItem('octocat-cart')).toContain('"price":97.4925');
    });
  });

  it('shows a not-found state for unknown products', async () => {
    renderProductDetail('/products/404');

    expect(await screen.findByRole('heading', { name: 'Product not found' })).toBeTruthy();
    expect(screen.getByText('The product you requested is not in the catalog.')).toBeTruthy();
  });
});
