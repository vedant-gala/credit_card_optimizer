export interface Transaction {
  id: string;
  userId: string;
  creditCardId?: string;
  amount: number;
  currency: string;
  merchant: string;
  category: string;
  description?: string;
  transactionDate: Date;
  processedDate: Date;
  status: TransactionStatus;
  rewardsEarned?: number;
  rewardsRate?: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface CreateTransactionRequest {
  amount: number;
  currency: string;
  merchant: string;
  category: string;
  description?: string;
  transactionDate: Date;
  creditCardId?: string;
}

export interface UpdateTransactionRequest {
  amount?: number;
  merchant?: string;
  category?: string;
  description?: string;
  creditCardId?: string;
}

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  creditCardId?: string;
  status?: TransactionStatus;
  minAmount?: number;
  maxAmount?: number;
}

export interface TransactionSummary {
  totalSpent: number;
  totalRewards: number;
  averageRewardRate: number;
  transactionCount: number;
  topCategories: Array<{
    category: string;
    amount: number;
    count: number;
  }>;
} 