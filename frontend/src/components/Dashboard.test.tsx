import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import { ThemeProvider } from '../context/ThemeContext';

const responses: Record<string, unknown> = {
  '/api/analytics/summary': {
    totalOrders: 3,
    grossOrderValue: 3049.7,
    averageOrderValue: 1524.85,
    pendingDeliveries: 2,
    lowStockCount: 5,
    generatedAt: new Date('2026-08-24T15:00:00Z').toISOString()
  },
  '/api/analytics/orders-by-status': [{ status: 'pending', count: 1 }],
  '/api/analytics/delivery-performance': { onTime: 1, late: 1, notYetDelivered: 2, onTimeRate: 50 },
  '/api/analytics/recent-orders?limit=5': [{ orderId: 1, name: 'Q2 Feline Tech Refresh', status: 'pending', orderDate: new Date().toISOString(), totalValue: 1449.9 }],
  '/api/analytics/top-products?limit=5': [{ productId: 4, name: 'PawTrack Smart Collar', unitsSold: 20, revenue: 1599.8 }],
  '/api/analytics/low-stock': [{ productId: 2, name: 'AutoClean Litter Dome', sku: 'CAT-LITTER-001', stockLevel: 7, reorderPoint: 7 }]
};

const renderDashboard = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Dashboard />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('Dashboard', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn((url: string) => {
      const path = new URL(url).pathname + new URL(url).search;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(responses[path])
      });
    }));
  });

  it('renders KPI values and accessible chart alternatives from analytics responses', async () => {
    renderDashboard();

    await waitFor(() => expect(screen.getByText('Supply analytics dashboard')).toBeTruthy());
    expect(screen.getByLabelText('Total orders').textContent).toContain('3');
    expect(screen.getByText('PawTrack Smart Collar')).toBeTruthy();
    expect(screen.getByText('AutoClean Litter Dome')).toBeTruthy();
    expect(screen.getByText('Orders by status table')).toBeTruthy();
    expect(fetch).toHaveBeenCalledTimes(6);
  });
});
