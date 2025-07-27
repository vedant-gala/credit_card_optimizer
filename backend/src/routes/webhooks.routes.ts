import { Router } from 'express';

const router = Router();

// Webhook endpoints for external services
router.post('/sms', (req, res) => {
  try {
    const { message, sender, timestamp, userId } = req.body;
   
    console.log('Received SMS webhook:', { message, sender, timestamp, userId });

    // Validate required fields
    if (!message || !sender) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Continue processing...
    return res.status(200).json({ status: 'received' });
  } catch (error) {
    // Error handling
    console.error('Error processing SMS webhook:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Note : We prefixed "_req" with an underscore, to indicate to typescript compilers that it is declared but not used intentionally
// If we don't use the underscore, typescript will throw an error since strict mode is enabled
// and you can't declare a variable that is not used
router.post('/payment', (_req, res) => {
  // Handle payment webhook
  res.status(200).json({ status: 'received' });
});

export default router; 