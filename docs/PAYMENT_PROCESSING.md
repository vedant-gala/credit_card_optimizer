# Payment Processing Guide

## Overview

The Payment Processing system handles payment webhooks, transaction status management, and reward calculations. It follows a hybrid architecture with external webhooks and internal processing APIs.

## 🏗️ Architecture

### **Service Layer Pattern**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   External      │    │   Internal      │    │   Business      │
│   Webhooks      │    │   APIs          │    │   Services      │
│                 │    │                 │    │                 │
│ /webhooks/      │───▶│ /payments/      │───▶│ PaymentProcessor│
│ payment         │    │ process         │    │ Service         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Controllers   │    │   Database      │
                       │                 │    │                 │
                       │ paymentController│    │ Transaction     │
                       │                 │    │ Status Updates  │
                       └─────────────────┘    └─────────────────┘
```

### **Payment Flow**
1. **External Webhook**: Payment gateway sends webhook to `/api/v1/webhooks/payment`
2. **Service Processing**: `PaymentProcessorService` handles the webhook
3. **Status Update**: Transaction status is updated in database
4. **Reward Calculation**: Rewards are calculated if payment is completed
5. **Notifications**: Real-time notifications are sent to user

## 🔧 Components

### **1. Payment Processor Service**

**Location**: `backend/src/services/payment-processor.service.ts`

**Key Features**:
- Webhook data validation
- Transaction status management
- Reward calculation triggers
- Notification handling
- Error processing and retry logic

**Main Methods**:
```typescript
// Process payment webhook
async processPaymentWebhook(webhookData: PaymentWebhookData): Promise<PaymentProcessingResult>

// Update transaction status
async updateTransactionStatus(transactionId: string, status: string, updatedBy: string): Promise<TransactionStatusUpdate>

// Trigger reward calculations
async triggerRewardCalculations(transactionId: string): Promise<any>

// Handle refunds
async handleRefund(transactionId: string): Promise<any>
```

### **2. Payment Controller**

**Location**: `backend/src/controllers/payment.controller.ts`

**Endpoints**:
- `POST /api/v1/payments/process` - Process new payment
- `POST /api/v1/payments/webhook` - Process payment webhook
- `PUT /api/v1/payments/transactions/:id/status` - Update transaction status
- `GET /api/v1/payments/transactions/:id/status` - Get transaction status
- `GET /api/v1/payments/stats` - Get processing statistics
- `POST /api/v1/payments/transactions/:id/rewards` - Trigger reward calculations

### **3. Payment Routes**

**Location**: `backend/src/routes/payments.routes.ts`

**Features**:
- Comprehensive Swagger documentation
- Route logging and packet traversal tracking
- Input validation and error handling
- Authentication middleware (where applicable)

## 📊 Data Models

### **Payment Webhook Data**
```typescript
interface PaymentWebhookData {
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
```

### **Transaction Status Update**
```typescript
interface TransactionStatusUpdate {
  transactionId: string;
  status: string;
  updatedAt: string;
  updatedBy: string;
  notes?: string;
}
```

### **Payment Processing Result**
```typescript
interface PaymentProcessingResult {
  success: boolean;
  transactionId: string;
  status: string;
  processedAt: string;
  rewardCalculations?: any;
  notifications?: any[];
  errors?: string[];
}
```

## 🔄 Status Transitions

### **Valid Status Flow**
```
pending ──▶ completed ──▶ refunded
   │
   ├──▶ failed ──▶ pending (retry)
   │
   └──▶ cancelled
```

### **Status Transition Rules**
- **pending**: Can transition to `completed`, `failed`, or `cancelled`
- **completed**: Can transition to `refunded`
- **failed**: Can transition to `pending` (retry)
- **cancelled**: No further transitions allowed
- **refunded**: No further transitions allowed

## 🧪 Testing

### **1. Test Payment Processing**
```bash
# Process a new payment
curl -X POST http://localhost:3001/api/v1/payments/process \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "txn_123456",
    "amount": 799,
    "currency": "INR",
    "gateway": "razorpay"
  }'
