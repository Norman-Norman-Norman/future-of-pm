import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../../api/config';

interface Product {
  productId: number;
  supplierId: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  unit: string;
  imgName: string;
  stockLevel: number;
  reorderPoint: number;
  reorderQuantity: number;
  discount?: number;
}

type SortField = 'name' | 'stockLevel' | 'reorderPoint' | 'reorderQuantity';
type SortOrder = 'asc' | 'desc';

function StockStatusBadge({ product }: { product: Product }) {
  if (product.stockLevel === 0) {
    return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">Out of Stock</span>;
  }
  if (product.stockLevel <= product.reorderPoint) {
    return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">Low Stock</span>;
  }
  return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">In Stock</span>;
}

export default function Inventory() {
  const { isAdmin } = useAuth();
  const { darkMode } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [adjustments, setAdjustments] = useState<Record<number, string>>({});
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${api.baseURL}${api.endpoints.products}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
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

  const sortedProducts = [...products].sort((a, b) => {
    const modifier = sortOrder === 'asc' ? 1 : -1;
    if (sortField === 'name') {
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }) * modifier;
    }
    return (a[sortField] - b[sortField]) * modifier;
  });

  const renderSortIcon = (field: SortField) => {
    if (field !== sortField) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const handleAdjustmentChange = (productId: number, value: string) => {
    setAdjustments(prev => ({ ...prev, [productId]: value }));
  };

  const handleApplyAdjustment = async (product: Product) => {
    const raw = adjustments[product.productId];
    const adjustment = parseInt(raw, 10);
    if (isNaN(adjustment)) {
      setMessage({ text: 'Please enter a valid integer adjustment.', type: 'error' });
      return;
    }
    try {
      await axios.put(`${api.baseURL}${api.endpoints.products}/${product.productId}/stock`, { adjustment });
      setMessage({ text: `Stock for "${product.name}" updated successfully.`, type: 'success' });
      setAdjustments(prev => ({ ...prev, [product.productId]: '' }));
      await fetchProducts();
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: string } })?.response?.data || 'Failed to update stock.';
      setMessage({ text: msg, type: 'error' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const lowStockCount = products.filter(p => p.stockLevel <= p.reorderPoint).length;

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`container mx-auto px-4 pt-20 pb-8 ${darkMode ? 'bg-dark' : 'bg-gray-100'} min-h-screen transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
          Inventory Management
        </h1>
        {lowStockCount > 0 && (
          <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-semibold">
            ⚠️ {lowStockCount} product{lowStockCount !== 1 ? 's' : ''} below reorder point
          </span>
        )}
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className={`min-w-full ${darkMode ? 'bg-dark' : 'bg-white'} rounded-lg overflow-hidden transition-colors duration-300`}>
          <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-200'} transition-colors duration-300`}>
            <tr>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider cursor-pointer transition-colors duration-300`}
                onClick={() => handleSort('name')}
              >
                Product {renderSortIcon('name')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider transition-colors duration-300`}>
                Status
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider cursor-pointer transition-colors duration-300`}
                onClick={() => handleSort('stockLevel')}
              >
                Stock Level {renderSortIcon('stockLevel')}
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider cursor-pointer transition-colors duration-300`}
                onClick={() => handleSort('reorderPoint')}
              >
                Reorder Point {renderSortIcon('reorderPoint')}
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider cursor-pointer transition-colors duration-300`}
                onClick={() => handleSort('reorderQuantity')}
              >
                Reorder Qty {renderSortIcon('reorderQuantity')}
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-light' : 'text-gray-700'} uppercase tracking-wider transition-colors duration-300`}>
                Adjust Stock
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} transition-colors duration-300`}>
            {sortedProducts.map(product => (
              <tr key={product.productId} className={`${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors duration-300`}>
                <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                  <div className="font-medium">{product.name}</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{product.sku}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StockStatusBadge product={product} />
                </td>
                <td className={`px-6 py-4 whitespace-nowrap font-semibold ${
                  product.stockLevel === 0 ? 'text-red-600' :
                  product.stockLevel <= product.reorderPoint ? 'text-yellow-600' :
                  darkMode ? 'text-light' : 'text-gray-800'
                } transition-colors duration-300`}>
                  {product.stockLevel}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                  {product.reorderPoint}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                  {product.reorderQuantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={adjustments[product.productId] ?? ''}
                      onChange={e => handleAdjustmentChange(product.productId, e.target.value)}
                      placeholder="e.g. +10 or -5"
                      className={`w-28 px-2 py-1 text-sm border rounded ${darkMode ? 'bg-gray-700 text-light border-gray-600 placeholder-gray-400' : 'bg-white text-gray-800 border-gray-300 placeholder-gray-400'} focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none`}
                      aria-label={`Stock adjustment for ${product.name}`}
                    />
                    <button
                      onClick={() => handleApplyAdjustment(product)}
                      className="px-3 py-1 bg-primary hover:bg-accent text-white text-sm rounded transition-colors duration-300"
                    >
                      Apply
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
