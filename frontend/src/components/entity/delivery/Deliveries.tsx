import { useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';

interface Delivery {
  deliveryId: number;
  supplierId: number;
  deliveryDate: string;
  name: string;
  description: string;
  status: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  carrier?: string;
}

const STATUS_STEPS = ['pending', 'in-transit', 'out-for-delivery', 'delivered'];

const STATUS_LABELS: Record<string, string> = {
  'pending': 'Pending',
  'in-transit': 'In Transit',
  'out-for-delivery': 'Out for Delivery',
  'delivered': 'Delivered',
  'failed': 'Failed',
};

const STATUS_COLORS: Record<string, string> = {
  'pending': 'bg-gray-200 text-gray-700',
  'in-transit': 'bg-yellow-100 text-yellow-800',
  'out-for-delivery': 'bg-blue-100 text-blue-800',
  'delivered': 'bg-green-100 text-green-800',
  'failed': 'bg-red-100 text-red-800',
};

const STATUS_DOT_COLORS: Record<string, string> = {
  'pending': 'bg-gray-400',
  'in-transit': 'bg-yellow-400',
  'out-for-delivery': 'bg-blue-400',
  'delivered': 'bg-green-500',
  'failed': 'bg-red-500',
};

function getEtaText(delivery: Delivery): string {
  if (delivery.status === 'delivered' && delivery.actualDelivery) {
    const days = Math.round(
      (Date.now() - new Date(delivery.actualDelivery).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days === 0) return 'Delivered today';
    if (days === 1) return 'Delivered yesterday';
    return `Delivered ${days} days ago`;
  }
  if (delivery.estimatedDelivery) {
    const diffMs = new Date(delivery.estimatedDelivery).getTime() - Date.now();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Arriving today';
    if (days === 1) return 'Arriving tomorrow';
    return `Arriving in ${days} days`;
  }
  return '';
}

function StatusBadge({ status, darkMode }: { status: string; darkMode: boolean }) {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const color = darkMode
    ? status === 'delivered'
      ? 'bg-green-900 text-green-200'
      : status === 'in-transit' || status === 'out-for-delivery'
      ? 'bg-yellow-900 text-yellow-200'
      : status === 'failed'
      ? 'bg-red-900 text-red-200'
      : 'bg-gray-700 text-gray-300'
    : STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-700';

  return (
    <span className={`${base} ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${STATUS_DOT_COLORS[status] ?? 'bg-gray-400'}`} />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function StatusTimeline({ status, darkMode }: { status: string; darkMode: boolean }) {
  const isFailed = status === 'failed';
  const currentIndex = isFailed ? -1 : STATUS_STEPS.indexOf(status);

  return (
    <div className="flex items-center w-full mt-4">
      {STATUS_STEPS.map((step, index) => {
        const isCompleted = !isFailed && index <= currentIndex;
        const isCurrent = !isFailed && index === currentIndex;
        const isLast = index === STATUS_STEPS.length - 1;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors
                  ${isCompleted
                    ? 'border-primary bg-primary'
                    : darkMode
                    ? 'border-gray-600 bg-gray-700'
                    : 'border-gray-300 bg-white'
                  }
                  ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}
                `}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-500' : 'bg-gray-300'}`} />
                )}
              </div>
              <span
                className={`mt-1 text-xs whitespace-nowrap
                  ${isCompleted
                    ? 'text-primary font-medium'
                    : darkMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
                  }`}
              >
                {STATUS_LABELS[step]}
              </span>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mx-1 mb-5
                  ${!isFailed && index < currentIndex ? 'bg-primary' : darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

const fetchDeliveries = async (): Promise<Delivery[]> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.deliveries}`);
  return data;
};

export default function Deliveries() {
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { data: deliveries, isLoading, error } = useQuery('deliveries', fetchDeliveries);
  const { darkMode } = useTheme();

  const filtered = deliveries?.filter(
    d => filterStatus === 'all' || d.status === filterStatus
  );

  if (isLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary" />
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
              Delivery Tracking
            </h1>
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'in-transit', 'out-for-delivery', 'delivered', 'failed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                    ${filterStatus === status
                      ? 'bg-primary text-white'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                >
                  {status === 'all' ? 'All' : STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          </div>

          {filtered && filtered.length === 0 ? (
            <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No deliveries found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered?.map(delivery => {
                const etaText = getEtaText(delivery);
                return (
                  <div
                    key={delivery.deliveryId}
                    className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-5 flex flex-col gap-3 cursor-pointer hover:shadow-[0_0_20px_rgba(118,184,82,0.25)] transition-all duration-300`}
                    onClick={() => setSelectedDelivery(delivery)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h2 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} leading-tight`}>
                        {delivery.name}
                      </h2>
                      <StatusBadge status={delivery.status} darkMode={darkMode} />
                    </div>

                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                      {delivery.description}
                    </p>

                    <div className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {delivery.carrier && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7h8" />
                          </svg>
                          <span>{delivery.carrier}</span>
                        </div>
                      )}
                      {delivery.trackingNumber && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span className="font-mono text-xs">{delivery.trackingNumber}</span>
                        </div>
                      )}
                    </div>

                    {etaText && (
                      <div className={`text-sm font-medium px-3 py-1.5 rounded-lg w-fit
                        ${delivery.status === 'delivered'
                          ? darkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-50 text-green-700'
                          : delivery.status === 'failed'
                          ? darkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-50 text-red-700'
                          : darkMode ? 'bg-yellow-900/40 text-yellow-300' : 'bg-yellow-50 text-yellow-800'
                        }`}
                      >
                        {etaText}
                      </div>
                    )}

                    <StatusTimeline status={delivery.status} darkMode={darkMode} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delivery Detail Modal */}
      {selectedDelivery && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedDelivery(null)}
        >
          <div
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-colors duration-300`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} pr-4`}>
                {selectedDelivery.name}
              </h2>
              <button
                onClick={() => setSelectedDelivery(null)}
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'} flex-shrink-0 transition-colors`}
                aria-label="Close detail"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <StatusBadge status={selectedDelivery.status} darkMode={darkMode} />
            </div>

            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              {selectedDelivery.description}
            </p>

            <div className={`grid grid-cols-2 gap-4 mb-6 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {selectedDelivery.carrier && (
                <div>
                  <span className={`block text-xs uppercase tracking-wide font-semibold mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Carrier
                  </span>
                  {selectedDelivery.carrier}
                </div>
              )}
              {selectedDelivery.trackingNumber && (
                <div>
                  <span className={`block text-xs uppercase tracking-wide font-semibold mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Tracking #
                  </span>
                  <span className="font-mono">{selectedDelivery.trackingNumber}</span>
                </div>
              )}
              {selectedDelivery.estimatedDelivery && (
                <div>
                  <span className={`block text-xs uppercase tracking-wide font-semibold mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Estimated Delivery
                  </span>
                  {new Date(selectedDelivery.estimatedDelivery).toLocaleDateString()}
                </div>
              )}
              {selectedDelivery.actualDelivery && (
                <div>
                  <span className={`block text-xs uppercase tracking-wide font-semibold mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Actual Delivery
                  </span>
                  {new Date(selectedDelivery.actualDelivery).toLocaleDateString()}
                </div>
              )}
              <div>
                <span className={`block text-xs uppercase tracking-wide font-semibold mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Scheduled Date
                </span>
                {new Date(selectedDelivery.deliveryDate).toLocaleDateString()}
              </div>
              <div>
                <span className={`block text-xs uppercase tracking-wide font-semibold mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Supplier ID
                </span>
                #{selectedDelivery.supplierId}
              </div>
            </div>

            {getEtaText(selectedDelivery) && (
              <div className={`mb-6 px-4 py-3 rounded-lg font-medium text-sm
                ${selectedDelivery.status === 'delivered'
                  ? darkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-50 text-green-700'
                  : selectedDelivery.status === 'failed'
                  ? darkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-50 text-red-700'
                  : darkMode ? 'bg-yellow-900/40 text-yellow-300' : 'bg-yellow-50 text-yellow-800'
                }`}
              >
                🕐 {getEtaText(selectedDelivery)}
              </div>
            )}

            <div>
              <h3 className={`text-sm uppercase tracking-wide font-semibold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Status Timeline
              </h3>
              <StatusTimeline status={selectedDelivery.status} darkMode={darkMode} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
