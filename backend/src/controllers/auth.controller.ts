import type { Request, Response } from 'express';
import { authService } from '@/services/auth.service';
import { createError } from '@/middleware/error.middleware';
import type { AuthRequest } from '@/middleware/auth.middleware';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      
      if (!email || !password || !name) {
        throw createError('Email, password, and name are required', 400);
      }

      const result = await authService.register({ email, password, name });
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        throw createError('Email and password are required', 400);
      }

      const result = await authService.login({ email, password });
      
      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  async logout(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      await authService.logout(userId);
      
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        throw createError('Refresh token is required', 400);
      }

      const result = await authService.refreshToken(refreshToken);
      
      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: result
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const profile = await authService.getProfile(userId);
      
      res.json({
        success: true,
        data: profile
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }
}; 