# Backend Documentation

This directory contains comprehensive documentation for the Credit Card Rewards Optimizer backend.

## 📚 Available Documentation

### [API Documentation](./api.md)
Complete API reference with endpoints, request/response formats, and authentication details.

### [Packet Traversal Logging](./PACKET_TRAVERSAL_LOGGING.md)
Detailed documentation of the comprehensive logging system that tracks packet traversal through all middleware and routes for debugging and monitoring.

### [Swagger API Specification](./swagger.json)
OpenAPI 3.0 specification for the backend API, suitable for generating client SDKs and interactive documentation.

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