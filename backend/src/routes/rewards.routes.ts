import { Router } from 'express';
import { rewardsController } from '@/controllers';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', rewardsController.getAllRewards);
router.get('/summary', rewardsController.getRewardsSummary);
router.get('/:id', rewardsController.getRewardById);

export default router; 