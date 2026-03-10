import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';

interface OrderDetail {
    orderDetailId: number;
    orderId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    notes: string;
}

interface OrderWithDetails {
    orderId: number;
    branchId: number;
    orderDate: string;
    name: string;
    description: string;
    status: string;
    orderTotal: number;
    shippingAddress: string;
    trackingNumber?: string;
    orderDetails: OrderDetail[];
}

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

const TIMELINE_STATUSES = ['pending', 'processing', 'shipped', 'delivered'];

function StatusBadge({ status }: { status: string }) {
    const style = STATUS_STYLES[status.toLowerCase()] ?? 'bg-gray-100 text-gray-800';
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${style}`}>
            {status}
        </span>
    );
}

function DeliveryTimeline({ status }: { status: string }) {
    const currentIndex = TIMELINE_STATUSES.indexOf(status.toLowerCase());
    const isCancelled = status.toLowerCase() === 'cancelled';

    if (isCancelled) {
        return (
            <div className="flex items-center gap-2 py-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                    Order Cancelled
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-0 w-full overflow-x-auto py-2">
            {TIMELINE_STATUSES.map((step, index) => {
                const isCompleted = index <= currentIndex;
                const isActive = index === currentIndex;
                return (
                    <div key={step} className="flex items-center flex-1 min-w-0">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                                    isCompleted
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                } ${isActive ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                            >
                                {isCompleted ? (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <span className={`text-xs mt-1 capitalize whitespace-nowrap ${isActive ? 'text-primary font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                                {step}
                            </span>
                        </div>
                        {index < TIMELINE_STATUSES.length - 1 && (
                            <div className={`flex-1 h-1 mx-1 rounded ${isCompleted && index < currentIndex ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default function OrderDetail() {
    const { id } = useParams<{ id: string }>();
    const { darkMode } = useTheme();

    const fetchOrderDetail = async (): Promise<OrderWithDetails> => {
        const { data } = await axios.get(`${api.baseURL}${api.endpoints.orders}/${id}/details`);
        return data;
    };

    const { data: order, isLoading, error } = useQuery<OrderWithDetails>(
        ['order-detail', id],
        fetchOrderDetail,
        { enabled: !!id }
    );

    const sectionCard = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

    if (isLoading) {
        return (
            <div className={`min-h-screen pt-20 flex justify-center items-start py-20 ${darkMode ? 'bg-dark' : 'bg-gray-100'}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className={`min-h-screen pt-20 flex flex-col items-center justify-center ${darkMode ? 'bg-dark text-white' : 'bg-gray-100 text-gray-900'}`}>
                <p className="text-red-500 text-lg mb-4">Order not found.</p>
                <Link to="/orders" className="text-primary hover:underline">← Back to Order History</Link>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pt-20 pb-12 px-4 ${darkMode ? 'bg-dark text-white' : 'bg-gray-100 text-gray-900'}`}>
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Link to="/orders" className="text-primary hover:underline text-sm">← Back to Order History</Link>
                </div>

                {/* Header */}
                <div className={`border rounded-lg p-6 mb-6 ${sectionCard}`}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                            <h1 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {order.name}
                            </h1>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Order #{order.orderId} &bull;{' '}
                                {new Date(order.orderDate).toLocaleDateString(undefined, {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </p>
                            {order.description && (
                                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{order.description}</p>
                            )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <StatusBadge status={order.status} />
                            <span className="text-2xl font-bold text-primary">${order.orderTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Delivery Timeline */}
                <div className={`border rounded-lg p-6 mb-6 ${sectionCard}`}>
                    <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Delivery Status</h2>
                    <DeliveryTimeline status={order.status} />
                    {order.trackingNumber && (
                        <p className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Tracking #: <span className="font-medium text-primary">{order.trackingNumber}</span>
                        </p>
                    )}
                    <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Ships to: {order.shippingAddress}
                    </p>
                </div>

                {/* Line Items */}
                <div className={`border rounded-lg p-6 ${sectionCard}`}>
                    <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Order Items</h2>

                    {order.orderDetails.length === 0 ? (
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No line items found.</p>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {order.orderDetails.map(detail => (
                                <div key={detail.orderDetailId} className="py-3 flex justify-between items-start gap-4">
                                    <div>
                                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            Product #{detail.productId}
                                        </p>
                                        {detail.notes && (
                                            <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{detail.notes}</p>
                                        )}
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {detail.quantity} × ${detail.unitPrice.toFixed(2)}
                                        </p>
                                        <p className="font-semibold text-primary">
                                            ${(detail.quantity * detail.unitPrice).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={`mt-4 pt-4 border-t flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Total</span>
                        <span className="text-xl font-bold text-primary">${order.orderTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
