# Credit Card Optimizer API Documentation

## Overview

The Credit Card Optimizer API provides endpoints for managing credit card transactions, rewards optimization, and user authentication.

## Base URL

- Development: `http://localhost:3001/api/v1`
- Production: `https://api.creditcardoptimizer.com/api/v1`

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

#### POST /auth/login
Authenticate user and get access tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh-token"
}
```

### Transactions

#### GET /transactions
Get all transactions for the authenticated user.

**Query Parameters:**
- `startDate`: Filter transactions from this date (ISO format)
- `endDate`: Filter transactions until this date (ISO format)
- `category`: Filter by transaction category
- `creditCardId`: Filter by credit card ID
- `limit`: Number of transactions to return (default: 50)
- `offset`: Number of transactions to skip (default: 0)

#### POST /transactions
Create a new transaction.

**Request Body:**
```json
{
  "amount": 100.50,
  "currency": "USD",
  "merchant": "Amazon",
  "category": "Shopping",
  "description": "Online purchase",
  "transactionDate": "2023-12-01T10:30:00Z",
  "creditCardId": "card-id"
}
```

#### GET /transactions/{id}
Get a specific transaction by ID.

#### PUT /transactions/{id}
Update a transaction.

#### DELETE /transactions/{id}
Delete a transaction.

### Credit Cards

#### GET /credit-cards
Get all credit cards for the authenticated user.

#### POST /credit-cards
Add a new credit card.

**Request Body:**
```json
{
  "name": "Chase Sapphire Preferred",
  "issuer": "Chase",
  "cardType": "VISA",
  "rewardsProgram": "Ultimate Rewards",
  "annualFee": 95,
  "creditLimit": 10000
}
```

### Rewards

#### GET /rewards
Get rewards summary for the authenticated user.

#### GET /rewards/summary
Get detailed rewards summary with breakdown by category and card.

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

Common HTTP status codes:
- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Missing or invalid authentication
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `500`: Internal Server Error - Server error

## Rate Limiting

API requests are rate limited:
- Authentication endpoints: 5 requests per minute
- General API endpoints: 100 requests per minute
- SMS processing endpoints: 10 requests per minute

## Webhooks

### POST /webhooks/sms
Receive SMS notifications for transaction processing.

### POST /webhooks/payment
Receive payment gateway webhooks.

## SDKs and Libraries

- JavaScript/TypeScript: Available as npm package
- Python: Available as pip package
- React Native: Available as npm package

## Support

For API support, contact: api-support@creditcardoptimizer.com 