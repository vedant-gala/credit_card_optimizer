# Backend API Documentation

## Overview

This document provides comprehensive documentation for the Credit Card Rewards Optimizer backend API.

## 📚 Related Documentation

- **[Packet Traversal Logging](./PACKET_TRAVERSAL_LOGGING.md)** - Detailed logging system for debugging and monitoring API requests
- **[Swagger API Spec](./swagger.json)** - OpenAPI specification for the backend API

## Base URL

```
http://localhost:3001/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### SMS Processing

#### POST /sms/parse
Parse SMS message and extract transaction data.

**Request Body:**
```json
{
  "message": "Spent Rs.799 On HDFC Bank Card 0088 At Payu*Swiggy Food On 2025-07-30:19:56:11",
  "sender": "HDFCBK"
}
```

**Response:**
```json
{
  "success": true,
  "message": "SMS parsed successfully",
  "data": {
    "bank": {
      "name": "HDFC Bank",
      "code": "HDFC",
      "country": "IN",
      "confidence": 0.95
    },
    "transaction": {
      "amount": 799,
      "currency": "INR",
      "merchant": "Payu*Swiggy Food",
      "cardLast4": "0088",
      "cardType": "UNKNOWN",
      "bank": "HDFC Bank",
      "dateTime": "2025-07-30:19:56:11",
      "transactionType": "debit"
    },
    "rawMessage": "Spent Rs.799 On HDFC Bank Card 0088 At Payu*Swiggy Food On 2025-07-30:19:56:11",
    "sender": "HDFCBK",
    "parsedAt": "2025-01-30T19:56:11Z",
    "confidence": 0.9025,
    "pattern": "hdfc_spent_format"
  }
}
```

#### POST /sms/validate
Validate SMS message format.

**Request Body:**
```json
{
  "message": "Spent Rs.799 On HDFC Bank Card 0088 At Payu*Swiggy Food On 2025-07-30:19:56:11",
  "sender": "HDFCBK"
}
```

**Response:**
```json
{
  "success": true,
  "message": "SMS validation completed",
  "data": {
    "isValid": true,
    "errors": [],
    "warnings": [],
    "detectedBank": {
      "name": "HDFC Bank",
      "code": "HDFC",
      "country": "IN"
    },
    "detectedTransaction": {
      "amount": 799,
      "currency": "INR",
      "merchant": "Payu*Swiggy Food"
    }
  }
}
```

#### GET /sms/banks
Get list of supported banks.

**Response:**
```json
{
  "success": true,
  "message": "Supported banks retrieved successfully",
  "data": {
    "banks": [
      {
        "name": "HDFC Bank",
        "code": "HDFC",
        "country": "IN",
        "senderIds": ["HDFCBK", "HDFC", "HDFCBANK"],
        "confidence": 0.95
      }
    ],
    "total": 8,
    "countries": ["IN", "US"]
  }
}
```

#### GET /sms/patterns
Get list of supported SMS patterns.

**Response:**
```json
{
  "success": true,
  "message": "Supported patterns retrieved successfully",
  "data": {
    "patterns": [
      {
        "id": "hdfc_spent_format",
        "name": "HDFC Spent Format",
        "bank": "HDFC",
        "country": "IN",
        "example": "Spent Rs.799 On HDFC Bank Card 0088 At Payu*Swiggy Food On 2025-07-30:19:56:11",
        "confidence": 0.95
      }
    ],
    "total": 5,
    "banks": ["HDFC", "SBI", "ICICI", "CHASE"],
    "countries": ["IN", "US"]
  }
}
```

#### POST /sms/test-pattern
Test a specific SMS pattern against a message.

**Request Body:**
```json
{
  "message": "Spent Rs.799 On HDFC Bank Card 0088 At Payu*Swiggy Food On 2025-07-30:19:56:11",
  "patternId": "hdfc_spent_format"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pattern test completed",
  "data": {
    "patternId": "hdfc_spent_format",
    "patternName": "HDFC Spent Format",
    "isValid": true,
    "match": ["Spent Rs.799 On HDFC Bank Card 0088 At Payu*Swiggy Food On 2025-07-30:19:56:11", "799", "HDFC Bank", "0088", "Payu*Swiggy Food", "2025-07-30:19:56:11"],
    "example": "Spent Rs.799 On HDFC Bank Card 0088 At Payu*Swiggy Food On 2025-07-30:19:56:11",
    "confidence": 0.95
  }
}
```

### Payment Processing

#### POST /payments/process
Process a new payment.

**Request Body:**
```json
{
  "transactionId": "txn_123456",
  "amount": 799,
  "currency": "INR",
  "gateway": "razorpay",
  "metadata": {
    "orderId": "order_789",
    "customerId": "cust_456"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment processing initiated",
  "data": {
    "success": true,
    "transactionId": "txn_123456",
    "status": "pending",
    "processedAt": "2025-01-30T19:56:11Z"
  }
}
```

#### POST /payments/webhook
Process payment webhook from external services.

**Request Body:**
```json
{
  "transactionId": "txn_123456",
  "status": "completed",
  "amount": 799,
  "currency": "INR",
  "timestamp": "2025-01-30T19:56:11Z",
  "gateway": "razorpay",
  "referenceId": "ref_789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "data": {
    "success": true,
    "transactionId": "txn_123456",
    "status": "completed",
    "processedAt": "2025-01-30T19:56:11Z",
    "rewardCalculations": {
      "cashback": 40,
      "points": 80,
      "category": "FOOD_DELIVERY",
      "multiplier": 2.0
    },
    "notifications": [
      {
        "type": "transaction_complete",
        "channel": "push",
        "sent": true
      }
    ]
  }
}
```

#### PUT /payments/transactions/{transactionId}/status
Update transaction status.

**Request Body:**
```json
{
  "status": "completed",
  "notes": "Payment processed successfully"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction status updated successfully",
  "data": {
    "transactionId": "txn_123456",
    "status": "completed",
    "updatedAt": "2025-01-30T19:56:11Z",
    "updatedBy": "api_request",
    "notes": "Payment processed successfully"
  }
}
```

#### GET /payments/transactions/{transactionId}/status
Get transaction status and history.

**Response:**
```json
{
  "success": true,
  "message": "Transaction status retrieved successfully",
  "data": {
    "transactionId": "txn_123456",
    "status": "completed",
    "lastUpdated": "2025-01-30T19:56:11Z",
    "history": [
      {
        "status": "pending",
        "timestamp": "2025-01-30T18:56:11Z",
        "updatedBy": "payment_webhook"
      },
      {
        "status": "completed",
        "timestamp": "2025-01-30T19:56:11Z",
        "updatedBy": "payment_webhook"
      }
    ]
  }
}
```

#### GET /payments/stats
Get payment processing statistics.

**Response:**
```json
{
  "success": true,
  "message": "Processing statistics retrieved successfully",
  "data": {
    "totalProcessed": 150,
    "successRate": 0.98,
    "averageProcessingTime": 250,
    "lastUpdated": "2025-01-30T19:56:11Z"
  }
}
```

#### POST /payments/transactions/{transactionId}/rewards
Trigger reward calculations for a transaction.

**Response:**
```json
{
  "success": true,
  "message": "Reward calculations triggered successfully",
  "data": {
    "cashback": 40,
    "points": 80,
    "category": "FOOD_DELIVERY",
    "multiplier": 2.0
  }
}
```

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt-token-here",
    "refreshToken": "refresh-token-here"
  }
}
```

