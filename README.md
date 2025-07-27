# Credit Card Rewards Optimizer

A comprehensive platform for optimizing credit card rewards through SMS transaction parsing, intelligent categorization, and personalized recommendations.

## 🚀 Features

- **SMS Transaction Parsing**: Automatically extract transaction data from SMS notifications
- **Smart Categorization**: AI-powered transaction categorization
- **Rewards Optimization**: Maximize rewards across multiple credit cards
- **Real-time Dashboard**: Web and mobile interfaces for transaction monitoring
- **Personalized Recommendations**: ML-driven card recommendations

## 🏗️ Architecture

This is a monorepo containing:
- **Backend**: Node.js + Express API with TypeScript
- **Mobile App**: React Native application
- **Web Dashboard**: Next.js web application
- **ML Services**: Python-based machine learning services
- **Shared**: Common utilities and types

## 📁 Project Structure

```
credit_card_optimizer/
├── README.md                                    # Project overview and setup guide
├── LICENSE                                      # MIT License
├── .gitignore                                   # Git ignore patterns
├── .gitattributes                               # Git attributes
├── docker-compose.yml                           # Docker services configuration with environment variables
├── env.example                                  # Environment variables template
├── setup-env.sh                                 # Environment setup script (Linux/Mac)
├── setup-env.ps1                                # Environment setup script (Windows PowerShell)
│
├── backend/                                     # Node.js + Express API Server
│   ├── package.json                             # Backend dependencies and scripts
│   ├── tsconfig.json                            # TypeScript configuration
│   ├── Dockerfile                               # Backend container configuration
│   ├── src/
│   │   ├── app.ts                               # Express application setup
│   │   ├── server.ts                            # Server entry point
│   │   ├── config/
│   │   │   ├── database.ts                      # PostgreSQL connection config
│   │   │   ├── redis.ts                         # Redis connection config
│   │   │   └── constants.ts                     # Application constants
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts               # Authentication endpoints
│   │   │   ├── transaction.controller.ts        # Transaction management
│   │   │   ├── creditCard.controller.ts         # Credit card management
│   │   │   ├── rewards.controller.ts            # Rewards calculation
│   │   │   ├── dashboard.controller.ts          # Dashboard data
│   │   │   └── recommendation.controller.ts     # ML recommendations
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts               # JWT authentication
│   │   │   ├── validation.middleware.ts         # Input validation
│   │   │   ├── rateLimit.middleware.ts          # Rate limiting
│   │   │   └── error.middleware.ts              # Error handling
│   │   ├── models/
│   │   │   ├── index.ts                         # Model exports
│   │   │   ├── User.ts                          # User data model
│   │   │   ├── CreditCard.ts                    # Credit card model
│   │   │   ├── Transaction.ts                   # Transaction model
│   │   │   ├── Reward.ts                        # Reward model
│   │   │   └── RewardCategory.ts                # Reward categories
│   │   ├── routes/
│   │   │   ├── index.ts                         # Route aggregator
│   │   │   ├── auth.routes.ts                   # Authentication routes
│   │   │   ├── transactions.routes.ts           # Transaction routes
│   │   │   ├── creditCards.routes.ts            # Credit card routes
│   │   │   ├── rewards.routes.ts                # Rewards routes
│   │   │   └── webhooks.routes.ts               # Webhook endpoints
│   │   ├── services/
│   │   │   ├── auth.service.ts                  # Authentication logic
│   │   │   ├── transaction.service.ts           # Transaction processing
│   │   │   ├── sms-parser.service.ts            # SMS parsing logic
│   │   │   ├── rewards.service.ts               # Rewards calculation
│   │   │   ├── recommendation.service.ts        # ML recommendations
│   │   │   ├── notification.service.ts          # Push notifications
│   │   │   └── payment-gateway.service.ts       # Payment integration
│   │   ├── utils/
│   │   │   ├── logger.ts                        # Winston logging
│   │   │   ├── validation.ts                    # Input validation utilities
│   │   │   ├── encryption.ts                    # Encryption utilities
│   │   │   ├── date.utils.ts                    # Date manipulation
│   │   │   └── response.utils.ts                # Response formatting
│   │   ├── jobs/                                # Background job processing
│   │   │   ├── queue.ts                         # Bull queue setup
│   │   │   ├── sms-processing.job.ts            # SMS processing jobs
│   │   │   ├── reward-calculation.job.ts        # Reward calculation jobs
│   │   │   └── notification.job.ts              # Notification jobs
│   │   ├── database/
│   │   │   ├── migrations/                      # Database schema migrations
│   │   │   │   ├── 001_create_users.ts
│   │   │   │   ├── 002_create_credit_cards.ts
│   │   │   │   ├── 003_create_transactions.ts
│   │   │   │   └── 004_create_rewards.ts
│   │   │   ├── seeds/                           # Database seeding
│   │   │   │   ├── credit-cards.seed.ts
│   │   │   │   └── reward-categories.seed.ts
│   │   │   └── connection.ts                    # Database connection
│   │   └── types/
│   │       ├── index.ts                         # Type exports
│   │       ├── user.types.ts                    # User type definitions
│   │       ├── transaction.types.ts             # Transaction types
│   │       └── reward.types.ts                  # Reward types
│   ├── tests/                                   # Test suite
│   │   ├── unit/                                # Unit tests
│   │   │   ├── services/                        # Service tests
│   │   │   └── controllers/                     # Controller tests
│   │   ├── integration/                         # Integration tests
│   │   └── fixtures/                            # Test data
│   └── docs/                                    # Backend documentation
│       ├── api.md                               # API documentation
│       └── swagger.json                         # OpenAPI specification
│
├── mobile-app/                                  # React Native Mobile Application
│   ├── package.json                             # Mobile app dependencies
│   ├── metro.config.js                          # Metro bundler config
│   ├── react-native.config.js                   # React Native config
│   ├── android/                                 # Android-specific files
│   ├── ios/                                     # iOS-specific files
│   ├── src/
│   │   ├── App.tsx                              # Main app component
│   │   ├── components/
│   │   │   ├── common/                          # Reusable UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Loading.tsx
│   │   │   ├── forms/                           # Form components
│   │   │   │   ├── TransactionForm.tsx
│   │   │   │   └── CreditCardForm.tsx
│   │   │   └── charts/                          # Chart components
│   │   │       ├── SpendingChart.tsx
│   │   │       └── RewardsChart.tsx
│   │   ├── screens/
│   │   │   ├── auth/                            # Authentication screens
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   └── RegisterScreen.tsx
│   │   │   ├── dashboard/                       # Dashboard screens
│   │   │   │   ├── DashboardScreen.tsx
│   │   │   │   └── RewardsOverview.tsx
│   │   │   ├── transactions/                    # Transaction screens
│   │   │   │   ├── TransactionList.tsx
│   │   │   │   ├── TransactionDetail.tsx
│   │   │   │   └── AddTransaction.tsx
│   │   │   ├── cards/                           # Credit card screens
│   │   │   │   ├── CardList.tsx
│   │   │   │   └── CardDetail.tsx
│   │   │   └── recommendations/                 # Recommendation screens
│   │   │       └── RecommendationScreen.tsx
│   │   ├── navigation/                          # Navigation configuration
│   │   │   ├── AppNavigator.tsx
│   │   │   ├── AuthNavigator.tsx
│   │   │   └── TabNavigator.tsx
│   │   ├── services/                            # API and external services
│   │   │   ├── api.ts                           # API client configuration
│   │   │   ├── auth.service.ts                  # Authentication service
│   │   │   ├── transaction.service.ts           # Transaction service
│   │   │   ├── sms.service.ts                   # SMS reading permissions
│   │   │   └── storage.service.ts               # Local storage
│   │   ├── store/                               # State management (Redux/Context)
│   │   │   ├── index.ts                         # Store configuration
│   │   │   ├── auth/                            # Authentication state
│   │   │   ├── transactions/                    # Transaction state
│   │   │   └── rewards/                         # Rewards state
│   │   ├── utils/                               # Utility functions
│   │   │   ├── constants.ts                     # App constants
│   │   │   ├── helpers.ts                       # Helper functions
│   │   │   └── validation.ts                    # Form validation
│   │   ├── hooks/                               # Custom React hooks
│   │   │   ├── useAuth.ts                       # Authentication hook
│   │   │   ├── useTransactions.ts               # Transaction hook
│   │   │   └── useRewards.ts                    # Rewards hook
│   │   └── types/                               # TypeScript type definitions
│   │       ├── index.ts                         # Type exports
│   │       ├── navigation.types.ts              # Navigation types
│   │       └── api.types.ts                     # API response types
│   └── __tests__/                               # Test files
│       ├── components/                          # Component tests
│       └── screens/                             # Screen tests
│
├── web-dashboard/                               # Next.js Web Dashboard
│   ├── package.json                             # Web app dependencies
│   ├── next.config.js                           # Next.js configuration
│   ├── tailwind.config.js                       # Tailwind CSS config
│   ├── tsconfig.json                            # TypeScript configuration
│   ├── public/                                  # Static assets
│   │   ├── images/                              # Image assets
│   │   └── icons/                               # Icon assets
│   ├── src/
│   │   ├── pages/                               # Next.js pages
│   │   │   ├── _app.tsx                         # App wrapper
│   │   │   ├── _document.tsx                    # Document wrapper
│   │   │   ├── index.tsx                        # Dashboard home page
│   │   │   ├── login.tsx                        # Login page
│   │   │   ├── transactions/                    # Transaction pages
│   │   │   │   ├── index.tsx                    # Transaction list
│   │   │   │   └── [id].tsx                     # Transaction detail
│   │   │   ├── cards/                           # Credit card pages
│   │   │   │   └── index.tsx                    # Card management
│   │   │   ├── rewards/                         # Rewards pages
│   │   │   │   └── index.tsx                    # Rewards overview
│   │   │   └── api/                             # Next.js API routes
│   │   │       ├── auth/                        # Authentication API
│   │   │       └── proxy/                       # Backend proxy routes
│   │   ├── components/                          # React components
│   │   │   ├── ui/                              # Reusable UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   └── Modal.tsx
│   │   │   ├── layout/                          # Layout components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── dashboard/                       # Dashboard components
│   │   │   │   ├── StatsCards.tsx
│   │   │   │   ├── SpendingChart.tsx
│   │   │   │   └── RecentTransactions.tsx
│   │   │   └── forms/                           # Form components
│   │   │       ├── TransactionForm.tsx
│   │   │       └── CreditCardForm.tsx
│   │   ├── lib/                                 # Utility libraries
│   │   │   ├── api.ts                           # API client
│   │   │   ├── auth.ts                          # Authentication utilities
│   │   │   └── utils.ts                         # General utilities
│   │   ├── hooks/                               # Custom React hooks
│   │   │   ├── useAuth.ts                       # Authentication hook
│   │   │   ├── useTransactions.ts               # Transaction hook
│   │   │   └── useApi.ts                        # API hook
│   │   ├── store/                               # State management
│   │   │   └── index.ts                         # Store configuration
│   │   ├── styles/                              # Global styles
│   │   │   └── globals.css                      # Global CSS
│   │   └── types/                               # TypeScript types
│   │       ├── index.ts                         # Type exports
│   │       └── api.types.ts                     # API types
│   └── __tests__/                               # Test files
│       ├── pages/                               # Page tests
│       └── components/                          # Component tests
│
├── shared/                                      # Shared Utilities and Types
│   ├── package.json                             # Shared package dependencies
│   ├── tsconfig.json                            # TypeScript configuration
│   └── src/
│       ├── types/                               # Shared type definitions
│       │   ├── user.types.ts                    # User types
│       │   ├── transaction.types.ts             # Transaction types
│       │   ├── creditCard.types.ts              # Credit card types
│       │   └── api.types.ts                     # API types
│       ├── utils/                               # Shared utilities
│       │   ├── validation.ts                    # Validation functions
│       │   ├── constants.ts                     # Shared constants
│       │   └── helpers.ts                       # Helper functions
│       └── config/                              # Shared configuration
│           └── api-endpoints.ts                 # API endpoint definitions
│
├── ml-services/                                 # Python Machine Learning Services
│   ├── requirements.txt                         # Python dependencies
│   ├── Dockerfile                               # ML services container
│   ├── src/
│   │   ├── main.py                              # FastAPI application entry point
│   │   ├── models/                              # ML models
│   │   │   ├── transaction_categorizer.py       # Transaction categorization
│   │   │   └── recommendation_engine.py         # Card recommendations
│   │   ├── services/                            # ML services
│   │   │   └── prediction.service.py            # Prediction service
│   │   └── utils/                               # ML utilities
│   │       └── data_preprocessing.py            # Data preprocessing
│   └── tests/                                   # ML service tests
│
├── infrastructure/                              # DevOps and Deployment
│   ├── docker/                                  # Docker configurations
│   │   ├── backend.Dockerfile                   # Backend container
│   │   ├── frontend.Dockerfile                  # Frontend container
│   │   └── nginx.conf                           # Nginx reverse proxy config
│   ├── kubernetes/                              # Kubernetes manifests (optional)
│   ├── terraform/                               # Infrastructure as code
│   └── scripts/                                 # Deployment scripts
│       ├── deploy.sh                            # Deployment script
│       ├── migrate.sh                           # Database migration script
│       └── seed.sh                              # Database seeding script
│
├── docs/                                        # Project Documentation
│   ├── API.md                                   # API documentation
│   ├── DEPLOYMENT.md                            # Deployment guide
│   ├── DATABASE_SCHEMA.md                       # Database schema documentation
│   ├── SMS_PARSING.md                           # SMS parsing guide
│   └── ARCHITECTURE.md                          # System architecture overview
│
└── tools/                                       # Development Tools
    ├── sms-simulator/                           # SMS simulation tool
    │   ├── package.json                         # Simulator dependencies
    │   └── src/
    │       └── simulator.ts                     # SMS simulation logic
    └── data-migration/                          # Data migration tools
        └── scripts/                             # Migration scripts
```

