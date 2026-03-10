import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';

interface Order {
    orderId: number;
    branchId: number;
    orderDate: string;
    name: string;
    description: string;
    status: string;
    orderTotal: number;
    shippingAddress: string;
    trackingNumber?: string;
}

const fetchOrders = async (): Promise<Order[]> => {
    const { data } = await axios.get(`${api.baseURL}${api.endpoints.orders}?sortBy=orderDate&order=desc`);
    return data;
};

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

function StatusBadge({ status }: { status: string }) {
    const style = STATUS_STYLES[status.toLowerCase()] ?? 'bg-gray-100 text-gray-800';
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${style}`}>
            {status}
        </span>
    );
}

export default function OrderHistory() {
    const { darkMode } = useTheme();
    const { data: orders, isLoading, error } = useQuery<Order[]>('orders', fetchOrders);

    const cardBase = darkMode
        ? 'bg-gray-800 border-gray-700 hover:border-primary'
        : 'bg-white border-gray-200 hover:border-primary';

    return (
        <div className={`min-h-screen pt-20 pb-12 px-4 ${darkMode ? 'bg-dark text-white' : 'bg-gray-100 text-gray-900'}`}>
            <div className="max-w-4xl mx-auto">
                <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Order History</h1>

                {isLoading && (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
                    </div>
                )}

                {!!error && (
                    <div className="text-center text-red-500 py-10">Failed to load orders. Please try again.</div>
                )}

                {!isLoading && !error && orders && orders.length === 0 && (
                    <div className="text-center py-20">
                        <p className={`text-xl mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>No orders yet</p>
                        <Link
                            to="/products"
                            className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-md font-medium transition-colors"
                        >
                            Start shopping
                        </Link>
                    </div>
                )}

                {!isLoading && !error && orders && orders.length > 0 && (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <Link
                                key={order.orderId}
                                to={`/orders/${order.orderId}`}
                                className={`block border rounded-lg p-5 transition-colors ${cardBase}`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {order.name}
                                            </span>
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Order #{order.orderId} &bull;{' '}
                                            {new Date(order.orderDate).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                        {order.description && (
                                            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {order.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-xl font-bold text-primary">
                                            ${order.orderTotal.toFixed(2)}
                                        </p>
                                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                            View details →
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
