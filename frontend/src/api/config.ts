// Add runtime config type definition
declare global {
    interface Window {
        RUNTIME_CONFIG?: {
            API_URL: string;
        };
    }
}

const getBaseUrl = () => {
    // First check runtime configuration (from runtime-config.js)
    if (typeof window !== 'undefined' && window.RUNTIME_CONFIG?.API_URL) {
        console.log('Using runtime config API_URL:', window.RUNTIME_CONFIG.API_URL);
        return window.RUNTIME_CONFIG.API_URL;
    }
    
    // Check if we're in a Codespace
    const codespaceName = process.env.CODESPACE_NAME;
    if (codespaceName) {
        // Use the same protocol as the current page
        const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';
        const protocolToUse = protocol.includes('https') ? 'https' : 'http';
        console.log(`Using Codespace URL with ${protocolToUse} protocol`);
        return `${protocolToUse}://${codespaceName}-3000.app.github.dev`;
    }
    
    // Auto-detect protocol for local development
    const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
    const protocolToUse = protocol.includes('https') ? 'https' : 'http';

    // In production (non-localhost), use the same origin since API and frontend are co-hosted
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        console.log('Using same-origin API URL');
        return window.location.origin;
    }

    console.log(`Using default localhost URL with ${protocolToUse} protocol`);
    return `${protocolToUse}://localhost:3000`;
};

export const API_BASE_URL = getBaseUrl();

export const api = {
    baseURL: API_BASE_URL,
    endpoints: {
        products: '/api/products',
        productReviews: (productId: number) => `/api/products/${productId}/reviews`,
        suppliers: '/api/suppliers',
        orders: '/api/orders',
        branches: '/api/branches',
        headquarters: '/api/headquarters',
        deliveries: '/api/deliveries',
        orderDetails: '/api/order-details',
        orderDetailDeliveries: '/api/order-detail-deliveries'
    }
};