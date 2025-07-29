import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { errorMiddleware } from '@/middleware/error.middleware';
// TODO - Add auth middleware and then uncomment the import here
//import { authMiddleware } from '@/middleware/auth.middleware';
import routes from '@/routes';

const app = express();

// Custom logging middleware for packet traversal
const packetLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestId = Math.random().toString(36).substring(7);
  req.headers['x-request-id'] = requestId;
  
  console.log(`🔵 [${requestId}] 📥 INCOMING REQUEST:`);
  console.log(`   Method: ${req.method}`);
  console.log(`   URL: ${req.originalUrl}`);
  console.log(`   Headers:`, JSON.stringify(req.headers, null, 2));
  console.log(`   Body:`, JSON.stringify(req.body, null, 2));
  console.log(`   Query:`, JSON.stringify(req.query, null, 2));
  console.log(`   Params:`, JSON.stringify(req.params, null, 2));
  console.log(`   IP: ${req.ip}`);
  console.log(`   User Agent: ${req.get('User-Agent')}`);
  console.log(`   Timestamp: ${new Date().toISOString()}`);
  console.log(`   ──────────────────────────────────────────────`);

  // Log response
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`🔵 [${requestId}] 📤 OUTGOING RESPONSE:`);
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Headers:`, JSON.stringify(res.getHeaders(), null, 2));
    console.log(`   Body:`, typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    console.log(`   Timestamp: ${new Date().toISOString()}`);
    console.log(`   ──────────────────────────────────────────────`);
    return originalSend.call(this, data);
  };

  next();
};

// Apply packet logger first
app.use(packetLogger);

// Security middleware setup

// Helmet helps secure Express apps by setting various HTTP headers.
// It protects against some well-known web vulnerabilities by default.
app.use((req, _res, next) => {
  console.log(`🛡️ [${req.headers['x-request-id']}] 🔒 HELMET MIDDLEWARE: Adding security headers`);
  next();
});
app.use(helmet());
app.use((req, _res, next) => {
  console.log(`🛡️ [${req.headers['x-request-id']}] ✅ HELMET MIDDLEWARE: Security headers applied`);
  next();
});

// CORS (Cross-Origin Resource Sharing) middleware configuration.
// This allows the backend API to accept requests from specified origins (frontends).
// - The 'origin' option is set from the CORS_ORIGIN environment variable (comma-separated list), or defaults to localhost:3000.
// - 'credentials: true' allows cookies and authentication headers to be sent in cross-origin requests.
app.use((req, _res, next) => {
  console.log(`🌐 [${req.headers['x-request-id']}] 🔒 CORS MIDDLEWARE: Checking origin ${req.get('Origin')}`);
  next();
});
app.use(cors({
  origin: process.env['CORS_ORIGIN']?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
app.use((req, _res, next) => {
  console.log(`🌐 [${req.headers['x-request-id']}] ✅ CORS MIDDLEWARE: Origin check completed`);
  next();
});

// Rate limiting middleware setup
// This middleware helps protect the API from brute-force attacks and abuse by limiting
// the number of requests that can be made from a single IP address within a specified time window.
//
// - 'windowMs': The time frame for which requests are checked/remembered (in milliseconds).
//   It is set from the RATE_LIMIT_WINDOW_MS environment variable, or defaults to 15 minutes (900000 ms).
// - 'max': The maximum number of requests allowed from a single IP during the window.
//   It is set from the RATE_LIMIT_MAX_REQUESTS environment variable, or defaults to 100 requests.
// - 'message': The response message sent when the rate limit is exceeded.
const limiter = rateLimit({
  windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'),
  max: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100'),
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', (req, _res, next) => {
  console.log(`⏱️ [${req.headers['x-request-id']}] 🔒 RATE LIMIT MIDDLEWARE: Checking rate limit for IP ${req.ip}`);
  next();
});
app.use('/api/', limiter);
app.use('/api/', (req, _res, next) => {
  console.log(`⏱️ [${req.headers['x-request-id']}] ✅ RATE LIMIT MIDDLEWARE: Rate limit check passed`);
  next();
});

// Body parsing middleware
// This middleware parses incoming requests with JSON payloads.
// The 'limit' option restricts the maximum request body size to 10 megabytes to prevent large payload attacks.
app.use((req, _res, next) => {
  console.log(`📦 [${req.headers['x-request-id']}] 🔄 JSON PARSER MIDDLEWARE: Parsing JSON body`);
  next();
});
app.use(express.json({ limit: '10mb' }));
app.use((req, _res, next) => {
  console.log(`📦 [${req.headers['x-request-id']}] ✅ JSON PARSER MIDDLEWARE: JSON body parsed, size: ${JSON.stringify(req.body).length} chars`);
  next();
});

// This middleware parses incoming requests with URL-encoded payloads (e.g., form submissions).
// The 'extended: true' option allows for rich objects and arrays to be encoded into the URL-encoded format.
// The 'limit' option restricts the maximum request body size to 10 megabytes.
app.use((req, _res, next) => {
  console.log(`📦 [${req.headers['x-request-id']}] 🔄 URL ENCODED PARSER MIDDLEWARE: Parsing URL-encoded body`);
  next();
});
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use((req, _res, next) => {
  console.log(`📦 [${req.headers['x-request-id']}] ✅ URL ENCODED PARSER MIDDLEWARE: URL-encoded body parsed`);
  next();
});

// Compression middleware
// This middleware compresses the response body before sending it to the client.
// It helps reduce the size of the response, which can improve the performance of the API.
app.use((req, _res, next) => {
  console.log(`🗜️ [${req.headers['x-request-id']}] 🔄 COMPRESSION MIDDLEWARE: Setting up compression`);
  next();
});
app.use(compression());
app.use((req, _res, next) => {
  console.log(`🗜️ [${req.headers['x-request-id']}] ✅ COMPRESSION MIDDLEWARE: Compression ready`);
  next();
});

// Logging middleware
// This middleware logs incoming requests to the console.
// It is only enabled in non-test environments to avoid logging in test environments.
// The 'combined' format includes the request method, URL, status code, and response time.
if (process.env['NODE_ENV'] !== 'test') {
  app.use((req, _res, next) => {
    console.log(`📝 [${req.headers['x-request-id']}] 🔄 MORGAN MIDDLEWARE: Setting up HTTP logging`);
    next();
  });
  app.use(morgan('combined'));
  app.use((req, _res, next) => {
    console.log(`📝 [${req.headers['x-request-id']}] ✅ MORGAN MIDDLEWARE: HTTP logging configured`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  console.log(`🏥 [${req.headers['x-request-id']}] 🩺 HEALTH CHECK: Processing health check request`);
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env['NODE_ENV']
  });
  console.log(`🏥 [${req.headers['x-request-id']}] ✅ HEALTH CHECK: Health check completed`);
});

// Swagger documentation
// This middleware serves the Swagger documentation for the API.
// It is only enabled if the ENABLE_SWAGGER environment variable is set to 'true'.
// The Swagger options include:
// - 'openapi': The version of the OpenAPI specification.
// - 'info': Information about the API, including title, version, and description.
// - 'servers': The servers (URLs) where the API is hosted.
if (process.env['ENABLE_SWAGGER'] === 'true') {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Credit Card Optimizer API',
        version: '1.0.0',
        description: 'API for Credit Card Rewards Optimization'
      },
      servers: [
        {
          url: `http://localhost:${process.env['PORT'] || 3001}`,
          description: 'Development server'
        }
      ]
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts']
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// API routes
// This middleware mounts the API routes at the '/api/v1' path.
// The routes are defined in the 'routes' module.
app.use('/api/v1', (req, _res, next) => {
  console.log(`🚀 [${req.headers['x-request-id']}] 🔄 API ROUTER: Routing to /api/v1 handlers`);
  next();
}, routes);

// 404 handler
// This middleware handles requests to non-existent routes.
// It returns a 404 status code with a JSON response containing the requested URL.
app.use('*', (req, res) => {
  console.log(`❌ [${req.headers['x-request-id']}] 🚫 404 HANDLER: Route not found - ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
  console.log(`❌ [${req.headers['x-request-id']}] ✅ 404 HANDLER: 404 response sent`);
});

// Error handling middleware
// This middleware handles errors that occur during request processing.
// It passes the error to the error middleware for further processing.
// The error middleware is defined in the 'error.middleware' module.
// Express identifies a middleware function that takes four arguments (err, req, res, next) as an error-handling middleware.
app.use(errorMiddleware);

export default app; 