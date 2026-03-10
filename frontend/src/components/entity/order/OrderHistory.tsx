import axios from 'axios';
import { useQuery } from 'react-query';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';
import ReorderButton from './ReorderButton';
import FrequentItems from './FrequentItems';

interface Order {
  orderId: number;
  branchId: number;
  orderDate: string;
  name: string;
  description: string;
  status: string;
}

interface OrderDetail {
  orderDetailId: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  notes: string;
}

interface Product {
  productId: number;
  name: string;
  price: number;
  imgName: string;
  discount?: number;
}

interface OrderItem {
  productId: number;
  name: string;
  price: number;
  imgName: string;
  quantity: number;
  unitPrice: number;
}

const DEMO_BRANCH_ID = 1;

const fetchOrders = async (branchId: number): Promise<Order[]> => {
  const { data } = await axios.get(
    `${api.baseURL}${api.endpoints.orders}?branchId=${branchId}&sortBy=date&order=desc`
  );
  return data;
};

const fetchOrderDetails = async (): Promise<OrderDetail[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.orderDetails}`);
  return data;
};

const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.products}`);
  return data;
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderHistory() {
  const { darkMode } = useTheme();

  const { data: orders, isLoading: loadingOrders, error: ordersError } = useQuery(
    ['orders', DEMO_BRANCH_ID],
    () => fetchOrders(DEMO_BRANCH_ID)
  );

  const { data: orderDetails, isLoading: loadingDetails } = useQuery(
    'orderDetails',
    fetchOrderDetails
  );

  const { data: products, isLoading: loadingProducts } = useQuery(
    'products',
    fetchProducts
  );

  const isLoading = loadingOrders || loadingDetails || loadingProducts;

  const getOrderItems = (orderId: number) => {
    if (!orderDetails || !products) return [];
    return orderDetails
      .filter(d => d.orderId === orderId)
      .map(d => {
        const product = products.find(p => p.productId === d.productId);
        if (!product) return null;
        const effectivePrice = product.discount
          ? product.price * (1 - product.discount)
          : product.price;
        return {
          productId: product.productId,
          name: product.name,
          price: effectivePrice,
          imgName: product.imgName,
          quantity: d.quantity,
          unitPrice: d.unitPrice,
        };
      })
      .filter((item): item is OrderItem => item !== null);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 text-center">Failed to load order history</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Order History Main Content */}
          <div className="lg:w-3/4">
            <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
              Order History
            </h1>

            {orders && orders.length === 0 && (
              <div className={`rounded-lg border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-primary/30 bg-white'} p-12 text-center`}>
                <svg className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No past orders found</p>
              </div>
            )}

            <div className="space-y-4">
              {orders?.map((order) => {
                const items = getOrderItems(order.orderId);
                const orderTotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
                const statusStyle = STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-800';

                return (
                  <div
                    key={order.orderId}
                    className={`rounded-lg border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-primary/30 bg-white'} overflow-hidden`}
                  >
                    {/* Order Header */}
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 gap-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className={`text-base font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>{order.name}</h3>
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusStyle}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          {order.description && ` — ${order.description}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {orderTotal > 0 && (
                          <span className={`text-base font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                            ${orderTotal.toFixed(2)}
                          </span>
                        )}
                        {items.length > 0 && <ReorderButton items={items} />}
                      </div>
                    </div>

                    {/* Order Items */}
                    {items.length > 0 ? (
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {items.map((item) => (
                          <div key={item.productId} className="flex items-center gap-4 px-5 py-3">
                            <div className={`w-12 h-12 flex-shrink-0 rounded-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                              <img
                                src={`/${item.imgName}`}
                                alt={item.name}
                                className="w-full h-full object-contain p-1"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${darkMode ? 'text-light' : 'text-gray-800'}`}>{item.name}</p>
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                              </p>
                            </div>
                            <span className={`text-sm font-semibold flex-shrink-0 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={`text-sm px-5 py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No items on record for this order.</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Frequent Items Sidebar */}
          <div className="lg:w-1/4">
            <FrequentItems branchId={DEMO_BRANCH_ID} />
          </div>

        </div>
      </div>
    </div>
  );
}
