import { Router, Request, Response, NextFunction } from 'express';
import authRoutes from '@/routes/auth.routes';
import transactionRoutes from '@/routes/transactions.routes';
import creditCardRoutes from '@/routes/creditCards.routes';
import rewardsRoutes from '@/routes/rewards.routes';
import webhookRoutes from '@/routes/webhooks.routes';

const router = Router();

// Route logging middleware
const routeLogger = (req: Request, _res: Response, next: NextFunction) => {
  console.log(`🛣️ [${req.headers['x-request-id']}] 🚦 ROUTE DISPATCHER: Dispatching to ${req.method} ${req.originalUrl}`);
  next();
};

router.use(routeLogger);

// Health check
// Note : We prefixed "_req" with an underscore, to indicate to typescript compilers that it is declared but not used intentionally
// If we don't use the underscore, typescript will throw an error since strict mode is enabled
// and you can't declare a variable that is not used
router.get('/health', (req: Request, res: Response) => {
  console.log(`🏥 [${req.headers['x-request-id']}] 🩺 API HEALTH CHECK: Processing API health check`);
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
  console.log(`🏥 [${req.headers['x-request-id']}] ✅ API HEALTH CHECK: API health check completed`);
});

// API routes with logging
router.use('/auth', (req, _res, next) => {
  console.log(`🔐 [${req.headers['x-request-id']}] 🔄 AUTH ROUTES: Routing to authentication handlers`);
  next();
}, authRoutes);

router.use('/transactions', (req, _res, next) => {
  console.log(`💳 [${req.headers['x-request-id']}] 🔄 TRANSACTION ROUTES: Routing to transaction handlers`);
  next();
}, transactionRoutes);

router.use('/credit-cards', (req, _res, next) => {
  console.log(`💳 [${req.headers['x-request-id']}] 🔄 CREDIT CARD ROUTES: Routing to credit card handlers`);
  next();
}, creditCardRoutes);

router.use('/rewards', (req, _res, next) => {
  console.log(`🎁 [${req.headers['x-request-id']}] 🔄 REWARDS ROUTES: Routing to rewards handlers`);
  next();
}, rewardsRoutes);

router.use('/webhooks', (req, _res, next) => {
  console.log(`🔗 [${req.headers['x-request-id']}] 🔄 WEBHOOK ROUTES: Routing to webhook handlers`);
  next();
}, webhookRoutes);

export default router; 