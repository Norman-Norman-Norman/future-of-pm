import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../../api/config';

interface Supplier {
  supplierId: number;
  name: string;
}

interface Delivery {
  deliveryId: number;
  supplierId: number;
  deliveryDate: string;
  name: string;
  description: string;
  status: string;
}

type SortField = 'name' | 'status' | 'deliveryDate' | 'supplier';
type SortOrder = 'asc' | 'desc';

const DELIVERY_STATUSES = ['pending', 'in-transit', 'delivered', 'failed'];

export default function AdminDeliveries() {
  const { isAdmin } = useAuth();
  const { darkMode } = useTheme();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [editingDelivery, setEditingDelivery] = useState<Delivery | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [formData, setFormData] = useState<Partial<Delivery>>({});

  useEffect(() => {
    fetchDeliveries();
    fetchSuppliers();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get(`${api.baseURL}${api.endpoints.deliveries}`);
      setDeliveries(response.data);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${api.baseURL}${api.endpoints.suppliers}`);
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const getSupplierName = (supplierId: number) => {
    return suppliers.find(s => s.supplierId === supplierId)?.name || 'Unknown';
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedDeliveries = [...deliveries].sort((a, b) => {
    const modifier = sortOrder === 'asc' ? 1 : -1;
    if (sortField === 'supplier') {
      return getSupplierName(a.supplierId).localeCompare(getSupplierName(b.supplierId)) * modifier;
    }
    return a[sortField].localeCompare(b[sortField]) * modifier;
  });

  const renderSortIcon = (field: SortField) => {
    if (field !== sortField) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const openCreate = () => {
    setEditingDelivery(undefined);
    setFormData({
      name: '',
      description: '',
      status: 'pending',
      supplierId: suppliers[0]?.supplierId || 0,
      deliveryDate: new Date().toISOString(),
    });
    setShowForm(true);
  };

  const openEdit = (delivery: Delivery) => {
    setEditingDelivery(delivery);
    setFormData({ ...delivery });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDelivery) {
        await axios.put(`${api.baseURL}${api.endpoints.deliveries}/${editingDelivery.deliveryId}`, formData);
      } else {
        await axios.post(`${api.baseURL}${api.endpoints.deliveries}`, formData);
      }
      await fetchDeliveries();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving delivery:', error);
    }
  };

  const handleDelete = async (deliveryId: number) => {
    if (window.confirm('Are you sure you want to delete this delivery?')) {
      try {
        await axios.delete(`${api.baseURL}${api.endpoints.deliveries}/${deliveryId}`);
        await fetchDeliveries();
      } catch (error) {
        console.error('Error deleting delivery:', error);
      }
    }
  };

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const inputClass = `w-full px-3 py-2 ${darkMode ? 'bg-gray-700 text-light' : 'bg-gray-100 text-gray-800'} rounded transition-colors duration-300`;
  const labelClass = `block ${darkMode ? 'text-light' : 'text-gray-700'} mb-1 transition-colors duration-300`;
  const thClass = `px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider cursor-pointer transition-colors duration-300`;
  const tdClass = `px-6 py-4 whitespace-nowrap ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`;

  return (
    <div className={`container mx-auto px-4 pt-20 pb-8 ${darkMode ? 'bg-dark' : 'bg-gray-100'} min-h-screen transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>Delivery Management</h1>
        <button
          onClick={openCreate}
          disabled={suppliers.length === 0}
          title={suppliers.length === 0 ? 'No suppliers available — create a supplier first' : undefined}
          className="px-4 py-2 bg-primary hover:bg-accent text-white rounded transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add New Delivery
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className={`min-w-full ${darkMode ? 'bg-dark' : 'bg-white'} rounded-lg overflow-hidden transition-colors duration-300`}>
          <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-200'} transition-colors duration-300`}>
            <tr>
              <th className={thClass} onClick={() => handleSort('name')}>Name {renderSortIcon('name')}</th>
              <th className={thClass} onClick={() => handleSort('supplier')}>Supplier {renderSortIcon('supplier')}</th>
              <th className={thClass} onClick={() => handleSort('deliveryDate')}>Date {renderSortIcon('deliveryDate')}</th>
              <th className={thClass} onClick={() => handleSort('status')}>Status {renderSortIcon('status')}</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider transition-colors duration-300`}>Description</th>
              <th className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider transition-colors duration-300`}>Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} transition-colors duration-300`}>
            {sortedDeliveries.map(delivery => (
              <tr key={delivery.deliveryId} className={`hover:${darkMode ? 'bg-gray-800' : 'bg-gray-100'} transition-colors duration-300`}>
                <td className={tdClass}>{delivery.name}</td>
                <td className={tdClass}>{getSupplierName(delivery.supplierId)}</td>
                <td className={tdClass}>{new Date(delivery.deliveryDate).toLocaleDateString()}</td>
                <td className={tdClass}>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    delivery.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    delivery.status === 'failed' ? 'bg-red-100 text-red-800' :
                    delivery.status === 'in-transit' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>{delivery.status}</span>
                </td>
                <td className={`px-6 py-4 ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                  <div className="max-w-xs truncate">{delivery.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                  <button
                    onClick={() => openEdit(delivery)}
                    className="inline-flex items-center px-3 py-1 bg-primary text-white rounded hover:bg-accent transition-colors duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(delivery.deliveryId)}
                    className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md shadow-xl transition-colors duration-300`}>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors duration-300`}>
              {editingDelivery ? 'Edit Delivery' : 'Add New Delivery'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Supplier</label>
                <select
                  value={formData.supplierId || ''}
                  onChange={(e) => setFormData({ ...formData, supplierId: parseInt(e.target.value) })}
                  className={inputClass}
                  required
                >
                  {suppliers.map(supplier => (
                    <option key={supplier.supplierId} value={supplier.supplierId}>{supplier.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Delivery Date</label>
                <input
                  type="date"
                  value={formData.deliveryDate ? formData.deliveryDate.split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: new Date(e.target.value).toISOString() })}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select
                  value={formData.status || 'pending'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={inputClass}
                  required
                >
                  {DELIVERY_STATUSES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className={`px-4 py-2 ${darkMode ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-800'} rounded transition-colors duration-300`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-accent transition-colors duration-300"
                >
                  {editingDelivery ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
