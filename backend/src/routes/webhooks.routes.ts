import { Router, Request, Response } from 'express';

const router = Router();

// Webhook endpoints for external services
router.post('/sms', (req: Request, res: Response) => {
  const requestId = req.headers['x-request-id'];
  
  console.log(`📱 [${requestId}] 📨 SMS WEBHOOK: Received SMS webhook request`);
  console.log(`📱 [${requestId}] 📨 SMS WEBHOOK: Request body:`, JSON.stringify(req.body, null, 2));
  
  try {
    const { message, sender, timestamp, userId } = req.body;
   
    console.log(`📱 [${requestId}] 📨 SMS WEBHOOK: Extracted data:`, { 
      message: message?.substring(0, 100) + (message?.length > 100 ? '...' : ''), 
      sender, 
      timestamp, 
      userId 
    });

    // Validate required fields
    if (!message || !sender) {
      console.log(`📱 [${requestId}] ❌ SMS WEBHOOK: Validation failed - missing required fields`);
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: message and sender' 
      });
    }
    
    console.log(`📱 [${requestId}] ✅ SMS WEBHOOK: Validation passed`);
    console.log(`📱 [${requestId}] 🔄 SMS WEBHOOK: Processing SMS message...`);
    
    // TODO: Add SMS processing logic here
    // - Parse SMS content
    // - Extract transaction details
    // - Check for card information
    // - Create transaction record
    // - Send to ML service for categorization
    
    console.log(`📱 [${requestId}] ✅ SMS WEBHOOK: SMS processing completed`);
    
    return res.status(200).json({ 
      success: true,
      status: 'received',
      message: 'SMS received successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Error handling
    console.error(`📱 [${requestId}] 💥 SMS WEBHOOK: Error processing SMS webhook:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Payment webhook endpoint
router.post('/payment', (req: Request, res: Response) => {
  const requestId = req.headers['x-request-id'];
  
  console.log(`💳 [${requestId}] 💰 PAYMENT WEBHOOK: Received payment webhook request`);
  console.log(`💳 [${requestId}] 💰 PAYMENT WEBHOOK: Request body:`, JSON.stringify(req.body, null, 2));
  
  try {
    const { transactionId, status, amount, timestamp } = req.body;
    
    console.log(`💳 [${requestId}] 💰 PAYMENT WEBHOOK: Extracted data:`, { 
      transactionId, 
      status, 
      amount, 
      timestamp 
    });

    // Validate required fields
    if (!transactionId || !status) {
      console.log(`💳 [${requestId}] ❌ PAYMENT WEBHOOK: Validation failed - missing required fields`);
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: transactionId and status' 
      });
    }
    
    console.log(`💳 [${requestId}] ✅ PAYMENT WEBHOOK: Validation passed`);
    console.log(`💳 [${requestId}] 🔄 PAYMENT WEBHOOK: Processing payment update...`);
    
    // TODO: Add payment processing logic here
    // - Update transaction status
    // - Trigger reward calculations
    // - Send notifications
    
    console.log(`💳 [${requestId}] ✅ PAYMENT WEBHOOK: Payment processing completed`);
    
    return res.status(200).json({ 
      success: true,
      status: 'received',
      message: 'Payment webhook received successfully'
    });
  } catch (error) {
    console.error(`💳 [${requestId}] 💥 PAYMENT WEBHOOK: Error processing payment webhook:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

export default router; 