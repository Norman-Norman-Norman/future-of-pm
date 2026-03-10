import axios from 'axios';
import { useQuery } from 'react-query';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';
import { exportToCsv } from '../../../utils/exportCsv';

interface Delivery {
  deliveryId: number;
  supplierId: number;
  deliveryDate: string;
  name: string;
  description: string;
  status: string;
}

const fetchDeliveries = async (): Promise<Delivery[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.deliveries}`);
  return data;
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in-transit': 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

export default function Deliveries() {
  const { data: deliveries, isLoading, error } = useQuery('deliveries', fetchDeliveries);
  const { darkMode } = useTheme();

  const handleExportCsv = () => {
    if (!deliveries) return;
    exportToCsv(
      'deliveries.csv',
      ['Delivery ID', 'Supplier ID', 'Delivery Date', 'Name', 'Description', 'Status'],
      deliveries.map((d) => [d.deliveryId, d.supplierId, d.deliveryDate, d.name, d.description, d.status])
    );
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 text-center">Failed to fetch deliveries</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Deliveries</h1>
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-2 bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'} text-left`}>
                    <th className="py-3 px-4 font-semibold">Delivery ID</th>
                    <th className="py-3 px-4 font-semibold">Name</th>
                    <th className="py-3 px-4 font-semibold">Description</th>
                    <th className="py-3 px-4 font-semibold">Delivery Date</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries?.map((delivery) => (
                    <tr
                      key={delivery.deliveryId}
                      className={`border-t ${darkMode ? 'border-gray-700 text-gray-200 hover:bg-gray-700' : 'border-gray-100 text-gray-800 hover:bg-gray-50'} transition-colors`}
                    >
                      <td className="py-3 px-4 font-mono">#{delivery.deliveryId}</td>
                      <td className="py-3 px-4 font-medium">{delivery.name}</td>
                      <td className={`py-3 px-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-xs truncate`}>{delivery.description}</td>
                      <td className="py-3 px-4">{new Date(delivery.deliveryDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[delivery.status] || 'bg-gray-100 text-gray-800'}`}>
                          {delivery.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
