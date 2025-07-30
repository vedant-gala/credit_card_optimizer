import type { Request, Response } from 'express';
import { createError } from '@/middleware/error.middleware';
import { PaymentProcessorService, PaymentWebhookData } from '@/services/payment-processor.service';

const paymentProcessorService = new PaymentProcessorService();

export const paymentController = {
  async processPayment(req: Request, res: Response) {
    try {
      const { transactionId, amount, currency, gateway, metadata } = req.body;
      
      if (!transactionId || !amount || !currency) {
        throw createError('Transaction ID, amount, and currency are required', 400);
      }

      console.log(`💰 PAYMENT CONTROLLER: Processing payment for transaction ${transactionId}`);

      // Create payment webhook data
      const paymentData: PaymentWebhookData = {
        transactionId,
        status: 'pending',
        amount,
        currency,
        timestamp: new Date().toISOString(),
        gateway,
        metadata
      };

      const result = await paymentProcessorService.processPaymentWebhook(paymentData);
      
      console.log(`💰 PAYMENT CONTROLLER: Payment processing completed for ${transactionId}`);
      
      res.json({
        success: true,
        message: 'Payment processing initiated',
        data: result
      });
    } catch (error: any) {
      console.error(`💰 PAYMENT CONTROLLER: Error processing payment:`, error.message);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  async processWebhook(req: Request, res: Response) {
    try {
      const webhookData: PaymentWebhookData = req.body;
      
      console.log(`💰 PAYMENT CONTROLLER: Processing webhook for transaction ${webhookData.transactionId}`);

      const result = await paymentProcessorService.processPaymentWebhook(webhookData);
      
      console.log(`💰 PAYMENT CONTROLLER: Webhook processing completed for ${webhookData.transactionId}`);
      
      res.json({
        success: true,
        message: 'Webhook processed successfully',
        data: result
      });
    } catch (error: any) {
      console.error(`💰 PAYMENT CONTROLLER: Error processing webhook:`, error.message);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  async updateTransactionStatus(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      const { status, notes } = req.body;
      
      if (!transactionId || !status) {
        throw createError('Transaction ID and status are required', 400);
      }

      console.log(`💰 PAYMENT CONTROLLER: Updating status for transaction ${transactionId} to ${status}`);

      const result = await paymentProcessorService.updateTransactionStatus(
        transactionId,
        status,
        'api_request',
        notes
      );
      
      console.log(`💰 PAYMENT CONTROLLER: Status updated successfully for ${transactionId}`);
      
      res.json({
        success: true,
        message: 'Transaction status updated successfully',
        data: result
      });
    } catch (error: any) {
      console.error(`💰 PAYMENT CONTROLLER: Error updating transaction status:`, error.message);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  async getTransactionStatus(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      
      if (!transactionId) {
        throw createError('Transaction ID is required', 400);
      }

      console.log(`💰 PAYMENT CONTROLLER: Getting status for transaction ${transactionId}`);

      const result = await paymentProcessorService.getTransactionStatus(transactionId);
      
      console.log(`💰 PAYMENT CONTROLLER: Retrieved status for ${transactionId}`);
      
      res.json({
        success: true,
        message: 'Transaction status retrieved successfully',
        data: result
      });
    } catch (error: any) {
      console.error(`💰 PAYMENT CONTROLLER: Error getting transaction status:`, error.message);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  async getProcessingStats(_req: Request, res: Response) {
    try {
      console.log(`💰 PAYMENT CONTROLLER: Getting processing statistics`);

      const stats = await paymentProcessorService.getProcessingStats();
      
      console.log(`💰 PAYMENT CONTROLLER: Retrieved processing statistics`);
      
      res.json({
        success: true,
        message: 'Processing statistics retrieved successfully',
        data: stats
      });
    } catch (error: any) {
      console.error(`💰 PAYMENT CONTROLLER: Error getting processing stats:`, error.message);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  },

  async triggerRewardCalculations(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      
      if (!transactionId) {
        throw createError('Transaction ID is required', 400);
      }

      console.log(`💰 PAYMENT CONTROLLER: Triggering reward calculations for transaction ${transactionId}`);

      const result = await paymentProcessorService.triggerRewardCalculations(transactionId);
      
      console.log(`💰 PAYMENT CONTROLLER: Reward calculations completed for ${transactionId}`);
      
      res.json({
        success: true,
        message: 'Reward calculations triggered successfully',
        data: result
      });
    } catch (error: any) {
      console.error(`💰 PAYMENT CONTROLLER: Error triggering reward calculations:`, error.message);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }
}; 