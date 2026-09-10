import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../../api/config';

interface Branch {
  branchId: number;
  name: string;
}

interface Order {
  orderId: number;
  branchId: number;
  orderDate: string;
  name: string;
  description: string;
  status: string;
}

type SortField = 'name' | 'status' | 'orderDate' | 'branch';
type SortOrder = 'asc' | 'desc';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const { isAdmin } = useAuth();
  const { darkMode } = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [editingOrder, setEditingOrder] = useState<Order | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [formData, setFormData] = useState<Partial<Order>>({});

  useEffect(() => {
    fetchOrders();
    fetchBranches();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${api.baseURL}${api.endpoints.orders}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${api.baseURL}${api.endpoints.branches}`);
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const getBranchName = (branchId: number) => {
    return branches.find(b => b.branchId === branchId)?.name || 'Unknown';
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const modifier = sortOrder === 'asc' ? 1 : -1;
    if (sortField === 'branch') {
      return getBranchName(a.branchId).localeCompare(getBranchName(b.branchId)) * modifier;
    }
    return a[sortField].localeCompare(b[sortField]) * modifier;
  });

  const renderSortIcon = (field: SortField) => {
    if (field !== sortField) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const openCreate = () => {
    setEditingOrder(undefined);
    setFormData({
      name: '',
      description: '',
      status: 'pending',
      branchId: branches[0]?.branchId || 0,
      orderDate: new Date().toISOString(),
    });
    setShowForm(true);
  };

  const openEdit = (order: Order) => {
    setEditingOrder(order);
    setFormData({ ...order });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingOrder) {
        await axios.put(`${api.baseURL}${api.endpoints.orders}/${editingOrder.orderId}`, formData);
      } else {
        await axios.post(`${api.baseURL}${api.endpoints.orders}`, formData);
      }
      await fetchOrders();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleDelete = async (orderId: number) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`${api.baseURL}${api.endpoints.orders}/${orderId}`);
        await fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
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
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>Order Management</h1>
        <button
          onClick={openCreate}
          disabled={branches.length === 0}
          title={branches.length === 0 ? 'No branches available — create a branch first' : undefined}
          className="px-4 py-2 bg-primary hover:bg-accent text-white rounded transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add New Order
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className={`min-w-full ${darkMode ? 'bg-dark' : 'bg-white'} rounded-lg overflow-hidden transition-colors duration-300`}>
          <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-200'} transition-colors duration-300`}>
            <tr>
              <th className={thClass} onClick={() => handleSort('name')}>Name {renderSortIcon('name')}</th>
              <th className={thClass} onClick={() => handleSort('branch')}>Branch {renderSortIcon('branch')}</th>
              <th className={thClass} onClick={() => handleSort('orderDate')}>Date {renderSortIcon('orderDate')}</th>
              <th className={thClass} onClick={() => handleSort('status')}>Status {renderSortIcon('status')}</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider transition-colors duration-300`}>Description</th>
              <th className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider transition-colors duration-300`}>Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} transition-colors duration-300`}>
            {sortedOrders.map(order => (
              <tr key={order.orderId} className={`hover:${darkMode ? 'bg-gray-800' : 'bg-gray-100'} transition-colors duration-300`}>
                <td className={tdClass}>{order.name}</td>
                <td className={tdClass}>{getBranchName(order.branchId)}</td>
                <td className={tdClass}>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className={tdClass}>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>{order.status}</span>
                </td>
                <td className={`px-6 py-4 ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                  <div className="max-w-xs truncate">{order.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                  <button
                    onClick={() => openEdit(order)}
                    className="inline-flex items-center px-3 py-1 bg-primary text-white rounded hover:bg-accent transition-colors duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(order.orderId)}
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
              {editingOrder ? 'Edit Order' : 'Add New Order'}
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
                <label className={labelClass}>Branch</label>
                <select
                  value={formData.branchId || ''}
                  onChange={(e) => setFormData({ ...formData, branchId: parseInt(e.target.value) })}
                  className={inputClass}
                  required
                >
                  {branches.map(branch => (
                    <option key={branch.branchId} value={branch.branchId}>{branch.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Order Date</label>
                <input
                  type="date"
                  value={formData.orderDate ? formData.orderDate.split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, orderDate: new Date(e.target.value).toISOString() })}
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
                  {ORDER_STATUSES.map(s => (
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
                  {editingOrder ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
