import { createError } from '@/middleware/error.middleware';

// Types and Interfaces
export interface PaymentWebhookData {
  transactionId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  amount?: number;
  currency?: string;
  timestamp: string;
  gateway?: string;
  referenceId?: string;
  failureReason?: string;
  metadata?: Record<string, any>;
}

export interface TransactionStatusUpdate {
  transactionId: string;
  status: string;
  updatedAt: string;
  updatedBy: string;
  notes?: string;
}

export interface PaymentProcessingResult {
  success: boolean;
  transactionId: string;
  status: string;
  processedAt: string;
  rewardCalculations?: any;
  notifications?: any[];
  errors?: string[];
}

export interface RewardCalculationData {
  transactionId: string;
  amount: number;
  category: string;
  cardType: string;
  bank: string;
  merchant: string;
}

export class PaymentProcessorService {
  private readonly supportedStatuses = [
    'pending', 'completed', 'failed', 'cancelled', 'refunded'
  ];

  private readonly statusTransitions: Record<string, string[]> = {
    pending: ['completed', 'failed', 'cancelled'],
    completed: ['refunded'],
    failed: ['pending'], // retry
    cancelled: [],
    refunded: []
  };

  async processPaymentWebhook(webhookData: PaymentWebhookData): Promise<PaymentProcessingResult> {
    try {
      console.log(`💰 PAYMENT PROCESSOR: Processing webhook for transaction ${webhookData.transactionId}`);

      // Validate webhook data
      this.validateWebhookData(webhookData);

      // Update transaction status
      const statusUpdate = await this.updateTransactionStatus(
        webhookData.transactionId,
        webhookData.status,
        'payment_webhook'
      );
      console.log(`💰 PAYMENT PROCESSOR: Transaction status updated successfully`);
      console.log(`💰 PAYMENT PROCESSOR: Transaction status: ${statusUpdate.status}`);
      // Process based on status
      let rewardCalculations = null;
      let notifications = [];

      if (webhookData.status === 'completed') {
        console.log(`💰 PAYMENT PROCESSOR: Transaction completed, triggering reward calculations`);
        rewardCalculations = await this.triggerRewardCalculations(webhookData.transactionId);
        notifications = await this.sendCompletionNotifications(webhookData.transactionId);
      } else if (webhookData.status === 'failed') {
        console.log(`💰 PAYMENT PROCESSOR: Transaction failed, sending failure notifications`);
        notifications = await this.sendFailureNotifications(webhookData.transactionId, webhookData.failureReason);
      } else if (webhookData.status === 'refunded') {
        console.log(`💰 PAYMENT PROCESSOR: Transaction refunded, adjusting rewards`);
        rewardCalculations = await this.handleRefund(webhookData.transactionId);
        notifications = await this.sendRefundNotifications(webhookData.transactionId);
      }

      return {
        success: true,
        transactionId: webhookData.transactionId,
        status: webhookData.status,
        processedAt: new Date().toISOString(),
        rewardCalculations,
        notifications
      };

    } catch (error: any) {
      console.error(`💰 PAYMENT PROCESSOR: Error processing payment webhook:`, error.message);
      return {
        success: false,
        transactionId: webhookData.transactionId,
        status: 'error',
        processedAt: new Date().toISOString(),
        errors: [error.message]
      };
    }
  }

  async updateTransactionStatus(
    transactionId: string, 
    status: string, 
    updatedBy: string,
    notes?: string
  ): Promise<TransactionStatusUpdate> {
    console.log(`💰 PAYMENT PROCESSOR: Updating transaction ${transactionId} to status ${status}`);

    // Validate status transition
    this.validateStatusTransition(transactionId, status);

    // TODO: Update transaction in database
    // const transaction = await transactionRepository.findById(transactionId);
    // if (!transaction) {
    //   throw createError(`Transaction ${transactionId} not found`, 404);
    // }

    const statusUpdate: TransactionStatusUpdate = {
      transactionId,
      status,
      updatedAt: new Date().toISOString(),
      updatedBy,
      ...(notes && { notes })
    };

    // TODO: Save status update to database
    // await transactionRepository.updateStatus(transactionId, status, updatedBy, notes);

    console.log(`💰 PAYMENT PROCESSOR: Transaction status updated successfully`);
    return statusUpdate;
  }

  async triggerRewardCalculations(transactionId: string): Promise<any> {
    console.log(`💰 PAYMENT PROCESSOR: Triggering reward calculations for transaction ${transactionId}`);

    // TODO: Get transaction details from database
    // const transaction = await transactionRepository.findById(transactionId);
    
    // Mock transaction data for now
    const transactionData: RewardCalculationData = {
      transactionId,
      amount: 799, // Mock amount
      category: 'FOOD_DELIVERY',
      cardType: 'VISA',
      bank: 'HDFC Bank',
      merchant: 'Swiggy'
    };

    console.log(`💰 PAYMENT PROCESSOR: Transaction data:`, transactionData);
    // TODO: Call reward calculation service
    // const rewards = await rewardService.calculateRewards(transactionData);

    // Mock rewards
    const mockRewards = {
      cashback: 40,
      points: 80,
      category: 'FOOD_DELIVERY',
      multiplier: 2.0
    };

    console.log(`💰 PAYMENT PROCESSOR: Reward calculations completed:`, mockRewards);
    return mockRewards;
  }

