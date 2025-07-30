import { Router, Request, Response, NextFunction } from 'express';
import { smsController } from '@/controllers/sms.controller';

const router = Router();

// SMS route logging middleware
const smsRouteLogger = (req: Request, _res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'];
  console.log(`📱 [${requestId}] 🔄 SMS ROUTE: Processing ${req.method} ${req.path}`);
  console.log(`📱 [${requestId}] 📱 SMS ROUTE: Request params:`, req.params);
  console.log(`📱 [${requestId}] 📱 SMS ROUTE: Request query:`, req.query);
  next();
};

router.use(smsRouteLogger);

/**
 * @swagger
 * /sms/parse:
 *   post:
 *     summary: Parse SMS message and extract transaction data
 *     tags: [SMS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - sender
 *             properties:
 *               message:
 *                 type: string
 *                 description: The SMS message content
 *                 example: "Spent Rs.799 On HDFC Bank Card 0088 At Payu*Swiggy Food On 2025-07-30:19:56:11"
 *               sender:
 *                 type: string
 *                 description: The SMS sender ID
 *                 example: "HDFCBK"
 *     responses:
 *       200:
 *         description: SMS parsed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid request or parsing failed
 */
router.post('/parse', smsController.parseSMS);

/**
 * @swagger
 * /sms/validate:
 *   post:
 *     summary: Validate SMS message format
 *     tags: [SMS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - sender
 *             properties:
 *               message:
 *                 type: string
 *                 description: The SMS message content
 *               sender:
 *                 type: string
 *                 description: The SMS sender ID
 *     responses:
 *       200:
 *         description: SMS validation completed
 */
router.post('/validate', smsController.validateSMS);

/**
 * @swagger
 * /sms/banks:
 *   get:
 *     summary: Get list of supported banks
 *     tags: [SMS]
 *     responses:
 *       200:
 *         description: Supported banks retrieved successfully
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
 *                     banks:
 *                       type: array
 *                       items:
 *                         type: object
 *                     total:
 *                       type: number
 *                     countries:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.get('/banks', smsController.getSupportedBanks);

/**
 * @swagger
 * /sms/patterns:
 *   get:
 *     summary: Get list of supported SMS patterns
 *     tags: [SMS]
 *     responses:
 *       200:
 *         description: Supported patterns retrieved successfully
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
 *                     patterns:
 *                       type: array
 *                       items:
 *                         type: object
 *                     total:
 *                       type: number
 *                     banks:
 *                       type: array
 *                       items:
 *                         type: string
 *                     countries:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.get('/patterns', smsController.getSupportedPatterns);

/**
 * @swagger
 * /sms/stats:
 *   get:
 *     summary: Get SMS parsing statistics
 *     tags: [SMS]
 *     responses:
 *       200:
 *         description: Parsing statistics retrieved successfully
 */
router.get('/stats', smsController.getParsingStats);

/**
 * @swagger
 * /sms/test-pattern:
 *   post:
 *     summary: Test a specific SMS pattern against a message
 *     tags: [SMS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - patternId
 *             properties:
 *               message:
 *                 type: string
 *                 description: The SMS message content to test
 *               patternId:
 *                 type: string
 *                 description: The pattern ID to test against
 *                 example: "hdfc_spent_format"
 *     responses:
 *       200:
 *         description: Pattern test completed
 *       404:
 *         description: Pattern not found
 */
router.post('/test-pattern', smsController.testPattern);

export default router; 