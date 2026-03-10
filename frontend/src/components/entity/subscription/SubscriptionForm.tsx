import { useState } from 'react';
import axios from 'axios';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';

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

interface SubscriptionFormProps {
  subscription?: Subscription;
  onSave: () => void;
  onCancel: () => void;
}

const FREQUENCIES = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
] as const;

const nextDeliveryFromFrequency = (frequency: string): string => {
  const days: Record<string, number> = {
    weekly: 7,
    biweekly: 14,
    monthly: 30,
    quarterly: 90,
  };
  return new Date(Date.now() + (days[frequency] ?? 30) * 24 * 60 * 60 * 1000).toISOString();
};

export default function SubscriptionForm({ subscription, onSave, onCancel }: SubscriptionFormProps) {
  const { darkMode } = useTheme();
  const isEdit = !!subscription;

  const [branchId, setBranchId] = useState<number>(subscription?.branchId ?? 1);
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly' | 'quarterly'>(
    subscription?.frequency ?? 'monthly'
  );
  const [status, setStatus] = useState<'active' | 'paused' | 'cancelled'>(
    subscription?.status ?? 'active'
  );
  const [discountPercentage] = useState<number>(subscription?.discountPercentage ?? 5);
  const [items, setItems] = useState<SubscriptionItem[]>(
    subscription?.items ?? [{ productId: 1, quantity: 1 }]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleItemChange = (index: number, field: keyof SubscriptionItem, value: number) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    setItems(prev => [...prev, { productId: 1, quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload: Subscription = {
        subscriptionId: subscription?.subscriptionId ?? Date.now(),
        branchId,
        items,
        frequency,
        nextDeliveryDate: nextDeliveryFromFrequency(frequency),
        status,
        discountPercentage,
        createdAt: subscription?.createdAt ?? new Date().toISOString(),
      };
      if (isEdit) {
        await axios.put(`${api.baseURL}${api.endpoints.subscriptions}/${subscription!.subscriptionId}`, payload);
      } else {
        await axios.post(`${api.baseURL}${api.endpoints.subscriptions}`, payload);
      }
      onSave();
    } catch {
      setError('Failed to save subscription. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `w-full px-3 py-2 rounded-lg border ${
    darkMode
      ? 'bg-gray-700 text-light border-gray-600 focus:border-primary'
      : 'bg-white text-gray-800 border-gray-300 focus:border-primary'
  } focus:ring-1 focus:ring-primary focus:outline-none transition-colors`;

  const labelClass = `block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
        {isEdit ? 'Edit Subscription' : 'New Autoship Subscription'}
      </h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className={labelClass}>Branch ID</label>
        <input
          type="number"
          min={1}
          value={branchId}
          onChange={e => setBranchId(parseInt(e.target.value))}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className={labelClass}>Frequency</label>
        <select
          value={frequency}
          onChange={e => setFrequency(e.target.value as typeof frequency)}
          className={inputClass}
        >
          {FREQUENCIES.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {isEdit && (
        <div>
          <label className={labelClass}>Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as typeof status)}
            className={inputClass}
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClass}>Items</label>
          <button
            type="button"
            onClick={addItem}
            className="text-sm text-primary hover:text-accent transition-colors"
          >
            + Add Item
          </button>
        </div>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  min={1}
                  placeholder="Product ID"
                  value={item.productId}
                  onChange={e => handleItemChange(index, 'productId', parseInt(e.target.value))}
                  className={inputClass}
                  required
                />
              </div>
              <div className="w-24">
                <input
                  type="number"
                  min={1}
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                  className={inputClass}
                  required
                />
              </div>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-400 hover:text-red-600 transition-colors px-1"
                  aria-label="Remove item"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Enter Product ID and quantity for each item
        </p>
      </div>

      <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <p className={`text-sm font-medium ${darkMode ? 'text-primary' : 'text-primary'}`}>
          🏷️ Subscribe &amp; Save {discountPercentage}% on every order
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-primary hover:bg-accent text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : isEdit ? 'Update Subscription' : 'Create Subscription'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            darkMode
              ? 'bg-gray-700 text-light hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
