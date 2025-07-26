import type { Response } from 'express';
import { createError } from '@/middleware/error.middleware';
import type { AuthRequest } from '@/middleware/auth.middleware';

export const dashboardController = {
  async getDashboardData(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createError('User not authenticated', 401);
      }

      // TODO: Implement dashboard service
      const dashboardData = {
        totalSpending: 0,
        monthlySpending: 0,
        rewardsEarned: 0,
        topCategories: [],
        recentTransactions: [],
        creditCardUtilization: []
      }; // await dashboardService.getDashboardData(userId);
      
      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  async getSpendingAnalytics(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      //const { period = 'month' } = req.query; TODO : This is defined but not used
      
      if (!userId) {
        throw createError('User not authenticated', 401);
      }

      // TODO: Implement dashboard service
      const analytics = {
        spendingByCategory: [],
        spendingByMonth: [],
        averageTransaction: 0
      }; // await dashboardService.getSpendingAnalytics(userId, period);
      
      res.json({
        success: true,
        data: analytics
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  async getRewardsAnalytics(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createError('User not authenticated', 401);
      }

      // TODO: Implement dashboard service
      const analytics = {
        rewardsByCard: [],
        rewardsByCategory: [],
        projectedRewards: 0
      }; // await dashboardService.getRewardsAnalytics(userId);
      
      res.json({
        success: true,
        data: analytics
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }
}; 