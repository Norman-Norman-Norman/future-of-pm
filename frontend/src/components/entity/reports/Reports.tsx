import { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';
import { exportToCsv } from '../../../utils/exportCsv';

interface OrdersByStatus {
  status: string;
  count: number;
  totalValue: number;
}

interface InventoryLevel {
  productId: number;
  name: string;
  sku: string;
  price: number;
  unit: string;
  supplierId: number;
  supplierName: string;
}

interface DeliveryPerformance {
  deliveryId: number;
  name: string;
  status: string;
  deliveryDate: string;
  supplierId: number;
  supplierName: string;
}

interface ProductSale {
  productId: number;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}

interface SupplierActivity {
  supplierId: number;
  supplierName: string;
  contactPerson: string;
  email: string;
  deliveryCount: number;
  productCount: number;
}

type ReportKey = 'orders-by-status' | 'inventory-levels' | 'delivery-performance' | 'product-sales' | 'supplier-activity';

const REPORT_CARDS = [
  {
    key: 'orders-by-status' as ReportKey,
    title: 'Orders by Status',
    description: 'Count and value of orders grouped by their current status.',
    icon: '📦',
  },
  {
    key: 'inventory-levels' as ReportKey,
    title: 'Inventory Levels',
    description: 'All products with stock information, pricing, and supplier details.',
    icon: '🏷️',
  },
  {
    key: 'delivery-performance' as ReportKey,
    title: 'Delivery Performance',
    description: 'Delivery status breakdown with supplier information.',
    icon: '🚚',
  },
  {
    key: 'product-sales' as ReportKey,
    title: 'Product Sales',
    description: 'Top products by quantity ordered with total revenue.',
    icon: '📈',
  },
  {
    key: 'supplier-activity' as ReportKey,
    title: 'Supplier Activity',
    description: 'Orders and deliveries per supplier with contact details.',
    icon: '🤝',
  },
];

const fetchReport = async (reportKey: ReportKey) => {
  const endpointMap: Record<ReportKey, string> = {
    'orders-by-status': api.endpoints.reports.ordersByStatus,
    'inventory-levels': api.endpoints.reports.inventoryLevels,
    'delivery-performance': api.endpoints.reports.deliveryPerformance,
    'product-sales': api.endpoints.reports.productSales,
    'supplier-activity': api.endpoints.reports.supplierActivity,
  };
  const { data } = await axios.get(`${api.baseURL}${endpointMap[reportKey]}`);
  return data;
};

function OrdersByStatusTable({ data }: { data: OrdersByStatus[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-700">
          <th className="text-left py-2 px-3">Status</th>
          <th className="text-right py-2 px-3">Count</th>
          <th className="text-right py-2 px-3">Total Value</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.status} className="border-b border-gray-100 dark:border-gray-800">
            <td className="py-2 px-3 capitalize">{row.status}</td>
            <td className="py-2 px-3 text-right">{row.count}</td>
            <td className="py-2 px-3 text-right">${row.totalValue.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function InventoryTable({ data }: { data: InventoryLevel[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-700">
          <th className="text-left py-2 px-3">Name</th>
          <th className="text-left py-2 px-3">SKU</th>
          <th className="text-right py-2 px-3">Price</th>
          <th className="text-left py-2 px-3">Unit</th>
          <th className="text-left py-2 px-3">Supplier</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.productId} className="border-b border-gray-100 dark:border-gray-800">
            <td className="py-2 px-3">{row.name}</td>
            <td className="py-2 px-3 font-mono text-xs">{row.sku}</td>
            <td className="py-2 px-3 text-right">${row.price.toFixed(2)}</td>
            <td className="py-2 px-3">{row.unit}</td>
            <td className="py-2 px-3">{row.supplierName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DeliveryPerformanceTable({ data }: { data: DeliveryPerformance[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-700">
          <th className="text-left py-2 px-3">Name</th>
          <th className="text-left py-2 px-3">Status</th>
          <th className="text-left py-2 px-3">Delivery Date</th>
          <th className="text-left py-2 px-3">Supplier</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.deliveryId} className="border-b border-gray-100 dark:border-gray-800">
            <td className="py-2 px-3">{row.name}</td>
            <td className="py-2 px-3 capitalize">{row.status}</td>
            <td className="py-2 px-3">{new Date(row.deliveryDate).toLocaleDateString()}</td>
            <td className="py-2 px-3">{row.supplierName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ProductSalesTable({ data }: { data: ProductSale[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-700">
          <th className="text-left py-2 px-3">Product</th>
          <th className="text-right py-2 px-3">Qty Ordered</th>
          <th className="text-right py-2 px-3">Total Revenue</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.productId} className="border-b border-gray-100 dark:border-gray-800">
            <td className="py-2 px-3">{row.productName}</td>
            <td className="py-2 px-3 text-right">{row.totalQuantity}</td>
            <td className="py-2 px-3 text-right">${row.totalRevenue.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SupplierActivityTable({ data }: { data: SupplierActivity[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-700">
          <th className="text-left py-2 px-3">Supplier</th>
          <th className="text-left py-2 px-3">Contact</th>
          <th className="text-left py-2 px-3">Email</th>
          <th className="text-right py-2 px-3">Deliveries</th>
          <th className="text-right py-2 px-3">Products</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.supplierId} className="border-b border-gray-100 dark:border-gray-800">
            <td className="py-2 px-3">{row.supplierName}</td>
            <td className="py-2 px-3">{row.contactPerson}</td>
            <td className="py-2 px-3">{row.email}</td>
            <td className="py-2 px-3 text-right">{row.deliveryCount}</td>
            <td className="py-2 px-3 text-right">{row.productCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function handleExportCsv(reportKey: ReportKey, data: unknown[]) {
  switch (reportKey) {
    case 'orders-by-status': {
      const rows = (data as OrdersByStatus[]);
      exportToCsv('orders-by-status.csv', ['Status', 'Count', 'Total Value'],
        rows.map((r) => [r.status, r.count, r.totalValue]));
      break;
    }
    case 'inventory-levels': {
      const rows = (data as InventoryLevel[]);
      exportToCsv('inventory-levels.csv', ['Product ID', 'Name', 'SKU', 'Price', 'Unit', 'Supplier'],
        rows.map((r) => [r.productId, r.name, r.sku, r.price, r.unit, r.supplierName]));
      break;
    }
    case 'delivery-performance': {
      const rows = (data as DeliveryPerformance[]);
      exportToCsv('delivery-performance.csv', ['Delivery ID', 'Name', 'Status', 'Delivery Date', 'Supplier'],
        rows.map((r) => [r.deliveryId, r.name, r.status, r.deliveryDate, r.supplierName]));
      break;
    }
    case 'product-sales': {
      const rows = (data as ProductSale[]);
      exportToCsv('product-sales.csv', ['Product ID', 'Product Name', 'Qty Ordered', 'Total Revenue'],
        rows.map((r) => [r.productId, r.productName, r.totalQuantity, r.totalRevenue]));
      break;
    }
    case 'supplier-activity': {
      const rows = (data as SupplierActivity[]);
      exportToCsv('supplier-activity.csv', ['Supplier ID', 'Supplier Name', 'Contact Person', 'Email', 'Deliveries', 'Products'],
        rows.map((r) => [r.supplierId, r.supplierName, r.contactPerson, r.email, r.deliveryCount, r.productCount]));
      break;
    }
  }
}

interface ReportDetailProps {
  reportKey: ReportKey;
  title: string;
  onClose: () => void;
  darkMode: boolean;
}

function ReportDetail({ reportKey, title, onClose, darkMode }: ReportDetailProps) {
  const { data, isLoading, error } = useQuery(
    ['report', reportKey],
    () => fetchReport(reportKey),
    { staleTime: 30000 }
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto pt-20"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-2xl w-full max-w-4xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="flex items-center gap-3">
            {data && (
              <button
                onClick={() => handleExportCsv(reportKey, data)}
                className="flex items-center gap-2 bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>
            )}
            <button
              onClick={onClose}
              className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4 overflow-x-auto">
          {isLoading && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center py-8">Failed to load report data.</div>
          )}
          {data && reportKey === 'orders-by-status' && <OrdersByStatusTable data={data} />}
          {data && reportKey === 'inventory-levels' && <InventoryTable data={data} />}
          {data && reportKey === 'delivery-performance' && <DeliveryPerformanceTable data={data} />}
          {data && reportKey === 'product-sales' && <ProductSalesTable data={data} />}
          {data && reportKey === 'supplier-activity' && <SupplierActivityTable data={data} />}
        </div>
      </div>
    </div>
  );
}

export default function Reports() {
  const { darkMode } = useTheme();
  const [activeReport, setActiveReport] = useState<ReportKey | null>(null);

  const activeCard = REPORT_CARDS.find((c) => c.key === activeReport);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
            Reports
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Select a report to view data and export as CSV.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {REPORT_CARDS.map((card) => (
              <div
                key={card.key}
                className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 border-transparent hover:border-primary`}
                onClick={() => setActiveReport(card.key)}
              >
                <div className="text-4xl mb-3">{card.icon}</div>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2`}>
                  {card.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  {card.description}
                </p>
                <button
                  className="flex items-center gap-2 text-primary hover:text-accent font-medium text-sm transition-colors"
                >
                  View Report
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeReport && activeCard && (
        <ReportDetail
          reportKey={activeReport}
          title={activeCard.title}
          onClose={() => setActiveReport(null)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
