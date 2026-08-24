import { useQuery } from 'react-query';
import { API_BASE_URL, api } from '../api/config';
import { useTheme } from '../context/ThemeContext';
import { frontendLogger } from '../logger';

type Summary = {
  totalOrders: number;
  grossOrderValue: number;
  averageOrderValue: number;
  pendingDeliveries: number;
  lowStockCount: number;
  generatedAt: string;
};

type StatusCount = { status: string; count: number };
type DeliveryPerformance = { onTime: number; late: number; notYetDelivered: number; onTimeRate: number };
type RecentOrder = { orderId: number; name: string; status: string; orderDate: string; totalValue: number };
type TopProduct = { productId: number; name: string; unitsSold: number; revenue: number };
type LowStockProduct = { productId: number; name: string; sku: string; stockLevel: number; reorderPoint: number };

type DashboardData = {
  summary: Summary;
  ordersByStatus: StatusCount[];
  deliveryPerformance: DeliveryPerformance;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  lowStock: LowStockProduct[];
};

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const fetchJson = async <T,>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Analytics request failed: ${response.status}`);
  }
  return response.json();
};

const fetchDashboard = async (): Promise<DashboardData> => {
  const base = api.endpoints.analytics;
  const [summary, ordersByStatus, deliveryPerformance, recentOrders, topProducts, lowStock] = await Promise.all([
    fetchJson<Summary>(`${base}/summary`),
    fetchJson<StatusCount[]>(`${base}/orders-by-status`),
    fetchJson<DeliveryPerformance>(`${base}/delivery-performance`),
    fetchJson<RecentOrder[]>(`${base}/recent-orders?limit=5`),
    fetchJson<TopProduct[]>(`${base}/top-products?limit=5`),
    fetchJson<LowStockProduct[]>(`${base}/low-stock`)
  ]);
  return { summary, ordersByStatus, deliveryPerformance, recentOrders, topProducts, lowStock };
};

function Card({ label, value, detail }: { label: string; value: string; detail: string }) {
  const { darkMode } = useTheme();
  return (
    <section className={`${darkMode ? 'bg-gray-900 text-light' : 'bg-white text-gray-900'} rounded-xl p-5 shadow`} aria-label={label}>
      <p className="text-sm font-medium text-primary">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2 text-sm`}>{detail}</p>
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return <p className="rounded-lg border border-dashed border-gray-300 p-4 text-sm">{message}</p>;
}