#### POST /auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt-token-here",
    "refreshToken": "refresh-token-here"
  }
}
```

#### POST /auth/logout
Logout user and invalidate tokens.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh-token-here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new-jwt-token-here",
    "refreshToken": "new-refresh-token-here"
  }
}
```

#### GET /auth/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+1234567890",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Transactions

#### GET /transactions
Get user transactions with optional filtering and pagination.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `startDate` (string): Start date filter (YYYY-MM-DD)
- `endDate` (string): End date filter (YYYY-MM-DD)
- `category` (string): Category filter
- `minAmount` (number): Minimum amount filter
- `maxAmount` (number): Maximum amount filter
- `status` (string): Status filter

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "1",
        "amount": 100.50,
        "description": "Grocery shopping",
        "category": "FOOD",
        "merchant": "Walmart",
        "date": "2024-01-15T00:00:00.000Z",
        "status": "COMPLETED",
        "creditCardId": "1"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

#### GET /transactions/:id
Get transaction by ID.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "1",
      "amount": 100.50,
      "description": "Grocery shopping",
      "category": "FOOD",
      "merchant": "Walmart",
      "date": "2024-01-15T00:00:00.000Z",
      "status": "COMPLETED",
      "creditCardId": "1",
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  }
}
```

#### POST /transactions
Create a new transaction.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "amount": 100.50,
  "description": "Grocery shopping",
  "category": "FOOD",
  "merchant": "Walmart",
  "date": "2024-01-15",
  "creditCardId": "1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "1",
      "amount": 100.50,
      "description": "Grocery shopping",
      "category": "FOOD",
      "merchant": "Walmart",
      "date": "2024-01-15T00:00:00.000Z",
      "status": "COMPLETED",
      "creditCardId": "1",
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  }
}
```

