import { Router, Request, Response, NextFunction } from 'express';
import { paymentController } from '@/controllers/payment.controller';

const router = Router();

// Payment route logging middleware
const paymentRouteLogger = (req: Request, _res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'];
  console.log(`💰 [${requestId}] 🔄 PAYMENT ROUTE: Processing ${req.method} ${req.path}`);
  console.log(`💰 [${requestId}] 💰 PAYMENT ROUTE: Request params:`, req.params);
  console.log(`💰 [${requestId}] 💰 PAYMENT ROUTE: Request query:`, req.query);
  next();
};

router.use(paymentRouteLogger);

/**
 * @swagger
 * /payments/process:
 *   post:
 *     summary: Process a new payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionId
 *               - amount
 *               - currency
 *             properties:
 *               transactionId:
 *                 type: string
 *                 description: Unique transaction identifier
 *               amount:
 *                 type: number
 *                 description: Payment amount
 *               currency:
 *                 type: string
 *                 description: Payment currency (e.g., INR, USD)
 *               gateway:
 *                 type: string
 *                 description: Payment gateway name
 *               metadata:
 *                 type: object
 *                 description: Additional payment metadata
 *     responses:
 *       200:
 *         description: Payment processing initiated successfully
 *       400:
 *         description: Invalid request data
 */
router.post('/process', paymentController.processPayment);

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Process payment webhook from external services
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionId
 *               - status
 *               - timestamp
 *             properties:
 *               transactionId:
 *                 type: string
 *                 description: Transaction identifier
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed, cancelled, refunded]
 *                 description: Payment status
 *               amount:
 *                 type: number
 *                 description: Payment amount
 *               currency:
 *                 type: string
 *                 description: Payment currency
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: Webhook timestamp
 *               gateway:
 *                 type: string
 *                 description: Payment gateway
 *               referenceId:
 *                 type: string
 *                 description: Gateway reference ID
 *               failureReason:
 *                 type: string
 *                 description: Failure reason if status is failed
 *               metadata:
 *                 type: object
 *                 description: Additional webhook data
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Invalid webhook data
 */
router.post('/webhook', paymentController.processWebhook);

/**
 * @swagger
 * /payments/transactions/{transactionId}/status:
 *   put:
 *     summary: Update transaction status
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed, cancelled, refunded]
 *                 description: New transaction status
 *               notes:
 *                 type: string
 *                 description: Optional notes about the status change
 *     responses:
 *       200:
 *         description: Transaction status updated successfully
 *       400:
 *         description: Invalid status or transaction ID
 *       404:
 *         description: Transaction not found
 */
router.put('/transactions/:transactionId/status', paymentController.updateTransactionStatus);

/**
 * @swagger
 * /payments/transactions/{transactionId}/status:
 *   get:
 *     summary: Get transaction status and history
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction identifier
 *     responses:
 *       200:
 *         description: Transaction status retrieved successfully
 *       400:
 *         description: Invalid transaction ID
 *       404:
 *         description: Transaction not found
 */
router.get('/transactions/:transactionId/status', paymentController.getTransactionStatus);

/**
 * @swagger
 * /payments/stats:
 *   get:
 *     summary: Get payment processing statistics
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Processing statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalProcessed:
 *                       type: number
 *                       description: Total number of payments processed
 *                     successRate:
 *                       type: number
 *                       description: Success rate as decimal (0.0 to 1.0)
 *                     averageProcessingTime:
 *                       type: number
 *                       description: Average processing time in milliseconds
 *                     lastUpdated:
 *                       type: string
 *                       format: date-time
 *                       description: Last statistics update timestamp
 */
router.get('/stats', paymentController.getProcessingStats);

/**
 * @swagger
 * /payments/transactions/{transactionId}/rewards:
 *   post:
 *     summary: Trigger reward calculations for a transaction
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction identifier
 *     responses:
 *       200:
 *         description: Reward calculations triggered successfully
 *       400:
 *         description: Invalid transaction ID
 *       404:
 *         description: Transaction not found
 */
router.post('/transactions/:transactionId/rewards', paymentController.triggerRewardCalculations);

export default router; 