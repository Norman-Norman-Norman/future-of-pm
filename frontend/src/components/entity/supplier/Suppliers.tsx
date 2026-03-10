import axios from 'axios';
import { useQuery } from 'react-query';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';
import { exportToCsv } from '../../../utils/exportCsv';

interface Supplier {
  supplierId: number;
  name: string;
  description: string;
  contactPerson: string;
  email: string;
  phone: string;
}

const fetchSuppliers = async (): Promise<Supplier[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.suppliers}`);
  return data;
};

export default function Suppliers() {
  const { data: suppliers, isLoading, error } = useQuery('suppliers', fetchSuppliers);
  const { darkMode } = useTheme();

  const handleExportCsv = () => {
    if (!suppliers) return;
    exportToCsv(
      'suppliers.csv',
      ['Supplier ID', 'Name', 'Description', 'Contact Person', 'Email', 'Phone'],
      suppliers.map((s) => [s.supplierId, s.name, s.description, s.contactPerson, s.email, s.phone])
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
          <div className="text-red-500 text-center">Failed to fetch suppliers</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Suppliers</h1>
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
                    <th className="py-3 px-4 font-semibold">Supplier ID</th>
                    <th className="py-3 px-4 font-semibold">Name</th>
                    <th className="py-3 px-4 font-semibold">Description</th>
                    <th className="py-3 px-4 font-semibold">Contact Person</th>
                    <th className="py-3 px-4 font-semibold">Email</th>
                    <th className="py-3 px-4 font-semibold">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers?.map((supplier) => (
                    <tr
                      key={supplier.supplierId}
                      className={`border-t ${darkMode ? 'border-gray-700 text-gray-200 hover:bg-gray-700' : 'border-gray-100 text-gray-800 hover:bg-gray-50'} transition-colors`}
                    >
                      <td className="py-3 px-4 font-mono">#{supplier.supplierId}</td>
                      <td className="py-3 px-4 font-medium">{supplier.name}</td>
                      <td className={`py-3 px-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-xs truncate`}>{supplier.description}</td>
                      <td className="py-3 px-4">{supplier.contactPerson}</td>
                      <td className="py-3 px-4">
                        <a
                          href={`mailto:${supplier.email}`}
                          className="text-primary hover:text-accent transition-colors"
                        >
                          {supplier.email}
                        </a>
                      </td>
                      <td className="py-3 px-4">{supplier.phone}</td>
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
