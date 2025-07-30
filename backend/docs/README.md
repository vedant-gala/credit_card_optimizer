# Backend Documentation

This directory contains comprehensive documentation for the Credit Card Rewards Optimizer backend.

## 📚 Available Documentation

### [API Documentation](./api.md)
Complete API reference with endpoints, request/response formats, and authentication details. Includes new SMS and Payment Processing endpoints.

### [Packet Traversal Logging](./PACKET_TRAVERSAL_LOGGING.md)
Detailed documentation of the comprehensive logging system that tracks packet traversal through all middleware and routes for debugging and monitoring.

### [Swagger API Specification](./swagger.json)
OpenAPI 3.0 specification for the backend API, suitable for generating client SDKs and interactive documentation.

## 🆕 New Services & Features

### **SMS Parser Service**
- **Location**: `src/services/sms-parser.service.ts`
- **Purpose**: Multi-bank SMS parsing with regex patterns
- **Features**: Bank detection, transaction extraction, validation
- **API Endpoints**: `/api/v1/sms/*`

### **Payment Processor Service**
- **Location**: `src/services/payment-processor.service.ts`
- **Purpose**: Payment webhook processing and status management
- **Features**: Status transitions, reward calculations, notifications
- **API Endpoints**: `/api/v1/payments/*`

### **Hybrid Architecture**
- **External Webhooks**: `/api/v1/webhooks/*` for external services
- **Internal APIs**: `/api/v1/sms/*` and `/api/v1/payments/*` for internal processing
- **Service Layer**: Business logic separated into reusable services

## 🚀 Quick Start

1. **API Reference**: Start with [api.md](./api.md) for endpoint documentation
2. **Debugging**: Use [PACKET_TRAVERSAL_LOGGING.md](./PACKET_TRAVERSAL_LOGGING.md) for troubleshooting
3. **Integration**: Reference [swagger.json](./swagger.json) for API specification

## 🔧 Development

### Viewing Documentation
```bash
# View API documentation
cat backend/docs/api.md

# View packet traversal logging docs
cat backend/docs/PACKET_TRAVERSAL_LOGGING.md

# View Swagger spec
cat backend/docs/swagger.json
```

### Testing with Documentation
```bash
# Test packet traversal logging
cd tools/sms-simulator
npm run test-traversal

# Test SMS parsing
curl -X POST http://localhost:3001/api/v1/sms/parse \
  -H "Content-Type: application/json" \
  -d '{"message": "Spent Rs.799 On HDFC Bank Card 0088 At Payu*Swiggy Food", "sender": "HDFCBK"}'

# Test payment processing
curl -X POST http://localhost:3001/api/v1/payments/process \
  -H "Content-Type: application/json" \
  -d '{"transactionId": "txn_123", "amount": 799, "currency": "INR"}'

# View Swagger UI (if enabled)
# Navigate to http://localhost:3001/api-docs
```

## 📝 Contributing

When adding new features to the backend:
1. Update [api.md](./api.md) with new endpoints
2. Update [swagger.json](./swagger.json) with OpenAPI specs
3. Update [PACKET_TRAVERSAL_LOGGING.md](./PACKET_TRAVERSAL_LOGGING.md) if adding new logging

---

**�� Happy coding!** 🚀 