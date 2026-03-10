import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../../../api/config';

interface Order {
  orderId: number;
  branchId: number;
  orderDate: string;
  name: string;
  description: string;
  status: string;
  totalAmount?: number;
  approvedBy?: string;
  rejectionReason?: string;
}

export default function Approvals() {
  const { isAdmin, isLoggedIn, username } = useAuth();
  const { darkMode } = useTheme();
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectingOrderId, setRejectingOrderId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchPendingOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${api.baseURL}${api.endpoints.ordersPendingApproval}`);
      setPendingOrders(response.data);
    } catch (err) {
      setError('Failed to load pending orders');
      console.error('Error fetching pending orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingOrders();
  }, [fetchPendingOrders]);

  const handleApprove = async (orderId: number) => {
    try {
      await axios.put(`${api.baseURL}${api.endpoints.orders}/${orderId}/approve`, {
        approvedBy: username,
        role: 'admin'
      });
      await fetchPendingOrders();
    } catch (err) {
      console.error('Error approving order:', err);
      setError('Failed to approve order');
    }
  };

  const handleReject = async (orderId: number) => {
    if (!rejectionReason.trim()) {
      setError('Please enter a rejection reason');
      return;
    }
    try {
      await axios.put(`${api.baseURL}${api.endpoints.orders}/${orderId}/reject`, {
        rejectedBy: username,
        rejectionReason,
        role: 'admin'
      });
      setRejectingOrderId(null);
      setRejectionReason('');
      await fetchPendingOrders();
    } catch (err) {
      console.error('Error rejecting order:', err);
      setError('Failed to reject order');
    }
  };

  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`container mx-auto px-4 pt-20 pb-8 ${darkMode ? 'bg-dark' : 'bg-gray-100'} min-h-screen transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
          Approval Queue
        </h1>
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {pendingOrders.length} order{pendingOrders.length !== 1 ? 's' : ''} awaiting approval
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button className="ml-2 underline" onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : pendingOrders.length === 0 ? (
        <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p className="text-lg">No orders pending approval</p>
          <p className="text-sm mt-2">All orders are up to date</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingOrders.map(order => (
            <div
              key={order.orderId}
              className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      {order.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending Approval
                    </span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                    {order.description}
                  </p>
                  <div className={`flex gap-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span>Order #{order.orderId}</span>
                    <span>Branch #{order.branchId}</span>
                    {order.totalAmount !== undefined && (
                      <span className="font-semibold text-primary">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    )}
                    <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {rejectingOrderId === order.orderId ? (
                  <div className="flex flex-col gap-2 min-w-64">
                    <input
                      type="text"
                      placeholder="Enter rejection reason..."
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                      className={`w-full px-3 py-2 border rounded text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-light' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReject(order.orderId)}
                        className="flex-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                      >
                        Confirm Reject
                      </button>
                      <button
                        onClick={() => {
                          setRejectingOrderId(null);
                          setRejectionReason('');
                        }}
                        className={`flex-1 px-3 py-1.5 text-sm rounded border transition-colors ${darkMode ? 'border-gray-600 text-light hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(order.orderId)}
                      className="px-4 py-2 bg-primary hover:bg-accent text-white text-sm font-medium rounded transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setRejectingOrderId(order.orderId)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
