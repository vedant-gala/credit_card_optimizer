import { Router } from 'express';
import authRoutes from './auth.routes';
import transactionRoutes from './transactions.routes';
import creditCardRoutes from './creditCards.routes';
import rewardsRoutes from './rewards.routes';
import webhookRoutes from './webhooks.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/credit-cards', creditCardRoutes);
router.use('/rewards', rewardsRoutes);
router.use('/webhooks', webhookRoutes);

export default router; 