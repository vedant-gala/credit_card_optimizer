import { Router, Request, Response, NextFunction } from 'express';
import { creditCardController } from '@/controllers';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = Router();

// Credit card route logging middleware
const creditCardRouteLogger = (req: Request, _res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'];
  console.log(`💳 [${requestId}] 🔄 CREDIT CARD ROUTE: Processing ${req.method} ${req.path}`);
  console.log(`💳 [${requestId}] 💳 CREDIT CARD ROUTE: Request params:`, req.params);
  next();
};

router.use(creditCardRouteLogger);

// All routes require authentication
router.use(authMiddleware);

router.get('/', creditCardController.getAllCreditCards);
router.get('/:id', creditCardController.getCreditCardById);
router.post('/', creditCardController.createCreditCard);
router.put('/:id', creditCardController.updateCreditCard);
router.delete('/:id', creditCardController.deleteCreditCard);

export default router; 