import { Router } from 'express';
import { creditCardController } from '@/controllers';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', creditCardController.getAllCreditCards);
router.get('/:id', creditCardController.getCreditCardById);
router.post('/', creditCardController.createCreditCard);
router.put('/:id', creditCardController.updateCreditCard);
router.delete('/:id', creditCardController.deleteCreditCard);

export default router; 