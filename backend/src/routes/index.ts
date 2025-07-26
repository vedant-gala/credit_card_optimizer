import { Router } from 'express';
import authRoutes from '@/routes/auth.routes';
import transactionRoutes from '@/routes/transactions.routes';
import creditCardRoutes from '@/routes/creditCards.routes';
import rewardsRoutes from '@/routes/rewards.routes';
import webhookRoutes from '@/routes/webhooks.routes';

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