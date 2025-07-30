import { Router, Request, Response, NextFunction } from 'express';
import { hybridSMSController } from '@/controllers/hybrid-sms.controller';

const router = Router();

// Route logging middleware
const hybridSMSRouteLogger = (req: Request, _res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'];
  console.log(`📱 [${requestId}] 🔄 HYBRID SMS ROUTES: ${req.method} ${req.path}`);
  next();
};

router.use(hybridSMSRouteLogger);

/**
 * @swagger
 * /api/v1/hybrid-sms/parse:
 *   post:
 *     summary: Parse SMS using hybrid parser (LLM + Regex)
 *     description: Parse SMS message using Phi-2 LLM with regex fallback for maximum accuracy
 *     tags: [Hybrid SMS Parser]
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
 *                 description: SMS message content
 *                 example: "Spent Rs.799 On HDFC Bank Card 0088 At Payu*Swiggy Food On 2025-07-30:19:56:11"
 *               sender:
 *                 type: string
 *                 description: SMS sender ID
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
 *                   $ref: '#/components/schemas/ParsedSMSData'
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */
router.post('/parse', hybridSMSController.parseSMS);

/**
 * @swagger
 * /api/v1/hybrid-sms/test:
 *   post:
 *     summary: Test SMS parsing with detailed results
 *     description: Test SMS parsing and get detailed results from both LLM and regex methods
 *     tags: [Hybrid SMS Parser]
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
 *                 description: SMS message content
 *               sender:
 *                 type: string
 *                 description: SMS sender ID
 *     responses:
 *       200:
 *         description: Test completed successfully
 */
router.post('/test', hybridSMSController.testParsing);

/**
 * @swagger
 * /api/v1/hybrid-sms/stats:
 *   get:
 *     summary: Get parser statistics
 *     description: Get comprehensive statistics about the hybrid SMS parser performance
 *     tags: [Hybrid SMS Parser]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/stats', hybridSMSController.getStats);

/**
 * @swagger
 * /api/v1/hybrid-sms/stats/detailed:
 *   get:
 *     summary: Get detailed parser statistics
 *     description: Get detailed statistics including LLM connection status and available models
 *     tags: [Hybrid SMS Parser]
 *     responses:
 *       200:
 *         description: Detailed statistics retrieved successfully
 */
router.get('/stats/detailed', hybridSMSController.getDetailedStats);

/**
 * @swagger
 * /api/v1/hybrid-sms/config:
 *   get:
 *     summary: Get parser configuration
 *     description: Get current configuration of the hybrid SMS parser
 *     tags: [Hybrid SMS Parser]
 *     responses:
 *       200:
 *         description: Configuration retrieved successfully
 */
router.get('/config', hybridSMSController.getConfig);

/**
 * @swagger
 * /api/v1/hybrid-sms/config:
 *   put:
 *     summary: Update parser configuration
 *     description: Update configuration of the hybrid SMS parser
 *     tags: [Hybrid SMS Parser]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               useLLM:
 *                 type: boolean
 *                 description: Enable/disable LLM parsing
 *               llmConfidenceThreshold:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 description: Minimum confidence threshold for LLM results
 *               enableCaching:
 *                 type: boolean
 *                 description: Enable/disable result caching
 *               fallbackToRegex:
 *                 type: boolean
 *                 description: Enable/disable regex fallback
 *               ollamaUrl:
 *                 type: string
 *                 description: Ollama server URL
 *               model:
 *                 type: string
 *                 description: LLM model name
 *     responses:
 *       200:
 *         description: Configuration updated successfully
 */
router.put('/config', hybridSMSController.updateConfig);

/**
 * @swagger
 * /api/v1/hybrid-sms/llm/enable:
 *   post:
 *     summary: Enable LLM parsing
 *     description: Enable LLM-based SMS parsing
 *     tags: [Hybrid SMS Parser]
 *     responses:
 *       200:
 *         description: LLM parsing enabled successfully
 */
router.post('/llm/enable', hybridSMSController.enableLLM);

/**
 * @swagger
 * /api/v1/hybrid-sms/llm/disable:
 *   post:
 *     summary: Disable LLM parsing
 *     description: Disable LLM-based SMS parsing (fallback to regex only)
 *     tags: [Hybrid SMS Parser]
 *     responses:
 *       200:
 *         description: LLM parsing disabled successfully
 */
router.post('/llm/disable', hybridSMSController.disableLLM);

/**
 * @swagger
 * /api/v1/hybrid-sms/confidence-threshold:
 *   post:
 *     summary: Set confidence threshold
 *     description: Set the minimum confidence threshold for LLM results
 *     tags: [Hybrid SMS Parser]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - threshold
 *             properties:
 *               threshold:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 description: Confidence threshold (0.0 to 1.0)
 *                 example: 0.8
 *     responses:
 *       200:
 *         description: Confidence threshold updated successfully
 */
router.post('/confidence-threshold', hybridSMSController.setConfidenceThreshold);

/**
 * @swagger
 * /api/v1/hybrid-sms/cache/clear:
 *   post:
 *     summary: Clear parser cache
 *     description: Clear the SMS parsing result cache
 *     tags: [Hybrid SMS Parser]
 *     responses:
 *       200:
 *         description: Cache cleared successfully
 */
router.post('/cache/clear', hybridSMSController.clearCache);

/**
 * @swagger
 * /api/v1/hybrid-sms/connection/test:
 *   get:
 *     summary: Test LLM connection
 *     description: Test connection to the Ollama LLM server
 *     tags: [Hybrid SMS Parser]
 *     responses:
 *       200:
 *         description: Connection test completed
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
 *                     connected:
 *                       type: boolean
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 */
router.get('/connection/test', hybridSMSController.testConnection);

/**
 * @swagger
 * /api/v1/hybrid-sms/batch:
 *   post:
 *     summary: Parse multiple SMS messages
 *     description: Parse multiple SMS messages in batch
 *     tags: [Hybrid SMS Parser]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - smsList
 *             properties:
 *               smsList:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - message
 *                     - sender
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: SMS message content
 *                     sender:
 *                       type: string
 *                       description: SMS sender ID
 *     responses:
 *       200:
 *         description: Multiple SMS parsed successfully
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
 *                     total:
 *                       type: number
 *                       description: Total number of SMS messages
 *                     parsed:
 *                       type: number
 *                       description: Number of successfully parsed messages
 *                     results:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ParsedSMSData'
 */
router.post('/batch', hybridSMSController.parseMultipleSMS);

export default router; 