  async handleRefund(transactionId: string): Promise<any> {
    console.log(`💰 PAYMENT PROCESSOR: Handling refund for transaction ${transactionId}`);

    // TODO: Reverse reward calculations
    // const reversedRewards = await rewardService.reverseRewards(transactionId);

    const mockReversedRewards = {
      cashbackReversed: -40,
      pointsReversed: -80,
      status: 'reversed'
    };

    console.log(`💰 PAYMENT PROCESSOR: Refund processing completed:`, mockReversedRewards);
    return mockReversedRewards;
  }

  async sendCompletionNotifications(transactionId: string): Promise<any[]> {
    console.log(`💰 PAYMENT PROCESSOR: Sending completion notifications for transaction ${transactionId}`);

    // TODO: Send notifications to user
    // await notificationService.sendTransactionComplete(transactionId);

    const notifications = [
      {
        type: 'transaction_complete',
        channel: 'push',
        sent: true,
        timestamp: new Date().toISOString()
      },
      {
        type: 'reward_earned',
        channel: 'email',
        sent: true,
        timestamp: new Date().toISOString()
      }
    ];

    console.log(`💰 PAYMENT PROCESSOR: Completion notifications sent:`, notifications.length);
    return notifications;
  }

  async sendFailureNotifications(transactionId: string, failureReason?: string): Promise<any[]> {
    console.log(`💰 PAYMENT PROCESSOR: Sending failure notifications for transaction ${transactionId}`);

    // TODO: Send failure notifications to user
    // await notificationService.sendTransactionFailed(transactionId, failureReason);

    const notifications = [
      {
        type: 'transaction_failed',
        channel: 'push',
        sent: true,
        timestamp: new Date().toISOString(),
        reason: failureReason
      }
    ];

    console.log(`💰 PAYMENT PROCESSOR: Failure notifications sent:`, notifications.length);
    return notifications;
  }

  async sendRefundNotifications(transactionId: string): Promise<any[]> {
    console.log(`💰 PAYMENT PROCESSOR: Sending refund notifications for transaction ${transactionId}`);

    // TODO: Send refund notifications to user
    // await notificationService.sendRefundProcessed(transactionId);

    const notifications = [
      {
        type: 'refund_processed',
        channel: 'push',
        sent: true,
        timestamp: new Date().toISOString()
      },
      {
        type: 'reward_adjusted',
        channel: 'email',
        sent: true,
        timestamp: new Date().toISOString()
      }
    ];

    console.log(`💰 PAYMENT PROCESSOR: Refund notifications sent:`, notifications.length);
    return notifications;
  }

  private validateWebhookData(webhookData: PaymentWebhookData): void {
    if (!webhookData.transactionId) {
      throw createError('Transaction ID is required', 400);
    }

    if (!webhookData.status) {
      throw createError('Status is required', 400);
    }

    if (!this.supportedStatuses.includes(webhookData.status)) {
      throw createError(`Invalid status: ${webhookData.status}`, 400);
    }

    if (!webhookData.timestamp) {
      throw createError('Timestamp is required', 400);
    }
  }

  private validateStatusTransition(transactionId: string, newStatus: string): void {
    // TODO: Get current transaction status from database
    // const currentStatus = await transactionRepository.getStatus(transactionId);
    const currentStatus = 'pending'; // Mock current status

    const allowedTransitions = this.statusTransitions[currentStatus] || [];
    
    if (!allowedTransitions.includes(newStatus)) {
      throw createError(
        `Invalid status transition for transaction ${transactionId} from ${currentStatus} to ${newStatus}`,
        400
      );
    }
  }

  async getTransactionStatus(transactionId: string): Promise<any> {
    console.log(`💰 PAYMENT PROCESSOR: Getting status for transaction ${transactionId}`);

    // TODO: Get transaction status from database
    // const transaction = await transactionRepository.findById(transactionId);

    // Mock response
    return {
      transactionId,
      status: 'completed',
      lastUpdated: new Date().toISOString(),
      history: [
        {
          status: 'pending',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          updatedBy: 'payment_webhook'
        },
        {
          status: 'completed',
          timestamp: new Date().toISOString(),
          updatedBy: 'payment_webhook'
        }
      ]
    };
  }

  async getProcessingStats(): Promise<any> {
    // TODO: Get processing statistics from database
    return {
      totalProcessed: 150,
      successRate: 0.98,
      averageProcessingTime: 250, // ms
      lastUpdated: new Date().toISOString()
    };
  }
} 