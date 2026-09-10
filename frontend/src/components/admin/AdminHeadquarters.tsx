import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../../api/config';

interface Headquarters {
  headquartersId: number;
  name: string;
  description: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
}

type SortField = 'name' | 'address' | 'contactPerson' | 'email';
type SortOrder = 'asc' | 'desc';

export default function AdminHeadquarters() {
  const { isAdmin } = useAuth();
  const { darkMode } = useTheme();
  const [headquarters, setHeadquarters] = useState<Headquarters[]>([]);
  const [editingHQ, setEditingHQ] = useState<Headquarters | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [formData, setFormData] = useState<Partial<Headquarters>>({});

  useEffect(() => {
    fetchHeadquarters();
  }, []);

  const fetchHeadquarters = async () => {
    try {
      const response = await axios.get(`${api.baseURL}${api.endpoints.headquarters}`);
      setHeadquarters(response.data);
    } catch (error) {
      console.error('Error fetching headquarters:', error);
    }
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedHQ = [...headquarters].sort((a, b) => {
    const modifier = sortOrder === 'asc' ? 1 : -1;
    return a[sortField].localeCompare(b[sortField]) * modifier;
  });

  const renderSortIcon = (field: SortField) => {
    if (field !== sortField) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const openCreate = () => {
    setEditingHQ(undefined);
    setFormData({
      name: '',
      description: '',
      address: '',
      contactPerson: '',
      email: '',
      phone: '',
    });
    setShowForm(true);
  };

  const openEdit = (hq: Headquarters) => {
    setEditingHQ(hq);
    setFormData({ ...hq });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingHQ) {
        await axios.put(`${api.baseURL}${api.endpoints.headquarters}/${editingHQ.headquartersId}`, formData);
      } else {
        await axios.post(`${api.baseURL}${api.endpoints.headquarters}`, formData);
      }
      await fetchHeadquarters();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving headquarters:', error);
    }
  };

  const handleDelete = async (hqId: number) => {
    if (window.confirm('Are you sure you want to delete this headquarters?')) {
      try {
        await axios.delete(`${api.baseURL}${api.endpoints.headquarters}/${hqId}`);
        await fetchHeadquarters();
      } catch (error) {
        console.error('Error deleting headquarters:', error);
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
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>Headquarters Management</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-primary hover:bg-accent text-white rounded transition-colors duration-300"
        >
          Add New Headquarters
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className={`min-w-full ${darkMode ? 'bg-dark' : 'bg-white'} rounded-lg overflow-hidden transition-colors duration-300`}>
          <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-200'} transition-colors duration-300`}>
            <tr>
              <th className={thClass} onClick={() => handleSort('name')}>Name {renderSortIcon('name')}</th>
              <th className={thClass} onClick={() => handleSort('address')}>Address {renderSortIcon('address')}</th>
              <th className={thClass} onClick={() => handleSort('contactPerson')}>Contact {renderSortIcon('contactPerson')}</th>
              <th className={thClass} onClick={() => handleSort('email')}>Email {renderSortIcon('email')}</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider transition-colors duration-300`}>Phone</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider transition-colors duration-300`}>Description</th>
              <th className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider transition-colors duration-300`}>Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} transition-colors duration-300`}>
            {sortedHQ.map(hq => (
              <tr key={hq.headquartersId} className={`hover:${darkMode ? 'bg-gray-800' : 'bg-gray-100'} transition-colors duration-300`}>
                <td className={tdClass}>{hq.name}</td>
                <td className={tdClass}>{hq.address}</td>
                <td className={tdClass}>{hq.contactPerson}</td>
                <td className={tdClass}>{hq.email}</td>
                <td className={tdClass}>{hq.phone}</td>
                <td className={`px-6 py-4 ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                  <div className="max-w-xs truncate">{hq.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                  <button
                    onClick={() => openEdit(hq)}
                    className="inline-flex items-center px-3 py-1 bg-primary text-white rounded hover:bg-accent transition-colors duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hq.headquartersId)}
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
              {editingHQ ? 'Edit Headquarters' : 'Add New Headquarters'}
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
                <label className={labelClass}>Address</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Contact Person</label>
                <input
                  type="text"
                  value={formData.contactPerson || ''}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={inputClass}
                  required
                />
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
                  {editingHQ ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
