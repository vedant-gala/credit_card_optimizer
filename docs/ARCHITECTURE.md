# Credit Card Optimizer - Architecture Overview

## System Architecture

The Credit Card Optimizer is built as a microservices-based architecture with the following components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │  Web Dashboard  │    │   ML Services   │
│  (React Native) │    │   (Next.js)     │    │   (FastAPI)     │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │      Backend API          │
                    │    (Node.js/Express)      │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │      Infrastructure       │
                    │  (PostgreSQL + Redis)     │
                    └───────────────────────────┘
```

## Component Details

### 1. Backend API (Node.js/Express)

**Technology Stack:**
- **Runtime:** Node.js 18+
- **Framework:** Express.js with TypeScript
- **Database:** PostgreSQL with connection pooling
- **Cache:** Redis for session storage and job queues
- **Authentication:** JWT with refresh tokens
- **Documentation:** Swagger/OpenAPI

**Key Features:**
- RESTful API with versioning (`/api/v1/*`)
- Comprehensive middleware stack (auth, validation, rate limiting)
- Background job processing with Bull queues
- **SMS Parser Service** with multi-bank support
- **Payment Processor Service** with webhook handling
- Real-time notifications and reward calculations
- File upload handling
- Comprehensive logging and packet traversal tracking

**Architecture Patterns:**
- **Hybrid Webhook Architecture**: External webhooks + internal APIs
- **Service Layer Pattern**: Business logic in dedicated services
- **MVC pattern** with service layer separation
- **Repository pattern** for data access
- **Dependency injection** for testability
- **Event-driven architecture** for async processing

### 2. Mobile App (React Native)

**Technology Stack:**
- **Framework:** React Native 0.72+
- **Navigation:** React Navigation 6
- **State Management:** Redux Toolkit or Context API
- **UI Components:** React Native Paper + custom components
- **Charts:** React Native Chart Kit
- **Storage:** AsyncStorage for local data
- **Permissions:** React Native Permissions

**Key Features:**
- Cross-platform (iOS/Android)
- Offline-first architecture
- SMS reading capabilities
- Push notifications
- Biometric authentication
- Camera integration for receipt scanning
- Real-time sync with backend

### 3. Web Dashboard (Next.js)

**Technology Stack:**
- **Framework:** Next.js 14 with TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand or React Query
- **Charts:** Recharts
- **UI Components:** Headless UI + Heroicons
- **Forms:** React Hook Form
- **API Client:** Axios with interceptors

**Key Features:**
- Server-side rendering (SSR)
- Progressive Web App (PWA) capabilities
- Responsive design
- Real-time dashboard updates
- Advanced filtering and search
- Export functionality
- Admin panel for user management

### 4. ML Services (Python/FastAPI)

**Technology Stack:**
- **Framework:** FastAPI
- **ML Libraries:** scikit-learn, transformers, PyTorch
- **NLP:** spaCy, NLTK
- **Data Processing:** pandas, numpy
- **Async Processing:** asyncio, aiohttp

### 5. Service Layer Architecture

**Core Services:**

#### **SMS Parser Service**
- **Purpose**: Multi-bank SMS parsing and transaction extraction
- **Supported Banks**: HDFC, SBI, ICICI, Axis, Kotak (India) + Chase, BOA, Wells Fargo (US)
- **Features**: Regex pattern matching, bank detection, confidence scoring
- **Integration**: Used by SMS webhooks and internal SMS APIs

#### **Payment Processor Service**
- **Purpose**: Payment webhook processing and transaction status management
- **Features**: Status transitions, reward calculations, notification handling
- **Integration**: Used by payment webhooks and internal payment APIs

#### **Service Communication Pattern**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │    │     Services    │    │   External      │
│                 │    │                 │    │   Integrations  │
│ smsController   │───▶│ SMSParserService│───▶│ SMS Gateways    │
│ paymentController│───▶│ PaymentProcessor│───▶│ Payment Gateways│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### **Hybrid Webhook Architecture**
- **External Webhooks**: `/api/v1/webhooks/*` for external service integration
- **Internal APIs**: `/api/v1/sms/*` and `/api/v1/payments/*` for internal processing
- **Service Reuse**: Same services used by both webhooks and internal APIs
- **Testing**: Internal APIs enable comprehensive testing without external dependencies

**Key Features:**
- Transaction categorization using NLP
- Credit card recommendation engine
- Spending pattern analysis
- Fraud detection
- Reward optimization algorithms
- Model versioning and A/B testing

### 5. Infrastructure

**Database Layer:**
- **Primary Database:** PostgreSQL 15
- **Connection Pooling:** pg-pool
- **Migrations:** Custom migration system
- **Seeding:** Automated data seeding

**Caching Layer:**
- **Redis:** Session storage, job queues, caching
- **Bull Queues:** Background job processing
- **Rate Limiting:** Redis-based rate limiting

**Deployment:**
- **Containerization:** Docker + Docker Compose
- **Reverse Proxy:** Nginx with load balancing
- **SSL/TLS:** Let's Encrypt certificates
- **Monitoring:** Health checks and logging

## Data Flow

### 1. Transaction Processing Flow

```
SMS Received → Webhook → Queue → Parser → Categorizer → Database → Notification
     ↓
Mobile App ← Real-time Update ← WebSocket ← Backend
```

### 2. Authentication Flow

```
User Login → JWT Token → API Requests → Token Validation → User Context
     ↓
Refresh Token ← Token Expiry ← Automatic Refresh
```

### 3. Recommendation Flow

```
User Data → ML Service → Analysis → Recommendations → Backend → UI Display
     ↓
A/B Testing ← Model Versioning ← Continuous Learning
```

## Security Architecture

### 1. Authentication & Authorization
- JWT tokens with short expiry
- Refresh token rotation
- Role-based access control (RBAC)
- API key management for external services

### 2. Data Protection
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- PII data masking
- GDPR compliance measures

### 3. API Security
- Rate limiting per user/IP
- Input validation and sanitization
- CORS configuration
- Security headers (Helmet.js)

### 4. Infrastructure Security
- Container security scanning
- Network segmentation
- Regular security updates
- Vulnerability assessments

## Scalability Considerations

### 1. Horizontal Scaling
- Stateless API design
- Database read replicas
- Redis clustering
- Load balancer configuration

### 2. Performance Optimization
- Database query optimization
- Redis caching strategies
- CDN for static assets
- Image optimization

### 3. Monitoring & Observability
- Application performance monitoring (APM)
- Distributed tracing
- Centralized logging
- Health check endpoints

## Development Workflow

### 1. Code Organization
- Monorepo structure
- Shared types and utilities
- Consistent coding standards
- Automated testing pipeline

### 2. CI/CD Pipeline
- Automated testing (unit, integration, e2e)
- Code quality checks (ESLint, Prettier)
- Security scanning
- Automated deployment

### 3. Environment Management
- Environment-specific configurations
- Feature flags
- Database migrations
- Rollback strategies

## Future Enhancements

### 1. Advanced ML Features
- Personalized spending insights
- Predictive analytics
- Automated budget recommendations
- Smart categorization improvements

### 2. Integration Capabilities
- Banking API integrations
- Payment gateway integrations
- Third-party financial services
- Social features and sharing

### 3. Platform Expansion
- Desktop application
- Browser extension
- Smartwatch app
- Voice assistant integration 