### 🏗️ Architecture Overview

The project follows a **microservices architecture** with clear separation of concerns:

- **Backend API**: Central Node.js/Express service handling all business logic
- **Mobile App**: React Native for cross-platform mobile experience
- **Web Dashboard**: Next.js for web-based management interface
- **ML Services**: Python FastAPI for AI/ML processing
- **Shared Package**: Common types and utilities across all services
- **Infrastructure**: Docker, Nginx, and deployment automation

### 🔧 Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Backend** | Node.js + Express + TypeScript | RESTful API with authentication |
| **Mobile** | React Native + TypeScript | Cross-platform mobile app |
| **Web** | Next.js + Tailwind CSS | Responsive web dashboard |
| **ML** | Python + FastAPI + scikit-learn | AI/ML processing |
| **Database** | PostgreSQL | Primary data storage |
| **Cache** | Redis | Session storage & job queues |
| **Container** | Docker + Docker Compose | Development & deployment |
| **Proxy** | Nginx | Reverse proxy & load balancing |

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Docker & Docker Compose
- React Native development environment

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd credit_card_optimizer
   npm install
   ```

2. **Environment setup:**
   
   **Option A: Using setup scripts (Recommended)**
   ```bash
   # Linux/Mac
   ./setup-env.sh
   
   # Windows PowerShell
   .\setup-env.ps1
   ```
   
   **Option B: Manual setup**
   ```bash
   cp env.example .env
   # Edit .env file with your configuration
   ```

3. **Start services with Docker Compose (Recommended):**
   ```bash
   # Start all services (PostgreSQL, Redis, Backend, Web Dashboard, ML Services, Nginx)
   docker-compose up -d
   
   # View logs
   docker-compose logs -f
   
   # Stop services
   docker-compose down
   ```

4. **Alternative: Start individual services:**
   ```bash
   # Start backend only
   cd backend && npm run dev
   
   # Start web dashboard only
   cd web-dashboard && npm run dev
   
   # Start mobile app only
   cd mobile-app && npm start
   ```

## 🔧 Environment Configuration

### Environment Variables

The project uses environment variables for all configuration. Key variables include:

- **Database**: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- **Redis**: `REDIS_HOST`, `REDIS_PORT`
- **JWT**: `JWT_SECRET`, `JWT_EXPIRES_IN`
- **Services**: `ML_SERVICE_URL`, `PAYMENT_GATEWAY_API_KEY`
- **Ports**: `PORT`, `WEB_DASHBOARD_PORT`, `ML_SERVICE_PORT`

### Docker Compose Features

- **Environment Variable Support**: All services use environment variables with sensible defaults
- **Health Checks**: Built-in health monitoring for PostgreSQL, Redis, Backend, and ML Services
- **Service Discovery**: Services automatically discover each other using Docker service names
- **Volume Persistence**: Database and Redis data persist across container restarts
- **Development Mode**: Hot-reload enabled for backend and web dashboard

### Service Ports

| Service | Default Port | Environment Variable |
|---------|-------------|---------------------|
| Backend API | 3001 | `PORT` |
| Web Dashboard | 3000 | `WEB_DASHBOARD_PORT` |
| ML Services | 8000 | `ML_SERVICE_PORT` |
| PostgreSQL | 5432 | `DB_PORT` |
| Redis | 6379 | `REDIS_PORT` |
| Nginx HTTP | 80 | `NGINX_HTTP_PORT` |
| Nginx HTTPS | 443 | `NGINX_HTTPS_PORT` |

## 📚 Documentation

- [API Documentation](./backend/docs/api.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [SMS Parsing Guide](./docs/SMS_PARSING.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)

## 🔍 Troubleshooting

### Common Issues

**Database Connection Error:**
```bash
# Ensure PostgreSQL is running
docker-compose up -d postgres

# Check database logs
docker-compose logs postgres
```

**Port Already in Use:**
```bash
# Change ports in .env file
PORT=3002
WEB_DASHBOARD_PORT=3001
```

**Environment Variables Not Loading:**
```bash
# Ensure .env file exists in project root
ls -la .env

# Restart Docker Compose
docker-compose down && docker-compose up -d
```

**Service Health Check Failures:**
```bash
# Check service status
docker-compose ps

# View service logs
docker-compose logs [service-name]
```

### Development Tips

- **Hot Reload**: Backend and web dashboard support hot reloading
- **Database Reset**: `docker-compose down -v && docker-compose up -d` to reset data
- **Logs**: Use `docker-compose logs -f [service]` for real-time logs
- **Shell Access**: `docker-compose exec [service] sh` to access container shell

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
