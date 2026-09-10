import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import path from 'path';
import { existsSync } from 'fs';
import deliveryRoutes from './routes/delivery';
import orderDetailDeliveryRoutes from './routes/orderDetailDelivery';
import productRoutes from './routes/product';
import orderDetailRoutes from './routes/orderDetail';
import orderRoutes from './routes/order';
import branchRoutes from './routes/branch';
import headquartersRoutes from './routes/headquarters';
import supplierRoutes from './routes/supplier';
import analyticsRoutes from './routes/analytics';
import { logger } from './logger';
import { requestLogger } from './middleware/requestLogger';

logger.lifecycle('Server initializing', { nodeVersion: process.version, env: process.env.NODE_ENV || 'development' });

const app = express();
const port = process.env.PORT || 3000;

// Parse CORS origins from environment variable if available
const corsOrigins = process.env.API_CORS_ORIGINS 
  ? process.env.API_CORS_ORIGINS.split(',')
  : [
      'http://localhost:5137', 
      'http://localhost:3001',
      // Allow all Codespace domains
      /^https:\/\/.*\.app\.github\.dev$/
    ];

logger.info('CORS', 'Configured CORS origins', corsOrigins);

// Enable CORS for the frontend
app.use(cors({
  origin: corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow credentials
}));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'REST API documentation using Swagger/OpenAPI',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server (HTTP)',
      },
      {
        url: `https://localhost:${port}`,
        description: 'Development server (HTTPS)',
      }
    ],
  },
  apis: ['./src/models/*.ts', './src/routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
logger.lifecycle('Swagger UI mounted at /api-docs');

app.get('/api-docs.json', (req, res) => {
  logger.route('swagger', 'GET /api-docs.json - Swagger JSON requested');
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocs);
});

app.use(express.json());

// Request/response logging middleware - logs every API call
app.use(requestLogger);

logger.lifecycle('Registering API routes');

app.use('/api/deliveries', deliveryRoutes);
logger.lifecycle('Registered route: /api/deliveries');

app.use('/api/order-detail-deliveries', orderDetailDeliveryRoutes);
logger.lifecycle('Registered route: /api/order-detail-deliveries');

app.use('/api/products', productRoutes);
logger.lifecycle('Registered route: /api/products');

app.use('/api/order-details', orderDetailRoutes);
logger.lifecycle('Registered route: /api/order-details');

app.use('/api/orders', orderRoutes);
logger.lifecycle('Registered route: /api/orders');

app.use('/api/branches', branchRoutes);
logger.lifecycle('Registered route: /api/branches');

app.use('/api/headquarters', headquartersRoutes);
logger.lifecycle('Registered route: /api/headquarters');

app.use('/api/suppliers', supplierRoutes);
logger.lifecycle('Registered route: /api/suppliers');

app.use('/api/analytics', analyticsRoutes);
logger.lifecycle('Registered route: /api/analytics');

app.get('/', (req, res) => {
  logger.route('root', 'GET / - health check');
  res.send('Hello, world!');
});

// Serve frontend static files in production
const publicPath = path.join(__dirname, 'public');
if (existsSync(publicPath)) {
  logger.lifecycle('Serving static frontend files from', publicPath);
  app.use(express.static(publicPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/api-docs')) {
      return next();
    }
    logger.debug('STATIC', `Serving SPA fallback for: ${req.path}`);
    res.sendFile(path.join(publicPath, 'index.html'));
  });
} else {
  logger.info('STATIC', 'No public directory found — skipping static file serving');
}

app.listen(port, () => {
  logger.lifecycle(`Server started on port ${port}`, { 
    port,
    swagger: `http://localhost:${port}/api-docs`,
    apiBase: `http://localhost:${port}/api`
  });
});
