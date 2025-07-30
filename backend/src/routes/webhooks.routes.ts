import { Router, Request, Response } from 'express';
import { SMSParserService } from '@/services/sms-parser.service';
import { PaymentProcessorService } from '@/services/payment-processor.service';

const router = Router();
const smsParserService = new SMSParserService();
const paymentProcessorService = new PaymentProcessorService();

// Webhook endpoints for external services
router.post('/sms', async (req: Request, res: Response) => {
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
    
    // Use SMS Parser Service
    console.log(`📱 [${requestId}] 🔍 SMS WEBHOOK: Using SMS Parser Service...`);
    
    try {
      const parsedData = await smsParserService.parseSMS(message, sender);
      
      console.log(`📱 [${requestId}] ✅ SMS WEBHOOK: SMS parsed successfully by service`);
      console.log(`📱 [${requestId}] 📊 SMS WEBHOOK: Parsed data:`, {
        bank: parsedData.bank.name,
        amount: parsedData.transaction.amount,
        merchant: parsedData.transaction.merchant,
        cardLast4: parsedData.transaction.cardLast4,
        confidence: parsedData.confidence,
        pattern: parsedData.pattern
      });
      
      // TODO: Store transaction in database
      // TODO: Trigger reward calculations
      // TODO: Send real-time notifications
      
      console.log(`📱 [${requestId}] ✅ SMS WEBHOOK: SMS processing completed successfully`);
      
    } catch (parseError: any) {
      console.log(`📱 [${requestId}] ❌ SMS WEBHOOK: SMS parsing failed:`, parseError.message);
      return res.status(400).json({ 
        success: false, 
        message: `SMS parsing failed: ${parseError.message}` 
      });
    }
    
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
router.post('/payment', async (req: Request, res: Response) => {
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
    
    // Use Payment Processor Service
    console.log(`💳 [${requestId}] 💰 PAYMENT WEBHOOK: Using Payment Processor Service...`);
    
    try {
      const webhookData = {
        transactionId,
        status,
        amount,
        timestamp,
        gateway: req.body.gateway,
        referenceId: req.body.referenceId,
        failureReason: req.body.failureReason,
        metadata: req.body.metadata
      };
      
      const result = await paymentProcessorService.processPaymentWebhook(webhookData);
      
      console.log(`💳 [${requestId}] ✅ PAYMENT WEBHOOK: Payment processed successfully by service`);
      console.log(`💳 [${requestId}] 📊 PAYMENT WEBHOOK: Processing result:`, {
        success: result.success,
        status: result.status,
        rewardCalculations: result.rewardCalculations ? 'triggered' : 'none',
        notifications: result.notifications?.length || 0
      });
      
      console.log(`💳 [${requestId}] ✅ PAYMENT WEBHOOK: Payment processing completed successfully`);
      
    } catch (processError: any) {
      console.log(`💳 [${requestId}] ❌ PAYMENT WEBHOOK: Payment processing failed:`, processError.message);
      return res.status(400).json({ 
        success: false, 
        message: `Payment processing failed: ${processError.message}` 
      });
    }
    
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