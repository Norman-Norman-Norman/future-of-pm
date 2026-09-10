import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios, { AxiosResponse } from 'axios';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CartProvider } from '../../../context/CartContext';
import { ThemeProvider } from '../../../context/ThemeContext';
import Products from './Products';

vi.mock('axios', () => ({
  default: {
    get: vi.fn()
  }
}));

const catalogProducts = [
  {
    productId: 1,
    supplierId: 3,
    name: 'SmartFeeder One',
    description: 'AI-powered feeder',
    price: 129.99,
    sku: 'CAT-FEED-001',
    unit: 'piece',
    imgName: 'feeder.png',
    discount: 0.25
  }
];

const mockedGet = vi.mocked(axios.get);

const axiosResponse = <T,>(data: T): Promise<AxiosResponse<T>> =>
  Promise.resolve({ data, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse<T>);

const renderCatalog = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, cacheTime: 0 } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CartProvider>
          <MemoryRouter initialEntries={['/products']}>
            <Routes>
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<h1>Product detail route</h1>} />
            </Routes>
          </MemoryRouter>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('Products catalog', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedGet.mockReset();
    mockedGet.mockImplementation(() => axiosResponse(catalogProducts));
  });

  afterEach(() => {
    cleanup();
  });

  it('navigates product detail affordances to the routed product page', async () => {
    const user = userEvent.setup();
    renderCatalog();

    expect(await screen.findByText('SmartFeeder One')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'OK' }));
    await user.click(screen.getAllByRole('link', { name: 'View details for SmartFeeder One' })[0]);

    expect(await screen.findByRole('heading', { name: 'Product detail route' })).toBeTruthy();
  });
});