#### PUT /transactions/:id
Update an existing transaction.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "amount": 150.75,
  "description": "Updated description",
  "category": "FOOD",
  "merchant": "Target",
  "date": "2024-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "1",
      "amount": 150.75,
      "description": "Updated description",
      "category": "FOOD",
      "merchant": "Target",
      "date": "2024-01-15T00:00:00.000Z",
      "status": "COMPLETED",
      "creditCardId": "1",
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  }
}
```

#### DELETE /transactions/:id
Delete a transaction.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting

API requests are rate limited to:
- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated users

## Webhooks (External Services)

These endpoints are designed for external service integration (mobile apps, banks, payment gateways). They use the service layer for business logic processing.

### POST /webhooks/sms
Receive SMS notifications for transaction processing. Uses the SMS Parser Service for processing.

**Request Body:**
```json
{
  "message": "Spent Rs.799 On HDFC Bank Card 0088 At Payu*Swiggy Food On 2025-07-30:19:56:11",
  "sender": "HDFCBK",
  "timestamp": "2025-01-30T19:56:11Z",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "status": "received",
  "message": "SMS received successfully",
  "timestamp": "2025-01-30T19:56:11Z"
}
```

**Processing Flow:**
1. Validates webhook data
2. Uses SMS Parser Service to extract transaction details
3. Creates transaction record (if valid)
4. Triggers reward calculations
5. Sends real-time notifications

### POST /webhooks/payment
Receive payment gateway notifications. Uses the Payment Processor Service for processing.

**Request Body:**
```json
{
  "transactionId": "txn_123456",
  "status": "completed",
  "amount": 799,
  "currency": "INR",
  "timestamp": "2025-01-30T19:56:11Z",
  "gateway": "razorpay",
  "referenceId": "ref_789",
  "failureReason": null
}
```

**Response:**
```json
{
  "success": true,
  "status": "received",
  "message": "Payment webhook received successfully"
}
```

**Processing Flow:**
1. Validates webhook data
2. Uses Payment Processor Service to update transaction status
3. Triggers reward calculations (if payment completed)
4. Sends notifications based on payment status
5. Handles refunds and error cases

### Webhook Security

- **Signature Validation**: External webhooks should include signature headers for verification
- **Rate Limiting**: Webhook endpoints have rate limiting to prevent abuse
- **Input Validation**: All webhook data is validated before processing
- **Error Handling**: Failed webhooks are logged with full context for debugging 