import { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../api/config';

interface StatusHistoryEntry {
  from: string | null;
  to: string;
  timestamp: string;
  reason?: string;
  changedBy?: string;
}

interface Order {
  orderId: number;
  branchId: number;
  orderDate: string;
  name: string;
  description: string;
  status: string;
  statusHistory: StatusHistoryEntry[];
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-200 text-gray-700',
  submitted: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-200 text-red-900',
};

const VALID_NEXT: Record<string, string[]> = {
  draft: ['submitted'],
  submitted: ['approved', 'rejected'],
  approved: ['processing'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  rejected: [],
  delivered: [],
  cancelled: [],
};

const REASON_REQUIRED = new Set(['rejected', 'cancelled']);

const TRANSITION_LABELS: Record<string, string> = {
  submitted: 'Submit',
  approved: 'Approve',
  rejected: 'Reject',
  processing: 'Start Processing',
  shipped: 'Mark Shipped',
  delivered: 'Mark Delivered',
  cancelled: 'Cancel',
};

const TRANSITION_STYLES: Record<string, string> = {
  submitted: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  approved: 'bg-blue-600 hover:bg-blue-700 text-white',
  rejected: 'bg-red-500 hover:bg-red-600 text-white',
  processing: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  shipped: 'bg-purple-600 hover:bg-purple-700 text-white',
  delivered: 'bg-green-600 hover:bg-green-700 text-white',
  cancelled: 'bg-red-700 hover:bg-red-800 text-white',
};

const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.orders}`);
  return data;
};

export default function Orders() {
  const { darkMode } = useTheme();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [transitionError, setTransitionError] = useState('');

  const { data: orders = [], isLoading, error } = useQuery('orders', fetchOrders);

  const transitionMutation = useMutation(
    ({ orderId, status, reason }: { orderId: number; status: string; reason?: string }) =>
      axios.put(`${api.baseURL}${api.endpoints.orderStatus(orderId)}`, {
        status,
        reason: reason || undefined,
        changedBy: isAdmin ? 'admin' : 'user',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders');
        setTransitionTarget(null);
        setReason('');
        setTransitionError('');
        setSelectedOrder(null);
      },
      onError: (err: unknown) => {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        setTransitionError(axiosErr.response?.data?.error ?? 'Transition failed');
      },
    }
  );

  const handleTransition = (order: Order, target: string) => {
    setSelectedOrder(order);
    setTransitionTarget(target);
    setReason('');
    setTransitionError('');
  };

  const confirmTransition = () => {
    if (!selectedOrder || !transitionTarget) return;
    if (REASON_REQUIRED.has(transitionTarget) && !reason.trim()) {
      setTransitionError('A reason is required for this action.');
      return;
    }
    transitionMutation.mutate({
      orderId: selectedOrder.orderId,
      status: transitionTarget,
      reason: reason.trim() || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 flex items-center justify-center`}>
        <p className="text-red-500">Failed to load orders.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-light' : 'text-gray-800'}`}>Orders</h1>

        <div className="grid gap-6">
          {orders.map(order => (
            <div
              key={order.orderId}
              className={`rounded-lg border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-primary/30 bg-white'} overflow-hidden shadow-sm`}
            >
              {/* Order header */}
              <div className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div>
                  <h2 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    #{order.orderId} — {order.name}
                  </h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Branch {order.branchId} · {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                  {order.status}
                </span>
              </div>

              {/* Order body */}
              <div className="px-6 py-4">
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{order.description}</p>

                <div className="flex flex-wrap gap-2">
                  {VALID_NEXT[order.status]?.map(target => (
                    <button
                      key={target}
                      onClick={() => handleTransition(order, target)}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${TRANSITION_STYLES[target]}`}
                    >
                      {TRANSITION_LABELS[target] ?? target}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowHistory(true);
                      setTransitionTarget(null);
                    }}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium border transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                  >
                    View History ({order.statusHistory.length})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transition confirmation modal */}
      {selectedOrder && transitionTarget && !showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className={`rounded-xl shadow-xl max-w-md w-full p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
              Confirm: {TRANSITION_LABELS[transitionTarget]}
            </h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Order <strong>#{selectedOrder.orderId} — {selectedOrder.name}</strong> will move from{' '}
              <span className="font-medium capitalize">{selectedOrder.status}</span> to{' '}
              <span className="font-medium capitalize">{transitionTarget}</span>.
            </p>

            {REASON_REQUIRED.has(transitionTarget) && (
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={e => { setReason(e.target.value); setTransitionError(''); }}
                  rows={3}
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${darkMode ? 'bg-gray-800 border-gray-600 text-light' : 'bg-white border-gray-300 text-gray-800'}`}
                  placeholder={`Reason for ${transitionTarget}...`}
                />
              </div>
            )}

            {transitionError && (
              <p className="text-red-500 text-sm mb-3">{transitionError}</p>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setTransitionTarget(null); setTransitionError(''); setReason(''); }}
                className={`px-4 py-2 rounded-md text-sm border transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              >
                Cancel
              </button>
              <button
                onClick={confirmTransition}
                disabled={transitionMutation.isLoading}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${TRANSITION_STYLES[transitionTarget]}`}
              >
                {transitionMutation.isLoading ? 'Saving…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History modal */}
      {selectedOrder && showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className={`rounded-xl shadow-xl max-w-lg w-full p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'} max-h-[80vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                Status History — #{selectedOrder.orderId} {selectedOrder.name}
              </h3>
              <button
                onClick={() => { setShowHistory(false); setSelectedOrder(null); }}
                className={`p-1 rounded hover:bg-gray-200 ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500'}`}
                aria-label="Close history"
              >
                ✕
              </button>
            </div>

            <ol className="relative border-l-2 border-primary/40 ml-3">
              {selectedOrder.statusHistory.map((entry, i) => (
                <li key={i} className="mb-6 ml-4">
                  <span className="absolute -left-2 flex items-center justify-center w-4 h-4 rounded-full bg-primary ring-2 ring-white" />
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-0.5`}>
                    {new Date(entry.timestamp).toLocaleString()}
                    {entry.changedBy && <span className="ml-2">· by {entry.changedBy}</span>}
                  </div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    {entry.from === null ? (
                      <span>Order created with status <span className="capitalize">{entry.to}</span></span>
                    ) : (
                      <span>
                        <span className="capitalize">{entry.from}</span>
                        {' → '}
                        <span className="capitalize">{entry.to}</span>
                      </span>
                    )}
                  </div>
                  {entry.reason && (
                    <p className={`text-xs mt-0.5 italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      "{entry.reason}"
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
