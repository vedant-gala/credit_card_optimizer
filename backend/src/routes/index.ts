import { Router, Request, Response } from 'express';
import authRoutes from '@/routes/auth.routes';
import transactionRoutes from '@/routes/transactions.routes';
import creditCardRoutes from '@/routes/creditCards.routes';
import rewardsRoutes from '@/routes/rewards.routes';
import webhookRoutes from '@/routes/webhooks.routes';

const router = Router();

// Health check
// Note : We prefixed "_req" with an underscore, to indicate to typescript compilers that it is declared but not used intentionally
// If we don't use the underscore, typescript will throw an error since strict mode is enabled
// and you can't declare a variable that is not used
router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/credit-cards', creditCardRoutes);
router.use('/rewards', rewardsRoutes);
router.use('/webhooks', webhookRoutes);

export default router; 