```

### **2. Test Payment Webhook**
```bash
# Simulate payment completion webhook
curl -X POST http://localhost:3001/api/v1/webhooks/payment \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "txn_123456",
    "status": "completed",
    "amount": 799,
    "currency": "INR",
    "timestamp": "2025-01-30T19:56:11Z",
    "gateway": "razorpay",
    "referenceId": "ref_789"
  }'
```

### **3. Test Status Updates**
```bash
# Update transaction status
curl -X PUT http://localhost:3001/api/v1/payments/transactions/txn_123456/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "notes": "Payment processed successfully"
  }'
```

### **4. Test Reward Calculations**
```bash
# Trigger reward calculations
curl -X POST http://localhost:3001/api/v1/payments/transactions/txn_123456/rewards
```

## 🔍 Monitoring & Debugging

### **Logging**
The payment processing system includes comprehensive logging:

```typescript
// Service level logging
console.log(`💰 PAYMENT PROCESSOR: Processing webhook for transaction ${transactionId}`);

// Controller level logging
console.log(`💰 PAYMENT CONTROLLER: Processing payment for transaction ${transactionId}`);

// Route level logging
console.log(`💰 [${requestId}] 🔄 PAYMENT ROUTE: Processing ${req.method} ${req.path}`);
```

### **Statistics**
Get processing statistics:
```bash
curl http://localhost:3001/api/v1/payments/stats
```

Response:
```json
{
  "success": true,
  "data": {
    "totalProcessed": 150,
    "successRate": 0.98,
    "averageProcessingTime": 250,
    "lastUpdated": "2025-01-30T19:56:11Z"
  }
}
```

## 🚨 Error Handling

### **Common Errors**

1. **Invalid Status Transition**
   ```json
   {
     "success": false,
     "message": "Invalid status transition from completed to pending"
   }
   ```

2. **Missing Required Fields**
   ```json
   {
     "success": false,
     "message": "Transaction ID and status are required"
   }
   ```

3. **Transaction Not Found**
   ```json
   {
     "success": false,
     "message": "Transaction not found"
   }
   ```

### **Error Recovery**
- Failed webhooks are logged with full context
- Invalid status transitions are rejected with detailed error messages
- Processing errors include transaction ID for debugging
- Retry mechanisms for transient failures

## 🔧 Configuration

### **Environment Variables**
```bash
# Payment Gateway Configuration
PAYMENT_GATEWAY_API_KEY=your_api_key
PAYMENT_GATEWAY_SECRET=your_secret

# Webhook Configuration
WEBHOOK_SECRET=your_webhook_secret
WEBHOOK_TIMEOUT=10000

# Processing Configuration
MAX_RETRY_ATTEMPTS=3
RETRY_DELAY_MS=1000
```

### **Service Configuration**
```typescript
// Supported payment statuses
private readonly supportedStatuses = [
  'pending', 'completed', 'failed', 'cancelled', 'refunded'
];

// Status transition rules
private readonly statusTransitions = {
  pending: ['completed', 'failed', 'cancelled'],
  completed: ['refunded'],
  failed: ['pending'], // retry
  cancelled: [],
  refunded: []
};
```

## 📈 Performance Considerations

### **Optimizations**
- Async processing for non-critical operations
- Database connection pooling
- Redis caching for frequently accessed data
- Batch processing for multiple transactions

### **Monitoring**
- Processing time tracking
- Success rate monitoring
- Error rate alerting
- Queue depth monitoring

## 🔐 Security

### **Webhook Security**
- Signature validation for external webhooks
- Rate limiting to prevent abuse
- Input validation and sanitization
- Secure error messages (no sensitive data exposure)

### **Data Protection**
- Encryption of sensitive payment data
- Audit logging for all status changes
- Access control for internal APIs
- Secure storage of payment metadata

## 🚀 Future Enhancements

### **Planned Features**
- Multi-currency support with exchange rates
- Advanced fraud detection
- Payment method optimization
- Real-time payment analytics
- Integration with additional payment gateways

### **Scalability Improvements**
- Horizontal scaling with load balancing
- Database sharding for high-volume processing
- Event-driven architecture with message queues
- Microservices decomposition

---

**📚 Related Documentation**
- [API Documentation](../backend/docs/api.md)
- [SMS Processing Guide](./SMS_PARSING.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Flowcharts](./flowcharts/README.md) 