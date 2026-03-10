import { useState } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';
import SubscriptionForm from './SubscriptionForm';

interface SubscriptionItem {
  productId: number;
  quantity: number;
}

interface Subscription {
  subscriptionId: number;
  branchId: number;
  items: SubscriptionItem[];
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  nextDeliveryDate: string;
  status: 'active' | 'paused' | 'cancelled';
  discountPercentage: number;
  createdAt: string;
}

const fetchSubscriptions = async (): Promise<Subscription[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.subscriptions}`);
  return data;
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

const FREQUENCY_LABELS: Record<string, string> = {
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
};

export default function SubscriptionManager() {
  const { darkMode } = useTheme();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: subscriptions, isLoading, error } = useQuery('subscriptions', fetchSubscriptions);

  const handleDelete = async (subscriptionId: number) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) return;
    try {
      await axios.delete(`${api.baseURL}${api.endpoints.subscriptions}/${subscriptionId}`);
      queryClient.invalidateQueries('subscriptions');
    } catch {
      setActionError('Failed to delete subscription. Please try again.');
    }
  };

  const handleStatusChange = async (subscription: Subscription, newStatus: 'active' | 'paused' | 'cancelled') => {
    try {
      await axios.put(`${api.baseURL}${api.endpoints.subscriptions}/${subscription.subscriptionId}`, {
        ...subscription,
        status: newStatus,
      });
      queryClient.invalidateQueries('subscriptions');
    } catch {
      setActionError('Failed to update subscription status. Please try again.');
    }
  };

  const handleFormSave = () => {
    queryClient.invalidateQueries('subscriptions');
    setShowForm(false);
    setEditingSubscription(null);
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setShowForm(true);
  };

  const handleNewSubscription = () => {
    setEditingSubscription(null);
    setShowForm(true);
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

  if (error) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 text-center">Failed to fetch subscriptions</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                Autoship Subscriptions
              </h1>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Manage your recurring orders and save 5% on every delivery
              </p>
            </div>
            <button
              onClick={handleNewSubscription}
              className="bg-primary hover:bg-accent text-white px-5 py-2 rounded-lg font-medium transition-colors"
            >
              + New Subscription
            </button>
          </div>

          {/* Error Banner */}
          {actionError && (
            <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              <span>{actionError}</span>
              <button onClick={() => setActionError(null)} className="ml-4 text-red-500 hover:text-red-700 font-medium">✕</button>
            </div>
          )}

          {/* Subscribe & Save Banner */}
          <div className={`rounded-xl p-4 flex items-center gap-4 ${darkMode ? 'bg-gray-800 border border-primary/30' : 'bg-primary/10 border border-primary/20'}`}>
            <span className="text-3xl">🔄</span>
            <div>
              <p className={`font-semibold ${darkMode ? 'text-primary' : 'text-primary'}`}>
                Subscribe &amp; Save 5%
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Set up recurring orders for your most-used products and automatically save on every delivery.
              </p>
            </div>
          </div>

          {/* Subscriptions List */}
          {subscriptions && subscriptions.length === 0 ? (
            <div className={`text-center py-16 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <span className="text-5xl mb-4 block">📦</span>
              <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                No subscriptions yet
              </p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Create your first autoship subscription to save 5% on recurring orders.
              </p>
              <button
                onClick={handleNewSubscription}
                className="mt-4 bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Create Subscription
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subscriptions?.map(sub => (
                <div
                  key={sub.subscriptionId}
                  className={`rounded-xl shadow-md p-5 flex flex-col gap-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Branch #{sub.branchId}
                      </p>
                      <p className={`font-semibold text-lg ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                        Subscription #{sub.subscriptionId}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[sub.status]}`}>
                      {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                    </span>
                  </div>

                  {/* Items */}
                  <div>
                    <p className={`text-xs font-medium uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Items
                    </p>
                    <div className="space-y-1">
                      {sub.items.map((item, i) => (
                        <div key={i} className={`flex justify-between text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span>Product #{item.productId}</span>
                          <span className="font-medium">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Frequency & Discount */}
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-1.5 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span>🗓</span>
                      <span>{FREQUENCY_LABELS[sub.frequency]}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-primary font-medium">
                      <span>🏷️</span>
                      <span>{sub.discountPercentage}% off</span>
                    </div>
                  </div>

                  {/* Next Delivery */}
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Next delivery:{' '}
                    <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      {new Date(sub.nextDeliveryDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => handleEdit(sub)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        darkMode
                          ? 'bg-gray-700 text-light hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Edit
                    </button>
                    {sub.status === 'active' && (
                      <button
                        onClick={() => handleStatusChange(sub, 'paused')}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors"
                      >
                        Pause
                      </button>
                    )}
                    {sub.status === 'paused' && (
                      <button
                        onClick={() => handleStatusChange(sub, 'active')}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                      >
                        Resume
                      </button>
                    )}
                    {sub.status !== 'cancelled' && (
                      <button
                        onClick={() => handleDelete(sub.subscriptionId)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => { setShowForm(false); setEditingSubscription(null); }}
        >
          <div
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl transition-colors duration-300`}
            onClick={e => e.stopPropagation()}
          >
            <SubscriptionForm
              subscription={editingSubscription ?? undefined}
              onSave={handleFormSave}
              onCancel={() => { setShowForm(false); setEditingSubscription(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
