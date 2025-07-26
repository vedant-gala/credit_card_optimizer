import { Router } from 'express';

const router = Router();

// Webhook endpoints for external services
router.post('/sms', (req, res) => {
  // Handle SMS webhook
  res.status(200).json({ status: 'received' });
});

router.post('/payment', (req, res) => {
  // Handle payment webhook
  res.status(200).json({ status: 'received' });
});

export default router; 