export default function Dashboard() {
  const { darkMode } = useTheme();
  const { data, isLoading, isError, refetch, isFetching } = useQuery('analytics-dashboard', fetchDashboard, {
    refetchInterval: 30000,
    staleTime: 25000,
    onError: error => frontendLogger.error('Dashboard', 'Analytics dashboard load failed', error)
  });

  if (isLoading) {
    return (
      <main className={`pt-24 px-4 pb-12 ${darkMode ? 'bg-dark text-light' : 'bg-gray-100 text-gray-900'}`} aria-busy="true">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">Supply analytics dashboard</h1>
          <p className="mt-4 rounded-lg bg-primary/10 p-4">Loading analytics...</p>
        </div>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className={`pt-24 px-4 pb-12 ${darkMode ? 'bg-dark text-light' : 'bg-gray-100 text-gray-900'}`}>
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">Supply analytics dashboard</h1>
          <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-900" role="alert">
            Analytics could not be loaded.
            <button className="ml-3 underline" onClick={() => refetch()}>Retry</button>
          </div>
        </div>
      </main>
    );
  }

  const maxStatus = Math.max(...data.ordersByStatus.map(item => item.count), 1);
  const maxUnits = Math.max(...data.topProducts.map(product => product.unitsSold), 1);

  return (
    <main className={`pt-24 px-4 pb-12 min-h-screen ${darkMode ? 'bg-dark text-light' : 'bg-gray-100 text-gray-900'}`}>
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Operations command center</p>
          <h1 className="mt-2 text-4xl font-bold">Supply analytics dashboard</h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
            Refreshes every 30 seconds. Last generated {new Date(data.summary.generatedAt).toLocaleString()}.
            {isFetching && <span className="ml-2 text-primary">Refreshing...</span>}
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card label="Total orders" value={data.summary.totalOrders.toString()} detail="All orders in the active in-memory store" />
          <Card label="Gross order value" value={currency.format(data.summary.grossOrderValue)} detail="Cancelled orders excluded from value" />
          <Card label="Average order value" value={currency.format(data.summary.averageOrderValue)} detail="Gross value divided by active orders" />
          <Card label="Pending deliveries" value={data.summary.pendingDeliveries.toString()} detail={`${data.summary.lowStockCount} products need replenishment`} />
        </div>

        <section className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-xl p-6 shadow`} aria-labelledby="orders-status-heading">
          <h2 id="orders-status-heading" className="text-2xl font-semibold">Orders by status</h2>
          <div className="mt-4 space-y-3">
            {data.ordersByStatus.map(item => (
              <div key={item.status}>
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{item.status}</span>
                  <span>{item.count}</span>
                </div>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-200'} mt-1 h-3 rounded-full`}>
                  <div className="h-3 rounded-full bg-primary" style={{ width: `${(item.count / maxStatus) * 100}%` }} aria-hidden="true" />
                </div>
              </div>
            ))}
          </div>
          <table className="sr-only">
            <caption>Orders by status table</caption>
            <tbody>{data.ordersByStatus.map(item => <tr key={item.status}><th>{item.status}</th><td>{item.count}</td></tr>)}</tbody>
          </table>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-xl p-6 shadow`} aria-labelledby="delivery-heading">
            <h2 id="delivery-heading" className="text-2xl font-semibold">Delivery performance</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-primary">On-time</dt><dd className="text-2xl font-bold">{data.deliveryPerformance.onTime}</dd></div>
              <div><dt className="text-primary">Late</dt><dd className="text-2xl font-bold">{data.deliveryPerformance.late}</dd></div>
              <div><dt className="text-primary">Not yet delivered</dt><dd className="text-2xl font-bold">{data.deliveryPerformance.notYetDelivered}</dd></div>
              <div><dt className="text-primary">On-time rate</dt><dd className="text-2xl font-bold">{data.deliveryPerformance.onTimeRate}%</dd></div>
            </dl>
          </section>

          <section className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-xl p-6 shadow`} aria-labelledby="top-products-heading">
            <h2 id="top-products-heading" className="text-2xl font-semibold">Top products</h2>
            {data.topProducts.length === 0 ? <EmptyState message="No product sales yet." /> : (
              <div className="mt-4 space-y-3">
                {data.topProducts.map(product => (
                  <div key={product.productId}>
                    <div className="flex justify-between text-sm">
                      <span>{product.name}</span>
                      <span>{product.unitsSold} units - {currency.format(product.revenue)}</span>
                    </div>
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-200'} mt-1 h-3 rounded-full`}>
                      <div className="h-3 rounded-full bg-primary" style={{ width: `${(product.unitsSold / maxUnits) * 100}%` }} aria-hidden="true" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-xl p-6 shadow`} aria-labelledby="recent-orders-heading">
            <h2 id="recent-orders-heading" className="text-2xl font-semibold">Recent orders</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead><tr><th className="py-2">Order</th><th>Status</th><th>Date</th><th className="text-right">Value</th></tr></thead>
                <tbody>
                  {data.recentOrders.map(order => (
                    <tr key={order.orderId} className="border-t border-gray-200">
                      <td className="py-2">{order.name}</td>
                      <td className="capitalize">{order.status}</td>
                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td className="text-right">{currency.format(order.totalValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-xl p-6 shadow`} aria-labelledby="low-stock-heading">
            <h2 id="low-stock-heading" className="text-2xl font-semibold">Low stock</h2>
            {data.lowStock.length === 0 ? <EmptyState message="All products are above reorder point." /> : (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead><tr><th className="py-2">Product</th><th>SKU</th><th className="text-right">Stock</th><th className="text-right">Reorder</th></tr></thead>
                  <tbody>
                    {data.lowStock.map(product => (
                      <tr key={product.productId} className="border-t border-gray-200">
                        <td className="py-2">{product.name}</td>
                        <td>{product.sku}</td>
                        <td className="text-right">{product.stockLevel}</td>
                        <td className="text-right">{product.reorderPoint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
