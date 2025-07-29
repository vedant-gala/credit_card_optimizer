import { Router, Request, Response, NextFunction } from 'express';
import { transactionController } from '@/controllers';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = Router();

// Transaction route logging middleware
const transactionRouteLogger = (req: Request, _res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'];
  console.log(`💳 [${requestId}] 🔄 TRANSACTION ROUTE: Processing ${req.method} ${req.path}`);
  console.log(`💳 [${requestId}] 💳 TRANSACTION ROUTE: Request params:`, req.params);
  console.log(`💳 [${requestId}] 💳 TRANSACTION ROUTE: Request query:`, req.query);
  next();
};

router.use(transactionRouteLogger);

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions for user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', transactionController.getAllTransactions);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:id', transactionController.getTransactionById);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', transactionController.createTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Update transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', transactionController.updateTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Delete transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', transactionController.deleteTransaction);

export default router; 