import { Router, Request, Response, NextFunction } from 'express';
import { rewardsController } from '@/controllers';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = Router();

// Rewards route logging middleware
const rewardsRouteLogger = (req: Request, _res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'];
  console.log(`🎁 [${requestId}] 🔄 REWARDS ROUTE: Processing ${req.method} ${req.path}`);
  console.log(`🎁 [${requestId}] 🎁 REWARDS ROUTE: Request params:`, req.params);
  next();
};

router.use(rewardsRouteLogger);

// All routes require authentication
router.use(authMiddleware);

router.get('/', rewardsController.getAllRewards);
router.get('/summary', rewardsController.getRewardsSummary);
router.get('/:id', rewardsController.getRewardById);

export default router; 