import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../../api/config';
import type { BundleProduct, ProductBundle } from '../../types/bundle';

interface Product {
  productId: number;
  name: string;
  price: number;
  imgName: string;
}

interface BundleFormData {
  bundleId: number;
  name: string;
  description: string;
  products: BundleProduct[];
  discountPercentage: number;
  imageUrl: string;
}

const emptyForm = (): BundleFormData => ({
  bundleId: 0,
  name: '',
  description: '',
  products: [{ productId: 0, quantity: 1 }],
  discountPercentage: 10,
  imageUrl: ''
});

export default function AdminBundles() {
  const { isAdmin } = useAuth();
  const { darkMode } = useTheme();
  const [bundles, setBundles] = useState<ProductBundle[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<BundleFormData>(emptyForm());
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchBundles();
    fetchProducts();
  }, []);

  const fetchBundles = async () => {
    try {
      const response = await axios.get(`${api.baseURL}${api.endpoints.bundles}`);
      setBundles(response.data);
    } catch (error) {
      console.error('Error fetching bundles:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${api.baseURL}${api.endpoints.products}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleEdit = (bundle: ProductBundle) => {
    setFormData({
      bundleId: bundle.bundleId,
      name: bundle.name,
      description: bundle.description,
      products: [...bundle.products],
      discountPercentage: bundle.discountPercentage,
      imageUrl: bundle.imageUrl || ''
    });
    setEditingId(bundle.bundleId);
    setShowForm(true);
  };

  const handleDelete = async (bundleId: number) => {
    if (!window.confirm('Are you sure you want to delete this bundle?')) return;
    try {
      await axios.delete(`${api.baseURL}${api.endpoints.bundles}/${bundleId}`);
      await fetchBundles();
    } catch (error) {
      console.error('Error deleting bundle:', error);
    }
  };

  const handleAddProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { productId: 0, quantity: 1 }]
    }));
  };

  const handleRemoveProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const handleBundleProductChange = (index: number, field: keyof BundleProduct, value: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map((bp, i) => i === index ? { ...bp, [field]: value } : bp)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ProductBundle = {
      bundleId: formData.bundleId,
      name: formData.name,
      description: formData.description,
      products: formData.products.filter(bp => bp.productId > 0),
      discountPercentage: formData.discountPercentage,
      ...(formData.imageUrl ? { imageUrl: formData.imageUrl } : {})
    };
    try {
      if (editingId !== null) {
        await axios.put(`${api.baseURL}${api.endpoints.bundles}/${editingId}`, payload);
      } else {
        await axios.post(`${api.baseURL}${api.endpoints.bundles}`, payload);
      }
      await fetchBundles();
      setShowForm(false);
      setFormData(emptyForm());
      setEditingId(null);
    } catch (error) {
      console.error('Error saving bundle:', error);
    }
  };

  const inputClass = `w-full px-3 py-2 rounded border ${darkMode ? 'bg-gray-700 text-light border-gray-600 focus:border-primary' : 'bg-white text-gray-800 border-gray-300 focus:border-primary'} focus:outline-none focus:ring-1 focus:ring-primary transition-colors duration-300`;
  const labelClass = `block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 transition-colors duration-300`;

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`container mx-auto px-4 pt-20 pb-8 ${darkMode ? 'bg-dark' : 'bg-gray-100'} min-h-screen transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>Bundle Management</h1>
        <button
          onClick={() => {
            setFormData(emptyForm());
            setEditingId(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-primary hover:bg-accent text-white rounded transition-colors duration-300"
        >
          Add New Bundle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.map(bundle => (
          <div
            key={bundle.bundleId}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-colors duration-300`}
          >
            <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-300`}>
              <div className="flex justify-between items-start">
                <h3 className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>{bundle.name}</h3>
                <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full ml-2 flex-shrink-0">
                  {bundle.discountPercentage}% OFF
                </span>
              </div>
            </div>
            <div className="p-4">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3 transition-colors duration-300`}>
                {bundle.description}
              </p>
              <p className={`text-xs font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider mb-2`}>
                Products ({bundle.products.length})
              </p>
              <ul className="space-y-1 mb-4">
                {bundle.products.map(bp => {
                  const product = products.find(p => p.productId === bp.productId);
                  return (
                    <li key={bp.productId} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      × {bp.quantity} {product?.name || `Product #${bp.productId}`}
                    </li>
                  );
                })}
              </ul>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(bundle)}
                  className="inline-flex items-center px-3 py-1 bg-primary text-white rounded hover:bg-accent transition-colors duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(bundle.bundleId)}
                  className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl transition-colors duration-300`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                {editingId !== null ? 'Edit Bundle' : 'New Bundle'}
              </h2>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); setFormData(emptyForm()); }}
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-300`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {editingId === null && (
                <div>
                  <label className={labelClass}>Bundle ID</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.bundleId || ''}
                    onChange={e => setFormData(prev => ({ ...prev, bundleId: parseInt(e.target.value) || 0 }))}
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label className={labelClass}>Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Discount Percentage</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={100}
                  value={formData.discountPercentage}
                  onChange={e => setFormData(prev => ({ ...prev, discountPercentage: parseFloat(e.target.value) || 0 }))}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Image URL (optional)</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={labelClass}>Products</label>
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="text-sm text-primary hover:text-accent transition-colors"
                  >
                    + Add Product
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.products.map((bp, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <select
                        required
                        value={bp.productId || ''}
                        onChange={e => handleBundleProductChange(index, 'productId', parseInt(e.target.value))}
                        className={`flex-grow ${inputClass}`}
                      >
                        <option value="">Select product...</option>
                        {products.map(p => (
                          <option key={p.productId} value={p.productId}>
                            {p.name} (${p.price.toFixed(2)})
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        required
                        min={1}
                        value={bp.quantity}
                        onChange={e => handleBundleProductChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        className={`w-20 ${inputClass}`}
                      />
                      {formData.products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); setFormData(emptyForm()); }}
                  className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-700 text-light hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors duration-300`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-accent text-white rounded transition-colors duration-300"
                >
                  {editingId !== null ? 'Save Changes' : 'Create Bundle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
