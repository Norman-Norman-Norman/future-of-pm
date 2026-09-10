// Add runtime config type definition
declare global {
    interface Window {
        RUNTIME_CONFIG?: {
            API_URL: string;
        };
    }
}

import { frontendLogger } from '../logger';

const getBaseUrl = () => {
    frontendLogger.debug('API_CONFIG', 'Resolving API base URL...');

    // First check runtime configuration (from runtime-config.js)
    if (typeof window !== 'undefined' && window.RUNTIME_CONFIG?.API_URL) {
        frontendLogger.info('API_CONFIG', `Using runtime config API_URL: ${window.RUNTIME_CONFIG.API_URL}`);
        return window.RUNTIME_CONFIG.API_URL;
    }
    
    // Check if we're in a Codespace
    const codespaceName = process.env.CODESPACE_NAME;
    if (codespaceName) {
        // Use the same protocol as the current page
        const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';
        const protocolToUse = protocol.includes('https') ? 'https' : 'http';
        const url = `${protocolToUse}://${codespaceName}-3000.app.github.dev`;
        frontendLogger.info('API_CONFIG', `Using Codespace URL: ${url}`);
        return url;
    }
    
    // Auto-detect protocol for local development
    const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
    const protocolToUse = protocol.includes('https') ? 'https' : 'http';

    // In production (non-localhost), use the same origin since API and frontend are co-hosted
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        frontendLogger.info('API_CONFIG', `Using same-origin API URL: ${window.location.origin}`);
        return window.location.origin;
    }

    const url = `${protocolToUse}://localhost:3000`;
    frontendLogger.info('API_CONFIG', `Using default localhost URL: ${url}`);
    return url;
};

export const API_BASE_URL = getBaseUrl();

export const api = {
    baseURL: API_BASE_URL,
    endpoints: {
        products: '/api/products',
        suppliers: '/api/suppliers',
        orders: '/api/orders',
        branches: '/api/branches',
        headquarters: '/api/headquarters',
        deliveries: '/api/deliveries',
        orderDetails: '/api/order-details',
        orderDetailDeliveries: '/api/order-detail-deliveries',
        analytics: '/api/analytics'
    }
};

frontendLogger.info('API_CONFIG', 'API configuration loaded', { baseURL: api.baseURL, endpoints: Object.keys(api.endpoints) });