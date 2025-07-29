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

## Webhooks

### POST /webhooks/sms
Receive SMS notifications for transaction processing.

**Request Body:**
```json
{
  "message": "Transaction: $100.50 at Walmart",
  "sender": "+1234567890",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### POST /webhooks/payment
Receive payment gateway notifications.

**Request Body:**
```json
{
  "transactionId": "txn_123",
  "status": "completed",
  "amount": 100.50,
  "timestamp": "2024-01-15T10:30:00Z"
}
``` 