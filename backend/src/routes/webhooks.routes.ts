import { Router } from 'express';

const router = Router();

// Webhook endpoints for external services
// Note : We prefixed "_req" with an underscore, to indicate to typescript compilers that it is declared but not used intentionally
// If we don't use the underscore, typescript will throw an error since strict mode is enabled
// and you can't declare a variable that is not used
router.post('/sms', (_req, res) => {
  // Handle SMS webhook
  res.status(200).json({ status: 'received' });
});

// Note : We prefixed "_req" with an underscore, to indicate to typescript compilers that it is declared but not used intentionally
// If we don't use the underscore, typescript will throw an error since strict mode is enabled
// and you can't declare a variable that is not used
router.post('/payment', (_req, res) => {
  // Handle payment webhook
  res.status(200).json({ status: 'received' });
});

export default router; 